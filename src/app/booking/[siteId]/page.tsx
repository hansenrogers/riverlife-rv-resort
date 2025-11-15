'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';
import Link from 'next/link';
import { 
  User, Mail, Phone, Calendar, Users, Car, Info, 
  CreditCard, AlertCircle, CheckCircle, ChevronLeft, Loader2
} from 'lucide-react';
import { RVSite } from '@/types';
import { getSiteById, calculateBookingPrice, createBooking, checkSiteAvailability } from '@/lib/firebase/firestore';
import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// Form validation schema
const bookingSchema = z.object({
  // Guest Information
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  
  // RV Details (conditional)
  rvMake: z.string().optional(),
  rvModel: z.string().optional(),
  rvLength: z.number().optional(),
  rvLicensePlate: z.string().optional(),
  
  // Additional Info
  numberOfGuests: z.number().min(1, 'At least 1 guest required'),
  specialRequests: z.string().optional(),
  
  // Terms
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the terms and conditions',
  }),
  agreeToCancellation: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the cancellation policy',
  }),
});

type BookingFormData = z.infer<typeof bookingSchema>;

export default function BookingPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const siteId = params.siteId as string;

  const [site, setSite] = useState<RVSite | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [pricing, setPricing] = useState<any>(null);
  const [checkIn, setCheckIn] = useState(searchParams.get('checkIn') || '');
  const [checkOut, setCheckOut] = useState(searchParams.get('checkOut') || '');
  const [couponCode, setCouponCode] = useState(searchParams.get('coupon') || '');
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      numberOfGuests: 2,
      agreeToTerms: false,
      agreeToCancellation: false,
    },
  });

  const isRVSite = site?.type === 'rv';

  // Load site and check availability
  useEffect(() => {
    const loadSiteAndCheck = async () => {
      if (!checkIn || !checkOut) {
        router.push(`/sites/${siteId}`);
        return;
      }

      try {
        const siteData = await getSiteById(siteId);
        if (!siteData) {
          router.push('/sites');
          return;
        }
        setSite(siteData);

        // Check availability
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);
        const available = await checkSiteAvailability(siteId, checkInDate, checkOutDate);
        setIsAvailable(available);

        if (!available) {
          setError('This site is no longer available for your selected dates.');
          return;
        }

        // Calculate pricing
        const priceData = await calculateBookingPrice(
          siteId,
          checkInDate,
          checkOutDate,
          couponCode || undefined
        );
        setPricing(priceData);
      } catch (error) {
        console.error('Error loading booking page:', error);
        setError('Unable to load booking information. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadSiteAndCheck();
  }, [siteId, checkIn, checkOut, couponCode, router]);

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return nights > 0 ? nights : 0;
  };

  const onSubmit = async (data: BookingFormData) => {
    if (!site || !pricing || !isAvailable) {
      setError('Unable to process booking. Please try again.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);
      const nights = calculateNights();

      // Create booking in Firestore (status: pending)
      const bookingId = await createBooking({
        siteId: site.id,
        siteName: site.name,
        guestInfo: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          address: '', // Will be collected during checkout
          city: '',
          state: '',
          zipCode: '',
        },
        checkIn: checkInDate,
        checkOut: checkOutDate,
        numberOfNights: nights,
        numberOfGuests: data.numberOfGuests,
        rvDetails: isRVSite ? {
          make: data.rvMake || '',
          model: data.rvModel || '',
          length: data.rvLength || 0,
          licensePlate: data.rvLicensePlate || '',
        } : undefined,
        pricing: {
          subtotal: pricing.subtotal,
          discount: pricing.discount,
          tax: pricing.tax,
          total: pricing.total,
          depositAmount: pricing.depositAmount,
          remainingBalance: pricing.remainingBalance,
        },
        status: 'pending',
        paymentStatus: 'pending',
        couponCode: couponCode || undefined,
        specialRequests: data.specialRequests,
      });

      // Redirect to Stripe Checkout
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId,
          siteId: site.id,
          siteName: site.name,
          checkIn,
          checkOut,
          nights,
          depositAmount: pricing.depositAmount,
          guestEmail: data.email,
          guestName: `${data.firstName} ${data.lastName}`,
        }),
      });

      const session = await response.json();

      if (session.error) {
        throw new Error(session.error);
      }

      // Redirect to Stripe Checkout
      const stripe = await stripePromise;
      if (stripe) {
        const { error: stripeError } = await stripe.redirectToCheckout({
          sessionId: session.sessionId,
        });

        if (stripeError) {
          throw new Error(stripeError.message);
        }
      }
    } catch (error: any) {
      console.error('Error processing booking:', error);
      setError(error.message || 'Unable to process your booking. Please try again.');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-primary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-500 mx-auto mb-4"></div>
          <p className="text-primary-700 text-lg">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (!site || !isAvailable) {
    return (
      <div className="min-h-screen bg-primary-50 flex items-center justify-center">
        <div className="card max-w-md text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Unavailable</h2>
          <p className="text-gray-600 mb-6">
            {error || 'This site is not available for booking at this time.'}
          </p>
          <Link href={`/sites/${siteId}`} className="btn-primary inline-flex items-center gap-2">
            <ChevronLeft className="w-5 h-5" />
            Back to Site Details
          </Link>
        </div>
      </div>
    );
  }

  const nights = calculateNights();

  return (
    <div className="min-h-screen bg-primary-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <Link
            href={`/sites/${siteId}`}
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-800 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Site Details
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Page Title */}
          <div className="text-center mb-8">
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Complete Your Reservation
            </h1>
            <p className="text-gray-600">
              You're booking <span className="font-semibold text-primary-700">{site.name}</span>
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center font-semibold">
                1
              </div>
              <span className="text-sm font-medium text-gray-900">Guest Info</span>
            </div>
            <div className="w-12 h-0.5 bg-gray-300"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center font-semibold">
                2
              </div>
              <span className="text-sm font-medium text-gray-500">Payment</span>
            </div>
            <div className="w-12 h-0.5 bg-gray-300"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center font-semibold">
                3
              </div>
              <span className="text-sm font-medium text-gray-500">Confirmation</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form Section */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Guest Information */}
                <div className="card">
                  <div className="flex items-center gap-3 mb-6">
                    <User className="w-6 h-6 text-primary-600" />
                    <h2 className="font-serif text-2xl font-bold text-gray-900">
                      Guest Information
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name *
                      </label>
                      <input
                        type="text"
                        {...register('firstName')}
                        className={`input-field w-full ${errors.firstName ? 'border-red-500' : ''}`}
                        placeholder="John"
                      />
                      {errors.firstName && (
                        <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        {...register('lastName')}
                        className={`input-field w-full ${errors.lastName ? 'border-red-500' : ''}`}
                        placeholder="Doe"
                      />
                      {errors.lastName && (
                        <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          {...register('email')}
                          className={`input-field w-full pl-10 ${errors.email ? 'border-red-500' : ''}`}
                          placeholder="john.doe@example.com"
                        />
                      </div>
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="tel"
                          {...register('phone')}
                          className={`input-field w-full pl-10 ${errors.phone ? 'border-red-500' : ''}`}
                          placeholder="(555) 123-4567"
                        />
                      </div>
                      {errors.phone && (
                        <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Number of Guests *
                    </label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="number"
                        {...register('numberOfGuests', { valueAsNumber: true })}
                        min="1"
                        max={site.maxOccupancy}
                        className={`input-field w-full pl-10 ${errors.numberOfGuests ? 'border-red-500' : ''}`}
                      />
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Maximum: {site.maxOccupancy} guests
                    </p>
                    {errors.numberOfGuests && (
                      <p className="text-red-500 text-sm mt-1">{errors.numberOfGuests.message}</p>
                    )}
                  </div>
                </div>

                {/* RV Details (only for RV sites) */}
                {isRVSite && (
                  <div className="card">
                    <div className="flex items-center gap-3 mb-6">
                      <Car className="w-6 h-6 text-primary-600" />
                      <h2 className="font-serif text-2xl font-bold text-gray-900">
                        RV Details
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          RV Make
                        </label>
                        <input
                          type="text"
                          {...register('rvMake')}
                          className="input-field w-full"
                          placeholder="e.g., Winnebago"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          RV Model
                        </label>
                        <input
                          type="text"
                          {...register('rvModel')}
                          className="input-field w-full"
                          placeholder="e.g., Vista"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          RV Length (feet)
                        </label>
                        <input
                          type="number"
                          {...register('rvLength', { valueAsNumber: true })}
                          className="input-field w-full"
                          placeholder="e.g., 32"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          License Plate
                        </label>
                        <input
                          type="text"
                          {...register('rvLicensePlate')}
                          className="input-field w-full"
                          placeholder="e.g., ABC-1234"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Special Requests */}
                <div className="card">
                  <div className="flex items-center gap-3 mb-4">
                    <Info className="w-6 h-6 text-primary-600" />
                    <h2 className="font-serif text-2xl font-bold text-gray-900">
                      Special Requests
                    </h2>
                  </div>

                  <textarea
                    {...register('specialRequests')}
                    rows={4}
                    className="input-field w-full resize-none"
                    placeholder="Any special requests or information we should know? (Optional)"
                  ></textarea>
                  <p className="text-sm text-gray-500 mt-1">
                    Special requests are not guaranteed but we'll do our best to accommodate.
                  </p>
                </div>

                {/* Terms & Conditions */}
                <div className="card">
                  <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">
                    Terms & Conditions
                  </h2>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        {...register('agreeToTerms')}
                        id="agreeToTerms"
                        className="mt-1 w-4 h-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <label htmlFor="agreeToTerms" className="text-sm text-gray-700">
                        I agree to the{' '}
                        <Link href="/terms" target="_blank" className="text-primary-600 hover:underline">
                          Terms and Conditions
                        </Link>{' '}
                        and understand that my booking requires approval from River Life RV Resort.
                      </label>
                    </div>
                    {errors.agreeToTerms && (
                      <p className="text-red-500 text-sm">{errors.agreeToTerms.message}</p>
                    )}

                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        {...register('agreeToCancellation')}
                        id="agreeToCancellation"
                        className="mt-1 w-4 h-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <label htmlFor="agreeToCancellation" className="text-sm text-gray-700">
                        I understand the{' '}
                        <Link href="/cancellation" target="_blank" className="text-primary-600 hover:underline">
                          Cancellation Policy
                        </Link>
                        : Full refund if cancelled 7+ days before check-in. 50% refund if cancelled 3-7 days before. No refund within 3 days of check-in.
                      </label>
                    </div>
                    {errors.agreeToCancellation && (
                      <p className="text-red-500 text-sm">{errors.agreeToCancellation.message}</p>
                    )}
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-red-800">{error}</p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary w-full flex items-center justify-center gap-2 text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-6 h-6" />
                      Proceed to Payment
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Booking Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="card sticky top-4">
                <h3 className="font-serif text-xl font-bold text-gray-900 mb-4">
                  Booking Summary
                </h3>

                {/* Site Image */}
                {site.images && site.images.length > 0 && (
                  <div className="relative h-48 rounded-lg overflow-hidden mb-4">
                    <Image
                      src={site.images[0]}
                      alt={site.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                {/* Site Info */}
                <div className="mb-4 pb-4 border-b border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-1">{site.name}</h4>
                  <p className="text-sm text-gray-600">Site #{site.siteNumber}</p>
                </div>

                {/* Dates */}
                <div className="space-y-2 mb-4 pb-4 border-b border-gray-200">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">Check-in:</span>
                    <span className="font-medium text-gray-900">
                      {new Date(checkIn).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">Check-out:</span>
                    <span className="font-medium text-gray-900">
                      {new Date(checkOut).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium text-gray-900">
                      {nights} night{nights !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>

                {/* Price Breakdown */}
                {pricing && (
                  <div className="space-y-2 mb-4 pb-4 border-b border-gray-200">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">${site.basePrice} × {nights} nights</span>
                      <span className="text-gray-900">${pricing.subtotal.toFixed(2)}</span>
                    </div>
                    
                    {pricing.discount > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>{pricing.discountReason}</span>
                        <span>-${pricing.discount.toFixed(2)}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tax</span>
                      <span className="text-gray-900">${pricing.tax.toFixed(2)}</span>
                    </div>
                  </div>
                )}

                {/* Total */}
                {pricing && (
                  <div className="space-y-3">
                    <div className="flex justify-between items-baseline">
                      <span className="font-bold text-gray-900">Total</span>
                      <span className="text-2xl font-bold text-gray-900">
                        ${pricing.total.toFixed(2)}
                      </span>
                    </div>

                    <div className="bg-primary-50 rounded-lg p-3 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-gray-700">Deposit Due Now</span>
                        <span className="font-bold text-primary-700">
                          ${pricing.depositAmount.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Due at Check-in</span>
                        <span className="text-gray-900">
                          ${pricing.remainingBalance.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <div className="flex gap-2">
                        <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-blue-900">
                          Your booking requires approval. You'll receive confirmation within 24 hours.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

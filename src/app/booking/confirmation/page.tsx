'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Calendar, Mail, Phone, MapPin, Loader2, XCircle } from 'lucide-react';

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get('session_id');
  const bookingId = searchParams.get('booking_id');

  const [loading, setLoading] = useState(true);
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId || !bookingId) {
        setError('Missing payment information');
        setLoading(false);
        return;
      }

      try {
        // Verify payment with backend
        const response = await fetch('/api/verify-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ sessionId, bookingId }),
        });

        const data = await response.json();

        if (data.error) {
          throw new Error(data.error);
        }

        setBookingDetails(data.booking);
      } catch (error: any) {
        console.error('Error verifying payment:', error);
        setError(error.message || 'Unable to verify payment');
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [sessionId, bookingId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-primary-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-primary-500 animate-spin mx-auto mb-4" />
          <p className="text-primary-700 text-lg">Confirming your booking...</p>
        </div>
      </div>
    );
  }

  if (error || !bookingDetails) {
    return (
      <div className="min-h-screen bg-primary-50 flex items-center justify-center">
        <div className="card max-w-md text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Error</h2>
          <p className="text-gray-600 mb-6">
            {error || 'Unable to confirm your booking. Please contact us for assistance.'}
          </p>
          <div className="flex flex-col gap-3">
            <Link href="/" className="btn-primary">
              Return to Homepage
            </Link>
            <Link href="/contact" className="btn-secondary">
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const checkInDate = new Date(bookingDetails.checkIn);
  const checkOutDate = new Date(bookingDetails.checkOut);

  return (
    <div className="min-h-screen bg-primary-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Booking Submitted Successfully!
            </h1>
            <p className="text-lg text-gray-600">
              Your reservation is pending approval
            </p>
          </div>

          {/* Booking Details Card */}
          <div className="card mb-6">
            <div className="border-b border-gray-200 pb-4 mb-4">
              <h2 className="font-serif text-2xl font-bold text-gray-900 mb-2">
                Booking Details
              </h2>
              <p className="text-sm text-gray-600">
                Confirmation ID: <span className="font-mono font-semibold text-gray-900">{bookingId}</span>
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Site Information */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary-600" />
                  Site Information
                </h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-600">Site Name:</span>
                    <br />
                    <span className="font-medium text-gray-900">{bookingDetails.siteName}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Site Number:</span>
                    <br />
                    <span className="font-medium text-gray-900">#{bookingDetails.siteNumber || 'TBD'}</span>
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary-600" />
                  Reservation Dates
                </h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-600">Check-in:</span>
                    <br />
                    <span className="font-medium text-gray-900">
                      {checkInDate.toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Check-out:</span>
                    <br />
                    <span className="font-medium text-gray-900">
                      {checkOutDate.toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Duration:</span>
                    <br />
                    <span className="font-medium text-gray-900">
                      {bookingDetails.numberOfNights} night{bookingDetails.numberOfNights !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              </div>

              {/* Guest Information */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-primary-600" />
                  Guest Information
                </h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-600">Name:</span>
                    <br />
                    <span className="font-medium text-gray-900">
                      {bookingDetails.guestInfo.firstName} {bookingDetails.guestInfo.lastName}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Email:</span>
                    <br />
                    <span className="font-medium text-gray-900">{bookingDetails.guestInfo.email}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Phone:</span>
                    <br />
                    <span className="font-medium text-gray-900">{bookingDetails.guestInfo.phone}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Guests:</span>
                    <br />
                    <span className="font-medium text-gray-900">{bookingDetails.numberOfGuests}</span>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Payment Summary
                </h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-600">Total Amount:</span>
                    <br />
                    <span className="font-medium text-gray-900">
                      ${bookingDetails.pricing.total.toFixed(2)}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Deposit Paid:</span>
                    <br />
                    <span className="font-medium text-green-600">
                      ${bookingDetails.pricing.depositAmount.toFixed(2)}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Balance Due at Check-in:</span>
                    <br />
                    <span className="font-medium text-gray-900">
                      ${bookingDetails.pricing.remainingBalance.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Special Requests */}
            {bookingDetails.specialRequests && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2">Special Requests</h3>
                <p className="text-sm text-gray-700">{bookingDetails.specialRequests}</p>
              </div>
            )}
          </div>

          {/* What's Next */}
          <div className="card bg-blue-50 border-2 border-blue-200 mb-6">
            <h3 className="font-serif text-xl font-bold text-gray-900 mb-4">
              What Happens Next?
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xs">
                  1
                </div>
                <div>
                  <p className="font-medium text-gray-900">Confirmation Email</p>
                  <p className="text-gray-600">
                    We've sent a confirmation email to {bookingDetails.guestInfo.email} with your booking details.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xs">
                  2
                </div>
                <div>
                  <p className="font-medium text-gray-900">Review & Approval</p>
                  <p className="text-gray-600">
                    Our team will review your booking and send you a confirmation within 24 hours.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xs">
                  3
                </div>
                <div>
                  <p className="font-medium text-gray-900">Final Payment</p>
                  <p className="text-gray-600">
                    The remaining balance of ${bookingDetails.pricing.remainingBalance.toFixed(2)} is due upon check-in.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xs">
                  4
                </div>
                <div>
                  <p className="font-medium text-gray-900">Enjoy Your Stay!</p>
                  <p className="text-gray-600">
                    Check-in time is 3:00 PM. We look forward to welcoming you to River Life RV Resort!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row gap-4">
            <Link href="/" className="btn-primary flex-1 text-center">
              Return to Homepage
            </Link>
            <Link href="/sites" className="btn-secondary flex-1 text-center">
              Book Another Site
            </Link>
          </div>

          {/* Contact Info */}
          <div className="text-center mt-8 text-sm text-gray-600">
            <p className="mb-2">Questions about your booking?</p>
            <div className="flex items-center justify-center gap-4">
              <a href="mailto:reservations@riverlifervresort.com" className="text-primary-600 hover:underline flex items-center gap-1">
                <Mail className="w-4 h-4" />
                Email Us
              </a>
              <span>•</span>
              <a href="tel:+14235550123" className="text-primary-600 hover:underline flex items-center gap-1">
                <Phone className="w-4 h-4" />
                (423) 555-0123
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-accent animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Loading confirmation...</p>
        </div>
      </div>
    }>
      <ConfirmationContent />
    </Suspense>
  );
}

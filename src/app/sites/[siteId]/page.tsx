'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  MapPin, Wifi, Zap, Droplet, Users, Calendar, DollarSign, 
  ChevronLeft, ChevronRight, Check, X, Info, ArrowRight 
} from 'lucide-react';
import { RVSite } from '@/types';
import { getSiteById, checkSiteAvailability, calculateBookingPrice } from '@/lib/firebase/firestore';

export default function SiteDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const siteId = params.siteId as string;

  const [site, setSite] = useState<RVSite | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [checkIn, setCheckIn] = useState(searchParams.get('checkIn') || '');
  const [checkOut, setCheckOut] = useState(searchParams.get('checkOut') || '');
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [pricing, setPricing] = useState<any>(null);
  const [couponCode, setCouponCode] = useState('');
  const [checkingAvailability, setCheckingAvailability] = useState(false);

  // Load site details
  useEffect(() => {
    const loadSite = async () => {
      try {
        const siteData = await getSiteById(siteId);
        if (!siteData) {
          router.push('/sites');
          return;
        }
        setSite(siteData);
      } catch (error) {
        console.error('Error loading site:', error);
        router.push('/sites');
      } finally {
        setLoading(false);
      }
    };

    loadSite();
  }, [siteId, router]);

  // Check availability and calculate pricing
  useEffect(() => {
    const checkAndCalculate = async () => {
      if (!site || !checkIn || !checkOut) {
        setIsAvailable(null);
        setPricing(null);
        return;
      }

      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);

      if (checkOutDate <= checkInDate) {
        return;
      }

      setCheckingAvailability(true);
      try {
        // Check availability
        const available = await checkSiteAvailability(site.id, checkInDate, checkOutDate);
        setIsAvailable(available);

        if (available) {
          // Calculate pricing
          const priceData = await calculateBookingPrice(
            site.id,
            checkInDate,
            checkOutDate,
            couponCode || undefined
          );
          setPricing(priceData);
        } else {
          setPricing(null);
        }
      } catch (error) {
        console.error('Error checking availability:', error);
      } finally {
        setCheckingAvailability(false);
      }
    };

    checkAndCalculate();
  }, [site, checkIn, checkOut, couponCode]);

  const handlePreviousImage = () => {
    if (site && site.images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? site.images.length - 1 : prev - 1
      );
    }
  };

  const handleNextImage = () => {
    if (site && site.images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === site.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const handleBookNow = () => {
    if (!checkIn || !checkOut || !isAvailable) {
      return;
    }

    // Navigate to booking page with parameters
    const bookingUrl = `/booking/${siteId}?checkIn=${checkIn}&checkOut=${checkOut}${couponCode ? `&coupon=${couponCode}` : ''}`;
    router.push(bookingUrl);
  };

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return nights > 0 ? nights : 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-primary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-500 mx-auto mb-4"></div>
          <p className="text-primary-700 text-lg">Loading site details...</p>
        </div>
      </div>
    );
  }

  if (!site) {
    return null;
  }

  const nights = calculateNights();

  return (
    <div className="min-h-screen bg-primary-50">
      {/* Back Button */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <Link
            href="/sites"
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-800 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to All Sites
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <div className="card p-0 overflow-hidden">
              <div className="relative h-96 md:h-[500px] bg-gray-200">
                {site.images && site.images.length > 0 ? (
                  <>
                    <Image
                      src={site.images[currentImageIndex]}
                      alt={`${site.name} - Image ${currentImageIndex + 1}`}
                      fill
                      className="object-cover"
                    />
                    
                    {/* Navigation Arrows */}
                    {site.images.length > 1 && (
                      <>
                        <button
                          onClick={handlePreviousImage}
                          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all"
                          aria-label="Previous image"
                        >
                          <ChevronLeft className="w-6 h-6 text-gray-800" />
                        </button>
                        <button
                          onClick={handleNextImage}
                          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all"
                          aria-label="Next image"
                        >
                          <ChevronRight className="w-6 h-6 text-gray-800" />
                        </button>
                      </>
                    )}

                    {/* Image Counter */}
                    <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                      {currentImageIndex + 1} / {site.images.length}
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-400 to-primary-600">
                    <MapPin className="w-24 h-24 text-white opacity-50" />
                  </div>
                )}
              </div>

              {/* Thumbnail Strip */}
              {site.images && site.images.length > 1 && (
                <div className="p-4 bg-gray-50 overflow-x-auto">
                  <div className="flex gap-2">
                    {site.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                          index === currentImageIndex
                            ? 'border-primary-500 scale-105'
                            : 'border-transparent hover:border-primary-300'
                        }`}
                      >
                        <Image
                          src={image}
                          alt={`Thumbnail ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Site Info */}
            <div className="card">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="inline-block bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium mb-2">
                    Site {site.siteNumber}
                  </div>
                  <h1 className="font-serif text-3xl md:text-4xl font-bold text-gray-900">
                    {site.name}
                  </h1>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary-700">
                    ${site.basePrice}
                  </div>
                  <div className="text-gray-500">per night</div>
                </div>
              </div>

              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                {site.description}
              </p>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-primary-50 rounded-lg">
                <div className="text-center">
                  <Users className="w-6 h-6 text-primary-600 mx-auto mb-1" />
                  <div className="text-sm text-gray-600">Max Guests</div>
                  <div className="font-bold text-gray-900">{site.maxOccupancy}</div>
                </div>
                <div className="text-center">
                  <MapPin className="w-6 h-6 text-primary-600 mx-auto mb-1" />
                  <div className="text-sm text-gray-600">Site Type</div>
                  <div className="font-bold text-gray-900 capitalize">{site.type}</div>
                </div>
                <div className="text-center">
                  <Zap className="w-6 h-6 text-primary-600 mx-auto mb-1" />
                  <div className="text-sm text-gray-600">Hookups</div>
                  <div className="font-bold text-gray-900">Full</div>
                </div>
                <div className="text-center">
                  <Calendar className="w-6 h-6 text-primary-600 mx-auto mb-1" />
                  <div className="text-sm text-gray-600">Status</div>
                  <div className={`font-bold ${site.status === 'active' ? 'text-green-600' : 'text-gray-600'}`}>
                    {site.status === 'active' ? 'Available' : 'Inactive'}
                  </div>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="card">
              <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">
                Features & Highlights
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {site.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Amenities */}
            <div className="card">
              <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">
                Amenities & Services
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {site.amenities.map((amenity, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    {amenity.toLowerCase().includes('wifi') && <Wifi className="w-5 h-5 text-primary-600" />}
                    {amenity.toLowerCase().includes('electric') && <Zap className="w-5 h-5 text-primary-600" />}
                    {(amenity.toLowerCase().includes('water') || amenity.toLowerCase().includes('sewer')) && <Droplet className="w-5 h-5 text-primary-600" />}
                    <span className="text-gray-700 font-medium">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Booking Sidebar - Right Column */}
          <div className="lg:col-span-1">
            <div className="card sticky top-4">
              <h3 className="font-serif text-2xl font-bold text-gray-900 mb-6">
                Check Availability
              </h3>

              {/* Date Inputs */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Check-In Date
                  </label>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="input-field w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Check-Out Date
                  </label>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    min={checkIn || new Date().toISOString().split('T')[0]}
                    className="input-field w-full"
                  />
                </div>

                {nights > 0 && (
                  <div className="text-center p-3 bg-primary-50 rounded-lg">
                    <span className="text-primary-700 font-medium">
                      {nights} night{nights !== 1 ? 's' : ''}
                    </span>
                  </div>
                )}
              </div>

              {/* Availability Status */}
              {checkIn && checkOut && (
                <div className="mb-6">
                  {checkingAvailability ? (
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500 mx-auto mb-2"></div>
                      <p className="text-sm text-gray-600">Checking availability...</p>
                    </div>
                  ) : isAvailable !== null && (
                    <div className={`p-4 rounded-lg ${
                      isAvailable 
                        ? 'bg-green-50 border border-green-200' 
                        : 'bg-red-50 border border-red-200'
                    }`}>
                      <div className="flex items-center gap-2 mb-2">
                        {isAvailable ? (
                          <>
                            <Check className="w-5 h-5 text-green-600" />
                            <span className="font-medium text-green-900">Available</span>
                          </>
                        ) : (
                          <>
                            <X className="w-5 h-5 text-red-600" />
                            <span className="font-medium text-red-900">Not Available</span>
                          </>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        {isAvailable 
                          ? 'This site is available for your selected dates!'
                          : 'This site is already booked for your selected dates. Please try different dates.'
                        }
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Coupon Code */}
              {isAvailable && pricing && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Coupon Code (optional)
                  </label>
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Enter code"
                    className="input-field w-full"
                  />
                </div>
              )}

              {/* Price Breakdown */}
              {pricing && isAvailable && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg space-y-2">
                  <div className="flex justify-between text-gray-700">
                    <span>${site.basePrice} × {nights} nights</span>
                    <span>${pricing.subtotal.toFixed(2)}</span>
                  </div>
                  
                  {pricing.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span className="text-sm">{pricing.discountReason}</span>
                      <span>-${pricing.discount.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-gray-700">
                    <span>Tax</span>
                    <span>${pricing.tax.toFixed(2)}</span>
                  </div>
                  
                  <div className="border-t border-gray-300 pt-2 mt-2">
                    <div className="flex justify-between font-bold text-gray-900 text-lg">
                      <span>Total</span>
                      <span>${pricing.total.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-300 pt-2 mt-2 space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Deposit (to reserve)</span>
                      <span className="font-semibold text-primary-700">
                        ${pricing.depositAmount.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Due at arrival</span>
                      <span>${pricing.remainingBalance.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Book Now Button */}
              <button
                onClick={handleBookNow}
                disabled={!checkIn || !checkOut || !isAvailable || checkingAvailability}
                className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {!checkIn || !checkOut ? (
                  <>
                    <Calendar className="w-5 h-5" />
                    Select Dates to Book
                  </>
                ) : checkingAvailability ? (
                  'Checking...'
                ) : !isAvailable ? (
                  'Not Available'
                ) : (
                  <>
                    <DollarSign className="w-5 h-5" />
                    Reserve Now
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              {/* Info Note */}
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex gap-2">
                  <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-900">
                    Your booking requires approval from our team. You'll receive confirmation within 24 hours.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

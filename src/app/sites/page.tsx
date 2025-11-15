'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, MapPin, Wifi, Zap, Droplet, Users, ChevronRight, Filter, X } from 'lucide-react';
import { RVSite } from '@/types';
import { getActiveSites, checkSiteAvailability } from '@/lib/firebase/firestore';

export default function SitesPage() {
  const [sites, setSites] = useState<RVSite[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [availabilityMap, setAvailabilityMap] = useState<Record<string, boolean>>({});

  // Load sites
  useEffect(() => {
    const loadSites = async () => {
      try {
        const activeSites = await getActiveSites();
        setSites(activeSites);
      } catch (error) {
        console.error('Error loading sites:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSites();
  }, []);

  // Check availability when dates change
  useEffect(() => {
    const checkAvailability = async () => {
      if (!checkIn || !checkOut) {
        setAvailabilityMap({});
        return;
      }

      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);

      if (checkOutDate <= checkInDate) {
        return;
      }

      const availabilityPromises = sites.map(async (site) => {
        const isAvailable = await checkSiteAvailability(site.id, checkInDate, checkOutDate);
        return { siteId: site.id, isAvailable };
      });

      const results = await Promise.all(availabilityPromises);
      const newAvailabilityMap: Record<string, boolean> = {};
      results.forEach(({ siteId, isAvailable }) => {
        newAvailabilityMap[siteId] = isAvailable;
      });

      setAvailabilityMap(newAvailabilityMap);
    };

    checkAvailability();
  }, [checkIn, checkOut, sites]);

  const clearFilters = () => {
    setCheckIn('');
    setCheckOut('');
    setAvailabilityMap({});
  };

  const filteredSites = Object.keys(availabilityMap).length > 0
    ? sites.filter(site => availabilityMap[site.id])
    : sites;

  if (loading) {
    return (
      <div className="min-h-screen bg-primary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-500 mx-auto mb-4"></div>
          <p className="text-primary-700 text-lg">Loading available sites...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
            Our RV Sites
          </h1>
          <p className="text-xl text-primary-100 max-w-2xl">
            Choose your perfect riverside retreat. All sites feature full hookups, 
            stunning Tennessee River views, and easy access to Chattanooga attractions.
          </p>
        </div>
      </section>

      {/* Filters Section */}
      <section className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors md:hidden"
            >
              <Filter className="w-5 h-5" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>

            <div className={`${showFilters ? 'flex' : 'hidden'} md:flex flex-col md:flex-row gap-4 w-full md:w-auto`}>
              <div className="flex-1 md:flex-initial">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Check-In
                </label>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="input-field w-full"
                />
              </div>

              <div className="flex-1 md:flex-initial">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Check-Out
                </label>
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  min={checkIn || new Date().toISOString().split('T')[0]}
                  className="input-field w-full"
                />
              </div>

              {(checkIn || checkOut) && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 self-end"
                >
                  <X className="w-5 h-5" />
                  Clear
                </button>
              )}
            </div>

            <div className="text-sm text-gray-600">
              {Object.keys(availabilityMap).length > 0 ? (
                <span className="font-medium text-primary-700">
                  {filteredSites.length} of {sites.length} sites available
                </span>
              ) : (
                <span>
                  Showing all {sites.length} sites
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Sites Grid */}
      <section className="container mx-auto px-4 py-12">
        {filteredSites.length === 0 ? (
          <div className="text-center py-16">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-700 mb-2">
              No sites available for selected dates
            </h3>
            <p className="text-gray-600 mb-6">
              Try different dates or clear filters to see all sites
            </p>
            <button
              onClick={clearFilters}
              className="btn-primary"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredSites.map((site) => (
              <SiteCard
                key={site.id}
                site={site}
                isAvailable={availabilityMap[site.id]}
                checkIn={checkIn}
                checkOut={checkOut}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

// Site Card Component
function SiteCard({ 
  site, 
  isAvailable,
  checkIn,
  checkOut 
}: { 
  site: RVSite; 
  isAvailable?: boolean;
  checkIn: string;
  checkOut: string;
}) {
  const amenityIcons = {
    wifi: Wifi,
    electric: Zap,
    water: Droplet,
    sewer: Droplet,
  };

  const bookingUrl = checkIn && checkOut 
    ? `/sites/${site.id}?checkIn=${checkIn}&checkOut=${checkOut}`
    : `/sites/${site.id}`;

  return (
    <div className="card group hover:shadow-2xl transition-all duration-300">
      {/* Image */}
      <div className="relative h-64 bg-gray-200 rounded-t-lg overflow-hidden">
        {site.images && site.images.length > 0 ? (
          <Image
            src={site.images[0]}
            alt={site.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-400 to-primary-600">
            <MapPin className="w-16 h-16 text-white opacity-50" />
          </div>
        )}

        {/* Availability Badge */}
        {isAvailable !== undefined && (
          <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-medium ${
            isAvailable 
              ? 'bg-green-500 text-white' 
              : 'bg-red-500 text-white'
          }`}>
            {isAvailable ? 'Available' : 'Booked'}
          </div>
        )}

        {/* Site Number Badge */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
          <span className="font-bold text-primary-700">
            Site {site.siteNumber}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="font-serif text-2xl font-bold text-gray-900 mb-2">
          {site.name}
        </h3>
        
        <p className="text-gray-600 mb-4 line-clamp-2">
          {site.description}
        </p>

        {/* Features */}
        <div className="flex flex-wrap gap-2 mb-4">
          {site.features.slice(0, 3).map((feature, index) => (
            <span
              key={index}
              className="text-xs bg-primary-100 text-primary-700 px-3 py-1 rounded-full"
            >
              {feature}
            </span>
          ))}
          {site.features.length > 3 && (
            <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
              +{site.features.length - 3} more
            </span>
          )}
        </div>

        {/* Amenities Icons */}
        <div className="flex gap-3 mb-4">
          {site.amenities.slice(0, 4).map((amenity, index) => {
            const Icon = amenityIcons[amenity.toLowerCase() as keyof typeof amenityIcons] || Users;
            return (
              <div
                key={index}
                className="flex items-center justify-center w-10 h-10 bg-primary-50 rounded-lg"
                title={amenity}
              >
                <Icon className="w-5 h-5 text-primary-600" />
              </div>
            );
          })}
        </div>

        {/* Capacity & Price */}
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
          <div className="flex items-center gap-2 text-gray-600">
            <Users className="w-5 h-5" />
            <span className="text-sm">Up to {site.maxOccupancy} guests</span>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold text-primary-700">
              ${site.basePrice}
            </span>
            <span className="text-gray-500 text-sm">/night</span>
          </div>
        </div>

        {/* CTA Button */}
        <Link
          href={bookingUrl}
          className="btn-primary w-full flex items-center justify-center gap-2 group"
        >
          View Details & Book
          <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { collection, addDoc, doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

const sampleSites = [
  {
    siteNumber: 1,
    name: 'Riverside Haven',
    type: 'rv',
    description: 'Premium waterfront site with stunning river views. Perfect for families who want direct access to the Tennessee River.',
    basePrice: 75,
    maxOccupancy: 6,
    status: 'active',
    amenities: ['Full Hookup', 'Water', 'Electric (50 amp)', 'Sewer', 'WiFi', 'Picnic Table', 'Fire Ring'],
    features: ['River View', 'Waterfront', 'Level Pad', 'Shade Trees'],
    images: ['https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?q=80&w=2070'],
  },
  {
    siteNumber: 2,
    name: 'Mountain View Retreat',
    type: 'rv',
    description: 'Elevated site offering spectacular mountain vistas and sunrise views.',
    basePrice: 70,
    maxOccupancy: 4,
    status: 'active',
    amenities: ['Full Hookup', 'Water', 'Electric (30/50 amp)', 'Sewer', 'WiFi', 'Picnic Table'],
    features: ['Mountain View', 'Sunrise Views', 'Privacy', 'Level Pad'],
    images: ['https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?q=80&w=2070'],
  },
  {
    siteNumber: 3,
    name: 'Sunset Point',
    type: 'rv',
    description: 'The perfect spot for capturing those incredible Tennessee sunsets.',
    basePrice: 80,
    maxOccupancy: 6,
    status: 'active',
    amenities: ['Full Hookup', 'Water', 'Electric (50 amp)', 'Sewer', 'WiFi', 'Picnic Table', 'Fire Ring', 'BBQ Grill'],
    features: ['Sunset Views', 'River View', 'Extra Wide Pad', 'Premium Location'],
    images: ['https://images.unsplash.com/photo-1508873696983-2dfd5898f08b?q=80&w=2070'],
  },
  {
    siteNumber: 4,
    name: 'Riverside Escape',
    type: 'rv',
    description: 'Quiet riverside location perfect for relaxation. Easy river access for kayaking and fishing.',
    basePrice: 70,
    maxOccupancy: 4,
    status: 'active',
    amenities: ['Full Hookup', 'Water', 'Electric (30 amp)', 'Sewer', 'WiFi', 'Picnic Table', 'Fire Ring'],
    features: ['River Access', 'Shaded', 'Fishing Spot', 'Kayak Launch'],
    images: ['https://images.unsplash.com/photo-1533873984035-25970ab07461?q=80&w=2053'],
  },
  {
    siteNumber: 5,
    name: 'Eagle\'s Nest',
    type: 'rv',
    description: 'Highest elevation site with panoramic views of both river and mountains.',
    basePrice: 85,
    maxOccupancy: 6,
    status: 'active',
    amenities: ['Full Hookup', 'Water', 'Electric (50 amp)', 'Sewer', 'WiFi', 'Picnic Table', 'Fire Ring', 'BBQ Grill'],
    features: ['Panoramic Views', 'River & Mountain Views', 'Premium Site', 'Wildlife Viewing'],
    images: ['https://images.unsplash.com/photo-1525811902-f2342640856e?q=80&w=2071'],
  },
  {
    siteNumber: 6,
    name: 'Creekside Retreat',
    type: 'rv',
    description: 'Peaceful site next to a gentle creek. The soothing sounds of flowing water.',
    basePrice: 65,
    maxOccupancy: 4,
    status: 'active',
    amenities: ['Full Hookup', 'Water', 'Electric (30 amp)', 'Sewer', 'WiFi', 'Picnic Table'],
    features: ['Creek Side', 'Natural Sounds', 'Shaded', 'Level Pad'],
    images: ['https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=2070'],
  },
  {
    siteNumber: 7,
    name: 'River Bend',
    type: 'rv',
    description: 'Located at a scenic bend in the river. Great fishing spot.',
    basePrice: 75,
    maxOccupancy: 6,
    status: 'active',
    amenities: ['Full Hookup', 'Water', 'Electric (50 amp)', 'Sewer', 'WiFi', 'Picnic Table', 'Fire Ring'],
    features: ['River View', 'Fishing Access', 'Scenic Location', 'Wide Pad'],
    images: ['https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070'],
  },
  {
    siteNumber: 8,
    name: 'Shady Grove',
    type: 'rv',
    description: 'Large site with mature shade trees. Perfect for hot summer days.',
    basePrice: 70,
    maxOccupancy: 6,
    status: 'active',
    amenities: ['Full Hookup', 'Water', 'Electric (30/50 amp)', 'Sewer', 'WiFi', 'Picnic Table', 'Fire Ring'],
    features: ['Large Site', 'Mature Trees', 'Shaded', 'Family Friendly'],
    images: ['https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2071'],
  },
  {
    siteNumber: 9,
    name: 'Riverside Bluff',
    type: 'rv',
    description: 'Elevated riverfront site with commanding views. Our most popular site!',
    basePrice: 85,
    maxOccupancy: 6,
    status: 'active',
    amenities: ['Full Hookup', 'Water', 'Electric (50 amp)', 'Sewer', 'WiFi', 'Picnic Table', 'Fire Ring', 'BBQ Grill'],
    features: ['Elevated View', 'River View', 'Premium Site', 'Best Views'],
    images: ['https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=2070'],
  },
];

export default function SetupPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const addSampleData = async () => {
    setLoading(true);
    setMessage('');
    setError('');

    try {
      // Add sites
      setMessage('Adding sites to Firestore...');
      let addedCount = 0;

      for (const site of sampleSites) {
        const siteData = {
          ...site,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        await addDoc(collection(db, 'sites'), siteData);
        addedCount++;
        setMessage(`Added ${addedCount} of ${sampleSites.length} sites...`);
      }

      // Add settings
      setMessage('Adding booking settings...');
      await setDoc(doc(db, 'settings', 'settings'), {
        taxRate: 9.25,
        depositPercentage: 50,
        checkInTime: '14:00',
        checkOutTime: '11:00',
        cancellationPolicy: 'Full refund if cancelled 7 days before check-in. 50% refund if cancelled 3-7 days before check-in. No refund within 3 days of check-in.',
        minimumStay: 2,
        maxAdvanceBookingDays: 365,
      });

      setMessage(`✅ Success! Added all ${sampleSites.length} sites and settings to Firestore!`);
      setError('');
    } catch (err: any) {
      console.error('Error adding data:', err);
      setError(`❌ Error: ${err.message}`);
      setMessage('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Database Setup</h1>

        <div className="bg-gray-800 rounded-lg p-8 mb-6">
          <h2 className="text-2xl font-bold mb-4">Add Sample Data</h2>
          <p className="text-gray-300 mb-6">
            This will add 9 sample RV sites and booking settings to your Firestore database.
            Click the button below to populate your database with test data.
          </p>

          <button
            onClick={addSampleData}
            disabled={loading}
            className="bg-accent text-gray-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {loading ? 'Adding Data...' : 'Add Sample Sites & Settings'}
          </button>

          {message && (
            <div className="mt-6 p-4 bg-green-900/30 border border-green-500 rounded-lg">
              <p className="text-green-300">{message}</p>
            </div>
          )}

          {error && (
            <div className="mt-6 p-4 bg-red-900/30 border border-red-500 rounded-lg">
              <p className="text-red-300">{error}</p>
            </div>
          )}

          {message.includes('Success') && (
            <div className="mt-6 p-6 bg-blue-900/30 border border-blue-500 rounded-lg">
              <h3 className="font-bold text-xl mb-3">✨ Next Steps:</h3>
              <ol className="list-decimal list-inside space-y-2 text-gray-300">
                <li>Visit <a href="/sites" className="text-accent hover:underline">/sites</a> to see all available sites</li>
                <li>Click on any site to view details and try the booking flow</li>
                <li>Go to <a href="https://console.firebase.google.com/project/riverlife-rv-resort/firestore" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Firebase Console</a> to view/edit the data</li>
              </ol>
            </div>
          )}
        </div>

        <div className="bg-gray-800 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-4">What gets added:</h2>
          <div className="space-y-4 text-gray-300">
            <div>
              <h3 className="font-bold text-white mb-2">9 RV Sites:</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                {sampleSites.map(site => (
                  <li key={site.siteNumber}>
                    Site #{site.siteNumber}: {site.name} - ${site.basePrice}/night
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-white mb-2">Booking Settings:</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Tax Rate: 9.25%</li>
                <li>Deposit: 50%</li>
                <li>Check-in: 2:00 PM</li>
                <li>Check-out: 11:00 AM</li>
                <li>Minimum Stay: 2 nights</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

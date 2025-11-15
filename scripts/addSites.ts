import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin (only if not already initialized)
if (!getApps().length) {
  initializeApp({
    projectId: 'riverlife-rv-resort',
  });
}

const db = getFirestore();

// Sample site data
const sites = [
  {
    siteNumber: 1,
    name: 'Riverside Haven',
    type: 'rv',
    description: 'Premium waterfront site with stunning river views. Perfect for families who want direct access to the Tennessee River. Features a private deck area and extra-wide parking pad.',
    basePrice: 75,
    maxOccupancy: 6,
    status: 'active',
    amenities: ['Full Hookup', 'Water', 'Electric (50 amp)', 'Sewer', 'WiFi', 'Picnic Table', 'Fire Ring'],
    features: ['River View', 'Waterfront', 'Level Pad', 'Shade Trees', 'Private Deck'],
    images: ['https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?q=80&w=2070'],
  },
  {
    siteNumber: 2,
    name: 'Mountain View Retreat',
    type: 'rv',
    description: 'Elevated site offering spectacular mountain vistas and sunrise views. This site features extra privacy with natural landscaping and is perfect for photographers and nature lovers.',
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
    description: 'The perfect spot for capturing those incredible Tennessee sunsets. Western exposure provides amazing evening views. Popular site - book early!',
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
    description: 'Quiet riverside location perfect for relaxation. Easy river access for kayaking and fishing. Shaded afternoon site with gentle river breezes.',
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
    description: 'Highest elevation site with panoramic views of both river and mountains. Premium site with the best of both worlds. Great for wildlife watching.',
    basePrice: 85,
    maxOccupancy: 6,
    status: 'active',
    amenities: ['Full Hookup', 'Water', 'Electric (50 amp)', 'Sewer', 'WiFi', 'Picnic Table', 'Fire Ring', 'BBQ Grill'],
    features: ['Panoramic Views', 'River & Mountain Views', 'Premium Site', 'Wildlife Viewing', 'Privacy'],
    images: ['https://images.unsplash.com/photo-1525811902-f2342640856e?q=80&w=2071'],
  },
  {
    siteNumber: 6,
    name: 'Creekside Retreat',
    type: 'rv',
    description: 'Peaceful site next to a gentle creek. The soothing sounds of flowing water create the perfect ambiance for a relaxing getaway.',
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
    description: 'Located at a scenic bend in the river. Great fishing spot and beautiful views in all directions. Popular with anglers.',
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
    description: 'Large site with mature shade trees. Perfect for hot summer days. Plenty of room for outdoor activities and family gatherings.',
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
    description: 'Elevated riverfront site with commanding views. Watch boats pass by from your private vantage point. Our most popular site!',
    basePrice: 85,
    maxOccupancy: 6,
    status: 'active',
    amenities: ['Full Hookup', 'Water', 'Electric (50 amp)', 'Sewer', 'WiFi', 'Picnic Table', 'Fire Ring', 'BBQ Grill'],
    features: ['Elevated View', 'River View', 'Premium Site', 'Best Views', 'Private'],
    images: ['https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=2070'],
  },
];

// Settings data
const settings = {
  taxRate: 9.25,
  depositPercentage: 50,
  checkInTime: '14:00',
  checkOutTime: '11:00',
  cancellationPolicy: 'Full refund if cancelled 7 days before check-in. 50% refund if cancelled 3-7 days before check-in. No refund within 3 days of check-in.',
  minimumStay: 2,
  maxAdvanceBookingDays: 365,
};

async function seedData() {
  console.log('Starting to seed Firestore data...\n');

  try {
    // Add sites
    console.log('Adding sites...');
    for (const site of sites) {
      const siteData = {
        ...site,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      const docRef = await db.collection('sites').add(siteData);
      console.log(`✓ Added site ${site.siteNumber}: ${site.name} (ID: ${docRef.id})`);
    }

    // Add settings
    console.log('\nAdding settings...');
    await db.collection('settings').doc('settings').set(settings);
    console.log('✓ Added booking settings');

    console.log('\n✅ All data seeded successfully!');
    console.log('\nYou can now:');
    console.log('1. Visit http://localhost:3003/sites to see available sites');
    console.log('2. Click on any site to view details and book');
    console.log('3. Go to Firebase Console to view/edit the data');
    
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    throw error;
  }
}

seedData()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

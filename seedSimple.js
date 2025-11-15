// Simple seed script that doesn't require tsx
const admin = require('firebase-admin');

// Load service account
const serviceAccount = require('./serviceAccountKey.json');

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Sample sites data
const sampleSites = [
  {
    siteNumber: 1,
    name: 'Riverside Retreat',
    type: 'rv',
    description: 'Premium waterfront RV site with direct Tennessee River access.',
    basePrice: 75,
    maxOccupancy: 6,
    amenities: ['Full Hookups', 'WiFi', '50 Amp Electric', 'Water', 'Sewer'],
    features: ['Direct river frontage', 'Boat launch nearby', 'Sunrise views'],
    images: ['/images/sites/site-1-main.jpg'],
    status: 'active',
    location: { latitude: 35.0456, longitude: -85.3097 }
  },
  // Add more sites as needed
];

async function seedDatabase() {
  console.log('🌱 Starting database seed...\n');
  
  try {
    // Seed Sites
    console.log('📍 Seeding sites...');
    for (const site of sampleSites) {
      const docRef = await db.collection('sites').add({
        ...site,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      console.log(`✓ Created: ${site.name}`);
    }
    
    // Seed Settings
    console.log('\n⚙️  Seeding settings...');
    await db.collection('settings').doc('settings').set({
      taxRate: 9.25,
      depositPercentage: 50,
      cancellationPolicy: 'Full refund if cancelled 7+ days before check-in.',
      checkInTime: '15:00',
      checkOutTime: '11:00',
      notificationEmail: 'reservations@riverlifervresort.com',
      showPendingBadge: true,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    console.log('✓ Created settings');
    
    console.log('\n✅ Seeding complete!\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

seedDatabase();

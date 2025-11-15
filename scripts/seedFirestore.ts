// Firestore Seed Script
// Run this script to populate your Firestore database with sample data
// Usage: node --loader ts-node/esm scripts/seedFirestore.ts

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { sampleSites, samplePricingRules, sampleCoupons, sampleSettings } from '../src/data/sampleSites';

// Initialize Firebase Admin
// You'll need to download your service account key from Firebase Console
// and save it as serviceAccountKey.json in the project root
const serviceAccount = require('../../serviceAccountKey.json');

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

async function seedDatabase() {
  console.log('🌱 Starting database seed...\n');

  try {
    // Seed Sites
    console.log('📍 Seeding RV Sites and Airbnb...');
    const sitesCollection = db.collection('sites');
    
    for (const site of sampleSites) {
      const siteData = {
        ...site,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      const docRef = await sitesCollection.add(siteData);
      console.log(`  ✓ Created site: ${site.name} (Site #${site.siteNumber}) - ID: ${docRef.id}`);
    }

    // Seed Pricing Rules
    console.log('\n💰 Seeding Pricing Rules...');
    const rulesCollection = db.collection('pricingRules');
    
    for (const rule of samplePricingRules) {
      await rulesCollection.add(rule);
      console.log(`  ✓ Created pricing rule: ${rule.name}`);
    }

    // Seed Coupons
    console.log('\n🎟️  Seeding Coupons...');
    const couponsCollection = db.collection('coupons');
    
    for (const coupon of sampleCoupons) {
      await couponsCollection.add(coupon);
      console.log(`  ✓ Created coupon: ${coupon.code} (${coupon.value}${coupon.type === 'percentage' ? '%' : '$'} off)`);
    }

    // Seed Settings
    console.log('\n⚙️  Seeding Site Settings...');
    await db.collection('settings').doc('settings').set(sampleSettings);
    console.log('  ✓ Created site settings');

    console.log('\n✅ Database seeding completed successfully!\n');
    console.log('📊 Summary:');
    console.log(`  - ${sampleSites.length} sites created`);
    console.log(`  - ${samplePricingRules.length} pricing rules created`);
    console.log(`  - ${sampleCoupons.length} coupons created`);
    console.log(`  - 1 settings document created`);
    console.log('\n🚀 Your database is ready to use!');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }

  process.exit(0);
}

// Run the seed function
seedDatabase();

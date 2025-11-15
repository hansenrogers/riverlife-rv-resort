// Sample seed data for River Life RV Resort sites
// This data can be imported into Firestore to get started quickly
// Replace placeholder images with actual photos from the resort

import { RVSite } from '@/types';

export const sampleSites: Omit<RVSite, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    siteNumber: 1,
    name: 'Riverside Retreat',
    type: 'rv',
    description: 'Premium waterfront RV site with direct Tennessee River access. Wake up to stunning sunrise views over the water. This spacious site offers the perfect blend of natural beauty and modern convenience.',
    basePrice: 75,
    maxOccupancy: 6,
    amenities: ['Full Hookups', 'WiFi', '50 Amp Electric', 'Water', 'Sewer', 'Picnic Table', 'Fire Ring'],
    features: [
      'Direct river frontage',
      'Boat launch nearby',
      'Sunrise views',
      'Level pull-through site',
      'Extra-wide parking pad',
      'Mature shade trees',
      'Private fire pit area',
      'Pet-friendly'
    ],
    images: [
      '/images/sites/site-1-main.jpg',
      '/images/sites/site-1-view.jpg',
      '/images/sites/site-1-sunset.jpg'
    ],
    status: 'active',
    location: {
      latitude: 35.0456,
      longitude: -85.3097
    }
  },
  {
    siteNumber: 2,
    name: 'Mountain View Haven',
    type: 'rv',
    description: 'Elevated site featuring panoramic views of Lookout Mountain. Perfect for photographers and nature lovers seeking a peaceful getaway with spectacular scenery.',
    basePrice: 70,
    maxOccupancy: 6,
    amenities: ['Full Hookups', 'WiFi', '50 Amp Electric', 'Water', 'Sewer', 'Picnic Table'],
    features: [
      'Mountain views',
      'Quiet location',
      'Paved pad',
      'Back-in site',
      'Shaded afternoon area',
      'Close to hiking trails',
      'Bird watching paradise',
      'Stargazing spot'
    ],
    images: [
      '/images/sites/site-2-main.jpg',
      '/images/sites/site-2-mountain.jpg'
    ],
    status: 'active',
    location: {
      latitude: 35.0458,
      longitude: -85.3095
    }
  },
  {
    siteNumber: 3,
    name: 'Creekside Oasis',
    type: 'rv',
    description: 'Serene site nestled along a babbling creek. The soothing sounds of running water create the ultimate relaxation experience. Ideal for families and couples.',
    basePrice: 68,
    maxOccupancy: 4,
    amenities: ['Full Hookups', 'WiFi', '30 Amp Electric', 'Water', 'Sewer', 'Fire Ring'],
    features: [
      'Creek frontage',
      'Natural privacy',
      'Wildlife viewing',
      'Pull-through site',
      'Flat gravel pad',
      'Fishing access',
      'Hammock-friendly trees',
      'Dog-friendly creek area'
    ],
    images: [
      '/images/sites/site-3-main.jpg',
      '/images/sites/site-3-creek.jpg'
    ],
    status: 'active',
    location: {
      latitude: 35.0460,
      longitude: -85.3093
    }
  },
  {
    siteNumber: 4,
    name: 'Sunset Point',
    type: 'rv',
    description: 'Premium western-facing site offering breathtaking sunset views over the Tennessee River. Watch the sky transform into brilliant colors each evening from your own private viewing area.',
    basePrice: 80,
    maxOccupancy: 6,
    amenities: ['Full Hookups', 'WiFi', '50 Amp Electric', 'Water', 'Sewer', 'Picnic Table', 'Fire Ring', 'Patio Area'],
    features: [
      'Sunset views',
      'River access',
      'Extended patio space',
      'Pull-through site',
      'Premium location',
      'Extra parking',
      'Boat dock nearby',
      'Fishing pier access'
    ],
    images: [
      '/images/sites/site-4-main.jpg',
      '/images/sites/site-4-sunset.jpg',
      '/images/sites/site-4-night.jpg'
    ],
    status: 'active',
    location: {
      latitude: 35.0462,
      longitude: -85.3091
    }
  },
  {
    siteNumber: 5,
    name: 'Forest Edge Escape',
    type: 'rv',
    description: 'Secluded site bordered by native hardwood forest. Perfect for those seeking extra privacy and a true nature immersion experience while still enjoying full amenities.',
    basePrice: 65,
    maxOccupancy: 4,
    amenities: ['Full Hookups', 'WiFi', '50 Amp Electric', 'Water', 'Sewer', 'Fire Ring'],
    features: [
      'Forest privacy',
      'Nature trails nearby',
      'Full shade',
      'Back-in site',
      'Level concrete pad',
      'Bird sanctuary adjacent',
      'Quiet zone',
      'Nature photography spot'
    ],
    images: [
      '/images/sites/site-5-main.jpg',
      '/images/sites/site-5-forest.jpg'
    ],
    status: 'active',
    location: {
      latitude: 35.0464,
      longitude: -85.3089
    }
  },
  {
    siteNumber: 6,
    name: 'Riverside Family Site',
    type: 'rv',
    description: 'Extra-large family-friendly site with ample space for outdoor activities. Features dedicated play area for children and easy river access for water recreation.',
    basePrice: 72,
    maxOccupancy: 8,
    amenities: ['Full Hookups', 'WiFi', '50 Amp Electric', 'Water', 'Sewer', 'Picnic Table', 'Fire Ring', 'BBQ Grill'],
    features: [
      'Extra-large site',
      'Family-friendly',
      'Play area nearby',
      'River access',
      'Pull-through site',
      'Double parking spaces',
      'Outdoor games area',
      'Pet exercise area'
    ],
    images: [
      '/images/sites/site-6-main.jpg',
      '/images/sites/site-6-family.jpg'
    ],
    status: 'active',
    location: {
      latitude: 35.0466,
      longitude: -85.3087
    }
  },
  {
    siteNumber: 7,
    name: 'Fisherman\'s Paradise',
    type: 'rv',
    description: 'Angler\'s dream site with direct access to prime fishing spots on the Tennessee River. Includes fish cleaning station and boat dock privileges.',
    basePrice: 73,
    maxOccupancy: 4,
    amenities: ['Full Hookups', 'WiFi', '50 Amp Electric', 'Water', 'Sewer', 'Picnic Table', 'Fish Cleaning Station'],
    features: [
      'Premium fishing access',
      'Boat dock nearby',
      'River frontage',
      'Back-in site',
      'Equipment storage area',
      'Cleaning station access',
      'Launch ramp privileges',
      'Trophy fish waters'
    ],
    images: [
      '/images/sites/site-7-main.jpg',
      '/images/sites/site-7-fishing.jpg'
    ],
    status: 'active',
    location: {
      latitude: 35.0468,
      longitude: -85.3085
    }
  },
  {
    siteNumber: 8,
    name: 'Scenic Bluff View',
    type: 'rv',
    description: 'Elevated site perched on a gentle bluff offering commanding views of the river valley. Enjoy privacy and panoramic vistas from this premium location.',
    basePrice: 78,
    maxOccupancy: 6,
    amenities: ['Full Hookups', 'WiFi', '50 Amp Electric', 'Water', 'Sewer', 'Picnic Table', 'Fire Ring'],
    features: [
      'Elevated views',
      'Valley panorama',
      'Private location',
      'Pull-through site',
      'Paved parking',
      'Covered picnic area',
      'Storm shelter nearby',
      'Photography hotspot'
    ],
    images: [
      '/images/sites/site-8-main.jpg',
      '/images/sites/site-8-view.jpg',
      '/images/sites/site-8-evening.jpg'
    ],
    status: 'active',
    location: {
      latitude: 35.0470,
      longitude: -85.3083
    }
  },
  {
    siteNumber: 9,
    name: 'Tranquil Cove',
    type: 'rv',
    description: 'Peaceful corner site in a protected cove area. Features natural windbreak and extra privacy. Perfect for extended stays and seasonal visitors.',
    basePrice: 67,
    maxOccupancy: 4,
    amenities: ['Full Hookups', 'WiFi', '30 Amp Electric', 'Water', 'Sewer', 'Picnic Table', 'Fire Ring'],
    features: [
      'Protected cove',
      'Wind shelter',
      'Extra privacy',
      'Back-in site',
      'Gravel pad',
      'Mature landscaping',
      'Seasonal special rates',
      'Long-term friendly'
    ],
    images: [
      '/images/sites/site-9-main.jpg',
      '/images/sites/site-9-cove.jpg'
    ],
    status: 'active',
    location: {
      latitude: 35.0472,
      longitude: -85.3081
    }
  },
  {
    siteNumber: 10,
    name: 'Tittle River House',
    type: 'airbnb',
    description: 'Charming riverside Airbnb cottage featuring modern amenities and rustic charm. This fully-furnished retreat includes full kitchen, private bathroom, deck overlooking the river, and all the comforts of home. Perfect for couples or small families seeking a cozy alternative to RV camping.',
    basePrice: 150,
    maxOccupancy: 4,
    amenities: [
      'Full Kitchen',
      'Private Bathroom', 
      'WiFi',
      'AC & Heat',
      'Smart TV',
      'Washer/Dryer',
      'Fire Pit',
      'River Deck',
      'BBQ Grill',
      'Parking'
    ],
    features: [
      'Riverfront location',
      'Fully furnished',
      'Modern appliances',
      'Queen bed + sofa sleeper',
      'Private entrance',
      'Outdoor seating area',
      'Kayak storage',
      'Boat dock access',
      'Pet-friendly',
      'Weekly discounts available'
    ],
    images: [
      '/images/sites/airbnb-exterior.jpg',
      '/images/sites/airbnb-interior.jpg',
      '/images/sites/airbnb-deck.jpg',
      '/images/sites/airbnb-bedroom.jpg'
    ],
    status: 'active',
    location: {
      latitude: 35.0474,
      longitude: -85.3079
    }
  }
];

// Function to generate Firestore-ready data with timestamps
export const prepareSiteForFirestore = (site: typeof sampleSites[0]) => {
  return {
    ...site,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

// Sample pricing rules
export const samplePricingRules = [
  {
    name: 'Weekend Premium',
    type: 'day-of-week' as const,
    siteId: 'all',
    daysOfWeek: [5, 6], // Friday, Saturday
    discountPercentage: -10, // Negative = price increase
    priority: 5,
    active: true,
    createdAt: new Date(),
  },
  {
    name: 'Weekly Stay Discount',
    type: 'length-of-stay' as const,
    siteId: 'all',
    minimumNights: 7,
    discountPercentage: 15,
    priority: 3,
    active: true,
    createdAt: new Date(),
  },
  {
    name: 'Summer Peak Season',
    type: 'seasonal' as const,
    siteId: 'all',
    startDate: new Date('2025-06-01'),
    endDate: new Date('2025-08-31'),
    discountPercentage: -20, // 20% increase
    priority: 8,
    active: true,
    createdAt: new Date(),
  },
  {
    name: 'Fall Special',
    type: 'seasonal' as const,
    siteId: 'all',
    startDate: new Date('2025-10-01'),
    endDate: new Date('2025-11-30'),
    discountPercentage: 10,
    priority: 6,
    active: true,
    createdAt: new Date(),
  }
];

// Sample coupons
export const sampleCoupons = [
  {
    code: 'WELCOME2025',
    type: 'percentage' as const,
    value: 10,
    description: 'Welcome discount for new guests',
    validFrom: new Date('2025-01-01'),
    validUntil: new Date('2025-12-31'),
    usageLimit: 100,
    usedCount: 0,
    minimumStay: 2,
    active: true,
    createdAt: new Date(),
  },
  {
    code: 'LONGSTAY',
    type: 'percentage' as const,
    value: 20,
    description: 'Extended stay discount',
    validFrom: new Date('2025-01-01'),
    validUntil: new Date('2025-12-31'),
    usageLimit: 50,
    usedCount: 0,
    minimumStay: 14,
    active: true,
    createdAt: new Date(),
  },
  {
    code: 'EARLYBIRD',
    type: 'fixed' as const,
    value: 25,
    description: 'Early booking discount',
    validFrom: new Date('2025-01-01'),
    validUntil: new Date('2025-03-31'),
    usageLimit: 30,
    usedCount: 0,
    minimumStay: 3,
    active: true,
    createdAt: new Date(),
  }
];

// Site settings
export const sampleSettings = {
  taxRate: 9.25, // Tennessee sales tax
  depositPercentage: 50,
  cancellationPolicy: 'Full refund if cancelled 7+ days before check-in. 50% refund if cancelled 3-7 days before. No refund for cancellations within 3 days of check-in.',
  checkInTime: '15:00',
  checkOutTime: '11:00',
  minimumStay: 1,
  maximumStay: 30,
  bookingLeadTime: 1, // Days in advance required
  notificationEmail: 'reservations@riverlifervresort.com',
  notificationPhone: '(423) 555-0123',
  showPendingBadge: true,
  allowInstantBooking: false, // All bookings require approval
  updatedAt: new Date(),
};

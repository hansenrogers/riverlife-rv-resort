# Sites Pages Documentation

This document explains the RV site listing and detail pages functionality.

## Overview

The booking system includes two main site-related pages:

1. **Sites Listing Page** (`/sites`) - Browse all available RV sites and the Airbnb
2. **Site Detail Page** (`/sites/[siteId]`) - View detailed information and book a specific site

## Sites Listing Page (`/sites/page.tsx`)

### Features

#### Date-Based Filtering
- Users can select check-in and check-out dates
- Real-time availability checking across all sites
- Filter results to show only available sites for selected dates
- Clear filters button to reset and view all sites

#### Responsive Grid Layout
- Mobile: 1 column
- Tablet: 2 columns
- Desktop: 3 columns
- Cards with hover effects and smooth transitions

#### Site Cards Display
- Site number badge
- Hero image with placeholder fallback
- Availability badge (Available/Booked) when dates are selected
- Site name and description preview
- Feature tags (first 3 features + count)
- Amenity icons (WiFi, Electric, Water, Sewer)
- Maximum occupancy
- Base price per night
- "View Details & Book" button

#### Sticky Filter Bar
- Remains visible while scrolling
- Mobile: Collapsible filters
- Desktop: Always visible
- Shows count of available sites

### User Flow

1. User lands on `/sites`
2. (Optional) Select check-in and check-out dates
3. System checks availability for all sites
4. View filtered or unfiltered site listings
5. Click a site card to view details
6. Dates carry over to detail page via URL parameters

### Technical Details

**State Management:**
```typescript
const [sites, setSites] = useState<RVSite[]>([]);
const [checkIn, setCheckIn] = useState('');
const [checkOut, setCheckOut] = useState('');
const [availabilityMap, setAvailabilityMap] = useState<Record<string, boolean>>({});
```

**Firestore Queries:**
- `getActiveSites()` - Fetches only active sites
- `checkSiteAvailability()` - Checks for booking conflicts

**URL Structure:**
- Base: `/sites`
- With params: `/sites?checkIn=2025-06-01&checkOut=2025-06-07`

---

## Site Detail Page (`/sites/[siteId]/page.tsx`)

### Features

#### Image Gallery
- Full-screen hero image carousel
- Previous/Next navigation arrows
- Image counter (e.g., "2 / 5")
- Thumbnail strip below main image
- Click thumbnail to jump to that image
- Fallback UI for sites without images

#### Site Information
- Site number badge
- Site name and full description
- Base price prominently displayed
- Quick stats grid:
  - Max guests
  - Site type (RV/Airbnb)
  - Hookup type
  - Current status

#### Features & Amenities
- Comprehensive features list with checkmarks
- Amenities grid with icons
- Organized in responsive columns

#### Booking Sidebar (Sticky)

**Date Selection:**
- Check-in date picker (minimum: today)
- Check-out date picker (minimum: check-in date)
- Nights counter

**Availability Check:**
- Real-time availability verification
- Visual status indicator:
  - ✓ Green = Available
  - ✗ Red = Booked
- Loading state while checking

**Coupon Code:**
- Optional coupon input field
- Auto-uppercase transformation
- Applied to pricing calculation

**Price Breakdown:**
- Base price × nights = subtotal
- Discounts (pricing rules + coupons)
- Tax calculation
- **Total amount**
- **Deposit amount** (configurable %)
- Balance due at arrival

**Reserve Button:**
- Disabled states:
  - No dates selected
  - Site not available
  - Currently checking availability
- Enabled: "Reserve Now" with icons
- Redirects to booking page with all parameters

**Information Notice:**
- Manual approval requirement notice
- 24-hour confirmation timeline

### User Flow

1. User arrives from listing page or direct link
2. Views image gallery and site details
3. Selects check-in and check-out dates
4. System checks real-time availability
5. If available, pricing is calculated automatically
6. (Optional) Enter coupon code
7. Review price breakdown
8. Click "Reserve Now"
9. Redirected to `/booking/[siteId]?checkIn=...&checkOut=...&coupon=...`

### Technical Details

**Dynamic Route:**
```typescript
// URL: /sites/abc123xyz
const params = useParams();
const siteId = params.siteId as string;
```

**Query Parameters:**
```typescript
const searchParams = useSearchParams();
const checkIn = searchParams.get('checkIn') || '';
const checkOut = searchParams.get('checkOut') || '';
```

**Firestore Operations:**
```typescript
// Load site
const site = await getSiteById(siteId);

// Check availability
const isAvailable = await checkSiteAvailability(siteId, checkInDate, checkOutDate);

// Calculate pricing
const pricing = await calculateBookingPrice(siteId, checkInDate, checkOutDate, couponCode);
```

**Price Calculation Flow:**
1. Get site base price
2. Calculate number of nights
3. Apply pricing rules (seasonal, length-of-stay, day-of-week)
4. Apply coupon (if valid)
5. Calculate tax
6. Calculate deposit amount
7. Calculate remaining balance

**URL Navigation:**
```typescript
// To booking page with all parameters
const bookingUrl = `/booking/${siteId}?checkIn=${checkIn}&checkOut=${checkOut}&coupon=${couponCode}`;
router.push(bookingUrl);
```

---

## Sample Data

### Included Sites

The system includes 10 sample sites ready for customization:

**RV Sites (1-9):**
1. Riverside Retreat - $75/night
2. Mountain View Haven - $70/night
3. Creekside Oasis - $68/night
4. Sunset Point - $80/night (premium)
5. Forest Edge Escape - $65/night
6. Riverside Family Site - $72/night (large, family)
7. Fisherman's Paradise - $73/night
8. Scenic Bluff View - $78/night
9. Tranquil Cove - $67/night

**Airbnb (Site 10):**
10. Tittle River House - $150/night

### Customization

Replace placeholder data in `/src/data/sampleSites.ts`:

```typescript
{
  siteNumber: 1,
  name: 'Your Site Name',
  type: 'rv', // or 'airbnb'
  description: 'Detailed description...',
  basePrice: 75,
  maxOccupancy: 6,
  amenities: ['Full Hookups', 'WiFi', ...],
  features: [
    'Direct river frontage',
    'Boat launch nearby',
    ...
  ],
  images: [
    '/images/sites/site-1-main.jpg', // Add your images to public/images/sites/
    '/images/sites/site-1-view.jpg',
  ],
  status: 'active',
  location: {
    latitude: 35.0456,
    longitude: -85.3097
  }
}
```

---

## Adding Site Images

### Directory Structure
```
public/
  images/
    sites/
      site-1-main.jpg
      site-1-view.jpg
      site-1-sunset.jpg
      site-2-main.jpg
      ...
      airbnb-exterior.jpg
      airbnb-interior.jpg
      airbnb-deck.jpg
```

### Image Guidelines

**Recommended Specs:**
- Format: JPEG or WebP
- Resolution: 1920×1080 or higher
- Aspect Ratio: 16:9 (landscape)
- File Size: Under 500KB (optimized)
- Quality: 80-85% compression

**Image Types:**
- Main/Hero: Best overall view of site
- View: River, mountain, or scenic view
- Amenities: Close-ups of features
- Seasonal: Different times of year
- Activities: Guests enjoying the site

**Naming Convention:**
```
site-[number]-[descriptor].jpg

Examples:
site-1-main.jpg
site-1-river-view.jpg
site-1-sunset.jpg
airbnb-exterior.jpg
airbnb-kitchen.jpg
```

### Next.js Image Optimization

Images are automatically optimized by Next.js:
- Lazy loading
- Responsive sizing
- WebP conversion (when supported)
- Blur placeholder

No additional configuration needed!

---

## Firestore Data Structure

### Sites Collection

```typescript
sites/ (collection)
  {siteId}/ (document)
    siteNumber: number
    name: string
    type: 'rv' | 'airbnb'
    description: string
    basePrice: number
    maxOccupancy: number
    amenities: string[]
    features: string[]
    images: string[]
    status: 'active' | 'inactive' | 'maintenance'
    location: { latitude, longitude }
    createdAt: timestamp
    updatedAt: timestamp
```

### Seeding Data

Use the seed script to populate Firestore:

```bash
# 1. Download service account key from Firebase Console
# 2. Save as serviceAccountKey.json in project root
# 3. Run seed script
npm run seed
```

---

## Testing Checklist

### Sites Listing Page
- [ ] All active sites display
- [ ] Site cards show correct information
- [ ] Images load or show placeholder
- [ ] Date filter works correctly
- [ ] Availability check functions
- [ ] Clear filters resets view
- [ ] Mobile responsive layout
- [ ] Navigation to detail pages works

### Site Detail Page
- [ ] Site loads from URL parameter
- [ ] All images display in carousel
- [ ] Thumbnail navigation works
- [ ] Features and amenities display
- [ ] Date selection updates nights counter
- [ ] Availability check returns correct status
- [ ] Pricing calculation is accurate
- [ ] Coupon code applies correctly
- [ ] Deposit calculation is correct
- [ ] Reserve button enables/disables appropriately
- [ ] Navigation to booking page works
- [ ] Mobile sidebar is sticky and usable

### Integration
- [ ] Dates persist from listing to detail page
- [ ] Back button returns to listing page
- [ ] Invalid site IDs redirect to listing
- [ ] Booking flow continues to checkout

---

## Mobile Optimization

### Responsive Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px  
- Desktop: > 1024px

### Mobile-Specific Features
- Collapsible filters on listing page
- Single column site grid
- Touch-friendly image carousel
- Sticky booking sidebar optimized for small screens
- Large, tappable buttons
- Optimized form inputs for mobile keyboards

### Performance
- Lazy load images below fold
- Minimize initial bundle size
- Server-side render for SEO
- Prefetch detail pages on hover (desktop)

---

## Next Steps

After reviewing the site pages:

1. **Add Real Images**: Replace placeholder image paths in `sampleSites.ts`
2. **Customize Site Details**: Update descriptions, amenities, features
3. **Configure Pricing**: Adjust base prices and pricing rules
4. **Test Booking Flow**: Ensure smooth transition to booking page
5. **Build Booking Page**: Next component to complete reservation flow

The sites listing and detail pages are now complete and ready for testing!

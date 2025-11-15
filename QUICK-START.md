# 🚀 Quick Start Guide

## What's Been Built

You now have a fully configured Next.js 14 booking system with:

✅ **Pages Created:**
- Homepage with hero, features, site previews
- Sites listing page with availability filtering
- Individual site detail pages with image galleries
- Firestore integration for real-time data

✅ **Data & Configuration:**
- 10 sample sites (9 RV + 1 Airbnb)
- TypeScript types for entire application
- Firebase configuration files
- Pricing rules, coupons, settings data
- Chattanooga attractions database (14 activities)

✅ **Documentation:**
- README.md - Technical overview
- SETUP.md - 15-minute setup guide
- PROJECT-STATUS.md - Complete roadmap
- SITES-PAGES.md - Site pages documentation

---

## 🏃 Next Steps to Get Running

### 1. Install Dependencies (5 minutes)

```bash
cd "c:\CHB\Programs\Customer's Websites\River Life RV Resort\riverlife-booking-system"
npm install
```

This will install all required packages and resolve lint errors.

### 2. Set Up Firebase (10 minutes)

**a) Create Firebase Project:**
1. Go to https://console.firebase.google.com
2. Click "Add project"
3. Name it "river-life-rv-resort"
4. Disable Google Analytics (optional)
5. Click "Create project"

**b) Enable Firestore:**
1. In Firebase Console → Build → Firestore Database
2. Click "Create database"
3. Start in **test mode** for development
4. Choose location (us-east1 recommended)

**c) Enable Authentication:**
1. In Firebase Console → Build → Authentication
2. Click "Get started"
3. Enable "Email/Password" provider

**d) Enable Storage:**
1. In Firebase Console → Build → Storage
2. Click "Get started"
3. Start in **test mode**

**e) Get Configuration:**
1. Go to Project Settings (gear icon)
2. Scroll to "Your apps" section
3. Click web icon (</>) to add web app
4. Register app as "River Life Booking"
5. Copy the configuration object

**f) Create Environment File:**

Create `.env.local` in project root:

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef

# Stripe Configuration (get from https://dashboard.stripe.com/test/apikeys)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Set Up Stripe (5 minutes)

1. Go to https://dashboard.stripe.com/register
2. Create account and verify email
3. Go to Developers → API keys
4. Copy "Publishable key" and "Secret key"
5. Add to `.env.local` (see above)

### 4. Seed Database (2 minutes)

**Option A: Manual Seed (Recommended for first time)**
1. Download service account key:
   - Firebase Console → Project Settings → Service Accounts
   - Click "Generate new private key"
   - Save as `serviceAccountKey.json` in project root
2. Run seed script:
   ```bash
   npm run seed
   ```

**Option B: Manual Import**
- Use Firebase Console → Firestore → Import data
- Import from `src/data/sampleSites.ts`

### 5. Add Site Images (15 minutes)

Create image directories:
```bash
mkdir -p public/images/sites
mkdir -p public/images/hero
```

Add your photos:
```
public/images/sites/
  site-1-main.jpg       (Main view)
  site-1-view.jpg       (River/mountain view)
  site-1-sunset.jpg     (Optional)
  site-2-main.jpg
  ... (repeat for all 10 sites)
  airbnb-exterior.jpg
  airbnb-interior.jpg
  airbnb-deck.jpg
```

Update paths in `src/data/sampleSites.ts` if needed.

### 6. Start Development Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser!

---

## 📱 Test on Mobile

### Local Network Testing:
```bash
# Find your local IP (Windows PowerShell):
ipconfig

# Look for IPv4 Address (e.g., 192.168.1.100)
# Access from phone on same WiFi:
http://192.168.1.100:3000
```

### Update CORS if needed:
Add your local IP to Firebase settings:
- Firebase Console → Authentication → Settings
- Add `http://192.168.1.100:3000` to Authorized domains

---

## 🎨 Customize Your Site

### Update Branding

**Colors** (`tailwind.config.ts`):
```typescript
colors: {
  primary: {
    50: '#e6f3f7',   // Lightest
    100: '#bfe4f2',  // Light
    // ... change to your colors
  }
}
```

**Fonts** (`src/app/layout.tsx`):
- Currently: Old Standard TT (serif) + Karla (sans)
- Change to your preferred Google Fonts

### Update Content

**Homepage** (`src/app/page.tsx`):
- Hero section text
- Feature descriptions
- Contact information

**Site Data** (`src/data/sampleSites.ts`):
- Site names and descriptions
- Pricing ($65-$150 range)
- Amenities and features
- Location coordinates

**Settings** (`src/data/sampleSites.ts`):
```typescript
export const sampleSettings = {
  taxRate: 9.25,              // Your local tax rate
  depositPercentage: 50,      // 50% deposit
  cancellationPolicy: '...',  // Your policy
  notificationEmail: '...',   // Your email
  notificationPhone: '...',   // Your phone
}
```

---

## 🔨 What to Build Next

Based on priority for a working booking system:

### 1. Booking Flow (HIGH PRIORITY)
**File:** `src/app/booking/[siteId]/page.tsx`

Features needed:
- Guest information form (name, email, phone)
- RV details (if RV site)
- Special requests textarea
- Terms & conditions checkbox
- Stripe payment integration
- Confirmation page

### 2. Admin Dashboard (HIGH PRIORITY)
**File:** `src/app/admin/page.tsx`

Features needed:
- Login page (Firebase Auth)
- Pending bookings list with badge
- Approve/Reject buttons
- Calendar view of all bookings
- Quick stats (revenue, occupancy)

### 3. Admin C-Panel (MEDIUM PRIORITY)
**Files:** `src/app/admin/...`

Sub-pages:
- `/admin/sites` - Edit site details, pricing, images
- `/admin/bookings` - Full booking management
- `/admin/pricing` - Create/edit pricing rules
- `/admin/coupons` - Coupon management
- `/admin/settings` - Site-wide settings
- `/admin/reports` - Revenue reports, analytics

### 4. Additional Pages (MEDIUM PRIORITY)
- `/attractions` - Showcase Chattanooga activities
- `/about` - About River Life RV Resort
- `/contact` - Contact form and info
- `/terms` - Terms and conditions
- `/privacy` - Privacy policy

---

## 📞 Support & Resources

### Documentation
- Next.js: https://nextjs.org/docs
- Firebase: https://firebase.google.com/docs
- Stripe: https://stripe.com/docs
- Tailwind CSS: https://tailwindcss.com/docs

### Your Project Docs
- `README.md` - Full technical documentation
- `SETUP.md` - Detailed setup instructions
- `PROJECT-STATUS.md` - Complete feature roadmap
- `docs/SITES-PAGES.md` - Site pages documentation

### Common Commands
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Check code quality
npm run seed         # Seed Firestore database
```

---

## ✅ Current Status

**Completed:**
- ✅ Project structure and configuration
- ✅ Homepage with hero and features
- ✅ Sites listing with filtering
- ✅ Site detail pages with galleries
- ✅ Sample data for 10 sites
- ✅ Firestore integration
- ✅ Pricing calculation system
- ✅ Attractions database

**Next Up:**
- 🔲 Booking flow with Stripe payment
- 🔲 Admin dashboard with approvals
- 🔲 Email notifications
- 🔲 Additional pages (attractions, about, contact)
- 🔲 Production deployment

**You're about 40% done!** The foundation is solid and the booking system is taking shape. Focus on the booking flow and admin dashboard next to get a minimum viable product (MVP) running.

---

## 🎯 MVP Checklist

To get a working booking system:

- [x] Site listing and details
- [ ] Complete booking form
- [ ] Stripe payment integration  
- [ ] Admin login
- [ ] Booking approval system
- [ ] Email notifications
- [ ] Basic testing

Once you have these 7 items, you can start taking real bookings!

---

Good luck! Your River Life RV Resort booking system is off to a great start. 🚀

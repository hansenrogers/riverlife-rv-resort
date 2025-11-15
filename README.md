# River Life RV Resort - Booking System

A modern, mobile-first booking platform for River Life RV Resort featuring real-time availability, booking approval workflow, admin control panel, Stripe payments, and comprehensive site management.

## 🚀 Features

### Guest Features
- **Real-time Availability Calendar** - See which sites are available for your dates
- **Individual Site Pages** - Each RV site has detailed info with image carousels
- **Smart Pricing** - Automatic seasonal rates, length-of-stay discounts, and coupon codes
- **Booking Requests** - Submit booking requests with 50% deposit
- **Chattanooga Activities Guide** - Curated list of local attractions and things to do
- **Contact Form** - Ask questions before booking
- **Mobile-First Design** - Optimized for booking from your phone

### Owner/Admin Features (C-Panel)
- **Booking Management** - Approve/reject booking requests with notifications
- **Pending Bookings Badge** - See how many approvals are pending (toggle on/off)
- **Dynamic Pricing Control** - Set pricing rules by season, day of week, length of stay
- **Cancellation Policy Manager** - Update policy and refund percentages anytime
- **Coupon System** - Create and manage discount codes
- **Photo Management** - Upload and reorder site photos from mobile
- **Availability Calendar** - Block dates for maintenance
- **Revenue Reports** - Track bookings, deposits, and occupancy rates
- **Site Settings** - Control deposit %, tax rate, check-in/out times, Airbnb toggle
- **Mobile Admin** - Full control panel works perfectly on phones

## 🏗️ Tech Stack

- **Next.js 14** - React framework with server-side rendering for SEO
- **TypeScript** - Type-safe code
- **Firebase** - Authentication, Firestore database, Cloud Storage
- **Stripe** - Payment processing with 50% deposits
- **Tailwind CSS** - Mobile-first responsive styling
- **Framer Motion** - Smooth animations
- **React Hook Form + Zod** - Form validation

## 📋 Prerequisites

- Node.js 18+ and npm
- Firebase account
- Stripe account

## 🛠️ Setup Instructions

### 1. Install Dependencies

```powershell
cd "c:\CHB\Programs\Customer's Websites\River Life RV Resort\riverlife-booking-system"
npm install
```

### 2. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project: "riverlife-rv-resort"
3. Enable Authentication (Email/Password)
4. Create Firestore Database (Start in production mode)
5. Enable Storage
6. Get your config from Project Settings

### 3. Environment Variables

Copy `.env.local.example` to `.env.local`:

```powershell
cp .env.local.example .env.local
```

Fill in your Firebase and Stripe credentials:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_actual_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=riverlife-rv-resort.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=riverlife-rv-resort
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=riverlife-rv-resort.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Stripe (use test keys initially)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
ADMIN_EMAIL=youremail@example.com
```

### 4. Initialize Firestore Collections

```powershell
npm run setup-firestore
```

This will create initial data structure including:
- Default site settings (50% deposit, cancellation policy, etc.)
- 9 RV sites with sample data
- Chattanooga attractions data

### 5. Run Development Server

```powershell
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📱 Mobile Admin Access

The admin panel is fully optimized for mobile:

1. Navigate to `/admin` on your phone
2. Login with your admin account
3. Manage everything from bookings to pricing on the go!

## 🗂️ Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── (admin)/           # Admin routes with layout
│   │   ├── admin/         # Admin dashboard
│   │   ├── bookings/      # Booking management
│   │   ├── sites/         # Site management
│   │   └── settings/      # System settings
│   ├── sites/             # Individual RV site pages
│   │   └── [siteId]/      # Dynamic site route
│   ├── attractions/       # Chattanooga activities
│   ├── booking/           # Booking flow
│   └── contact/           # Contact form
├── components/            # React components
│   ├── admin/            # Admin-specific components
│   ├── booking/          # Booking components
│   ├── layout/           # Navigation, footer
│   └── ui/               # Reusable UI elements
├── lib/                   # Utility functions
│   ├── firebase/         # Firebase configuration
│   ├── stripe/           # Stripe helpers
│   └── utils/            # Helper functions
├── types/                 # TypeScript type definitions
└── data/                  # Static data (attractions)
```

## 🎨 Customization

### Update Site Information

Edit `src/data/siteInfo.ts` to update resort details, amenities, and contact information.

### Add/Modify RV Sites

Use the admin panel at `/admin/sites` or manually add to Firestore `sites` collection.

### Customize Attractions

Edit `src/data/attractions.ts` to modify the Chattanooga activities list.

## 🚀 Deployment to Firebase

### 1. Build the Project

```powershell
npm run build
```

### 2. Deploy to Firebase Hosting

```powershell
firebase login
firebase init hosting
npm run deploy
```

### 3. Set Production Environment Variables

In Firebase Console:
- Go to Hosting settings
- Add environment variables for production Stripe keys
- Update `NEXT_PUBLIC_SITE_URL` to your domain

## 📊 Database Collections

### `sites`
Individual RV sites with photos, pricing, amenities

### `bookings`
All booking requests and confirmed reservations

### `pricingRules`
Dynamic pricing rules (seasonal, length-of-stay, etc.)

### `coupons`
Discount codes

### `settings`
Site-wide settings (single document)

### `activities`
Chattanooga attractions and things to do

### `contactMessages`
Inquiry form submissions

### `users`
Admin and guest accounts

## 🎯 Key Features Explained

### Booking Approval Workflow
1. Guest selects dates and site
2. System calculates price with all discounts
3. Guest pays 50% deposit via Stripe
4. Booking status = "pending"
5. Admin gets notification
6. Admin approves/rejects
7. Guest receives confirmation email

### Dynamic Pricing
- Base price per site
- Seasonal multipliers (summer, holidays, etc.)
- Length-of-stay discounts (weekly, monthly)
- Day-of-week pricing (weekend premium)
- Coupon codes
- All rules prioritized and stacked

### Pending Notifications
- Badge shows count of pending bookings
- Visible on all admin pages
- Can be turned off in settings
- Real-time updates

## 📞 Support

For questions about the River Life RV Resort booking system, contact the developer or refer to the inline code documentation.

## 📄 License

Proprietary - Built exclusively for River Life RV Resort

---

**Built with ❤️ for River Life RV Resort**
*Where the river meets the mountains*

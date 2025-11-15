# 🚀 QUICK START GUIDE - River Life RV Resort Booking System

## Step-by-Step Setup (15 minutes)

### ✅ STEP 1: Install Node.js Dependencies

Open PowerShell in this directory and run:

```powershell
npm install
```

This will install all required packages (Next.js, Firebase, Stripe, etc.)

---

### ✅ STEP 2: Set Up Firebase Project

1. **Go to Firebase Console:** https://console.firebase.google.com

2. **Create New Project:**
   - Click "Add project"
   - Name: `riverlife-rv-resort`
   - Disable Google Analytics (optional)
   - Click "Create project"

3. **Enable Authentication:**
   - In left sidebar: Build → Authentication
   - Click "Get started"
   - Enable "Email/Password" provider
   - Save

4. **Create Firestore Database:**
   - In left sidebar: Build → Firestore Database
   - Click "Create database"
   - Start in **Production mode**
   - Choose location: `us-central` (or closest to Chattanooga)
   - Click "Enable"

5. **Enable Storage:**
   - In left sidebar: Build → Storage
   - Click "Get started"
   - Start in **Production mode**
   - Click "Done"

6. **Get Your Firebase Config:**
   - Click the gear icon (⚙️) next to "Project Overview"
   - Click "Project settings"
   - Scroll down to "Your apps"
   - Click the web icon (</>)
   - Register app name: `riverlife-booking`
   - Copy the `firebaseConfig` object

---

### ✅ STEP 3: Set Up Stripe Account

1. **Go to Stripe:** https://dashboard.stripe.com/register

2. **Create Account** (if you don't have one)

3. **Get Test API Keys:**
   - In dashboard, click "Developers" → "API keys"
   - Copy **Publishable key** (starts with `pk_test_`)
   - Click "Reveal test key" for **Secret key** (starts with `sk_test_`)
   - Save both keys

---

### ✅ STEP 4: Configure Environment Variables

1. **Copy the example file:**
   ```powershell
   cp .env.local.example .env.local
   ```

2. **Edit `.env.local` file** with your actual values:

```env
# Firebase - Replace with YOUR values from Step 2
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=riverlife-rv-resort.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=riverlife-rv-resort
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=riverlife-rv-resort.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1234567890
NEXT_PUBLIC_FIREBASE_APP_ID=1:1234567890:web:...

# Stripe - Replace with YOUR test keys from Step 3
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

# Email for admin notifications
ADMIN_EMAIL=your-email@example.com

# Site URL (keep as localhost for now)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

### ✅ STEP 5: Initialize Database (First Time Only)

**IMPORTANT:** This creates your initial data structure.

```powershell
# Create Firestore security rules
firebase init firestore
# Select your project: riverlife-rv-resort
# Accept default firestore.rules
# Accept default firestore.indexes.json

# Deploy security rules
firebase deploy --only firestore:rules
```

---

### ✅ STEP 6: Run Development Server

```powershell
npm run dev
```

**Open your browser:** http://localhost:3000

You should see the River Life RV Resort homepage! 🎉

---

## 🔑 Create Your First Admin Account

1. With dev server running, go to: http://localhost:3000/admin/setup

2. Create admin account:
   - Email: your-email@example.com
   - Password: (choose a strong password)
   - Click "Create Admin Account"

3. Now you can access the admin panel: http://localhost:3000/admin

---

## 📱 Test the System

### Test Booking Flow:
1. Go to http://localhost:3000/sites
2. Select a site and dates
3. Fill out booking form
4. Use Stripe test card: `4242 4242 4242 4242`
5. Any future expiry date, any CVC

### Test Admin Panel:
1. Login at http://localhost:3000/admin
2. View pending booking
3. Approve or reject
4. Check revenue reports
5. Update pricing
6. Manage site photos

---

## 🗂️ Adding Your 9 RV Sites

### Option 1: Use Admin Panel (Easiest)
1. Go to http://localhost:3000/admin/sites
2. Click "Add New Site"
3. Fill in details for each site:
   - Site number (1-9)
   - Name (e.g., "Riverside Haven")
   - Description
   - Base price per night
   - Amenities
   - Upload photos

### Option 2: Import JSON Data
Create a file `sites-data.json` with your 9 sites:

```json
[
  {
    "siteNumber": 1,
    "name": "Riverside Haven",
    "description": "Premium riverfront location...",
    "basePrice": 75,
    "amenities": ["Full Hookup", "River View", "Fire Ring"],
    "maxRVLength": 45
  },
  // ... sites 2-9
]
```

Then import via admin panel.

---

## 📸 Adding Site Photos

1. Go to http://localhost:3000/admin/sites
2. Click on a site
3. Click "Manage Photos"
4. Upload images (drag & drop works!)
5. Reorder by dragging
6. Add captions
7. Save

**Photo Tips:**
- Use high-quality images (at least 1920x1080)
- Show different angles of each site
- Include sunrise/sunset photos
- Show amenities (hookups, fire rings, etc.)

---

## 🎨 Customizing Chattanooga Attractions

The attractions data is in `src/data/attractions.ts`

To modify:
1. Open the file
2. Edit existing attractions or add new ones
3. Include: name, description, distance, price range, highlights
4. Save file (changes auto-reload)

Or use admin panel: http://localhost:3000/admin/attractions

---

## 🚨 Common Issues & Solutions

### "Cannot find module 'firebase'"
**Solution:** Run `npm install` again

### "Firebase auth/configuration-not-found"
**Solution:** Check your `.env.local` file has correct Firebase config

### Stripe payments not working
**Solution:** Make sure you're using **test** keys (pk_test_ and sk_test_)

### Port 3000 already in use
**Solution:** 
```powershell
# Kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use different port
npm run dev -- -p 3001
```

---

## 🎯 Next Steps After Setup

1. ✅ Add your 9 RV sites with photos
2. ✅ Customize pricing for each site
3. ✅ Set up seasonal pricing rules
4. ✅ Create discount coupons
5. ✅ Configure cancellation policy
6. ✅ Test the complete booking flow
7. ✅ Add your actual contact information
8. ✅ Update the Airbnb availability toggle

---

## 📞 Need Help?

- Check `README.md` for detailed documentation
- Review code comments in each file
- Firebase docs: https://firebase.google.com/docs
- Stripe docs: https://stripe.com/docs
- Next.js docs: https://nextjs.org/docs

---

## 🚀 Ready to Deploy?

See `DEPLOYMENT.md` for instructions on deploying to Firebase Hosting (coming soon!)

**For now, focus on:**
1. Getting the local dev environment running
2. Adding your site data and photos
3. Testing the booking workflow
4. Customizing content to match your resort

---

**You've got this! 🎉**

The system is built to be mobile-first and easy to manage. 
Everything the owners need can be done from their phones!

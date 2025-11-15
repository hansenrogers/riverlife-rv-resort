# Booking Flow Documentation

Complete guide to the River Life RV Resort booking system with Stripe payment integration.

---

## Overview

The booking flow consists of **3 main pages** and **3 API routes** that work together to handle reservations and payments:

### Pages
1. **Booking Form** (`/booking/[siteId]`) - Guest information and booking details
2. **Stripe Checkout** (external) - Secure payment processing
3. **Confirmation** (`/booking/confirmation`) - Booking confirmation and next steps

### API Routes
1. **Create Checkout Session** (`/api/create-checkout-session`) - Initializes Stripe payment
2. **Verify Payment** (`/api/verify-payment`) - Confirms payment completion
3. **Stripe Webhook** (`/api/webhooks/stripe`) - Handles Stripe events

---

## Booking Flow Journey

### Step 1: User Selects Dates & Site

**From Site Detail Page:**
- User selects check-in and check-out dates
- System checks real-time availability
- Calculates pricing with discounts/coupons
- User clicks "Reserve Now"
- Redirects to `/booking/[siteId]?checkIn=...&checkOut=...&coupon=...`

### Step 2: Guest Information Form

**Form Fields:**

**Guest Information (Required):**
- First Name
- Last Name
- Email Address
- Phone Number
- Number of Guests (max per site)

**RV Details (RV sites only):**
- RV Make (optional)
- RV Model (optional)
- RV Length in feet (optional)
- License Plate (optional)

**Additional:**
- Special Requests (optional textarea)

**Terms & Conditions (Required):**
- ☑ Agree to Terms and Conditions
- ☑ Agree to Cancellation Policy

**Validation:**
- Uses `react-hook-form` + `zod` for form validation
- Real-time error messages
- Required fields clearly marked

### Step 3: Payment Processing

**When form is submitted:**

1. **Create Firestore Booking**
   - Status: `pending`
   - Payment Status: `pending`
   - Stores all guest info and booking details

2. **Create Stripe Checkout Session**
   - API call to `/api/create-checkout-session`
   - Charge amount: Deposit only (default 50% of total)
   - Includes booking metadata

3. **Redirect to Stripe Checkout**
   - Secure, hosted payment page
   - Guest enters card details
   - Stripe processes payment

### Step 4: Payment Completion

**Success Flow:**
- Stripe redirects to `/booking/confirmation?session_id=...&booking_id=...`
- Page calls `/api/verify-payment`
- Updates booking:
  - Payment Status: `deposit_paid`
  - Stores Payment Intent ID
  - Sets `pricing.depositPaid = true`

**Cancel Flow:**
- User clicks "Back" during Stripe checkout
- Redirects to booking form with dates preserved
- Booking remains in Firestore with `pending` status

**Webhook (Background):**
- Stripe sends `checkout.session.completed` event
- `/api/webhooks/stripe` updates booking status
- Ensures payment confirmation even if user closes browser

### Step 5: Confirmation Page

**Displays:**
- ✅ Success message
- Booking confirmation ID
- Complete booking details
- Payment summary (deposit paid + balance due)
- What happens next (approval timeline)
- Contact information

**Email Notification:**
- Automatic confirmation email sent by Stripe
- Contains receipt and booking details
- Guest can save for records

---

## Code Structure

### Booking Form Component

**Location:** `src/app/booking/[siteId]/page.tsx`

**Key Features:**
```typescript
// Load site and verify availability
useEffect(() => {
  const siteData = await getSiteById(siteId);
  const available = await checkSiteAvailability(siteId, checkInDate, checkOutDate);
  const pricing = await calculateBookingPrice(siteId, checkInDate, checkOutDate, couponCode);
});

// Form submission
const onSubmit = async (data: BookingFormData) => {
  // 1. Create booking in Firestore
  const bookingId = await createBooking({...});
  
  // 2. Create Stripe checkout session
  const response = await fetch('/api/create-checkout-session', {...});
  
  // 3. Redirect to Stripe
  const stripe = await stripePromise;
  await stripe.redirectToCheckout({ sessionId });
};
```

**Sidebar Summary:**
- Site image and name
- Check-in/out dates
- Price breakdown:
  - Base price × nights
  - Discounts applied
  - Tax
  - **Total**
  - **Deposit due now**
  - Balance due at check-in

### API Routes

#### Create Checkout Session

**Location:** `src/app/api/create-checkout-session/route.ts`

```typescript
export async function POST(request: NextRequest) {
  // Creates Stripe Checkout Session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: {
          name: `${siteName} - Deposit`,
          description: `${nights} nights • ${checkIn} to ${checkOut}`,
        },
        unit_amount: Math.round(depositAmount * 100), // Cents
      },
      quantity: 1,
    }],
    mode: 'payment',
    success_url: `${siteUrl}/booking/confirmation?session_id={CHECKOUT_SESSION_ID}&booking_id=${bookingId}`,
    cancel_url: `${siteUrl}/booking/${siteId}?checkIn=${checkIn}&checkOut=${checkOut}`,
    metadata: { bookingId, siteId, ... },
  });
  
  return NextResponse.json({ sessionId: session.id });
}
```

#### Verify Payment

**Location:** `src/app/api/verify-payment/route.ts`

```typescript
export async function POST(request: NextRequest) {
  const { sessionId, bookingId } = await request.json();
  
  // Retrieve session from Stripe
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  
  // Verify payment completed
  if (session.payment_status !== 'paid') {
    return NextResponse.json({ error: 'Payment not completed' });
  }
  
  // Update booking
  await updateDoc(bookingRef, {
    paymentStatus: 'deposit_paid',
    paymentIntentId: session.payment_intent,
  });
  
  return NextResponse.json({ booking: {...} });
}
```

#### Stripe Webhook

**Location:** `src/app/api/webhooks/stripe/route.ts`

**Handles Events:**
- `checkout.session.completed` - Payment succeeded
- `payment_intent.succeeded` - Confirms payment
- `payment_intent.payment_failed` - Payment failed
- `charge.refunded` - Refund processed

```typescript
export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');
  
  // Verify webhook signature
  const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  
  // Handle event
  switch (event.type) {
    case 'checkout.session.completed':
      // Update booking status
      await updateDoc(bookingRef, {
        paymentStatus: 'deposit_paid',
        paymentIntentId: session.payment_intent,
      });
      break;
  }
}
```

---

## Firestore Data Model

### Booking Document

```typescript
{
  id: "auto-generated-id",
  siteId: "site-doc-id",
  siteName: "Riverside Retreat",
  
  guestInfo: {
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    phone: "(555) 123-4567",
    address: "123 Main St", // Optional, for future use
    city: "Nashville",
    state: "TN",
    zipCode: "37201"
  },
  
  checkIn: Timestamp("2025-06-15"),
  checkOut: Timestamp("2025-06-18"),
  numberOfNights: 3,
  numberOfGuests: 4,
  
  rvDetails: { // Only for RV sites
    make: "Winnebago",
    model: "Vista",
    length: 32,
    licensePlate: "ABC-1234"
  },
  
  pricing: {
    subtotal: 225.00,
    discount: 22.50,
    discountReason: "Weekly stay discount 10%",
    tax: 18.73,
    total: 221.23,
    depositAmount: 110.62, // 50% of total
    depositPaid: true,
    remainingBalance: 110.61
  },
  
  status: "pending", // pending | approved | rejected | confirmed | cancelled | completed
  paymentStatus: "deposit_paid", // pending | deposit_paid | fully_paid | refunded
  paymentIntentId: "pi_...", // Stripe Payment Intent ID
  
  couponCode: "SAVE20", // Optional
  specialRequests: "Early check-in if possible", // Optional
  
  createdAt: Timestamp,
  updatedAt: Timestamp,
  approvedAt: Timestamp, // Set when admin approves
  approvedBy: "admin-user-id" // Admin who approved
}
```

---

## Stripe Integration Details

### Test Mode Setup

**1. Get API Keys:**
- Dashboard → Developers → API keys
- Copy **Publishable key** (starts with `pk_test_`)
- Copy **Secret key** (starts with `sk_test_`)

**2. Environment Variables:**
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_... # From webhook endpoint
```

**3. Test Cards:**
```
Success: 4242 4242 4242 4242
Decline: 4000 0000 0000 0002
3D Secure: 4000 0025 0000 3155

Expiry: Any future date
CVC: Any 3 digits
ZIP: Any 5 digits
```

### Webhook Setup

**1. Create Webhook Endpoint:**
- Dashboard → Developers → Webhooks
- Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
- Select events:
  - `checkout.session.completed`
  - `payment_intent.succeeded`
  - `payment_intent.payment_failed`
  - `charge.refunded`

**2. Get Signing Secret:**
- Copy webhook signing secret
- Add to `.env.local` as `STRIPE_WEBHOOK_SECRET`

**3. Test Locally:**
```bash
# Install Stripe CLI
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Trigger test events
stripe trigger checkout.session.completed
```

### Production Mode

**1. Switch to Live Keys:**
- Get live keys from Stripe Dashboard
- Update `.env.production` with `pk_live_` and `sk_live_` keys

**2. Update Webhook URL:**
- Change to production domain
- Update signing secret

**3. Enable Payment Methods:**
- Configure accepted cards (Visa, Mastercard, Amex, etc.)
- Optional: Add Apple Pay, Google Pay

---

## Pricing Configuration

### Deposit Percentage

**Configurable in:** `src/data/sampleSites.ts` → `sampleSettings`

```typescript
export const sampleSettings = {
  depositPercentage: 50, // 50% deposit, 50% due at check-in
  // Change to 100 for full payment upfront
  // Change to 25 for 25% deposit
};
```

### Tax Rate

```typescript
export const sampleSettings = {
  taxRate: 9.25, // Tennessee state + local tax
  // Update to your local tax rate
};
```

### Dynamic Pricing

**Automatically applies:**
1. **Seasonal Rates** - Different prices by date range
2. **Length of Stay Discounts** - Discounts for 7+ nights
3. **Day of Week Pricing** - Weekend premiums
4. **Coupon Codes** - Percentage or fixed discounts

---

## Security Considerations

### Payment Security
- ✅ PCI compliance handled by Stripe (no card data touches server)
- ✅ Secure HTTPS required for production
- ✅ Webhook signature verification prevents tampering
- ✅ Payment Intent metadata links to booking

### Data Protection
- ✅ Firestore security rules required (see deployment docs)
- ✅ Admin-only access to sensitive booking data
- ✅ No plain-text storage of payment details
- ✅ Guest PII protected by Firebase Auth rules

### Validation
- ✅ Client-side form validation (Zod schema)
- ✅ Server-side availability checking
- ✅ Double-check dates before creating booking
- ✅ Prevent duplicate bookings with availability lock

---

## Testing Checklist

### Booking Form
- [ ] Form loads with correct site and dates
- [ ] All validation errors display properly
- [ ] RV details show only for RV sites
- [ ] Special requests textarea works
- [ ] Terms checkboxes are required
- [ ] Pricing summary matches expected amounts
- [ ] Coupon code applies correctly

### Payment Flow
- [ ] Stripe checkout opens successfully
- [ ] Test card payment processes
- [ ] Success redirect works
- [ ] Cancel redirect preserves data
- [ ] Payment verification succeeds
- [ ] Booking status updates in Firestore

### Confirmation Page
- [ ] Displays all booking details correctly
- [ ] Shows proper confirmation ID
- [ ] Payment amounts accurate
- [ ] Next steps clearly outlined
- [ ] Contact information visible
- [ ] Links to homepage and sites work

### Error Handling
- [ ] Invalid site ID redirects properly
- [ ] Unavailable dates show error
- [ ] Payment failures handled gracefully
- [ ] Network errors display user-friendly messages
- [ ] Missing parameters caught and handled

---

## Common Issues & Solutions

### Issue: "Site not available"
**Cause:** Another booking exists for selected dates  
**Solution:** Check Firestore bookings collection for conflicts

### Issue: Stripe checkout fails to load
**Cause:** Invalid publishable key or network error  
**Solution:** Verify `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` in `.env.local`

### Issue: Payment succeeds but booking not updated
**Cause:** Webhook not configured or failed  
**Solution:** Check webhook endpoint is accessible and signing secret is correct

### Issue: Form validation errors not clearing
**Cause:** react-hook-form state not resetting  
**Solution:** Ensure proper form reset on successful submission

---

## Next Steps

With the booking flow complete, you can:

1. **Test End-to-End:** Make a test booking from site selection to confirmation
2. **Build Admin Dashboard:** Create interface to approve/reject bookings
3. **Email Notifications:** Set up automated emails for booking status changes
4. **Add More Payment Methods:** Enable Apple Pay, Google Pay, ACH
5. **Enhance UX:** Add progress indicators, better mobile keyboard handling

The booking system is now fully functional! 🎉

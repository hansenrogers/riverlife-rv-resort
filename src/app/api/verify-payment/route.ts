import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { db } from '@/lib/firebase/config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
});

export async function POST(request: NextRequest) {
  try {
    const { sessionId, bookingId } = await request.json();

    if (!sessionId || !bookingId) {
      return NextResponse.json(
        { error: 'Missing session ID or booking ID' },
        { status: 400 }
      );
    }

    // Retrieve Stripe session
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      return NextResponse.json(
        { error: 'Payment not completed' },
        { status: 400 }
      );
    }

    // Get booking from Firestore
    const bookingRef = doc(db, 'bookings', bookingId);
    const bookingSnap = await getDoc(bookingRef);

    if (!bookingSnap.exists()) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    const bookingData = bookingSnap.data();

    // Update booking with payment info
    await updateDoc(bookingRef, {
      paymentStatus: 'deposit_paid',
      paymentIntentId: session.payment_intent,
      'pricing.depositPaid': true,
      updatedAt: new Date(),
    });

    // Return booking details
    return NextResponse.json({
      booking: {
        id: bookingId,
        ...bookingData,
        paymentStatus: 'deposit_paid',
      },
    });
  } catch (error: any) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to verify payment' },
      { status: 500 }
    );
  }
}

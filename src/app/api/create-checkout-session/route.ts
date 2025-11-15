import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      bookingId,
      siteId,
      siteName,
      checkIn,
      checkOut,
      nights,
      depositAmount,
      guestEmail,
      guestName,
    } = body;

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${siteName} - Deposit`,
              description: `${nights} night${nights > 1 ? 's' : ''} • ${checkIn} to ${checkOut}`,
              images: [`${process.env.NEXT_PUBLIC_SITE_URL}/images/logo.png`],
            },
            unit_amount: Math.round(depositAmount * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/booking/confirmation?session_id={CHECKOUT_SESSION_ID}&booking_id=${bookingId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/booking/${siteId}?checkIn=${checkIn}&checkOut=${checkOut}`,
      customer_email: guestEmail,
      metadata: {
        bookingId,
        siteId,
        siteName,
        checkIn,
        checkOut,
        nights: nights.toString(),
        depositAmount: depositAmount.toString(),
      },
      payment_intent_data: {
        metadata: {
          bookingId,
          siteId,
        },
      },
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}

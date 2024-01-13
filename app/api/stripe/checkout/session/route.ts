import { createCheckoutSession } from '@/app/lib/stripe/checkout';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const stripeCheckoutSession = await createCheckoutSession(body.priceId);
  if (!stripeCheckoutSession.url) {
    throw new Error('Could not create a Stripe Checkout session.');
  }
  return NextResponse.json({ url: stripeCheckoutSession.url });
}

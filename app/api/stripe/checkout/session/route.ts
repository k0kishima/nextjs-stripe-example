import { createCheckoutSession } from '@/app/lib/stripe/checkout';
import { createOrUpdateStripeCustomer } from '@/app/lib/stripe/customer';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

export async function POST(request: NextRequest) {
  const session = await auth();
  const user = session?.user;
  if (user == null) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const stripeCustomerId = await createOrUpdateStripeCustomer(user);

  const body = await request.json();
  const stripeCheckoutSession = await createCheckoutSession(
    body.priceId,
    stripeCustomerId,
  );
  if (!stripeCheckoutSession.url) {
    throw new Error('Could not create a Stripe Checkout session.');
  }
  return NextResponse.json({ url: stripeCheckoutSession.url });
}

import Stripe from 'stripe';
import { NextRequest, NextResponse } from 'next/server';
import getStripeInstance from '@/app/lib/stripe/client';
import { sql } from '@vercel/postgres';

export async function POST(request: NextRequest) {
  const signature = request.headers.get('stripe-signature');
  if (signature == null) {
    return NextResponse.json({ message: 'Signature missing' }, { status: 401 });
  }
  const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
  if (!STRIPE_WEBHOOK_SECRET) {
    throw new Error('STRIPE_WEBHOOK_SECRET environment variable is not set.');
  }

  const stripe = getStripeInstance();
  const body = await request.text();
  const event = stripe.webhooks.constructEvent(
    body,
    signature,
    STRIPE_WEBHOOK_SECRET,
  );

  if (event.type === 'invoice.payment_succeeded') {
    return NextResponse.json(handlePaymentSucceededEvent(event));
  } else {
    console.log(`Unhandled event type: ${event.type}`);
    return NextResponse.json(
      { message: 'Ignored event type' },
      { status: 200 },
    );
  }
}

async function handlePaymentSucceededEvent(event: Stripe.Event) {
  const invoice = event.data.object as Stripe.Invoice;
  const stripeSubscriptionId = invoice.subscription as string;
  const stripeCustomerId = invoice.customer as string;

  const { rows: userRows } = await sql<{ id: string }>`
    SELECT user_id as id FROM stripe_customers WHERE stripe_customer_id = ${stripeCustomerId}
  `;

  if (userRows.length === 0) {
    console.error('User not found for Stripe Customer ID:', stripeCustomerId);
    return { status: 404, message: 'User not found' };
  }
  const userId = userRows[0].id;

  try {
    await sql`
      INSERT INTO subscriptions (
        user_id,
        stripe_subscription_id,
        stripe_invoice_id,
        start_timestamp,
        end_timestamp
      )
      VALUES (
        ${userId},
        ${stripeSubscriptionId},
        ${invoice.id},
        to_timestamp(${invoice.lines.data[0].period.start}),
        to_timestamp(${invoice.lines.data[0].period.end})
      )
    `;
    return { status: 200, message: 'Subscription record created' };
  } catch (err) {
    console.error('Error inserting subscription record:', err);
    return { status: 500, message: 'Internal Server Error' };
  }
}

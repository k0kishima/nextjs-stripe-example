'use server';

import Stripe from 'stripe';
import getStripeInstance from './client';

export async function createCheckoutSession(
  stripePriceId: string,
  customerId?: string,
): Promise<Stripe.Checkout.Session> {
  const stripe = getStripeInstance();
  const APP_BASE_URL = process.env.APP_BASE_URL;
  if (!APP_BASE_URL) {
    throw new Error('APP_BASE_URL environment variable is not set.');
  }

  const sessionParams: Stripe.Checkout.SessionCreateParams = {
    payment_method_types: ['card'],
    line_items: [{ price: stripePriceId, quantity: 1 }],
    mode: 'subscription',
    success_url: `${APP_BASE_URL}/dashboard`,
    cancel_url: `${APP_BASE_URL}/dashboard/pricing`,
  };
  if (customerId) {
    sessionParams.customer = customerId;
  }

  return stripe.checkout.sessions.create(sessionParams);
}

'use server';

import Stripe from 'stripe';

let stripeInstance: Stripe;

const getStripeInstance = () => {
  if (!stripeInstance) {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
      throw new Error('STRIPE_SECRET_KEY env is not set');
    }
    const apiVersion = '2023-10-16';
    stripeInstance = new Stripe(stripeSecretKey, { apiVersion });
  }

  return stripeInstance;
};

export default getStripeInstance;

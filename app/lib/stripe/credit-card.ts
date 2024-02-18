'use server';

import getStripeInstance from './client';

export const getCreditCard = async (stripeSubscriptionId: string) => {
  const stripe = getStripeInstance();

  const subscription =
    await stripe.subscriptions.retrieve(stripeSubscriptionId);

  const paymentMethodId = subscription.default_payment_method;
  if (!paymentMethodId || typeof paymentMethodId !== 'string') {
    throw new Error('No default payment method found for this subscription.');
  }

  const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);
  if (paymentMethod.type !== 'card') {
    throw new Error('Default payment method is not a credit card.');
  }

  const card = paymentMethod.card;
  if (!card) {
    throw new Error('No card details found for this payment method.');
  }

  return {
    last4: card.last4,
    brand: card.brand,
    exp_month: card.exp_month,
    exp_year: card.exp_year,
  };
};

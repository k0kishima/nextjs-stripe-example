'use server';

import getStripeInstance from './client';

export const cancelSubscription = async (stripeSubscriptionId: string) => {
  const stripe = getStripeInstance();

  const updatedSubscription = await stripe.subscriptions.update(
    stripeSubscriptionId,
    {
      cancel_at_period_end: true,
    },
  );

  return {
    id: updatedSubscription.id,
    current_period_end: updatedSubscription.current_period_end,
    status: updatedSubscription.status,
  };
};

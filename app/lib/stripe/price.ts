'use server';

import Stripe from 'stripe';
import { Price, Currency, Interval } from '@/types';
import getStripeInstance from './client';

const mapStripePriceToPrice = (priceData: Stripe.Price): Price => {
  if (priceData.unit_amount == null) {
    throw new Error(`Amount must be set.`);
  }
  if (priceData.currency !== 'usd') {
    throw new Error(`Unsupported currency: ${priceData.currency}`);
  }
  const interval = priceData.recurring?.interval;
  if (!interval || !['day', 'month', 'week', 'year'].includes(interval)) {
    throw new Error(`Unsupported interval: ${interval}`);
  }

  return {
    id: priceData.id,
    unit_amount: priceData.unit_amount,
    currency: priceData.currency as Currency,
    interval: interval as Interval,
  };
};

export const getPricesForProduct = async (
  productId: string,
): Promise<Price[]> => {
  const stripe = getStripeInstance();
  const response = await stripe.prices.list({
    product: productId,
  });

  return response.data.map(mapStripePriceToPrice);
};

import { getPricesForProduct } from '@/app/lib/stripe/price';
import PriceCard from './price-card';

export default async function PriceList() {
  const STRIPE_PRODUCT_ID = process.env.STRIPE_PRODUCT_ID;
  if (STRIPE_PRODUCT_ID == null) {
    throw new Error(`Stripe product id must be set.`);
  }

  const prices = await getPricesForProduct(STRIPE_PRODUCT_ID);
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {prices.map((price) => (
        <PriceCard key={price.id} price={price} />
      ))}
    </div>
  );
}

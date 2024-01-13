'use client';

import { Price } from '@/types';
import { formatCurrency } from '@/app/lib/utils';

export default function PriceCard({ price }: { price: Price }) {
  const handleChoosePlanClick = async (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
    const response = await fetch('/api/stripe/checkout/session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ priceId: price.id }),
    });
    const session = await response.json();
    window.location.href = session.url;
  };

  return (
    <div
      key={price.id}
      className="flex flex-col rounded-lg bg-white p-6 shadow-md"
    >
      <div className="flex-1">
        <p className="my-4 text-lg font-bold">
          {formatCurrency(price.unit_amount)} / {price.interval}
        </p>
      </div>
      <button
        className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
        onClick={handleChoosePlanClick}
      >
        Choose Plan
      </button>
    </div>
  );
}

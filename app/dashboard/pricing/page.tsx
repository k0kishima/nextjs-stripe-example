import { lusitana } from '@/app/ui/fonts';
import PriceList from '@/app/ui/pricing/price-list';
import { Suspense } from 'react';
import { PriceListSkeleton } from '@/app/ui/skeletons';

export default function Page() {
  return (
    <main className="p-4">
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Pricing
      </h1>

      <Suspense fallback={<PriceListSkeleton />}>
        <PriceList />
      </Suspense>
    </main>
  );
}

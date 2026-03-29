import type { Metadata } from 'next';
import { Suspense } from 'react';
import CollectionsClient from './CollectionsClient';
import { PAGE_META } from '@/lib/constants';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';

export const metadata: Metadata = {
  title: PAGE_META.collections.title,
  description: PAGE_META.collections.description,
};

function CollectionsLoading() {
  return (
    <div className="min-h-screen bg-ivory pt-20 sm:pt-24">
      <div className="bg-pearl border-b border-platinum">
        <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="h-4 w-32 shimmer rounded-sm mb-3" />
          <div className="h-10 w-64 shimmer rounded-sm" />
        </div>
      </div>
      <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex gap-8">
          <div className="hidden lg:block w-64 shrink-0">
            <div className="flex flex-col gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-6 shimmer rounded-sm" />
              ))}
            </div>
          </div>
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-5 sm:gap-7">
            {Array.from({ length: 9 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CollectionsPage() {
  return (
    <Suspense fallback={<CollectionsLoading />}>
      <CollectionsClient />
    </Suspense>
  );
}

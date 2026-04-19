'use client';

import React, { useEffect, useState } from 'react';
import type { Product } from '@/types';
import { TiltProductCard } from '@/components/ui/tilt-product-card';

interface RelatedProductsFeedProps {
  currentProductId: string;
  category: string;
}

export default function RelatedProductsFeed({
  currentProductId,
  category,
}: RelatedProductsFeedProps) {
  const [related, setRelated] = useState<Product[]>([]);

  useEffect(() => {
    import('@/lib/api').then(({ getProducts }) =>
      getProducts().then((products) => {
        setRelated(
          products
            .filter((p) => p.id !== currentProductId && p.category === category)
            .slice(0, 6),
        );
      }),
    );
  }, [currentProductId, category]);

  if (related.length === 0) return null;

  return (
    <section
      className="py-16 px-4 sm:px-6 lg:px-8 bg-pearl"
      aria-labelledby="related-heading"
    >
      <div className="max-w-site mx-auto">
        <div className="mb-8">
          <p className="font-body font-semibold text-xs tracking-[0.4em] uppercase text-gold mb-2">
            Further in the Atelier
          </p>
          <h2 id="related-heading" className="font-display text-fluid-h3 text-obsidian">
            You May Also Love
          </h2>
        </div>

        <div className="overflow-x-auto -mx-4 sm:mx-0 pb-2">
          <div className="flex gap-5 px-4 sm:px-0 sm:grid sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 min-w-max sm:min-w-0">
            {related.map((product) => (
              <div
                key={product.id}
                className="w-52 sm:w-auto shrink-0 sm:shrink aspect-[4/5]"
              >
                <TiltProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

import React from 'react';
import type { Product } from '@/types';
import { products } from '@/data/products';
import ProductCard from './ProductCard';

interface RelatedProductsProps {
  currentProductId: string;
  category: Product['category'];
}

export default function RelatedProducts({
  currentProductId,
  category,
}: RelatedProductsProps) {
  const related = products
    .filter((p) => p.id !== currentProductId && p.category === category)
    .slice(0, 6);

  if (related.length === 0) return null;

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-pearl" aria-labelledby="related-heading">
      <div className="max-w-site mx-auto">
        <h2
          id="related-heading"
          className="font-display text-fluid-h3 text-obsidian mb-8"
        >
          You May Also Love
        </h2>

        {/* Horizontal scroll on mobile, grid on desktop */}
        <div className="overflow-x-auto -mx-4 sm:mx-0 pb-2">
          <div className="flex gap-5 px-4 sm:px-0 sm:grid sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 min-w-max sm:min-w-0">
            {related.map((product, index) => (
              <div key={product.id} className="w-48 sm:w-auto shrink-0 sm:shrink">
                <ProductCard product={product} index={index} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

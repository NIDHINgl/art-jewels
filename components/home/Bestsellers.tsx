'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { products } from '@/data/products';
import ProductCard from '@/components/product/ProductCard';
import { useInView } from '@/lib/hooks';

export default function Bestsellers() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { threshold: 0.05 });

  const featured = products
    .filter((p) => p.isFeatured || p.isBestseller)
    .slice(0, 8);

  return (
    <section
      ref={sectionRef}
      className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-ivory"
      aria-labelledby="bestsellers-heading"
    >
      <div className="max-w-site mx-auto">
        {/* Header */}
        <div
          className={[
            'flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12',
            'transition-all duration-700',
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
          ].join(' ')}
        >
          <div>
            <p className="font-body font-semibold text-sm tracking-[0.4em] uppercase text-gold mb-2">
              Curated Picks
            </p>
            <h2
              id="bestsellers-heading"
              className="font-display text-fluid-h2 text-obsidian"
            >
              Most Beloved Pieces
            </h2>
          </div>
          <Link
            href="/collections"
            className="inline-flex items-center gap-2 font-body font-medium text-sm tracking-wider text-gold hover:text-gold-light transition-colors group shrink-0"
          >
            View all
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" aria-hidden="true" />
          </Link>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
          {featured.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

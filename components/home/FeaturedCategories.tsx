'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { Product } from '@/types';
import { useInView } from '@/lib/hooks';

interface FeaturedCategoriesProps {
  products: Product[];
}

const CATEGORY_CONFIG = [
  { category: 'rings',     label: 'Rings',    gradient: 'from-[hsl(43,40%,25%)] to-[hsl(20,30%,15%)]' },
  { category: 'necklaces', label: 'Necklaces', gradient: 'from-[hsl(220,20%,25%)] to-[hsl(220,30%,15%)]' },
  { category: 'earrings',  label: 'Earrings', gradient: 'from-[hsl(350,25%,25%)] to-[hsl(350,30%,15%)]' },
  { category: 'bracelets', label: 'Bracelets', gradient: 'from-[hsl(60,15%,25%)] to-[hsl(43,20%,15%)]' },
  { category: 'anklets',   label: 'Anklets',  gradient: 'from-[hsl(180,15%,22%)] to-[hsl(200,20%,14%)]' },
  { category: 'custom',    label: 'Custom',   gradient: 'from-[hsl(270,15%,25%)] to-[hsl(280,20%,15%)]' },
];

export default function FeaturedCategories({ products }: FeaturedCategoriesProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { threshold: 0.1 });

  // Live counts from real product data
  const countByCategory = (cat: string) =>
    products.filter((p) => p.category === cat).length;

  return (
    <section
      ref={sectionRef}
      className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-pearl"
      aria-labelledby="categories-heading"
    >
      <div className="max-w-site mx-auto">
        <div
          className={[
            'text-center mb-14 transition-all duration-700',
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6',
          ].join(' ')}
        >
          <p className="font-accent text-sm tracking-[0.4em] uppercase text-gold mb-3">Browse by Form</p>
          <h2 id="categories-heading" className="font-display text-fluid-h2 text-obsidian">
            The Collection
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORY_CONFIG.map(({ category, label, gradient }, index) => {
            const count = countByCategory(category);
            return (
              <Link
                key={category}
                href={`/collections?category=${category}`}
                className="group relative overflow-hidden rounded-sm aspect-[3/4] flex flex-col justify-end"
                style={{ transitionDelay: `${index * 60}ms` }}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${gradient} group-hover:scale-105 transition-transform duration-700`}
                  aria-hidden="true"
                />
                <div
                  className="absolute inset-0 border-2 border-transparent group-hover:border-gold/60 transition-all duration-300 z-10"
                  aria-hidden="true"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-obsidian/80 via-obsidian/20 to-transparent"
                  aria-hidden="true"
                />
                <div className="relative z-10 p-4">
                  <p className="font-display text-base font-semibold text-white leading-tight">{label}</p>
                  <p className="font-accent text-xs text-white/60 mt-0.5">
                    {count} piece{count !== 1 ? 's' : ''}
                  </p>
                </div>
                <div
                  className="absolute top-3 right-3 w-7 h-7 bg-gold/0 group-hover:bg-gold/90 rounded-full flex items-center justify-center transition-all duration-300 z-10 opacity-0 group-hover:opacity-100"
                  aria-hidden="true"
                >
                  <ArrowRight size={12} className="text-white" />
                </div>
              </Link>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/collections"
            className="inline-flex items-center gap-2 font-accent text-sm tracking-wider text-gold hover:text-gold-light transition-colors group"
          >
            View entire collection
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}

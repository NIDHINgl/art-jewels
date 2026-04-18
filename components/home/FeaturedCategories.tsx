'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { Product } from '@/types';
import { useInView } from '@/lib/hooks';
import { DestinationCard } from '@/components/ui/card-21';

interface FeaturedCategoriesProps {
  products: Product[];
}

// HSL tuples in "H S% L%" form for the DestinationCard's --theme-color
// ornament is a small inline glyph shown beside the category label
const CATEGORY_CONFIG = [
  {
    category: 'rings',
    label: 'Rings',
    themeColor: '43 50% 22%',        // gold-obsidian
    ornament: '◆',
    image: '/images/PHOTO-2026-03-30-00-55-28.webp',
  },
  {
    category: 'necklaces',
    label: 'Necklaces',
    themeColor: '354 42% 24%',       // velvet wine
    ornament: '✦',
    image: '/images/PHOTO-2026-03-30-00-55-41.webp',
  },
  {
    category: 'earrings',
    label: 'Earrings',
    themeColor: '350 34% 32%',       // rose-gold deepened
    ornament: '❖',
    image: '/images/PHOTO-2026-03-30-00-55-52.webp',
  },
  {
    category: 'bracelets',
    label: 'Bracelets',
    themeColor: '30 55% 24%',        // warm amber
    ornament: '◇',
    image: '/images/PHOTO-2026-03-30-00-56-04.webp',
  },
  {
    category: 'anklets',
    label: 'Anklets',
    themeColor: '0 0% 14%',          // obsidian
    ornament: '◈',
    image: '/images/PHOTO-2026-03-30-00-55-41.webp',
  },
  {
    category: 'custom',
    label: 'Custom',
    themeColor: '34 40% 26%',        // deep champagne
    ornament: '✧',
    image: '/images/PHOTO-2026-03-30-00-56-04.webp',
  },
];

export default function FeaturedCategories({ products }: FeaturedCategoriesProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { threshold: 0.1 });

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
          <p className="font-accent text-sm tracking-[0.4em] uppercase text-gold mb-3">
            Browse by Form
          </p>
          <h2 id="categories-heading" className="font-display text-fluid-h2 text-obsidian">
            The Collection
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORY_CONFIG.map(({ category, label, themeColor, ornament, image }, index) => {
            const count = countByCategory(category);
            return (
              <div
                key={category}
                className={[
                  'aspect-[3/4] transition-all duration-700',
                  isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6',
                ].join(' ')}
                style={{ transitionDelay: `${index * 70}ms` }}
              >
                <DestinationCard
                  imageUrl={image}
                  location={label}
                  flag={ornament}
                  stats={`${count} piece${count !== 1 ? 's' : ''}`}
                  href={`/collections?category=${category}`}
                  themeColor={themeColor}
                  cta="Shop"
                />
              </div>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/collections"
            className="inline-flex items-center gap-2 font-accent text-sm tracking-wider text-gold hover:text-gold-light transition-colors group"
          >
            View entire collection
            <ArrowRight
              size={14}
              className="group-hover:translate-x-1 transition-transform"
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}

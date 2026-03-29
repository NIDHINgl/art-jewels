'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { categoryCards } from '@/data/products';

import { useInView } from '@/lib/hooks';

export default function FeaturedCategories() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { threshold: 0.1 });

  return (
    <section
      ref={sectionRef}
      className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-pearl"
      aria-labelledby="categories-heading"
    >
      <div className="max-w-site mx-auto">
        {/* Section header */}
        <div
          className={[
            'text-center mb-14 transition-all duration-700',
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6',
          ].join(' ')}
        >
          <p className="font-accent text-sm tracking-[0.4em] uppercase text-gold mb-3">
            Browse by Form
          </p>
          <h2
            id="categories-heading"
            className="font-display text-fluid-h2 text-obsidian"
          >
            The Collection
          </h2>
        </div>

        {/* Category grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categoryCards.map(({ category, label, image, count }, index) => (
            <Link
              key={category}
              href={`/collections?category=${category}`}
              className="group relative overflow-hidden rounded-sm bg-platinum/40 aspect-[3/4] flex flex-col justify-end"
              style={{
                transitionDelay: `${index * 60}ms`,
              }}
            >
              {image ? (
                <div
                  className="absolute inset-0 transition-transform duration-700 group-hover:scale-105"
                  aria-hidden="true"
                >
                  <Image
                    src={image}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                    className="object-cover"
                  />
                </div>
              ) : (
                <div
                  className={[
                    'absolute inset-0 transition-transform duration-700',
                    'group-hover:scale-105',
                    getCategoryGradient(category),
                  ].join(' ')}
                  aria-hidden="true"
                />
              )}

              {/* Gold border reveal on hover */}
              <div
                className="absolute inset-0 border-2 border-transparent group-hover:border-gold/60 transition-all duration-300 z-10"
                aria-hidden="true"
              />

              {/* Overlay */}
              <div
                className="absolute inset-0 bg-gradient-to-t from-obsidian/80 via-obsidian/20 to-transparent"
                aria-hidden="true"
              />

              {/* Content */}
              <div className="relative z-10 p-4">
                <p className="font-display text-base font-semibold text-white leading-tight">
                  {label}
                </p>
                <p className="font-accent text-xs text-white/60 mt-0.5">
                  {count} piece{count !== 1 ? 's' : ''}
                </p>
              </div>

              {/* Arrow on hover */}
              <div
                className="absolute top-3 right-3 w-7 h-7 bg-gold/0 group-hover:bg-gold/90 rounded-full flex items-center justify-center transition-all duration-300 z-10 opacity-0 group-hover:opacity-100"
                aria-hidden="true"
              >
                <ArrowRight size={12} className="text-white" />
              </div>

              {/* Animate in */}
              <div
                className={[
                  'absolute inset-0 transition-all duration-500',
                  isInView
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-4',
                ].join(' ')}
                style={{ transitionDelay: `${index * 80}ms` }}
                aria-hidden="true"
              />
            </Link>
          ))}
        </div>

        {/* View all */}
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

function getCategoryGradient(category: string): string {
  const gradients: Record<string, string> = {
    rings: 'bg-gradient-to-br from-[hsl(43,40%,25%)] to-[hsl(20,30%,15%)]',
    necklaces: 'bg-gradient-to-br from-[hsl(220,20%,25%)] to-[hsl(220,30%,15%)]',
    earrings: 'bg-gradient-to-br from-[hsl(350,25%,25%)] to-[hsl(350,30%,15%)]',
    bracelets: 'bg-gradient-to-br from-[hsl(60,15%,25%)] to-[hsl(43,20%,15%)]',
    anklets: 'bg-gradient-to-br from-[hsl(180,15%,22%)] to-[hsl(200,20%,14%)]',
    custom: 'bg-gradient-to-br from-[hsl(270,15%,25%)] to-[hsl(280,20%,15%)]',
  };
  return gradients[category] ?? 'bg-obsidian';
}

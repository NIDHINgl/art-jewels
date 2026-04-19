'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { Eye, Instagram } from 'lucide-react';
import { SELLER_INSTAGRAM } from '@/lib/constants';
import { useInView } from '@/lib/hooks';

/**
 * Bento layout — 6 cells fill a 4×4 grid cleanly on desktop:
 *   [A A][B]  ← A is col-span-2 row-span-2
 *   [A A][C]
 *   [D][E E]  ← E is col-span-2
 *   [F][E E]  ← E is row-span-2 → fills [E E] / [E E]
 * Final: 4+1+1+2+2+1+1 = does not quite work — use explicit spans below.
 *
 * Simpler version: 4 cols × 3 rows = 12 cells
 *   col-span-2 row-span-2 (A)          → 4 cells
 *   col-span-1 row-span-1 (B)          → 1
 *   col-span-1 row-span-2 (C)          → 2
 *   col-span-1 row-span-1 (D)          → 1
 *   col-span-2 row-span-1 (E)          → 2
 *   col-span-1 row-span-1 (F)          → 1
 *   col-span-1 row-span-1 (G)          → 1
 *   Total = 12 ✓
 */
const galleryCells = [
  { id: 1, src: '/images/PHOTO-2026-03-30-00-55-28.webp', label: 'Temple necklace',    span: 'col-span-2 lg:col-span-2 lg:row-span-2' },
  { id: 2, src: '/images/PHOTO-2026-03-30-00-55-41.webp', label: 'Emerald choker',     span: '' },
  { id: 3, src: '/images/PHOTO-2026-03-30-00-55-52.webp', label: 'Heritage collar',    span: 'row-span-2 lg:row-span-2' },
  { id: 4, src: '/images/PHOTO-2026-03-30-00-56-04.webp', label: 'Green stone detail', span: '' },
  { id: 5, src: '/images/PHOTO-2026-03-30-00-55-41.webp', label: 'Atelier close-up',   span: 'col-span-2 lg:col-span-2' },
  { id: 6, src: '/images/PHOTO-2026-03-30-00-55-52.webp', label: 'Ruby and gold',      span: '' },
  { id: 7, src: '/images/PHOTO-2026-03-30-00-56-04.webp', label: 'Styled set',         span: '' },
];

export default function GalleryGrid() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { threshold: 0.05 });

  return (
    <section
      ref={sectionRef}
      className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-pearl"
      aria-labelledby="gallery-heading"
    >
      <div className="max-w-site mx-auto">
        <div
          className={[
            'flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12',
            'transition-all duration-700',
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
          ].join(' ')}
        >
          <div>
            <p className="font-body font-semibold text-sm tracking-[0.4em] uppercase text-gold mb-2">
              The Studio
            </p>
            <h2 id="gallery-heading" className="font-display text-fluid-h2 text-obsidian">
              Life in the Atelier
            </h2>
          </div>
          <a
            href={SELLER_INSTAGRAM}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-body font-medium text-sm tracking-wider text-obsidian/60 hover:text-gold transition-colors group"
          >
            <Instagram
              size={16}
              aria-hidden="true"
              className="group-hover:rotate-6 transition-transform"
            />
            Follow on Instagram
          </a>
        </div>

        {/* Mobile: 2 cols, auto rows. Desktop: 4×3 bento grid with explicit row height. */}
        <div className="grid grid-cols-2 lg:grid-cols-4 auto-rows-[180px] sm:auto-rows-[220px] lg:auto-rows-[220px] gap-3 sm:gap-4">
          {galleryCells.map(({ id, src, label, span }, index) => (
            <div
              key={id}
              className={[
                'group relative overflow-hidden rounded-sm cursor-pointer smooth-paint',
                span,
                'transition-all duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)]',
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6',
              ].join(' ')}
              style={{ transitionDelay: `${index * 70}ms` }}
            >
              <Image
                src={src}
                alt={label}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
                placeholder="blur"
                blurDataURL="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMCAxMCI+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjZjZlOWQwIi8+PC9zdmc+"
              />

              {/* Dark gradient for label readability */}
              <div
                className="absolute inset-0 bg-gradient-to-t from-obsidian/60 via-obsidian/10 to-transparent"
                aria-hidden="true"
              />

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-obsidian/0 group-hover:bg-obsidian/50 transition-all duration-500 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500 flex flex-col items-center gap-2 px-4">
                  <div className="w-10 h-10 rounded-full border border-gold/60 flex items-center justify-center backdrop-blur-sm">
                    <Eye size={16} className="text-gold" aria-hidden="true" />
                  </div>
                  <p className="font-accent text-xs italic text-white text-center">{label}</p>
                </div>
              </div>

              {/* Permanent corner label on the hero cell */}
              {span.includes('col-span-2') && span.includes('row-span-2') && (
                <div className="absolute bottom-4 left-4 right-4 text-white pointer-events-none">
                  <p className="font-body font-semibold text-xs tracking-[0.3em] uppercase text-gold/80 mb-1">
                    Featured
                  </p>
                  <p className="font-display text-lg leading-tight line-clamp-1">{label}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

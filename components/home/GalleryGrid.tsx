'use client';

import React, { useRef } from 'react';
import { Eye, Instagram } from 'lucide-react';
import { SELLER_INSTAGRAM } from '@/lib/constants';
import { useInView } from '@/lib/hooks';

// Masonry gallery with 9 cells in a 3-row, varied layout
const galleryCells = [
  { id: 1, span: 'row-span-2', bg: 'from-[hsl(43,25%,20%)] to-[hsl(30,20%,12%)]', label: 'Celestial Moonstone Ring' },
  { id: 2, span: '', bg: 'from-[hsl(220,20%,22%)] to-[hsl(220,25%,14%)]', label: 'Aurora Pendant' },
  { id: 3, span: '', bg: 'from-[hsl(350,20%,22%)] to-[hsl(350,25%,14%)]', label: 'Crescent Earrings' },
  { id: 4, span: '', bg: 'from-[hsl(180,15%,20%)] to-[hsl(200,18%,12%)]', label: 'Woven Gold Bangle' },
  { id: 5, span: 'col-span-2', bg: 'from-[hsl(60,10%,22%)] to-[hsl(43,15%,13%)]', label: 'Studio Details' },
  { id: 6, span: '', bg: 'from-[hsl(270,15%,22%)] to-[hsl(280,18%,13%)]', label: 'Tribal Jhumka' },
  { id: 7, span: 'row-span-2', bg: 'from-[hsl(0,0%,14%)] to-[hsl(0,0%,8%)]', label: 'Serpent Coil Ring' },
  { id: 8, span: '', bg: 'from-[hsl(34,20%,22%)] to-[hsl(43,18%,14%)]', label: 'Flora Pearl Band' },
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
        {/* Header */}
        <div
          className={[
            'flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12',
            'transition-all duration-700',
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
          ].join(' ')}
        >
          <div>
            <p className="font-accent text-sm tracking-[0.4em] uppercase text-gold mb-2">
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
            className="inline-flex items-center gap-2 font-accent text-sm tracking-wider text-obsidian/60 hover:text-gold transition-colors group"
          >
            <Instagram size={16} aria-hidden="true" />
            Follow on Instagram
          </a>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-3 grid-rows-3 gap-3 sm:gap-4 h-[480px] sm:h-[600px] lg:h-[700px]">
          {galleryCells.map(({ id, span, bg, label }, index) => (
            <div
              key={id}
              className={[
                'group relative overflow-hidden rounded-sm cursor-pointer',
                span,
                'transition-all duration-500',
                isInView ? 'opacity-100 scale-100' : 'opacity-0 scale-95',
              ].join(' ')}
              style={{ transitionDelay: `${index * 60}ms` }}
            >
              {/* Gradient placeholder */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${bg} group-hover:scale-105 transition-transform duration-700`}
                aria-hidden="true"
              />

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-obsidian/0 group-hover:bg-obsidian/40 transition-all duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center gap-2">
                  <Eye size={20} className="text-white" aria-hidden="true" />
                  <p className="font-accent text-xs italic text-white/80 text-center px-4">
                    {label}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

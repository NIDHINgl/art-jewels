'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { Gem, Hammer, Sparkles } from 'lucide-react';
import { useInView } from '@/lib/hooks';
import { MovingBorder } from '@/components/ui/moving-border';

const values = [
  {
    icon: Hammer,
    title: 'Hand-Forged',
    description:
      'Every piece is shaped by hand, one tool and one gesture at a time. No casting shortcuts.',
  },
  {
    icon: Gem,
    title: 'Ethically Sourced',
    description:
      'Our gemstones are traceable. Our metals are recycled or responsibly mined.',
  },
  {
    icon: Sparkles,
    title: 'One of a Kind',
    description:
      'No two pieces are identical. The slight variation in each is the proof of a human hand.',
  },
];

function AtelierVisual() {
  return (
    <div className="relative w-full aspect-[4/5] lg:aspect-auto lg:h-[640px] overflow-hidden rounded-sm bg-obsidian smooth-paint">
      {/* Real atelier image */}
      <Image
        src="/images/PHOTO-2026-03-30-00-55-52.webp"
        alt="Artisan at work in the LUMORA atelier"
        fill
        sizes="(max-width: 1024px) 100vw, 50vw"
        className="object-cover"
        placeholder="blur"
        blurDataURL="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMCAxMCI+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjMWExMTBhIi8+PC9zdmc+"
      />

      {/* Warm obsidian gradient — keeps image feeling cinematic, not flat */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/50 to-obsidian/20 mix-blend-multiply"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[hsl(43,40%,15%)]/40"
        aria-hidden="true"
      />

      {/* Rotating gold medallion, center */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        aria-hidden="true"
      >
        <MovingBorder
          isCircle
          borderWidth={2}
          gradientWidth={180}
          duration={6}
          colors={['#e9c576', '#b7893a', '#f6e9d0', '#b7893a']}
          className="bg-transparent"
        >
          <div className="w-44 h-44 sm:w-52 sm:h-52 flex items-center justify-center relative">
            <div className="w-40 h-40 sm:w-48 sm:h-48 border border-gold/30 rotate-45 absolute" />
            <div className="absolute inset-6 border border-gold/20 rotate-45" />
            <div className="w-5 h-5 bg-gold/50 rotate-45 shadow-[0_0_20px_rgba(233,197,118,0.6)]" />
          </div>
        </MovingBorder>
      </div>

      {/* Corner ornaments */}
      <div
        className="absolute top-5 left-5 w-10 h-10 border-l border-t border-gold/30"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-5 right-5 w-10 h-10 border-r border-b border-gold/30"
        aria-hidden="true"
      />

      {/* Caption */}
      <div className="absolute bottom-6 left-6 right-6 flex items-center gap-3">
        <div className="w-8 h-px bg-gold/50" aria-hidden="true" />
        <p className="font-accent text-sm italic text-white/70">
          Our workshop, Thiruvananthapuram
        </p>
      </div>
    </div>
  );
}

export default function CraftsmanshipStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { threshold: 0.1 });

  return (
    <section
      ref={sectionRef}
      className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-obsidian overflow-hidden"
      aria-labelledby="craftsmanship-heading"
    >
      <div className="max-w-site mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div
            className={[
              'transition-all duration-1000',
              isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8',
            ].join(' ')}
          >
            <AtelierVisual />
          </div>

          <div
            ref={contentRef}
            className={[
              'transition-all duration-1000 delay-200',
              isInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8',
            ].join(' ')}
          >
            <p className="font-accent text-sm tracking-[0.4em] uppercase text-gold mb-4">
              The Atelier
            </p>
            <h2
              id="craftsmanship-heading"
              className="font-display text-fluid-h2 text-white mb-6 leading-tight"
            >
              Made by a Single Pair of Hands
            </h2>

            <div className="w-12 h-px bg-gold/40 mb-8" aria-hidden="true" />

            <p className="font-accent text-lg text-white/70 leading-relaxed mb-5 italic">
              Every LUMORA piece begins as a sketch and ends as a wearable object
              of intention. Between those two points: fire, metal, stone, and time.
            </p>
            <p className="font-body text-sm text-white/50 leading-relaxed mb-12">
              Our artisan works alone in a small studio — the same processes used
              for centuries, undisrupted by industrial speed. There is no batch
              production. When you wear a LUMORA piece, you wear something made for
              you, even if we hadn&apos;t met yet.
            </p>

            <div className="grid gap-6">
              {values.map(({ icon: Icon, title, description }, index) => (
                <div
                  key={title}
                  className={[
                    'flex gap-4 transition-all duration-700',
                    isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
                  ].join(' ')}
                  style={{ transitionDelay: `${400 + index * 100}ms` }}
                >
                  <div className="shrink-0 w-10 h-10 border border-gold/30 flex items-center justify-center rounded-sm">
                    <Icon size={16} className="text-gold" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-body text-sm font-semibold text-white mb-1">{title}</h3>
                    <p className="font-accent text-sm italic text-white/50">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

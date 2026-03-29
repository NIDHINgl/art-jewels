'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Gem, Hammer, Sparkles } from 'lucide-react';
import { useInView } from '@/lib/hooks';

const values = [
  {
    icon: Hammer,
    title: 'Hand-Forged',
    description: 'Every piece is shaped by hand, one tool and one gesture at a time. No casting shortcuts.',
  },
  {
    icon: Gem,
    title: 'Ethically Sourced',
    description: 'Our gemstones are traceable. Our metals are recycled or responsibly mined.',
  },
  {
    icon: Sparkles,
    title: 'One of a Kind',
    description: 'No two pieces are identical. The slight variation in each is the proof of a human hand.',
  },
];

function ParallaxImage() {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const progress = (window.innerHeight / 2 - rect.top) / window.innerHeight;
      setOffset(progress * 60);
    };
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReducedMotion) {
      window.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll();
    }
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      ref={ref}
      className="relative h-full min-h-[480px] lg:min-h-0 overflow-hidden rounded-sm bg-obsidian"
    >
      {/* Gradient placeholder (replace with next/image when real images added) */}
      <div
        className="absolute inset-[-10%] bg-gradient-to-br from-[hsl(43,30%,18%)] via-[hsl(20,20%,12%)] to-[hsl(0,0%,8%)]"
        style={{ transform: `translateY(${offset}px)` }}
        aria-hidden="true"
      />

      {/* Gem decoration overlay */}
      <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
        <div className="relative">
          <div className="w-40 h-40 border border-gold/20 rotate-45" />
          <div className="absolute inset-6 border border-gold/10 rotate-45" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-4 h-4 bg-gold/30 rotate-45" />
          </div>
        </div>
      </div>

      {/* Subtle label */}
      <div className="absolute bottom-6 left-6 right-6">
        <p className="font-accent text-sm italic text-white/40">
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
          {/* Image */}
          <div
            className={[
              'transition-all duration-1000',
              isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8',
            ].join(' ')}
          >
            <ParallaxImage />
          </div>

          {/* Content */}
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
              you, even if we hadn't met yet.
            </p>

            {/* Values */}
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
                    <h3 className="font-body text-sm font-semibold text-white mb-1">
                      {title}
                    </h3>
                    <p className="font-accent text-sm italic text-white/50">
                      {description}
                    </p>
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

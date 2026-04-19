'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { testimonials } from '@/data/products';
import { useInView } from '@/lib/hooks';

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { threshold: 0.2 });
  const total = testimonials.length;

  const next = useCallback(() => setCurrent((c) => (c + 1) % total), [total]);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + total) % total), [total]);

  useEffect(() => {
    if (paused || !isInView) return;
    const interval = setInterval(next, 5000);
    return () => clearInterval(interval);
  }, [paused, isInView, next]);

  return (
    <section
      ref={sectionRef}
      className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-champagne/30"
      aria-labelledby="testimonials-heading"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="max-w-3xl mx-auto">
        <div
          className={[
            'text-center mb-14 transition-all duration-700',
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
          ].join(' ')}
        >
          <p className="font-body font-semibold text-sm tracking-[0.4em] uppercase text-gold mb-3">
            From Our Wearers
          </p>
          <h2 id="testimonials-heading" className="font-display text-fluid-h2 text-obsidian">
            Words We Carry
          </h2>
        </div>

        <div className="relative" role="region" aria-label="Customer testimonials">
          <div
            className={[
              'text-center transition-all duration-500',
              isInView ? 'opacity-100' : 'opacity-0',
            ].join(' ')}
            key={current}
          >
            <div
              className="flex justify-center gap-1 mb-6"
              aria-label={`${testimonials[current].rating} out of 5 stars`}
            >
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  aria-hidden="true"
                  fill={i < testimonials[current].rating ? 'var(--color-gold)' : 'none'}
                  className={i < testimonials[current].rating ? 'text-gold' : 'text-platinum-dark'}
                />
              ))}
            </div>

            <blockquote className="mb-8">
              <p className="font-accent text-lg sm:text-xl italic text-obsidian leading-relaxed">
                &ldquo;{testimonials[current].quote}&rdquo;
              </p>
            </blockquote>

            <figcaption className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center">
                <span className="font-display text-sm font-semibold text-gold">
                  {testimonials[current].initials}
                </span>
              </div>
              <div>
                <p className="font-body text-sm font-semibold text-obsidian">
                  {testimonials[current].customerName}
                </p>
                <p className="font-accent text-xs italic text-obsidian/50">
                  {testimonials[current].location}
                </p>
              </div>
            </figcaption>
          </div>

          <div className="flex items-center justify-center gap-4 mt-10">
            <button
              onClick={prev}
              aria-label="Previous testimonial"
              className="w-9 h-9 border border-platinum-dark rounded-full flex items-center justify-center text-obsidian/50 hover:text-gold hover:border-gold transition-all hover:scale-110 active:scale-95"
            >
              <ChevronLeft size={16} aria-hidden="true" />
            </button>

            <div className="flex gap-2" role="tablist" aria-label="Testimonial navigation">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  role="tab"
                  aria-selected={i === current}
                  aria-label={`Go to testimonial ${i + 1}`}
                  onClick={() => setCurrent(i)}
                  className={[
                    'h-1.5 rounded-full transition-all duration-300',
                    i === current ? 'w-6 bg-gold' : 'w-1.5 bg-platinum-dark',
                  ].join(' ')}
                />
              ))}
            </div>

            <button
              onClick={next}
              aria-label="Next testimonial"
              className="w-9 h-9 border border-platinum-dark rounded-full flex items-center justify-center text-obsidian/50 hover:text-gold hover:border-gold transition-all hover:scale-110 active:scale-95"
            >
              <ChevronRight size={16} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

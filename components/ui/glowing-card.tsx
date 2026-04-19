'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface GlowingCardProps {
  /** Big number shown inside the card, e.g. "750k". */
  value: string;
  /** Label below the number, e.g. "Orders". */
  label: string;
  className?: string;
}

/**
 * Glowing card with a single gold dot that travels continuously around the
 * border, leaving a soft comet-trail glow. Corners are marked with short
 * gold lines that brighten as the dot sweeps past.
 *
 * Themed to LUMORA's gold/obsidian palette.
 * Keyframes: `@keyframes glowingCardDot` lives in app/globals.css.
 */
export function GlowingCard({ value, label, className }: GlowingCardProps) {
  return (
    <div
      className={cn(
        'glowing-card-outer relative h-56 w-56 sm:h-64 sm:w-64 rounded-xl overflow-visible',
        'bg-obsidian text-pearl shadow-elevated',
        className,
      )}
    >
      {/* Traveling gold dot — runs the perimeter */}
      <span
        className="glowing-card-dot absolute w-3 h-3 rounded-full bg-gold pointer-events-none"
        style={{
          boxShadow:
            '0 0 10px 3px rgba(233, 197, 118, 0.85), 0 0 22px 6px rgba(233, 197, 118, 0.45)',
        }}
        aria-hidden="true"
      />

      {/* Card body */}
      <div className="glowing-card-body relative w-full h-full rounded-xl overflow-hidden flex flex-col items-center justify-center text-center px-6">
        {/* Soft radial gold glow behind the number */}
        <div
          className="absolute inset-0 opacity-70 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at 50% 45%, rgba(233,197,118,0.22) 0%, transparent 55%)',
          }}
          aria-hidden="true"
        />

        {/* Ray — subtle diagonal sheen */}
        <div
          className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] rotate-[-20deg] opacity-50 pointer-events-none"
          style={{
            background:
              'linear-gradient(90deg, transparent 45%, rgba(246,233,208,0.07) 50%, transparent 55%)',
          }}
          aria-hidden="true"
        />

        {/* Value */}
        <p className="relative font-display font-bold text-5xl sm:text-6xl tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-pearl via-champagne to-gold leading-none">
          {value}
        </p>

        {/* Label */}
        <p className="relative mt-3 font-body font-semibold text-xs sm:text-sm tracking-[0.4em] uppercase text-gold/80">
          {label}
        </p>

        {/* Corner accents — brighten as the dot passes */}
        <span
          className="glowing-card-line glowing-card-line-top absolute top-0 left-0 right-0 h-px"
          aria-hidden="true"
        />
        <span
          className="glowing-card-line glowing-card-line-right absolute top-0 right-0 bottom-0 w-px"
          aria-hidden="true"
        />
        <span
          className="glowing-card-line glowing-card-line-bottom absolute bottom-0 left-0 right-0 h-px"
          aria-hidden="true"
        />
        <span
          className="glowing-card-line glowing-card-line-left absolute top-0 left-0 bottom-0 w-px"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}

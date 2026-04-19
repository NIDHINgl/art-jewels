'use client';

import React from 'react';
import { cn } from '@/lib/utils';

type Size = 'sm' | 'md' | 'lg';

interface KineticDotsLoaderProps {
  size?: Size;
  dots?: number;
  label?: string;
  className?: string;
}

const SIZE_MAP: Record<Size, {
  lift: number;
  dot: number;
  col: number;
  rail: number;
  gap: number;
  ripple: number;
  shadow: number;
}> = {
  sm: { lift: 28, dot: 14, col: 20, rail: 56, gap: 14, ripple: 28, shadow: 14 },
  md: { lift: 40, dot: 20, col: 24, rail: 80, gap: 20, ripple: 40, shadow: 20 },
  lg: { lift: 56, dot: 26, col: 32, rail: 104, gap: 26, ripple: 52, shadow: 26 },
};

export default function KineticDotsLoader({
  size = 'md',
  dots = 4,
  label,
  className,
}: KineticDotsLoaderProps) {
  const s = SIZE_MAP[size];

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={label ?? 'Loading'}
      className={cn('flex flex-col items-center justify-center gap-6 p-6', className)}
    >
      <div className="flex" style={{ gap: s.gap }}>
        {[...Array(dots)].map((_, i) => {
          const delay = `${i * 0.15}s`;
          return (
            <div
              key={i}
              className="relative flex flex-col items-center justify-end"
              style={{ height: s.rail, width: s.col }}
            >
              {/* Bouncing dot */}
              <div
                className="relative z-10"
                style={{
                  width: s.dot,
                  height: s.dot,
                  animation: 'lumora-loader-bounce 1.4s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite',
                  animationDelay: delay,
                  willChange: 'transform',
                }}
              >
                <div
                  className="w-full h-full rounded-full bg-gradient-to-b from-[hsl(46,75%,72%)] via-gold-bright to-gold"
                  style={{
                    boxShadow: '0 0 14px hsla(43, 74%, 45%, 0.55), inset 0 -2px 3px hsla(0,0%,0%,0.15)',
                    animation: 'lumora-loader-morph 1.4s linear infinite',
                    animationDelay: delay,
                    willChange: 'transform',
                  }}
                />
                {/* Specular highlight */}
                <div
                  className="absolute top-[15%] left-[15%] rounded-full bg-white/70"
                  style={{
                    width: Math.max(3, s.dot * 0.22),
                    height: Math.max(3, s.dot * 0.22),
                    filter: 'blur(0.5px)',
                  }}
                  aria-hidden="true"
                />
              </div>

              {/* Floor ripple */}
              <div
                className="absolute bottom-0 border border-gold/35 rounded-[100%] opacity-0"
                style={{
                  width: s.ripple,
                  height: Math.max(6, s.ripple * 0.18),
                  animation: 'lumora-loader-ripple 1.4s linear infinite',
                  animationDelay: delay,
                }}
                aria-hidden="true"
              />

              {/* Reflective shadow */}
              <div
                className="absolute -bottom-0.5 rounded-[100%] bg-gold/35 blur-sm"
                style={{
                  width: s.shadow,
                  height: Math.max(4, s.shadow * 0.3),
                  animation: 'lumora-loader-shadow 1.4s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite',
                  animationDelay: delay,
                }}
                aria-hidden="true"
              />
            </div>
          );
        })}
      </div>

      {label && (
        <p className="font-body font-semibold text-[11px] tracking-[0.45em] uppercase text-obsidian/70">
          {label}
        </p>
      )}
      <span className="sr-only">{label ?? 'Loading'}</span>
    </div>
  );
}

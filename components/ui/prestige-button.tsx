'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface PrestigeButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Lucide icon element (e.g., <ShoppingBag />). */
  icon?: React.ReactElement;
  title: string;
  subtitle?: string;
  size?: 'sm' | 'md' | 'lg';
  /** Show the arrow on the right. Default true. */
  showArrow?: boolean;
  /** If true, renders with a dark obsidian body + gold accents. Default false = bright gold body. */
  dark?: boolean;
}

/**
 * Premium CTA button themed to LUMORA gold. Features:
 *   - Gold gradient body with moving shimmer sweep on hover
 *   - Icon in a gold-tinted chip, title + optional subtitle
 *   - Arrow translates on hover
 *   - Spring-ish lift + scale on hover, press-down on active
 *
 * Only use for primary CTAs (checkout, contact-submit, hero actions). Inline
 * text buttons and small icon-only buttons stay as-is to avoid visual fatigue.
 */
export const PrestigeButton: React.FC<PrestigeButtonProps> = ({
  icon,
  title,
  subtitle,
  size = 'md',
  showArrow = true,
  dark = false,
  className,
  ...props
}) => {
  const sizes = {
    sm: 'p-3 rounded-sm gap-3',
    md: 'p-4 rounded-sm gap-4',
    lg: 'p-5 rounded-sm gap-5',
  };

  const bodyClasses = dark
    ? 'bg-gradient-to-br from-[#1c1410] via-[#2a1d13] to-[#0d0907] text-pearl border-gold/40'
    : 'bg-gradient-to-br from-gold-bright via-gold to-[#8a6628] text-white border-gold/60';

  const shimmerTint = dark
    ? 'via-gold/35'
    : 'via-white/40';

  return (
    <button
      {...props}
      className={cn(
        'group relative overflow-hidden border cursor-pointer',
        'transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
        'shadow-lg hover:shadow-[0_20px_40px_-10px_rgba(183,137,58,0.35)]',
        'hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ivory',
        'disabled:opacity-50 disabled:pointer-events-none',
        sizes[size],
        bodyClasses,
        className,
      )}
    >
      {/* Moving gradient shimmer sweep */}
      <span
        className={cn(
          'absolute inset-0 bg-gradient-to-r from-transparent to-transparent',
          shimmerTint,
          '-translate-x-full group-hover:translate-x-full transition-transform duration-[1200ms] ease-out',
        )}
        aria-hidden="true"
      />

      {/* Soft inner glow on hover */}
      <span
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-white/10 via-transparent to-white/10"
        aria-hidden="true"
      />

      {/* Content */}
      <span className="relative z-10 flex items-center gap-4">
        {icon && (
          <span
            className={cn(
              'shrink-0 p-2.5 rounded-sm backdrop-blur-sm',
              'bg-gradient-to-br border transition-all duration-300',
              dark
                ? 'from-gold/30 to-gold/10 border-gold/40 group-hover:from-gold/40 group-hover:to-gold/15'
                : 'from-white/30 to-white/10 border-white/40 group-hover:from-white/40 group-hover:to-white/15',
            )}
          >
            {React.cloneElement(icon as React.ReactElement<any>, {
              className: cn(
                'w-5 h-5 transition-transform duration-300 group-hover:scale-110',
                dark ? 'text-gold' : 'text-white',
                'drop-shadow-sm',
              ),
            })}
          </span>
        )}

        <span className="flex-1 text-left">
          <span
            className={cn(
              'block font-display text-base sm:text-lg leading-tight',
              dark ? 'text-pearl' : 'text-white',
            )}
          >
            {title}
          </span>
          {subtitle && (
            <span
              className={cn(
                'block font-accent italic text-xs sm:text-sm leading-snug mt-0.5',
                dark ? 'text-pearl/70' : 'text-white/80',
              )}
            >
              {subtitle}
            </span>
          )}
        </span>

        {showArrow && (
          <span className="opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 shrink-0">
            <svg
              viewBox="0 0 24 24"
              stroke="currentColor"
              fill="none"
              className={cn('w-4 h-4', dark ? 'text-gold' : 'text-white')}
              aria-hidden="true"
            >
              <path
                d="M9 5l7 7-7 7"
                strokeWidth={2}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            </svg>
          </span>
        )}
      </span>
    </button>
  );
};

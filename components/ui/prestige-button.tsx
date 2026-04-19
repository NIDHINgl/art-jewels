'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface PrestigeButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Optional lucide icon element (e.g., <ShoppingBag />). Rendered at 16px. */
  icon?: React.ReactElement;
  /** Primary label — rendered in uppercase tracked caps. */
  title: string;
  /** Optional helper text, shown as small italic accent copy below the button. */
  subtitle?: string;
  /** `obsidian` (default) = near-black on ivory / `gold` = solid gold /
   *  `outline` = border-only / `danger` = muted velvet for destructive actions */
  variant?: 'obsidian' | 'gold' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  /** Show the subtle gold underline sweep on hover. Default true. */
  animatedUnderline?: boolean;
  /** If provided, renders as a Next.js Link instead of a button. */
  href?: string;
  /** When href is set, allow opening in a new tab (adds rel=noopener). */
  target?: React.HTMLAttributeAnchorTarget;
}

const sizeClasses = {
  sm: 'h-10 px-5 text-[10px]',
  md: 'h-[52px] px-7 text-[11px]',
  lg: 'h-14 px-8 text-xs',
} as const;

const variantClasses: Record<NonNullable<PrestigeButtonProps['variant']>, string> = {
  obsidian:
    'bg-obsidian text-pearl hover:bg-[#0a0705] active:bg-black',
  gold:
    'bg-gold text-white hover:bg-gold-light active:bg-[#8a6628]',
  outline:
    'bg-transparent text-obsidian border border-obsidian/40 hover:border-obsidian hover:bg-obsidian hover:text-pearl',
  danger:
    // Destructive-outline: rose-gold border + text on pearl, fills with rose-gold on hover.
    // Reads destructive without competing with primary obsidian CTAs.
    'bg-pearl text-rose-gold border border-rose-gold/45 hover:bg-rose-gold hover:text-white hover:border-rose-gold active:bg-[#8a3449]',
};

/**
 * Modern minimal luxury button — the canonical LUMORA primary CTA.
 * Solid fill, uppercase tracked caps, optional small icon, optional helper
 * subtitle underneath. Subtle hover: background darkens + a gold hairline
 * underline slides in from center. Replaces the heavier gradient + shimmer
 * pattern.
 *
 * Used across: PDP Add to Cart, Cart checkout, Wishlist empty state,
 * Contact / Checkout form submits, 404 return-home.
 */
export const PrestigeButton: React.FC<PrestigeButtonProps> = ({
  icon,
  title,
  subtitle,
  variant = 'obsidian',
  size = 'md',
  animatedUnderline = true,
  className,
  disabled,
  href,
  target,
  ...props
}) => {
  const coreClasses = cn(
    'group relative inline-flex items-center justify-center gap-2.5 w-full',
    'font-body font-semibold tracking-[0.22em] uppercase whitespace-nowrap',
    'rounded-sm overflow-hidden',
    'transition-[background-color,transform,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 focus-visible:ring-offset-2 focus-visible:ring-offset-ivory',
    'active:scale-[0.985] disabled:opacity-50 disabled:pointer-events-none',
    sizeClasses[size],
    variantClasses[variant],
  );

  const content = (
    <>
      {icon && (
        <span
          className={cn(
            'shrink-0 -ml-0.5 transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110',
            variant === 'obsidian' && 'text-gold',
            variant === 'gold' && 'text-white',
            variant === 'outline' && 'text-obsidian group-hover:text-gold',
            variant === 'danger' && 'text-rose-gold group-hover:text-white',
          )}
        >
          {React.cloneElement(icon as React.ReactElement<{ className?: string; size?: number }>, {
            className: cn('w-4 h-4', (icon.props as { className?: string })?.className),
            size: 16,
          })}
        </span>
      )}
      <span>{title}</span>

      {/* Hair-thin gold underline — slides in from center on hover */}
      {animatedUnderline && (
        <span
          className={cn(
            'pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 h-px w-0 bg-gold',
            'transition-[width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
            'group-hover:w-[70%]',
            variant === 'gold' && 'bg-white/80',
            variant === 'danger' && 'bg-rose-gold/70 group-hover:bg-white/80',
          )}
          aria-hidden="true"
        />
      )}
    </>
  );

  return (
    // Wrapper accepts layout classes from the caller (w-full, flex-1, etc.).
    // Inner element always fills the wrapper's width so callers don't need to
    // care about the button vs. link distinction.
    <span className={cn('inline-flex flex-col items-stretch gap-2', className)}>
      {href ? (
        <Link
          href={href}
          target={target}
          rel={target === '_blank' ? 'noopener noreferrer' : undefined}
          className={coreClasses}
        >
          {content}
        </Link>
      ) : (
        <button {...props} disabled={disabled} className={coreClasses}>
          {content}
        </button>
      )}

      {subtitle && (
        <span className="font-accent italic text-[11px] sm:text-xs text-obsidian/65 text-center leading-relaxed self-center max-w-sm">
          {subtitle}
        </span>
      )}
    </span>
  );
};

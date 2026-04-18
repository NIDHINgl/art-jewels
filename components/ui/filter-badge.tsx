'use client';

import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

type FilterBadgeVariant = 'default' | 'pill' | 'avatar';

interface FilterBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: FilterBadgeVariant;
  label?: string;
  value?: string;
  avatar?: string;
  onRemove?: () => void;
  children?: React.ReactNode;
}

/**
 * Two-segment badge: a muted label + a strong value + an optional × remove button.
 * Themed to LUMORA's champagne/gold palette. Pill and avatar variants available.
 */
export function FilterBadge({
  className,
  variant = 'default',
  label,
  value,
  avatar,
  onRemove,
  children,
  ...props
}: FilterBadgeProps) {
  const shell = cn(
    'inline-flex items-center text-xs border',
    // LUMORA theme: soft champagne fill, subtle gold border
    'bg-champagne/40 border-gold/25 text-obsidian/70',
    variant === 'default' && 'rounded-sm gap-x-2.5 py-1 pl-2.5 pr-1',
    variant === 'pill' && 'rounded-full gap-x-2.5 py-1 pl-2.5 pr-1',
    variant === 'avatar' && 'rounded-full gap-2 px-1 py-1',
    className,
  );

  const removeBtn = onRemove && (
    <button
      type="button"
      onClick={onRemove}
      aria-label={`Remove ${label ? `${label} ` : ''}${value ?? (typeof children === 'string' ? children : '')}`}
      className={cn(
        'flex size-5 items-center justify-center text-obsidian/40 hover:bg-gold/20 hover:text-obsidian transition-colors',
        variant === 'default' ? 'rounded-[2px] -ml-1.5' : 'rounded-full',
        variant === 'avatar' && 'ml-0',
      )}
    >
      <X className="size-3.5 shrink-0" aria-hidden="true" />
    </button>
  );

  if (variant === 'avatar') {
    return (
      <span className={shell} {...props}>
        {avatar && (
          // Avatars may come from arbitrary third-party URLs; plain <img> keeps
          // the component usable without pre-registering remote patterns in next.config.js.
          // eslint-disable-next-line @next/next/no-img-element
          <img className="inline-block size-5 rounded-full object-cover" src={avatar} alt="" />
        )}
        <span className="font-accent text-obsidian/80 pr-1">{children}</span>
        {removeBtn}
      </span>
    );
  }

  return (
    <span className={shell} {...props}>
      {label && <span className="font-accent">{label}</span>}
      {label && value && <span className="h-3 w-px bg-gold/30" aria-hidden="true" />}
      {value && <span className="font-body font-medium text-obsidian">{value}</span>}
      {!label && !value && children}
      {removeBtn}
    </span>
  );
}

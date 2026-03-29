'use client';

import React from 'react';
import { type ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger';
type Size = 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  isLoading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-velvet text-white hover:bg-velvet/90 active:scale-[0.98] shadow-sm',
  secondary:
    'bg-gold text-white hover:bg-gold-light active:scale-[0.98] shadow-gold',
  ghost:
    'bg-transparent text-obsidian hover:bg-platinum/60 active:scale-[0.98]',
  outline:
    'border border-gold text-gold bg-transparent hover:bg-gold hover:text-white active:scale-[0.98]',
  danger:
    'bg-red-600 text-white hover:bg-red-700 active:scale-[0.98]',
};

const sizeClasses: Record<Size, string> = {
  sm: 'px-4 py-2 text-sm min-h-[36px]',
  md: 'px-6 py-3 text-sm min-h-[44px]',
  lg: 'px-8 py-4 text-base min-h-[52px]',
  xl: 'px-10 py-5 text-lg min-h-[60px]',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  className = '',
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || isLoading}
      className={[
        'inline-flex items-center justify-center gap-2',
        'font-body font-medium tracking-wide rounded-sm',
        'transition-all duration-200',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth ? 'w-full' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <span
            className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"
            aria-hidden="true"
          />
          <span>Loading…</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
}

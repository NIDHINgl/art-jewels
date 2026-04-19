import React from 'react';

type BadgeVariant = 'new' | 'bestseller' | 'outofstock' | 'custom';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  new: 'bg-gold text-white',
  bestseller: 'bg-velvet text-white',
  outofstock: 'bg-platinum-dark text-obsidian/80',
  custom: 'bg-rose-gold text-white',
};

export default function Badge({
  variant = 'new',
  children,
  className = '',
}: BadgeProps) {
  return (
    <span
      className={[
        'inline-block px-2 py-0.5 text-[10px] font-body font-semibold',
        'uppercase tracking-widest rounded-sm',
        variantClasses[variant],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </span>
  );
}

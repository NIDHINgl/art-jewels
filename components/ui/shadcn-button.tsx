'use client';

import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * shadcn-pattern button used by Radix-based components (DropdownMenu, etc).
 * Distinct from the existing LUMORA Button component which is styled for
 * luxury primary/outline/text variants with specific brand padding.
 */
const shadcnButtonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-sm text-sm font-body font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ivory disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-gold text-white hover:bg-gold-light',
        outline:
          'border border-platinum-dark bg-ivory text-obsidian hover:border-gold hover:text-gold',
        ghost: 'text-obsidian/80 hover:bg-platinum/40 hover:text-obsidian',
        link: 'text-gold underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 px-3',
        lg: 'h-11 px-6',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
);

export interface ShadcnButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof shadcnButtonVariants> {
  asChild?: boolean;
}

const ShadcnButton = React.forwardRef<HTMLButtonElement, ShadcnButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(shadcnButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
ShadcnButton.displayName = 'ShadcnButton';

export { ShadcnButton, shadcnButtonVariants };

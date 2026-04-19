'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// LUMORA-themed textarea variants — pearl surface, gold focus ring.
const textareaVariants = cva(
  [
    'w-full bg-pearl border border-platinum-dark font-body text-obsidian',
    'shadow-sm shadow-black/[0.04]',
    'placeholder:text-obsidian/60 placeholder:italic placeholder:font-accent',
    'transition-[color,box-shadow,border-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
    'focus-visible:border-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/25',
    'disabled:cursor-not-allowed disabled:opacity-50 read-only:opacity-75',
    'aria-invalid:border-red-500/60 aria-invalid:ring-red-500/10',
  ].join(' '),
  {
    variants: {
      variant: {
        sm: 'px-2.5 py-2 text-xs rounded-sm',
        md: 'px-3.5 py-3 text-sm rounded-sm',
        lg: 'px-4 py-3.5 text-sm rounded-sm',
      },
    },
    defaultVariants: { variant: 'md' },
  },
);

interface TextareaProps
  extends React.ComponentProps<'textarea'>,
    VariantProps<typeof textareaVariants> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, variant, ...props }, ref) => (
    <textarea
      ref={ref}
      data-slot="textarea"
      className={cn(textareaVariants({ variant }), className)}
      {...props}
    />
  ),
);
Textarea.displayName = 'Textarea';

export { Textarea, textareaVariants };

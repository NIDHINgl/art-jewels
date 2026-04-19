import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/**
 * Composable "empty state" primitives, themed to LUMORA (pearl/obsidian/gold).
 * Drop-in replacement for the shadcn Empty pattern but using LUMORA tokens
 * instead of shadcn CSS variables.
 *
 *   <Empty>
 *     <EmptyHeader>
 *       <EmptyMedia variant="icon"><SomeIcon /></EmptyMedia>
 *       <EmptyTitle>No pieces found</EmptyTitle>
 *       <EmptyDescription>The piece you're looking for may have moved.</EmptyDescription>
 *     </EmptyHeader>
 *     <EmptyContent>
 *       <PrestigeButton ... />
 *     </EmptyContent>
 *   </Empty>
 */

function Empty({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="empty"
      className={cn(
        'flex min-w-0 flex-1 flex-col items-center justify-center gap-6 rounded-sm border border-dashed border-platinum-dark/60 p-6 text-center text-balance md:p-12',
        className,
      )}
      {...props}
    />
  );
}

function EmptyHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="empty-header"
      className={cn('flex max-w-md flex-col items-center text-center gap-2', className)}
      {...props}
    />
  );
}

const emptyMediaVariants = cva(
  'flex shrink-0 items-center justify-center [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-transparent',
        icon:
          'relative flex size-14 shrink-0 items-center justify-center rounded-sm border border-gold/40 bg-pearl text-gold shadow-card [&_svg:not([class*=\'size-\'])]:size-6',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

function EmptyMedia({
  className,
  variant = 'default',
  children,
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof emptyMediaVariants>) {
  return (
    <div
      data-slot="empty-media"
      data-variant={variant}
      className={cn('relative mb-4', className)}
      {...props}
    >
      {variant === 'icon' && (
        <>
          {/* Two decorative cards fanning out behind the primary media tile —
              signals "a stack of things that isn't here yet". */}
          <div
            className={cn(
              emptyMediaVariants({ variant }),
              'pointer-events-none absolute bottom-px origin-bottom-left -translate-x-1 scale-[0.86] -rotate-[10deg] shadow-none opacity-60',
            )}
            aria-hidden="true"
          />
          <div
            className={cn(
              emptyMediaVariants({ variant }),
              'pointer-events-none absolute bottom-px origin-bottom-right translate-x-1 scale-[0.86] rotate-[10deg] shadow-none opacity-60',
            )}
            aria-hidden="true"
          />
        </>
      )}
      <div className={cn(emptyMediaVariants({ variant }))}>{children}</div>
    </div>
  );
}

function EmptyTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="empty-title"
      className={cn('font-display text-2xl sm:text-3xl text-obsidian leading-tight', className)}
      {...props}
    />
  );
}

function EmptyDescription({ className, ...props }: React.ComponentProps<'p'>) {
  return (
    <p
      data-slot="empty-description"
      className={cn(
        'font-accent italic text-sm sm:text-base text-obsidian/55 leading-relaxed',
        '[&>a]:underline [&>a]:underline-offset-4 [&>a]:text-gold [&>a:hover]:text-gold-light',
        '[[data-slot=empty-title]+&]:mt-2',
        className,
      )}
      {...props}
    />
  );
}

function EmptyContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="empty-content"
      className={cn(
        'flex w-full max-w-sm min-w-0 flex-col items-center gap-4 text-sm text-balance',
        className,
      )}
      {...props}
    />
  );
}

export {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
  EmptyMedia,
};

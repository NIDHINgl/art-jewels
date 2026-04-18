'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DestinationCardProps extends React.HTMLAttributes<HTMLDivElement> {
  imageUrl: string;
  location: string;
  /** Small ornament shown beside the location, e.g. a diamond glyph. Omit for plain. */
  flag?: string;
  stats: string;
  href: string;
  /** HSL channels as a space-separated string, e.g. "43 74% 39%". */
  themeColor: string;
  /** CTA label. Defaults to "Explore Now". */
  cta?: string;
}

const DestinationCard = React.forwardRef<HTMLDivElement, DestinationCardProps>(
  (
    { className, imageUrl, location, flag, stats, href, themeColor, cta = 'Explore Now', ...props },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        style={{ '--theme-color': themeColor } as React.CSSProperties & Record<string, string>}
        className={cn('group w-full h-full', className)}
        {...props}
      >
        <Link
          href={href}
          aria-label={`Explore ${location}`}
          className={cn(
            'relative block w-full h-full rounded-sm overflow-hidden',
            'transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
            'group-hover:scale-[1.03]',
            'group-hover:shadow-[0_0_60px_-15px_hsl(var(--theme-color)/0.6)]',
          )}
          style={{ boxShadow: 'var(--card-shadow, 0 0 40px -15px hsl(var(--theme-color) / 0.35))' }}
        >
          {/* Background image — uses next/image for optimization */}
          <div className="absolute inset-0 transition-transform duration-[700ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110">
            <Image
              src={imageUrl}
              alt=""
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              className="object-cover"
            />
          </div>

          {/* Themed gradient overlay — goes from opaque theme color at bottom to transparent at top */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to top, hsl(var(--theme-color) / 0.92), hsl(var(--theme-color) / 0.65) 32%, transparent 62%)',
            }}
            aria-hidden="true"
          />

          {/* Content */}
          <div className="relative flex flex-col justify-end h-full p-4 sm:p-5 text-white">
            <h3 className="font-display text-xl sm:text-2xl font-semibold tracking-tight leading-tight">
              {location}
              {flag && <span className="ml-1 text-base align-middle opacity-80">{flag}</span>}
            </h3>
            <p className="font-accent text-xs italic text-white/80 mt-1">{stats}</p>

            {/* CTA — frosted panel that intensifies on hover */}
            <div
              className={cn(
                'mt-4 flex items-center justify-between',
                'bg-[hsl(var(--theme-color)/0.25)] backdrop-blur-md border border-[hsl(var(--theme-color)/0.3)]',
                'rounded-sm px-3 py-2 transition-all duration-300',
                'group-hover:bg-[hsl(var(--theme-color)/0.45)] group-hover:border-[hsl(var(--theme-color)/0.55)]',
              )}
            >
              <span className="font-accent text-[11px] tracking-[0.2em] uppercase font-medium">
                {cta}
              </span>
              <ArrowRight
                className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </div>
          </div>
        </Link>
      </div>
    );
  },
);
DestinationCard.displayName = 'DestinationCard';

export { DestinationCard };

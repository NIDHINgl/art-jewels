'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import type { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import Badge from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

interface TiltProductCardProps {
  product: Product;
  className?: string;
}

/**
 * Mouse-follow 3D tilt card. Perspective is applied to the outer wrapper; the
 * inner card rotates along X/Y based on cursor position, with a gold shine
 * highlight that tracks the cursor. Springs ease the motion naturally.
 * Designed as a compact "similar products" tile for the PDP.
 */
export function TiltProductCard({ product, className }: TiltProductCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0); // -0.5 … 0.5 (cursor X within card)
  const y = useMotionValue(0);

  const springConfig = { stiffness: 200, damping: 20, mass: 0.4 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-12, 12]), springConfig);
  // Shine position (percentage) follows cursor
  const shineX = useTransform(x, [-0.5, 0.5], ['10%', '90%']);
  const shineY = useTransform(y, [-0.5, 0.5], ['15%', '85%']);
  const shineOpacity = useSpring(0, { stiffness: 150, damping: 18 });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const handleEnter = () => shineOpacity.set(1);
  const handleLeave = () => {
    x.set(0);
    y.set(0);
    shineOpacity.set(0);
  };

  const primary = product.images[0];
  const secondary = product.images[1] ?? primary;

  return (
    <div
      className={cn('[perspective:1200px] w-full h-full', className)}
      onMouseMove={handleMove}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      ref={ref}
    >
      <motion.div
        className="relative w-full h-full rounded-sm overflow-hidden bg-obsidian [transform-style:preserve-3d]"
        style={{ rotateX, rotateY }}
      >
        {/* Image layer — lifted slightly on Z for depth */}
        <Link
          href={`/product/${product.slug}`}
          aria-label={`View ${product.name}`}
          className="block relative aspect-[4/5]"
        >
          <div
            className="absolute inset-0"
            style={{ transform: 'translateZ(30px)' }}
          >
            {primary ? (
              <Image
                src={primary}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 50vw, 25vw"
                className="object-cover"
                placeholder="blur"
                blurDataURL="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMCAxMCI+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjMWExMTBhIi8+PC9zdmc+"
              />
            ) : (
              <div className="w-full h-full bg-champagne/20" />
            )}
            {/* Bottom dark gradient for text readability */}
            <div
              className="absolute inset-0 bg-gradient-to-t from-obsidian/90 via-obsidian/30 to-transparent"
              aria-hidden="true"
            />
          </div>

          {/* Gold corner frame — rendered at +40Z for a layered-glass feel */}
          <div
            className="absolute inset-3 pointer-events-none"
            style={{ transform: 'translateZ(50px)' }}
            aria-hidden="true"
          >
            <span className="absolute top-0 left-0 w-4 h-4 border-l border-t border-gold/60" />
            <span className="absolute top-0 right-0 w-4 h-4 border-r border-t border-gold/60" />
            <span className="absolute bottom-0 left-0 w-4 h-4 border-l border-b border-gold/60" />
            <span className="absolute bottom-0 right-0 w-4 h-4 border-r border-b border-gold/60" />
          </div>

          {/* Badges */}
          <div
            className="absolute top-3 left-3 z-10 flex flex-col gap-1.5"
            style={{ transform: 'translateZ(60px)' }}
          >
            {!product.inStock && <Badge variant="outofstock">Out of Stock</Badge>}
            {product.isNew && product.inStock && <Badge variant="new">New</Badge>}
          </div>

          {/* Cursor-following gold shine */}
          <motion.div
            className="absolute inset-0 pointer-events-none mix-blend-overlay"
            style={{
              opacity: shineOpacity,
              background: useTransform(
                [shineX, shineY],
                ([sx, sy]) =>
                  `radial-gradient(260px circle at ${sx} ${sy}, rgba(233, 197, 118, 0.55), transparent 60%)`,
              ),
            }}
            aria-hidden="true"
          />

          {/* Secondary image peek — subtle, offset behind primary */}
          {secondary !== primary && (
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-40 transition-opacity duration-500 mix-blend-lighten"
              aria-hidden="true"
            >
              <Image src={secondary} alt="" fill sizes="25vw" className="object-cover scale-105" />
            </div>
          )}

          {/* Content block — floats slightly out on Z for depth */}
          <div
            className="absolute inset-x-4 bottom-4 z-10 text-white"
            style={{ transform: 'translateZ(70px)' }}
          >
            <p className="font-accent text-[10px] tracking-[0.3em] uppercase text-gold/90 mb-1">
              {product.category}
            </p>
            <h3 className="font-display text-base sm:text-lg leading-tight line-clamp-2">
              {product.name}
            </h3>
            <div className="flex items-center justify-between mt-3">
              <p className="font-body text-sm font-semibold text-gold">
                {formatPrice(product.price)}
              </p>
              <span className="inline-flex items-center gap-1 font-accent text-[10px] italic tracking-wider text-pearl/80">
                View
                <ArrowRight
                  size={12}
                  className="transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </span>
            </div>
          </div>
        </Link>
      </motion.div>
    </div>
  );
}

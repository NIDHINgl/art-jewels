'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag } from 'lucide-react';
import type { Product } from '@/types';
import { formatPrice, cn } from '@/lib/utils';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useToast } from '@/components/ui/Toast';
import { useInView } from '@/lib/hooks';
import {
  AnimatedHeart,
  AnimatedSuccess,
} from '@/components/ui/animated-state-icons';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface ProductCardProps {
  product: Product;
  index?: number;
}

/**
 * Unified luxury product card.
 *
 * Earlier versions split the image and the info into two visually disconnected
 * blocks — the image was a distinct rounded frame, and the text sat floating
 * below with no containment, which made the card feel unfinished.
 *
 * This version treats the card as a single unit:
 *   - Shared pearl surface, single rounded radius, single soft shadow
 *   - Image occupies the top with subtle zoom + secondary-image crossfade
 *   - Info panel lives inside the same card, separated only by a thin gold
 *     hairline — no hard borders, no awkward gap
 *   - Whole card lifts + deepens shadow on hover, so the image and info
 *     animate together as one piece
 *   - Wishlist heart + badge + slide-up "Add to Bag" bar retained on the
 *     image; quick-tap cart icon on the info row for touch users
 */
export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [added, setAdded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { threshold: 0.05, rootMargin: '60px' });

  const addItem = useCartStore((s) => s.addItem);
  const { toggle, isWishlisted } = useWishlistStore();
  const { toast } = useToast();

  const wishlisted = isWishlisted(product.id);
  const primaryImage = product.images[0] ?? null;
  const secondaryImage = product.images[1] ?? null;

  const primaryBadge: { label: string; tone: 'gold' | 'rose' | 'graphite' } | null =
    !product.inStock
      ? { label: 'Sold Out', tone: 'graphite' }
      : product.isBestseller
      ? { label: 'Bestseller', tone: 'gold' }
      : product.isNew
      ? { label: 'New', tone: 'rose' }
      : null;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.inStock || added) return;
    addItem(product);
    setAdded(true);
    toast('Added to cart', 'success', {
      productName: product.name,
      productImage: primaryImage ?? undefined,
    });
    setTimeout(() => setAdded(false), 1600);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(product);
    toast(
      wishlisted ? 'Removed from wishlist' : 'Saved to wishlist',
      wishlisted ? 'info' : 'success',
      { productName: product.name },
    );
  };

  return (
    <article
      ref={cardRef}
      className={cn(
        // ─── Unified container — image and info share one surface ───
        'product-card group relative flex flex-col bg-pearl rounded-sm overflow-hidden',
        'border border-platinum/80',
        'shadow-[0_1px_2px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.14)]',
        'transition-[transform,box-shadow,border-color,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
        'hover:-translate-y-1 hover:border-gold/40',
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5',
      )}
      style={{ transitionDelay: `${Math.min(index * 50, 300)}ms` }}
    >
      {/* ─── Image ─── lives at the top of the card (no inner border/radius of its own) */}
      <Link
        href={`/product/${product.slug}`}
        className="relative block aspect-[3/4] overflow-hidden bg-[#f3ecdf]"
        aria-label={`View ${product.name}`}
      >
        {primaryImage ? (
          <>
            <Image
              src={primaryImage}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
              placeholder="blur"
              blurDataURL="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMCAxMCI+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjZjZlOWQwIi8+PC9zdmc+"
            />
            {secondaryImage && (
              <Image
                src={secondaryImage}
                alt=""
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                aria-hidden="true"
              />
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-champagne/40">
            <div className="w-12 h-12 rotate-45 border border-gold/40" aria-hidden="true" />
          </div>
        )}

        {/* Badge — single, refined */}
        {primaryBadge && (
          <span
            className={cn(
              'absolute top-3 left-3 z-10 inline-flex items-center px-2.5 py-1 rounded-full',
              'font-body font-semibold text-[9px] tracking-[0.3em] uppercase backdrop-blur-sm',
              primaryBadge.tone === 'gold' &&
                'bg-gold/95 text-white border border-gold-bright/60',
              primaryBadge.tone === 'rose' &&
                'bg-white/90 text-rose-gold border border-rose-gold/50',
              primaryBadge.tone === 'graphite' &&
                'bg-obsidian/80 text-white border border-obsidian/90',
            )}
          >
            {primaryBadge.label}
          </span>
        )}

        {/* Wishlist heart */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={handleWishlistToggle}
              aria-label={
                wishlisted
                  ? `Remove ${product.name} from wishlist`
                  : `Add ${product.name} to wishlist`
              }
              aria-pressed={wishlisted}
              className={cn(
                'absolute top-2.5 right-2.5 sm:top-3 sm:right-3 z-10',
                'w-11 h-11 sm:w-9 sm:h-9 rounded-full flex items-center justify-center',
                'bg-white/95 backdrop-blur-sm shadow-sm',
                'transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-110 active:scale-95',
              )}
            >
              <AnimatedHeart
                size={18}
                filled={wishlisted}
                color="rgba(26,26,26,0.55)"
                fillColor="#c67a95"
              />
            </button>
          </TooltipTrigger>
          <TooltipContent side="left">
            {wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
          </TooltipContent>
        </Tooltip>

        {/* Quick-add bar — slides up on hover */}
        {product.inStock && (
          <button
            onClick={handleAddToCart}
            aria-label={
              added ? `${product.name} added to cart` : `Quick add ${product.name}`
            }
            className={cn(
              'absolute left-3 right-3 bottom-3 z-10',
              'flex items-center justify-center gap-2',
              'py-2.5 rounded-sm',
              'bg-obsidian/92 backdrop-blur-md text-white',
              'font-body text-[11px] tracking-[0.22em] uppercase font-semibold',
              'translate-y-[120%] opacity-0 group-hover:translate-y-0 group-hover:opacity-100',
              'transition-[transform,opacity,background-color] duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]',
              'hover:bg-obsidian active:scale-[0.98]',
            )}
          >
            {added ? (
              <>
                <AnimatedSuccess size={18} done color="#e9c576" />
                <span className="text-gold">Added</span>
              </>
            ) : (
              <>
                <ShoppingBag size={16} strokeWidth={2.25} className="text-gold" aria-hidden="true" />
                <span>Add to Bag</span>
              </>
            )}
          </button>
        )}

        {!product.inStock && (
          <div
            className="absolute inset-0 bg-ivory/60 mix-blend-saturation pointer-events-none"
            aria-hidden="true"
          />
        )}
      </Link>

      {/* ─── Gold hairline divider between image and info ─── */}
      <div
        className="h-px bg-gradient-to-r from-transparent via-gold/35 to-transparent"
        aria-hidden="true"
      />

      {/* ─── Info panel — lives inside the same card ─── */}
      <div className="flex flex-col gap-2 px-4 pt-3.5 pb-4 flex-1">
        {/* Category eyebrow — small, tracked, gold */}
        <div className="flex items-center justify-between">
          <p className="font-body font-semibold text-[9px] sm:text-[10px] tracking-[0.35em] uppercase text-gold/90">
            {product.category}
          </p>
          {/* Material chip on the right — subtle */}
          {product.material[0] && (
            <p className="font-accent italic text-[10px] text-obsidian/65 capitalize truncate max-w-[55%]">
              {product.material[0]}
            </p>
          )}
        </div>

        {/* Name */}
        <Link href={`/product/${product.slug}`} className="group/name min-w-0">
          <h3 className="font-display text-[15px] sm:text-base text-obsidian leading-snug line-clamp-2 group-hover/name:text-gold transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Price + inline cart icon — tight rhythm */}
        <div className="flex items-center justify-between gap-2 mt-auto pt-2">
          <p className="font-body font-semibold text-[15px] sm:text-base text-obsidian tabular-nums">
            {formatPrice(product.price)}
          </p>
          {product.inStock && (
            <button
              onClick={handleAddToCart}
              aria-label={`Add ${product.name} to cart`}
              className={cn(
                // 44×44 touch target on mobile, 36px compact pill on desktop
                'w-11 h-11 sm:w-9 sm:h-9 rounded-full flex items-center justify-center shrink-0',
                'transition-[background-color,color,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-95',
                added
                  ? 'bg-gold text-white'
                  : 'bg-obsidian/5 text-obsidian/80 hover:bg-obsidian hover:text-pearl',
              )}
            >
              {added ? (
                <AnimatedSuccess size={16} done color="currentColor" />
              ) : (
                <ShoppingBag size={15} strokeWidth={2} aria-hidden="true" />
              )}
            </button>
          )}
          {!product.inStock && (
            <span className="font-accent italic text-[11px] text-obsidian/60">
              Sold out
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

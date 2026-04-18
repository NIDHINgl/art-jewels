'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Plus } from 'lucide-react';
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

interface ProductCardProps {
  product: Product;
  index?: number;
}

/**
 * Editorial luxury product card. Design principles:
 *   - Image is the hero; subtle zoom on hover (1.04), no 3D effects
 *   - One badge max, single clear primary action
 *   - Gold corner ornaments fade in on hover — signals handcrafted intention
 *   - "Add to Bag" slides in from bottom on hover, leaving the resting card clean
 *   - Price + name hierarchy follows luxury magazine typography
 *   - Wishlist always accessible (top-right)
 *
 * Intentionally restrained — lists of cards should feel like a gallery, not a
 * slot machine of animations.
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

  // Single most-important badge — not a stack
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
        'product-card group relative flex flex-col bg-transparent',
        'transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]',
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
      )}
      style={{ transitionDelay: `${Math.min(index * 50, 300)}ms` }}
    >
      {/* ─── Image ─── */}
      <Link
        href={`/product/${product.slug}`}
        className="relative block aspect-[3/4] overflow-hidden rounded-sm bg-[#f3ecdf] smooth-paint"
        aria-label={`View ${product.name}`}
      >
        {primaryImage ? (
          <>
            <Image
              src={primaryImage}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
              placeholder="blur"
              blurDataURL="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMCAxMCI+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjZjZlOWQwIi8+PC9zdmc+"
            />
            {/* Secondary image — cross-fades in on hover */}
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

        {/* Gold corner ornaments — fade in on hover */}
        <div
          className="absolute inset-2.5 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          aria-hidden="true"
        >
          <span className="absolute top-0 left-0 w-3 h-3 border-l border-t border-gold" />
          <span className="absolute top-0 right-0 w-3 h-3 border-r border-t border-gold" />
          <span className="absolute bottom-0 left-0 w-3 h-3 border-l border-b border-gold" />
          <span className="absolute bottom-0 right-0 w-3 h-3 border-r border-b border-gold" />
        </div>

        {/* Badge (one) — refined pill */}
        {primaryBadge && (
          <span
            className={cn(
              'absolute top-3 left-3 z-10 inline-flex items-center px-2.5 py-1 rounded-full',
              'font-accent text-[9px] tracking-[0.3em] uppercase backdrop-blur-sm',
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

        {/* Wishlist — always visible, top-right */}
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
            // Larger touch target on mobile (44px), compact on desktop (36px)
            'w-11 h-11 sm:w-9 sm:h-9 rounded-full flex items-center justify-center',
            'bg-white/90 backdrop-blur-sm shadow-sm',
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

        {/* Quick-add bar — slides up on hover. Only on in-stock. */}
        {product.inStock && (
          <button
            onClick={handleAddToCart}
            aria-label={added ? `${product.name} added to cart` : `Quick add ${product.name}`}
            className={cn(
              'absolute left-3 right-3 bottom-3 z-10',
              'flex items-center justify-center gap-2',
              'py-2.5 rounded-sm',
              'bg-obsidian/92 backdrop-blur-md text-white',
              'font-body text-xs tracking-wider uppercase font-medium',
              'translate-y-[120%] opacity-0 group-hover:translate-y-0 group-hover:opacity-100',
              'transition-[transform,opacity] duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]',
              'hover:bg-obsidian active:scale-[0.98]',
            )}
          >
            {added ? (
              <>
                <AnimatedSuccess size={14} done color="#e9c576" />
                <span className="text-gold">Added</span>
              </>
            ) : (
              <>
                <Plus size={14} className="text-gold" aria-hidden="true" />
                <span>Add to Bag</span>
              </>
            )}
          </button>
        )}

        {/* Out-of-stock veil */}
        {!product.inStock && (
          <div
            className="absolute inset-0 bg-ivory/55 mix-blend-saturation pointer-events-none"
            aria-hidden="true"
          />
        )}
      </Link>

      {/* ─── Info ─── */}
      <div className="flex flex-col pt-4 px-0.5 pb-1">
        {/* Category eyebrow */}
        <p className="font-accent text-[10px] tracking-[0.3em] uppercase text-gold/80 mb-1.5">
          {product.category}
        </p>

        {/* Name */}
        <Link href={`/product/${product.slug}`} className="group/name">
          <h3 className="font-display text-[15px] sm:text-base text-obsidian leading-snug line-clamp-2 group-hover/name:text-gold transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Material subline */}
        <p className="font-accent italic text-xs text-obsidian/50 mt-1 capitalize line-clamp-1">
          {product.material.join(' · ')}
        </p>

        {/* Price row with decorative rule */}
        <div className="flex items-center gap-3 mt-3">
          <p className="font-body font-semibold text-sm text-obsidian tabular-nums">
            {formatPrice(product.price)}
          </p>
          <span className="flex-1 h-px bg-gradient-to-r from-gold/30 via-platinum to-transparent" aria-hidden="true" />
          {/* Small icon add — redundant with quick-add, but always tappable on touch */}
          {product.inStock && (
            <button
              onClick={handleAddToCart}
              aria-label={`Add ${product.name} to cart`}
              className={cn(
                // 44px hit area on mobile for touch, 32px visual on sm+
                'w-11 h-11 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0',
                'transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-95',
                added
                  ? 'bg-gold/15 text-gold'
                  : 'bg-transparent text-obsidian/50 hover:text-gold hover:bg-gold/10',
              )}
            >
              {added ? (
                <AnimatedSuccess size={14} done color="currentColor" />
              ) : (
                <ShoppingBag size={13} aria-hidden="true" />
              )}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

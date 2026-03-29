'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingBag, Check } from 'lucide-react';
import type { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useToast } from '@/components/ui/Toast';
import Badge from '@/components/ui/Badge';
import { useInView } from '@/lib/hooks';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [added, setAdded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { threshold: 0.1 });

  const addItem = useCartStore((s) => s.addItem);
  const { toggle, isWishlisted } = useWishlistStore();
  const { toast } = useToast();

  const wishlisted = isWishlisted(product.id);
  const primaryImage = product.images[0] ?? null;
  const secondaryImage = product.images[1] ?? null;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.inStock || added) return;

    addItem(product);
    setAdded(true);
    toast(`Added to cart`, 'success', {
      productName: product.name,
      productImage: primaryImage ?? undefined,
    });

    setTimeout(() => setAdded(false), 1500);
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
      className={[
        'product-card group relative flex flex-col bg-pearl',
        'transition-all duration-500',
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6',
      ].join(' ')}
      style={{ transitionDelay: `${index * 60}ms` }}
    >
      {/* Image Container */}
      <Link
        href={`/product/${product.slug}`}
        className="block relative overflow-hidden bg-platinum/30 aspect-[3/4]"
        tabIndex={0}
        aria-label={`View ${product.name}`}
      >
        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
          {!product.inStock && <Badge variant="outofstock">Out of Stock</Badge>}
          {product.isNew && product.inStock && <Badge variant="new">New</Badge>}
          {product.isBestseller && product.inStock && <Badge variant="bestseller">Bestseller</Badge>}
        </div>

        {/* Wishlist button */}
        <button
          onClick={handleWishlistToggle}
          aria-label={wishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          aria-pressed={wishlisted}
          className={[
            'absolute top-3 right-3 z-10',
            'w-9 h-9 rounded-full flex items-center justify-center',
            'bg-white/80 backdrop-blur-sm shadow-sm',
            'transition-all duration-200 hover:scale-110 active:scale-95',
            wishlisted ? 'text-rose-gold' : 'text-obsidian/40 hover:text-rose-gold',
          ].join(' ')}
        >
          <Heart
            size={15}
            aria-hidden="true"
            fill={wishlisted ? 'currentColor' : 'none'}
          />
        </button>

        {/* Primary Image */}
        {primaryImage ? (
          <div className="product-card-image-primary absolute inset-0">
            <Image
              src={primaryImage}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover"
            />
          </div>
        ) : (
          <div className="product-card-image-primary absolute inset-0 flex flex-col items-center justify-center bg-champagne/30 gap-3">
            <div className="w-10 h-10 rotate-45 border border-gold/40" aria-hidden="true" />
            <p className="font-accent text-xs italic text-obsidian/40">Image coming soon</p>
          </div>
        )}

        {/* Secondary Image (hover) */}
        {secondaryImage && (
          <div className="product-card-image-secondary absolute inset-0">
            <Image
              src={secondaryImage}
              alt={`${product.name} — alternate view`}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover"
            />
          </div>
        )}

        {/* Out of stock overlay */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-white/40 z-[5]" aria-hidden="true" />
        )}
      </Link>

      {/* Info */}
      <div className="flex flex-col gap-2 pt-4 pb-5 px-1 flex-1">
        <div className="flex-1">
          <Link href={`/product/${product.slug}`} className="group/name">
            <h3 className="font-display text-sm sm:text-base text-obsidian line-clamp-2 group-hover/name:text-gold transition-colors leading-snug">
              {product.name}
            </h3>
          </Link>
          <p className="font-accent text-xs italic text-obsidian/50 mt-1 capitalize">
            {product.material.join(' · ')}
          </p>
        </div>

        <div className="flex items-center justify-between gap-2 mt-1">
          <p className="font-body font-semibold text-sm sm:text-base text-obsidian">
            {formatPrice(product.price)}
          </p>

          {/* Add to cart */}
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            aria-label={
              !product.inStock
                ? `${product.name} is out of stock`
                : added
                ? `${product.name} added to cart`
                : `Add ${product.name} to cart`
            }
            className={[
              'flex items-center gap-1.5 px-3 py-2 text-xs font-body font-medium',
              'transition-all duration-200 active:scale-95 min-h-[36px]',
              product.inStock
                ? added
                  ? 'bg-green-600/10 text-green-700 border border-green-600/30'
                  : 'bg-velvet text-white hover:bg-velvet/85 shadow-sm'
                : 'bg-platinum text-obsidian/30 cursor-not-allowed',
            ].join(' ')}
          >
            {added ? (
              <>
                <Check size={13} aria-hidden="true" />
                <span className="hidden sm:inline">Added</span>
              </>
            ) : (
              <>
                <ShoppingBag size={13} aria-hidden="true" />
                <span className="hidden sm:inline">
                  {product.inStock ? 'Add' : 'Sold Out'}
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}

'use client';

import React, { useState } from 'react';
import { ShoppingBag, ChevronDown, ChevronUp } from 'lucide-react';
import type { Product } from '@/types';
import { formatPrice, formatLabel } from '@/lib/utils';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useToast } from '@/components/ui/Toast';
import Badge from '@/components/ui/Badge';
import { PrestigeButton } from '@/components/ui/prestige-button';
import {
  AnimatedHeart,
  AnimatedSuccess,
} from '@/components/ui/animated-state-icons';
import { MAX_CART_QUANTITY } from '@/lib/constants';

interface ProductInfoProps {
  product: Product;
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    product.sizes?.[0],
  );
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [descOpen, setDescOpen] = useState(false);
  const [careOpen, setCareOpen] = useState(false);
  const [shippingOpen, setShippingOpen] = useState(false);

  const addItem = useCartStore((s) => s.addItem);
  const { toggle, isWishlisted } = useWishlistStore();
  const { toast } = useToast();
  const wishlisted = isWishlisted(product.id);

  const handleAddToCart = () => {
    if (!product.inStock || added) return;
    addItem(product, quantity, selectedSize);
    setAdded(true);
    toast('Added to cart', 'success', {
      productName: product.name,
      productImage: product.images[0],
    });
    setTimeout(() => setAdded(false), 1500);
  };

  const handleWishlist = () => {
    toggle(product);
    toast(
      wishlisted ? 'Removed from wishlist' : 'Saved to wishlist',
      wishlisted ? 'info' : 'success',
      { productName: product.name },
    );
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Badges */}
      <div className="flex gap-2 flex-wrap">
        {!product.inStock && <Badge variant="outofstock">Out of Stock</Badge>}
        {product.isNew && product.inStock && <Badge variant="new">New Arrival</Badge>}
        {product.isBestseller && product.inStock && <Badge variant="bestseller">Bestseller</Badge>}
      </div>

      {/* Category eyebrow */}
      <p className="font-body font-semibold text-xs tracking-[0.4em] uppercase text-gold -mb-3">
        {product.category}
      </p>

      {/* Name */}
      <h1 className="font-display text-fluid-h1 text-obsidian leading-tight">
        {product.name}
      </h1>

      {/* Price with decorative rule */}
      <div className="flex items-center gap-4">
        <p className="font-body text-2xl font-semibold text-obsidian tabular-nums">
          {formatPrice(product.price)}
        </p>
        <span
          className="flex-1 h-px bg-gradient-to-r from-gold/40 via-platinum to-transparent"
          aria-hidden="true"
        />
      </div>

      {/* Short description */}
      <p className="font-accent text-base italic text-obsidian/80 leading-relaxed border-l-2 border-gold/30 pl-4">
        {product.description}
      </p>

      {/* Specs */}
      <dl className="grid grid-cols-2 gap-x-6 gap-y-3">
        {product.material.length > 0 && (
          <>
            <dt className="font-body text-xs font-semibold tracking-widest uppercase text-obsidian/60">Material</dt>
            <dd className="font-accent text-sm text-obsidian capitalize">
              {product.material.map(formatLabel).join(', ')}
            </dd>
          </>
        )}
        {product.style && (
          <>
            <dt className="font-body text-xs font-semibold tracking-widest uppercase text-obsidian/60">Style</dt>
            <dd className="font-accent text-sm text-obsidian capitalize">{product.style}</dd>
          </>
        )}
        {product.weight && (
          <>
            <dt className="font-body text-xs font-semibold tracking-widest uppercase text-obsidian/60">Weight</dt>
            <dd className="font-accent text-sm text-obsidian">{product.weight}</dd>
          </>
        )}
        {product.dimensions && (
          <>
            <dt className="font-body text-xs font-semibold tracking-widest uppercase text-obsidian/60">Dimensions</dt>
            <dd className="font-accent text-sm text-obsidian">{product.dimensions}</dd>
          </>
        )}
      </dl>

      {/* Size selector */}
      {product.sizes && product.sizes.length > 0 && (
        <div>
          <p className="font-body text-xs font-semibold tracking-widest uppercase text-obsidian/60 mb-3">
            Select Size
          </p>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Size options">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                aria-pressed={selectedSize === size}
                className={[
                  'px-4 py-2 font-body text-sm border rounded-sm transition-all',
                  selectedSize === size
                    ? 'border-gold bg-gold/5 text-gold font-medium'
                    : 'border-platinum-dark text-obsidian/80 hover:border-gold hover:text-obsidian',
                ].join(' ')}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity */}
      <div>
        <p className="font-body text-xs font-semibold tracking-widest uppercase text-obsidian/60 mb-3">
          Quantity
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
            className="w-10 h-10 border border-platinum-dark rounded-sm flex items-center justify-center text-obsidian/60 hover:border-gold hover:text-gold disabled:opacity-30 transition-all"
          >
            −
          </button>
          <span className="font-body font-medium w-8 text-center">{quantity}</span>
          <button
            onClick={() => setQuantity((q) => Math.min(MAX_CART_QUANTITY, q + 1))}
            disabled={quantity >= MAX_CART_QUANTITY}
            aria-label="Increase quantity"
            title={quantity >= MAX_CART_QUANTITY ? 'Maximum 10 per item' : undefined}
            className="w-10 h-10 border border-platinum-dark rounded-sm flex items-center justify-center text-obsidian/60 hover:border-gold hover:text-gold disabled:opacity-30 transition-all"
          >
            +
          </button>
        </div>
      </div>

      {/* Add to cart + wishlist */}
      <div className="flex gap-3">
        <PrestigeButton
          type="button"
          onClick={handleAddToCart}
          disabled={!product.inStock}
          icon={
            added ? (
              <AnimatedSuccess size={20} done color="currentColor" />
            ) : (
              <ShoppingBag />
            )
          }
          title={
            !product.inStock ? 'Out of Stock' : added ? 'Added to Cart' : 'Add to Cart'
          }
          subtitle={
            !product.inStock
              ? 'Temporarily unavailable'
              : added
              ? 'Piece is in your cart'
              : 'Save this piece to your cart'
          }
          size="md"
          className="flex-1"
          aria-label={
            !product.inStock
              ? 'Out of stock'
              : added
              ? 'Added to cart'
              : `Add ${product.name} to cart`
          }
        />

        <button
          onClick={handleWishlist}
          aria-label={
            wishlisted
              ? `Remove ${product.name} from wishlist`
              : `Save ${product.name} to wishlist`
          }
          aria-pressed={wishlisted}
          className={[
            'w-14 h-14 sm:w-16 sm:h-16 border rounded-sm flex items-center justify-center shrink-0',
            'transition-colors duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-105 active:scale-95',
            wishlisted
              ? 'border-rose-gold bg-rose-gold/5'
              : 'border-platinum-dark hover:border-rose-gold',
          ].join(' ')}
        >
          <AnimatedHeart
            size={22}
            filled={wishlisted}
            color="rgba(26, 26, 26, 0.5)"
            fillColor="#c67a95"
          />
        </button>
      </div>

      {/* Expandable sections */}
      <div className="border-t border-platinum pt-4 flex flex-col">
        {/* Full Description */}
        <AccordionItem
          title="Description"
          isOpen={descOpen}
          onToggle={() => setDescOpen((v) => !v)}
        >
          <p className="font-accent text-sm leading-relaxed text-obsidian/80 whitespace-pre-line italic">
            {product.fullDescription}
          </p>
        </AccordionItem>

        {/* Care */}
        <AccordionItem
          title="Care Instructions"
          isOpen={careOpen}
          onToggle={() => setCareOpen((v) => !v)}
        >
          <p className="font-accent text-sm leading-relaxed text-obsidian/80 italic">
            {product.careInstructions}
          </p>
        </AccordionItem>

        {/* Shipping */}
        <AccordionItem
          title="Shipping & Returns"
          isOpen={shippingOpen}
          onToggle={() => setShippingOpen((v) => !v)}
        >
          <div className="font-accent text-sm leading-relaxed text-obsidian/80 italic space-y-2">
            <p>All orders are dispatched within 3–5 business days. Custom pieces require 10–14 days.</p>
            <p>We ship across India via insured courier. Packaging is minimal, considered, and recyclable.</p>
            <p>If a piece arrives damaged, contact us within 48 hours with photographs. We will arrange a replacement or refund.</p>
          </div>
        </AccordionItem>
      </div>
    </div>
  );
}

function AccordionItem({
  title,
  isOpen,
  onToggle,
  children,
}: {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-platinum">
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        className="w-full flex items-center justify-between py-4 text-left group"
      >
        <span className="font-body text-sm font-semibold text-obsidian group-hover:text-gold transition-colors">
          {title}
        </span>
        {isOpen ? (
          <ChevronUp size={16} className="text-obsidian/60" aria-hidden="true" />
        ) : (
          <ChevronDown size={16} className="text-obsidian/60" aria-hidden="true" />
        )}
      </button>
      {isOpen && (
        <div className="pb-5 animate-fade-up">
          {children}
        </div>
      )}
    </div>
  );
}

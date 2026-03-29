'use client';

import React, { useState } from 'react';
import { ShoppingBag, Heart, Check, ChevronDown, ChevronUp } from 'lucide-react';
import type { Product } from '@/types';
import { formatPrice, formatLabel } from '@/lib/utils';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useToast } from '@/components/ui/Toast';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
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

      {/* Name */}
      <h1 className="font-display text-fluid-h1 text-obsidian leading-tight">
        {product.name}
      </h1>

      {/* Price */}
      <p className="font-body text-2xl font-semibold text-obsidian">
        {formatPrice(product.price)}
      </p>

      {/* Short description */}
      <p className="font-accent text-base italic text-obsidian/70 leading-relaxed border-l-2 border-gold/30 pl-4">
        {product.description}
      </p>

      {/* Specs */}
      <dl className="grid grid-cols-2 gap-x-6 gap-y-3">
        {product.material.length > 0 && (
          <>
            <dt className="font-body text-xs font-semibold tracking-widest uppercase text-obsidian/40">Material</dt>
            <dd className="font-accent text-sm text-obsidian capitalize">
              {product.material.map(formatLabel).join(', ')}
            </dd>
          </>
        )}
        {product.style && (
          <>
            <dt className="font-body text-xs font-semibold tracking-widest uppercase text-obsidian/40">Style</dt>
            <dd className="font-accent text-sm text-obsidian capitalize">{product.style}</dd>
          </>
        )}
        {product.weight && (
          <>
            <dt className="font-body text-xs font-semibold tracking-widest uppercase text-obsidian/40">Weight</dt>
            <dd className="font-accent text-sm text-obsidian">{product.weight}</dd>
          </>
        )}
        {product.dimensions && (
          <>
            <dt className="font-body text-xs font-semibold tracking-widest uppercase text-obsidian/40">Dimensions</dt>
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
                    : 'border-platinum-dark text-obsidian/70 hover:border-gold hover:text-obsidian',
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
        <Button
          variant={added ? 'ghost' : 'primary'}
          size="lg"
          fullWidth
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className={[
            'gap-2 transition-all',
            added ? 'bg-green-600/10 text-green-700 border border-green-600/30' : '',
          ].join(' ')}
          aria-label={
            !product.inStock
              ? 'Out of stock'
              : added
              ? 'Added to cart'
              : `Add ${product.name} to cart`
          }
        >
          {added ? <Check size={18} aria-hidden="true" /> : <ShoppingBag size={18} aria-hidden="true" />}
          {!product.inStock ? 'Out of Stock' : added ? 'Added to Cart' : 'Add to Cart'}
        </Button>

        <button
          onClick={handleWishlist}
          aria-label={wishlisted ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
          aria-pressed={wishlisted}
          className={[
            'w-14 h-14 border rounded-sm flex items-center justify-center shrink-0',
            'transition-all duration-200 hover:scale-105 active:scale-95',
            wishlisted
              ? 'border-rose-gold bg-rose-gold/5 text-rose-gold'
              : 'border-platinum-dark text-obsidian/40 hover:border-rose-gold hover:text-rose-gold',
          ].join(' ')}
        >
          <Heart size={20} fill={wishlisted ? 'currentColor' : 'none'} aria-hidden="true" />
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
          <p className="font-accent text-sm leading-relaxed text-obsidian/70 whitespace-pre-line italic">
            {product.fullDescription}
          </p>
        </AccordionItem>

        {/* Care */}
        <AccordionItem
          title="Care Instructions"
          isOpen={careOpen}
          onToggle={() => setCareOpen((v) => !v)}
        >
          <p className="font-accent text-sm leading-relaxed text-obsidian/70 italic">
            {product.careInstructions}
          </p>
        </AccordionItem>

        {/* Shipping */}
        <AccordionItem
          title="Shipping & Returns"
          isOpen={shippingOpen}
          onToggle={() => setShippingOpen((v) => !v)}
        >
          <div className="font-accent text-sm leading-relaxed text-obsidian/70 italic space-y-2">
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
          <ChevronUp size={16} className="text-obsidian/40" aria-hidden="true" />
        ) : (
          <ChevronDown size={16} className="text-obsidian/40" aria-hidden="true" />
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

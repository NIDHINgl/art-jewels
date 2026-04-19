'use client';

import React, { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, Sparkles } from 'lucide-react';
import { useWishlistStore } from '@/store/wishlistStore';
import { useCartStore } from '@/store/cartStore';
import { useToast } from '@/components/ui/Toast';
import ProductCard from '@/components/product/ProductCard';
import Button from '@/components/ui/Button';
import { PrestigeButton } from '@/components/ui/prestige-button';
import { products } from '@/data/products';

export default function WishlistPageClient() {
  const router = useRouter();
  const { items, clearWishlist } = useWishlistStore();
  const addItem = useCartStore((s) => s.addItem);
  const { toast } = useToast();
  const catalogProducts = useMemo(
    () => new Map(products.map((product) => [product.id, product])),
    [],
  );
  const displayItems = items.map((product) => catalogProducts.get(product.id) ?? product);

  const handleAddAll = () => {
    displayItems.forEach((product) => addItem(product));
    toast(
      `Added ${displayItems.length} piece${displayItems.length !== 1 ? 's' : ''} to cart`,
      'success',
    );
  };

  return (
    <div className="min-h-screen bg-ivory pt-20 sm:pt-24">
      {/* Page header */}
      <div className="bg-pearl border-b border-platinum">
        <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <p className="font-accent text-sm tracking-[0.4em] uppercase text-gold mb-2">
            Your Saved Pieces
          </p>
          <h1 className="font-display text-fluid-h1 text-obsidian">Wishlist</h1>
        </div>
      </div>

      <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {displayItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 sm:py-24 gap-6 text-center">
            {/* Ornamental heart frame with gold corner marks */}
            <div className="relative w-24 h-24 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-champagne/40" aria-hidden="true" />
              <Heart size={34} className="text-rose-gold/60 relative z-10" aria-hidden="true" />
              <span className="absolute top-0 left-0 w-3 h-3 border-l border-t border-gold/60" aria-hidden="true" />
              <span className="absolute top-0 right-0 w-3 h-3 border-r border-t border-gold/60" aria-hidden="true" />
              <span className="absolute bottom-0 left-0 w-3 h-3 border-l border-b border-gold/60" aria-hidden="true" />
              <span className="absolute bottom-0 right-0 w-3 h-3 border-r border-b border-gold/60" aria-hidden="true" />
            </div>
            <div>
              <p className="font-accent text-xs tracking-[0.4em] uppercase text-gold mb-2">
                Nothing Saved Yet
              </p>
              <h2 className="font-display text-2xl sm:text-3xl text-obsidian mb-2">
                Your wishlist is empty
              </h2>
              <p className="font-accent italic text-base text-obsidian/55 max-w-md mx-auto leading-relaxed">
                Save pieces you love as you browse — tap the heart on any piece
                and it will appear here.
              </p>
            </div>
            <PrestigeButton
              type="button"
              onClick={() => router.push('/collections')}
              icon={<Sparkles />}
              title="Browse Collection"
              variant="obsidian"
              size="md"
              className="w-full sm:w-auto"
            />
          </div>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <p className="font-accent text-sm italic text-obsidian/50">
                {displayItems.length} piece{displayItems.length !== 1 ? 's' : ''} saved
              </p>
              <div className="flex gap-3">
                <Button variant="outline" size="sm" onClick={handleAddAll}>
                  Add All to Cart
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearWishlist}
                  className="text-obsidian/50 hover:text-rose-gold"
                >
                  Clear Wishlist
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-7">
              {displayItems.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={index}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

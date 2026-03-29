'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { X, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/utils';
import CartItem from './CartItem';

export default function CartDrawer() {
  const { items, isDrawerOpen, closeDrawer, totalItems, totalPrice } = useCartStore();

  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isDrawerOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeDrawer();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [closeDrawer]);

  if (!isDrawerOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex"
      role="dialog"
      aria-modal="true"
      aria-label="Shopping cart"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-obsidian/60 backdrop-blur-sm animate-fade-in"
        onClick={closeDrawer}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="relative ml-auto w-full max-w-md h-full bg-ivory flex flex-col animate-slide-in-right shadow-elevated">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-platinum">
          <div className="flex items-center gap-3">
            <ShoppingBag size={20} className="text-gold" aria-hidden="true" />
            <h2 className="font-display text-lg text-obsidian">
              Your Cart
            </h2>
            {totalItems() > 0 && (
              <span className="text-xs font-body text-obsidian/50">
                ({totalItems()} item{totalItems() !== 1 ? 's' : ''})
              </span>
            )}
          </div>
          <button
            onClick={closeDrawer}
            aria-label="Close cart"
            className="w-9 h-9 flex items-center justify-center rounded-sm text-obsidian/50 hover:text-obsidian hover:bg-platinum/60 transition-all"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-champagne/40 flex items-center justify-center">
                <ShoppingBag size={24} className="text-gold/60" aria-hidden="true" />
              </div>
              <div>
                <p className="font-display text-lg text-obsidian mb-1">Your cart is empty</p>
                <p className="font-accent text-sm italic text-obsidian/50">
                  Discover pieces made for you.
                </p>
              </div>
              <Link
                href="/collections"
                onClick={closeDrawer}
                className="mt-2 px-6 py-3 bg-velvet text-white font-body text-sm font-medium hover:bg-velvet/85 transition-colors"
              >
                Browse Collection
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-platinum" role="list">
              {items.map((item) => (
                <li key={`${item.product.id}-${item.selectedSize ?? 'default'}`}>
                  <CartItem item={item} compact />
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-platinum p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="font-accent text-sm italic text-obsidian/60">Subtotal</span>
              <span className="font-body font-semibold text-lg text-obsidian">
                {formatPrice(totalPrice())}
              </span>
            </div>
            <Link
              href="/cart"
              onClick={closeDrawer}
              className="w-full py-4 bg-velvet text-white font-body font-medium text-sm text-center hover:bg-velvet/85 active:scale-[0.98] transition-all"
            >
              View Full Cart & Checkout
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

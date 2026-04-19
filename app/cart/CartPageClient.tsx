'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Trash2 } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/utils';
import CartItem from '@/components/cart/CartItem';
import CartSummary from '@/components/cart/CartSummary';
import CheckoutForm from '@/components/cart/CheckoutForm';
import Modal from '@/components/ui/Modal';
import { PrestigeButton } from '@/components/ui/prestige-button';
import { useToast } from '@/components/ui/Toast';

export default function CartPageClient() {
  const router = useRouter();
  const { items, clearCart, totalItems, totalPrice } = useCartStore();
  const { toast } = useToast();
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [clearModalOpen, setClearModalOpen] = useState(false);

  const handleClearCart = () => {
    clearCart();
    setClearModalOpen(false);
    toast('Cart cleared', 'info');
  };

  return (
    <div className="min-h-screen bg-ivory pt-20 sm:pt-24">
      {/* Page header */}
      <div className="bg-pearl border-b border-platinum">
        <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <p className="font-accent text-sm tracking-[0.4em] uppercase text-gold mb-2">
            Your Selection
          </p>
          <h1 className="font-display text-fluid-h1 text-obsidian">
            Shopping Cart
          </h1>
        </div>
      </div>

      <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {items.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-24 gap-6 text-center">
            <div className="w-20 h-20 rounded-full bg-champagne/40 flex items-center justify-center">
              <ShoppingBag size={32} className="text-gold/50" aria-hidden="true" />
            </div>
            <div>
              <h2 className="font-display text-2xl text-obsidian mb-2">
                Your cart is empty
              </h2>
              <p className="font-accent text-base italic text-obsidian/50 leading-relaxed">
                Each piece in the LUMORA collection is waiting to find its wearer.
              </p>
            </div>
            <PrestigeButton
              type="button"
              onClick={() => router.push('/collections')}
              icon={<ShoppingBag />}
              title="Browse Collection"
              variant="obsidian"
              size="md"
              className="w-full sm:w-auto"
            />
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-14 items-start">
            {/* Cart items */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-6">
                <p className="font-accent text-sm italic text-obsidian/50">
                  {totalItems()} item{totalItems() !== 1 ? 's' : ''} in your cart
                </p>
                <button
                  onClick={() => setClearModalOpen(true)}
                  className="flex items-center gap-1.5 font-accent text-sm italic text-obsidian/40 hover:text-rose-gold transition-colors"
                >
                  <Trash2 size={13} aria-hidden="true" />
                  Clear cart
                </button>
              </div>

              {/* Desktop table */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full" aria-label="Cart items">
                  <thead>
                    <tr className="border-b-2 border-platinum">
                      {['Product', 'Price', 'Quantity', 'Subtotal'].map((h) => (
                        <th
                          key={h}
                          className="text-left pb-3 font-body text-xs font-semibold tracking-widest uppercase text-obsidian/40 pr-4 last:pr-0"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <CartItem
                        key={`${item.product.id}-${item.selectedSize ?? 'default'}`}
                        item={item}
                      />
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td
                        colSpan={3}
                        className="pt-6 pr-4 font-body text-sm font-semibold text-obsidian text-right"
                      >
                        Total
                      </td>
                      <td className="pt-6 font-body text-xl font-bold text-obsidian whitespace-nowrap">
                        {formatPrice(totalPrice())}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Mobile card list */}
              <div className="sm:hidden border border-platinum rounded-sm overflow-hidden">
                {items.map((item) => (
                  <CartItem
                    key={`${item.product.id}-${item.selectedSize ?? 'default'}`}
                    item={item}
                    compact
                  />
                ))}
                <div className="flex justify-between items-center px-4 py-4 bg-pearl border-t border-platinum">
                  <span className="font-body text-sm font-semibold text-obsidian">
                    Total
                  </span>
                  <span className="font-body text-lg font-bold text-obsidian">
                    {formatPrice(totalPrice())}
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <Link
                  href="/collections"
                  className="font-accent text-sm italic text-gold hover:text-gold-light transition-colors underline underline-offset-2"
                >
                  ← Continue shopping
                </Link>
              </div>
            </div>

            {/* Order summary */}
            <div className="w-full lg:w-80 shrink-0">
              <CartSummary
                subtotal={totalPrice()}
                onCheckout={() => setCheckoutOpen(true)}
              />
            </div>
          </div>
        )}
      </div>

      <CheckoutForm
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
      />

      <Modal
        isOpen={clearModalOpen}
        onClose={() => setClearModalOpen(false)}
        title="Clear Cart"
        maxWidth="max-w-sm"
      >
        <p className="font-accent text-base italic text-obsidian/60 leading-relaxed mb-6">
          Are you sure you want to remove all pieces from your cart? This cannot
          be undone.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <PrestigeButton
            type="button"
            onClick={() => setClearModalOpen(false)}
            title="Keep Items"
            variant="outline"
            size="md"
            className="flex-1"
          />
          <PrestigeButton
            type="button"
            onClick={handleClearCart}
            icon={<Trash2 />}
            title="Clear Cart"
            variant="danger"
            size="md"
            className="flex-1"
          />
        </div>
      </Modal>
    </div>
  );
}

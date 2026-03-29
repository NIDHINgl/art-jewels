'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import Button from '@/components/ui/Button';

interface CartSummaryProps {
  subtotal: number;
  onCheckout: () => void;
}

export default function CartSummary({ subtotal, onCheckout }: CartSummaryProps) {
  return (
    <aside
      className="bg-pearl border border-platinum rounded-sm p-6 sticky top-24"
      aria-label="Order summary"
    >
      <h2 className="font-display text-xl text-obsidian mb-6">Order Summary</h2>

      <div className="flex flex-col gap-3 pb-5 border-b border-platinum">
        <div className="flex justify-between items-center">
          <span className="font-accent text-sm italic text-obsidian/60">Subtotal</span>
          <span className="font-body text-sm font-medium text-obsidian">
            {formatPrice(subtotal)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-accent text-sm italic text-obsidian/60">Shipping</span>
          <span className="font-accent text-xs italic text-obsidian/50">
            Calculated via WhatsApp
          </span>
        </div>
      </div>

      <div className="flex justify-between items-center py-5 border-b border-platinum">
        <span className="font-body text-base font-semibold text-obsidian">Total</span>
        <span className="font-body text-xl font-bold text-obsidian">
          {formatPrice(subtotal)}
        </span>
      </div>

      <div className="mt-5">
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={onCheckout}
          className="gap-2"
        >
          <MessageCircle size={18} aria-hidden="true" />
          Proceed to Checkout
        </Button>

        <p className="mt-4 font-accent text-xs italic text-center text-obsidian/40 leading-relaxed">
          You&apos;ll complete your order via WhatsApp. Our artisan will confirm
          availability and arrange delivery personally.
        </p>
      </div>
    </aside>
  );
}

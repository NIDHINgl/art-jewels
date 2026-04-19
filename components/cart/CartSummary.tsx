'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { PrestigeButton } from '@/components/ui/prestige-button';

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
      <p className="font-body font-semibold text-[10px] tracking-[0.4em] uppercase text-gold mb-1.5">
        Summary
      </p>
      <h2 className="font-display text-xl text-obsidian mb-6">Order Total</h2>

      <div className="flex flex-col gap-3 pb-5 border-b border-platinum">
        <div className="flex justify-between items-center">
          <span className="font-accent text-sm italic text-obsidian/60">Subtotal</span>
          <span className="font-body text-sm font-medium text-obsidian tabular-nums">
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
        <span className="font-body text-xl font-bold text-obsidian tabular-nums">
          {formatPrice(subtotal)}
        </span>
      </div>

      <div className="mt-5">
        <PrestigeButton
          type="button"
          onClick={onCheckout}
          icon={<MessageCircle />}
          title="Proceed to Checkout"
          subtitle="Confirm on WhatsApp"
          size="md"
          className="w-full"
        />

        <p className="mt-4 font-accent text-xs italic text-center text-obsidian/60 leading-relaxed">
          You&apos;ll complete your order via WhatsApp. Our artisan will confirm
          availability and arrange delivery personally.
        </p>
      </div>
    </aside>
  );
}

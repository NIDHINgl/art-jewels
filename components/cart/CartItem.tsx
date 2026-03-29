'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2, Plus, Minus } from 'lucide-react';
import type { CartItem as CartItemType } from '@/types';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/utils';
import { useToast } from '@/components/ui/Toast';
import { MAX_CART_QUANTITY } from '@/lib/constants';

interface CartItemProps {
  item: CartItemType;
  compact?: boolean;
}

export default function CartItem({ item, compact = false }: CartItemProps) {
  const { removeItem, updateQuantity } = useCartStore();
  const { toast } = useToast();
  const [removing, setRemoving] = useState(false);

  const handleRemove = () => {
    setRemoving(true);
    setTimeout(() => {
      removeItem(item.product.id);
      toast('Item removed from cart', 'info', { productName: item.product.name });
    }, 200);
  };

  const lineTotal = item.product.price * item.quantity;
  const image = item.product.images[0] ?? null;

  if (compact) {
    return (
      <div
        className={[
          'flex gap-4 p-4 transition-opacity duration-200',
          removing ? 'opacity-0' : 'opacity-100',
        ].join(' ')}
      >
        {/* Image */}
        <Link
          href={`/product/${item.product.slug}`}
          className="shrink-0 w-16 h-16 bg-platinum/40 rounded-sm overflow-hidden block"
        >
          {image ? (
            <Image
              src={image}
              alt={item.product.name}
              width={64}
              height={64}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-champagne/30">
              <div className="w-4 h-4 rotate-45 border border-gold/40" aria-hidden="true" />
            </div>
          )}
        </Link>

        {/* Info */}
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <Link
              href={`/product/${item.product.slug}`}
              className="font-body text-sm font-medium text-obsidian hover:text-gold transition-colors line-clamp-2"
            >
              {item.product.name}
            </Link>
            {item.selectedSize && (
              <p className="font-accent text-xs italic text-obsidian/50 mt-0.5">
                Size {item.selectedSize}
              </p>
            )}
          </div>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                aria-label="Decrease quantity"
                disabled={item.quantity <= 1}
                className="w-6 h-6 border border-platinum-dark rounded-sm flex items-center justify-center text-obsidian/60 hover:border-gold hover:text-gold disabled:opacity-30 transition-all"
              >
                <Minus size={10} aria-hidden="true" />
              </button>
              <span className="font-body text-sm w-5 text-center">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                aria-label="Increase quantity"
                disabled={item.quantity >= MAX_CART_QUANTITY}
                title={item.quantity >= MAX_CART_QUANTITY ? 'Maximum 10 per item' : undefined}
                className="w-6 h-6 border border-platinum-dark rounded-sm flex items-center justify-center text-obsidian/60 hover:border-gold hover:text-gold disabled:opacity-30 transition-all"
              >
                <Plus size={10} aria-hidden="true" />
              </button>
            </div>
            <span className="font-body text-sm font-semibold text-obsidian">
              {formatPrice(lineTotal)}
            </span>
          </div>
        </div>

        {/* Remove */}
        <button
          onClick={handleRemove}
          aria-label={`Remove ${item.product.name} from cart`}
          className="shrink-0 self-start text-obsidian/30 hover:text-rose-gold transition-colors mt-0.5"
        >
          <Trash2 size={14} aria-hidden="true" />
        </button>
      </div>
    );
  }

  // Full (cart page) view
  return (
    <tr
      className={[
        'border-b border-platinum transition-opacity duration-200',
        removing ? 'opacity-0' : 'opacity-100',
      ].join(' ')}
    >
      {/* Product */}
      <td className="py-6 pr-4">
        <div className="flex items-start gap-4">
          <Link
            href={`/product/${item.product.slug}`}
            className="shrink-0 w-20 h-20 bg-platinum/30 rounded-sm overflow-hidden"
          >
            {image ? (
              <Image
                src={image}
                alt={item.product.name}
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-champagne/30">
                <div className="w-5 h-5 rotate-45 border border-gold/40" aria-hidden="true" />
              </div>
            )}
          </Link>
          <div>
            <Link
              href={`/product/${item.product.slug}`}
              className="font-body font-medium text-sm text-obsidian hover:text-gold transition-colors"
            >
              {item.product.name}
            </Link>
            {item.selectedSize && (
              <p className="font-accent text-xs italic text-obsidian/50 mt-1">
                Size {item.selectedSize}
              </p>
            )}
            <button
              onClick={handleRemove}
              className="mt-2 flex items-center gap-1 font-accent text-xs text-obsidian/40 hover:text-rose-gold transition-colors"
            >
              <Trash2 size={11} aria-hidden="true" />
              Remove
            </button>
          </div>
        </div>
      </td>

      {/* Price */}
      <td className="py-6 pr-4 font-body text-sm text-obsidian/80 whitespace-nowrap">
        {formatPrice(item.product.price)}
      </td>

      {/* Quantity */}
      <td className="py-6 pr-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
            aria-label="Decrease quantity"
            disabled={item.quantity <= 1}
            className="w-8 h-8 border border-platinum-dark rounded-sm flex items-center justify-center text-obsidian/60 hover:border-gold hover:text-gold disabled:opacity-30 transition-all"
          >
            <Minus size={12} aria-hidden="true" />
          </button>
          <span className="font-body text-sm w-6 text-center font-medium">
            {item.quantity}
          </span>
          <button
            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
            aria-label="Increase quantity"
            disabled={item.quantity >= MAX_CART_QUANTITY}
            title={item.quantity >= MAX_CART_QUANTITY ? 'Maximum 10 per item' : undefined}
            className="w-8 h-8 border border-platinum-dark rounded-sm flex items-center justify-center text-obsidian/60 hover:border-gold hover:text-gold disabled:opacity-30 transition-all"
          >
            <Plus size={12} aria-hidden="true" />
          </button>
        </div>
      </td>

      {/* Subtotal */}
      <td className="py-6 font-body font-semibold text-sm text-obsidian whitespace-nowrap">
        {formatPrice(lineTotal)}
      </td>
    </tr>
  );
}

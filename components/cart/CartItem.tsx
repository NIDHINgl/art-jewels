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
import { products } from '@/data/products';

interface CartItemProps {
  item: CartItemType;
  compact?: boolean;
}

const productsById = new Map(products.map((product) => [product.id, product]));

export default function CartItem({ item, compact = false }: CartItemProps) {
  const { removeItem, updateQuantity } = useCartStore();
  const { toast } = useToast();
  const [removing, setRemoving] = useState(false);
  const currentProduct = productsById.get(item.product.id) ?? item.product;

  const handleRemove = () => {
    setRemoving(true);
    setTimeout(() => {
      removeItem(currentProduct.id);
      toast('Item removed from cart', 'info', { productName: currentProduct.name });
    }, 200);
  };

  const lineTotal = currentProduct.price * item.quantity;
  const image = currentProduct.images[0] ?? null;

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
          href={`/product/${currentProduct.slug}`}
          className="shrink-0 w-16 h-16 bg-platinum/40 rounded-sm overflow-hidden block"
        >
          {image ? (
            <Image
              src={image}
              alt={currentProduct.name}
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
              href={`/product/${currentProduct.slug}`}
              className="font-body text-sm font-medium text-obsidian hover:text-gold transition-colors line-clamp-2"
            >
              {currentProduct.name}
            </Link>
            {item.selectedSize && (
              <p className="font-accent text-xs italic text-obsidian/50 mt-0.5">
                Size {item.selectedSize}
              </p>
            )}
          </div>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-1">
              <button
                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                aria-label="Decrease quantity"
                disabled={item.quantity <= 1}
                className="relative w-8 h-8 min-w-[32px] flex items-center justify-center text-obsidian/60 hover:text-gold disabled:opacity-30 transition-colors before:content-[''] before:absolute before:inset-1 before:rounded-sm before:border before:border-platinum-dark hover:before:border-gold after:content-[''] after:absolute after:inset-[-6px]"
              >
                <Minus size={11} aria-hidden="true" />
              </button>
              <span className="font-body text-sm w-6 text-center tabular-nums">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                aria-label="Increase quantity"
                disabled={item.quantity >= MAX_CART_QUANTITY}
                title={item.quantity >= MAX_CART_QUANTITY ? 'Maximum 10 per item' : undefined}
                className="relative w-8 h-8 min-w-[32px] flex items-center justify-center text-obsidian/60 hover:text-gold disabled:opacity-30 transition-colors before:content-[''] before:absolute before:inset-1 before:rounded-sm before:border before:border-platinum-dark hover:before:border-gold after:content-[''] after:absolute after:inset-[-6px]"
              >
                <Plus size={11} aria-hidden="true" />
              </button>
            </div>
            <span className="font-body text-sm font-semibold text-obsidian tabular-nums">
              {formatPrice(lineTotal)}
            </span>
          </div>
        </div>

        {/* Remove */}
        <button
          onClick={handleRemove}
          aria-label={`Remove ${currentProduct.name} from cart`}
          className="shrink-0 self-start w-9 h-9 flex items-center justify-center text-obsidian/40 hover:text-rose-gold hover:bg-rose-gold/10 rounded-sm transition-colors -mr-1.5 -mt-1.5"
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
            href={`/product/${currentProduct.slug}`}
            className="shrink-0 w-20 h-20 bg-platinum/30 rounded-sm overflow-hidden"
          >
            {image ? (
              <Image
                src={image}
                alt={currentProduct.name}
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
              href={`/product/${currentProduct.slug}`}
              className="font-body font-medium text-sm text-obsidian hover:text-gold transition-colors"
            >
              {currentProduct.name}
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
        {formatPrice(currentProduct.price)}
      </td>

      {/* Quantity */}
      <td className="py-6 pr-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
            aria-label="Decrease quantity"
            disabled={item.quantity <= 1}
            className="w-9 h-9 border border-platinum-dark rounded-sm flex items-center justify-center text-obsidian/60 hover:border-gold hover:text-gold disabled:opacity-30 transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
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
            className="w-9 h-9 border border-platinum-dark rounded-sm flex items-center justify-center text-obsidian/60 hover:border-gold hover:text-gold disabled:opacity-30 transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
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

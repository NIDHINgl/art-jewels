import { CURRENCY_LOCALE, CURRENCY_SYMBOL, SELLER_WHATSAPP } from './constants';
import type { CartItem, CheckoutFormData } from '@/types';

// ─── Currency Formatting ──────────────────────────────────────────────────────
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat(CURRENCY_LOCALE, {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(amount)
    .replace('₹', CURRENCY_SYMBOL);
}

// ─── WhatsApp URL Generation ──────────────────────────────────────────────────
export function generateWhatsAppURL(
  items: CartItem[],
  formData: CheckoutFormData,
): string {
  const lineItems = items
    .map((item, index) => {
      const lineTotal = item.product.price * item.quantity;
      const variant = item.selectedSize ? `\n│    Variant: Size ${item.selectedSize}` : '';
      const separator = index < items.length - 1 ? '├' : '└';
      return `${separator}──────────────────────────────────\n│ ${index + 1}. ${item.product.name}\n│    Qty: ${item.quantity} × ${CURRENCY_SYMBOL}${item.product.price.toLocaleString('en-IN')} = ${CURRENCY_SYMBOL}${lineTotal.toLocaleString('en-IN')}${variant}`;
    })
    .join('\n');

  const cartTotal = items.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0,
  );

  const message = `--- NEW ORDER ---
Customer: ${formData.fullName}
Phone: ${formData.phone}
Address: ${formData.address.trim() || 'Not provided'}

ITEMS ORDERED:
┌──────────────────────────────────
${lineItems}

TOTAL: ${CURRENCY_SYMBOL}${cartTotal.toLocaleString('en-IN')}

Notes: ${formData.notes.trim() || 'None'}
--- END ORDER ---`;

  return `https://wa.me/${SELLER_WHATSAPP}?text=${encodeURIComponent(message)}`;
}

// ─── Slug Utilities ───────────────────────────────────────────────────────────
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

// ─── String Utilities ─────────────────────────────────────────────────────────
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}…`;
}

export function capitalise(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function formatLabel(value: string): string {
  return value
    .split('-')
    .map(capitalise)
    .join(' ');
}

// ─── ID Generator for Toasts ─────────────────────────────────────────────────
export function generateId(): string {
  return Math.random().toString(36).slice(2, 9);
}

// ─── Reduced Motion Check ─────────────────────────────────────────────────────
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// ─── Price Range Extraction ───────────────────────────────────────────────────
export function getPriceRange(prices: number[]): [number, number] {
  if (prices.length === 0) return [0, 100000];
  return [Math.min(...prices), Math.max(...prices)];
}

// ─── Debounce ─────────────────────────────────────────────────────────────────
export function debounce<TArgs extends unknown[]>(
  fn: (...args: TArgs) => void,
  delay: number,
): (...args: TArgs) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: TArgs) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

// ─── Clipboard ───────────────────────────────────────────────────────────────
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

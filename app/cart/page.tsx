import type { Metadata } from 'next';
import { PAGE_META } from '@/lib/constants';
import CartPageClient from './CartPageClient';

export const metadata: Metadata = {
  title: PAGE_META.cart.title,
  description: PAGE_META.cart.description,
};

export default function CartPage() {
  return <CartPageClient />;
}

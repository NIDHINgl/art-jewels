import type { Metadata } from 'next';
import { PAGE_META } from '@/lib/constants';
import WishlistPageClient from './WishlistPageClient';

export const metadata: Metadata = {
  title: PAGE_META.wishlist.title,
  description: PAGE_META.wishlist.description,
};

export default function WishlistPage() {
  return <WishlistPageClient />;
}

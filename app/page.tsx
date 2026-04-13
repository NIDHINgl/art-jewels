import type { Metadata } from 'next';
import { getProducts } from '@/lib/api';
import HeroSection from '@/components/home/HeroSection';
import FeaturedCategories from '@/components/home/FeaturedCategories';
import BestsellersFeed from '@/components/home/BestsellersFeed';
import CraftsmanshipStory from '@/components/home/CraftsmanshipStory';
import Testimonials from '@/components/home/Testimonials';
import GalleryGrid from '@/components/home/GalleryGrid';
import { PAGE_META } from '@/lib/constants';

export const metadata: Metadata = {
  title: PAGE_META.home.title,
  description: PAGE_META.home.description,
};

export default async function HomePage() {
  // Server-side fetch — revalidates every 60s so live catalog changes appear
  const products = await getProducts();

  return (
    <>
      <HeroSection />
      <FeaturedCategories products={products} />
      <BestsellersFeed products={products} />
      <CraftsmanshipStory />
      <Testimonials />
      <GalleryGrid />
    </>
  );
}

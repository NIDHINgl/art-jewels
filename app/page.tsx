import type { Metadata } from 'next';
import HeroSection from '@/components/home/HeroSection';
import FeaturedCategories from '@/components/home/FeaturedCategories';
import Bestsellers from '@/components/home/Bestsellers';
import CraftsmanshipStory from '@/components/home/CraftsmanshipStory';
import Testimonials from '@/components/home/Testimonials';
import GalleryGrid from '@/components/home/GalleryGrid';
import { PAGE_META } from '@/lib/constants';

export const metadata: Metadata = {
  title: PAGE_META.home.title,
  description: PAGE_META.home.description,
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedCategories />
      <Bestsellers />
      <CraftsmanshipStory />
      <Testimonials />
      <GalleryGrid />
    </>
  );
}

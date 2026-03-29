import { MetadataRoute } from 'next';
import { products } from '@/data/products';
import { SITE_URL } from '@/lib/constants';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${SITE_URL}/collections`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  const productPages: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${SITE_URL}/product/${product.slug}`,
    lastModified: new Date(product.createdAt),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  return [...staticPages, ...productPages];
}

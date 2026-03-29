import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { products } from '@/data/products';
import { BRAND_NAME, CURRENCY_SYMBOL, SITE_URL } from '@/lib/constants';
import ProductGallery from '@/components/product/ProductGallery';
import ProductInfo from '@/components/product/ProductInfo';
import RelatedProducts from '@/components/product/RelatedProducts';

interface ProductPageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const product = products.find((p) => p.slug === params.slug);
  if (!product) return {};

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: `${product.name} — ${BRAND_NAME}`,
      description: product.description,
      images: product.images[0] ? [{ url: product.images[0] }] : [],
    },
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  const product = products.find((p) => p.slug === params.slug);
  if (!product) notFound();

  // JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images,
    sku: product.id,
    brand: {
      '@type': 'Brand',
      name: BRAND_NAME,
    },
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: product.currency,
      availability: product.inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      url: `${SITE_URL}/product/${product.slug}`,
    },
  };

  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-ivory pt-20 sm:pt-24">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="max-w-site mx-auto px-4 sm:px-6 lg:px-8 py-4"
        >
          <ol className="flex items-center gap-2 text-xs font-accent text-obsidian/40" role="list">
            <li>
              <a href="/" className="hover:text-gold transition-colors">
                Home
              </a>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <a href="/collections" className="hover:text-gold transition-colors">
                Collections
              </a>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <a
                href={`/collections?category=${product.category}`}
                className="hover:text-gold transition-colors capitalize"
              >
                {product.category}
              </a>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-obsidian/70 truncate max-w-[160px]">
              {product.name}
            </li>
          </ol>
        </nav>

        {/* Main product layout */}
        <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            {/* Gallery */}
            <div className="lg:sticky lg:top-24">
              <ProductGallery
                images={product.images}
                productName={product.name}
              />
            </div>

            {/* Info */}
            <ProductInfo product={product} />
          </div>
        </div>

        {/* Related products */}
        <RelatedProducts
          currentProductId={product.id}
          category={product.category}
        />
      </div>
    </>
  );
}

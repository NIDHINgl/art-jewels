/**
 * LUMORA Customer Store — API Client
 *
 * Fetches live product data from the Express backend.
 * Falls back to static data/products.ts if the API is unreachable,
 * so the site works even if the backend is not running.
 */

import type { Product, Category, Material, Style } from '@/types';
import { products as staticProducts } from '@/data/products';

// ─── Config ───────────────────────────────────────────────────────────────────
const API_BASE =
  (typeof window === 'undefined'
    ? process.env.API_URL           // server components (private)
    : process.env.NEXT_PUBLIC_API_URL // client components (public)
  ) ?? 'http://localhost:3001/api';

const MEDIA_BASE = API_BASE.replace(/\/api$/, '');

console.log(`products from API`,MEDIA_BASE);

// ─── Backend response shapes ──────────────────────────────────────────────────
interface ApiProductImage {
  id: string;
  originalUrl: string;
  enhancedUrl?: string | null;
  thumbnailUrl?: string | null;
  webpUrl?: string | null;
  isPrimary: boolean;
  sortOrder: number;
  status: string;
}

interface ApiProductVariant {
  id: string;
  label: string;
  type: string;
  quantity: number;
}

interface ApiProduct {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  currency: string;
  description: string;
  fullDescription: string;
  material: string[];
  style: string;
  weight?: string;
  dimensions?: string;
  careInstructions: string;
  isFeatured: boolean;
  isNew: boolean;
  isBestseller: boolean;
  status: string;
  images: ApiProductImage[];
  variants: ApiProductVariant[];
  createdAt: string;
}

// ─── Transform API → Product type ────────────────────────────────────────────
function toAbsoluteUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${MEDIA_BASE}${path}`;
}

function transformProduct(p: ApiProduct): Product {
  // Build image URL array — prefer webp → enhanced → thumbnail → original
  const images: string[] = p.images
    .filter(img => img.status === 'ready' || img.enhancedUrl || img.thumbnailUrl)
    .sort((a, b) => (a.isPrimary ? -1 : b.isPrimary ? 1 : a.sortOrder - b.sortOrder))
    .map(img =>
      toAbsoluteUrl(img.webpUrl ?? img.enhancedUrl ?? img.thumbnailUrl ?? img.originalUrl),
    )
    .filter((url): url is string => url !== null);

  const inStock = p.variants.length > 0
    ? p.variants.some(v => v.quantity > 0)
    : true;

  const sizes = p.variants.filter(v => v.type === 'size').map(v => v.label);
  const lengths = p.variants.filter(v => v.type === 'length').map(v => v.label);
  const allSizes = [...sizes, ...lengths];

  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    category: p.category as Category,
    price: p.price,
    currency: p.currency,
    images,
    description: p.description,
    fullDescription: p.fullDescription,
    material: p.material as Material[],
    style: p.style as Style,
    weight: p.weight,
    dimensions: p.dimensions,
    sizes: allSizes.length > 0 ? allSizes : undefined,
    inStock,
    isFeatured: p.isFeatured,
    isNew: p.isNew,
    isBestseller: p.isBestseller,
    careInstructions: p.careInstructions,
    createdAt: p.createdAt,
  };
}

// ─── Internal fetch ───────────────────────────────────────────────────────────
async function apiFetch<T>(path: string, revalidate = 60): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      next: { revalidate },
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) throw new Error(`API ${res.status}: ${res.statusText}`);
    const json = await res.json();
    return json.data as T;
  } catch (err) {
    if (typeof window === 'undefined') {
      console.warn(`[API] ${path} failed, using static fallback:`, (err as Error).message);
    }
    return null;
  }
}

// ─── Public functions ─────────────────────────────────────────────────────────

/** All active products. Falls back to static catalog if API is down. */
export async function getProducts(): Promise<Product[]> {
  const data = await apiFetch<ApiProduct[]>('/products/public');
  if (!data || data.length === 0) return staticProducts;
  return data.map(transformProduct);
}

/** Single product by slug. */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  const all = await apiFetch<ApiProduct[]>('/products/public');
  if (all) {
    const found = all.find(p => p.slug === slug);
    return found ? transformProduct(found) : null;
  }
  return staticProducts.find(p => p.slug === slug) ?? null;
}

/** All slugs — used by generateStaticParams (build never fails, falls back to static). */
export async function getAllSlugs(): Promise<string[]> {
  const all = await apiFetch<ApiProduct[]>('/products/public');
  if (all && all.length > 0) return all.map(p => p.slug);
  return staticProducts.map(p => p.slug);
}

/** Check if API backend is reachable. */
export async function isApiReachable(): Promise<boolean> {
  try {
    const res = await fetch(`${MEDIA_BASE}/health`, { next: { revalidate: 30 } });
    return res.ok;
  } catch {
    return false;
  }
}

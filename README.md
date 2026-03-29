# LUMORA — Art Jewellery E-Commerce

A complete, production-ready art jewellery e-commerce website built with Next.js 14 (App Router), TypeScript, Tailwind CSS, and Zustand.

---

## Quick Start

**Requirements:** Node.js 18+, pnpm 9+

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ⚠️ Before Deploying

### 1. Set your WhatsApp number
Open `lib/constants.ts` and replace the placeholder:
```ts
export const SELLER_WHATSAPP = '918919085526'; // ← Replace with your actual number (no + or spaces)
```
Format: country code + number. Example for India: `919876543210`

### 2. Set your contact details
In `lib/constants.ts`:
```ts
export const SELLER_EMAIL = 'hello@lumora.in';       // ← Your email
export const SELLER_INSTAGRAM = 'https://instagram.com/lumorajewels'; // ← Your Instagram
export const SITE_URL = 'https://lumora.in';          // ← Your domain
```

### 3. Add product images
Place real product images in the `/public/images/` directory.

Image path convention used in `data/products.ts`:
```
/images/products/{category}/{slug}-{n}.webp
/images/categories/{category}.webp
/images/hero/hero-main.webp
/images/gallery/gallery-{n}.webp
```

Images should be WebP format for performance. Recommended dimensions:
- Product images: 800×1067px (3:4 aspect ratio)
- Category images: 400×533px (3:4 aspect ratio)
- Hero: 1920×1080px (16:9 landscape)

### 4. Update brand name (optional)
In `lib/constants.ts`:
```ts
export const BRAND_NAME = 'LUMORA'; // Change to your brand name
export const BRAND_TAGLINE = 'Handcrafted Elegance, Worn with Intent';
```

---

## Project Structure

```
/
├── app/                        # Next.js App Router pages
│   ├── layout.tsx              # Root layout (Navbar, Footer, Providers)
│   ├── page.tsx                # Homepage
│   ├── collections/
│   │   ├── page.tsx            # Collections page (server, Suspense wrapper)
│   │   └── CollectionsClient.tsx # Client-side filter/search logic
│   ├── product/[slug]/
│   │   └── page.tsx            # Product detail page (with JSON-LD)
│   ├── cart/page.tsx           # Cart page
│   ├── wishlist/page.tsx       # Wishlist page
│   ├── about/page.tsx          # About page
│   ├── contact/page.tsx        # Contact page
│   ├── sitemap.ts              # Dynamic sitemap
│   ├── not-found.tsx           # 404 page
│   └── globals.css             # Global CSS, custom properties, animations
├── components/
│   ├── layout/                 # Navbar, Footer, MobileMenu, SearchOverlay
│   ├── home/                   # HeroSection, FeaturedCategories, Bestsellers,
│   │                           # CraftsmanshipStory, Testimonials, GalleryGrid
│   ├── product/                # ProductCard, ProductGallery, ProductInfo,
│   │                           # RelatedProducts
│   ├── cart/                   # CartItem, CartSummary, CartDrawer, CheckoutForm
│   ├── filters/                # FilterSidebar, FilterChips, SortDropdown
│   └── ui/                     # Button, Badge, Skeleton, Toast, Modal, ScrollToTop
├── store/
│   ├── cartStore.ts            # Zustand cart (persisted to localStorage)
│   └── wishlistStore.ts        # Zustand wishlist (persisted to localStorage)
├── data/
│   └── products.ts             # 22 products + testimonials + category data
├── lib/
│   ├── constants.ts            # Brand config, seller info, metadata
│   ├── utils.ts                # formatPrice, generateWhatsAppURL, debounce…
│   └── hooks.ts                # useInView, useReducedMotion
├── types/
│   └── index.ts                # TypeScript interfaces
└── public/
    ├── images/                 # Product/category/hero/gallery images (add yours)
    └── robots.txt
```

---

## Feature Overview

| Feature | Implementation |
|---|---|
| Product catalog | `data/products.ts` — 22 typed products |
| Search | Real-time fuzzy client-side, 300ms debounce |
| Filters | Category, material, style, price range (dual slider), in-stock toggle |
| Sort | Featured, price asc/desc, newest, name A→Z |
| Cart | Zustand + localStorage persistence, drawer, full page |
| Wishlist | Zustand + localStorage persistence |
| Checkout | Pre-checkout form → WhatsApp deep link + clipboard fallback |
| Animations | CSS keyframes + IntersectionObserver scroll triggers |
| Accessibility | Skip link, ARIA labels, keyboard nav, aria-live cart updates |
| SEO | Per-page metadata, Open Graph, JSON-LD (Product schema), sitemap |
| Performance | next/image, code splitting, lazy loading, skeleton loaders |
| Reduced motion | All animations check `prefers-reduced-motion` |

---

## Adding Products

Edit `data/products.ts`. Each product must conform to the `Product` interface in `types/index.ts`:

```ts
{
  id: string;                 // Unique, e.g. "ring-006"
  slug: string;               // URL slug, e.g. "sapphire-halo-ring"
  name: string;
  category: Category;         // 'rings' | 'necklaces' | 'earrings' | 'bracelets' | 'anklets' | 'custom'
  price: number;              // In INR (e.g. 12500)
  currency: string;           // "INR"
  images: string[];           // Array of paths relative to /public
  description: string;        // Short (max 160 chars)
  fullDescription: string;    // Rich text for detail page
  material: Material[];       // 'gold' | 'silver' | 'rose-gold' | 'platinum' | 'pearl' | 'gemstone' | 'mixed'
  style: Style;               // 'minimalist' | 'statement' | 'vintage' | 'bohemian' | 'classic'
  weight?: string;
  dimensions?: string;
  sizes?: string[];
  inStock: boolean;
  isFeatured: boolean;
  isNew: boolean;
  isBestseller: boolean;
  careInstructions: string;
  createdAt: string;          // ISO date string
}
```

---

## Design System

### Color Tokens (in `globals.css`)
| Token | Value | Use |
|---|---|---|
| `--color-gold` | `hsl(43, 74%, 39%)` | Primary accent |
| `--color-champagne` | `hsl(34, 77%, 88%)` | Secondary accent |
| `--color-obsidian` | `hsl(0, 0%, 10%)` | Text / dark backgrounds |
| `--color-pearl` | `hsl(45, 29%, 97%)` | Light backgrounds |
| `--color-rose-gold` | `hsl(350, 34%, 57%)` | Hover / wishlist |
| `--color-velvet` | `hsl(354, 42%, 32%)` | Primary CTAs |
| `--color-ivory` | `hsl(60, 100%, 97%)` | Body background |
| `--color-platinum` | `hsl(30, 5%, 89%)` | Borders / dividers |

### Typography
| Role | Font | Fallback |
|---|---|---|
| Headings | Playfair Display | Georgia, serif |
| Body | DM Sans | system-ui, sans-serif |
| Labels/Captions | Cormorant Garamond | Georgia, serif |

---

## Deployment

The project is static-generation compatible. Deploy to Vercel, Netlify, or any Node.js host:

```bash
# Vercel (recommended)
pnpm add -g vercel
vercel

# or standard build
pnpm build
pnpm start
```

---

## License

Proprietary. All rights reserved.

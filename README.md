# LUMORA — Art Jewellery E-Commerce

Customer-facing storefront for the LUMORA art jewellery brand.
Built with Next.js 14 (App Router), TypeScript, Tailwind CSS, Zustand, and Framer Motion.

---

## Quick Start

```bash
pnpm install

# Connect to the backend
echo "NEXT_PUBLIC_API_URL=http://localhost:3001/api
API_URL=http://localhost:3001/api" > .env.local

pnpm dev
# → http://localhost:3000
```

The site works **without the backend** — it falls back to the static product catalog in `data/products.ts`. Once the backend is running, it serves live data automatically.

---

## Pages

| Route | Description |
|---|---|
| `/` | Landing page — hero, categories, featured products, craftsmanship story, testimonials, gallery |
| `/collections` | Shop page — search, multi-select filters, sort, infinite scroll |
| `/product/[slug]` | Product detail — image gallery, size selector, add to cart, care & shipping info, related products |
| `/cart` | Cart — line items, quantity controls, order summary, WhatsApp checkout |
| `/wishlist` | Saved items — add all to cart |
| `/about` | Brand story and artisan profile |
| `/contact` | WhatsApp primary CTA, contact form, business hours |

---

## Key Features

### Cart & Wishlist
Both persist to `localStorage` via Zustand. Cart and wishlist survive page reloads and browser restarts.

### Search
Real-time fuzzy search across product name, description, category, material, and style with 300ms debounce.

### Filters
Category · Material · Style · Price range (dual slider) · In-stock toggle. All combinable, with dismissible active-filter chips.

### WhatsApp Checkout
No payment gateway. Customer fills a pre-checkout form (name, phone, address, notes), the cart is formatted into a structured WhatsApp message, and `wa.me/` is opened in a new tab. Clipboard fallback if WhatsApp is not installed.

### Images
The site displays AI-enhanced product images served by the backend. Images are automatically served in WebP format where available.

### SEO
- Per-page `<title>` and `<meta description>`
- Open Graph + Twitter Card tags
- JSON-LD `Product` structured data on detail pages
- Dynamic `sitemap.xml` and `robots.txt`

---

## Project Structure

```
app/
├── layout.tsx                  Root layout — Navbar, Footer, CartDrawer, Toast
├── page.tsx                    Homepage (server component, fetches live products)
├── collections/
│   ├── page.tsx                Server wrapper with metadata
│   └── CollectionsClient.tsx   Client-side filter + search logic
├── product/[slug]/page.tsx     Product detail (server, fetches by slug)
├── cart/page.tsx               Cart page
├── wishlist/page.tsx           Wishlist page
├── about/page.tsx              About page
├── contact/page.tsx            Contact page
├── sitemap.ts                  Dynamic sitemap
└── not-found.tsx               404 page

components/
├── layout/
│   ├── Navbar.tsx              Sticky nav with cart/wishlist badges
│   ├── Footer.tsx              Brand footer with newsletter input
│   ├── MobileMenu.tsx          Slide-in hamburger drawer
│   └── SearchOverlay.tsx       Full-screen search overlay (fetches live data)
├── home/
│   ├── HeroSection.tsx         Full-viewport hero with canvas sparkle
│   ├── FeaturedCategories.tsx  Category grid with live product counts
│   ├── BestsellersFeed.tsx     Featured/bestseller product grid
│   ├── CraftsmanshipStory.tsx  Parallax split-layout section
│   ├── Testimonials.tsx        Auto-scrolling testimonial carousel
│   └── GalleryGrid.tsx         Masonry lifestyle gallery
├── product/
│   ├── ProductCard.tsx         Card with hover image swap, wishlist, quick add
│   ├── ProductGallery.tsx      Image gallery with thumbnails, lightbox, swipe
│   ├── ProductInfo.tsx         Add to cart, size selector, spec table, accordions
│   └── RelatedProductsFeed.tsx Related products (fetches live data)
├── cart/
│   ├── CartItem.tsx            Line item (compact for drawer, full for page)
│   ├── CartSummary.tsx         Order summary sidebar
│   ├── CartDrawer.tsx          Slide-in mini cart
│   └── CheckoutForm.tsx        Pre-checkout form → WhatsApp redirect
├── filters/
│   ├── FilterSidebar.tsx       Checkbox groups + price slider
│   ├── FilterChips.tsx         Active filter dismissible tags
│   └── SortDropdown.tsx        Sort select
└── ui/
    ├── Button.tsx
    ├── Badge.tsx               New / Bestseller / Out of Stock
    ├── Skeleton.tsx            Shimmer loading placeholders
    ├── Toast.tsx               Cart action notifications
    ├── Modal.tsx               Generic modal
    └── ScrollToTop.tsx         Floating scroll-to-top button

data/
└── products.ts                 Static product catalog (fallback if API is down)

lib/
├── api.ts                      Backend API client (getProducts, getProductBySlug)
├── constants.ts                Brand name, WhatsApp number, currency
├── hooks.ts                    useInView, useReducedMotion
└── utils.ts                    formatPrice, generateWhatsAppURL, debounce

store/
├── cartStore.ts                Zustand cart (localStorage persisted)
└── wishlistStore.ts            Zustand wishlist (localStorage persisted)

types/
└── index.ts                    Product, CartItem, FilterState, etc.
```

---

## API Connection

The store connects to the backend via `lib/api.ts`:

```ts
// Fetches live products, falls back to static data if backend is unreachable
const products = await getProducts();

// Fetch a single product for the detail page
const product = await getProductBySlug('celestial-moonstone-ring');
```

**Server components** (homepage, product detail) call the API directly during rendering with 60-second revalidation.

**Client components** (collections, search) dynamically import `lib/api.ts` on mount.

### Adding the Backend URL

```env
# .env.local (create in the art-jewels/ root)
NEXT_PUBLIC_API_URL=http://localhost:3001/api
API_URL=http://localhost:3001/api
```

For production, replace with your deployed backend URL:
```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
API_URL=https://api.yourdomain.com/api
```

---

## Design System

### Colours
| Token | Value | Use |
|---|---|---|
| Gold | `hsl(43, 74%, 39%)` | Primary accent, CTAs |
| Champagne | `hsl(34, 77%, 88%)` | Secondary accent |
| Obsidian | `hsl(0, 0%, 10%)` | Text, dark backgrounds |
| Pearl | `hsl(45, 29%, 97%)` | Light section backgrounds |
| Rose Gold | `hsl(350, 34%, 57%)` | Wishlist, hover states |
| Velvet | `hsl(354, 42%, 32%)` | Primary button |
| Ivory | `hsl(60, 100%, 97%)` | Body background |
| Platinum | `hsl(30, 5%, 89%)` | Borders, dividers |

### Typography
| Role | Font | Use |
|---|---|---|
| Headings | Playfair Display | `font-display` |
| Body | DM Sans | `font-body` |
| Labels / captions | Cormorant Garamond | `font-accent` |

---

## Before Going Live

### 1. Set the WhatsApp number
```ts
// lib/constants.ts
export const SELLER_WHATSAPP = '919XXXXXXXXX'; // ← your number, no + or spaces
```

### 2. Set the backend URL
```env
# .env.local
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
API_URL=https://api.yourdomain.com/api
```

### 3. Update next.config.js for your production domain
```js
// next.config.js
images: {
  remotePatterns: [
    { protocol: 'https', hostname: 'api.yourdomain.com', pathname: '/**' },
  ],
}
```

### 4. Add real product images (optional)
The backend handles image upload and AI enhancement via the admin dashboard. Alternatively, add images to `public/images/products/` and update paths in `data/products.ts`.

---

## Available Scripts

```bash
pnpm dev          # Development server on port 3000
pnpm build        # Production build
pnpm start        # Start production build
pnpm lint         # ESLint check
```

---

## Running the Full Stack

```bash
# Terminal 1
cd lumora-backend && pnpm dev        # API → localhost:3001

# Terminal 2
cd lumora-admin && pnpm dev          # Admin → localhost:3002

# Terminal 3
cd art-jewels && pnpm dev            # Store → localhost:3000
```

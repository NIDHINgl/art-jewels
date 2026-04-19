export const BRAND_NAME = 'LUMORA';
export const BRAND_TAGLINE = 'Handcrafted Elegance, Worn with Intent';
export const BRAND_DESCRIPTION =
  'LUMORA is a fine art jewellery atelier crafting heirloom-quality pieces by hand. Each creation is a singular expression of artisanship and story.';

// ─── Seller Configuration ────────────────────────────────────────────────────
// Replace before deployment
export const SELLER_WHATSAPP = '918919085526';
export const SELLER_EMAIL = 'hello@lumora.in';
export const SELLER_INSTAGRAM = 'https://instagram.com/lumorajewels';

// ─── Currency ────────────────────────────────────────────────────────────────
export const CURRENCY_SYMBOL = '₹';
export const CURRENCY_LOCALE = 'en-IN';

// ─── Site Metadata ───────────────────────────────────────────────────────────
export const SITE_URL = 'https://lumora.in';
export const SITE_OG_IMAGE = '/og-image.jpg';

export const PAGE_META: Record<string, { title: string; description: string }> = {
  home: {
    title: 'LUMORA — Handcrafted Art Jewellery',
    description:
      'Discover LUMORA — a curated collection of handcrafted art jewellery. Each piece is a singular expression of artisanship, made to be worn and treasured.',
  },
  collections: {
    title: 'Collections — LUMORA',
    description:
      'Browse the complete LUMORA jewellery collection. Rings, necklaces, earrings, bracelets, anklets, and bespoke custom pieces. Handcrafted in gold, silver, and gemstone.',
  },
  cart: {
    title: 'Your Cart — LUMORA',
    description: 'Review your selected LUMORA pieces and proceed to checkout via WhatsApp.',
  },
  wishlist: {
    title: 'Wishlist — LUMORA',
    description: 'Your saved LUMORA pieces.',
  },
  about: {
    title: 'Our Story — LUMORA',
    description:
      'The story behind LUMORA — handcrafted jewellery made with intention, care, and artisanal precision.',
  },
  contact: {
    title: 'Contact — LUMORA',
    description: 'Get in touch with LUMORA for orders, custom pieces, and enquiries.',
  },
};

// ─── Pagination ───────────────────────────────────────────────────────────────
export const PRODUCTS_PER_PAGE = 12;

// ─── Cart ─────────────────────────────────────────────────────────────────────
export const MAX_CART_QUANTITY = 10;
export const SCROLL_THRESHOLD = 300;

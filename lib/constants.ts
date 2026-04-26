// ─── Brand ────────────────────────────────────────────────────────────────────
// Single source of truth for the brand name. To rename the store, change this
// one line — every page title, meta description, footer, navbar, hero,
// breadcrumb, and JSX reference is derived from BRAND_NAME.
export const BRAND_NAME = 'LUMORA';
export const BRAND_TAGLINE = 'Handcrafted Elegance, Worn with Intent';
export const BRAND_DESCRIPTION = `${BRAND_NAME} is a fine art jewellery atelier crafting heirloom-quality pieces by hand. Each creation is a singular expression of artisanship and story.`;

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
    title: `${BRAND_NAME} — Handcrafted Art Jewellery`,
    description: `Discover ${BRAND_NAME} — a curated collection of handcrafted art jewellery. Each piece is a singular expression of artisanship, made to be worn and treasured.`,
  },
  collections: {
    title: `Collections — ${BRAND_NAME}`,
    description: `Browse the complete ${BRAND_NAME} jewellery collection. Rings, necklaces, earrings, bracelets, anklets, and bespoke custom pieces. Handcrafted in gold, silver, and gemstone.`,
  },
  cart: {
    title: `Your Cart — ${BRAND_NAME}`,
    description: `Review your selected ${BRAND_NAME} pieces and proceed to checkout via WhatsApp.`,
  },
  wishlist: {
    title: `Wishlist — ${BRAND_NAME}`,
    description: `Your saved ${BRAND_NAME} pieces.`,
  },
  about: {
    title: `Our Story — ${BRAND_NAME}`,
    description: `The story behind ${BRAND_NAME} — handcrafted jewellery made with intention, care, and artisanal precision.`,
  },
  contact: {
    title: `Contact — ${BRAND_NAME}`,
    description: `Get in touch with ${BRAND_NAME} for orders, custom pieces, and enquiries.`,
  },
};

// ─── Pagination ───────────────────────────────────────────────────────────────
export const PRODUCTS_PER_PAGE = 12;

// ─── Cart ─────────────────────────────────────────────────────────────────────
export const MAX_CART_QUANTITY = 10;
export const SCROLL_THRESHOLD = 300;

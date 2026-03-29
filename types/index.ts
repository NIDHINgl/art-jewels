export type Category =
  | 'rings'
  | 'necklaces'
  | 'earrings'
  | 'bracelets'
  | 'anklets'
  | 'custom';

export type Material =
  | 'gold'
  | 'silver'
  | 'rose-gold'
  | 'platinum'
  | 'pearl'
  | 'gemstone'
  | 'mixed';

export type Style =
  | 'minimalist'
  | 'statement'
  | 'vintage'
  | 'bohemian'
  | 'classic';

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: Category;
  price: number;
  currency: string;
  images: string[];
  description: string;
  fullDescription: string;
  material: Material[];
  style: Style;
  weight?: string;
  dimensions?: string;
  sizes?: string[];
  inStock: boolean;
  isFeatured: boolean;
  isNew: boolean;
  isBestseller: boolean;
  careInstructions: string;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
}

export interface FilterState {
  categories: Category[];
  materials: Material[];
  styles: Style[];
  priceRange: [number, number];
  inStockOnly: boolean;
}

export type SortOption =
  | 'featured'
  | 'price-asc'
  | 'price-desc'
  | 'newest'
  | 'name-asc';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  productImage?: string;
  productName?: string;
}

export interface CheckoutFormData {
  fullName: string;
  phone: string;
  address: string;
  notes: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  customerName: string;
  rating: number;
  initials: string;
  location: string;
}

export interface CategoryCard {
  category: Category;
  label: string;
  description: string;
  image: string;
  count: number;
}

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Product } from '@/types';
import { products } from '@/data/products';

interface WishlistStore {
  items: Product[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  toggle: (product: Product) => void;
  isWishlisted: (productId: string) => boolean;
  clearWishlist: () => void;
  totalItems: () => number;
}

interface PersistedWishlistState {
  items?: Product[];
}

const productsById = new Map(products.map((product) => [product.id, product]));

function getCurrentProduct(product: Product): Product {
  return productsById.get(product.id) ?? product;
}

function normalizeWishlistItems(items: Product[] = []): Product[] {
  return items.map((product) => getCurrentProduct(product));
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        const currentProduct = getCurrentProduct(product);
        set((state) => {
          if (state.items.find((p) => p.id === currentProduct.id)) return state;
          return { items: [...state.items, currentProduct] };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((p) => p.id !== productId),
        }));
      },

      toggle: (product) => {
        const { isWishlisted, addItem, removeItem } = get();
        if (isWishlisted(product.id)) {
          removeItem(product.id);
        } else {
          addItem(product);
        }
      },

      isWishlisted: (productId) =>
        get().items.some((p) => p.id === productId),

      clearWishlist: () => set({ items: [] }),

      totalItems: () => get().items.length,
    }),
    {
      name: 'lumora-wishlist',
      storage: createJSONStorage(() => localStorage),
      merge: (persistedState, currentState) => {
        const persisted = (persistedState as PersistedWishlistState | undefined) ?? {};
        return {
          ...currentState,
          items: normalizeWishlistItems(persisted.items ?? currentState.items),
        };
      },
    },
  ),
);

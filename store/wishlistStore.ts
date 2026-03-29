import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Product } from '@/types';

interface WishlistStore {
  items: Product[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  toggle: (product: Product) => void;
  isWishlisted: (productId: string) => boolean;
  clearWishlist: () => void;
  totalItems: () => number;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        set((state) => {
          if (state.items.find((p) => p.id === product.id)) return state;
          return { items: [...state.items, product] };
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
    },
  ),
);

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { CartItem, Product } from '@/types';
import { MAX_CART_QUANTITY } from '@/lib/constants';
import { products } from '@/data/products';

interface CartStore {
  items: CartItem[];
  isDrawerOpen: boolean;

  addItem: (product: Product, quantity?: number, selectedSize?: string) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleDrawer: () => void;
  closeDrawer: () => void;

  totalItems: () => number;
  totalPrice: () => number;
}

interface PersistedCartState {
  items?: CartItem[];
}

const productsById = new Map(products.map((product) => [product.id, product]));

function getCurrentProduct(product: Product): Product {
  return productsById.get(product.id) ?? product;
}

function normalizeCartItems(items: CartItem[] = []): CartItem[] {
  return items.map((item) => ({
    ...item,
    product: getCurrentProduct(item.product),
  }));
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isDrawerOpen: false,

      addItem: (product, quantity = 1, selectedSize) => {
        const currentProduct = getCurrentProduct(product);
        set((state) => {
          const existing = state.items.find(
            (item) =>
              item.product.id === currentProduct.id &&
              item.selectedSize === selectedSize,
          );

          if (existing) {
            const newQty = Math.min(
              existing.quantity + quantity,
              MAX_CART_QUANTITY,
            );
            return {
              items: state.items.map((item) =>
                item.product.id === currentProduct.id &&
                item.selectedSize === selectedSize
                  ? { ...item, quantity: newQty }
                  : item,
              ),
            };
          }

          return {
            items: [
              ...state.items,
              {
                product: currentProduct,
                quantity: Math.min(quantity, MAX_CART_QUANTITY),
                selectedSize,
              },
            ],
          };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        }));
      },

      updateQuantity: (productId, quantity) => {
        if (quantity < 1) {
          get().removeItem(productId);
          return;
        }
        const clamped = Math.min(quantity, MAX_CART_QUANTITY);
        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId
              ? { ...item, quantity: clamped }
              : item,
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      toggleDrawer: () =>
        set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),

      closeDrawer: () => set({ isDrawerOpen: false }),

      totalItems: () =>
        get().items.reduce((acc, item) => acc + item.quantity, 0),

      totalPrice: () =>
        get().items.reduce(
          (acc, item) => acc + item.product.price * item.quantity,
          0,
        ),
    }),
    {
      name: 'lumora-cart',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
      merge: (persistedState, currentState) => {
        const persisted = (persistedState as PersistedCartState | undefined) ?? {};
        return {
          ...currentState,
          items: normalizeCartItems(persisted.items ?? currentState.items),
        };
      },
    },
  ),
);

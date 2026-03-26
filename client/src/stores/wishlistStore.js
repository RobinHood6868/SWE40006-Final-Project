import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (product) => {
        set((state) => {
          if (state.items.find(i => i.id === product.id)) {
            return state;
          }
          return { items: [...state.items, product] };
        });
      },
      
      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter(i => i.id !== id)
        }));
      },
      
      toggleItem: (product) => {
        const exists = get().items.find(i => i.id === product.id);
        if (exists) {
          get().removeItem(product.id);
          return false;
        } else {
          get().addItem(product);
          return true;
        }
      },
      
      isInWishlist: (id) => get().items.some(i => i.id === id),
      
      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: 'volta-wishlist-storage',
    }
  )
);

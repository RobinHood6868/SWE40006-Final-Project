import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useRecentlyViewedStore = create(
  persist(
    (set, get) => ({
      items: [],
      maxItems: 20,
      
      addProduct: (product) => {
        set((state) => {
          const filtered = state.items.filter(i => i.id !== product.id);
          const updated = [
            { ...product, viewedAt: Date.now() },
            ...filtered
          ].slice(0, state.maxItems);
          return { items: updated };
        });
      },
      
      removeProduct: (id) => {
        set((state) => ({
          items: state.items.filter(i => i.id !== id)
        }));
      },
      
      clearHistory: () => set({ items: [] }),
    }),
    {
      name: 'volta-recently-viewed',
    }
  )
);

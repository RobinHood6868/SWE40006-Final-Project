import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useComparisonStore = create(
  persist(
    (set, get) => ({
      items: [],
      maxItems: 4,
      
      addProduct: (product) => {
        set((state) => {
          if (state.items.find(i => i.id === product.id)) {
            return state;
          }
          if (state.items.length >= state.maxItems) {
            return state;
          }
          return { items: [...state.items, product] };
        });
      },
      
      removeProduct: (id) => {
        set((state) => ({
          items: state.items.filter(i => i.id !== id)
        }));
      },
      
      toggleProduct: (product) => {
        const exists = get().items.find(i => i.id === product.id);
        if (exists) {
          get().removeProduct(product.id);
          return false;
        } else {
          if (get().items.length >= get().maxItems) {
            return false;
          }
          get().addProduct(product);
          return true;
        }
      },
      
      isInComparison: (id) => get().items.some(i => i.id === id),
      
      clearComparison: () => set({ items: [] }),
      
      canAdd: () => get().items.length < get().maxItems,
    }),
    {
      name: 'volta-comparison-storage',
    }
  )
);

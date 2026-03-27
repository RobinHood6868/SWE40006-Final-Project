import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (product) => {
        set((state) => {
          const existing = state.items.find(i => i.id === product.id);
          if (existing) {
            return {
              items: state.items.map(i => 
                i.id === product.id ? { ...i, qty: i.qty + 1 } : i
              )
            };
          }
          return { items: [...state.items, { ...product, qty: 1 }] };
        });
      },
      
      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter(i => i.id !== id)
        }));
      },
      
      updateQuantity: (id, delta) => {
        set((state) => ({
          items: state.items.map(i => 
            i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i
          )
        }));
      },
      
      setQuantity: (id, qty) => {
        set((state) => ({
          items: state.items.map(i => 
            i.id === id ? { ...i, qty: Math.max(1, qty) } : i
          )
        }));
      },
      
      clearCart: () => set({ items: [] }),
      
      getItemCount: () => get().items.reduce((sum, i) => sum + i.qty, 0),
      
      getTotal: () => get().items.reduce((sum, i) => sum + i.price * i.qty, 0),
      
      isEmpty: () => get().items.length === 0,
    }),
    {
      name: 'volta-cart-storage',
    }
  )
);

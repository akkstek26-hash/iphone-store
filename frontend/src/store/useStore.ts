'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  image: string;
  price: number;
  color: string;
  storage: string;
  quantity: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

interface StoreState {
  // Cart
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string, color: string, storage: string) => void;
  updateQuantity: (id: string, color: string, storage: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: () => number;
  cartCount: () => number;

  // Auth
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;

  // Favorites
  favorites: string[];
  toggleFavorite: (id: string) => void;

  // Theme
  darkMode: boolean;
  toggleDarkMode: () => void;

  // Compare
  compare: string[];
  toggleCompare: (id: string) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Cart
      cart: [],
      addToCart: (item) => {
        const cart = get().cart;
        const existing = cart.find(i => i.id === item.id && i.color === item.color && i.storage === item.storage);
        if (existing) {
          set({ cart: cart.map(i => i === existing ? { ...i, quantity: i.quantity + 1 } : i) });
        } else {
          set({ cart: [...cart, { ...item, quantity: 1 }] });
        }
      },
      removeFromCart: (id, color, storage) => {
        set({ cart: get().cart.filter(i => !(i.id === id && i.color === color && i.storage === storage)) });
      },
      updateQuantity: (id, color, storage, quantity) => {
        if (quantity < 1) return;
        set({ cart: get().cart.map(i => (i.id === id && i.color === color && i.storage === storage) ? { ...i, quantity } : i) });
      },
      clearCart: () => set({ cart: [] }),
      cartTotal: () => get().cart.reduce((sum, i) => sum + i.price * i.quantity, 0),
      cartCount: () => get().cart.reduce((sum, i) => sum + i.quantity, 0),

      // Auth
      user: null,
      token: null,
      setAuth: (user, token) => {
        if (typeof window !== 'undefined') localStorage.setItem('token', token);
        set({ user, token });
      },
      logout: () => {
        if (typeof window !== 'undefined') localStorage.removeItem('token');
        set({ user: null, token: null });
      },

      // Favorites
      favorites: [],
      toggleFavorite: (id) => {
        const favs = get().favorites;
        set({ favorites: favs.includes(id) ? favs.filter(f => f !== id) : [...favs, id] });
      },

      // Theme
      darkMode: false,
      toggleDarkMode: () => set({ darkMode: !get().darkMode }),

      // Compare
      compare: [],
      toggleCompare: (id) => {
        const cmp = get().compare;
        if (cmp.includes(id)) {
          set({ compare: cmp.filter(c => c !== id) });
        } else if (cmp.length < 4) {
          set({ compare: [...cmp, id] });
        }
      },
    }),
    { name: 'iphone-store' }
  )
);

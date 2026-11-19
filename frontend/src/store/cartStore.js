import { create } from 'zustand';
import { cartAPI } from '../services/api';

const useCartStore = create((set, get) => ({
  cart: null,
  loading: false,
  error: null,

  fetchCart: async () => {
    set({ loading: true });
    try {
      const res = await cartAPI.get();
      set({ cart: res.data.data, loading: false });
    } catch (err) {
      set({ loading: false });
    }
  },

  addToCart: async (productId, quantity = 1, size, color) => {
    try {
      const res = await cartAPI.add({ productId, quantity, size, color });
      await get().fetchCart();
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to add to cart';
      return { success: false, message };
    }
  },

  updateQuantity: async (itemId, quantity) => {
    try {
      await cartAPI.update(itemId, quantity);
      await get().fetchCart();
    } catch (err) {}
  },

  removeFromCart: async (itemId) => {
    try {
      await cartAPI.remove(itemId);
      await get().fetchCart();
    } catch (err) {}
  },

  clearCart: async () => {
    try {
      await cartAPI.clear();
      set({ cart: null });
    } catch (err) {}
  },

  applyCoupon: async (code) => {
    try {
      const res = await cartAPI.applyCoupon(code);
      await get().fetchCart();
      return { success: true, message: res.data.message };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Invalid coupon' };
    }
  },

  removeCoupon: async () => {
    try {
      await cartAPI.removeCoupon();
      await get().fetchCart();
    } catch (err) {}
  },

  get cartCount() {
    return get().cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;
  }
}));

export default useCartStore;

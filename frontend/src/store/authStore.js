import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authAPI } from '../services/api';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      login: async (email, password) => {
        set({ loading: true, error: null });
        try {
          const res = await authAPI.login({ email, password });
          const { token, user } = res.data;
          localStorage.setItem('worldkart_token', token);
          set({ user, token, isAuthenticated: true, loading: false });
          return { success: true };
        } catch (err) {
          const message = err.response?.data?.message || 'Login failed';
          set({ error: message, loading: false });
          return { success: false, message };
        }
      },

      register: async (name, email, password, phone) => {
        set({ loading: true, error: null });
        try {
          const res = await authAPI.register({ name, email, password, phone });
          const { token, user } = res.data;
          localStorage.setItem('worldkart_token', token);
          set({ user, token, isAuthenticated: true, loading: false });
          return { success: true };
        } catch (err) {
          const message = err.response?.data?.message || 'Registration failed';
          set({ error: message, loading: false });
          return { success: false, message };
        }
      },

      logout: async () => {
        try {
          await authAPI.logout();
        } catch (e) {}
        localStorage.removeItem('worldkart_token');
        set({ user: null, token: null, isAuthenticated: false });
      },

      fetchMe: async () => {
        const token = localStorage.getItem('worldkart_token');
        if (!token) return;
        try {
          const res = await authAPI.getMe();
          set({ user: res.data.data, isAuthenticated: true });
        } catch (err) {
          localStorage.removeItem('worldkart_token');
          set({ user: null, token: null, isAuthenticated: false });
        }
      },

      updateUser: (userData) => {
        set((state) => ({ user: { ...state.user, ...userData } }));
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'worldkart_auth',
      partialize: (state) => ({ token: state.token, user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);

export default useAuthStore;

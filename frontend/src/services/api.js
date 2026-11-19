import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
  timeout: 30000,
});

// Request interceptor - add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('worldkart_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('worldkart_token');
      localStorage.removeItem('worldkart_user');
      if (!window.location.pathname.includes('/login')) {
        // Don't redirect if already on login page
      }
    }
    return Promise.reject(error);
  }
);

// ─── Auth API ─────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/updateprofile', data),
  updatePassword: (data) => api.put('/auth/updatepassword', data),
  forgotPassword: (email) => api.post('/auth/forgotpassword', { email }),
  resetPassword: (token, password) => api.put(`/auth/resetpassword/${token}`, { password }),
  addAddress: (data) => api.post('/auth/address', data),
  updateAddress: (id, data) => api.put(`/auth/address/${id}`, data),
  deleteAddress: (id) => api.delete(`/auth/address/${id}`),
};

// ─── Products API ─────────────────────────────────────────────────────────────
export const productsAPI = {
  getAll: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  getFeatured: () => api.get('/products/featured'),
  getSuggestions: (q) => api.get('/products/suggestions', { params: { q } }),
  getRelated: (id) => api.get(`/products/${id}/related`),
  createReview: (id, data) => api.post(`/products/${id}/reviews`, data),
  toggleWishlist: (id) => api.post(`/products/${id}/wishlist`),
  // Admin
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
};

// ─── Cart API ─────────────────────────────────────────────────────────────────
export const cartAPI = {
  get: () => api.get('/cart'),
  add: (data) => api.post('/cart', data),
  update: (itemId, quantity) => api.put(`/cart/${itemId}`, { quantity }),
  remove: (itemId) => api.delete(`/cart/${itemId}`),
  clear: () => api.delete('/cart'),
  applyCoupon: (code) => api.post('/cart/coupon', { code }),
  removeCoupon: () => api.delete('/cart/coupon'),
};

// ─── Orders API ───────────────────────────────────────────────────────────────
export const ordersAPI = {
  create: (data) => api.post('/orders', data),
  getMyOrders: (params) => api.get('/orders/my', { params }),
  getById: (id) => api.get(`/orders/${id}`),
  cancel: (id, reason) => api.put(`/orders/${id}/cancel`, { reason }),
  requestReturn: (id, reason) => api.put(`/orders/${id}/return`, { reason }),
  // Admin
  getAll: (params) => api.get('/orders', { params }),
  updateStatus: (id, data) => api.put(`/orders/${id}/status`, data),
};

// ─── Payments API ─────────────────────────────────────────────────────────────
export const paymentsAPI = {
  getKey: () => api.get('/payments/key'),
  createOrder: (data) => api.post('/payments/create-order', data),
  verify: (data) => api.post('/payments/verify', data),
  failure: (data) => api.post('/payments/failure', data),
};

// ─── Categories API ───────────────────────────────────────────────────────────
export const categoriesAPI = {
  getAll: () => api.get('/categories'),
};

// ─── Wishlist API ─────────────────────────────────────────────────────────────
export const wishlistAPI = {
  get: () => api.get('/wishlist'),
};

// ─── Coupons API ──────────────────────────────────────────────────────────────
export const couponsAPI = {
  getPublic: () => api.get('/coupons'),
};

// ─── Offers API ───────────────────────────────────────────────────────────────
export const offersAPI = {
  getActive: () => api.get('/offers'),
};

// ─── Blog API ─────────────────────────────────────────────────────────────────
export const blogAPI = {
  getAll: (params) => api.get('/blog', { params }),
  getBySlug: (slug) => api.get(`/blog/${slug}`),
  // Admin
  create: (data) => api.post('/blog', data),
  update: (id, data) => api.put(`/blog/${id}`, data),
  delete: (id) => api.delete(`/blog/${id}`),
};

// ─── Vlog API ─────────────────────────────────────────────────────────────────
export const vlogAPI = {
  getAll: (params) => api.get('/vlog', { params }),
  getById: (id) => api.get(`/vlog/${id}`),
  // Admin
  create: (data) => api.post('/vlog', data),
  update: (id, data) => api.put(`/vlog/${id}`, data),
  delete: (id) => api.delete(`/vlog/${id}`),
};

// ─── Admin API ────────────────────────────────────────────────────────────────
export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getUsers: (params) => api.get('/admin/users', { params }),
  toggleUser: (id) => api.put(`/admin/users/${id}/toggle`),
  // Coupons
  getCoupons: () => api.get('/admin/coupons'),
  createCoupon: (data) => api.post('/admin/coupons', data),
  updateCoupon: (id, data) => api.put(`/admin/coupons/${id}`, data),
  deleteCoupon: (id) => api.delete(`/admin/coupons/${id}`),
  // Offers
  getOffers: () => api.get('/admin/offers'),
  createOffer: (data) => api.post('/admin/offers', data),
  updateOffer: (id, data) => api.put(`/admin/offers/${id}`, data),
  deleteOffer: (id) => api.delete(`/admin/offers/${id}`),
};

// ─── Contact API ──────────────────────────────────────────────────────────────
export const contactAPI = {
  send: (data) => api.post('/contact', data),
};

export default api;

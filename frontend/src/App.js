import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import useAuthStore from './store/authStore';
import useThemeStore from './store/themeStore';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import AnnouncementBar from './components/layout/AnnouncementBar';
import LoadingSpinner from './components/common/LoadingSpinner';
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminRoute from './components/common/AdminRoute';
import ScrollToTop from './components/common/ScrollToTop';

// Lazy loaded pages
const Home = lazy(() => import('./pages/Home'));
const ProductsPage = lazy(() => import('./pages/ProductsPage'));
const CategoryPage = lazy(() => import('./pages/CategoryPage'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const CartPage = lazy(() => import('./pages/CartPage'));
const WishlistPage = lazy(() => import('./pages/WishlistPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const OrdersPage = lazy(() => import('./pages/OrdersPage'));
const OrderDetailPage = lazy(() => import('./pages/OrderDetailPage'));
const OrderSuccessPage = lazy(() => import('./pages/OrderSuccessPage'));
const DealsPage = lazy(() => import('./pages/DealsPage'));
const FlashSalePage = lazy(() => import('./pages/FlashSalePage'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
const BlogDetailPage = lazy(() => import('./pages/BlogDetailPage'));
const VlogPage = lazy(() => import('./pages/VlogPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const FAQPage = lazy(() => import('./pages/FAQPage'));
const PrivacyPage = lazy(() => import('./pages/PolicyPages').then(m => ({ default: m.PrivacyPage })));
const TermsPage = lazy(() => import('./pages/PolicyPages').then(m => ({ default: m.TermsPage })));
const RefundPage = lazy(() => import('./pages/PolicyPages').then(m => ({ default: m.RefundPage })));
const ShippingPage = lazy(() => import('./pages/PolicyPages').then(m => ({ default: m.ShippingPage })));
const SearchPage = lazy(() => import('./pages/SearchPage'));

// Admin Pages
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts'));
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders'));
const AdminCustomers = lazy(() => import('./pages/admin/AdminCustomers'));
const AdminBlog = lazy(() => import('./pages/admin/AdminBlog'));
const AdminCoupons = lazy(() => import('./pages/admin/AdminCoupons'));
const AdminOffers = lazy(() => import('./pages/admin/AdminOffers'));

// Category Store pages
const FashionStore = lazy(() => import('./pages/stores/FashionStore'));
const ElectronicsStore = lazy(() => import('./pages/stores/ElectronicsStore'));
const HomeKitchenStore = lazy(() => import('./pages/stores/HomeKitchenStore'));
const GroceryStore = lazy(() => import('./pages/stores/GroceryStore'));
const BeautyStore = lazy(() => import('./pages/stores/BeautyStore'));
const SportsStore = lazy(() => import('./pages/stores/SportsStore'));
const BooksStore = lazy(() => import('./pages/stores/BooksStore'));
const ToysStore = lazy(() => import('./pages/stores/ToysStore'));
const AutomotiveStore = lazy(() => import('./pages/stores/AutomotiveStore'));
const PetsStore = lazy(() => import('./pages/stores/PetsStore'));

function App() {
  const { fetchMe } = useAuthStore();
  const { init } = useThemeStore();

  useEffect(() => {
    init();
    fetchMe();
  }, []);

  return (
    <Router basename={process.env.PUBLIC_URL}>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300">
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: 'var(--toast-bg, #fff)',
              color: 'var(--toast-color, #1f2937)',
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
              fontSize: '14px',
            },
            success: { iconTheme: { primary: '#f97316', secondary: '#fff' } },
          }}
        />
        <AnnouncementBar />
        <Navbar />
        <main className="flex-1">
          <Suspense fallback={<LoadingSpinner fullPage />}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/category/:category" element={<CategoryPage />} />
              
              {/* These store routes need category to be properly inferred */}
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/deals" element={<DealsPage />} />
              <Route path="/flash-sale" element={<FlashSalePage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:slug" element={<BlogDetailPage />} />
              <Route path="/vlog" element={<VlogPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/refund-policy" element={<RefundPage />} />
              <Route path="/shipping-policy" element={<ShippingPage />} />

              {/* Category Stores */}
              <Route path="/fashion" element={<FashionStore />} />
              <Route path="/electronics" element={<ElectronicsStore />} />
              <Route path="/home-kitchen" element={<HomeKitchenStore />} />
              <Route path="/grocery" element={<GroceryStore />} />
              <Route path="/beauty" element={<BeautyStore />} />
              <Route path="/sports" element={<SportsStore />} />
              <Route path="/books" element={<BooksStore />} />
              <Route path="/toys" element={<ToysStore />} />
              <Route path="/automotive" element={<AutomotiveStore />} />
              <Route path="/pets" element={<PetsStore />} />

              {/* Auth Routes (redirect if logged in) */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

              {/* Protected User Routes */}
              <Route path="/wishlist" element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />
              <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
              <Route path="/order-success/:id" element={<ProtectedRoute><OrderSuccessPage /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
              <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
              <Route path="/orders/:id" element={<ProtectedRoute><OrderDetailPage /></ProtectedRoute>} />

              {/* Admin Routes */}
              <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
              <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
              <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
              <Route path="/admin/customers" element={<AdminRoute><AdminCustomers /></AdminRoute>} />
              <Route path="/admin/blog" element={<AdminRoute><AdminBlog /></AdminRoute>} />
              <Route path="/admin/coupons" element={<AdminRoute><AdminCoupons /></AdminRoute>} />
              <Route path="/admin/offers" element={<AdminRoute><AdminOffers /></AdminRoute>} />

              {/* 404 */}
              <Route path="*" element={
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
                  <div className="text-8xl mb-4">🛒</div>
                  <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">404</h1>
                  <p className="text-gray-500 mb-6">Oops! The page you're looking for doesn't exist.</p>
                  <a href="/" className="btn-primary">Go to Homepage</a>
                </div>
              } />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

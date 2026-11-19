import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShoppingCart, Heart, User, Search, Menu, X, Sun, Moon,
  ChevronDown, Package, LogOut, Settings, ShoppingBag,
  Home, Laptop, ShoppingBasket, Sparkles, Dumbbell, BookOpen,
  Baby, Car, PawPrint, LayoutDashboard
} from 'lucide-react';
import useAuthStore from '../../store/authStore';
import useCartStore from '../../store/cartStore';
import useThemeStore from '../../store/themeStore';
import { productsAPI } from '../../services/api';
import toast from 'react-hot-toast';

const categories = [
  { name: 'Fashion', path: '/fashion', icon: ShoppingBag, color: 'text-pink-500',
    subs: ['Men\'s Clothing', 'Women\'s Clothing', 'Kids\' Clothing', 'T-Shirts', 'Shirts', 'Jeans', 'Dresses', 'Sarees', 'Kurtis', 'Footwear', 'Watches', 'Bags'] },
  { name: 'Electronics', path: '/electronics', icon: Laptop, color: 'text-blue-500',
    subs: ['Smartphones', 'Laptops', 'Tablets', 'Smartwatches', 'Headphones', 'Cameras', 'Televisions', 'Gaming', 'Speakers', 'Power Banks'] },
  { name: 'Home & Kitchen', path: '/home-kitchen', icon: Home, color: 'text-orange-500',
    subs: ['Refrigerators', 'Washing Machines', 'Microwaves', 'Air Fryers', 'Furniture', 'Cookware', 'Home Decor', 'Lighting'] },
  { name: 'Grocery', path: '/grocery', icon: ShoppingBasket, color: 'text-green-500',
    subs: ['Fruits', 'Vegetables', 'Rice & Grains', 'Spices', 'Dairy', 'Snacks', 'Beverages', 'Packaged Foods'] },
  { name: 'Beauty', path: '/beauty', icon: Sparkles, color: 'text-rose-500',
    subs: ['Skincare', 'Haircare', 'Makeup', 'Perfumes', 'Men\'s Grooming', 'Bath Products'] },
  { name: 'Sports', path: '/sports', icon: Dumbbell, color: 'text-yellow-500',
    subs: ['Gym Equipment', 'Sportswear', 'Cricket', 'Football', 'Badminton', 'Fitness'] },
  { name: 'Books', path: '/books', icon: BookOpen, color: 'text-purple-500',
    subs: ['Fiction', 'Non-Fiction', 'Academic', 'Self-Help', 'Notebooks', 'Stationery'] },
  { name: 'Toys', path: '/toys', icon: Baby, color: 'text-teal-500',
    subs: ['Educational Toys', 'Soft Toys', 'Baby Clothing', 'School Bags', 'Board Games'] },
  { name: 'Automotive', path: '/automotive', icon: Car, color: 'text-gray-500',
    subs: ['Car Accessories', 'Bike Accessories', 'Helmets', 'Vehicle Cleaning'] },
  { name: 'Pets', path: '/pets', icon: PawPrint, color: 'text-amber-500',
    subs: ['Pet Food', 'Pet Toys', 'Pet Grooming', 'Pet Accessories'] },
];

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { cart, fetchCart } = useCartStore();
  const { isDark, toggle } = useThemeStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const searchRef = useRef(null);
  const searchTimeout = useRef(null);

  useEffect(() => {
    if (isAuthenticated) fetchCart();
  }, [isAuthenticated]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
    setMegaMenuOpen(null);
  }, [location.pathname]);

  const handleSearch = useCallback((q) => {
    setSearchQuery(q);
    clearTimeout(searchTimeout.current);
    if (q.length < 2) { setSuggestions([]); setShowSuggestions(false); return; }
    searchTimeout.current = setTimeout(async () => {
      try {
        const res = await productsAPI.getSuggestions(q);
        setSuggestions(res.data.data);
        setShowSuggestions(true);
      } catch {}
    }, 300);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSuggestions(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const cartCount = cart?.items?.reduce((a, i) => a + i.quantity, 0) || 0;

  return (
    <>
      {/* Main Navbar */}
      <nav className={`sticky top-0 z-50 bg-white dark:bg-gray-900 transition-all duration-300 ${scrolled ? 'shadow-lg' : 'border-b border-gray-100 dark:border-gray-800'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-md">
                <span className="text-white font-black text-lg">S</span>
              </div>
              <div className="hidden sm:block">
                <span className="text-xl font-black font-display text-orange-500">Shop</span>
                <span className="text-xl font-black font-display text-gray-900 dark:text-white">Zee</span>
              </div>
            </Link>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl mx-4 relative hidden md:block" ref={searchRef}>
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  placeholder="Search for products, brands and more..."
                  className="w-full pl-4 pr-12 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:text-white"
                />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-500 hover:text-orange-600">
                  <Search size={18} />
                </button>
              </form>
              {/* Search Suggestions */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden z-50">
                  {suggestions.map(product => (
                    <Link
                      key={product._id}
                      to={`/products/${product.slug || product._id}`}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      onClick={() => { setShowSuggestions(false); setSearchQuery(''); }}
                    >
                      <img src={product.images?.[0]} alt={product.name} className="w-10 h-10 object-cover rounded-lg" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">{product.name}</p>
                        <p className="text-xs text-gray-500">₹{product.sellingPrice?.toLocaleString()}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Dark Mode Toggle */}
              <button onClick={toggle} className="p-2 rounded-lg text-gray-500 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-gray-800 transition-colors">
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              {/* Wishlist */}
              <Link to={isAuthenticated ? "/wishlist" : "/login"} className="p-2 rounded-lg text-gray-500 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-gray-800 transition-colors hidden sm:flex">
                <Heart size={20} />
              </Link>

              {/* Cart */}
              <Link to="/cart" className="relative p-2 rounded-lg text-gray-500 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-gray-800 transition-colors">
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </Link>

              {/* User Menu */}
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                      {user?.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                      ) : (
                        <span className="text-orange-600 font-bold text-sm">{user?.name?.[0]?.toUpperCase()}</span>
                      )}
                    </div>
                    <span className="hidden lg:block text-sm font-medium text-gray-700 dark:text-gray-200 max-w-[80px] truncate">{user?.name?.split(' ')[0]}</span>
                    <ChevronDown size={14} className="hidden lg:block text-gray-400" />
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden z-50 animate-slide-down">
                      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                        <p className="font-semibold text-gray-900 dark:text-white text-sm">{user?.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                      </div>
                      <div className="py-2">
                        <Link to="/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-orange-50 dark:hover:bg-gray-700 transition-colors">
                          <User size={16} className="text-orange-500" /> My Profile
                        </Link>
                        <Link to="/orders" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-orange-50 dark:hover:bg-gray-700 transition-colors">
                          <Package size={16} className="text-orange-500" /> My Orders
                        </Link>
                        <Link to="/wishlist" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-orange-50 dark:hover:bg-gray-700 transition-colors">
                          <Heart size={16} className="text-orange-500" /> Wishlist
                        </Link>
                        {user?.role === 'admin' && (
                          <Link to="/admin" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-orange-50 dark:hover:bg-gray-700 transition-colors">
                            <LayoutDashboard size={16} className="text-purple-500" /> Admin Dashboard
                          </Link>
                        )}
                        <div className="border-t border-gray-100 dark:border-gray-700 mt-2 pt-2">
                          <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-gray-700 transition-colors">
                            <LogOut size={16} /> Logout
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" className="hidden sm:flex btn-primary py-2 px-4 text-sm">
                  Login
                </Link>
              )}

              {/* Mobile Menu Toggle */}
              <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 rounded-lg text-gray-500 hover:text-orange-500 md:hidden">
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Category Mega Menu Bar */}
        <div className="hidden md:block border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
              {categories.map((cat) => (
                <div
                  key={cat.name}
                  className="relative flex-shrink-0"
                  onMouseEnter={() => setMegaMenuOpen(cat.name)}
                  onMouseLeave={() => setMegaMenuOpen(null)}
                >
                  <Link
                    to={cat.path}
                    className="flex items-center gap-1.5 px-3 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-orange-500 dark:hover:text-orange-400 transition-colors whitespace-nowrap"
                  >
                    <cat.icon size={15} className={cat.color} />
                    {cat.name}
                    <ChevronDown size={12} className="text-gray-400" />
                  </Link>
                  {/* Dropdown */}
                  {megaMenuOpen === cat.name && (
                    <div className="absolute top-full left-0 mt-0 w-56 bg-white dark:bg-gray-800 rounded-b-2xl shadow-xl border border-t-0 border-gray-100 dark:border-gray-700 z-50 py-2">
                      {cat.subs.map((sub) => (
                        <Link
                          key={sub}
                          to={`${cat.path}?sub=${encodeURIComponent(sub.toLowerCase().replace(/ /g, '-'))}`}
                          className="block px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          {sub}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <Link to="/deals" className="flex items-center gap-1.5 px-3 py-3 text-sm font-semibold text-red-500 hover:text-red-600 transition-colors whitespace-nowrap flex-shrink-0">
                🔥 Today's Deals
              </Link>
              <Link to="/flash-sale" className="flex items-center gap-1.5 px-3 py-3 text-sm font-semibold text-purple-500 hover:text-purple-600 transition-colors whitespace-nowrap flex-shrink-0">
                ⚡ Flash Sale
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Search Bar */}
      <div className="md:hidden bg-white dark:bg-gray-900 px-4 pb-3 border-b border-gray-100 dark:border-gray-800 sticky top-16 z-40">
        <form onSubmit={handleSearchSubmit} className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search for products..."
            className="w-full pl-4 pr-10 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 dark:text-white"
          />
          <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-500">
            <Search size={18} />
          </button>
        </form>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setMobileOpen(false)}>
          <div className="absolute top-0 left-0 bottom-0 w-72 bg-white dark:bg-gray-900 overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-black">S</span>
                </div>
                <span className="font-black text-lg text-orange-500">WORLDKART</span>
              </Link>
              <button onClick={() => setMobileOpen(false)} className="p-2 rounded-lg text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            {isAuthenticated ? (
              <div className="p-4 border-b border-gray-100 dark:border-gray-800 bg-orange-50 dark:bg-gray-800">
                <p className="font-semibold text-gray-900 dark:text-white">{user?.name}</p>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
            ) : (
              <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex gap-3">
                <Link to="/login" className="btn-primary flex-1 text-center text-sm py-2">Login</Link>
                <Link to="/register" className="btn-secondary flex-1 text-center text-sm py-2">Register</Link>
              </div>
            )}
            <div className="p-4">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Categories</p>
              {categories.map(cat => (
                <Link key={cat.name} to={cat.path} className="flex items-center gap-3 py-3 border-b border-gray-50 dark:border-gray-800 text-gray-700 dark:text-gray-200 hover:text-orange-500 transition-colors">
                  <cat.icon size={18} className={cat.color} />
                  <span className="font-medium">{cat.name}</span>
                </Link>
              ))}
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                {isAuthenticated && (
                  <>
                    <Link to="/profile" className="flex items-center gap-3 py-2.5 text-gray-700 dark:text-gray-200 hover:text-orange-500"><User size={16} />My Profile</Link>
                    <Link to="/orders" className="flex items-center gap-3 py-2.5 text-gray-700 dark:text-gray-200 hover:text-orange-500"><Package size={16} />My Orders</Link>
                    {user?.role === 'admin' && <Link to="/admin" className="flex items-center gap-3 py-2.5 text-purple-500"><LayoutDashboard size={16} />Admin Dashboard</Link>}
                    <button onClick={handleLogout} className="flex items-center gap-3 py-2.5 text-red-500 w-full"><LogOut size={16} />Logout</button>
                  </>
                )}
                <button onClick={toggle} className="flex items-center gap-3 py-2.5 text-gray-700 dark:text-gray-200 hover:text-orange-500 w-full mt-2">
                  {isDark ? <Sun size={16} /> : <Moon size={16} />}
                  {isDark ? 'Light Mode' : 'Dark Mode'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Zap, TrendingUp, Star, ArrowRight, Timer, ShoppingBag } from 'lucide-react';
import { productsAPI, offersAPI } from '../services/api';
import ProductCard from '../components/common/ProductCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

// ─── Hero Banners ──────────────────────────────────────────────────────────────
const heroBanners = [
  {
    id: 1,
    title: 'Mega Electronics Sale',
    subtitle: 'Up to 60% OFF on Premium Smartphones, Laptops & More',
    cta: 'Shop Electronics',
    link: '/electronics',
    bg: 'from-slate-900 via-blue-950 to-slate-900',
    accent: 'text-blue-400',
    badge: '60% OFF',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800',
  },
  {
    id: 2,
    title: 'Fashion Festival',
    subtitle: 'Discover Premium Fashion for Men, Women & Kids',
    cta: 'Explore Fashion',
    link: '/fashion',
    bg: 'from-rose-900 via-pink-950 to-rose-900',
    accent: 'text-pink-400',
    badge: 'NEW ARRIVALS',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800',
  },
  {
    id: 3,
    title: 'Grocery Bonanza',
    subtitle: 'Fresh Fruits, Vegetables & Daily Essentials at Best Prices',
    cta: 'Shop Grocery',
    link: '/grocery',
    bg: 'from-green-900 via-emerald-950 to-green-900',
    accent: 'text-green-400',
    badge: 'FRESH & FAST',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800',
  },
];

const categories = [
  { name: 'Fashion', path: '/fashion', emoji: '👗', bg: 'from-pink-500 to-rose-500', count: '50K+ Products' },
  { name: 'Electronics', path: '/electronics', emoji: '📱', bg: 'from-blue-500 to-indigo-500', count: '25K+ Products' },
  { name: 'Home & Kitchen', path: '/home-kitchen', emoji: '🏠', bg: 'from-orange-500 to-amber-500', count: '30K+ Products' },
  { name: 'Grocery', path: '/grocery', emoji: '🛒', bg: 'from-green-500 to-emerald-500', count: '10K+ Products' },
  { name: 'Beauty', path: '/beauty', emoji: '💄', bg: 'from-purple-500 to-violet-500', count: '15K+ Products' },
  { name: 'Sports', path: '/sports', emoji: '⚽', bg: 'from-yellow-500 to-orange-500', count: '8K+ Products' },
  { name: 'Books', path: '/books', emoji: '📚', bg: 'from-teal-500 to-cyan-500', count: '20K+ Products' },
  { name: 'Toys', path: '/toys', emoji: '🧸', bg: 'from-red-500 to-pink-500', count: '12K+ Products' },
  { name: 'Automotive', path: '/automotive', emoji: '🚗', bg: 'from-slate-500 to-gray-600', count: '5K+ Products' },
  { name: 'Pets', path: '/pets', emoji: '🐾', bg: 'from-amber-500 to-yellow-500', count: '3K+ Products' },
];

const brands = [
  { name: 'Apple', logo: '🍎' }, { name: 'Samsung', logo: '📱' }, { name: 'Nike', logo: '✔️' },
  { name: 'Levi\'s', logo: '👖' }, { name: 'Sony', logo: '🎵' }, { name: 'LG', logo: '💡' },
  { name: 'H&M', logo: '👗' }, { name: 'Philips', logo: '💡' },
];

const testimonials = [
  {
    name: 'Priya Sharma',
    rating: 5,
    comment: 'Amazing shopping experience! Got my iPhone delivered in just 2 days. The packaging was perfect and the product is genuine.',
    location: 'Mumbai',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100'
  },
  {
    name: 'Rahul Mehta',
    rating: 5,
    comment: 'Best e-commerce site in India! Great discounts on electronics and the customer service is excellent.',
    location: 'Bangalore',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'
  },
  {
    name: 'Anjali Patel',
    rating: 5,
    comment: 'I love the fashion collection! Ordered a saree for Diwali and it arrived beautifully packed. Will definitely shop again.',
    location: 'Delhi',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100'
  }
];

function HeroCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrent(c => (c + 1) % heroBanners.length), 5000);
    return () => clearInterval(timer);
  }, []);

  const banner = heroBanners[current];

  return (
    <div className={`relative bg-gradient-to-r ${banner.bg} overflow-hidden transition-all duration-700`} style={{ minHeight: '420px' }}>
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={banner.image}
          alt={banner.title}
          className="w-full h-full object-cover opacity-20"
          loading="lazy"
        />
        <div className={`absolute inset-0 bg-gradient-to-r ${banner.bg} opacity-80`} />
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="max-w-2xl">
          <span className={`inline-block ${banner.accent} bg-white/10 border border-white/20 text-sm font-bold px-4 py-1.5 rounded-full mb-4 animate-fade-in`}>
            🔥 {banner.badge}
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-4 leading-tight animate-slide-up">
            {banner.title}
          </h1>
          <p className="text-lg sm:text-xl text-white/80 mb-8 animate-slide-up">
            {banner.subtitle}
          </p>
          <Link to={banner.link} className="btn-primary text-base px-8 py-4">
            {banner.cta} <ArrowRight size={18} />
          </Link>
        </div>
      </div>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {heroBanners.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`rounded-full transition-all duration-300 ${i === current ? 'w-8 h-2 bg-white' : 'w-2 h-2 bg-white/40'}`}
          />
        ))}
      </div>
    </div>
  );
}

function FlashSaleTimer() {
  const [time, setTime] = useState({ h: 5, m: 30, s: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(prev => {
        if (prev.s > 0) return { ...prev, s: prev.s - 1 };
        if (prev.m > 0) return { ...prev, m: prev.m - 1, s: 59 };
        if (prev.h > 0) return { h: prev.h - 1, m: 59, s: 59 };
        return { h: 0, m: 0, s: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const pad = n => String(n).padStart(2, '0');

  return (
    <div className="flex items-center gap-2">
      {[{ label: 'HRS', val: time.h }, { label: 'MIN', val: time.m }, { label: 'SEC', val: time.s }].map(({ label, val }, i) => (
        <React.Fragment key={label}>
          {i > 0 && <span className="text-red-500 font-bold text-xl">:</span>}
          <div className="bg-red-600 text-white rounded-lg px-3 py-2 text-center min-w-[52px]">
            <div className="text-2xl font-black leading-none">{pad(val)}</div>
            <div className="text-xs opacity-80 mt-0.5">{label}</div>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}

function SectionHeader({ title, subtitle, link, linkText = 'View All' }) {
  return (
    <div className="flex items-end justify-between mb-6">
      <div>
        <h2 className="section-title">{title}</h2>
        {subtitle && <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{subtitle}</p>}
      </div>
      {link && (
        <Link to={link} className="flex items-center gap-1 text-orange-500 hover:text-orange-600 font-semibold text-sm transition-colors">
          {linkText} <ChevronRight size={16} />
        </Link>
      )}
    </div>
  );
}

function ProductsGrid({ products, loading, cols = 4 }) {
  if (loading) {
    return (
      <div className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-${cols} gap-4`}>
        {[...Array(cols * 2)].map((_, i) => (
          <div key={i} className="rounded-2xl overflow-hidden">
            <div className="skeleton aspect-square" />
            <div className="p-3 space-y-2">
              <div className="skeleton h-3 w-2/3 rounded" />
              <div className="skeleton h-4 w-full rounded" />
              <div className="skeleton h-4 w-1/2 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-${cols} gap-4`}>
      {products.map(product => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}

export default function Home() {
  const [featured, setFeatured] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await productsAPI.getFeatured();
        setFeatured(res.data.data);
      } catch {}
      setLoading(false);
    };
    load();
  }, []);

  return (
    <div className="bg-gray-50 dark:bg-gray-950">
      {/* Hero */}
      <HeroCarousel />

      {/* Category Grid */}
      <section className="page-container py-10">
        <SectionHeader title="Shop by Category" subtitle="Explore our wide range of product categories" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={cat.path}
              className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${cat.bg} p-4 text-white hover:scale-105 transition-transform duration-300 shadow-sm`}
            >
              <div className="text-3xl mb-2">{cat.emoji}</div>
              <div className="font-bold text-sm">{cat.name}</div>
              <div className="text-xs opacity-80 mt-0.5">{cat.count}</div>
              <ChevronRight className="absolute bottom-3 right-3 opacity-60" size={16} />
            </Link>
          ))}
        </div>
      </section>

      {/* Flash Sale */}
      <section className="page-container pb-10">
        <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl p-6 md:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <Zap className="text-yellow-300" size={28} />
              <div>
                <h2 className="text-2xl font-black text-white">Flash Sale</h2>
                <p className="text-red-100 text-sm">Hurry! Deals end soon</p>
              </div>
            </div>
            <FlashSaleTimer />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {loading ? [...Array(4)].map((_, i) => (
              <div key={i} className="bg-white/10 rounded-xl p-3 animate-pulse">
                <div className="skeleton aspect-square rounded-lg mb-2" />
                <div className="skeleton h-3 rounded mb-1" />
                <div className="skeleton h-4 rounded w-2/3" />
              </div>
            )) : featured?.onSale?.slice(0, 4).map(product => (
              <Link key={product._id} to={`/products/${product.slug || product._id}`}
                className="bg-white dark:bg-gray-900 rounded-xl p-3 hover:shadow-lg transition-shadow group">
                <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-50 mb-2">
                  <img src={product.images?.[0]} alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={e => { e.target.src = 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=400'; }}
                    loading="lazy"
                  />
                  <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded">
                    {product.discount}% OFF
                  </span>
                </div>
                <p className="text-xs font-medium text-gray-700 dark:text-gray-200 line-clamp-2 mb-1">{product.name}</p>
                <p className="font-bold text-gray-900 dark:text-white text-sm">₹{product.sellingPrice?.toLocaleString()}</p>
              </Link>
            ))}
          </div>
          <div className="text-center mt-4">
            <Link to="/flash-sale" className="inline-flex items-center gap-2 bg-white text-red-600 font-bold py-2 px-6 rounded-xl hover:bg-red-50 transition-colors">
              View All Flash Deals <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Trending Products */}
      <section className="page-container pb-10">
        <SectionHeader
          title="🔥 Trending Now"
          subtitle="Most popular products our customers love"
          link="/products?sort=popular"
        />
        <ProductsGrid products={featured?.trending || []} loading={loading} cols={4} />
      </section>

      {/* Banner Pair */}
      <section className="page-container pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link to="/fashion" className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-pink-600 to-rose-600 h-48 group">
            <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600" alt="Fashion"
              className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:scale-105 transition-transform duration-500" />
            <div className="relative p-6 h-full flex flex-col justify-end">
              <span className="text-pink-200 text-sm font-medium">New Collection</span>
              <h3 className="text-2xl font-black text-white">Fashion Store</h3>
              <p className="text-white/80 text-sm">Up to 50% off on top brands</p>
            </div>
          </Link>
          <Link to="/electronics" className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 to-indigo-700 h-48 group">
            <img src="https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600" alt="Electronics"
              className="absolute inset-0 w-full h-full object-cover opacity-25 group-hover:scale-105 transition-transform duration-500" />
            <div className="relative p-6 h-full flex flex-col justify-end">
              <span className="text-blue-200 text-sm font-medium">Best Deals</span>
              <h3 className="text-2xl font-black text-white">Electronics Sale</h3>
              <p className="text-white/80 text-sm">Smartphones, Laptops & More</p>
            </div>
          </Link>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="page-container pb-10">
        <SectionHeader title="✨ New Arrivals" subtitle="Fresh styles just landed" link="/products?newArrival=true" />
        <ProductsGrid products={featured?.newArrivals || []} loading={loading} cols={4} />
      </section>

      {/* Best Sellers */}
      <section className="bg-orange-50 dark:bg-gray-900 py-10">
        <div className="page-container">
          <SectionHeader
            title="🏆 Best Sellers"
            subtitle="Top-rated products our customers keep coming back for"
            link="/products?bestSeller=true"
          />
          <ProductsGrid products={featured?.bestSellers || []} loading={loading} cols={4} />
        </div>
      </section>

      {/* Featured Products */}
      <section className="page-container py-10">
        <SectionHeader title="⭐ Featured Products" subtitle="Handpicked by our editors" link="/products?featured=true" />
        <ProductsGrid products={featured?.featured || []} loading={loading} cols={4} />
      </section>

      {/* Featured Brands */}
      <section className="page-container pb-10">
        <SectionHeader title="Featured Brands" subtitle="Shop from India's most trusted brands" />
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-4">
          {brands.map(brand => (
            <div key={brand.name}
              className="bg-white dark:bg-gray-900 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 hover:shadow-card-hover transition-shadow cursor-pointer border border-gray-100 dark:border-gray-800">
              <span className="text-3xl">{brand.logo}</span>
              <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 text-center">{brand.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Offer Cards */}
      <section className="page-container pb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: 'Free Delivery', desc: 'On orders above ₹499', emoji: '🚚', bg: 'bg-blue-50 dark:bg-blue-950/30 border-blue-100 dark:border-blue-900' },
            { title: 'Easy Returns', desc: '7-day hassle-free returns', emoji: '↩️', bg: 'bg-green-50 dark:bg-green-950/30 border-green-100 dark:border-green-900' },
            { title: 'Secure Payments', desc: 'UPI, Cards, Net Banking & COD', emoji: '🔐', bg: 'bg-purple-50 dark:bg-purple-950/30 border-purple-100 dark:border-purple-900' },
          ].map(offer => (
            <div key={offer.title} className={`${offer.bg} border rounded-2xl p-6 flex items-center gap-4`}>
              <span className="text-4xl">{offer.emoji}</span>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white">{offer.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{offer.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gray-50 dark:bg-gray-900 py-12">
        <div className="page-container">
          <SectionHeader title="What Our Customers Say" subtitle="Real reviews from verified buyers" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-card">
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} size={14} fill="#FBBF24" className="text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">"{t.comment}"</p>
                <div className="flex items-center gap-3">
                  <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover"
                    onError={e => { e.target.style.display = 'none'; }} />
                  <div>
                    <p className="font-semibold text-sm text-gray-900 dark:text-white">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.location} · Verified Buyer</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

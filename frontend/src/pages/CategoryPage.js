import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { productsAPI } from '../services/api';
import ProductCard from '../components/common/ProductCard';
import { useState, useEffect } from 'react';

// Map URL path to category ID
const PATH_TO_CATEGORY = {
  '/fashion': 'fashion',
  '/electronics': 'electronics',
  '/home-kitchen': 'home-kitchen',
  '/grocery': 'grocery',
  '/beauty': 'beauty',
  '/sports': 'sports',
  '/books': 'books',
  '/toys': 'toys',
  '/automotive': 'automotive',
  '/pets': 'pets',
};

const categoryMeta = {
  fashion: { name: 'Fashion & Clothing', emoji: '👗', desc: 'Discover the latest trends in men\'s, women\'s and kids\' fashion', bg: 'from-pink-600 to-rose-600' },
  electronics: { name: 'Electronics & Gadgets', emoji: '📱', desc: 'Top brands in smartphones, laptops, audio and more', bg: 'from-blue-600 to-indigo-600' },
  'home-kitchen': { name: 'Home & Kitchen', emoji: '🏠', desc: 'Everything for your home from appliances to decor', bg: 'from-orange-500 to-amber-500' },
  grocery: { name: 'Grocery & Daily Essentials', emoji: '🛒', desc: 'Fresh fruits, vegetables and daily essentials', bg: 'from-green-600 to-emerald-600' },
  beauty: { name: 'Beauty & Personal Care', emoji: '💄', desc: 'Skincare, makeup, haircare and more', bg: 'from-purple-600 to-violet-600' },
  sports: { name: 'Sports & Fitness', emoji: '⚽', desc: 'Gym equipment, sportswear and outdoor gear', bg: 'from-yellow-500 to-orange-500' },
  books: { name: 'Books & Stationery', emoji: '📚', desc: 'Best books, notebooks and office supplies', bg: 'from-teal-600 to-cyan-600' },
  toys: { name: 'Toys & Baby Products', emoji: '🧸', desc: 'Educational toys, baby care and more', bg: 'from-red-500 to-pink-500' },
  automotive: { name: 'Automotive Accessories', emoji: '🚗', desc: 'Car and bike accessories for every need', bg: 'from-slate-600 to-gray-700' },
  pets: { name: 'Pet Supplies', emoji: '🐾', desc: 'Pet food, toys and grooming essentials', bg: 'from-amber-500 to-yellow-500' },
};

export default function CategoryPage() {
  const { category: paramCategory } = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  // Resolve category from URL params or pathname
  const category = paramCategory || PATH_TO_CATEGORY[location.pathname] || location.pathname.replace('/', '');

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const meta = categoryMeta[category] || { name: category, emoji: '🛒', desc: '', bg: 'from-orange-500 to-orange-600' };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const params = { category, sort, page, limit: 20 };
        const sub = searchParams.get('sub');
        if (sub) params.subcategory = sub;
        const res = await productsAPI.getAll(params);
        setProducts(res.data.data);
        setTotal(res.data.total);
        setPages(res.data.pages || 1);
      } catch {}
      setLoading(false);
    };
    if (category) load();
  }, [category, sort, page, location.search]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Hero */}
      <div className={`bg-gradient-to-r ${meta.bg} py-12 px-4`}>
        <div className="max-w-7xl mx-auto text-white">
          <div className="text-5xl mb-3">{meta.emoji}</div>
          <h1 className="text-3xl font-black">{meta.name}</h1>
          <p className="text-white/80 mt-2">{meta.desc}</p>
          <p className="text-white/60 text-sm mt-1">{total} products</p>
        </div>
      </div>

      <div className="page-container py-8">
        {/* Sort */}
        <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
          <h2 className="font-semibold text-gray-700 dark:text-gray-300">{total} Products</h2>
          <select value={sort} onChange={e => { setSort(e.target.value); setPage(1); }} className="input-field py-2 text-sm w-auto">
            <option value="newest">Newest</option>
            <option value="popular">Most Popular</option>
            <option value="rating">Top Rated</option>
            <option value="price_asc">Price ↑</option>
            <option value="price_desc">Price ↓</option>
            <option value="discount">Biggest Discount</option>
          </select>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden">
                <div className="skeleton aspect-square" />
                <div className="p-3 space-y-2">
                  <div className="skeleton h-3 rounded w-1/2" />
                  <div className="skeleton h-4 rounded" />
                  <div className="skeleton h-4 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {products.map(p => <ProductCard key={p._id} product={p} />)}
            </div>

            {/* Pagination */}
            {pages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm disabled:opacity-50">Previous</button>
                {[...Array(Math.min(5, pages))].map((_, i) => {
                  const pageNum = Math.max(1, Math.min(page - 2, pages - 4)) + i;
                  return (
                    <button key={pageNum} onClick={() => setPage(pageNum)}
                      className={`w-9 h-9 rounded-lg text-sm font-medium ${page === pageNum ? 'bg-orange-500 text-white' : 'border border-gray-200 dark:border-gray-700'}`}>
                      {pageNum}
                    </button>
                  );
                })}
                <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages}
                  className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm disabled:opacity-50">Next</button>
              </div>
            )}
          </>
        )}

        {!loading && products.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">{meta.emoji}</div>
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">No products yet in this category</h3>
            <p className="text-gray-500 mt-2">Products will appear here once added by admin.</p>
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X, ChevronDown, Grid3X3, List } from 'lucide-react';
import { productsAPI } from '../services/api';
import ProductCard from '../components/common/ProductCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

const CATEGORIES = [
  { value: 'fashion', label: 'Fashion' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'home-kitchen', label: 'Home & Kitchen' },
  { value: 'grocery', label: 'Grocery' },
  { value: 'beauty', label: 'Beauty' },
  { value: 'sports', label: 'Sports' },
  { value: 'books', label: 'Books' },
  { value: 'toys', label: 'Toys' },
  { value: 'automotive', label: 'Automotive' },
  { value: 'pets', label: 'Pets' },
];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'discount', label: 'Biggest Discount' },
];

function FilterSidebar({ filters, onChange, onClear }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-gray-900 dark:text-white">Filters</h3>
        <button onClick={onClear} className="text-xs text-orange-500 hover:text-orange-600 font-semibold">Clear All</button>
      </div>

      {/* Category */}
      <div>
        <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-3">Category</h4>
        <div className="space-y-2">
          {CATEGORIES.map(cat => (
            <label key={cat.value} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                className="accent-orange-500 w-4 h-4 rounded"
                checked={filters.category === cat.value}
                onChange={() => onChange('category', filters.category === cat.value ? '' : cat.value)}
              />
              <span className="text-sm text-gray-600 dark:text-gray-300 group-hover:text-orange-500 transition-colors">{cat.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-3">Price Range</h4>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <input type="number" placeholder="Min" value={filters.minPrice}
              onChange={e => onChange('minPrice', e.target.value)}
              className="input-field py-2 text-sm"
            />
            <span className="text-gray-400">-</span>
            <input type="number" placeholder="Max" value={filters.maxPrice}
              onChange={e => onChange('maxPrice', e.target.value)}
              className="input-field py-2 text-sm"
            />
          </div>
          <div className="space-y-1">
            {[{ label: 'Under ₹500', min: '', max: 500 }, { label: '₹500 - ₹2000', min: 500, max: 2000 },
              { label: '₹2000 - ₹10000', min: 2000, max: 10000 }, { label: 'Above ₹10000', min: 10000, max: '' }
            ].map(r => (
              <button key={r.label} onClick={() => { onChange('minPrice', r.min); onChange('maxPrice', r.max); }}
                className="block w-full text-left text-sm text-gray-600 dark:text-gray-300 hover:text-orange-500 py-1 transition-colors">
                {r.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Rating */}
      <div>
        <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-3">Minimum Rating</h4>
        <div className="space-y-2">
          {[4, 3, 2].map(r => (
            <label key={r} className="flex items-center gap-2 cursor-pointer group">
              <input type="radio" name="rating" className="accent-orange-500"
                checked={filters.minRating === r} onChange={() => onChange('minRating', r)} />
              <span className="text-sm text-yellow-500">{'★'.repeat(r)}</span>
              <span className="text-xs text-gray-500">& above</span>
            </label>
          ))}
        </div>
      </div>

      {/* Other Filters */}
      <div>
        <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-3">Other</h4>
        <div className="space-y-2">
          {[
            { label: 'On Sale', key: 'onSale' },
            { label: 'In Stock', key: 'inStock' },
            { label: 'Free Delivery', key: 'freeShipping' },
            { label: 'New Arrivals', key: 'newArrival' },
          ].map(({ label, key }) => (
            <label key={key} className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="accent-orange-500 w-4 h-4"
                checked={!!filters[key]} onChange={e => onChange(key, e.target.checked || '')} />
              <span className="text-sm text-gray-600 dark:text-gray-300">{label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    keyword: searchParams.get('keyword') || '',
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    minRating: searchParams.get('minRating') || '',
    onSale: searchParams.get('onSale') || '',
    inStock: searchParams.get('inStock') || '',
    newArrival: searchParams.get('newArrival') || '',
    featured: searchParams.get('featured') || '',
    bestSeller: searchParams.get('bestSeller') || '',
    sort: searchParams.get('sort') || 'newest',
    page: parseInt(searchParams.get('page') || '1'),
  });

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== '' && v !== false && v !== null));
      const res = await productsAPI.getAll(params);
      setProducts(res.data.data);
      setTotal(res.data.total);
      setPages(res.data.pages);
    } catch (err) {}
    setLoading(false);
  }, [filters]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const clearFilters = () => setFilters({ keyword: '', category: '', minPrice: '', maxPrice: '', minRating: '', onSale: '', inStock: '', newArrival: '', featured: '', bestSeller: '', sort: 'newest', page: 1 });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="page-container py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">All Products</h1>
            <p className="text-sm text-gray-500 mt-1">{total.toLocaleString()} products found</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Sort */}
            <select
              value={filters.sort}
              onChange={e => handleFilterChange('sort', e.target.value)}
              className="input-field py-2 pl-3 pr-8 text-sm w-auto"
            >
              {SORT_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            {/* Filter Toggle (mobile) */}
            <button onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium hover:border-orange-500 transition-colors lg:hidden">
              <SlidersHorizontal size={16} /> Filters
            </button>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-card sticky top-32">
              <FilterSidebar filters={filters} onChange={handleFilterChange} onClear={clearFilters} />
            </div>
          </div>

          {/* Mobile Filter Drawer */}
          {showFilters && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div className="absolute inset-0 bg-black/50" onClick={() => setShowFilters(false)} />
              <div className="absolute right-0 top-0 bottom-0 w-72 bg-white dark:bg-gray-900 overflow-y-auto p-5">
                <div className="flex justify-between mb-4">
                  <h3 className="font-bold">Filters</h3>
                  <button onClick={() => setShowFilters(false)}><X size={20} /></button>
                </div>
                <FilterSidebar filters={filters} onChange={handleFilterChange} onClear={clearFilters} />
              </div>
            </div>
          )}

          {/* Products Grid */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="rounded-2xl overflow-hidden">
                    <div className="skeleton aspect-square" />
                    <div className="p-3 space-y-2">
                      <div className="skeleton h-3 w-1/2 rounded" />
                      <div className="skeleton h-4 w-full rounded" />
                      <div className="skeleton h-5 w-1/3 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No products found</h3>
                <p className="text-gray-500 mb-4">Try adjusting your filters or search query.</p>
                <button onClick={clearFilters} className="btn-primary">Clear Filters</button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                  {products.map(product => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {pages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <button
                      onClick={() => handleFilterChange('page', Math.max(1, filters.page - 1))}
                      disabled={filters.page === 1}
                      className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm disabled:opacity-50 hover:border-orange-500 transition-colors"
                    >
                      Previous
                    </button>
                    {[...Array(Math.min(5, pages))].map((_, i) => {
                      const pageNum = Math.max(1, Math.min(filters.page - 2, pages - 4)) + i;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handleFilterChange('page', pageNum)}
                          className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                            filters.page === pageNum
                              ? 'bg-orange-500 text-white'
                              : 'border border-gray-200 dark:border-gray-700 hover:border-orange-500'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => handleFilterChange('page', Math.min(pages, filters.page + 1))}
                      disabled={filters.page === pages}
                      className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm disabled:opacity-50 hover:border-orange-500 transition-colors"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

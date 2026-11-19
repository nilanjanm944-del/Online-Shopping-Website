import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { productsAPI } from '../services/api';
import ProductCard from '../components/common/ProductCard';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const q = searchParams.get('q') || '';
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!q) return;
    const search = async () => {
      setLoading(true);
      try {
        const res = await productsAPI.getAll({ keyword: q, limit: 24 });
        setProducts(res.data.data);
        setTotal(res.data.total);
      } catch {}
      setLoading(false);
    };
    search();
  }, [q]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
      <div className="page-container">
        <div className="flex items-center gap-3 mb-6">
          <Search size={24} className="text-orange-500" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Search results for "{q}"
            </h1>
            <p className="text-gray-500 text-sm">{total} products found</p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden">
                <div className="skeleton aspect-square" />
                <div className="p-3 space-y-2"><div className="skeleton h-3 rounded" /><div className="skeleton h-4 rounded" /></div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No results found</h3>
            <p className="text-gray-500">Try different keywords or browse our categories</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {products.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}

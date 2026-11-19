import React, { useState, useEffect } from 'react';
import { productsAPI } from '../services/api';
import ProductCard from '../components/common/ProductCard';

function FlashTimer() {
  const [time, setTime] = useState({ h: 2, m: 45, s: 0 });
  useEffect(() => {
    const t = setInterval(() => {
      setTime(p => {
        if (p.s > 0) return { ...p, s: p.s - 1 };
        if (p.m > 0) return { ...p, m: p.m - 1, s: 59 };
        if (p.h > 0) return { h: p.h - 1, m: 59, s: 59 };
        return { h: 0, m: 0, s: 0 };
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);
  const pad = n => String(n).padStart(2, '0');
  return (
    <div className="flex items-center gap-2">
      {[{ v: time.h, l: 'HRS' }, { v: time.m, l: 'MIN' }, { v: time.s, l: 'SEC' }].map(({ v, l }, i) => (
        <React.Fragment key={l}>
          {i > 0 && <span className="text-yellow-300 font-bold text-2xl">:</span>}
          <div className="bg-white/20 backdrop-blur rounded-xl px-3 py-2 text-center">
            <div className="text-3xl font-black text-white">{pad(v)}</div>
            <div className="text-xs text-white/70">{l}</div>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}

export default function FlashSalePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productsAPI.getAll({ onSale: true, sort: 'discount', limit: 20 })
      .then(res => setProducts(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero */}
      <div className="bg-gradient-to-r from-purple-900 via-red-900 to-orange-900 py-16 px-4 text-center">
        <div className="text-6xl mb-4">⚡</div>
        <h1 className="text-5xl font-black text-white mb-2">Flash Sale!</h1>
        <p className="text-white/70 text-lg mb-6">Limited time deals — Hurry before they're gone!</p>
        <FlashTimer />
      </div>

      <div className="page-container py-10">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => <div key={i}><div className="skeleton aspect-square rounded-2xl" /></div>)}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}

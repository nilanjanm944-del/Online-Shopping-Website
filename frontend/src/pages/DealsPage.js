import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productsAPI } from '../services/api';
import ProductCard from '../components/common/ProductCard';

export default function DealsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productsAPI.getAll({ onSale: true, sort: 'discount', limit: 40 })
      .then(res => setProducts(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
      <div className="page-container">
        {/* Hero */}
        <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl p-8 mb-8 text-white text-center">
          <h1 className="text-4xl font-black mb-2">🔥 Today's Deals</h1>
          <p className="text-red-100 text-lg">Handpicked deals updated daily — up to 70% OFF!</p>
        </div>

        {/* Offers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { code: 'WELCOME10', desc: '10% off on first order', min: '₹500', type: 'First Order' },
            { code: 'WORLDKART20', desc: '20% off on orders above ₹2000', min: '₹2,000', type: 'Sitewide' },
            { code: 'FLAT500', desc: 'Flat ₹500 off on ₹3000+', min: '₹3,000', type: 'Coupon' },
            { code: 'ELECTRONICS15', desc: '15% off on electronics', min: '₹5,000', type: 'Electronics' },
          ].map(offer => (
            <div key={offer.code} className="bg-white dark:bg-gray-900 rounded-2xl p-4 border-2 border-dashed border-orange-200 dark:border-orange-900 shadow-card">
              <span className="badge badge-primary mb-2">{offer.type}</span>
              <p className="font-bold text-gray-900 dark:text-white">{offer.desc}</p>
              <p className="text-xs text-gray-400 mb-3">Min order: {offer.min}</p>
              <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg px-3 py-2 flex items-center justify-between">
                <code className="font-bold text-orange-600 text-sm">{offer.code}</code>
                <button onClick={() => { navigator.clipboard.writeText(offer.code); }} className="text-xs text-orange-500 hover:text-orange-600">Copy</button>
              </div>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">All Deals</h2>
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => <div key={i}><div className="skeleton aspect-square rounded-2xl" /><div className="skeleton h-4 rounded mt-2" /></div>)}
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

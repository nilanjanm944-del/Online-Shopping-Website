import React from 'react';
import { Users, Award, ShoppingBag, Globe } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Hero */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-500 py-20 px-4 text-white text-center">
        <h1 className="text-5xl font-black mb-4">About WORLDKART</h1>
        <p className="text-xl text-orange-100 max-w-2xl mx-auto">India's premier multi-category online marketplace, bringing the best products to your doorstep.</p>
      </div>

      <div className="page-container py-12">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-12">
          {[
            { icon: Users, label: '10M+ Customers', desc: 'Happy shoppers' },
            { icon: ShoppingBag, label: '5M+ Products', desc: 'Across categories' },
            { icon: Award, label: '500+ Brands', desc: 'Trusted partners' },
            { icon: Globe, label: 'Pan-India', desc: 'Delivery across India' },
          ].map(({ icon: Icon, label, desc }) => (
            <div key={label} className="bg-white dark:bg-gray-900 rounded-2xl p-6 text-center shadow-card">
              <Icon size={32} className="text-orange-500 mx-auto mb-3" />
              <p className="font-bold text-gray-900 dark:text-white">{label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
            </div>
          ))}
        </div>

        {/* Mission */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-card mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Mission</h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            WORLDKART was founded with a simple mission: to make quality products accessible and affordable for everyone in India. We believe everyone deserves access to premium products at fair prices, delivered quickly and reliably.
          </p>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed mt-3">
            From the latest smartphones to fresh organic vegetables, designer fashion to home appliances — WORLDKART is your one-stop destination for all your shopping needs.
          </p>
        </div>

        {/* Why Choose Us */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-card">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Why Choose WORLDKART?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              '✅ 100% Genuine Products — All products verified',
              '🚚 Fast Delivery — Delivered in 2-7 business days',
              '↩️ Easy Returns — Hassle-free 7-day return policy',
              '🔐 Secure Payments — SSL-encrypted transactions',
              '💰 Best Prices — Price match guarantee',
              '📞 24/7 Support — Always here to help',
            ].map(feature => (
              <div key={feature} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <span className="text-sm text-gray-700 dark:text-gray-200">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

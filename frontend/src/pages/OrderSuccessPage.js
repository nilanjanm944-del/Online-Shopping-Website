import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Package, Truck, MapPin, Home } from 'lucide-react';

export default function OrderSuccessPage() {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-10 max-w-md w-full text-center">
        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-5">
          <CheckCircle size={40} className="text-green-500" />
        </div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Order Placed! 🎉</h1>
        <p className="text-gray-500 mb-1">Your order has been placed successfully.</p>
        <p className="text-xs text-gray-400 mb-6">Order ID: <strong className="text-gray-700 dark:text-gray-300">#{id?.slice(-8).toUpperCase()}</strong></p>
        
        <div className="bg-orange-50 dark:bg-orange-900/20 rounded-2xl p-4 mb-6 text-left">
          <p className="font-semibold text-gray-800 dark:text-gray-200 text-sm mb-3">What happens next?</p>
          <div className="space-y-2">
            {[
              { icon: Package, text: 'We\'re processing your order' },
              { icon: Truck, text: 'Your order will be shipped soon' },
              { icon: MapPin, text: 'You\'ll receive a tracking number' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                <Icon size={16} className="text-orange-500" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Link to={`/orders/${id}`} className="btn-primary w-full justify-center">View Order Details</Link>
          <Link to="/orders" className="btn-secondary w-full justify-center">All My Orders</Link>
          <Link to="/" className="flex items-center justify-center gap-2 text-gray-500 hover:text-orange-500 text-sm">
            <Home size={16} /> Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ChevronRight, RefreshCw } from 'lucide-react';
import { ordersAPI } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-700', confirmed: 'bg-blue-100 text-blue-700',
  processing: 'bg-purple-100 text-purple-700', shipped: 'bg-indigo-100 text-indigo-700',
  out_for_delivery: 'bg-cyan-100 text-cyan-700', delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700', return_requested: 'bg-orange-100 text-orange-700',
  returned: 'bg-gray-100 text-gray-700', refunded: 'bg-teal-100 text-teal-700',
};

const STATUS_LABELS = {
  pending: 'Pending', confirmed: 'Confirmed', processing: 'Processing',
  shipped: 'Shipped', out_for_delivery: 'Out for Delivery', delivered: 'Delivered',
  cancelled: 'Cancelled', return_requested: 'Return Requested',
  returned: 'Returned', refunded: 'Refunded',
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await ordersAPI.getMyOrders();
      setOrders(res.data.data);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchOrders(); }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
      <div className="page-container max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Orders</h1>
          <button onClick={fetchOrders} className="btn-ghost text-sm gap-2">
            <RefreshCw size={16} /> Refresh
          </button>
        </div>

        {loading ? <LoadingSpinner fullPage /> : orders.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-12 text-center shadow-card">
            <Package size={56} className="text-gray-200 dark:text-gray-700 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No orders yet</h3>
            <p className="text-gray-400 mb-6">Start shopping to see your orders here</p>
            <Link to="/products" className="btn-primary">Browse Products</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order._id} className="bg-white dark:bg-gray-900 rounded-2xl shadow-card overflow-hidden">
                <div className="p-4 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-xs text-gray-400">ORDER ID</p>
                      <p className="font-bold text-gray-900 dark:text-white text-sm">#{order.orderNumber || order._id.slice(-8).toUpperCase()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">DATE</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{new Date(order.createdAt).toLocaleDateString('en-IN')}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">TOTAL</p>
                      <p className="font-bold text-gray-900 dark:text-white text-sm">₹{order.totalPrice?.toLocaleString()}</p>
                    </div>
                  </div>
                  <span className={`badge ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-700'} px-3 py-1 text-xs font-bold`}>
                    {STATUS_LABELS[order.status] || order.status}
                  </span>
                </div>

                <div className="p-4 flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    {order.items?.slice(0, 3).map((item, i) => (
                      <img key={i} src={item.image}
                        className="w-12 h-12 rounded-xl object-cover border border-gray-100 dark:border-gray-800"
                        onError={e => { e.target.src = 'https://cdn.pixabay.com/photo/2017/05/11/19/44/fresh-fruits-2305192_1280.jpg'; }}
                        alt={item.name}
                      />
                    ))}
                    {order.items?.length > 3 && (
                      <span className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xs font-semibold text-gray-600">
                        +{order.items.length - 3}
                      </span>
                    )}
                    <p className="text-sm text-gray-600 dark:text-gray-400 ml-1">{order.items?.length} item{order.items?.length !== 1 ? 's' : ''}</p>
                  </div>
                  <Link to={`/orders/${order._id}`} className="flex items-center gap-1 text-orange-500 hover:text-orange-600 font-semibold text-sm">
                    View Details <ChevronRight size={16} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

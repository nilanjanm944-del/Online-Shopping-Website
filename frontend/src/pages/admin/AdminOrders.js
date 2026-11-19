import React, { useState, useEffect } from 'react';
import { ordersAPI } from '../../services/api';
import { AdminSidebar } from './AdminDashboard';
import toast from 'react-hot-toast';

const ORDER_STATUSES = ['pending','confirmed','processing','shipped','out_for_delivery','delivered','cancelled','return_requested','returned','refunded'];
const STATUS_COLORS = {
  pending:'bg-yellow-100 text-yellow-700', confirmed:'bg-blue-100 text-blue-700',
  processing:'bg-purple-100 text-purple-700', shipped:'bg-indigo-100 text-indigo-700',
  out_for_delivery:'bg-cyan-100 text-cyan-700', delivered:'bg-green-100 text-green-700',
  cancelled:'bg-red-100 text-red-700', return_requested:'bg-orange-100 text-orange-700',
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, [filter]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = { limit: 50, sort: '-createdAt' };
      if (filter) params.status = filter;
      const res = await ordersAPI.getAll(params);
      setOrders(res.data.data);
    } catch {}
    setLoading(false);
  };

  const handleUpdateStatus = async (orderId, status) => {
    setUpdating(orderId);
    try {
      await ordersAPI.updateStatus(orderId, { status });
      toast.success('Order status updated');
      fetchOrders();
    } catch { toast.error('Failed to update status'); }
    setUpdating(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-6">
      <div className="page-container">
        <div className="flex gap-6">
          <AdminSidebar active="/admin/orders" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Orders</h1>
              <select value={filter} onChange={e => setFilter(e.target.value)} className="input-field py-2 text-sm w-auto">
                <option value="">All Orders</option>
                {ORDER_STATUSES.map(s => <option key={s} value={s} className="capitalize">{s.replace('_', ' ')}</option>)}
              </select>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase">Order</th>
                      <th className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase">Customer</th>
                      <th className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase">Total</th>
                      <th className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase">Status</th>
                      <th className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase">Date</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-gray-500 uppercase">Update</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      [...Array(5)].map((_, i) => (
                        <tr key={i}><td colSpan={6} className="py-4 px-4"><div className="skeleton h-8 rounded" /></td></tr>
                      ))
                    ) : orders.map(order => (
                      <tr key={order._id} className="border-t border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <td className="py-3 px-4">
                          <p className="text-sm font-bold text-gray-900 dark:text-white">#{order.orderNumber?.slice(-8)}</p>
                          <p className="text-xs text-gray-400">{order.items?.length} items</p>
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-sm text-gray-700 dark:text-gray-300">{order.user?.name || 'N/A'}</p>
                          <p className="text-xs text-gray-400">{order.user?.email}</p>
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-bold text-sm text-gray-900 dark:text-white">₹{order.totalPrice?.toLocaleString()}</p>
                          <p className="text-xs text-gray-400 capitalize">{order.paymentMethod}</p>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`badge text-xs capitalize ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-700'}`}>
                            {order.status?.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                        <td className="py-3 px-4 text-right">
                          <select
                            value={order.status}
                            onChange={e => handleUpdateStatus(order._id, e.target.value)}
                            disabled={updating === order._id}
                            className="text-xs border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-orange-500"
                          >
                            {ORDER_STATUSES.map(s => <option key={s} value={s} className="capitalize">{s.replace('_', ' ')}</option>)}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {!loading && orders.length === 0 && (
                  <div className="text-center py-10 text-gray-400">No orders found.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

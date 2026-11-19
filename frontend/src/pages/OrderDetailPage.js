import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Package, Truck, MapPin, CheckCircle, Clock, XCircle } from 'lucide-react';
import { ordersAPI } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const STATUS_STEPS = ['pending', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered'];

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await ordersAPI.getById(id);
        setOrder(res.data.data);
      } catch {}
      setLoading(false);
    };
    load();
  }, [id]);

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    setCancelling(true);
    try {
      const res = await ordersAPI.cancel(id, 'Cancelled by customer');
      setOrder(res.data.data);
      toast.success('Order cancelled successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cannot cancel this order');
    }
    setCancelling(false);
  };

  if (loading) return <LoadingSpinner fullPage />;
  if (!order) return <div className="text-center py-16"><p className="text-gray-500">Order not found</p></div>;

  const statusIndex = STATUS_STEPS.indexOf(order.status);
  const isCancelled = order.status === 'cancelled';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
      <div className="page-container max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Order Details</h1>
            <p className="text-gray-500 text-sm mt-1">#{order.orderNumber}</p>
          </div>
          <Link to="/orders" className="btn-ghost text-sm">← All Orders</Link>
        </div>

        {/* Tracking Progress */}
        {!isCancelled && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-card mb-6">
            <h3 className="font-bold text-gray-800 dark:text-white mb-5">Order Tracking</h3>
            <div className="flex items-center justify-between overflow-x-auto pb-2">
              {STATUS_STEPS.map((status, i) => (
                <React.Fragment key={status}>
                  <div className="flex flex-col items-center flex-shrink-0 min-w-[60px]">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-colors ${
                      i <= statusIndex ? 'bg-orange-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
                    }`}>
                      {i < statusIndex ? <CheckCircle size={20} /> : <Clock size={18} />}
                    </div>
                    <p className="text-xs text-center text-gray-600 dark:text-gray-400 capitalize">{status.replace('_', '\n')}</p>
                  </div>
                  {i < STATUS_STEPS.length - 1 && (
                    <div className={`flex-1 h-1 mx-2 rounded transition-colors ${i < statusIndex ? 'bg-orange-500' : 'bg-gray-200 dark:bg-gray-700'}`} />
                  )}
                </React.Fragment>
              ))}
            </div>
            {order.trackingNumber && (
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-4">
                Tracking Number: <strong className="text-orange-500">{order.trackingNumber}</strong>
              </p>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Order Items */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-card md:col-span-2">
            <h3 className="font-bold text-gray-800 dark:text-white mb-4">Items Ordered</h3>
            <div className="space-y-4">
              {order.items.map((item, i) => (
                <div key={i} className="flex gap-4 pb-4 border-b border-gray-50 dark:border-gray-800 last:border-0">
                  <img src={item.image} alt={item.name}
                    className="w-16 h-16 rounded-xl object-cover"
                    onError={e => { e.target.src = 'https://cdn.pixabay.com/photo/2017/05/11/19/44/fresh-fruits-2305192_1280.jpg'; }} />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white text-sm line-clamp-2">{item.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">Qty: {item.quantity} {item.size ? `| Size: ${item.size}` : ''}</p>
                  </div>
                  <p className="font-bold text-gray-900 dark:text-white text-sm">₹{(item.price * item.quantity).toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-card">
            <h3 className="font-bold text-gray-800 dark:text-white mb-3 flex items-center gap-2"><MapPin size={16} className="text-orange-500" /> Delivery Address</h3>
            <p className="font-semibold text-gray-700 dark:text-gray-300">{order.shippingAddress?.name}</p>
            <p className="text-sm text-gray-500 mt-1">{order.shippingAddress?.addressLine1}</p>
            {order.shippingAddress?.addressLine2 && <p className="text-sm text-gray-500">{order.shippingAddress.addressLine2}</p>}
            <p className="text-sm text-gray-500">{order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}</p>
            <p className="text-sm text-gray-500 mt-1">📱 {order.shippingAddress?.phone}</p>
          </div>

          {/* Payment Summary */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-card">
            <h3 className="font-bold text-gray-800 dark:text-white mb-3">Payment Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600 dark:text-gray-400"><span>Subtotal</span><span>₹{order.itemsPrice?.toLocaleString()}</span></div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400"><span>Shipping</span><span>{order.shippingPrice === 0 ? 'FREE' : `₹${order.shippingPrice}`}</span></div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400"><span>Tax (GST)</span><span>₹{order.taxPrice?.toLocaleString()}</span></div>
              {order.discountAmount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-₹{order.discountAmount}</span></div>}
              <div className="border-t border-gray-100 dark:border-gray-800 pt-2 flex justify-between font-bold text-gray-900 dark:text-white">
                <span>Total</span><span>₹{order.totalPrice?.toLocaleString()}</span>
              </div>
            </div>
            <div className="mt-3">
              <span className={`badge ${order.isPaid ? 'badge-success' : 'badge-warning'}`}>
                {order.isPaid ? '✓ Paid' : '⏳ Payment Pending'}
              </span>
              <span className="badge badge-primary ml-2 capitalize">{order.paymentMethod}</span>
            </div>
          </div>
        </div>

        {/* Cancel Button */}
        {['pending', 'confirmed', 'processing'].includes(order.status) && (
          <div className="mt-6 text-right">
            <button onClick={handleCancel} disabled={cancelling}
              className="btn-danger">
              {cancelling ? 'Cancelling...' : 'Cancel Order'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

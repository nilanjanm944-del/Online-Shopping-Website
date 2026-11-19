import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, Tag, ArrowRight, X } from 'lucide-react';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';
import LoadingSpinner from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const FALLBACK = 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=200';

export default function CartPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { cart, fetchCart, updateQuantity, removeFromCart, applyCoupon, removeCoupon, loading } = useCartStore();
  const [couponInput, setCouponInput] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) fetchCart();
  }, [isAuthenticated]);

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    const result = await applyCoupon(couponInput.trim());
    setCouponLoading(false);
    if (result.success) toast.success(result.message);
    else toast.error(result.message);
  };

  const handleRemoveCoupon = async () => {
    await removeCoupon();
    setCouponInput('');
    toast.success('Coupon removed');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center p-8 text-center">
        <ShoppingBag size={64} className="text-gray-300 mb-6" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Login to view your cart and continue shopping</p>
        <div className="flex gap-3">
          <Link to="/login?redirect=/cart" className="btn-primary">Login</Link>
          <Link to="/products" className="btn-secondary">Browse Products</Link>
        </div>
      </div>
    );
  }

  const items = cart?.items || [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
      <div className="page-container">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Shopping Cart {items.length > 0 && <span className="text-gray-400 font-normal text-lg">({items.length} {items.length === 1 ? 'item' : 'items'})</span>}
        </h1>

        {items.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-16 text-center shadow-card">
            <ShoppingBag size={64} className="text-gray-200 dark:text-gray-700 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Your cart is empty</h2>
            <p className="text-gray-400 mb-6">Add items to your cart to see them here</p>
            <Link to="/products" className="btn-primary">Start Shopping</Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Cart Items */}
            <div className="flex-1 space-y-4">
              {items.map((item) => {
                const product = item.product;
                const price = product?.sellingPrice || item.price || 0;
                return (
                  <div key={item._id} className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-card flex gap-4">
                    <Link to={`/products/${product?._id}`} className="flex-shrink-0">
                      <img
                        src={product?.images?.[0] || item.image || FALLBACK}
                        alt={item.name}
                        className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-xl"
                        onError={e => { e.target.src = FALLBACK; }}
                      />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-xs text-gray-400 mb-0.5">{product?.brand}</p>
                          <Link to={`/products/${product?._id}`} className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-2 hover:text-orange-500">
                            {item.name}
                          </Link>
                          {(item.size || item.color) && (
                            <p className="text-xs text-gray-500 mt-1">
                              {item.size && `Size: ${item.size}`}
                              {item.size && item.color && ' | '}
                              {item.color && `Color: ${item.color}`}
                            </p>
                          )}
                        </div>
                        <button onClick={() => removeFromCart(item._id)} className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0 p-1">
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        {/* Quantity */}
                        <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                          <button onClick={() => item.quantity <= 1 ? removeFromCart(item._id) : updateQuantity(item._id, item.quantity - 1)}
                            className="w-9 h-9 flex items-center justify-center text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                            <Minus size={14} />
                          </button>
                          <span className="w-10 text-center text-sm font-semibold">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item._id, item.quantity + 1)}
                            disabled={item.quantity >= (product?.stock || 99)}
                            className="w-9 h-9 flex items-center justify-center text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-40">
                            <Plus size={14} />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <p className="font-bold text-gray-900 dark:text-white">
                            ₹{(price * item.quantity).toLocaleString()}
                          </p>
                          {item.quantity > 1 && (
                            <p className="text-xs text-gray-400">₹{price.toLocaleString()} × {item.quantity}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Summary */}
            <div className="lg:w-80 xl:w-96 flex-shrink-0 space-y-4">
              {/* Coupon */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-card">
                <h3 className="font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                  <Tag size={18} className="text-orange-500" /> Apply Coupon
                </h3>
                {cart?.couponCode ? (
                  <div className="flex items-center justify-between bg-green-50 dark:bg-green-900/20 rounded-xl px-3 py-2.5 border border-green-200 dark:border-green-800">
                    <div>
                      <p className="font-bold text-green-700 dark:text-green-400 text-sm">{cart.couponCode}</p>
                      <p className="text-xs text-green-600 dark:text-green-500">Saving ₹{cart.couponDiscount?.toLocaleString()}</p>
                    </div>
                    <button onClick={handleRemoveCoupon} className="text-green-600 hover:text-green-800">
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={e => setCouponInput(e.target.value.toUpperCase())}
                      placeholder="Enter coupon code"
                      className="input-field flex-1 py-2.5 text-sm uppercase"
                      onKeyDown={e => e.key === 'Enter' && handleApplyCoupon()}
                    />
                    <button onClick={handleApplyCoupon} disabled={couponLoading || !couponInput.trim()}
                      className="btn-primary py-2.5 px-4 text-sm">
                      {couponLoading ? '...' : 'Apply'}
                    </button>
                  </div>
                )}
              </div>

              {/* Price Summary */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-card">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4">Order Summary</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-gray-600 dark:text-gray-300">
                    <span>Subtotal ({items.length} items)</span>
                    <span>₹{cart?.subtotal?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 dark:text-gray-300">
                    <span>Delivery</span>
                    <span className={cart?.shippingPrice === 0 ? 'text-green-500 font-medium' : ''}>
                      {cart?.shippingPrice === 0 ? 'FREE' : `₹${cart?.shippingPrice}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600 dark:text-gray-300">
                    <span>Tax (18% GST)</span>
                    <span>₹{cart?.taxPrice?.toLocaleString()}</span>
                  </div>
                  {cart?.discountAmount > 0 && (
                    <div className="flex justify-between text-green-600 dark:text-green-400">
                      <span>Coupon Discount</span>
                      <span>-₹{cart?.discountAmount?.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="border-t border-gray-100 dark:border-gray-800 pt-3 flex justify-between font-bold text-gray-900 dark:text-white text-base">
                    <span>Total Amount</span>
                    <span>₹{cart?.total?.toLocaleString()}</span>
                  </div>
                </div>
                {cart?.shippingPrice === 0 && (
                  <p className="text-xs text-green-600 dark:text-green-400 mt-2">🎉 You saved on delivery!</p>
                )}

                <button onClick={() => navigate('/checkout')} className="btn-primary w-full mt-4 text-base py-3.5">
                  Proceed to Checkout <ArrowRight size={18} />
                </button>

                <Link to="/products" className="flex items-center justify-center gap-2 text-sm text-orange-500 hover:text-orange-600 font-medium mt-3">
                  Continue Shopping
                </Link>
              </div>

              {/* Safe Shopping */}
              <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-4 text-xs text-green-700 dark:text-green-400 text-center">
                🔐 100% Safe & Secure Checkout<br />
                UPI • Cards • Net Banking • COD Available
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, CreditCard, Truck, Check, ChevronRight, Shield, Smartphone } from 'lucide-react';
import useAuthStore from '../store/authStore';
import useCartStore from '../store/cartStore';
import { ordersAPI, paymentsAPI } from '../services/api';
import toast from 'react-hot-toast';

const steps = ['Address', 'Delivery', 'Payment', 'Review'];

const PAYMENT_METHODS = [
  { id: 'razorpay', label: 'Pay Online', desc: 'UPI, Cards, Net Banking, Wallets', icon: '💳' },
  { id: 'cod', label: 'Cash on Delivery', desc: 'Pay when your order arrives', icon: '💵' },
];

const emptyAddress = { name: '', phone: '', addressLine1: '', addressLine2: '', city: '', state: '', pincode: '', type: 'home' };

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { cart, fetchCart, clearCart } = useCartStore();
  const [step, setStep] = useState(0);
  const [shippingAddress, setShippingAddress] = useState(emptyAddress);
  const [useExistingAddress, setUseExistingAddress] = useState(null);
  const [deliveryOption, setDeliveryOption] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchCart(); }, []);

  useEffect(() => {
    const defaultAddr = user?.addresses?.find(a => a.isDefault) || user?.addresses?.[0];
    if (defaultAddr) {
      setUseExistingAddress(defaultAddr._id);
      setShippingAddress(defaultAddr);
    }
  }, [user]);

  const handleAddressSelect = (addr) => {
    setUseExistingAddress(addr._id);
    setShippingAddress(addr);
  };

  const isAddressValid = () => {
    const req = ['name', 'phone', 'addressLine1', 'city', 'state', 'pincode'];
    return req.every(f => shippingAddress[f]?.trim());
  };

  const loadRazorpayScript = () => new Promise(resolve => {
    if (window.Razorpay) return resolve(true);
    const s = document.createElement('script');
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });

  const handlePlaceOrder = async () => {
    if (!isAddressValid()) { toast.error('Please fill all required address fields'); return; }
    setLoading(true);

    try {
      const orderItems = cart.items.map(item => ({
        product: item.product?._id || item.product,
        name: item.name || item.product?.name,
        image: item.image || item.product?.images?.[0] || '',
        brand: item.product?.brand,
        category: item.product?.category,
        quantity: item.quantity,
        price: item.product?.sellingPrice || item.price,
        originalPrice: item.product?.originalPrice,
        size: item.size,
        color: item.color,
      }));

      const orderData = {
        items: orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice: cart.subtotal,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        discountAmount: cart.discountAmount || 0,
        couponCode: cart.couponCode,
        totalPrice: cart.total,
      };

      const orderRes = await ordersAPI.create(orderData);
      const order = orderRes.data.data;

      if (paymentMethod === 'cod') {
        toast.success('Order placed successfully! 🎉');
        navigate(`/order-success/${order._id}`);
        return;
      }

      // Razorpay flow
      const keyRes = await paymentsAPI.getKey();
      const { key, isDemoMode } = keyRes.data;

      if (isDemoMode) {
        // Demo mode - simulate payment
        toast.loading('Processing demo payment...', { id: 'payment' });
        await new Promise(r => setTimeout(r, 2000));
        await paymentsAPI.verify({
          razorpay_order_id: 'demo_order',
          razorpay_payment_id: 'demo_payment',
          razorpay_signature: 'demo_signature',
          orderId: order._id,
        });
        toast.dismiss('payment');
        toast.success('Payment successful! (Demo Mode) 🎉');
        navigate(`/order-success/${order._id}`);
        return;
      }

      // Real Razorpay
      const loaded = await loadRazorpayScript();
      if (!loaded) { toast.error('Failed to load payment gateway'); setLoading(false); return; }

      const rzpOrderRes = await paymentsAPI.createOrder({ amount: cart.total, currency: 'INR', orderId: order._id });

      const options = {
        key,
        amount: rzpOrderRes.data.order.amount,
        currency: 'INR',
        name: 'WORLDKART',
        description: `Order #${order.orderNumber}`,
        order_id: rzpOrderRes.data.order.id,
        prefill: { name: user?.name, email: user?.email, contact: user?.phone },
        theme: { color: '#f97316' },
        handler: async (response) => {
          try {
            await paymentsAPI.verify({ ...response, orderId: order._id });
            toast.success('Payment successful! 🎉');
            navigate(`/order-success/${order._id}`);
          } catch {
            toast.error('Payment verification failed');
          }
        },
        modal: {
          ondismiss: async () => {
            await paymentsAPI.failure({ orderId: order._id, error: 'Payment cancelled by user' });
            toast.error('Payment cancelled');
            setLoading(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    }
    setLoading(false);
  };

  if (!cart || cart.items?.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-xl font-semibold mb-4">Your cart is empty</h2>
          <a href="/products" className="btn-primary">Browse Products</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
      <div className="page-container max-w-6xl">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Checkout</h1>

        {/* Progress Steps */}
        <div className="flex items-center mb-8 overflow-x-auto pb-2">
          {steps.map((s, i) => (
            <React.Fragment key={s}>
              <div className="flex items-center flex-shrink-0 cursor-pointer" onClick={() => i < step && setStep(i)}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                  i < step ? 'bg-green-500 text-white' :
                  i === step ? 'bg-orange-500 text-white' :
                  'bg-gray-200 dark:bg-gray-700 text-gray-500'
                }`}>
                  {i < step ? <Check size={14} /> : i + 1}
                </div>
                <span className={`ml-2 text-sm font-medium hidden sm:block ${i <= step ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>
                  {s}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className={`h-0.5 flex-1 mx-3 transition-colors ${i < step ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Content */}
          <div className="flex-1">
            {/* Step 0: Address */}
            {step === 0 && (
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-card">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <MapPin size={20} className="text-orange-500" /> Delivery Address
                </h2>

                {/* Existing Addresses */}
                {user?.addresses?.length > 0 && (
                  <div className="mb-4 space-y-3">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Saved Addresses</p>
                    {user.addresses.map(addr => (
                      <label key={addr._id} className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-colors ${
                        useExistingAddress === addr._id ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20' : 'border-gray-200 dark:border-gray-700'
                      }`}>
                        <input type="radio" name="address" checked={useExistingAddress === addr._id}
                          onChange={() => handleAddressSelect(addr)} className="accent-orange-500 mt-1" />
                        <div>
                          <p className="font-semibold text-sm text-gray-800 dark:text-gray-200">{addr.name} · {addr.phone}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{addr.addressLine1}{addr.addressLine2 ? ', ' + addr.addressLine2 : ''}, {addr.city}, {addr.state} - {addr.pincode}</p>
                          <span className="badge badge-primary text-xs mt-1 capitalize">{addr.type}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                )}

                {/* New Address Form */}
                <div className="border-t border-gray-100 dark:border-gray-800 pt-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
                    {user?.addresses?.length > 0 ? 'Or enter a new address' : 'Enter delivery address'}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div><label className="label">Full Name *</label><input value={shippingAddress.name} onChange={e => setShippingAddress(p => ({ ...p, name: e.target.value }))} className="input-field" placeholder="Full Name" /></div>
                    <div><label className="label">Phone Number *</label><input value={shippingAddress.phone} onChange={e => setShippingAddress(p => ({ ...p, phone: e.target.value }))} className="input-field" placeholder="10-digit mobile" /></div>
                    <div className="sm:col-span-2"><label className="label">Address Line 1 *</label><input value={shippingAddress.addressLine1} onChange={e => setShippingAddress(p => ({ ...p, addressLine1: e.target.value }))} className="input-field" placeholder="House/Flat no., Building name, Street" /></div>
                    <div className="sm:col-span-2"><label className="label">Address Line 2</label><input value={shippingAddress.addressLine2} onChange={e => setShippingAddress(p => ({ ...p, addressLine2: e.target.value }))} className="input-field" placeholder="Area, Landmark (optional)" /></div>
                    <div><label className="label">City *</label><input value={shippingAddress.city} onChange={e => setShippingAddress(p => ({ ...p, city: e.target.value }))} className="input-field" placeholder="City" /></div>
                    <div><label className="label">State *</label><input value={shippingAddress.state} onChange={e => setShippingAddress(p => ({ ...p, state: e.target.value }))} className="input-field" placeholder="State" /></div>
                    <div><label className="label">PIN Code *</label><input value={shippingAddress.pincode} onChange={e => setShippingAddress(p => ({ ...p, pincode: e.target.value }))} className="input-field" placeholder="6-digit PIN" /></div>
                    <div><label className="label">Address Type</label>
                      <select value={shippingAddress.type} onChange={e => setShippingAddress(p => ({ ...p, type: e.target.value }))} className="input-field">
                        <option value="home">Home</option><option value="work">Work</option><option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>

                <button onClick={() => isAddressValid() ? setStep(1) : toast.error('Please fill all required fields')}
                  className="btn-primary mt-6">
                  Continue to Delivery <ChevronRight size={18} />
                </button>
              </div>
            )}

            {/* Step 1: Delivery */}
            {step === 1 && (
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-card">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Truck size={20} className="text-orange-500" /> Delivery Options
                </h2>
                <div className="space-y-3">
                  {[
                    { id: 'standard', label: 'Standard Delivery', desc: `5-7 business days`, price: cart.shippingPrice === 0 ? 'FREE' : `₹${cart.shippingPrice}`, icon: '📦' },
                    { id: 'express', label: 'Express Delivery', desc: '1-2 business days', price: '₹99', icon: '⚡' },
                  ].map(opt => (
                    <label key={opt.id} className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                      deliveryOption === opt.id ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20' : 'border-gray-200 dark:border-gray-700'
                    }`}>
                      <input type="radio" name="delivery" value={opt.id} checked={deliveryOption === opt.id}
                        onChange={() => setDeliveryOption(opt.id)} className="accent-orange-500" />
                      <span className="text-2xl">{opt.icon}</span>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800 dark:text-gray-200">{opt.label}</p>
                        <p className="text-xs text-gray-500">{opt.desc}</p>
                      </div>
                      <span className={`font-bold text-sm ${opt.price === 'FREE' ? 'text-green-600' : 'text-gray-700 dark:text-gray-300'}`}>{opt.price}</span>
                    </label>
                  ))}
                </div>
                <div className="flex gap-3 mt-6">
                  <button onClick={() => setStep(0)} className="btn-ghost border border-gray-200 dark:border-gray-700">Back</button>
                  <button onClick={() => setStep(2)} className="btn-primary">Continue to Payment <ChevronRight size={18} /></button>
                </div>
              </div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-card">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <CreditCard size={20} className="text-orange-500" /> Payment Method
                </h2>
                <div className="space-y-3">
                  {PAYMENT_METHODS.map(method => (
                    <label key={method.id} className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                      paymentMethod === method.id ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20' : 'border-gray-200 dark:border-gray-700'
                    }`}>
                      <input type="radio" name="payment" value={method.id} checked={paymentMethod === method.id}
                        onChange={() => setPaymentMethod(method.id)} className="accent-orange-500" />
                      <span className="text-2xl">{method.icon}</span>
                      <div>
                        <p className="font-semibold text-gray-800 dark:text-gray-200">{method.label}</p>
                        <p className="text-xs text-gray-500">{method.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-3 mt-4 text-xs text-blue-700 dark:text-blue-300 flex items-center gap-2">
                  <Shield size={14} /> Your payment information is encrypted and secure
                </div>
                <div className="flex gap-3 mt-6">
                  <button onClick={() => setStep(1)} className="btn-ghost border border-gray-200 dark:border-gray-700">Back</button>
                  <button onClick={() => setStep(3)} className="btn-primary">Review Order <ChevronRight size={18} /></button>
                </div>
              </div>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-card">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Order Review</h2>
                
                {/* Items */}
                <div className="space-y-3 mb-4">
                  {cart.items.map(item => (
                    <div key={item._id} className="flex gap-3 py-2 border-b border-gray-50 dark:border-gray-800 last:border-0">
                      <img src={item.product?.images?.[0] || item.image} alt={item.name}
                        className="w-14 h-14 object-cover rounded-lg"
                        onError={e => { e.target.src = 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=200'; }} />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-gray-800 dark:text-gray-200 line-clamp-1">{item.name}</p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity} {item.size ? `| Size: ${item.size}` : ''}</p>
                      </div>
                      <p className="font-bold text-sm text-gray-900 dark:text-white">₹{((item.product?.sellingPrice || item.price) * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                </div>

                {/* Address Summary */}
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 text-sm mb-4">
                  <p className="font-semibold text-gray-700 dark:text-gray-300 mb-1">Delivering to:</p>
                  <p className="text-gray-600 dark:text-gray-400">{shippingAddress.name} · {shippingAddress.phone}</p>
                  <p className="text-gray-500">{shippingAddress.addressLine1}, {shippingAddress.city}, {shippingAddress.state} - {shippingAddress.pincode}</p>
                </div>

                <div className="flex gap-3 mt-6">
                  <button onClick={() => setStep(2)} className="btn-ghost border border-gray-200 dark:border-gray-700">Back</button>
                  <button onClick={handlePlaceOrder} disabled={loading} className="btn-primary flex-1">
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Placing Order...
                      </span>
                    ) : (
                      <>Place Order · ₹{cart.total?.toLocaleString()} {paymentMethod === 'cod' ? '(COD)' : ''}</>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:w-72 xl:w-80 flex-shrink-0">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-card sticky top-32">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">Price Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-600 dark:text-gray-300">
                  <span>Subtotal</span><span>₹{cart.subtotal?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-300">
                  <span>Delivery</span>
                  <span className={cart.shippingPrice === 0 ? 'text-green-500 font-medium' : ''}>
                    {cart.shippingPrice === 0 ? 'FREE' : `₹${cart.shippingPrice}`}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-300">
                  <span>GST (18%)</span><span>₹{cart.taxPrice?.toLocaleString()}</span>
                </div>
                {cart.discountAmount > 0 && (
                  <div className="flex justify-between text-green-600"><span>Coupon</span><span>-₹{cart.discountAmount}</span></div>
                )}
                <div className="border-t border-gray-100 dark:border-gray-800 pt-2 flex justify-between font-bold text-gray-900 dark:text-white">
                  <span>Total</span><span>₹{cart.total?.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

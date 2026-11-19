const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  image: { type: String, required: true },
  brand: String,
  category: String,
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  size: String,
  color: String,
  discount: Number
}, { _id: true });

const shippingAddressSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  addressLine1: { type: String, required: true },
  addressLine2: String,
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  country: { type: String, default: 'India' }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderNumber: { type: String, unique: true },
  items: [orderItemSchema],
  shippingAddress: { type: shippingAddressSchema, required: true },
  billingAddress: shippingAddressSchema,
  paymentMethod: {
    type: String,
    enum: ['razorpay', 'cod', 'card', 'upi', 'netbanking', 'wallet'],
    required: true
  },
  paymentResult: {
    razorpay_order_id: String,
    razorpay_payment_id: String,
    razorpay_signature: String,
    status: String,
    update_time: String
  },
  itemsPrice: { type: Number, required: true, default: 0 },
  shippingPrice: { type: Number, required: true, default: 0 },
  taxPrice: { type: Number, required: true, default: 0 },
  discountAmount: { type: Number, default: 0 },
  couponCode: String,
  totalPrice: { type: Number, required: true, default: 0 },
  isPaid: { type: Boolean, default: false },
  paidAt: Date,
  isDelivered: { type: Boolean, default: false },
  deliveredAt: Date,
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'return_requested', 'returned', 'refunded'],
    default: 'pending'
  },
  statusHistory: [{
    status: String,
    timestamp: { type: Date, default: Date.now },
    note: String
  }],
  trackingNumber: String,
  estimatedDelivery: Date,
  deliveryNotes: String,
  cancellationReason: String,
  returnReason: String,
  refundAmount: Number,
  refundedAt: Date
}, { timestamps: true });

// Generate order number
orderSchema.pre('save', function(next) {
  if (!this.orderNumber) {
    this.orderNumber = 'SZ' + Date.now() + Math.random().toString(36).substr(2, 4).toUpperCase();
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);

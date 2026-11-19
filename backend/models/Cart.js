const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1, default: 1 },
  size: String,
  color: String,
  price: Number,
  name: String,
  image: String
}, { _id: true });

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  items: [cartItemSchema],
  couponCode: String,
  couponDiscount: { type: Number, default: 0 }
}, { timestamps: true });

cartSchema.virtual('totalItems').get(function() {
  return this.items.reduce((acc, item) => acc + item.quantity, 0);
});

cartSchema.virtual('subtotal').get(function() {
  return this.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
});

module.exports = mongoose.model('Cart', cartSchema);

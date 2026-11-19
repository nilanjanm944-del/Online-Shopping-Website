const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Coupon code is required'],
    unique: true,
    uppercase: true,
    trim: true
  },
  description: { type: String, required: true },
  discountType: {
    type: String,
    enum: ['percentage', 'fixed'],
    required: true
  },
  discountValue: {
    type: Number,
    required: true,
    min: 0
  },
  minOrderAmount: { type: Number, default: 0 },
  maxDiscountAmount: Number,
  usageLimit: { type: Number, default: null },
  usedCount: { type: Number, default: 0 },
  usedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  validFrom: { type: Date, default: Date.now },
  validUntil: { type: Date, required: true },
  applicableCategories: [String],
  isActive: { type: Boolean, default: true },
  isFirstPurchaseOnly: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Coupon', couponSchema);

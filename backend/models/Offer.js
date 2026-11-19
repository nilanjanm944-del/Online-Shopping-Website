const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  bannerImage: String,
  offerType: {
    type: String,
    enum: ['flash_sale', 'festival', 'clearance', 'bogo', 'seasonal', 'exclusive'],
    required: true
  },
  discountType: {
    type: String,
    enum: ['percentage', 'fixed', 'bogo'],
    default: 'percentage'
  },
  discountValue: { type: Number, default: 0 },
  applicableCategories: [String],
  applicableProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
  priority: { type: Number, default: 0 },
  badgeText: String,
  bgColor: { type: String, default: '#FF4444' }
}, { timestamps: true });

module.exports = mongoose.model('Offer', offerSchema);

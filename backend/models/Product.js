const mongoose = require('mongoose');
const slugify = require('slugify');

const specificationSchema = new mongoose.Schema({
  key: String,
  value: String
}, { _id: false });

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  title: String,
  comment: { type: String, required: true },
  images: [String],
  isVerifiedPurchase: { type: Boolean, default: false },
  helpful: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [200, 'Product name cannot exceed 200 characters']
  },
  slug: { type: String, unique: true },
  brand: {
    type: String,
    required: [true, 'Brand is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'fashion', 'electronics', 'home-kitchen', 'grocery',
      'beauty', 'sports', 'books', 'toys', 'automotive', 'pets'
    ]
  },
  subcategory: { type: String, required: true },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  shortDescription: { type: String, maxlength: 300 },
  images: [{ type: String }],
  originalPrice: {
    type: Number,
    required: [true, 'Original price is required'],
    min: [0, 'Price cannot be negative']
  },
  sellingPrice: {
    type: Number,
    required: [true, 'Selling price is required'],
    min: [0, 'Price cannot be negative']
  },
  discount: { type: Number, default: 0, min: 0, max: 100 },
  stock: { type: Number, required: true, default: 0, min: 0 },
  sold: { type: Number, default: 0 },
  ratings: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  reviews: [reviewSchema],
  specifications: [specificationSchema],
  // Fashion specific
  sizes: [String],
  colors: [{ name: String, hex: String }],
  fabric: String,
  fitType: String,
  // Grocery specific
  weight: String,
  expiryInfo: String,
  // Electronics specific
  modelNumber: String,
  warranty: String,
  // Common
  tags: [String],
  isFeatured: { type: Boolean, default: false },
  isNewArrival: { type: Boolean, default: false },
  isBestSeller: { type: Boolean, default: false },
  isOnSale: { type: Boolean, default: false },
  shippingInfo: {
    freeShipping: { type: Boolean, default: false },
    estimatedDays: { type: Number, default: 5 },
    weight: Number
  },
  seoTitle: String,
  seoDescription: String,
  isActive: { type: Boolean, default: true },
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

// Create slug before saving
productSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true }) + '-' + Date.now();
  }
  // Auto-calculate discount
  if (this.originalPrice > 0) {
    this.discount = Math.round(((this.originalPrice - this.sellingPrice) / this.originalPrice) * 100);
  }
  next();
});

// Calculate average rating
productSchema.methods.calcAverageRatings = async function() {
  if (this.reviews.length === 0) {
    this.ratings = 0;
    this.numReviews = 0;
  } else {
    const avg = this.reviews.reduce((acc, r) => acc + r.rating, 0) / this.reviews.length;
    this.ratings = Math.round(avg * 10) / 10;
    this.numReviews = this.reviews.length;
  }
  await this.save();
};

productSchema.index({ name: 'text', brand: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, subcategory: 1 });
productSchema.index({ sellingPrice: 1 });
productSchema.index({ ratings: -1 });
productSchema.index({ sold: -1 });

module.exports = mongoose.model('Product', productSchema);

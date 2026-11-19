const mongoose = require('mongoose');
const slugify = require('slugify');

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true, maxlength: 200 },
  slug: { type: String, unique: true },
  excerpt: { type: String, maxlength: 500 },
  content: { type: String, required: true },
  featuredImage: { type: String, default: '' },
  category: {
    type: String,
    enum: ['shopping-guide', 'fashion', 'technology', 'product-review', 'buying-guide', 'lifestyle', 'news'],
    default: 'news'
  },
  tags: [String],
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  authorName: String,
  views: { type: Number, default: 0 },
  isPublished: { type: Boolean, default: false },
  publishedAt: Date,
  seoTitle: String,
  seoDescription: String,
  readTime: Number
}, { timestamps: true });

blogSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true }) + '-' + Date.now();
  }
  if (this.content) {
    const words = this.content.replace(/<[^>]*>/g, '').split(' ').length;
    this.readTime = Math.ceil(words / 200);
  }
  next();
});

module.exports = mongoose.model('Blog', blogSchema);

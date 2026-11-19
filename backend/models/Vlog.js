const mongoose = require('mongoose');

const vlogSchema = new mongoose.Schema({
  title: { type: String, required: true, maxlength: 200 },
  description: { type: String, maxlength: 1000 },
  youtubeUrl: { type: String, required: true },
  youtubeId: String,
  thumbnail: String,
  category: {
    type: String,
    enum: ['product-review', 'unboxing', 'fashion', 'technology', 'shopping-tips', 'lifestyle'],
    default: 'product-review'
  },
  tags: [String],
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  authorName: String,
  views: { type: Number, default: 0 },
  duration: String,
  isPublished: { type: Boolean, default: false },
  publishedAt: Date
}, { timestamps: true });

vlogSchema.pre('save', function(next) {
  if (this.youtubeUrl && this.isModified('youtubeUrl')) {
    const match = this.youtubeUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]{11})/);
    if (match) {
      this.youtubeId = match[1];
      if (!this.thumbnail) {
        this.thumbnail = `https://img.youtube.com/vi/${match[1]}/maxresdefault.jpg`;
      }
    }
  }
  next();
});

module.exports = mongoose.model('Vlog', vlogSchema);

const Product = require('../models/Product');

// @desc    Get all products with filters, search, sort, pagination
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res, next) => {
  try {
    const {
      keyword, category, subcategory, brand, minPrice, maxPrice,
      minRating, sort, page = 1, limit = 20, featured, newArrival,
      bestSeller, onSale, inStock
    } = req.query;

    const query = { isActive: true };

    // Text search
    if (keyword) {
      query.$text = { $search: keyword };
    }

    // Filters
    if (category) query.category = category;
    if (subcategory) query.subcategory = { $in: subcategory.split(',') };
    if (brand) query.brand = { $in: brand.split(',') };
    if (minPrice || maxPrice) {
      query.sellingPrice = {};
      if (minPrice) query.sellingPrice.$gte = Number(minPrice);
      if (maxPrice) query.sellingPrice.$lte = Number(maxPrice);
    }
    if (minRating) query.ratings = { $gte: Number(minRating) };
    if (featured === 'true') query.isFeatured = true;
    if (newArrival === 'true') query.isNewArrival = true;
    if (bestSeller === 'true') query.isBestSeller = true;
    if (onSale === 'true') query.isOnSale = true;
    if (inStock === 'true') query.stock = { $gt: 0 };

    // Sorting
    let sortObj = { createdAt: -1 };
    if (sort === 'price_asc') sortObj = { sellingPrice: 1 };
    else if (sort === 'price_desc') sortObj = { sellingPrice: -1 };
    else if (sort === 'rating') sortObj = { ratings: -1 };
    else if (sort === 'popular') sortObj = { sold: -1 };
    else if (sort === 'newest') sortObj = { createdAt: -1 };
    else if (sort === 'discount') sortObj = { discount: -1 };

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      Product.find(query).sort(sortObj).skip(skip).limit(limitNum).select('-reviews'),
      Product.countDocuments(query)
    ]);

    res.json({
      success: true,
      count: products.length,
      total,
      pages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      data: products
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single product by ID or slug
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = async (req, res, next) => {
  try {
    const query = req.params.id.match(/^[0-9a-fA-F]{24}$/)
      ? { _id: req.params.id }
      : { slug: req.params.id };

    const product = await Product.findOne({ ...query, isActive: true })
      .populate('reviews.user', 'name avatar');

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

// @desc    Create product
// @route   POST /api/products
// @access  Admin
exports.createProduct = async (req, res, next) => {
  try {
    req.body.addedBy = req.user._id;
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Admin
exports.updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Admin
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    product.isActive = false;
    await product.save();
    res.json({ success: true, message: 'Product removed' });
  } catch (err) {
    next(err);
  }
};

// @desc    Create product review
// @route   POST /api/products/:id/reviews
// @access  Private
exports.createReview = async (req, res, next) => {
  try {
    const { rating, title, comment } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    const alreadyReviewed = product.reviews.find(r => r.user.toString() === req.user._id.toString());
    if (alreadyReviewed) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this product' });
    }

    product.reviews.push({
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      title,
      comment
    });

    await product.calcAverageRatings();
    res.status(201).json({ success: true, message: 'Review added' });
  } catch (err) {
    next(err);
  }
};

// @desc    Get related products
// @route   GET /api/products/:id/related
// @access  Public
exports.getRelatedProducts = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    const related = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
      isActive: true
    }).limit(8).select('name images sellingPrice originalPrice discount ratings numReviews brand');

    res.json({ success: true, data: related });
  } catch (err) {
    next(err);
  }
};

// @desc    Get featured/trending/new products
// @route   GET /api/products/featured
// @access  Public
exports.getFeaturedProducts = async (req, res, next) => {
  try {
    const [featured, trending, newArrivals, bestSellers, onSale] = await Promise.all([
      Product.find({ isFeatured: true, isActive: true }).limit(10).select('name images sellingPrice originalPrice discount ratings brand category'),
      Product.find({ isActive: true }).sort({ sold: -1 }).limit(12).select('name images sellingPrice originalPrice discount ratings brand category'),
      Product.find({ isNewArrival: true, isActive: true }).sort({ createdAt: -1 }).limit(12).select('name images sellingPrice originalPrice discount ratings brand category'),
      Product.find({ isBestSeller: true, isActive: true }).limit(12).select('name images sellingPrice originalPrice discount ratings brand category'),
      Product.find({ isOnSale: true, isActive: true }).sort({ discount: -1 }).limit(12).select('name images sellingPrice originalPrice discount ratings brand category')
    ]);

    res.json({ success: true, data: { featured, trending, newArrivals, bestSellers, onSale } });
  } catch (err) {
    next(err);
  }
};

// @desc    Add to wishlist
// @route   POST /api/products/:id/wishlist
// @access  Private
exports.toggleWishlist = async (req, res, next) => {
  try {
    const user = req.user;
    const productId = req.params.id;
    const idx = user.wishlist.indexOf(productId);
    if (idx === -1) {
      user.wishlist.push(productId);
    } else {
      user.wishlist.splice(idx, 1);
    }
    await user.save({ validateBeforeSave: false });
    res.json({ success: true, wishlist: user.wishlist, added: idx === -1 });
  } catch (err) {
    next(err);
  }
};

// @desc    Get search suggestions
// @route   GET /api/products/suggestions
// @access  Public
exports.getSuggestions = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q || q.length < 2) return res.json({ success: true, data: [] });

    const products = await Product.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { brand: { $regex: q, $options: 'i' } },
        { tags: { $regex: q, $options: 'i' } }
      ],
      isActive: true
    }).limit(10).select('name brand category images sellingPrice slug');

    res.json({ success: true, data: products });
  } catch (err) {
    next(err);
  }
};

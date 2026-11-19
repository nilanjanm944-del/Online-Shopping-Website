const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');

// @desc    Get cart
// @route   GET /api/cart
// @access  Private
exports.getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id })
      .populate('items.product', 'name images sellingPrice originalPrice stock isActive brand');

    if (!cart) {
      cart = { items: [], couponCode: null, couponDiscount: 0 };
    }

    // Remove inactive or out-of-stock items and recalculate
    if (cart._id) {
      cart.items = cart.items.filter(item => item.product && item.product.isActive);
      await cart.save();
    }

    // Calculate totals
    const subtotal = cart.items.reduce((acc, item) => {
      const price = item.product ? item.product.sellingPrice : item.price;
      return acc + (price * item.quantity);
    }, 0);

    const shippingPrice = subtotal > 499 ? 0 : 49;
    const taxPrice = Math.round(subtotal * 0.18);
    const discountAmount = cart.couponDiscount || 0;
    const total = subtotal + shippingPrice + taxPrice - discountAmount;

    res.json({
      success: true,
      data: {
        _id: cart._id,
        items: cart.items,
        couponCode: cart.couponCode,
        couponDiscount: cart.couponDiscount,
        subtotal,
        shippingPrice,
        taxPrice,
        discountAmount,
        total: Math.max(0, total)
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
exports.addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1, size, color } = req.body;

    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    if (product.stock < quantity) {
      return res.status(400).json({ success: false, message: 'Insufficient stock' });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    const existingItemIndex = cart.items.findIndex(item =>
      item.product.toString() === productId &&
      item.size === size &&
      item.color === color
    );

    if (existingItemIndex >= 0) {
      cart.items[existingItemIndex].quantity += quantity;
      if (cart.items[existingItemIndex].quantity > product.stock) {
        cart.items[existingItemIndex].quantity = product.stock;
      }
    } else {
      cart.items.push({
        product: productId,
        quantity,
        size,
        color,
        price: product.sellingPrice,
        name: product.name,
        image: product.images[0] || ''
      });
    }

    await cart.save();
    await cart.populate('items.product', 'name images sellingPrice originalPrice stock brand');
    res.json({ success: true, message: 'Added to cart', data: cart });
  } catch (err) {
    next(err);
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:itemId
// @access  Private
exports.updateCartItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

    const item = cart.items.id(req.params.itemId);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found in cart' });

    if (quantity <= 0) {
      cart.items.pull(req.params.itemId);
    } else {
      const product = await Product.findById(item.product);
      item.quantity = Math.min(quantity, product ? product.stock : quantity);
    }

    await cart.save();
    res.json({ success: true, message: 'Cart updated', data: cart });
  } catch (err) {
    next(err);
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:itemId
// @access  Private
exports.removeFromCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

    cart.items.pull(req.params.itemId);
    await cart.save();
    res.json({ success: true, message: 'Item removed from cart' });
  } catch (err) {
    next(err);
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
exports.clearCart = async (req, res, next) => {
  try {
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [], couponCode: null, couponDiscount: 0 });
    res.json({ success: true, message: 'Cart cleared' });
  } catch (err) {
    next(err);
  }
};

// @desc    Apply coupon
// @route   POST /api/cart/coupon
// @access  Private
exports.applyCoupon = async (req, res, next) => {
  try {
    const { code } = req.body;
    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });

    if (!coupon) {
      return res.status(400).json({ success: false, message: 'Invalid coupon code' });
    }

    const now = new Date();
    if (now < coupon.validFrom || now > coupon.validUntil) {
      return res.status(400).json({ success: false, message: 'Coupon is expired or not yet active' });
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({ success: false, message: 'Coupon usage limit reached' });
    }

    if (coupon.usedBy.includes(req.user._id)) {
      return res.status(400).json({ success: false, message: 'You have already used this coupon' });
    }

    const cart = await Cart.findOne({ user: req.user._id })
      .populate('items.product', 'sellingPrice');

    if (!cart) return res.status(404).json({ success: false, message: 'Cart is empty' });

    const subtotal = cart.items.reduce((acc, item) => acc + (item.product.sellingPrice * item.quantity), 0);

    if (subtotal < coupon.minOrderAmount) {
      return res.status(400).json({
        success: false,
        message: `Minimum order amount of ₹${coupon.minOrderAmount} required`
      });
    }

    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = (subtotal * coupon.discountValue) / 100;
      if (coupon.maxDiscountAmount) discount = Math.min(discount, coupon.maxDiscountAmount);
    } else {
      discount = coupon.discountValue;
    }

    cart.couponCode = coupon.code;
    cart.couponDiscount = Math.round(discount);
    await cart.save();

    res.json({
      success: true,
      message: `Coupon applied! You save ₹${Math.round(discount)}`,
      discount: Math.round(discount),
      couponCode: coupon.code
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Remove coupon
// @route   DELETE /api/cart/coupon
// @access  Private
exports.removeCoupon = async (req, res, next) => {
  try {
    await Cart.findOneAndUpdate({ user: req.user._id }, { couponCode: null, couponDiscount: 0 });
    res.json({ success: true, message: 'Coupon removed' });
  } catch (err) {
    next(err);
  }
};

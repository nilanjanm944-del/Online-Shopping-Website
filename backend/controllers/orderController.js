const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');

// @desc    Create order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res, next) => {
  try {
    const {
      items, shippingAddress, billingAddress, paymentMethod,
      itemsPrice, shippingPrice, taxPrice, discountAmount,
      couponCode, totalPrice
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No order items' });
    }

    // Validate stock
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product || product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${item.name}`
        });
      }
    }

    const order = await Order.create({
      user: req.user._id,
      items,
      shippingAddress,
      billingAddress: billingAddress || shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      discountAmount: discountAmount || 0,
      couponCode,
      totalPrice,
      status: paymentMethod === 'cod' ? 'confirmed' : 'pending',
      isPaid: false,
      statusHistory: [{ status: paymentMethod === 'cod' ? 'confirmed' : 'pending', note: 'Order created' }]
    });

    // Update stock
    for (const item of items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity, sold: item.quantity }
      });
    }

    // Mark COD as confirmed
    if (paymentMethod === 'cod') {
      order.isPaid = false;
      await order.save();
    }

    // Clear cart
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [], couponCode: null, couponDiscount: 0 });

    // Mark coupon as used
    if (couponCode) {
      await Coupon.findOneAndUpdate(
        { code: couponCode },
        { $inc: { usedCount: 1 }, $push: { usedBy: req.user._id } }
      );
    }

    // Add loyalty points (1 point per ₹10)
    const pointsEarned = Math.floor(totalPrice / 10);
    req.user.loyaltyPoints = (req.user.loyaltyPoints || 0) + pointsEarned;
    await req.user.save({ validateBeforeSave: false });

    res.status(201).json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};

// @desc    Get user orders
// @route   GET /api/orders/my
// @access  Private
exports.getMyOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const query = { user: req.user._id };
    if (status) query.status = status;

    const [orders, total] = await Promise.all([
      Order.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
        .select('-items.product'),
      Order.countDocuments(query)
    ]);

    res.json({ success: true, data: orders, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
exports.getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone');

    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
exports.cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (!['pending', 'confirmed', 'processing'].includes(order.status)) {
      return res.status(400).json({ success: false, message: 'Order cannot be cancelled at this stage' });
    }

    order.status = 'cancelled';
    order.cancellationReason = req.body.reason || 'Cancelled by customer';
    order.statusHistory.push({ status: 'cancelled', note: req.body.reason });

    // Restore stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity, sold: -item.quantity }
      });
    }

    await order.save();
    res.json({ success: true, message: 'Order cancelled', data: order });
  } catch (err) {
    next(err);
  }
};

// @desc    Request return
// @route   PUT /api/orders/:id/return
// @access  Private
exports.requestReturn = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    if (order.status !== 'delivered') {
      return res.status(400).json({ success: false, message: 'Return can only be requested for delivered orders' });
    }
    order.status = 'return_requested';
    order.returnReason = req.body.reason;
    order.statusHistory.push({ status: 'return_requested', note: req.body.reason });
    await order.save();
    res.json({ success: true, message: 'Return request submitted', data: order });
  } catch (err) {
    next(err);
  }
};

// ─── ADMIN ────────────────────────────────────────────────────────────────────

// @desc    Get all orders (admin)
// @route   GET /api/orders
// @access  Admin
exports.getAllOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status, sort = '-createdAt' } = req.query;
    const query = {};
    if (status) query.status = status;

    const [orders, total] = await Promise.all([
      Order.find(query)
        .populate('user', 'name email phone')
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(parseInt(limit)),
      Order.countDocuments(query)
    ]);

    res.json({ success: true, data: orders, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
};

// @desc    Update order status (admin)
// @route   PUT /api/orders/:id/status
// @access  Admin
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status, trackingNumber, note } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    order.status = status;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (status === 'delivered') {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    }
    if (status === 'confirmed' && order.paymentMethod !== 'cod') {
      order.isPaid = true;
      order.paidAt = Date.now();
    }
    order.statusHistory.push({ status, note: note || `Status updated to ${status}` });
    await order.save();
    res.json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};

const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Blog = require('../models/Blog');
const Vlog = require('../models/Vlog');
const Coupon = require('../models/Coupon');
const Offer = require('../models/Offer');

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Admin
exports.getDashboardStats = async (req, res, next) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const [
      totalUsers, totalProducts, totalOrders, revenueResult,
      monthOrders, monthRevenue, lastMonthOrders, lastMonthRevenue,
      recentOrders, topProducts, ordersByStatus
    ] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      Product.countDocuments({ isActive: true }),
      Order.countDocuments(),
      Order.aggregate([
        { $match: { isPaid: true } },
        { $group: { _id: null, total: { $sum: '$totalPrice' } } }
      ]),
      Order.countDocuments({ createdAt: { $gte: startOfMonth } }),
      Order.aggregate([
        { $match: { isPaid: true, createdAt: { $gte: startOfMonth } } },
        { $group: { _id: null, total: { $sum: '$totalPrice' } } }
      ]),
      Order.countDocuments({ createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } }),
      Order.aggregate([
        { $match: { isPaid: true, createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } } },
        { $group: { _id: null, total: { $sum: '$totalPrice' } } }
      ]),
      Order.find().sort({ createdAt: -1 }).limit(5).populate('user', 'name email'),
      Product.find({ isActive: true }).sort({ sold: -1 }).limit(5).select('name sold sellingPrice images'),
      Order.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ])
    ]);

    // Sales chart (last 7 days)
    const salesChart = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
          isPaid: true
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          revenue: { $sum: '$totalPrice' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue: revenueResult[0]?.total || 0,
        monthOrders,
        monthRevenue: monthRevenue[0]?.total || 0,
        lastMonthOrders,
        lastMonthRevenue: lastMonthRevenue[0]?.total || 0,
        recentOrders,
        topProducts,
        ordersByStatus,
        salesChart
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all users (admin)
// @route   GET /api/admin/users
// @access  Admin
exports.getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, role, search } = req.query;
    const query = {};
    if (role) query.role = role;
    if (search) query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ];

    const [users, total] = await Promise.all([
      User.find(query).sort({ createdAt: -1 }).skip((page-1)*limit).limit(parseInt(limit)).select('-password'),
      User.countDocuments(query)
    ]);

    res.json({ success: true, data: users, total });
  } catch (err) {
    next(err);
  }
};

// @desc    Toggle user active status
// @route   PUT /api/admin/users/:id/toggle
// @access  Admin
exports.toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    user.isActive = !user.isActive;
    await user.save({ validateBeforeSave: false });
    res.json({ success: true, message: `User ${user.isActive ? 'activated' : 'deactivated'}`, isActive: user.isActive });
  } catch (err) {
    next(err);
  }
};

// COUPON MANAGEMENT
exports.getCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json({ success: true, data: coupons });
  } catch (err) { next(err); }
};

exports.createCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.status(201).json({ success: true, data: coupon });
  } catch (err) { next(err); }
};

exports.updateCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!coupon) return res.status(404).json({ success: false, message: 'Coupon not found' });
    res.json({ success: true, data: coupon });
  } catch (err) { next(err); }
};

exports.deleteCoupon = async (req, res, next) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Coupon deleted' });
  } catch (err) { next(err); }
};

// OFFER MANAGEMENT
exports.getOffers = async (req, res, next) => {
  try {
    const offers = await Offer.find().sort({ priority: -1, createdAt: -1 });
    res.json({ success: true, data: offers });
  } catch (err) { next(err); }
};

exports.createOffer = async (req, res, next) => {
  try {
    const offer = await Offer.create(req.body);
    res.status(201).json({ success: true, data: offer });
  } catch (err) { next(err); }
};

exports.updateOffer = async (req, res, next) => {
  try {
    const offer = await Offer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!offer) return res.status(404).json({ success: false, message: 'Offer not found' });
    res.json({ success: true, data: offer });
  } catch (err) { next(err); }
};

exports.deleteOffer = async (req, res, next) => {
  try {
    await Offer.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Offer deleted' });
  } catch (err) { next(err); }
};

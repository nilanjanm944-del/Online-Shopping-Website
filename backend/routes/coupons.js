const express = require('express');
const router = express.Router();
const Coupon = require('../models/Coupon');
const { protect } = require('../middleware/auth');

router.get('/', async (req, res, next) => {
  try {
    const coupons = await Coupon.find({ isActive: true, validUntil: { $gt: new Date() } })
      .select('code description discountType discountValue minOrderAmount validUntil');
    res.json({ success: true, data: coupons });
  } catch (err) { next(err); }
});

module.exports = router;

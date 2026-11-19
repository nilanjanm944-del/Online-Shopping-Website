const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const User = require('../models/User');
const Product = require('../models/Product');

// Get wishlist
router.get('/', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist', 'name images sellingPrice originalPrice discount ratings brand category slug');
    res.json({ success: true, data: user.wishlist });
  } catch (err) { next(err); }
});

module.exports = router;

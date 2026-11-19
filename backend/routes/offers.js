const express = require('express');
const router = express.Router();
const Offer = require('../models/Offer');

router.get('/', async (req, res, next) => {
  try {
    const now = new Date();
    const offers = await Offer.find({
      isActive: true,
      startDate: { $lte: now },
      endDate: { $gte: now }
    }).sort({ priority: -1 });
    res.json({ success: true, data: offers });
  } catch (err) { next(err); }
});

module.exports = router;

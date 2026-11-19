const express = require('express');
const router = express.Router();
const {
  getDashboardStats, getAllUsers, toggleUserStatus,
  getCoupons, createCoupon, updateCoupon, deleteCoupon,
  getOffers, createOffer, updateOffer, deleteOffer
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('admin'));

router.get('/stats', getDashboardStats);

// Users
router.get('/users', getAllUsers);
router.put('/users/:id/toggle', toggleUserStatus);

// Coupons
router.get('/coupons', getCoupons);
router.post('/coupons', createCoupon);
router.put('/coupons/:id', updateCoupon);
router.delete('/coupons/:id', deleteCoupon);

// Offers
router.get('/offers', getOffers);
router.post('/offers', createOffer);
router.put('/offers/:id', updateOffer);
router.delete('/offers/:id', deleteOffer);

module.exports = router;

const express = require('express');
const router = express.Router();
const { getCart, addToCart, updateCartItem, removeFromCart, clearCart, applyCoupon, removeCoupon } = require('../controllers/cartController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.get('/', getCart);
router.post('/', addToCart);
router.post('/coupon', applyCoupon);
router.delete('/coupon', removeCoupon);
router.delete('/', clearCart);
router.put('/:itemId', updateCartItem);
router.delete('/:itemId', removeFromCart);

module.exports = router;

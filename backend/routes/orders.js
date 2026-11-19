const express = require('express');
const router = express.Router();
const {
  createOrder, getMyOrders, getOrder, cancelOrder, requestReturn,
  getAllOrders, updateOrderStatus
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.post('/', createOrder);
router.get('/my', getMyOrders);
router.get('/:id', getOrder);
router.put('/:id/cancel', cancelOrder);
router.put('/:id/return', requestReturn);

// Admin routes
router.get('/', authorize('admin'), getAllOrders);
router.put('/:id/status', authorize('admin'), updateOrderStatus);

module.exports = router;

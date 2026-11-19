const express = require('express');
const router = express.Router();
const { createRazorpayOrder, verifyPayment, paymentFailure, getKey } = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

router.get('/key', getKey);
router.use(protect);
router.post('/create-order', createRazorpayOrder);
router.post('/verify', verifyPayment);
router.post('/failure', paymentFailure);

module.exports = router;

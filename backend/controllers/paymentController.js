const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');

const getRazorpay = () => {
  if (!process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID === 'rzp_test_demo') {
    return null;
  }
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });
};

// @desc    Create Razorpay order
// @route   POST /api/payments/create-order
// @access  Private
exports.createRazorpayOrder = async (req, res, next) => {
  try {
    const { amount, currency = 'INR', orderId } = req.body;
    const razorpay = getRazorpay();

    if (!razorpay) {
      // Demo mode response for development
      return res.json({
        success: true,
        isDemoMode: true,
        order: {
          id: 'order_demo_' + Date.now(),
          amount: amount * 100,
          currency,
          status: 'created'
        },
        key: process.env.RAZORPAY_KEY_ID,
        message: 'Razorpay demo mode - configure real keys for live payments'
      });
    }

    const options = {
      amount: Math.round(amount * 100),
      currency,
      receipt: `receipt_${orderId || Date.now()}`,
      notes: { orderId, userId: req.user._id.toString() }
    };

    const order = await razorpay.orders.create(options);
    res.json({ success: true, order, key: process.env.RAZORPAY_KEY_ID });
  } catch (err) {
    next(err);
  }
};

// @desc    Verify Razorpay payment
// @route   POST /api/payments/verify
// @access  Private
exports.verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    // Demo mode
    if (!process.env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_KEY_SECRET === 'demo_secret') {
      if (orderId) {
        await Order.findByIdAndUpdate(orderId, {
          isPaid: true,
          paidAt: Date.now(),
          status: 'confirmed',
          paymentResult: {
            razorpay_order_id: razorpay_order_id || 'demo_order',
            razorpay_payment_id: razorpay_payment_id || 'demo_payment',
            razorpay_signature: 'demo_signature',
            status: 'paid'
          },
          $push: { statusHistory: { status: 'confirmed', note: 'Payment confirmed (demo mode)' } }
        });
      }
      return res.json({ success: true, message: 'Payment verified (demo mode)' });
    }

    // Actual signature verification
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Payment verification failed - invalid signature' });
    }

    // Update order
    if (orderId) {
      await Order.findByIdAndUpdate(orderId, {
        isPaid: true,
        paidAt: Date.now(),
        status: 'confirmed',
        paymentResult: {
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature,
          status: 'paid',
          update_time: new Date().toISOString()
        },
        $push: { statusHistory: { status: 'confirmed', note: 'Payment verified successfully' } }
      });
    }

    res.json({ success: true, message: 'Payment verified successfully' });
  } catch (err) {
    next(err);
  }
};

// @desc    Handle payment failure
// @route   POST /api/payments/failure
// @access  Private
exports.paymentFailure = async (req, res, next) => {
  try {
    const { orderId, error } = req.body;
    if (orderId) {
      await Order.findByIdAndUpdate(orderId, {
        status: 'pending',
        $push: { statusHistory: { status: 'pending', note: `Payment failed: ${error || 'Unknown error'}` } }
      });
    }
    res.json({ success: true, message: 'Payment failure recorded' });
  } catch (err) {
    next(err);
  }
};

// @desc    Get Razorpay public key
// @route   GET /api/payments/key
// @access  Public
exports.getKey = async (req, res) => {
  res.json({
    success: true,
    key: process.env.RAZORPAY_KEY_ID,
    isDemoMode: !process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID === 'rzp_test_demo'
  });
};

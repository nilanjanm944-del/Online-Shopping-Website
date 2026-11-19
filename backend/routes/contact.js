const express = require('express');
const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    const { name, email, subject, message, phone } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Please provide name, email and message' });
    }
    // In production, send email via nodemailer
    // For now, log and respond
    console.log('Contact form submission:', { name, email, subject, message, phone });
    res.json({ success: true, message: 'Your message has been received. We will respond within 24 hours.' });
  } catch (err) { next(err); }
});

module.exports = router;

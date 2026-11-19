const express = require('express');
const router = express.Router();

// Reviews are handled through product routes
router.get('/', (req, res) => res.json({ success: true, data: [] }));

module.exports = router;

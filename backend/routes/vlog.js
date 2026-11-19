const express = require('express');
const router = express.Router();
const { getVlogs, getVlog, createVlog, updateVlog, deleteVlog } = require('../controllers/vlogController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getVlogs);
router.get('/:id', getVlog);

router.use(protect, authorize('admin'));
router.post('/', createVlog);
router.put('/:id', updateVlog);
router.delete('/:id', deleteVlog);

module.exports = router;

const express = require('express');
const router = express.Router();
const { getBlogs, getBlog, createBlog, updateBlog, deleteBlog } = require('../controllers/blogController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getBlogs);
router.get('/:slug', getBlog);

router.use(protect, authorize('admin'));
router.post('/', createBlog);
router.put('/:id', updateBlog);
router.delete('/:id', deleteBlog);

module.exports = router;

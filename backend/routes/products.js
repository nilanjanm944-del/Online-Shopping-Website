const express = require('express');
const router = express.Router();
const {
  getProducts, getProduct, createProduct, updateProduct, deleteProduct,
  createReview, getRelatedProducts, getFeaturedProducts, toggleWishlist, getSuggestions
} = require('../controllers/productController');
const { protect, authorize, optionalAuth } = require('../middleware/auth');

router.get('/featured', getFeaturedProducts);
router.get('/suggestions', getSuggestions);
router.get('/', getProducts);
router.get('/:id', optionalAuth, getProduct);
router.get('/:id/related', getRelatedProducts);

router.use(protect);
router.post('/:id/reviews', createReview);
router.post('/:id/wishlist', toggleWishlist);

router.use(authorize('admin'));
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;

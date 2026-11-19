import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star, Eye } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import useCartStore from '../../store/cartStore';
import { productsAPI } from '../../services/api';
import toast from 'react-hot-toast';

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=400';

export default function ProductCard({ product, className = '' }) {
  const { isAuthenticated, user } = useAuthStore();
  const { addToCart } = useCartStore();
  const [imgError, setImgError] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(
    user?.wishlist?.includes?.(product._id) || false
  );
  const [addingToCart, setAddingToCart] = useState(false);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) { toast.error('Please login to add items to cart'); return; }
    setAddingToCart(true);
    const result = await addToCart(product._id, 1);
    setAddingToCart(false);
    if (result.success) toast.success('Added to cart! 🛒');
    else toast.error(result.message || 'Failed to add to cart');
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) { toast.error('Please login to add to wishlist'); return; }
    setWishlistLoading(true);
    try {
      const res = await productsAPI.toggleWishlist(product._id);
      setIsWishlisted(res.data.added);
      toast.success(res.data.added ? 'Added to wishlist ❤️' : 'Removed from wishlist');
    } catch { toast.error('Failed to update wishlist'); }
    setWishlistLoading(false);
  };

  const discount = product.discount || Math.round(((product.originalPrice - product.sellingPrice) / product.originalPrice) * 100);

  return (
    <Link
      to={`/products/${product.slug || product._id}`}
      className={`product-card flex flex-col ${className}`}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden bg-gray-50 dark:bg-gray-800 aspect-square zoom-container">
        <img
          src={imgError ? FALLBACK_IMG : (product.images?.[0] || FALLBACK_IMG)}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-400 group-hover:scale-105"
          onError={() => setImgError(true)}
          loading="lazy"
        />

        {/* Discount Badge */}
        {discount > 0 && (
          <span className="discount-badge">
            {discount}% OFF
          </span>
        )}

        {/* Status Badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-1">
          {product.isNewArrival && (
            <span className="bg-blue-500 text-white text-xs font-bold px-2 py-0.5 rounded-lg">NEW</span>
          )}
          {product.isBestSeller && (
            <span className="bg-yellow-500 text-white text-xs font-bold px-2 py-0.5 rounded-lg">BEST SELLER</span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="absolute bottom-3 left-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-2 group-hover:translate-y-0">
          <button
            onClick={handleAddToCart}
            disabled={addingToCart || product.stock === 0}
            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-1 disabled:opacity-60"
          >
            <ShoppingCart size={14} />
            {product.stock === 0 ? 'Out of Stock' : addingToCart ? '...' : 'Add to Cart'}
          </button>
          <button
            onClick={handleWishlist}
            disabled={wishlistLoading}
            className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
              isWishlisted
                ? 'bg-red-500 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-500 hover:bg-red-50 hover:text-red-500'
            }`}
          >
            <Heart size={15} fill={isWishlisted ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Out of Stock Overlay */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white text-gray-800 text-sm font-bold px-3 py-1 rounded-full">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-3 flex flex-col flex-1">
        <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">{product.brand}</p>
        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100 line-clamp-2 mb-2 flex-1">
          {product.name}
        </h3>

        {/* Rating */}
        {product.ratings > 0 && (
          <div className="flex items-center gap-1.5 mb-2">
            <div className="flex items-center gap-0.5 bg-green-50 dark:bg-green-900/20 px-1.5 py-0.5 rounded">
              <Star size={11} fill="#FBBF24" className="text-yellow-400" />
              <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{product.ratings}</span>
            </div>
            <span className="text-xs text-gray-400">({product.numReviews?.toLocaleString()})</span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-gray-900 dark:text-white">
            ₹{product.sellingPrice?.toLocaleString()}
          </span>
          {product.originalPrice > product.sellingPrice && (
            <span className="text-sm text-gray-400 line-through">
              ₹{product.originalPrice?.toLocaleString()}
            </span>
          )}
        </div>

        {/* Free Shipping */}
        {product.shippingInfo?.freeShipping && (
          <p className="text-xs text-green-600 dark:text-green-400 mt-1 font-medium">✓ Free Delivery</p>
        )}
      </div>
    </Link>
  );
}

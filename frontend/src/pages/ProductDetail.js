import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Star, ShoppingCart, Heart, Shield, Truck, RotateCcw, 
  ChevronLeft, ChevronRight, ZoomIn, Share2, Minus, Plus,
  Check, AlertCircle, Package, Award
} from 'lucide-react';
import { productsAPI } from '../services/api';
import useAuthStore from '../store/authStore';
import useCartStore from '../store/cartStore';
import ProductCard from '../components/common/ProductCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=600';

function StarRating({ rating, numReviews }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5">
        {[1,2,3,4,5].map(i => (
          <Star key={i} size={16}
            className={i <= Math.round(rating) ? 'text-yellow-400' : 'text-gray-200 dark:text-gray-600'}
            fill={i <= Math.round(rating) ? '#FBBF24' : 'none'}
          />
        ))}
      </div>
      <span className="font-semibold text-sm">{rating}</span>
      {numReviews > 0 && <span className="text-gray-500 text-sm">({numReviews.toLocaleString()} reviews)</span>}
    </div>
  );
}

export default function ProductDetail() {
  const { id } = useParams();
  const { isAuthenticated, user } = useAuthStore();
  const { addToCart } = useCartStore();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [imgError, setImgError] = useState({});

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [prodRes, relRes] = await Promise.all([
          productsAPI.getById(id),
          productsAPI.getRelated(id).catch(() => ({ data: { data: [] } }))
        ]);
        const p = prodRes.data.data;
        setProduct(p);
        setRelated(relRes.data.data);
        setIsWishlisted(user?.wishlist?.includes?.(p._id) || false);
        if (p.sizes?.length > 0) setSelectedSize(p.sizes[0]);
        if (p.colors?.length > 0) setSelectedColor(p.colors[0].name);
      } catch {}
      setLoading(false);
    };
    load();
  }, [id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) { toast.error('Please login to add items to cart'); return; }
    if (product.sizes?.length > 0 && !selectedSize) { toast.error('Please select a size'); return; }
    setAddingToCart(true);
    const result = await addToCart(product._id, quantity, selectedSize, selectedColor);
    setAddingToCart(false);
    if (result.success) toast.success(`${product.name} added to cart! 🛒`);
    else toast.error(result.message);
  };

  const handleWishlist = async () => {
    if (!isAuthenticated) { toast.error('Please login first'); return; }
    try {
      const res = await productsAPI.toggleWishlist(product._id);
      setIsWishlisted(res.data.added);
      toast.success(res.data.added ? 'Added to wishlist ❤️' : 'Removed from wishlist');
    } catch { toast.error('Failed to update wishlist'); }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) { toast.error('Please login to submit a review'); return; }
    setSubmittingReview(true);
    try {
      await productsAPI.createReview(product._id, reviewForm);
      toast.success('Review submitted successfully!');
      setReviewForm({ rating: 5, title: '', comment: '' });
      // Reload product to show new review
      const res = await productsAPI.getById(id);
      setProduct(res.data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    }
    setSubmittingReview(false);
  };

  if (loading) return <LoadingSpinner fullPage />;
  if (!product) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="text-6xl mb-4">❌</div>
      <h2 className="text-xl font-semibold">Product not found</h2>
      <Link to="/products" className="btn-primary mt-4">Browse Products</Link>
    </div>
  );

  const discount = product.discount || Math.round(((product.originalPrice - product.sellingPrice) / product.originalPrice) * 100);
  const images = product.images?.length > 0 ? product.images : [FALLBACK_IMG];

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen">
      <div className="page-container py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-orange-500">Home</Link>
          <ChevronRight size={14} />
          <Link to={`/${product.category}`} className="hover:text-orange-500 capitalize">{product.category}</Link>
          <ChevronRight size={14} />
          <span className="text-gray-700 dark:text-gray-300 line-clamp-1">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-card aspect-square zoom-container">
              <img
                src={imgError[selectedImage] ? FALLBACK_IMG : images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-contain"
                onError={() => setImgError(prev => ({ ...prev, [selectedImage]: true }))}
              />
              {discount > 0 && (
                <span className="absolute top-4 left-4 bg-red-500 text-white font-bold text-sm px-3 py-1 rounded-xl">
                  {discount}% OFF
                </span>
              )}
              {/* Image Navigation */}
              {images.length > 1 && (
                <>
                  <button onClick={() => setSelectedImage(prev => (prev - 1 + images.length) % images.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white dark:bg-gray-800 rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors">
                    <ChevronLeft size={18} />
                  </button>
                  <button onClick={() => setSelectedImage(prev => (prev + 1) % images.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white dark:bg-gray-800 rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors">
                    <ChevronRight size={18} />
                  </button>
                </>
              )}
            </div>
            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setSelectedImage(i)}
                    className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-colors ${selectedImage === i ? 'border-orange-500' : 'border-transparent'}`}>
                    <img src={imgError[i] ? FALLBACK_IMG : img} alt="" className="w-full h-full object-cover"
                      onError={() => setImgError(prev => ({ ...prev, [i]: true }))} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-5">
            {/* Brand & Name */}
            <div>
              <Link to={`/products?brand=${product.brand}`} className="text-orange-500 font-semibold text-sm hover:text-orange-600">
                {product.brand}
              </Link>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-1 leading-tight">
                {product.name}
              </h1>
            </div>

            {/* Rating */}
            <StarRating rating={product.ratings} numReviews={product.numReviews} />

            {/* Price */}
            <div className="flex items-center gap-4 py-3 border-y border-gray-100 dark:border-gray-800">
              <span className="text-3xl font-black text-gray-900 dark:text-white">
                ₹{product.sellingPrice?.toLocaleString()}
              </span>
              {product.originalPrice > product.sellingPrice && (
                <>
                  <span className="text-xl text-gray-400 line-through">₹{product.originalPrice?.toLocaleString()}</span>
                  <span className="badge badge-danger text-sm px-3 py-1">Save {discount}%</span>
                </>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              {product.stock > 0 ? (
                <>
                  <Check size={16} className="text-green-500" />
                  <span className="text-green-600 dark:text-green-400 font-medium text-sm">
                    {product.stock <= 10 ? `Only ${product.stock} left in stock!` : 'In Stock'}
                  </span>
                </>
              ) : (
                <>
                  <AlertCircle size={16} className="text-red-500" />
                  <span className="text-red-500 font-medium text-sm">Out of Stock</span>
                </>
              )}
            </div>

            {/* Short Description */}
            {product.shortDescription && (
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{product.shortDescription}</p>
            )}

            {/* Size Selector */}
            {product.sizes?.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="label mb-0">Size</label>
                  <button className="text-xs text-orange-500 hover:text-orange-600">Size Chart</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[3rem] px-3 py-2 text-sm font-medium rounded-xl border-2 transition-all ${
                        selectedSize === size
                          ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 text-orange-600'
                          : 'border-gray-200 dark:border-gray-700 hover:border-orange-300'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selector */}
            {product.colors?.length > 0 && (
              <div>
                <label className="label">Color: <span className="font-normal text-gray-600 dark:text-gray-400">{selectedColor}</span></label>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map(color => (
                    <button
                      key={color.name}
                      title={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={`relative w-9 h-9 rounded-full border-2 transition-all ${
                        selectedColor === color.name ? 'border-orange-500 scale-110' : 'border-transparent hover:scale-105'
                      }`}
                      style={{ backgroundColor: color.hex || '#ccc' }}
                    >
                      {selectedColor === color.name && (
                        <Check size={12} className="absolute inset-0 m-auto text-white drop-shadow" strokeWidth={3} />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <label className="label">Quantity</label>
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-11 h-11 flex items-center justify-center text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <Minus size={16} />
                  </button>
                  <span className="w-12 text-center font-semibold">{quantity}</span>
                  <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                    disabled={quantity >= product.stock}
                    className="w-11 h-11 flex items-center justify-center text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-40">
                    <Plus size={16} />
                  </button>
                </div>
                <span className="text-xs text-gray-400">{product.stock} available</span>
              </div>
            </div>

            {/* Add to Cart & Wishlist */}
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0 || addingToCart}
                className="btn-primary flex-1 text-base py-3.5 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <ShoppingCart size={20} />
                {product.stock === 0 ? 'Out of Stock' : addingToCart ? 'Adding...' : 'Add to Cart'}
              </button>
              <button
                onClick={handleWishlist}
                className={`w-14 h-14 rounded-xl border-2 flex items-center justify-center transition-all ${
                  isWishlisted
                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-500'
                    : 'border-gray-200 dark:border-gray-700 text-gray-500 hover:border-red-300 hover:text-red-400'
                }`}
              >
                <Heart size={22} fill={isWishlisted ? 'currentColor' : 'none'} />
              </button>
              <button className="w-14 h-14 rounded-xl border-2 border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500 hover:border-gray-400 transition-colors">
                <Share2 size={20} />
              </button>
            </div>

            {/* Delivery Info */}
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4 space-y-3">
              <div className="flex items-start gap-3">
                <Truck size={18} className="text-orange-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm text-gray-800 dark:text-gray-200">
                    {product.shippingInfo?.freeShipping ? 'Free Delivery' : 'Delivery: ₹49'}
                  </p>
                  <p className="text-xs text-gray-500">Estimated delivery in {product.shippingInfo?.estimatedDays || 5} days</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <RotateCcw size={18} className="text-orange-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm text-gray-800 dark:text-gray-200">7-Day Easy Returns</p>
                  <p className="text-xs text-gray-500">Return or exchange within 7 days of delivery</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Shield size={18} className="text-orange-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm text-gray-800 dark:text-gray-200">Genuine Product Guarantee</p>
                  <p className="text-xs text-gray-500">{product.warranty || 'Warranty as per brand policy'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs: Description, Specs, Reviews */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-card mb-10">
          <div className="flex border-b border-gray-100 dark:border-gray-800 overflow-x-auto">
            {[
              { id: 'description', label: 'Description' },
              { id: 'specifications', label: 'Specifications' },
              { id: 'reviews', label: `Reviews (${product.numReviews})` },
              { id: 'write-review', label: 'Write a Review' },
            ].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 text-sm font-semibold whitespace-nowrap transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? 'border-orange-500 text-orange-500'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}>
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === 'description' && (
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{product.description}</p>
                {product.fabric && <p className="mt-3 text-gray-600 dark:text-gray-300"><strong>Fabric:</strong> {product.fabric}</p>}
                {product.fitType && <p className="mt-1 text-gray-600 dark:text-gray-300"><strong>Fit:</strong> {product.fitType}</p>}
                {product.weight && <p className="mt-1 text-gray-600 dark:text-gray-300"><strong>Weight:</strong> {product.weight}</p>}
              </div>
            )}

            {activeTab === 'specifications' && (
              <div>
                {product.specifications?.length > 0 ? (
                  <table className="w-full">
                    <tbody>
                      {product.specifications.map((spec, i) => (
                        <tr key={i} className={i % 2 === 0 ? 'bg-gray-50 dark:bg-gray-800/50' : ''}>
                          <td className="py-3 px-4 font-semibold text-sm text-gray-700 dark:text-gray-300 w-1/3">{spec.key}</td>
                          <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{spec.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-gray-500">No specifications available.</p>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                {product.reviews?.length > 0 ? (
                  <div className="space-y-6">
                    {product.reviews.map((review, i) => (
                      <div key={i} className="border-b border-gray-100 dark:border-gray-800 pb-6 last:border-0">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-orange-600 font-bold">{review.name?.[0]}</span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1">
                              <span className="font-semibold text-sm text-gray-900 dark:text-white">{review.name}</span>
                              {review.isVerifiedPurchase && (
                                <span className="badge badge-success">✓ Verified Purchase</span>
                              )}
                            </div>
                            <div className="flex items-center gap-1 mb-2">
                              {[1,2,3,4,5].map(j => (
                                <Star key={j} size={13} fill={j <= review.rating ? '#FBBF24' : 'none'}
                                  className={j <= review.rating ? 'text-yellow-400' : 'text-gray-300'} />
                              ))}
                            </div>
                            {review.title && <p className="font-semibold text-sm text-gray-800 dark:text-gray-200 mb-1">{review.title}</p>}
                            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{review.comment}</p>
                            <p className="text-xs text-gray-400 mt-2">{new Date(review.createdAt).toLocaleDateString('en-IN')}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-3">⭐</div>
                    <p className="text-gray-500">No reviews yet. Be the first to review!</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'write-review' && (
              <div className="max-w-xl">
                {!isAuthenticated ? (
                  <div className="text-center py-6">
                    <p className="text-gray-500 mb-4">Please login to write a review</p>
                    <Link to="/login" className="btn-primary">Login to Review</Link>
                  </div>
                ) : (
                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    <div>
                      <label className="label">Rating</label>
                      <div className="flex gap-2">
                        {[1,2,3,4,5].map(r => (
                          <button key={r} type="button" onClick={() => setReviewForm(prev => ({ ...prev, rating: r }))}
                            className="p-1">
                            <Star size={28} fill={r <= reviewForm.rating ? '#FBBF24' : 'none'}
                              className={r <= reviewForm.rating ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-300'} />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="label">Review Title</label>
                      <input type="text" value={reviewForm.title}
                        onChange={e => setReviewForm(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Summarize your review" className="input-field" />
                    </div>
                    <div>
                      <label className="label">Your Review</label>
                      <textarea value={reviewForm.comment}
                        onChange={e => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                        placeholder="Share your experience with this product" rows={4} required
                        className="input-field resize-none" />
                    </div>
                    <button type="submit" disabled={submittingReview} className="btn-primary">
                      {submittingReview ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div>
            <h2 className="section-title mb-6">Similar Products</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {related.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

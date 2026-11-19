import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { wishlistAPI, productsAPI } from '../services/api';
import useCartStore from '../store/cartStore';
import toast from 'react-hot-toast';

export default function WishlistPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCartStore();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await wishlistAPI.get();
        setItems(res.data.data);
      } catch {}
      setLoading(false);
    };
    load();
  }, []);

  const handleRemove = async (productId) => {
    try {
      await productsAPI.toggleWishlist(productId);
      setItems(prev => prev.filter(p => p._id !== productId));
      toast.success('Removed from wishlist');
    } catch { toast.error('Failed to remove'); }
  };

  const handleAddToCart = async (product) => {
    const result = await addToCart(product._id, 1);
    if (result.success) toast.success('Added to cart! 🛒');
    else toast.error(result.message);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
      <div className="page-container">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <Heart className="text-red-500" size={24} /> My Wishlist ({items.length})
        </h1>

        {items.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-16 text-center shadow-card">
            <Heart size={56} className="text-gray-200 dark:text-gray-700 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Your wishlist is empty</h3>
            <p className="text-gray-400 mb-6">Save items you love for later</p>
            <Link to="/products" className="btn-primary">Browse Products</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map(product => (
              <div key={product._id} className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-card group">
                <div className="relative overflow-hidden aspect-square bg-gray-50 dark:bg-gray-800">
                  <Link to={`/products/${product.slug || product._id}`}>
                    <img src={product.images?.[0]}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={e => { e.target.src = 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=400'; }}
                      alt={product.name}
                    />
                  </Link>
                  <button onClick={() => handleRemove(product._id)}
                    className="absolute top-3 right-3 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center shadow hover:bg-red-600 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className="p-3">
                  <p className="text-xs text-gray-400">{product.brand}</p>
                  <Link to={`/products/${product.slug || product._id}`} className="font-semibold text-sm text-gray-800 dark:text-gray-100 line-clamp-2 hover:text-orange-500 block">
                    {product.name}
                  </Link>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-bold text-gray-900 dark:text-white">₹{product.sellingPrice?.toLocaleString()}</span>
                    {product.originalPrice > product.sellingPrice && (
                      <span className="text-xs text-gray-400 line-through">₹{product.originalPrice?.toLocaleString()}</span>
                    )}
                  </div>
                  <button onClick={() => handleAddToCart(product)}
                    className="btn-primary w-full mt-3 text-xs py-2 gap-1.5">
                    <ShoppingCart size={14} /> Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

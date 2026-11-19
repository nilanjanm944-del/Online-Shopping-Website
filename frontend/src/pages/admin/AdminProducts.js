import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, Search } from 'lucide-react';
import { productsAPI } from '../../services/api';
import { AdminSidebar } from './AdminDashboard';
import toast from 'react-hot-toast';

const CATEGORIES = ['fashion','electronics','home-kitchen','grocery','beauty','sports','books','toys','automotive','pets'];
const SUBCATEGORIES = {
  fashion: ['t-shirts','shirts','jeans','dresses','sarees','kurtas','footwear','watches','bags','jackets'],
  electronics: ['smartphones','laptops','tablets','smartwatches','headphones','cameras','televisions','gaming','speakers'],
  'home-kitchen': ['refrigerators','washing-machines','microwaves','air-fryers','furniture','cookware','home-decor'],
  grocery: ['fruits','vegetables','rice','spices','dairy','snacks','beverages'],
  beauty: ['skincare','haircare','makeup','perfumes','mens-grooming'],
  sports: ['gym-equipment','sportswear','cricket','football','fitness'],
  books: ['fiction','non-fiction','academic','notebooks'],
  toys: ['educational-toys','soft-toys','baby-clothing','board-games'],
  automotive: ['car-accessories','bike-accessories','helmets'],
  pets: ['pet-food','pet-toys','pet-grooming'],
};

const emptyProduct = {
  name: '', brand: '', category: 'electronics', subcategory: '',
  description: '', shortDescription: '', images: [''],
  originalPrice: '', sellingPrice: '', stock: '',
  sizes: '', colors: '', tags: '',
  isFeatured: false, isNewArrival: false, isBestSeller: false, isOnSale: false,
  shippingInfo: { freeShipping: false, estimatedDays: 5 },
  warranty: '', modelNumber: '', fabric: '',
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyProduct);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await productsAPI.getAll({ limit: 50, sort: 'newest' });
      setProducts(res.data.data);
    } catch {}
    setLoading(false);
  };

  const handleEdit = (product) => {
    setForm({
      ...product,
      sizes: product.sizes?.join(', ') || '',
      colors: product.colors?.map(c => c.name).join(', ') || '',
      tags: product.tags?.join(', ') || '',
      images: product.images?.length > 0 ? product.images : [''],
    });
    setEditingId(product._id);
    setShowForm(true);
    window.scrollTo({ top: 0 });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = {
        ...form,
        sizes: form.sizes ? form.sizes.split(',').map(s => s.trim()).filter(Boolean) : [],
        colors: form.colors ? form.colors.split(',').map(c => ({ name: c.trim(), hex: '#000000' })).filter(c => c.name) : [],
        tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        images: form.images.filter(Boolean),
      };

      if (editingId) {
        await productsAPI.update(editingId, data);
        toast.success('Product updated!');
      } else {
        await productsAPI.create(data);
        toast.success('Product created!');
      }
      setShowForm(false);
      setForm(emptyProduct);
      setEditingId(null);
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save product');
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await productsAPI.delete(id);
      toast.success('Product deleted');
      setProducts(prev => prev.filter(p => p._id !== id));
    } catch { toast.error('Failed to delete product'); }
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.brand.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-6">
      <div className="page-container">
        <div className="flex gap-6">
          <AdminSidebar active="/admin/products" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Products</h1>
              <button onClick={() => { setShowForm(!showForm); setEditingId(null); setForm(emptyProduct); }} className="btn-primary text-sm py-2">
                <Plus size={16} /> Add Product
              </button>
            </div>

            {/* Add/Edit Form */}
            {showForm && (
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-card mb-6">
                <h3 className="font-bold text-gray-800 dark:text-white mb-4">{editingId ? 'Edit Product' : 'Add New Product'}</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="sm:col-span-2"><label className="label text-xs">Product Name *</label><input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required className="input-field py-2 text-sm" /></div>
                    <div><label className="label text-xs">Brand *</label><input value={form.brand} onChange={e => setForm(p => ({ ...p, brand: e.target.value }))} required className="input-field py-2 text-sm" /></div>
                    <div>
                      <label className="label text-xs">Category *</label>
                      <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value, subcategory: '' }))} className="input-field py-2 text-sm">
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="label text-xs">Subcategory *</label>
                      <select value={form.subcategory} onChange={e => setForm(p => ({ ...p, subcategory: e.target.value }))} required className="input-field py-2 text-sm">
                        <option value="">Select...</option>
                        {(SUBCATEGORIES[form.category] || []).map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div><label className="label text-xs">Original Price (₹) *</label><input type="number" value={form.originalPrice} onChange={e => setForm(p => ({ ...p, originalPrice: e.target.value }))} required className="input-field py-2 text-sm" /></div>
                    <div><label className="label text-xs">Selling Price (₹) *</label><input type="number" value={form.sellingPrice} onChange={e => setForm(p => ({ ...p, sellingPrice: e.target.value }))} required className="input-field py-2 text-sm" /></div>
                    <div><label className="label text-xs">Stock *</label><input type="number" value={form.stock} onChange={e => setForm(p => ({ ...p, stock: e.target.value }))} required className="input-field py-2 text-sm" /></div>
                  </div>

                  <div><label className="label text-xs">Short Description</label><input value={form.shortDescription} onChange={e => setForm(p => ({ ...p, shortDescription: e.target.value }))} className="input-field py-2 text-sm" placeholder="Brief product highlight" /></div>
                  <div><label className="label text-xs">Description *</label><textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} required rows={4} className="input-field resize-none text-sm" /></div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div><label className="label text-xs">Image URLs (one per line)</label>
                      <textarea value={form.images?.join('\n')} onChange={e => setForm(p => ({ ...p, images: e.target.value.split('\n') }))} rows={3} className="input-field resize-none text-sm" placeholder="https://example.com/image.jpg" />
                    </div>
                    <div className="space-y-3">
                      <div><label className="label text-xs">Sizes (comma-separated)</label><input value={form.sizes} onChange={e => setForm(p => ({ ...p, sizes: e.target.value }))} className="input-field py-2 text-sm" placeholder="S, M, L, XL" /></div>
                      <div><label className="label text-xs">Colors (comma-separated)</label><input value={form.colors} onChange={e => setForm(p => ({ ...p, colors: e.target.value }))} className="input-field py-2 text-sm" placeholder="Red, Blue, Black" /></div>
                      <div><label className="label text-xs">Tags (comma-separated)</label><input value={form.tags} onChange={e => setForm(p => ({ ...p, tags: e.target.value }))} className="input-field py-2 text-sm" placeholder="smartphone, 5g, apple" /></div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4">
                    {[
                      { key: 'isFeatured', label: 'Featured' },
                      { key: 'isNewArrival', label: 'New Arrival' },
                      { key: 'isBestSeller', label: 'Best Seller' },
                      { key: 'isOnSale', label: 'On Sale' },
                    ].map(({ key, label }) => (
                      <label key={key} className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={!!form[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.checked }))} className="accent-orange-500 w-4 h-4" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
                      </label>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <button type="submit" disabled={saving} className="btn-primary text-sm">{saving ? 'Saving...' : (editingId ? 'Update Product' : 'Add Product')}</button>
                    <button type="button" onClick={() => { setShowForm(false); setEditingId(null); }} className="btn-ghost border border-gray-200 dark:border-gray-700 text-sm">Cancel</button>
                  </div>
                </form>
              </div>
            )}

            {/* Search */}
            <div className="relative mb-4">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." className="input-field pl-9 py-2 text-sm" />
            </div>

            {/* Products Table */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase">Product</th>
                      <th className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase">Category</th>
                      <th className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase">Price</th>
                      <th className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase">Stock</th>
                      <th className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase">Status</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      [...Array(5)].map((_, i) => (
                        <tr key={i} className="border-t border-gray-50 dark:border-gray-800">
                          <td colSpan={6} className="py-4 px-4"><div className="skeleton h-8 rounded" /></td>
                        </tr>
                      ))
                    ) : filtered.map(product => (
                      <tr key={product._id} className="border-t border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img src={product.images?.[0]} alt={product.name}
                              className="w-10 h-10 rounded-lg object-cover"
                              onError={e => { e.target.src = 'https://cdn.pixabay.com/photo/2017/05/11/19/44/fresh-fruits-2305192_1280.jpg'; }} />
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-gray-800 dark:text-gray-200 line-clamp-1">{product.name}</p>
                              <p className="text-xs text-gray-400">{product.brand}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-xs text-gray-500 capitalize">{product.category}</td>
                        <td className="py-3 px-4">
                          <p className="text-sm font-bold text-gray-900 dark:text-white">₹{product.sellingPrice?.toLocaleString()}</p>
                          {product.originalPrice > product.sellingPrice && (
                            <p className="text-xs text-gray-400 line-through">₹{product.originalPrice?.toLocaleString()}</p>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`text-sm font-medium ${product.stock === 0 ? 'text-red-500' : product.stock <= 10 ? 'text-orange-500' : 'text-green-500'}`}>
                            {product.stock}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-1 flex-wrap">
                            {product.isFeatured && <span className="badge badge-primary text-xs">Featured</span>}
                            {product.isBestSeller && <span className="badge bg-yellow-100 text-yellow-700 text-xs">Best Seller</span>}
                            {product.isNewArrival && <span className="badge bg-blue-100 text-blue-700 text-xs">New</span>}
                            {product.isOnSale && <span className="badge badge-danger text-xs">Sale</span>}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => handleEdit(product)} className="p-1.5 text-gray-400 hover:text-orange-500 transition-colors"><Edit size={15} /></button>
                            <button onClick={() => handleDelete(product._id)} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={15} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

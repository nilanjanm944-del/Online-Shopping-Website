import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit } from 'lucide-react';
import { adminAPI } from '../../services/api';
import { AdminSidebar } from './AdminDashboard';
import toast from 'react-hot-toast';

const emptyForm = {
  code: '', description: '', discountType: 'percentage', discountValue: '',
  minOrderAmount: '', maxDiscountAmount: '', usageLimit: '', validUntil: '', isActive: true
};

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    adminAPI.getCoupons().then(res => setCoupons(res.data.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editId) {
        const res = await adminAPI.updateCoupon(editId, form);
        setCoupons(prev => prev.map(c => c._id === editId ? res.data.data : c));
        toast.success('Coupon updated!');
      } else {
        const res = await adminAPI.createCoupon(form);
        setCoupons(prev => [res.data.data, ...prev]);
        toast.success('Coupon created!');
      }
      setShowForm(false); setForm(emptyForm); setEditId(null);
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this coupon?')) return;
    try {
      await adminAPI.deleteCoupon(id);
      setCoupons(prev => prev.filter(c => c._id !== id));
      toast.success('Coupon deleted');
    } catch { toast.error('Failed to delete'); }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-6">
      <div className="page-container">
        <div className="flex gap-6">
          <AdminSidebar active="/admin/coupons" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Coupons</h1>
              <button onClick={() => { setShowForm(!showForm); setEditId(null); setForm(emptyForm); }} className="btn-primary text-sm py-2">
                <Plus size={16} /> Add Coupon
              </button>
            </div>

            {showForm && (
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-card mb-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div><label className="label text-xs">Code *</label><input value={form.code} onChange={e => setForm(p => ({ ...p, code: e.target.value.toUpperCase() }))} required className="input-field py-2 text-sm uppercase" /></div>
                    <div><label className="label text-xs">Discount Type</label>
                      <select value={form.discountType} onChange={e => setForm(p => ({ ...p, discountType: e.target.value }))} className="input-field py-2 text-sm">
                        <option value="percentage">Percentage (%)</option>
                        <option value="fixed">Fixed (₹)</option>
                      </select>
                    </div>
                    <div><label className="label text-xs">Discount Value *</label><input type="number" value={form.discountValue} onChange={e => setForm(p => ({ ...p, discountValue: e.target.value }))} required className="input-field py-2 text-sm" /></div>
                    <div><label className="label text-xs">Min Order (₹)</label><input type="number" value={form.minOrderAmount} onChange={e => setForm(p => ({ ...p, minOrderAmount: e.target.value }))} className="input-field py-2 text-sm" /></div>
                    <div><label className="label text-xs">Max Discount (₹)</label><input type="number" value={form.maxDiscountAmount} onChange={e => setForm(p => ({ ...p, maxDiscountAmount: e.target.value }))} className="input-field py-2 text-sm" /></div>
                    <div><label className="label text-xs">Usage Limit</label><input type="number" value={form.usageLimit} onChange={e => setForm(p => ({ ...p, usageLimit: e.target.value }))} placeholder="Leave empty for unlimited" className="input-field py-2 text-sm" /></div>
                    <div><label className="label text-xs">Valid Until *</label><input type="date" value={form.validUntil} onChange={e => setForm(p => ({ ...p, validUntil: e.target.value }))} required className="input-field py-2 text-sm" /></div>
                    <div className="sm:col-span-2"><label className="label text-xs">Description *</label><input value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} required className="input-field py-2 text-sm" placeholder="Coupon description" /></div>
                  </div>
                  <div className="flex gap-3">
                    <button type="submit" disabled={saving} className="btn-primary text-sm">{saving ? 'Saving...' : (editId ? 'Update' : 'Create Coupon')}</button>
                    <button type="button" onClick={() => setShowForm(false)} className="btn-ghost border border-gray-200 text-sm">Cancel</button>
                  </div>
                </form>
              </div>
            )}

            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-card overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase">Code</th>
                    <th className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase">Discount</th>
                    <th className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase">Used</th>
                    <th className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase">Expires</th>
                    <th className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase">Status</th>
                    <th className="text-right py-3 px-4 text-xs font-bold text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {coupons.map(coupon => (
                    <tr key={coupon._id} className="border-t border-gray-50 dark:border-gray-800">
                      <td className="py-3 px-4"><code className="font-bold text-orange-600 bg-orange-50 dark:bg-orange-900/20 px-2 py-0.5 rounded text-sm">{coupon.code}</code></td>
                      <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-300">{coupon.discountValue}{coupon.discountType === 'percentage' ? '%' : '₹'} off {coupon.minOrderAmount > 0 ? `(min ₹${coupon.minOrderAmount})` : ''}</td>
                      <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{coupon.usedCount}{coupon.usageLimit ? `/${coupon.usageLimit}` : ''}</td>
                      <td className="py-3 px-4 text-xs text-gray-500">{new Date(coupon.validUntil).toLocaleDateString('en-IN')}</td>
                      <td className="py-3 px-4"><span className={`badge text-xs ${coupon.isActive ? 'badge-success' : 'badge-danger'}`}>{coupon.isActive ? 'Active' : 'Inactive'}</span></td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => { setForm({ ...coupon, validUntil: coupon.validUntil?.split('T')[0] }); setEditId(coupon._id); setShowForm(true); }} className="p-1.5 text-gray-400 hover:text-orange-500"><Edit size={14} /></button>
                          <button onClick={() => handleDelete(coupon._id)} className="p-1.5 text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {coupons.length === 0 && !loading && <div className="text-center py-8 text-gray-400">No coupons created yet.</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

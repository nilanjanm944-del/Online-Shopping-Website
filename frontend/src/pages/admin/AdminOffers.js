import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit } from 'lucide-react';
import { adminAPI } from '../../services/api';
import { AdminSidebar } from './AdminDashboard';
import toast from 'react-hot-toast';

const emptyOffer = {
  title: '', description: '', offerType: 'flash_sale', discountType: 'percentage',
  discountValue: '', startDate: '', endDate: '', isActive: true, priority: 0,
  badgeText: '', bgColor: '#FF4444'
};

export default function AdminOffers() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyOffer);
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    adminAPI.getOffers().then(res => setOffers(res.data.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editId) {
        const res = await adminAPI.updateOffer(editId, form);
        setOffers(prev => prev.map(o => o._id === editId ? res.data.data : o));
        toast.success('Offer updated!');
      } else {
        const res = await adminAPI.createOffer(form);
        setOffers(prev => [res.data.data, ...prev]);
        toast.success('Offer created!');
      }
      setShowForm(false); setForm(emptyOffer); setEditId(null);
    } catch (err) { toast.error('Failed to save offer'); }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this offer?')) return;
    try {
      await adminAPI.deleteOffer(id);
      setOffers(prev => prev.filter(o => o._id !== id));
      toast.success('Offer deleted');
    } catch { toast.error('Failed to delete'); }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-6">
      <div className="page-container">
        <div className="flex gap-6">
          <AdminSidebar active="/admin/offers" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Offers & Promotions</h1>
              <button onClick={() => { setShowForm(!showForm); setEditId(null); setForm(emptyOffer); }} className="btn-primary text-sm py-2">
                <Plus size={16} /> Add Offer
              </button>
            </div>

            {showForm && (
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-card mb-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2"><label className="label text-xs">Offer Title *</label><input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} required className="input-field py-2 text-sm" /></div>
                    <div>
                      <label className="label text-xs">Offer Type</label>
                      <select value={form.offerType} onChange={e => setForm(p => ({ ...p, offerType: e.target.value }))} className="input-field py-2 text-sm">
                        {['flash_sale','festival','clearance','bogo','seasonal','exclusive'].map(t => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
                      </select>
                    </div>
                    <div><label className="label text-xs">Discount Type</label>
                      <select value={form.discountType} onChange={e => setForm(p => ({ ...p, discountType: e.target.value }))} className="input-field py-2 text-sm">
                        <option value="percentage">Percentage (%)</option><option value="fixed">Fixed (₹)</option>
                      </select>
                    </div>
                    <div><label className="label text-xs">Discount Value</label><input type="number" value={form.discountValue} onChange={e => setForm(p => ({ ...p, discountValue: e.target.value }))} className="input-field py-2 text-sm" /></div>
                    <div><label className="label text-xs">Badge Text</label><input value={form.badgeText} onChange={e => setForm(p => ({ ...p, badgeText: e.target.value }))} className="input-field py-2 text-sm" placeholder="FLASH SALE" /></div>
                    <div><label className="label text-xs">Start Date *</label><input type="date" value={form.startDate} onChange={e => setForm(p => ({ ...p, startDate: e.target.value }))} required className="input-field py-2 text-sm" /></div>
                    <div><label className="label text-xs">End Date *</label><input type="date" value={form.endDate} onChange={e => setForm(p => ({ ...p, endDate: e.target.value }))} required className="input-field py-2 text-sm" /></div>
                    <div><label className="label text-xs">Priority (higher = more prominent)</label><input type="number" value={form.priority} onChange={e => setForm(p => ({ ...p, priority: e.target.value }))} className="input-field py-2 text-sm" /></div>
                    <div className="sm:col-span-3"><label className="label text-xs">Description</label><textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} className="input-field resize-none text-sm" rows={2} /></div>
                  </div>
                  <div className="flex gap-3">
                    <button type="submit" disabled={saving} className="btn-primary text-sm">{saving ? 'Saving...' : (editId ? 'Update' : 'Create Offer')}</button>
                    <button type="button" onClick={() => setShowForm(false)} className="btn-ghost border border-gray-200 text-sm">Cancel</button>
                  </div>
                </form>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {offers.map(offer => (
                <div key={offer._id} className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-card">
                  <div className="flex items-start justify-between mb-3">
                    <span className="badge" style={{ backgroundColor: offer.bgColor + '20', color: offer.bgColor }}>{offer.badgeText || offer.offerType}</span>
                    <div className="flex gap-1">
                      <button onClick={() => { setForm({ ...offer, startDate: offer.startDate?.split('T')[0], endDate: offer.endDate?.split('T')[0] }); setEditId(offer._id); setShowForm(true); }} className="p-1.5 text-gray-400 hover:text-orange-500"><Edit size={14} /></button>
                      <button onClick={() => handleDelete(offer._id)} className="p-1.5 text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
                    </div>
                  </div>
                  <h3 className="font-bold text-gray-800 dark:text-white text-sm mb-1">{offer.title}</h3>
                  <p className="text-xs text-gray-500 mb-2">{offer.description}</p>
                  <div className="text-xs text-gray-400">
                    <p>{offer.discountValue}{offer.discountType === 'percentage' ? '%' : '₹'} off</p>
                    <p>{new Date(offer.startDate).toLocaleDateString('en-IN')} – {new Date(offer.endDate).toLocaleDateString('en-IN')}</p>
                  </div>
                  <span className={`badge text-xs mt-2 ${offer.isActive ? 'badge-success' : 'badge-danger'}`}>{offer.isActive ? 'Active' : 'Inactive'}</span>
                </div>
              ))}
            </div>
            {offers.length === 0 && !loading && <div className="text-center py-8 text-gray-400">No offers created yet.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { User, Package, Heart, MapPin, Settings, LogOut, Edit2, Plus, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

const TABS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'addresses', label: 'Addresses', icon: MapPin },
  { id: 'orders', label: 'My Orders', icon: Package },
  { id: 'wishlist', label: 'Wishlist', icon: Heart },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, updateUser, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState('profile');
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [addingAddress, setAddingAddress] = useState(false);
  const [addrForm, setAddrForm] = useState({ name: '', phone: '', addressLine1: '', addressLine2: '', city: '', state: '', pincode: '', type: 'home', isDefault: false });

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authAPI.updateProfile(profileForm);
      updateUser(res.data.data);
      setEditingProfile(false);
      toast.success('Profile updated!');
    } catch { toast.error('Failed to update profile'); }
    setLoading(false);
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) { toast.error('Passwords do not match'); return; }
    setLoading(true);
    try {
      await authAPI.updatePassword({ currentPassword: passwordForm.currentPassword, newPassword: passwordForm.newPassword });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      toast.success('Password updated!');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to update password'); }
    setLoading(false);
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authAPI.addAddress(addrForm);
      updateUser({ addresses: res.data.data });
      setAddingAddress(false);
      setAddrForm({ name: '', phone: '', addressLine1: '', addressLine2: '', city: '', state: '', pincode: '', type: 'home', isDefault: false });
      toast.success('Address added!');
    } catch { toast.error('Failed to add address'); }
    setLoading(false);
  };

  const handleDeleteAddress = async (id) => {
    try {
      const res = await authAPI.deleteAddress(id);
      updateUser({ addresses: res.data.data });
      toast.success('Address removed');
    } catch { toast.error('Failed to remove address'); }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
    toast.success('Logged out');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
      <div className="page-container">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="md:w-56 flex-shrink-0">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-card">
              {/* Avatar */}
              <div className="flex flex-col items-center py-4 border-b border-gray-100 dark:border-gray-800 mb-3">
                <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mb-2">
                  <span className="text-2xl font-black text-orange-600">{user?.name?.[0]?.toUpperCase()}</span>
                </div>
                <p className="font-bold text-gray-900 dark:text-white text-sm">{user?.name}</p>
                <p className="text-xs text-gray-400">{user?.email}</p>
                {user?.loyaltyPoints > 0 && (
                  <p className="text-xs text-orange-500 font-medium mt-1">⭐ {user.loyaltyPoints} points</p>
                )}
              </div>
              {TABS.map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors mb-1 ${
                    activeTab === tab.id
                      ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}>
                  <tab.icon size={16} /> {tab.label}
                </button>
              ))}
              <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-gray-800 transition-colors mt-2">
                <LogOut size={16} /> Logout
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            {activeTab === 'profile' && (
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-card">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Profile Information</h2>
                  <button onClick={() => setEditingProfile(!editingProfile)} className="btn-ghost text-sm">
                    <Edit2 size={14} /> {editingProfile ? 'Cancel' : 'Edit'}
                  </button>
                </div>

                {editingProfile ? (
                  <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-md">
                    <div><label className="label">Full Name</label><input value={profileForm.name} onChange={e => setProfileForm(p => ({ ...p, name: e.target.value }))} className="input-field" /></div>
                    <div><label className="label">Phone</label><input value={profileForm.phone} onChange={e => setProfileForm(p => ({ ...p, phone: e.target.value }))} className="input-field" /></div>
                    <button type="submit" disabled={loading} className="btn-primary">{loading ? 'Saving...' : 'Save Changes'}</button>
                  </form>
                ) : (
                  <div className="space-y-3">
                    {[{ label: 'Name', value: user?.name }, { label: 'Email', value: user?.email }, { label: 'Phone', value: user?.phone || 'Not set' }, { label: 'Account Type', value: user?.role === 'admin' ? 'Administrator' : 'Customer' }].map(({ label, value }) => (
                      <div key={label} className="flex gap-4 py-2 border-b border-gray-50 dark:border-gray-800">
                        <span className="w-32 text-sm font-semibold text-gray-500">{label}</span>
                        <span className="text-sm text-gray-800 dark:text-gray-200">{value}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Change Password */}
                <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
                  <h3 className="font-bold text-gray-800 dark:text-white mb-4">Change Password</h3>
                  <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-md">
                    <div><label className="label">Current Password</label><input type="password" value={passwordForm.currentPassword} onChange={e => setPasswordForm(p => ({ ...p, currentPassword: e.target.value }))} className="input-field" /></div>
                    <div><label className="label">New Password</label><input type="password" value={passwordForm.newPassword} onChange={e => setPasswordForm(p => ({ ...p, newPassword: e.target.value }))} className="input-field" /></div>
                    <div><label className="label">Confirm New Password</label><input type="password" value={passwordForm.confirmPassword} onChange={e => setPasswordForm(p => ({ ...p, confirmPassword: e.target.value }))} className="input-field" /></div>
                    <button type="submit" disabled={loading} className="btn-primary">{loading ? 'Updating...' : 'Update Password'}</button>
                  </form>
                </div>
              </div>
            )}

            {activeTab === 'addresses' && (
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-card">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Saved Addresses</h2>
                  <button onClick={() => setAddingAddress(!addingAddress)} className="btn-primary text-sm py-2 px-4">
                    <Plus size={14} /> {addingAddress ? 'Cancel' : 'Add Address'}
                  </button>
                </div>

                {addingAddress && (
                  <form onSubmit={handleAddAddress} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-5 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div><label className="label text-xs">Full Name *</label><input value={addrForm.name} onChange={e => setAddrForm(p => ({ ...p, name: e.target.value }))} required className="input-field py-2 text-sm" /></div>
                      <div><label className="label text-xs">Phone *</label><input value={addrForm.phone} onChange={e => setAddrForm(p => ({ ...p, phone: e.target.value }))} required className="input-field py-2 text-sm" /></div>
                      <div className="col-span-2"><label className="label text-xs">Address Line 1 *</label><input value={addrForm.addressLine1} onChange={e => setAddrForm(p => ({ ...p, addressLine1: e.target.value }))} required className="input-field py-2 text-sm" /></div>
                      <div><label className="label text-xs">City *</label><input value={addrForm.city} onChange={e => setAddrForm(p => ({ ...p, city: e.target.value }))} required className="input-field py-2 text-sm" /></div>
                      <div><label className="label text-xs">State *</label><input value={addrForm.state} onChange={e => setAddrForm(p => ({ ...p, state: e.target.value }))} required className="input-field py-2 text-sm" /></div>
                      <div><label className="label text-xs">PIN Code *</label><input value={addrForm.pincode} onChange={e => setAddrForm(p => ({ ...p, pincode: e.target.value }))} required className="input-field py-2 text-sm" /></div>
                      <div><label className="label text-xs">Type</label>
                        <select value={addrForm.type} onChange={e => setAddrForm(p => ({ ...p, type: e.target.value }))} className="input-field py-2 text-sm">
                          <option value="home">Home</option><option value="work">Work</option><option value="other">Other</option>
                        </select>
                      </div>
                    </div>
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input type="checkbox" checked={addrForm.isDefault} onChange={e => setAddrForm(p => ({ ...p, isDefault: e.target.checked }))} className="accent-orange-500" />
                      Set as default address
                    </label>
                    <button type="submit" disabled={loading} className="btn-primary text-sm py-2">{loading ? 'Saving...' : 'Save Address'}</button>
                  </form>
                )}

                {user?.addresses?.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">No addresses saved yet.</p>
                ) : (
                  <div className="space-y-3">
                    {user?.addresses?.map(addr => (
                      <div key={addr._id} className="border border-gray-100 dark:border-gray-800 rounded-xl p-4 flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold text-sm text-gray-800 dark:text-gray-200">{addr.name}</p>
                            <span className="badge badge-primary text-xs capitalize">{addr.type}</span>
                            {addr.isDefault && <span className="badge badge-success text-xs">Default</span>}
                          </div>
                          <p className="text-xs text-gray-500">{addr.addressLine1}{addr.addressLine2 ? ', ' + addr.addressLine2 : ''}</p>
                          <p className="text-xs text-gray-500">{addr.city}, {addr.state} - {addr.pincode}</p>
                          <p className="text-xs text-gray-500 mt-0.5">📱 {addr.phone}</p>
                        </div>
                        <button onClick={() => handleDeleteAddress(addr._id)} className="text-gray-300 hover:text-red-500 transition-colors p-1">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-card text-center">
                <Package size={48} className="text-gray-200 mx-auto mb-3" />
                <p className="text-gray-500 mb-4">View all your orders in the Orders section</p>
                <Link to="/orders" className="btn-primary">Go to My Orders</Link>
              </div>
            )}

            {activeTab === 'wishlist' && (
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-card text-center">
                <Heart size={48} className="text-gray-200 mx-auto mb-3" />
                <p className="text-gray-500 mb-4">View your saved items in the Wishlist section</p>
                <Link to="/wishlist" className="btn-primary">Go to Wishlist</Link>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-card">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Account Settings</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800">
                    <div>
                      <p className="font-medium text-gray-800 dark:text-gray-200">Email Notifications</p>
                      <p className="text-xs text-gray-400">Receive updates about orders and offers</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:ring-orange-300 rounded-full peer peer-checked:bg-orange-500 transition-colors" />
                    </label>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800">
                    <div>
                      <p className="font-medium text-gray-800 dark:text-gray-200">SMS Alerts</p>
                      <p className="text-xs text-gray-400">Order status updates via SMS</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:ring-orange-300 rounded-full peer peer-checked:bg-orange-500 transition-colors" />
                    </label>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-medium text-red-500">Delete Account</p>
                      <p className="text-xs text-gray-400">Permanently delete your account and data</p>
                    </div>
                    <button className="btn-danger text-xs py-1.5 px-3">Delete</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

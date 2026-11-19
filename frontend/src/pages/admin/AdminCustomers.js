import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { AdminSidebar } from './AdminDashboard';
import toast from 'react-hot-toast';

export default function AdminCustomers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getUsers({ role: 'user' }).then(res => setUsers(res.data.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const toggleUser = async (id) => {
    try {
      const res = await adminAPI.toggleUser(id);
      setUsers(prev => prev.map(u => u._id === id ? { ...u, isActive: res.data.isActive } : u));
      toast.success(`User ${res.data.isActive ? 'activated' : 'deactivated'}`);
    } catch { toast.error('Failed to update user'); }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-6">
      <div className="page-container">
        <div className="flex gap-6">
          <AdminSidebar active="/admin/customers" />
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Customers</h1>
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase">Customer</th>
                      <th className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase">Phone</th>
                      <th className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase">Points</th>
                      <th className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase">Joined</th>
                      <th className="text-right py-3 px-4 text-xs font-bold text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      [...Array(5)].map((_, i) => <tr key={i}><td colSpan={5} className="py-4 px-4"><div className="skeleton h-8 rounded" /></td></tr>)
                    ) : users.map(user => (
                      <tr key={user._id} className="border-t border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-orange-600 font-bold text-sm">{user.name?.[0]}</span>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{user.name}</p>
                              <p className="text-xs text-gray-400">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-300">{user.phone || '—'}</td>
                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-300">{user.loyaltyPoints}</td>
                        <td className="py-3 px-4 text-xs text-gray-500">{new Date(user.createdAt).toLocaleDateString('en-IN')}</td>
                        <td className="py-3 px-4 text-right">
                          <button onClick={() => toggleUser(user._id)}
                            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${user.isActive ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}>
                            {user.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {!loading && users.length === 0 && <div className="text-center py-10 text-gray-400">No customers yet.</div>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

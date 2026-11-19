import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard, Package, ShoppingCart, Users, Tag, Megaphone,
  BookOpen, Video, TrendingUp, TrendingDown, DollarSign, ShoppingBag,
  Eye, Edit, Trash2, Plus
} from 'lucide-react';
import { adminAPI, ordersAPI } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

function AdminSidebar({ active }) {
  const links = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/products', label: 'Products', icon: Package },
    { to: '/admin/orders', label: 'Orders', icon: ShoppingCart },
    { to: '/admin/customers', label: 'Customers', icon: Users },
    { to: '/admin/coupons', label: 'Coupons', icon: Tag },
    { to: '/admin/offers', label: 'Offers', icon: Megaphone },
    { to: '/admin/blog', label: 'Blog', icon: BookOpen },
  ];
  return (
    <div className="w-56 flex-shrink-0 hidden md:block">
      <div className="bg-gray-900 rounded-2xl p-4 sticky top-24">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-2">Admin Panel</p>
        {links.map(link => (
          <Link key={link.to} to={link.to}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium mb-1 transition-colors ${
              active === link.to
                ? 'bg-orange-500 text-white'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}>
            <link.icon size={16} /> {link.label}
          </Link>
        ))}
        <div className="border-t border-gray-700 mt-3 pt-3">
          <Link to="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white">
            ← Back to Store
          </Link>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, trend, color }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-card">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center`}>
          <Icon size={20} />
        </div>
      </div>
      <p className="text-2xl font-black text-gray-900 dark:text-white">{value}</p>
      {trend && (
        <p className={`text-xs mt-1 flex items-center gap-1 ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
          {trend > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {Math.abs(trend)}% from last month
        </p>
      )}
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getStats()
      .then(res => setStats(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-6">
      <div className="page-container">
        <div className="flex gap-6">
          <AdminSidebar active="/admin" />

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
              <span className="badge badge-success">Live</span>
            </div>

            {loading ? <LoadingSpinner fullPage /> : (
              <>
                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  <StatCard title="Total Revenue" value={`₹${(stats?.totalRevenue || 0).toLocaleString()}`} icon={DollarSign} color="bg-green-100 text-green-600" trend={12} />
                  <StatCard title="Total Orders" value={stats?.totalOrders || 0} icon={ShoppingCart} color="bg-blue-100 text-blue-600" trend={8} />
                  <StatCard title="Total Customers" value={stats?.totalUsers || 0} icon={Users} color="bg-purple-100 text-purple-600" trend={15} />
                  <StatCard title="Total Products" value={stats?.totalProducts || 0} icon={Package} color="bg-orange-100 text-orange-600" />
                </div>

                {/* Monthly */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-card">
                    <p className="text-sm text-gray-500 mb-1">This Month Revenue</p>
                    <p className="text-2xl font-black text-gray-900 dark:text-white">₹{(stats?.monthRevenue || 0).toLocaleString()}</p>
                    <p className="text-xs text-gray-400 mt-1">{stats?.monthOrders || 0} orders this month</p>
                  </div>
                  <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-card">
                    <p className="text-sm text-gray-500 mb-1">Last Month Revenue</p>
                    <p className="text-2xl font-black text-gray-900 dark:text-white">₹{(stats?.lastMonthRevenue || 0).toLocaleString()}</p>
                    <p className="text-xs text-gray-400 mt-1">{stats?.lastMonthOrders || 0} orders last month</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Recent Orders */}
                  <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-card">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-gray-800 dark:text-white">Recent Orders</h3>
                      <Link to="/admin/orders" className="text-xs text-orange-500">View All</Link>
                    </div>
                    <div className="space-y-3">
                      {stats?.recentOrders?.map(order => (
                        <div key={order._id} className="flex items-center justify-between py-2 border-b border-gray-50 dark:border-gray-800 last:border-0">
                          <div>
                            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">#{order.orderNumber?.slice(-8)}</p>
                            <p className="text-xs text-gray-400">{order.user?.name} · {new Date(order.createdAt).toLocaleDateString('en-IN')}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-gray-900 dark:text-white">₹{order.totalPrice?.toLocaleString()}</p>
                            <span className={`text-xs font-medium capitalize ${order.status === 'delivered' ? 'text-green-500' : order.status === 'cancelled' ? 'text-red-500' : 'text-orange-500'}`}>
                              {order.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Top Products */}
                  <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-card">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-gray-800 dark:text-white">Best Selling Products</h3>
                      <Link to="/admin/products" className="text-xs text-orange-500">View All</Link>
                    </div>
                    <div className="space-y-3">
                      {stats?.topProducts?.map((product, i) => (
                        <div key={product._id} className="flex items-center gap-3">
                          <span className="text-lg font-black text-gray-300 w-6">#{i+1}</span>
                          <img src={product.images?.[0]} alt={product.name}
                            className="w-10 h-10 rounded-lg object-cover"
                            onError={e => { e.target.src = 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=100'; }} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200 line-clamp-1">{product.name}</p>
                            <p className="text-xs text-gray-400">{product.sold} sold</p>
                          </div>
                          <p className="text-sm font-bold text-gray-900 dark:text-white">₹{product.sellingPrice?.toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export { AdminSidebar };

import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, ShoppingBag } from 'lucide-react';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading } = useAuthStore();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  const redirect = new URLSearchParams(location.search).get('redirect') || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(form.email, form.password);
    if (result.success) {
      toast.success('Welcome back! 🎉');
      navigate(redirect, { replace: true });
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center">
              <span className="text-white font-black text-2xl">S</span>
            </div>
            <span className="text-3xl font-black text-orange-500">WORLDKART</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-4">Welcome back!</h1>
          <p className="text-gray-500 mt-1">Sign in to your account to continue shopping</p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Email Address</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  required placeholder="Enter your email"
                  className="input-field pl-11" autoComplete="email" />
              </div>
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type={showPassword ? 'text' : 'password'} value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  required placeholder="Enter your password"
                  className="input-field pl-11 pr-11" autoComplete="current-password" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="accent-orange-500 w-4 h-4" />
                <span className="text-gray-600 dark:text-gray-400">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-orange-500 hover:text-orange-600 font-medium">
                Forgot password?
              </Link>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full text-base py-3.5">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : 'Sign In'}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-700" />
            </div>
            <div className="relative text-center"><span className="bg-white dark:bg-gray-900 px-3 text-sm text-gray-500">Demo Credentials</span></div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 text-sm space-y-1">
            <p className="font-semibold text-blue-700 dark:text-blue-300">Admin Account:</p>
            <p className="text-blue-600 dark:text-blue-400">Email: admin@worldkart.com</p>
            <p className="text-blue-600 dark:text-blue-400">Password: Admin@123456</p>
          </div>

          <p className="text-center mt-6 text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{' '}
            <Link to={`/register?redirect=${encodeURIComponent(redirect)}`} className="text-orange-500 font-semibold hover:text-orange-600">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

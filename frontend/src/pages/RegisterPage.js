import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Phone } from 'lucide-react';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { register, loading } = useAuthStore();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);

  const redirect = new URLSearchParams(location.search).get('redirect') || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) { toast.error('Passwords do not match'); return; }
    if (form.password.length < 8) { toast.error('Password must be at least 8 characters'); return; }

    const result = await register(form.name, form.email, form.password, form.phone);
    if (result.success) {
      toast.success('Account created successfully! Welcome to WORLDKART 🎉');
      navigate(redirect, { replace: true });
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center">
              <span className="text-white font-black text-2xl">S</span>
            </div>
            <span className="text-3xl font-black text-orange-500">WORLDKART</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-4">Create your account</h1>
          <p className="text-gray-500 mt-1">Join millions of shoppers on WORLDKART</p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Full Name</label>
              <div className="relative">
                <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  required placeholder="Enter your full name" className="input-field pl-11" />
              </div>
            </div>

            <div>
              <label className="label">Email Address</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  required placeholder="Enter your email" className="input-field pl-11" />
              </div>
            </div>

            <div>
              <label className="label">Phone Number <span className="text-gray-400 font-normal">(optional)</span></label>
              <div className="relative">
                <Phone size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="tel" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                  placeholder="10-digit mobile number" className="input-field pl-11" />
              </div>
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type={showPassword ? 'text' : 'password'} value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  required placeholder="Minimum 8 characters" className="input-field pl-11 pr-11" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="label">Confirm Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="password" value={form.confirmPassword}
                  onChange={e => setForm(p => ({ ...p, confirmPassword: e.target.value }))}
                  required placeholder="Re-enter your password" className="input-field pl-11" />
              </div>
            </div>

            <div className="flex items-start gap-2 pt-1">
              <input type="checkbox" id="agree" required className="accent-orange-500 w-4 h-4 mt-0.5 flex-shrink-0" />
              <label htmlFor="agree" className="text-sm text-gray-600 dark:text-gray-400">
                I agree to the{' '}
                <Link to="/terms" className="text-orange-500 hover:underline">Terms of Service</Link>
                {' '}and{' '}
                <Link to="/privacy" className="text-orange-500 hover:underline">Privacy Policy</Link>
              </label>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full text-base py-3.5 mt-2">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : 'Create Account'}
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link to={`/login?redirect=${encodeURIComponent(redirect)}`} className="text-orange-500 font-semibold hover:text-orange-600">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authAPI.forgotPassword(email);
      setSent(true);
      toast.success('Password reset link sent!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send reset email');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-8">
          {sent ? (
            <div className="text-center">
              <div className="text-5xl mb-4">📧</div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Check your email</h2>
              <p className="text-gray-500 text-sm mb-6">We've sent a password reset link to <strong>{email}</strong></p>
              <Link to="/login" className="btn-primary w-full justify-center">Back to Login</Link>
            </div>
          ) : (
            <>
              <Link to="/login" className="flex items-center gap-2 text-gray-500 hover:text-orange-500 text-sm mb-6">
                <ArrowLeft size={16} /> Back to Login
              </Link>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Forgot Password?</h1>
              <p className="text-gray-500 text-sm mb-6">Enter your email address and we'll send you a link to reset your password.</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="label">Email Address</label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                      required placeholder="Enter your email" className="input-field pl-11" />
                  </div>
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full">
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

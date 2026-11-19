import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react';
import { contactAPI } from '../services/api';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await contactAPI.send(form);
      toast.success('Message sent! We\'ll respond within 24 hours.');
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch { toast.error('Failed to send message. Please try again.'); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12">
      <div className="page-container">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-gray-900 dark:text-white">Contact Us</h1>
          <p className="text-gray-500 mt-2">We're here to help! Reach out to our support team.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Info Cards */}
          <div className="space-y-4">
            {[
              { icon: Phone, title: 'Phone Support', lines: ['+91 1800-XXX-XXXX (Toll Free)', 'Mon–Sat: 9AM – 8PM'], color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/30' },
              { icon: Mail, title: 'Email Support', lines: ['support@worldkart.com', 'Response within 24 hours'], color: 'text-green-500 bg-green-50 dark:bg-green-950/30' },
              { icon: MapPin, title: 'Office Address', lines: ['WORLDKART Technologies Pvt Ltd', 'Mumbai, Maharashtra - 400001'], color: 'text-orange-500 bg-orange-50 dark:bg-orange-950/30' },
              { icon: Clock, title: 'Support Hours', lines: ['Monday to Saturday', '9:00 AM – 8:00 PM IST'], color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/30' },
            ].map(({ icon: Icon, title, lines, color }) => (
              <div key={title} className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-card flex items-start gap-4">
                <div className={`w-11 h-11 ${color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <Icon size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 dark:text-white text-sm">{title}</h3>
                  {lines.map(line => <p key={line} className="text-sm text-gray-500 mt-0.5">{line}</p>)}
                </div>
              </div>
            ))}
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-card">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label className="label">Full Name *</label><input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required className="input-field" placeholder="Your name" /></div>
                <div><label className="label">Email *</label><input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required className="input-field" placeholder="Your email" /></div>
                <div><label className="label">Phone</label><input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} className="input-field" placeholder="Mobile number" /></div>
                <div><label className="label">Subject</label><input value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} className="input-field" placeholder="How can we help?" /></div>
              </div>
              <div>
                <label className="label">Message *</label>
                <textarea value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} required rows={5} className="input-field resize-none" placeholder="Describe your issue or query in detail..." />
              </div>
              <button type="submit" disabled={loading} className="btn-primary">
                <Send size={16} /> {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

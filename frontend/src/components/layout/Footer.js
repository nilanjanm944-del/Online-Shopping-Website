import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Youtube, Linkedin, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';

const footerCategories = [
  { title: 'Shop', links: [
    { name: 'Fashion', to: '/fashion' }, { name: 'Electronics', to: '/electronics' },
    { name: 'Home & Kitchen', to: '/home-kitchen' }, { name: 'Grocery', to: '/grocery' },
    { name: 'Beauty', to: '/beauty' }, { name: 'Sports', to: '/sports' },
    { name: 'Books', to: '/books' }, { name: 'Toys', to: '/toys' }
  ]},
  { title: 'Customer Service', links: [
    { name: 'My Account', to: '/profile' }, { name: 'My Orders', to: '/orders' },
    { name: 'Track Order', to: '/orders' }, { name: 'Return & Refund', to: '/refund-policy' },
    { name: 'FAQ', to: '/faq' }, { name: 'Help Center', to: '/faq' },
    { name: 'Contact Us', to: '/contact' }
  ]},
  { title: 'Company', links: [
    { name: 'About Us', to: '/about' }, { name: 'Careers', to: '/about' },
    { name: 'Blog', to: '/blog' }, { name: 'Vlog', to: '/vlog' },
    { name: 'Press', to: '/about' }, { name: 'Affiliate Program', to: '/about' }
  ]},
  { title: 'Policies', links: [
    { name: 'Privacy Policy', to: '/privacy' }, { name: 'Terms & Conditions', to: '/terms' },
    { name: 'Refund Policy', to: '/refund-policy' }, { name: 'Shipping Policy', to: '/shipping-policy' },
    { name: 'Cookie Policy', to: '/privacy' }
  ]}
];

export default function Footer() {
  const [email, setEmail] = React.useState('');
  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) { alert('Thank you for subscribing!'); setEmail(''); }
  };

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Newsletter */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold text-white mb-1">Subscribe to Our Newsletter</h3>
              <p className="text-orange-100">Get exclusive deals, new arrivals and shopping tips.</p>
            </div>
            <form onSubmit={handleSubscribe} className="flex w-full md:w-auto max-w-md gap-2">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
                required
              />
              <button type="submit" className="px-5 py-3 bg-white text-orange-600 font-bold rounded-xl hover:bg-orange-50 transition-colors flex items-center gap-2">
                Subscribe <ArrowRight size={16} />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {/* Brand Column */}
            <div className="col-span-2 md:col-span-3 lg:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 bg-orange-500 rounded-xl flex items-center justify-center">
                  <span className="text-white font-black text-lg">S</span>
                </div>
                <span className="text-2xl font-black text-white">WORLDKART</span>
              </div>
              <p className="text-sm text-gray-400 mb-6 leading-relaxed">
                India's premium multi-category online marketplace. Shop from millions of products across Fashion, Electronics, Grocery, Beauty and more with assured quality and fast delivery.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Phone size={16} className="text-orange-500 flex-shrink-0" />
                  <span>+91 1800-XXX-XXXX (Toll Free)</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Mail size={16} className="text-orange-500 flex-shrink-0" />
                  <span>support@worldkart.com</span>
                </div>
                <div className="flex items-start gap-3 text-sm">
                  <MapPin size={16} className="text-orange-500 flex-shrink-0 mt-0.5" />
                  <span>WORLDKART Technologies Pvt Ltd,<br />Mumbai, Maharashtra - 400001</span>
                </div>
              </div>
              {/* Social Media */}
              <div className="flex items-center gap-3 mt-6">
                {[
                  { icon: Facebook, href: '#', color: 'hover:text-blue-400' },
                  { icon: Instagram, href: '#', color: 'hover:text-pink-400' },
                  { icon: Twitter, href: '#', color: 'hover:text-sky-400' },
                  { icon: Youtube, href: '#', color: 'hover:text-red-400' },
                  { icon: Linkedin, href: '#', color: 'hover:text-blue-500' },
                ].map(({ icon: Icon, href, color }) => (
                  <a key={href + color} href={href} target="_blank" rel="noopener noreferrer" 
                    className={`w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 ${color} transition-colors`}>
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            </div>

            {/* Navigation Columns */}
            {footerCategories.map((col) => (
              <div key={col.title}>
                <h4 className="font-bold text-white mb-4">{col.title}</h4>
                <ul className="space-y-2.5">
                  {col.links.map(link => (
                    <li key={link.name}>
                      <Link to={link.to} className="text-sm text-gray-400 hover:text-orange-400 transition-colors">
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* App Downloads & Payment */}
      <div className="border-t border-gray-800 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-400">We accept:</span>
              <div className="flex items-center gap-2">
                {['Visa', 'Mastercard', 'UPI', 'RuPay', 'Net Banking', 'COD'].map(method => (
                  <span key={method} className="px-2 py-1 bg-gray-800 text-xs text-gray-300 rounded font-medium border border-gray-700">
                    {method}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-400">Secure payment powered by</span>
              <span className="px-3 py-1 bg-blue-900 text-blue-300 text-xs font-bold rounded border border-blue-700">Razorpay</span>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-800 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} WORLDKART Technologies Pvt Ltd. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <Link to="/privacy" className="hover:text-orange-400 transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-orange-400 transition-colors">Terms</Link>
            <Link to="/refund-policy" className="hover:text-orange-400 transition-colors">Refunds</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

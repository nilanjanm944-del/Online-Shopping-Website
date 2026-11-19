import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
  { q: 'How do I place an order?', a: 'Browse products, add to cart, proceed to checkout, select delivery address, choose payment method and confirm your order.' },
  { q: 'What payment methods are accepted?', a: 'We accept UPI, Credit Cards, Debit Cards, Net Banking, Wallets via Razorpay, and Cash on Delivery (COD).' },
  { q: 'When will my order be delivered?', a: 'Standard delivery takes 5-7 business days. Express delivery takes 1-2 days. You will receive tracking info after shipment.' },
  { q: 'How do I return a product?', a: 'You can request a return within 7 days of delivery from your Order Details page. We will arrange a pickup.' },
  { q: 'How long does refund take?', a: 'Refunds are processed within 5-7 business days after successful pickup and quality check.' },
  { q: 'Is my payment information secure?', a: 'Yes. We use Razorpay for secure payment processing. We never store card details on our servers.' },
  { q: 'Can I cancel my order?', a: 'Yes, you can cancel orders in Pending, Confirmed or Processing status from your Order Details page.' },
  { q: 'Do you deliver pan-India?', a: 'Yes, we deliver across India. Free delivery on orders above ₹499.' },
  { q: 'How do I track my order?', a: 'Once shipped, you will receive a tracking number. You can also check status in My Orders section.' },
  { q: 'How do I contact customer support?', a: 'Email: support@worldkart.com | Phone: 1800-XXX-XXXX | Monday to Saturday 9AM - 8PM.' },
];

export default function FAQPage() {
  const [open, setOpen] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12">
      <div className="page-container max-w-3xl">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-gray-900 dark:text-white">Frequently Asked Questions</h1>
          <p className="text-gray-500 mt-2">Find answers to common questions about shopping on WORLDKART.</p>
        </div>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl shadow-card overflow-hidden">
              <button onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left">
                <span className="font-semibold text-gray-800 dark:text-white pr-4">{faq.q}</span>
                {open === i ? <ChevronUp size={18} className="text-orange-500 flex-shrink-0" /> : <ChevronDown size={18} className="text-gray-400 flex-shrink-0" />}
              </button>
              {open === i && (
                <div className="px-5 pb-5">
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="mt-10 text-center bg-orange-50 dark:bg-orange-900/20 rounded-2xl p-6">
          <p className="text-gray-600 dark:text-gray-300 mb-3">Still have questions?</p>
          <a href="/contact" className="btn-primary">Contact Support</a>
        </div>
      </div>
    </div>
  );
}

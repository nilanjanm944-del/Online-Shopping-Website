import React from 'react';

function PolicyPage({ title, children }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12">
      <div className="page-container max-w-3xl">
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-card">
          <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">{title}</h1>
          <p className="text-xs text-gray-400 mb-6">Last updated: January 2024</p>
          <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 leading-relaxed space-y-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export function PrivacyPage() {
  return (
    <PolicyPage title="Privacy Policy">
      <p>WORLDKART ("we", "our", "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information.</p>
      <h3 className="font-bold text-gray-800 dark:text-gray-200 text-lg">Information We Collect</h3>
      <p>We collect information you provide (name, email, address, phone), transaction data, and device information to improve your shopping experience.</p>
      <h3 className="font-bold text-gray-800 dark:text-gray-200 text-lg">How We Use Your Information</h3>
      <p>We use your information to process orders, personalize recommendations, send order updates, and improve our services. We never sell your personal data to third parties.</p>
      <h3 className="font-bold text-gray-800 dark:text-gray-200 text-lg">Payment Security</h3>
      <p>All payments are processed securely via Razorpay. We never store your card details on our servers. All transactions are SSL-encrypted.</p>
      <h3 className="font-bold text-gray-800 dark:text-gray-200 text-lg">Your Rights</h3>
      <p>You have the right to access, update, or delete your personal information at any time from your account settings or by contacting support@worldkart.com.</p>
      <h3 className="font-bold text-gray-800 dark:text-gray-200 text-lg">Contact Us</h3>
      <p>For privacy concerns, email us at privacy@worldkart.com</p>
    </PolicyPage>
  );
}

export function TermsPage() {
  return (
    <PolicyPage title="Terms & Conditions">
      <p>By using WORLDKART, you agree to these Terms and Conditions. Please read them carefully.</p>
      <h3 className="font-bold text-gray-800 dark:text-gray-200 text-lg">Use of Service</h3>
      <p>WORLDKART provides an online marketplace for purchasing products. You must be 18+ or have parental consent to use this platform.</p>
      <h3 className="font-bold text-gray-800 dark:text-gray-200 text-lg">Product Information</h3>
      <p>Products on WORLDKART are provided by verified sellers. We strive for accuracy but cannot guarantee all product information is error-free. Demo products are clearly marked.</p>
      <h3 className="font-bold text-gray-800 dark:text-gray-200 text-lg">Payment</h3>
      <p>All prices are in Indian Rupees (INR) inclusive of taxes. Payments are processed securely via Razorpay.</p>
      <h3 className="font-bold text-gray-800 dark:text-gray-200 text-lg">Limitation of Liability</h3>
      <p>WORLDKART's liability is limited to the value of the product ordered. We are not liable for indirect or consequential damages.</p>
    </PolicyPage>
  );
}

export function RefundPage() {
  return (
    <PolicyPage title="Return & Refund Policy">
      <h3 className="font-bold text-gray-800 dark:text-gray-200 text-lg">7-Day Easy Return</h3>
      <p>You can return most items within 7 days of delivery. Items must be unused, in original packaging with all tags intact.</p>
      <h3 className="font-bold text-gray-800 dark:text-gray-200 text-lg">Non-Returnable Items</h3>
      <p>Grocery items, digital products, customized items, and intimate apparel are non-returnable unless defective.</p>
      <h3 className="font-bold text-gray-800 dark:text-gray-200 text-lg">Refund Timeline</h3>
      <p>Refunds are processed within 5-7 business days after successful pickup and quality check. The amount is credited to your original payment method.</p>
      <h3 className="font-bold text-gray-800 dark:text-gray-200 text-lg">How to Return</h3>
      <p>Go to My Orders → Select Order → Request Return → Choose reason → Submit. Our pickup agent will collect within 2-3 days.</p>
    </PolicyPage>
  );
}

export function ShippingPage() {
  return (
    <PolicyPage title="Shipping Policy">
      <h3 className="font-bold text-gray-800 dark:text-gray-200 text-lg">Delivery Charges</h3>
      <p>Free delivery on orders above ₹499. Standard delivery charge: ₹49. Express delivery: ₹99.</p>
      <h3 className="font-bold text-gray-800 dark:text-gray-200 text-lg">Delivery Timelines</h3>
      <p>Standard: 5-7 business days | Express: 1-2 business days | Remote areas may take longer.</p>
      <h3 className="font-bold text-gray-800 dark:text-gray-200 text-lg">Delivery Areas</h3>
      <p>We deliver across India including all major cities and most pin codes. Enter your pin code during checkout to check serviceability.</p>
      <h3 className="font-bold text-gray-800 dark:text-gray-200 text-lg">Order Tracking</h3>
      <p>Once your order ships, you will receive an SMS/email with the tracking number. Track your order from My Orders section.</p>
    </PolicyPage>
  );
}

export default PrivacyPage;

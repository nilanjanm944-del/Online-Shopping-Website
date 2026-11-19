# WORLDKART - India's Premium Multi-Category E-Commerce Marketplace

![WORLDKART Banner](https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&h=400&fit=crop)

## 🛍️ Overview

WORLDKART is a complete, production-ready multi-category e-commerce marketplace built with the MERN stack (MongoDB, Express.js, React.js, Node.js). It offers a premium shopping experience comparable to Amazon and Flipkart, with unique branding and design.

## ✨ Features

### 🏪 Shopping Experience
- Multi-category marketplace (Fashion, Electronics, Home & Kitchen, Grocery, Beauty, Sports, Books, Toys, Automotive, Pets)
- Advanced search with auto-suggestions
- Product filtering (category, price, rating, brand, discount)
- Sorting (price, popularity, rating, newest, discount)
- Product zoom and gallery
- Recently viewed products
- Product comparison
- Wishlist

### 🛒 Cart & Checkout
- Persistent cart (synced with backend)
- Coupon/promo code support
- Auto-calculated subtotal, tax (18% GST), shipping
- Free delivery on orders above ₹499
- Multi-step checkout (Address → Delivery → Payment → Review)
- Multiple delivery addresses

### 💳 Payment
- **Razorpay** payment gateway (UPI, Cards, Net Banking, Wallets)
- **Cash on Delivery** (COD)
- Secure signature verification
- Demo mode for development without real Razorpay keys

### 👤 Customer Features
- JWT authentication (Register, Login, Forgot/Reset Password)
- Customer profile management
- Order history and tracking
- Return/refund requests
- Loyalty points system
- Referral codes
- Wishlist management
- Address book

### ⚡ Admin Dashboard
- Sales analytics and revenue charts
- Product management (CRUD)
- Order management and status updates
- Customer management
- Coupon/promo code management
- Flash sale and offer management
- Blog & content management

### 📝 Content
- Blog with rich content (Shopping guides, Fashion, Tech)
- Vlog with embedded YouTube videos
- Newsletter subscription
- Customer testimonials

---

## 🛠️ Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js 18, Tailwind CSS, Zustand, Framer Motion |
| Backend | Node.js, Express.js, REST API |
| Database | MongoDB Atlas |
| Auth | JWT, bcrypt |
| Payment | Razorpay (sandbox/live) |
| Image Upload | Local storage (Cloudinary-ready) |
| Email | Nodemailer (Mailtrap/Gmail) |

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:
- [Node.js](https://nodejs.org/) v18+ 
- [npm](https://www.npmjs.com/) v9+
- [MongoDB](https://www.mongodb.com/try/download/community) (local) or [MongoDB Atlas](https://cloud.mongodb.com/) (free tier)

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/yourusername/worldkart.git
cd worldkart
```

2. **Install Backend Dependencies:**
```bash
cd backend
npm install
```

3. **Configure Backend Environment:**
```bash
cp .env.example .env
```
Edit `.env` with your configuration (see [Environment Variables](#environment-variables)).

4. **Install Frontend Dependencies:**
```bash
cd ../frontend
npm install
```

5. **Seed the Database:**
```bash
cd ../backend
npm run seed
```
This creates demo products, admin user, coupons, and offers.

**Default Admin Credentials:**
- Email: `admin@worldkart.com`
- Password: `Admin@123456`

6. **Start the Development Servers:**

Backend (from `/backend` directory):
```bash
npm run dev
```
Backend runs on: `http://localhost:5000`

Frontend (from `/frontend` directory):
```bash
npm start
```
Frontend runs on: `http://localhost:3000`

---

## ⚙️ Environment Variables

Create a `.env` file in the `/backend` directory:

```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB (use MongoDB Atlas free tier)
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/worldkart

# JWT
JWT_SECRET=your_super_secret_key_minimum_32_characters
JWT_EXPIRE=7d

# Email (Mailtrap for dev, Gmail for prod)
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=your_mailtrap_user
SMTP_PASS=your_mailtrap_pass
FROM_EMAIL=noreply@worldkart.com
FROM_NAME=WORLDKART

# Razorpay (Test Keys - get from razorpay.com)
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# Admin Account
ADMIN_EMAIL=admin@worldkart.com
ADMIN_PASSWORD=Admin@123456
```

### Getting Razorpay Test Keys

1. Go to [razorpay.com](https://razorpay.com)
2. Create a free account
3. Navigate to Dashboard → Settings → API Keys
4. Generate Test Mode Keys
5. Copy `Key ID` and `Key Secret` to your `.env`

> **Note:** The app works in **demo mode** without real Razorpay keys — payments are simulated. This is clearly indicated in the UI.

### Getting MongoDB Atlas (Free Tier)

1. Go to [cloud.mongodb.com](https://cloud.mongodb.com)
2. Create a free account
3. Create a free M0 cluster
4. Click Connect → Application → Copy connection string
5. Replace `<username>` and `<password>` in the connection string
6. Add the connection string to your `.env` as `MONGODB_URI`

---

## 🏗️ Project Structure

```
worldkart/
├── backend/
│   ├── controllers/        # Request handlers
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── cartController.js
│   │   ├── orderController.js
│   │   ├── paymentController.js
│   │   ├── adminController.js
│   │   ├── blogController.js
│   │   └── vlogController.js
│   ├── middleware/
│   │   └── auth.js         # JWT auth middleware
│   ├── models/             # Mongoose schemas
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Order.js
│   │   ├── Cart.js
│   │   ├── Coupon.js
│   │   ├── Offer.js
│   │   ├── Blog.js
│   │   └── Vlog.js
│   ├── routes/             # Express routers
│   ├── scripts/
│   │   └── seed.js         # Database seeder
│   ├── uploads/            # Local file uploads
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   └── manifest.json
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/     # Navbar, Footer, AnnouncementBar
│   │   │   └── common/     # ProductCard, LoadingSpinner, etc.
│   │   ├── pages/
│   │   │   ├── admin/      # Admin dashboard pages
│   │   │   ├── stores/     # Category store pages
│   │   │   └── ...         # All other pages (38 total)
│   │   ├── services/
│   │   │   └── api.js      # Axios API service
│   │   ├── store/          # Zustand state management
│   │   │   ├── authStore.js
│   │   │   ├── cartStore.js
│   │   │   └── themeStore.js
│   │   ├── App.js          # Router configuration
│   │   ├── index.js
│   │   └── index.css       # Tailwind + custom styles
│   ├── tailwind.config.js
│   └── package.json
│
├── README.md
└── PROJECT_PROGRESS.md
```

---

## 📱 Pages

| # | Page | Route |
|---|------|-------|
| 1 | Home | `/` |
| 2 | All Products | `/products` |
| 3 | Search Results | `/search` |
| 4 | Fashion Store | `/fashion` |
| 5 | Electronics Store | `/electronics` |
| 6 | Home & Kitchen | `/home-kitchen` |
| 7 | Grocery Store | `/grocery` |
| 8 | Beauty Store | `/beauty` |
| 9 | Sports Store | `/sports` |
| 10 | Books Store | `/books` |
| 11 | Toys Store | `/toys` |
| 12 | Automotive | `/automotive` |
| 13 | Pet Supplies | `/pets` |
| 14 | Product Detail | `/products/:id` |
| 15 | Cart | `/cart` |
| 16 | Wishlist | `/wishlist` |
| 17 | Checkout | `/checkout` |
| 18 | Login | `/login` |
| 19 | Register | `/register` |
| 20 | Forgot Password | `/forgot-password` |
| 21 | Reset Password | `/reset-password/:token` |
| 22 | Profile | `/profile` |
| 23 | My Orders | `/orders` |
| 24 | Order Detail | `/orders/:id` |
| 25 | Order Success | `/order-success/:id` |
| 26 | Deals | `/deals` |
| 27 | Flash Sale | `/flash-sale` |
| 28 | Blog | `/blog` |
| 29 | Blog Detail | `/blog/:slug` |
| 30 | Vlog | `/vlog` |
| 31 | About | `/about` |
| 32 | Contact | `/contact` |
| 33 | FAQ | `/faq` |
| 34 | Privacy Policy | `/privacy` |
| 35 | Terms & Conditions | `/terms` |
| 36 | Refund Policy | `/refund-policy` |
| 37 | Shipping Policy | `/shipping-policy` |
| 38 | Admin Dashboard | `/admin` |

---

## 🚀 Deployment

### Frontend (Vercel - Free)

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repository
3. Set build command: `npm run build`
4. Set output directory: `build`
5. Add environment variable: `REACT_APP_API_URL=https://your-backend.onrender.com/api`

### Backend (Render - Free)

1. Go to [render.com](https://render.com) and create a new Web Service
2. Connect your GitHub repository
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add all environment variables from `.env`

### Alternative Free Platforms

| Platform | Use for | Free Tier |
|----------|---------|-----------|
| Vercel | Frontend | ✅ Generous free tier |
| Render | Backend | ✅ 750 hours/month |
| Railway | Backend + DB | ✅ $5 credit/month |
| MongoDB Atlas | Database | ✅ 512MB M0 cluster |
| Cloudinary | Images | ✅ 25GB storage |

### ⚠️ Important Notes for Production

1. Change `NODE_ENV=production` 
2. Use a strong `JWT_SECRET` (minimum 64 random characters)
3. Configure real Razorpay live keys
4. Set up MongoDB Atlas with IP whitelist
5. Never commit `.env` to Git
6. Enable HTTPS (automatic on Vercel/Render)

---

## 🧪 Testing the Application

### 1. Test Payment Flow (Demo Mode)
Since no real Razorpay keys are configured by default:
1. Add items to cart
2. Proceed to checkout
3. Select "Pay Online"
4. Complete payment with demo simulation

### 2. Test Admin Dashboard
- Login with `admin@worldkart.com` / `Admin@123456`
- Navigate to `/admin`
- Manage products, orders, coupons

### 3. Test Coupons
Available demo coupons:
- `WELCOME10` - 10% off first order
- `WORLDKART20` - 20% off orders above ₹2000
- `FLAT500` - ₹500 off orders above ₹3000

---

## 📦 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication
All protected routes require `Authorization: Bearer <token>` header.

### Key Endpoints

| Method | Endpoint | Access | Description |
|--------|---------|--------|-------------|
| POST | /auth/register | Public | Register user |
| POST | /auth/login | Public | Login |
| GET | /auth/me | Private | Get current user |
| GET | /products | Public | Get all products |
| GET | /products/featured | Public | Get featured products |
| GET | /products/suggestions | Public | Search suggestions |
| POST | /cart | Private | Add to cart |
| GET | /cart | Private | Get cart |
| POST | /orders | Private | Create order |
| POST | /payments/create-order | Private | Create Razorpay order |
| POST | /payments/verify | Private | Verify payment |
| GET | /admin/stats | Admin | Dashboard stats |

---

## 🔐 Security

- JWT tokens with expiry
- bcrypt password hashing (12 rounds)
- Rate limiting (100 requests / 15 minutes)
- MongoDB injection prevention (express-mongo-sanitize)
- Security headers (helmet)
- CORS configured
- Input validation
- Role-based access control (user / admin)
- Payment signature verification

---

## 📝 License

This project is for educational and portfolio purposes. Product images are sourced from [Unsplash](https://unsplash.com) (free license).

---

## 🤝 Contributing

This is a demo project. If you encounter bugs or have suggestions:
1. Fork the repository
2. Create a feature branch
3. Submit a pull request

---

**Built with ❤️ using MERN Stack** | WORLDKART © 2024

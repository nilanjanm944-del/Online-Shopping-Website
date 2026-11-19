require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Use local MongoDB for seeding if MONGODB_URI not set
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/worldkart';

const User = require('../models/User');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');
const Offer = require('../models/Offer');
const Blog = require('../models/Blog');
const Vlog = require('../models/Vlog');

// ─── Product Image URLs ─────────────────────────────────────────────────────────
// Using Pixabay CDN + Pexels — 100% free, no API key required, direct links
const IMG = {
  // Electronics — Pixabay CDN direct links
  iphone15:       'https://cdn.pixabay.com/photo/2022/01/30/16/51/iphone-6981458_1280.jpg',
  samsung_s24:    'https://cdn.pixabay.com/photo/2016/11/29/12/13/samsung-1869465_1280.jpg',
  laptop_macbook: 'https://cdn.pixabay.com/photo/2015/01/08/18/29/entrepreneur-593358_1280.jpg',
  laptop_dell:    'https://cdn.pixabay.com/photo/2016/09/07/11/37/laptop-1653_.jpg',
  headphones:     'https://cdn.pixabay.com/photo/2018/09/17/14/27/headphones-3683983_1280.jpg',
  earphones:      'https://cdn.pixabay.com/photo/2020/10/05/12/26/earphones-5629913_1280.jpg',
  smartwatch:     'https://cdn.pixabay.com/photo/2015/09/02/13/24/apple-watch-919233_1280.jpg',
  camera:         'https://cdn.pixabay.com/photo/2016/11/23/14/45/camera-1853677_1280.jpg',
  tv:             'https://cdn.pixabay.com/photo/2019/11/07/20/48/tv-4609464_1280.jpg',
  speaker:        'https://cdn.pixabay.com/photo/2015/05/25/12/16/sound-783714_1280.jpg',
  tablet:         'https://cdn.pixabay.com/photo/2016/09/20/16/10/woman-1683154_1280.jpg',
  powerbank:      'https://cdn.pixabay.com/photo/2020/07/17/05/00/charger-5412504_1280.jpg',
  // Fashion - Men — Pixabay
  mens_tshirt:    'https://cdn.pixabay.com/photo/2016/11/23/07/32/man-1853115_1280.jpg',
  mens_shirt:     'https://cdn.pixabay.com/photo/2017/08/06/00/35/shirt-2588254_1280.jpg',
  mens_jeans:     'https://cdn.pixabay.com/photo/2015/08/09/08/41/jeans-882951_1280.jpg',
  mens_jacket:    'https://cdn.pixabay.com/photo/2017/11/02/12/13/man-2911437_1280.jpg',
  mens_hoodie:    'https://cdn.pixabay.com/photo/2020/10/14/08/13/hoodie-5654108_1280.jpg',
  mens_formal:    'https://cdn.pixabay.com/photo/2015/07/20/12/57/man-852764_1280.jpg',
  mens_shoes:     'https://cdn.pixabay.com/photo/2016/11/19/15/46/audience-1840037_1280.jpg',
  // Fashion - Women — Pixabay
  womens_dress:   'https://cdn.pixabay.com/photo/2017/08/01/10/16/woman-2563491_1280.jpg',
  womens_kurti:   'https://cdn.pixabay.com/photo/2021/09/08/15/32/girl-6607272_1280.jpg',
  womens_saree:   'https://cdn.pixabay.com/photo/2020/09/18/05/58/indian-5581706_1280.jpg',
  womens_top:     'https://cdn.pixabay.com/photo/2017/01/31/13/14/people-2023191_1280.jpg',
  womens_jeans:   'https://cdn.pixabay.com/photo/2016/03/27/22/00/fashion-1283863_1280.jpg',
  womens_heels:   'https://cdn.pixabay.com/photo/2016/11/18/19/00/feet-1835065_1280.jpg',
  womens_bag:     'https://cdn.pixabay.com/photo/2015/11/19/21/14/glasses-1052010_1280.jpg',
  // Fashion - Kids — Pixabay
  kids_tshirt:    'https://cdn.pixabay.com/photo/2015/09/15/19/11/girl-941232_1280.jpg',
  kids_dress:     'https://cdn.pixabay.com/photo/2017/09/05/10/00/children-2717454_1280.jpg',
  // Watches — Pixabay
  watch_luxury:   'https://cdn.pixabay.com/photo/2016/01/19/17/48/clock-1149631_1280.jpg',
  watch_sport:    'https://cdn.pixabay.com/photo/2017/08/10/02/05/tiles-shapes-2617112_1280.jpg',
  // Home & Kitchen — Pixabay
  refrigerator:   'https://cdn.pixabay.com/photo/2020/09/16/14/14/fridge-5577726_1280.jpg',
  washing_machine:'https://cdn.pixabay.com/photo/2020/06/08/16/39/washing-machine-5274913_1280.jpg',
  microwave:      'https://cdn.pixabay.com/photo/2015/05/14/09/55/microwave-oven-765250_1280.jpg',
  air_fryer:      'https://cdn.pixabay.com/photo/2021/11/18/09/55/air-fryer-6806039_1280.jpg',
  mixer:          'https://cdn.pixabay.com/photo/2015/09/14/13/48/blender-940463_1280.jpg',
  sofa:           'https://cdn.pixabay.com/photo/2017/03/19/01/43/living-room-2155376_1280.jpg',
  cookware:       'https://cdn.pixabay.com/photo/2015/09/16/19/40/kitchen-942621_1280.jpg',
  vacuum:         'https://cdn.pixabay.com/photo/2017/04/05/00/09/vacuum-cleaner-2203526_1280.jpg',
  // Grocery — Pixabay
  fruits:         'https://cdn.pixabay.com/photo/2017/05/11/19/44/fresh-fruits-2305192_1280.jpg',
  vegetables:     'https://cdn.pixabay.com/photo/2017/10/09/19/29/eat-2834549_1280.jpg',
  rice:           'https://cdn.pixabay.com/photo/2019/11/05/09/49/rice-4603993_1280.jpg',
  spices:         'https://cdn.pixabay.com/photo/2015/09/02/13/30/spices-919945_1280.jpg',
  dairy:          'https://cdn.pixabay.com/photo/2017/07/05/15/41/milk-2474993_1280.jpg',
  snacks:         'https://cdn.pixabay.com/photo/2017/04/06/22/09/popcorn-2209951_1280.jpg',
  beverages:      'https://cdn.pixabay.com/photo/2016/08/23/08/53/bottles-1613910_1280.jpg',
  olive_oil:      'https://cdn.pixabay.com/photo/2015/05/31/13/59/oil-791781_1280.jpg',
  // Beauty — Pixabay
  skincare:       'https://cdn.pixabay.com/photo/2020/04/14/10/31/cosmetics-5042016_1280.jpg',
  makeup:         'https://cdn.pixabay.com/photo/2017/11/09/21/41/makeup-brushes-2935366_1280.jpg',
  perfume:        'https://cdn.pixabay.com/photo/2019/09/12/15/18/perfume-4472418_1280.jpg',
  haircare:       'https://cdn.pixabay.com/photo/2016/03/27/19/58/vintage-1283938_1280.jpg',
  // Sports — Pixabay
  gym_equipment:  'https://cdn.pixabay.com/photo/2017/08/07/14/02/man-2604149_1280.jpg',
  cricket:        'https://cdn.pixabay.com/photo/2016/11/23/15/48/audience-1853662_1280.jpg',
  football:       'https://cdn.pixabay.com/photo/2015/11/07/11/13/football-1031498_1280.jpg',
  yoga_mat:       'https://cdn.pixabay.com/photo/2017/08/06/12/06/people-2591874_1280.jpg',
  // Books — Pixabay
  book_fiction:   'https://cdn.pixabay.com/photo/2015/11/19/21/10/glasses-1835157_1280.jpg',
  book_academic:  'https://cdn.pixabay.com/photo/2015/09/05/07/28/writing-923882_1280.jpg',
  notebook:       'https://cdn.pixabay.com/photo/2015/10/04/11/26/notebook-971500_1280.jpg',
  // Toys — Pixabay
  toys_lego:      'https://cdn.pixabay.com/photo/2015/03/08/17/25/lego-664064_1280.jpg',
  toys_soft:      'https://cdn.pixabay.com/photo/2015/11/19/21/14/toy-1052005_1280.jpg',
  toys_board:     'https://cdn.pixabay.com/photo/2016/01/19/18/01/chess-1151305_1280.jpg',
  // Automotive — Pixabay
  car_accessories:'https://cdn.pixabay.com/photo/2015/09/02/13/24/car-923194_1280.jpg',
  helmet:         'https://cdn.pixabay.com/photo/2017/09/01/00/15/png-2702548_1280.png',
  // Pets — Pixabay
  pet_food:       'https://cdn.pixabay.com/photo/2015/11/17/13/13/puppy-1047521_1280.jpg',
  pet_toys:       'https://cdn.pixabay.com/photo/2016/02/19/15/46/dog-1210559_1280.jpg',
};

const products = [
  // ─── ELECTRONICS ─────────────────────────────────────────────────────────────
  {
    name: 'Apple iPhone 15 Pro Max 256GB Natural Titanium',
    brand: 'Apple', category: 'electronics', subcategory: 'smartphones',
    description: 'The iPhone 15 Pro Max features a titanium design with an A17 Pro chip, a 48MP main camera system, and USB 3 speeds. Experience ProMotion technology with a 6.7-inch Super Retina XDR display.',
    shortDescription: 'Apple A17 Pro chip, 48MP camera, titanium design',
    images: [IMG.iphone15, 'https://cdn.pixabay.com/photo/2016/11/29/12/13/samsung-1869465_1280.jpg'],
    originalPrice: 159900, sellingPrice: 149900, stock: 50,
    isFeatured: true, isNewArrival: true, isBestSeller: true,
    specifications: [
      { key: 'Display', value: '6.7-inch Super Retina XDR' },
      { key: 'Chip', value: 'A17 Pro' },
      { key: 'Camera', value: '48MP + 12MP + 12MP' },
      { key: 'Battery', value: '4422 mAh' },
      { key: 'Storage', value: '256GB' },
      { key: 'OS', value: 'iOS 17' }
    ],
    colors: [{ name: 'Natural Titanium', hex: '#8e8e8e' }, { name: 'Black Titanium', hex: '#2a2a2a' }],
    warranty: '1 Year Apple India Warranty',
    modelNumber: 'MTQX3HN/A',
    shippingInfo: { freeShipping: true, estimatedDays: 2 },
    ratings: 4.8, numReviews: 1247, sold: 892, tags: ['iphone', 'apple', 'smartphone', '5g']
  },
  {
    name: 'Samsung Galaxy S24 Ultra 512GB Titanium Black',
    brand: 'Samsung', category: 'electronics', subcategory: 'smartphones',
    description: 'Galaxy S24 Ultra with built-in S Pen, 200MP camera, AI-powered features, and 6.8-inch Dynamic AMOLED 2X display. The ultimate Galaxy experience.',
    shortDescription: 'Built-in S Pen, 200MP camera, Galaxy AI features',
    images: [IMG.samsung_s24, 'https://cdn.pixabay.com/photo/2022/01/30/16/51/iphone-6981458_1280.jpg'],
    originalPrice: 134999, sellingPrice: 119999, stock: 35,
    isFeatured: true, isBestSeller: true,
    specifications: [
      { key: 'Display', value: '6.8-inch Dynamic AMOLED 2X' },
      { key: 'Processor', value: 'Snapdragon 8 Gen 3' },
      { key: 'Camera', value: '200MP + 12MP + 50MP + 10MP' },
      { key: 'Battery', value: '5000 mAh' },
      { key: 'Storage', value: '512GB' },
      { key: 'S Pen', value: 'Built-in' }
    ],
    colors: [{ name: 'Titanium Black', hex: '#1a1a1a' }, { name: 'Titanium Gray', hex: '#6b6b6b' }],
    warranty: '1 Year Samsung India Warranty',
    shippingInfo: { freeShipping: true, estimatedDays: 2 },
    ratings: 4.7, numReviews: 856, sold: 634, tags: ['samsung', 'galaxy', 'android', '5g', 's-pen']
  },
  {
    name: 'Apple MacBook Pro 14-inch M3 Pro Chip 18GB RAM 512GB SSD',
    brand: 'Apple', category: 'electronics', subcategory: 'laptops',
    description: 'MacBook Pro 14-inch with M3 Pro chip delivers exceptional performance for professionals. Features a stunning Liquid Retina XDR display, up to 18 hours of battery life.',
    shortDescription: 'M3 Pro chip, 14-inch Liquid Retina XDR, 18GB unified memory',
    images: [IMG.laptop_macbook, 'https://cdn.pixabay.com/photo/2016/09/07/11/37/laptop-1653_.jpg'],
    originalPrice: 249900, sellingPrice: 229900, stock: 20,
    isFeatured: true,
    specifications: [
      { key: 'Processor', value: 'Apple M3 Pro (11-core CPU)' },
      { key: 'Memory', value: '18GB Unified Memory' },
      { key: 'Storage', value: '512GB SSD' },
      { key: 'Display', value: '14.2-inch Liquid Retina XDR' },
      { key: 'Battery', value: 'Up to 18 hours' },
      { key: 'Weight', value: '1.61 kg' }
    ],
    colors: [{ name: 'Space Black', hex: '#1a1a1a' }, { name: 'Silver', hex: '#e8e8e8' }],
    warranty: '1 Year Apple India Limited Warranty',
    shippingInfo: { freeShipping: true, estimatedDays: 3 },
    ratings: 4.9, numReviews: 423, sold: 298, tags: ['macbook', 'apple', 'laptop', 'm3']
  },
  {
    name: 'Dell XPS 15 Intel Core i9 32GB RAM 1TB SSD RTX 4070',
    brand: 'Dell', category: 'electronics', subcategory: 'laptops',
    description: 'Dell XPS 15 with 13th Gen Intel Core i9, NVIDIA GeForce RTX 4070, and a stunning 15.6-inch OLED display. Perfect for creators and power users.',
    shortDescription: 'Core i9, RTX 4070, 15.6-inch OLED display',
    images: [IMG.laptop_dell, 'https://cdn.pixabay.com/photo/2015/01/08/18/29/entrepreneur-593358_1280.jpg'],
    originalPrice: 219990, sellingPrice: 189990, stock: 15,
    isFeatured: true,
    specifications: [
      { key: 'Processor', value: 'Intel Core i9-13900H' },
      { key: 'RAM', value: '32GB DDR5' },
      { key: 'Storage', value: '1TB NVMe SSD' },
      { key: 'GPU', value: 'NVIDIA GeForce RTX 4070 8GB' },
      { key: 'Display', value: '15.6-inch OLED 3.5K' },
      { key: 'OS', value: 'Windows 11 Pro' }
    ],
    warranty: '1 Year Dell On-Site Warranty',
    shippingInfo: { freeShipping: true, estimatedDays: 4 },
    ratings: 4.6, numReviews: 234, sold: 167, tags: ['dell', 'xps', 'laptop', 'gaming', 'creator']
  },
  {
    name: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones',
    brand: 'Sony', category: 'electronics', subcategory: 'headphones',
    description: 'Industry-leading noise cancelling headphones with 30-hour battery life, multipoint connection, and crystal clear hands-free calling. LDAC for high-quality audio streaming.',
    shortDescription: 'Industry-leading ANC, 30-hour battery, LDAC audio',
    images: [IMG.headphones, 'https://cdn.pixabay.com/photo/2020/10/05/12/26/earphones-5629913_1280.jpg'],
    originalPrice: 29990, sellingPrice: 24990, stock: 75,
    isBestSeller: true, isOnSale: true,
    specifications: [
      { key: 'Driver', value: '40mm' },
      { key: 'Frequency', value: '4Hz – 40,000Hz' },
      { key: 'Battery', value: '30 hours (ANC on)' },
      { key: 'Connectivity', value: 'Bluetooth 5.2, 3.5mm' },
      { key: 'Weight', value: '250g' },
      { key: 'Codec', value: 'LDAC, AAC, SBC' }
    ],
    colors: [{ name: 'Black', hex: '#1a1a1a' }, { name: 'Silver', hex: '#c8c8c8' }],
    warranty: '1 Year Sony India Warranty',
    shippingInfo: { freeShipping: true, estimatedDays: 3 },
    ratings: 4.8, numReviews: 1892, sold: 1456, tags: ['sony', 'headphones', 'noise-cancelling', 'wireless']
  },
  {
    name: 'Apple Watch Series 9 GPS 45mm Midnight Aluminium',
    brand: 'Apple', category: 'electronics', subcategory: 'smartwatches',
    description: 'Apple Watch Series 9 with the new S9 chip, Double Tap gesture, and a brighter Always-On Retina display. Track your health with advanced sensors including blood oxygen and ECG.',
    shortDescription: 'S9 chip, Double Tap gesture, Always-On display',
    images: [IMG.smartwatch, 'https://cdn.pixabay.com/photo/2015/09/02/13/24/apple-watch-919233_1280.jpg'],
    originalPrice: 44900, sellingPrice: 41900, stock: 60,
    isFeatured: true, isBestSeller: true,
    specifications: [
      { key: 'Case Size', value: '45mm' },
      { key: 'Display', value: 'Always-On Retina LTPO' },
      { key: 'Chip', value: 'Apple S9' },
      { key: 'Connectivity', value: 'GPS + Bluetooth 5.3' },
      { key: 'Water Resistance', value: '50 metres' },
      { key: 'Battery', value: 'Up to 18 hours' }
    ],
    sizes: ['41mm', '45mm'],
    colors: [{ name: 'Midnight', hex: '#1a1a2e' }, { name: 'Starlight', hex: '#e8e0d0' }, { name: 'Red', hex: '#c0392b' }],
    warranty: '1 Year Apple India Warranty',
    shippingInfo: { freeShipping: true, estimatedDays: 2 },
    ratings: 4.7, numReviews: 634, sold: 489, tags: ['apple watch', 'smartwatch', 'fitness tracker']
  },
  {
    name: 'Sony Alpha 7 IV Full-Frame Mirrorless Camera',
    brand: 'Sony', category: 'electronics', subcategory: 'cameras',
    description: 'Sony Alpha 7 IV (body only) features a 33MP full-frame BSI-CMOS sensor, BIONZ XR image processor, and real-time autofocus. Shoot 4K60p video for professional results.',
    shortDescription: '33MP full-frame sensor, 4K60p video, real-time AF',
    images: [IMG.camera, 'https://cdn.pixabay.com/photo/2016/11/23/14/45/camera-1853677_1280.jpg'],
    originalPrice: 259990, sellingPrice: 239990, stock: 12,
    isFeatured: true,
    specifications: [
      { key: 'Sensor', value: '33MP Full-Frame BSI-CMOS' },
      { key: 'Processor', value: 'BIONZ XR' },
      { key: 'Video', value: '4K 60fps' },
      { key: 'ISO Range', value: '100-51200 (expandable)' },
      { key: 'AF Points', value: '759 phase-detect' },
      { key: 'Shutter Speed', value: '1/8000s' }
    ],
    warranty: '2 Years Sony India Warranty',
    shippingInfo: { freeShipping: true, estimatedDays: 5 },
    ratings: 4.9, numReviews: 189, sold: 87, tags: ['sony', 'camera', 'mirrorless', 'photography']
  },
  {
    name: 'Samsung 65-inch QLED 4K Smart TV',
    brand: 'Samsung', category: 'electronics', subcategory: 'televisions',
    description: 'Samsung 65-inch QLED 4K Smart TV with Quantum Processor 4K, 100% Color Volume with Quantum Dot, and built-in Alexa. Experience cinematic visuals in your living room.',
    shortDescription: 'QLED 4K, Quantum Processor, 100% Color Volume',
    images: [IMG.tv, 'https://cdn.pixabay.com/photo/2019/11/07/20/48/tv-4609464_1280.jpg'],
    originalPrice: 149990, sellingPrice: 109990, stock: 20,
    isBestSeller: true, isOnSale: true,
    specifications: [
      { key: 'Screen Size', value: '65 inches' },
      { key: 'Resolution', value: '4K UHD (3840x2160)' },
      { key: 'Display', value: 'QLED' },
      { key: 'HDR', value: 'Quantum HDR 12x' },
      { key: 'Smart Features', value: 'Tizen OS, Alexa, Google Assistant' },
      { key: 'Connectivity', value: 'HDMI x4, USB x2, WiFi, Bluetooth' }
    ],
    warranty: '1 Year Samsung Comprehensive Warranty',
    shippingInfo: { freeShipping: true, estimatedDays: 7 },
    ratings: 4.6, numReviews: 567, sold: 234, tags: ['samsung', 'tv', 'qled', '4k', 'smart tv']
  },

  // ─── FASHION - MEN ────────────────────────────────────────────────────────────
  {
    name: 'Men\'s Premium Cotton Round Neck T-Shirt Pack of 3',
    brand: 'H&M', category: 'fashion', subcategory: 't-shirts',
    description: 'Premium cotton round neck T-shirts with a relaxed fit. Soft, breathable fabric perfect for everyday wear. Available in multiple colors.',
    shortDescription: 'Pack of 3, 100% cotton, relaxed fit',
    images: [IMG.mens_tshirt, 'https://cdn.pixabay.com/photo/2017/08/06/00/35/shirt-2588254_1280.jpg'],
    originalPrice: 1499, sellingPrice: 999, stock: 200,
    isBestSeller: true, isOnSale: true,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [{ name: 'White', hex: '#ffffff' }, { name: 'Black', hex: '#000000' }, { name: 'Navy', hex: '#001f5b' }],
    fabric: '100% Combed Cotton',
    fitType: 'Regular Fit',
    specifications: [
      { key: 'Material', value: '100% Combed Cotton 180 GSM' },
      { key: 'Fit', value: 'Regular Fit' },
      { key: 'Neck', value: 'Round Neck' },
      { key: 'Pack', value: 'Pack of 3' },
      { key: 'Sleeve', value: 'Half Sleeve' }
    ],
    shippingInfo: { freeShipping: false, estimatedDays: 5 },
    ratings: 4.3, numReviews: 2341, sold: 1876, tags: ['t-shirt', 'cotton', 'mens', 'casual']
  },
  {
    name: 'Men\'s Slim Fit Cotton Formal Shirt Blue',
    brand: 'Peter England', category: 'fashion', subcategory: 'shirts',
    description: 'Crisp cotton formal shirt with a slim fit for a sharp look. Perfect for office or formal occasions. Spread collar with button placket.',
    shortDescription: 'Slim fit, spread collar, office wear',
    images: [IMG.mens_shirt, 'https://cdn.pixabay.com/photo/2015/07/20/12/57/man-852764_1280.jpg'],
    originalPrice: 1999, sellingPrice: 1299, stock: 150,
    isOnSale: true,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [{ name: 'Blue', hex: '#0066cc' }, { name: 'White', hex: '#ffffff' }, { name: 'Light Grey', hex: '#d3d3d3' }],
    fabric: 'Cotton',
    fitType: 'Slim Fit',
    specifications: [
      { key: 'Material', value: '100% Cotton' },
      { key: 'Fit', value: 'Slim Fit' },
      { key: 'Collar', value: 'Spread Collar' },
      { key: 'Occasion', value: 'Formal, Office' }
    ],
    shippingInfo: { freeShipping: false, estimatedDays: 5 },
    ratings: 4.4, numReviews: 876, sold: 654, tags: ['shirt', 'formal', 'office wear', 'men']
  },
  {
    name: 'Men\'s Slim Fit Stretch Jeans Dark Blue',
    brand: 'Levi\'s', category: 'fashion', subcategory: 'jeans',
    description: 'Levi\'s 511 slim fit jeans made from stretch denim for all-day comfort. Classic 5-pocket styling with a modern slim cut.',
    shortDescription: 'Levi\'s 511 slim fit, stretch denim, classic 5-pocket',
    images: [IMG.mens_jeans, 'https://cdn.pixabay.com/photo/2016/03/27/22/00/fashion-1283863_1280.jpg'],
    originalPrice: 3999, sellingPrice: 2799, stock: 120,
    isBestSeller: true,
    sizes: ['28', '30', '32', '34', '36', '38'],
    colors: [{ name: 'Dark Blue', hex: '#1a237e' }, { name: 'Black', hex: '#000000' }, { name: 'Medium Blue', hex: '#1565c0' }],
    fabric: '99% Cotton, 1% Elastane',
    fitType: 'Slim Fit',
    shippingInfo: { freeShipping: true, estimatedDays: 5 },
    ratings: 4.5, numReviews: 1234, sold: 987, tags: ['jeans', 'levis', 'denim', 'slim fit']
  },
  {
    name: 'Men\'s Premium Leather Jacket Brown',
    brand: 'Royal Enfield', category: 'fashion', subcategory: 'jackets',
    description: 'Premium genuine leather jacket with a classic biker style. Features a YKK zipper, multiple pockets, and quilted lining for warmth.',
    shortDescription: 'Genuine leather, biker style, quilted lining',
    images: [IMG.mens_jacket, 'https://cdn.pixabay.com/photo/2020/10/14/08/13/hoodie-5654108_1280.jpg'],
    originalPrice: 8999, sellingPrice: 6499, stock: 40,
    isOnSale: true,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [{ name: 'Brown', hex: '#8B4513' }, { name: 'Black', hex: '#000000' }],
    fabric: 'Genuine Leather',
    shippingInfo: { freeShipping: true, estimatedDays: 5 },
    ratings: 4.6, numReviews: 345, sold: 234, tags: ['jacket', 'leather', 'biker', 'men']
  },

  // ─── FASHION - WOMEN ─────────────────────────────────────────────────────────
  {
    name: 'Women\'s Floral Maxi Dress Summer Collection',
    brand: 'Zara', category: 'fashion', subcategory: 'dresses',
    description: 'Beautiful floral print maxi dress perfect for summer outings. Made from lightweight chiffon fabric with a flowy silhouette and V-neck design.',
    shortDescription: 'Floral print, chiffon fabric, V-neck, maxi length',
    images: [IMG.womens_dress, 'https://cdn.pixabay.com/photo/2017/01/31/13/14/people-2023191_1280.jpg'],
    originalPrice: 3499, sellingPrice: 2299, stock: 80,
    isNewArrival: true, isOnSale: true,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [{ name: 'Floral Pink', hex: '#ffb6c1' }, { name: 'Floral Blue', hex: '#add8e6' }],
    fabric: 'Chiffon',
    fitType: 'Regular Fit',
    shippingInfo: { freeShipping: false, estimatedDays: 4 },
    ratings: 4.5, numReviews: 678, sold: 456, tags: ['dress', 'maxi dress', 'summer', 'floral', 'women']
  },
  {
    name: 'Women\'s Designer Embroidered Anarkali Kurti',
    brand: 'Biba', category: 'fashion', subcategory: 'kurtas',
    description: 'Beautifully embroidered Anarkali kurti in cotton fabric. Features intricate embroidery work, round neck, and three-quarter sleeves. Ideal for festive occasions.',
    shortDescription: 'Embroidered Anarkali, cotton, festive wear',
    images: [IMG.womens_kurti, 'https://cdn.pixabay.com/photo/2020/09/18/05/58/indian-5581706_1280.jpg'],
    originalPrice: 2499, sellingPrice: 1799, stock: 60,
    isBestSeller: true,
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: [{ name: 'Rose Pink', hex: '#ff007f' }, { name: 'Royal Blue', hex: '#4169e1' }, { name: 'Mustard', hex: '#ffdb58' }],
    fabric: 'Cotton',
    shippingInfo: { freeShipping: false, estimatedDays: 5 },
    ratings: 4.6, numReviews: 892, sold: 678, tags: ['kurti', 'anarkali', 'ethnic', 'women', 'festive']
  },
  {
    name: 'Women\'s Pure Silk Banarasi Saree with Blouse Piece',
    brand: 'Nalli', category: 'fashion', subcategory: 'sarees',
    description: 'Exquisite pure silk Banarasi saree with zari work and beautiful patterns. Comes with a matching unstitched blouse piece. Perfect for weddings and special occasions.',
    shortDescription: 'Pure silk, Banarasi zari work, with blouse piece',
    images: [IMG.womens_saree, 'https://cdn.pixabay.com/photo/2021/09/08/15/32/girl-6607272_1280.jpg'],
    originalPrice: 12999, sellingPrice: 9999, stock: 25,
    isFeatured: true,
    colors: [{ name: 'Maroon', hex: '#800000' }, { name: 'Royal Blue', hex: '#4169e1' }, { name: 'Green', hex: '#006400' }],
    fabric: 'Pure Silk',
    shippingInfo: { freeShipping: true, estimatedDays: 7 },
    ratings: 4.8, numReviews: 234, sold: 145, tags: ['saree', 'banarasi', 'silk', 'ethnic', 'wedding']
  },

  // ─── HOME & KITCHEN ───────────────────────────────────────────────────────────
  {
    name: 'LG 260 Litre Smart Inverter Frost-Free Double Door Refrigerator',
    brand: 'LG', category: 'home-kitchen', subcategory: 'refrigerators',
    description: 'LG Smart Inverter Compressor refrigerator with Frost-Free technology, Door Cooling+, and Multi Air Flow system. Energy efficient with 3-star rating.',
    shortDescription: 'Smart Inverter, 260L, 3-star energy rating, Door Cooling+',
    images: [IMG.refrigerator, 'https://cdn.pixabay.com/photo/2020/06/08/16/39/washing-machine-5274913_1280.jpg'],
    originalPrice: 32990, sellingPrice: 28990, stock: 15,
    isBestSeller: true,
    specifications: [
      { key: 'Capacity', value: '260 Litres' },
      { key: 'Energy Rating', value: '3 Star' },
      { key: 'Compressor', value: 'Smart Inverter' },
      { key: 'Type', value: 'Frost Free' },
      { key: 'Annual Consumption', value: '230 Units' },
      { key: 'Warranty', value: '1 Year + 10 Year on Compressor' }
    ],
    colors: [{ name: 'Dazzle Steel', hex: '#c0c0c0' }, { name: 'Shiny Steel', hex: '#a9a9a9' }],
    warranty: '1 Year Comprehensive + 10 Year on Compressor',
    shippingInfo: { freeShipping: true, estimatedDays: 7 },
    ratings: 4.4, numReviews: 567, sold: 234, tags: ['refrigerator', 'lg', 'frost free', 'inverter']
  },
  {
    name: 'Samsung 7 Kg Fully-Automatic Front Load Washing Machine',
    brand: 'Samsung', category: 'home-kitchen', subcategory: 'washing-machines',
    description: 'Samsung Ecobubble front load washing machine with Hygiene Steam, Anti-Vibration Design, and Digital Inverter Technology for quiet operation and energy savings.',
    shortDescription: 'EcoBubble, Hygiene Steam, Digital Inverter, 7kg',
    images: [IMG.washing_machine, 'https://cdn.pixabay.com/photo/2020/09/16/14/14/fridge-5577726_1280.jpg'],
    originalPrice: 42990, sellingPrice: 34990, stock: 12,
    specifications: [
      { key: 'Capacity', value: '7 kg' },
      { key: 'Spin Speed', value: '1400 RPM' },
      { key: 'Energy Rating', value: '5 Star' },
      { key: 'Type', value: 'Front Load' },
      { key: 'Programs', value: '15 Wash Programs' }
    ],
    warranty: '3 Years Comprehensive + 10 Years on Motor',
    shippingInfo: { freeShipping: true, estimatedDays: 7 },
    ratings: 4.3, numReviews: 345, sold: 178, tags: ['washing machine', 'samsung', 'front load']
  },
  {
    name: 'Philips Air Fryer HD9200/90 4.1 Litre Black',
    brand: 'Philips', category: 'home-kitchen', subcategory: 'air-fryers',
    description: 'Philips Air Fryer uses Rapid Air Technology to fry, bake, grill and roast using 90% less fat. 4.1 litre capacity perfect for family cooking.',
    shortDescription: 'Rapid Air Technology, 4.1L, 90% less fat, 2000W',
    images: [IMG.air_fryer, 'https://cdn.pixabay.com/photo/2015/09/14/13/48/blender-940463_1280.jpg'],
    originalPrice: 9999, sellingPrice: 6999, stock: 60,
    isOnSale: true, isBestSeller: true,
    specifications: [
      { key: 'Capacity', value: '4.1 Litres' },
      { key: 'Power', value: '2000W' },
      { key: 'Temperature', value: '80-200°C' },
      { key: 'Timer', value: 'Up to 60 minutes' }
    ],
    warranty: '2 Years Philips India Warranty',
    shippingInfo: { freeShipping: true, estimatedDays: 4 },
    ratings: 4.5, numReviews: 1234, sold: 876, tags: ['air fryer', 'philips', 'healthy cooking']
  },
  {
    name: 'Godrej Interio Ultima 3-Seater Sofa Velvet Fabric',
    brand: 'Godrej', category: 'home-kitchen', subcategory: 'furniture',
    description: 'Premium 3-seater sofa with high-density foam cushions and durable velvet fabric. Solid wood frame with anti-rust metal legs. Ideal for living rooms.',
    shortDescription: 'High-density foam, velvet fabric, solid wood frame',
    images: [IMG.sofa, 'https://cdn.pixabay.com/photo/2015/09/16/19/40/kitchen-942621_1280.jpg'],
    originalPrice: 34999, sellingPrice: 24999, stock: 8,
    isBestSeller: true,
    specifications: [
      { key: 'Material', value: 'Velvet Fabric + Solid Wood Frame' },
      { key: 'Seating Capacity', value: '3 Persons' },
      { key: 'Foam Density', value: '35 kg/m3 (High Density)' },
      { key: 'Leg Material', value: 'Powder Coated Metal' },
      { key: 'Warranty', value: '1 Year' }
    ],
    colors: [{ name: 'Royal Blue', hex: '#4169e1' }, { name: 'Grey', hex: '#808080' }, { name: 'Beige', hex: '#f5f5dc' }],
    shippingInfo: { freeShipping: true, estimatedDays: 14 },
    ratings: 4.2, numReviews: 234, sold: 89, tags: ['sofa', 'furniture', 'living room', 'godrej']
  },

  // ─── GROCERY ─────────────────────────────────────────────────────────────────
  {
    name: 'Farm Fresh Seasonal Fruit Basket (Apples, Bananas, Oranges) 2kg',
    brand: 'FreshFarm', category: 'grocery', subcategory: 'fruits',
    description: 'Fresh seasonal fruit basket with handpicked apples, bananas, and oranges. Sourced directly from farms, rich in vitamins and antioxidants.',
    shortDescription: 'Fresh seasonal fruits, 2kg mixed basket',
    images: [IMG.fruits, 'https://cdn.pixabay.com/photo/2017/10/09/19/29/eat-2834549_1280.jpg'],
    originalPrice: 299, sellingPrice: 249, stock: 200,
    isOnSale: true,
    weight: '2 kg',
    expiryInfo: '3-5 days from delivery',
    specifications: [
      { key: 'Contents', value: 'Apples (600g) + Bananas (700g) + Oranges (700g)' },
      { key: 'Storage', value: 'Store in cool, dry place' },
      { key: 'Shelf Life', value: '3-5 days' }
    ],
    shippingInfo: { freeShipping: false, estimatedDays: 1 },
    ratings: 4.4, numReviews: 567, sold: 1234, tags: ['fruits', 'fresh', 'organic', 'healthy']
  },
  {
    name: 'India Gate Basmati Rice Classic 5kg',
    brand: 'India Gate', category: 'grocery', subcategory: 'rice',
    description: 'India Gate Classic Basmati Rice offers extra long grains that cook to perfection. Aged for a minimum of 1 year for authentic aroma and taste.',
    shortDescription: 'Extra long grain, aged 1 year, aromatic basmati',
    images: [IMG.rice, 'https://cdn.pixabay.com/photo/2015/09/02/13/30/spices-919945_1280.jpg'],
    originalPrice: 699, sellingPrice: 599, stock: 300,
    isBestSeller: true,
    weight: '5 kg',
    expiryInfo: '12 months from manufacture',
    specifications: [
      { key: 'Grain Type', value: 'Extra Long Grain Basmati' },
      { key: 'Aging', value: 'Minimum 1 Year' },
      { key: 'Net Weight', value: '5 kg' }
    ],
    shippingInfo: { freeShipping: false, estimatedDays: 2 },
    ratings: 4.6, numReviews: 2345, sold: 3456, tags: ['rice', 'basmati', 'india gate', 'grocery']
  },
  {
    name: 'Everest Kitchen King Masala 500g Value Pack',
    brand: 'Everest', category: 'grocery', subcategory: 'spices',
    description: 'Everest Kitchen King Masala - the perfect blend of premium spices for authentic Indian cooking. No artificial colours or preservatives.',
    shortDescription: 'Premium spice blend, no artificial colors, 500g',
    images: [IMG.spices, 'https://cdn.pixabay.com/photo/2017/05/11/19/44/fresh-fruits-2305192_1280.jpg'],
    originalPrice: 299, sellingPrice: 249, stock: 400,
    specifications: [
      { key: 'Net Weight', value: '500g' },
      { key: 'Type', value: 'Kitchen King Masala' },
      { key: 'Preservatives', value: 'None' }
    ],
    weight: '500g',
    shippingInfo: { freeShipping: false, estimatedDays: 2 },
    ratings: 4.5, numReviews: 1678, sold: 2345, tags: ['spices', 'masala', 'everest', 'kitchen king']
  },

  // ─── BEAUTY ───────────────────────────────────────────────────────────────────
  {
    name: 'Minimalist 10% Niacinamide Face Serum 30ml',
    brand: 'Minimalist', category: 'beauty', subcategory: 'skincare',
    description: 'Minimalist 10% Niacinamide + 1% Zinc serum helps reduce pore appearance, controls excess oil, and improves skin texture. Suitable for all skin types.',
    shortDescription: '10% Niacinamide + 1% Zinc, pore minimizing, oil control',
    images: [IMG.skincare, 'https://cdn.pixabay.com/photo/2017/11/09/21/41/makeup-brushes-2935366_1280.jpg'],
    originalPrice: 699, sellingPrice: 569, stock: 150,
    isBestSeller: true, isNewArrival: true,
    specifications: [
      { key: 'Key Ingredients', value: 'Niacinamide 10%, Zinc 1%' },
      { key: 'Volume', value: '30 ml' },
      { key: 'Skin Type', value: 'All Skin Types' },
      { key: 'Free From', value: 'Parabens, Sulfates, Silicones' }
    ],
    shippingInfo: { freeShipping: false, estimatedDays: 3 },
    ratings: 4.7, numReviews: 3456, sold: 2876, tags: ['niacinamide', 'serum', 'skincare', 'minimalist']
  },
  {
    name: 'Chanel No.5 Eau De Parfum 100ml',
    brand: 'Chanel', category: 'beauty', subcategory: 'perfumes',
    description: 'Chanel No. 5 - the legendary fragrance that has been beloved for over a century. A timeless floral aldehyde with notes of jasmine, rose, and sandalwood.',
    shortDescription: 'Legendary floral fragrance, 100ml EDP',
    images: [IMG.perfume, 'https://cdn.pixabay.com/photo/2020/04/14/10/31/cosmetics-5042016_1280.jpg'],
    originalPrice: 18900, sellingPrice: 16900, stock: 30,
    isFeatured: true,
    specifications: [
      { key: 'Volume', value: '100 ml' },
      { key: 'Type', value: 'Eau de Parfum' },
      { key: 'Top Notes', value: 'Ylang-Ylang, Aldehydes' },
      { key: 'Heart Notes', value: 'May Rose, Jasmine' },
      { key: 'Base Notes', value: 'Sandalwood, Vetiver, Vanilla' }
    ],
    shippingInfo: { freeShipping: true, estimatedDays: 4 },
    ratings: 4.9, numReviews: 234, sold: 123, tags: ['chanel', 'perfume', 'fragrance', 'luxury']
  },

  // ─── SPORTS ──────────────────────────────────────────────────────────────────
  {
    name: 'Cosco Torrido Pro Cricket Bat Kashmir Willow',
    brand: 'Cosco', category: 'sports', subcategory: 'cricket',
    description: 'Cosco Torrido Pro cricket bat made from premium Kashmir Willow. Features a traditional English handle and perfect blade for power hitting.',
    shortDescription: 'Kashmir Willow, traditional English handle, professional grade',
    images: [IMG.cricket, 'https://cdn.pixabay.com/photo/2015/11/07/11/13/football-1031498_1280.jpg'],
    originalPrice: 2499, sellingPrice: 1899, stock: 60,
    specifications: [
      { key: 'Wood', value: 'Kashmir Willow' },
      { key: 'Handle', value: 'Traditional English Cane' },
      { key: 'Grade', value: 'Grade A' },
      { key: 'Weight', value: '1150-1250g' }
    ],
    shippingInfo: { freeShipping: false, estimatedDays: 4 },
    ratings: 4.2, numReviews: 567, sold: 345, tags: ['cricket', 'bat', 'cosco', 'sports']
  },
  {
    name: 'Boldfit Premium Yoga Mat Anti-Slip 6mm Thick',
    brand: 'Boldfit', category: 'sports', subcategory: 'fitness',
    description: 'Premium quality yoga mat with extra-thick 6mm cushioning for comfort and joint protection. Anti-slip textured surface for stability in all poses.',
    shortDescription: '6mm thick, anti-slip surface, durable TPE material',
    images: [IMG.yoga_mat, 'https://cdn.pixabay.com/photo/2017/08/07/14/02/man-2604149_1280.jpg'],
    originalPrice: 999, sellingPrice: 699, stock: 200,
    isBestSeller: true, isOnSale: true,
    colors: [{ name: 'Purple', hex: '#800080' }, { name: 'Blue', hex: '#0000ff' }, { name: 'Black', hex: '#000000' }],
    specifications: [
      { key: 'Material', value: 'TPE (Thermoplastic Elastomer)' },
      { key: 'Thickness', value: '6mm' },
      { key: 'Dimensions', value: '183 x 61 cm' },
      { key: 'Weight', value: '700g' }
    ],
    shippingInfo: { freeShipping: false, estimatedDays: 4 },
    ratings: 4.4, numReviews: 1234, sold: 876, tags: ['yoga mat', 'fitness', 'exercise', 'boldfit']
  },

  // ─── BOOKS ────────────────────────────────────────────────────────────────────
  {
    name: 'Atomic Habits by James Clear - Paperback',
    brand: 'Penguin Random House', category: 'books', subcategory: 'non-fiction',
    description: 'No.1 New York Times bestseller. James Clear reveals how tiny changes in behavior can lead to remarkable results. Learn the proven framework for improving every day.',
    shortDescription: 'NY Times #1 Bestseller, habit formation guide',
    images: [IMG.book_fiction, 'https://cdn.pixabay.com/photo/2015/09/05/07/28/writing-923882_1280.jpg'],
    originalPrice: 399, sellingPrice: 299, stock: 300,
    isBestSeller: true,
    specifications: [
      { key: 'Author', value: 'James Clear' },
      { key: 'Publisher', value: 'Penguin Random House' },
      { key: 'Pages', value: '320' },
      { key: 'Language', value: 'English' },
      { key: 'Format', value: 'Paperback' }
    ],
    shippingInfo: { freeShipping: false, estimatedDays: 3 },
    ratings: 4.8, numReviews: 4567, sold: 3456, tags: ['atomic habits', 'james clear', 'self-help', 'habits']
  },

  // ─── TOYS ─────────────────────────────────────────────────────────────────────
  {
    name: 'LEGO Classic Medium Creative Brick Box 484 Pieces',
    brand: 'LEGO', category: 'toys', subcategory: 'educational-toys',
    description: 'LEGO Classic Medium Creative Brick Box with 484 bricks in 35 colors. Perfect for children aged 4+ to build, create and express their imagination.',
    shortDescription: '484 pieces, 35 colors, ages 4+, creative play',
    images: [IMG.toys_lego, 'https://cdn.pixabay.com/photo/2015/11/19/21/14/toy-1052005_1280.jpg'],
    originalPrice: 3499, sellingPrice: 2799, stock: 80,
    isBestSeller: true,
    specifications: [
      { key: 'Pieces', value: '484' },
      { key: 'Age', value: '4+ years' },
      { key: 'Dimensions', value: '28x19x12 cm' },
      { key: 'Colors', value: '35 colors' }
    ],
    shippingInfo: { freeShipping: true, estimatedDays: 4 },
    ratings: 4.8, numReviews: 1234, sold: 876, tags: ['lego', 'toys', 'educational', 'building blocks']
  },

  // ─── AUTOMOTIVE ──────────────────────────────────────────────────────────────
  {
    name: 'Vega Crux Full Face Helmet DOT Certified',
    brand: 'Vega', category: 'automotive', subcategory: 'helmets',
    description: 'Vega Crux full-face helmet with DOT certification, aerodynamic design, and scratch-resistant visor. Ventilation system for comfort during long rides.',
    shortDescription: 'DOT certified, aerodynamic design, scratch-resistant visor',
    images: [IMG.helmet, 'https://cdn.pixabay.com/photo/2015/09/02/13/24/car-923194_1280.jpg'],
    originalPrice: 1999, sellingPrice: 1499, stock: 100,
    isBestSeller: true,
    sizes: ['S (55-56cm)', 'M (57-58cm)', 'L (59-60cm)', 'XL (61-62cm)'],
    colors: [{ name: 'Glossy Black', hex: '#000000' }, { name: 'White', hex: '#ffffff' }, { name: 'Red', hex: '#ff0000' }],
    specifications: [
      { key: 'Certification', value: 'DOT' },
      { key: 'Shell Material', value: 'ABS' },
      { key: 'Weight', value: '1.4 kg' },
      { key: 'Visor', value: 'Anti-Scratch UV Protected' }
    ],
    shippingInfo: { freeShipping: false, estimatedDays: 4 },
    ratings: 4.3, numReviews: 789, sold: 567, tags: ['helmet', 'vega', 'full face', 'bike']
  },

  // ─── PETS ─────────────────────────────────────────────────────────────────────
  {
    name: 'Pedigree Adult Dry Dog Food Chicken & Vegetables 10kg',
    brand: 'Pedigree', category: 'pets', subcategory: 'pet-food',
    description: 'Complete and balanced nutrition for adult dogs. Pedigree Adult dry dog food with chicken and vegetables provides 9 essential nutrients including omega 6 for healthy coat.',
    shortDescription: 'Complete nutrition, chicken & vegetables, 10kg pack',
    images: [IMG.pet_food, 'https://cdn.pixabay.com/photo/2016/02/19/15/46/dog-1210559_1280.jpg'],
    originalPrice: 1999, sellingPrice: 1699, stock: 100,
    isBestSeller: true,
    weight: '10 kg',
    specifications: [
      { key: 'Flavor', value: 'Chicken & Vegetables' },
      { key: 'Weight', value: '10 kg' },
      { key: 'Life Stage', value: 'Adult' },
      { key: 'Breed', value: 'All Breeds' }
    ],
    shippingInfo: { freeShipping: true, estimatedDays: 3 },
    ratings: 4.5, numReviews: 1234, sold: 876, tags: ['dog food', 'pedigree', 'pet food', 'dry food']
  }
];

const coupons = [
  {
    code: 'WELCOME10',
    description: 'Get 10% off on your first order',
    discountType: 'percentage',
    discountValue: 10,
    minOrderAmount: 500,
    maxDiscountAmount: 500,
    usageLimit: null,
    validFrom: new Date(),
    validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    isFirstPurchaseOnly: true,
    isActive: true
  },
  {
    code: 'WORLDKART20',
    description: 'Flat 20% off on orders above ₹2000',
    discountType: 'percentage',
    discountValue: 20,
    minOrderAmount: 2000,
    maxDiscountAmount: 1000,
    usageLimit: 500,
    validFrom: new Date(),
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    isActive: true
  },
  {
    code: 'FLAT500',
    description: 'Flat ₹500 off on orders above ₹3000',
    discountType: 'fixed',
    discountValue: 500,
    minOrderAmount: 3000,
    usageLimit: 200,
    validFrom: new Date(),
    validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    isActive: true
  },
  {
    code: 'ELECTRONICS15',
    description: '15% off on electronics',
    discountType: 'percentage',
    discountValue: 15,
    minOrderAmount: 5000,
    maxDiscountAmount: 3000,
    applicableCategories: ['electronics'],
    validFrom: new Date(),
    validUntil: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    isActive: true
  }
];

const offers = [
  {
    title: 'Flash Sale - Up to 70% Off Electronics',
    description: 'Limited time flash sale on top electronics brands',
    offerType: 'flash_sale',
    discountType: 'percentage',
    discountValue: 70,
    applicableCategories: ['electronics'],
    startDate: new Date(),
    endDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
    isActive: true,
    priority: 10,
    badgeText: 'FLASH SALE',
    bgColor: '#FF4444'
  },
  {
    title: 'Diwali Collection - Festive Deals',
    description: 'Celebrate Diwali with amazing deals on fashion, electronics and home',
    offerType: 'festival',
    discountType: 'percentage',
    discountValue: 40,
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    isActive: true,
    priority: 9,
    badgeText: 'DIWALI SALE',
    bgColor: '#FF8C00'
  },
  {
    title: 'Clearance Sale - Up to 60% Off',
    description: 'End of season clearance sale on fashion and clothing',
    offerType: 'clearance',
    discountType: 'percentage',
    discountValue: 60,
    applicableCategories: ['fashion'],
    startDate: new Date(),
    endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    isActive: true,
    priority: 8,
    badgeText: 'CLEARANCE',
    bgColor: '#8B0000'
  }
];

const blogs = [
  {
    title: 'Top 10 Smartphones to Buy in 2024 - Complete Buying Guide',
    slug: 'top-10-smartphones-2024-' + Date.now(),
    excerpt: 'Confused about which smartphone to buy? Our expert guide covers the best smartphones across all budgets for 2024.',
    content: `<h2>Finding the Perfect Smartphone in 2024</h2>
<p>The smartphone market in 2024 is packed with incredible options across all price segments. Whether you're looking for a budget device or a flagship powerhouse, there's something for everyone.</p>
<h3>1. Apple iPhone 15 Pro Max - Best Overall</h3>
<p>The iPhone 15 Pro Max represents the pinnacle of smartphone engineering with its titanium frame, A17 Pro chip, and revolutionary 48MP camera system. The USB 3 speeds make it a professional tool for content creators.</p>
<h3>2. Samsung Galaxy S24 Ultra - Best Android</h3>
<p>Samsung's S24 Ultra brings AI-powered features and the iconic S Pen experience to a new level. The 200MP camera captures stunning detail while the built-in AI enhances photos automatically.</p>
<h3>Tips for Choosing the Right Smartphone</h3>
<ul>
<li>Consider your primary use case - photography, gaming, or productivity</li>
<li>Set a realistic budget before you start shopping</li>
<li>Check the camera samples in real-world conditions</li>
<li>Battery life matters more than specs in daily use</li>
</ul>`,
    category: 'buying-guide',
    tags: ['smartphones', 'buying guide', '2024', 'apple', 'samsung'],
    featuredImage: 'https://cdn.pixabay.com/photo/2022/01/30/16/51/iphone-6981458_1280.jpg',
    isPublished: true,
    publishedAt: new Date(),
    views: 2341
  },
  {
    title: 'Fashion Trends 2024: What\'s In and What\'s Out',
    slug: 'fashion-trends-2024-' + Date.now(),
    excerpt: 'Discover the hottest fashion trends of 2024 and learn how to update your wardrobe without breaking the bank.',
    content: `<h2>2024 Fashion Trends You Need to Know</h2>
<p>Fashion in 2024 is all about self-expression, sustainability, and comfort without compromising on style. Let's dive into what's dominating runways and street style this year.</p>
<h3>Key Trends</h3>
<h4>1. Quiet Luxury</h4>
<p>Understated elegance with premium fabrics and minimalist designs. Think neutral palettes, clean cuts, and quality over quantity.</p>
<h4>2. Sustainable Fashion</h4>
<p>Eco-friendly materials and ethical production are no longer just buzzwords – they're essential considerations for fashion-forward shoppers.</p>
<h4>3. Ethnic Fusion</h4>
<p>Blending traditional Indian styles with contemporary cuts is having a major moment. Embroidered kurtas with denim, sarees with modern blouses – the fusion is beautiful.</p>`,
    category: 'fashion',
    tags: ['fashion', 'trends', '2024', 'style'],
    featuredImage: 'https://cdn.pixabay.com/photo/2017/08/01/10/16/woman-2563491_1280.jpg',
    isPublished: true,
    publishedAt: new Date(Date.now() - 86400000),
    views: 1876
  }
];

const vlogs = [
  {
    title: 'iPhone 15 Pro Max Unboxing & First Look',
    description: 'Unboxing the brand new Apple iPhone 15 Pro Max Titanium. Full first look review including camera test and benchmark results.',
    youtubeUrl: 'https://www.youtube.com/watch?v=ycJoMD6_9gI',
    category: 'unboxing',
    tags: ['iphone', 'apple', 'unboxing'],
    isPublished: true,
    publishedAt: new Date(),
    duration: '12:34',
    views: 45678
  },
  {
    title: 'Summer Fashion Haul 2024 - Best Picks from WORLDKART',
    description: 'Complete summer fashion haul featuring dresses, kurtis, and accessories. All items from the WORLDKART fashion collection.',
    youtubeUrl: 'https://www.youtube.com/watch?v=B7DMT-RNzfI',
    category: 'fashion',
    tags: ['fashion', 'haul', 'summer', 'women'],
    isPublished: true,
    publishedAt: new Date(Date.now() - 172800000),
    duration: '18:45',
    views: 23456
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB for seeding');

    // Clear existing data
    await Promise.all([
      Product.deleteMany({}),
      Coupon.deleteMany({}),
      Offer.deleteMany({})
    ]);
    console.log('🗑️  Cleared existing products, coupons, offers');

    // Create admin user if not exists
    let admin = await User.findOne({ email: process.env.ADMIN_EMAIL || 'admin@worldkart.com' });
    if (!admin) {
      admin = await User.create({
        name: 'WORLDKART Admin',
        email: process.env.ADMIN_EMAIL || 'admin@worldkart.com',
        password: process.env.ADMIN_PASSWORD || 'Admin@123456',
        role: 'admin',
        isEmailVerified: true,
        referralCode: 'SZADMIN'
      });
      console.log('👤 Admin user created:', admin.email);
    } else {
      console.log('👤 Admin user already exists:', admin.email);
    }

    // Seed products
    const productsWithAuthor = products.map(p => ({ ...p, addedBy: admin._id }));
    const createdProducts = await Product.insertMany(productsWithAuthor);
    console.log(`📦 Created ${createdProducts.length} products`);

    // Seed coupons
    await Coupon.insertMany(coupons);
    console.log(`🎟️  Created ${coupons.length} coupons`);

    // Seed offers
    await Offer.insertMany(offers);
    console.log(`🏷️  Created ${offers.length} offers`);

    // Seed blogs
    let blogsWithAuthor = blogs.map(b => ({ ...b, author: admin._id, authorName: 'WORLDKART Admin' }));
    let existingBlogCount = await Blog.countDocuments();
    if (existingBlogCount === 0) {
      await Blog.insertMany(blogsWithAuthor);
      console.log(`📝 Created ${blogsWithAuthor.length} blogs`);
    }

    // Seed vlogs
    let vlogsWithAuthor = vlogs.map(v => ({ ...v, author: admin._id, authorName: 'WORLDKART Admin' }));
    let existingVlogCount = await Vlog.countDocuments();
    if (existingVlogCount === 0) {
      await Vlog.insertMany(vlogsWithAuthor);
      console.log(`🎬 Created ${vlogsWithAuthor.length} vlogs`);
    }

    console.log('\n✅ Database seeded successfully!');
    console.log('═══════════════════════════════════════');
    console.log('Admin credentials:');
    console.log(`  Email: ${process.env.ADMIN_EMAIL || 'admin@worldkart.com'}`);
    console.log(`  Password: ${process.env.ADMIN_PASSWORD || 'Admin@123456'}`);
    console.log('═══════════════════════════════════════');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding error:', err);
    process.exit(1);
  }
}

seed();

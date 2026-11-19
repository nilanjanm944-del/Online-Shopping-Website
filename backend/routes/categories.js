const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  const categories = [
    { id: 'fashion', name: 'Fashion & Clothing', icon: '👗', subcategories: ['mens-clothing','womens-clothing','kids-clothing','t-shirts','shirts','jeans','dresses','sarees','kurtas','footwear','watches','bags'] },
    { id: 'electronics', name: 'Electronics & Gadgets', icon: '📱', subcategories: ['smartphones','laptops','tablets','smartwatches','headphones','cameras','gaming','computer-accessories','televisions','speakers'] },
    { id: 'home-kitchen', name: 'Home & Kitchen', icon: '🏠', subcategories: ['refrigerators','washing-machines','air-conditioners','microwaves','air-fryers','furniture','cookware','home-decor','lighting'] },
    { id: 'grocery', name: 'Grocery & Essentials', icon: '🛒', subcategories: ['fruits','vegetables','rice','pulses','spices','snacks','beverages','dairy','bakery','packaged-foods'] },
    { id: 'beauty', name: 'Beauty & Personal Care', icon: '💄', subcategories: ['skincare','haircare','makeup','perfumes','mens-grooming','bath-products'] },
    { id: 'sports', name: 'Sports & Fitness', icon: '⚽', subcategories: ['gym-equipment','sportswear','cricket','football','badminton','fitness'] },
    { id: 'books', name: 'Books & Stationery', icon: '📚', subcategories: ['academic','fiction','non-fiction','competitive-exams','notebooks','pens','office-supplies'] },
    { id: 'toys', name: 'Toys & Baby Products', icon: '🧸', subcategories: ['educational-toys','soft-toys','baby-clothing','baby-care','school-bags','board-games'] },
    { id: 'automotive', name: 'Automotive Accessories', icon: '🚗', subcategories: ['car-accessories','bike-accessories','helmets','vehicle-cleaning'] },
    { id: 'pets', name: 'Pet Supplies', icon: '🐾', subcategories: ['pet-food','pet-toys','pet-grooming','pet-accessories'] }
  ];
  res.json({ success: true, data: categories });
});

module.exports = router;

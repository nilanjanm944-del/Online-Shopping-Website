import React from 'react';
import CategoryPage from '../CategoryPage';

// Store pages are wrappers around CategoryPage with pre-set category
// React Router passes the correct category from URL params
// These are created as named exports for lazy loading

export default function FashionStore() {
  return <CategoryPage />;
}

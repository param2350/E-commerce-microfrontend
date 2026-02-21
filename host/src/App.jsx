import React, { Suspense, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './styles.css';
import Navigation from './components/Navigation/Navigation';
import Home from './pages/Home/Home';

import ThemeProvider from './providers/ThemeProvider';

// Lazy load Remotes
// The import path corresponds to the 'remotes' key in webpack.config.js
const ProductsApp = React.lazy(() => import('products/ProductsApp'));
const CartApp = React.lazy(() => import('cart/CartApp'));

export default function App() {
  // HOST STATE MANAGEMENT
  // The Host is now the source of truth for the Cart.
  const [cartItems, setCartItems] = useState([]);

  const handleAddToCart = (product) => {
    setCartItems((prevItems) => [...prevItems, product]);
    console.log('Host: Item added to cart', product);
  };

  const handleRemoveFromCart = (index) => {
    setCartItems((prevItems) => prevItems.filter((_, i) => i !== index));
    console.log('Host: Item removed from cart', index);
  };

  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="app-container">
          <Navigation cartCount={cartItems.length} />
          <div className="content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route
                path="/products"
                element={
                  <Suspense fallback={<div>Loading Products...</div>}>
                    {/* PASS CALLBACK TO PRODUCTS */}
                    <ProductsApp onAddToCart={handleAddToCart} />
                  </Suspense>
                }
              />
              <Route
                path="/cart"
                element={
                  <Suspense fallback={<div>Loading Cart...</div>}>
                    {/* PASS STATE AND CALLBACK TO CART */}
                    <CartApp items={cartItems} onRemoveFromCart={handleRemoveFromCart} />
                  </Suspense>
                }
              />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

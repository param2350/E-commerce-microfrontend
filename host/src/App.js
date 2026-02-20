import React, { Suspense, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './styles.css';

// Lazy load Remotes
// The import path corresponds to the 'remotes' key in webpack.config.js
const ProductsApp = React.lazy(() => import('products/ProductsApp'));
const CartApp = React.lazy(() => import('cart/CartApp'));

const Navigation = ({ cartCount }) => {
  return (
    <nav className="nav-bar">
      <div className="nav-logo">MicroStore</div>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/products">Products</Link>
        <Link to="/cart">Cart <span className="badge">{cartCount}</span></Link>
      </div>
    </nav>
  );
};

const Home = () => (
  <div className="home-container">
    <h1>Welcome to MicroStore</h1>
    <p>This is the Host Application running on Port 3000.</p>
    <p>It composes microfrontends from:</p>
    <ul>
      <li><strong>Products MFE</strong> (Port 3001)</li>
      <li><strong>Cart MFE</strong> (Port 3002)</li>
    </ul>
    <div className="architecture-diagram">
      <div className="block host">Host (3000)</div>
      <div className="arrow">⬇ consumes</div>
      <div className="remotes">
        <div className="block remote">Products (3001)</div>
        <div className="block remote">Cart (3002)</div>
      </div>
    </div>
  </div>
);

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
  );
}

import React, { useState, useEffect } from 'react';
import './styles.css';

export default function App({ items, onRemoveFromCart }) {
  // If items prop is provided, use it (Host mode).
  // If not, fall back to internal state (Standalone mode).
  const [internalItems, setInternalItems] = useState([]);
  const isStandalone = !items;

  const cartItems = isStandalone ? internalItems : items;

  useEffect(() => {
    // Only listen for events in standalone mode to avoid double entry if Host is also listening
    if (isStandalone) {
      const handleAddToCart = (event) => {
        const product = event.detail;
        setInternalItems((prev) => [...prev, product]);
      };

      window.addEventListener('mfe:cart:add', handleAddToCart);
      return () => {
        window.removeEventListener('mfe:cart:add', handleAddToCart);
      };
    }
  }, [isStandalone]);

  const removeItem = (index) => {
    if (onRemoveFromCart) {
      onRemoveFromCart(index);
    } else {
      // Standalone fallback
      setInternalItems((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="cart-container">
      <h2>Your Cart ({cartItems.length})</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul className="cart-list">
            {cartItems.map((item, index) => (
              <li key={`${item.id}-${index}`} className="cart-item">
                <span>{item.name}</span>
                <span>${item.price}</span>
                <button onClick={() => removeItem(index)} className="remove-btn">
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <div className="cart-total">
            <h3>Total: ${total}</h3>
            <button className="checkout-btn">Checkout</button>
          </div>
        </>
      )}
    </div>
  );
}

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
      <div className="cart-header">
        <h2>Shopping Cart</h2>
        <p>{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart</p>
      </div>

      {cartItems.length === 0 ? (
        <div className="empty-cart-message">
          <div className="empty-icon">🛒</div>
          <h3>Your cart is empty</h3>
          <p>Looks like you haven't added any gear yet.</p>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-items-section">
            <ul className="cart-list">
              {cartItems.map((item, index) => (
                <li key={`${item.id}-${index}`} className="cart-item">
                  <div className="cart-item-image">
                    {item.image ? (
                      <img src={item.image} alt={item.name} />
                    ) : (
                      <div className="placeholder-image"></div>
                    )}
                  </div>
                  <div className="cart-item-details">
                    <span className="cart-item-category">{item.category || 'Product'}</span>
                    <h4 className="cart-item-name">{item.name}</h4>
                  </div>
                  <div className="cart-item-actions">
                    <span className="cart-item-price">${item.price.toLocaleString()}</span>
                    <button 
                      onClick={() => removeItem(index)} 
                      className="remove-btn"
                      aria-label={`Remove ${item.name} from cart`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="cart-summary-section">
            <div className="summary-card">
              <h3>Order Summary</h3>
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${total.toLocaleString()}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="summary-divider"></div>
              <div className="summary-row total-row">
                <span>Total</span>
                <span>${total.toLocaleString()}</span>
              </div>
              <button className="checkout-btn">Proceed to Checkout</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

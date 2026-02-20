import React from 'react';
import './styles.css';

const products = [
  { id: 1, name: 'Premium Headphones', price: 199, image: 'https://via.placeholder.com/150' },
  { id: 2, name: 'Mechanical Keyboard', price: 129, image: 'https://via.placeholder.com/150' },
  { id: 3, name: '4K Monitor', price: 399, image: 'https://via.placeholder.com/150' },
  { id: 4, name: 'Ergonomic Mouse', price: 79, image: 'https://via.placeholder.com/150' },
];

export default function App({ onAddToCart }) {
  const addToCart = (product) => {
    if (onAddToCart) {
      // Use the callback passed from the Host
      onAddToCart(product);
      console.log('Products: Called onAddToCart callback', product);
    } else {
      // Fallback for standalone mode or if prop is missing
      console.warn('Products: onAddToCart prop is missing. Dispatching legacy event for standalone compatibility.');
      const event = new CustomEvent('mfe:cart:add', {
        detail: product,
      });
      window.dispatchEvent(event);
    }
  };

  return (
    <div className="products-container">
      <h2>Featured Products</h2>
      <div className="product-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <img src={product.image} alt={product.name} />
            <h3>{product.name}</h3>
            <p>${product.price}</p>
            <button onClick={() => addToCart(product)}>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
}

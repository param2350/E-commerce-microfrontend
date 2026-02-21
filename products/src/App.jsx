import React from 'react';
import './styles.css';

const products = [
  { id: 1, name: 'Sony WH-1000XM5', category: 'Audio', price: 398, image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=800&auto=format&fit=crop' },
  { id: 2, name: 'Keychron K8 Pro', category: 'Peripherals', price: 115, image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=800&auto=format&fit=crop' },
  { id: 3, name: 'LG UltraGear 34"', category: 'Displays', price: 799, image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=800&auto=format&fit=crop' },
  { id: 4, name: 'Logitech MX Master 3S', category: 'Peripherals', price: 99, image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c3f3f?q=80&w=800&auto=format&fit=crop' },
  { id: 5, name: 'Herman Miller Embody', category: 'Furniture', price: 1795, image: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?q=80&w=800&auto=format&fit=crop' },
  { id: 6, name: 'Grovemade Desk Shelf', category: 'Accessories', price: 280, image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=800&auto=format&fit=crop' },
];

export default function App({ onAddToCart }) {
  const addToCart = (product) => {
    if (onAddToCart) {
      onAddToCart(product);
      console.log('Products: Called onAddToCart callback', product);
    } else {
      console.warn('Products: onAddToCart prop is missing. Dispatching legacy event.');
      const event = new CustomEvent('mfe:cart:add', { detail: product });
      window.dispatchEvent(event);
    }
  };

  return (
    <div className="products-container">
      <div className="products-header">
        <h2>Featured Equipment</h2>
        <p>Curated gear for your optimal setup.</p>
      </div>
      
      <div className="product-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card group">
            <div className="product-image-container">
              <img src={product.image} alt={product.name} className="product-image" />
              <button 
                className="add-to-cart-btn overlay-btn" 
                onClick={() => addToCart(product)}
                aria-label={`Add ${product.name} to cart`}
              >
                Quick Add +
              </button>
            </div>
            
            <div className="product-info">
              <span className="product-category">{product.category}</span>
              <h3 className="product-name">{product.name}</h3>
              <div className="product-footer">
                <span className="product-price">${product.price.toLocaleString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

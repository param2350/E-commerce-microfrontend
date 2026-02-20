# Beginner-Friendly Microfrontend Demo (React + Webpack 5)

This is a complete, hands-on example of a **Microfrontend (MFE)** architecture using **Module Federation**.  
It simulates a mini e-commerce store where the host app, product list, and cart are all separate, independent applications.

## 🚀 Architecture

This project consists of 3 independent applications:

1.  **Host App (Port 3000)**: The main container. It handles the layout (Header, Nav) and loads the other apps as "Remotes".
2.  **Products MFE (Port 3001)**: A standalone app that displays a list of products.
3.  **Cart MFE (Port 3002)**: A standalone app that manages the shopping cart.

### 🧠 Key Concepts Demonstrated

*   **Module Federation**: Allowing the Host to import components (`ProductsApp`, `CartApp`) from other running servers at runtime.
*   **Decoupled Development**: You can run `products` alone to work on it without starting the `host` or `cart`.
*   **Shared Dependencies**: `react` and `react-dom` are shared effectively to avoid loading them twice.
*   **Cross-MFE Communication**: Using standard browser `CustomEvents` to let the Products MFE tell the Cart MFE to add an item, without them knowing about each other directly.

---

## 🛠 Setup & Running

### Prerequisites
*   Node.js (v14 or higher)
*   npm

### 1. Install Dependencies
Run this in the **root** folder to install dependencies for all 3 apps:
```bash
npm install
npm run install:all
```
*(If `npm run install:all` fails on your system, simply go into `host`, `products`, and `cart` individually and run `npm install`)*

### 2. Run Everything
We have a helper script to start all 3 servers at once:
```bash
npm start
```

### 3. Open in Browser
Visit **[http://localhost:3000](http://localhost:3000)**.

---

## 🧪 How to Verify It Works

1.  **Home Page**: You should see the "Welcome to MicroStore" dashboard.
2.  **Navigation**: Click "Products". You are now seeing code loaded from port 3001!
3.  **Interaction**:
    *   Click "Add to Cart" on a product.
    *   Watch the **Cart Badge** in the header increment (Host listening to event).
4.  **Cart MFE**: Click "Cart". You should see the items you added.
    *   This state is held inside the Cart MFE.
    *   Reloading the page will reset the cart (since we aren't using a persistent backend for this demo).

---

## 📚 What Problem Do Microfrontends Solve?

Imagine a team of 100 frontend developers working on one giant React app.
*   **The Problem**: Builds take forever. One mistake breaks everything. The "Checkout" team has to wait for the "Search" team to merge code before deploying.
*   **The MFE Solution**: The Checkout team owns the `cart` app. They build, test, and deploy it whenever they want. The main site just "loads" the latest version automatically.

### When NOT to use them?
*   **Small Teams**: If you have 5 developers, the complexity of setting this up is **overkill**. Monoliths are faster to build initially.
*   **Performance**: Loading multiple JS files from different servers can be slower if not optimized.
*   **Consistency**: Keeping UI/UX consistent across 10 different teams is hard (need a strong Design System).

---

## 📡 How Communication Works Here

We used the **Event Bus** pattern (simplest for beginners).

**1. Dispatching (in `products/src/App.js`)**
The Products app doesn't know "Cart" exists. It just shouts "Hey, someone added a product!"
```javascript
const event = new CustomEvent('mfe:cart:add', { detail: product });
window.dispatchEvent(event);
```

**2. Listening (in `cart/src/App.js` and `host/src/App.js`)**
The Cart likes to know when products are added.
```javascript
window.addEventListener('mfe:cart:add', (event) => {
  const newItem = event.detail;
  // Update local state...
});
```

**Pros**: Decoupled. Neither app depends on the other's code.
**Cons**: Harder to type-check (in TypeScript). Global events can get messy if not named well.

**Alternative**: A Shared State Library (like Redux/Zustand) would involve ensuring the *same instance* of the store is shared via Webpack's `shared` config. This is cleaner for complex data but harder to set up initially.

---

## 🔧 Deep Dive: Webpack Config

Look at `host/webpack.config.js`:
```javascript
new ModuleFederationPlugin({
  name: 'host',
  remotes: {
    products: 'products@http://localhost:3001/remoteEntry.js',
    // ...
  },
  shared: { react: { singleton: true }, ... }
})
```
*   **`remotes`**: Tells Webpack "If I import 'products/...', go fetch it from this URL".
*   **`shared`**: Critical! Ensures we don't load React 3 times. `singleton: true` forces one copy.

---

## 🐞 Troubleshooting

1.  **"ScriptExternalLoadError: Loading script failed"**
    *   Check if the MFE ports (3001, 3002) are actually running.
    *   Check if you can open `http://localhost:3001/remoteEntry.js` in your browser.

2.  **"Invalid Hook Call" / React Errors**
    *   This usually means React is loaded twice.
    *   Ensure `shared: { react: { singleton: true } }` is in ALL webpack configs.
    *   Ensure `src/bootstrap.js` pattern is used (the `import('./bootstrap')` in `index.js` gives Webpack time to load shared deps).

3.  **CORS Errors**
    *   Webpack Dev Server headers `Access-Control-Allow-Origin: *` are usually handled by default in newer versions, but if deploying, you need to enable CORS on your S3 bucket or Nginx server.

---

## 🔮 Next Steps

1.  **Shared Component Library**: Create a `/shared-ui` folder and expose buttons/inputs so all MFEs look the same.
2.  **Versioning**: Deploy `products/v1.remoteEntry.js` and `products/v2.remoteEntry.js` for A/B testing.
3.  **Authentication**: Pass an auth token from Host to Remotes so they can make API calls.

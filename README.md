# Shopify Headless App

[![Build and Deploy](https://github.com/yourusername/shopify-headless-app/actions/workflows/build-and-deploy.yml/badge.svg)](https://github.com/yourusername/shopify-headless-app/actions/workflows/build-and-deploy.yml)

> ✅ **REFACTORING COMPLETE** - The declarative data-attribute system is now fully functional!
> All image rendering, price formatting, and template features are working correctly.

A headless Shopify application using JavaScript for managing products, collections, and cart functionality. Perfect for integrating Shopify into existing websites like Webflow.

## Features

- Product browsing and search
- Collection management
- Cart functionality with localStorage persistence
- Checkout integration
- **localStorage cache persistence** for products, collections, and search results
- **Declarative data-attribute system** - No JavaScript coding required!
- Clean separation of GraphQL queries

## Setup

1. **Clone and install dependencies:**

   ```bash
   npm install
   ```

2. **Configure environment variables:**
   Copy `.env.example` to `.env` and fill in your Shopify details:

   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your Shopify store details:

   ```
   SHOPIFY_DOMAIN=your-store.myshopify.com
   STOREFRONT_TOKEN=your-storefront-access-token
   API_VERSION=2023-04
   CACHE_TTL=300000
   ```

3. **Build the project:**
   ```bash
   npm run build
   ```
   This creates `dist/shopify-headless-app.js` that you can upload to your CDN.

## Development

Run the development server:

```bash
npm run dev
```

## Project Structure

```
├── src/                    # Source code
├── dist/                   # Built files
├── examples/              # Demo and example files
│   ├── simple-declarative-example.html
│   ├── declarative-demo.html
│   ├── debug-data.html
│   └── index.html
├── tests/                 # Test files
│   ├── cache-test.html
│   └── declarative-test.html
├── docs/                  # Documentation
│   ├── DECLARATIVE_SYSTEM.md
│   ├── CACHE_IMPLEMENTATION.md
│   ├── CART_API_MIGRATION.md
│   └── DEPLOYMENT.md
└── README.md
```

## Examples & Documentation

- **Quick Start**: See `examples/simple-declarative-example.html` for a minimal example
- **Full Demo**: Check `examples/declarative-demo.html` for all features
- **System Documentation**: Read `docs/DECLARATIVE_SYSTEM.md` for detailed docs
- **Testing**: Use files in `tests/` directory for testing functionality

## Quick Start: Declarative Mode (Recommended)

The easiest way to use Shopify Headless App is with declarative data attributes. No JavaScript coding required!

### 1. Basic Setup

```html
<!DOCTYPE html>
<html>
  <head>
    <title>My Shopify Store</title>
  </head>
  <body>
    <!-- Your content will automatically load here -->
    <div
      data-shopify="products"
      data-collection="shirts"
      data-template="product-card"
      data-limit="8"
    ></div>

    <!-- Define how products should look -->
    <template id="product-card">
      <div class="product">
        <img src="{{image}}" alt="{{title}}" />
        <h3>{{title}}</h3>
        <p>${{price}}</p>
        <button data-add-to-cart="{{variantId}}">Add to Cart</button>
      </div>
    </template>

    <!-- Load the app -->
    <script src="https://your-cdn.com/shopify-headless-app.js"></script>
  </body>
</html>
```

### 2. Available Data Attributes

| Attribute                    | Description                     | Example                     |
| ---------------------------- | ------------------------------- | --------------------------- |
| `data-shopify="products"`    | Load products from a collection | `data-collection="shirts"`  |
| `data-shopify="product"`     | Load a single product           | `data-handle="cool-shirt"`  |
| `data-shopify="collections"` | Load all collections            | `data-limit="10"`           |
| `data-shopify="search"`      | Search products                 | `data-query="summer"`       |
| `data-shopify="cart"`        | Display cart contents           | `data-template="cart-item"` |

### 3. Template Variables

Use these variables in your `<template>` elements:

| Variable          | Description                        |
| ----------------- | ---------------------------------- |
| `{{title}}`       | Product/collection title           |
| `{{price}}`       | Product price                      |
| `{{image}}`       | First product image                |
| `{{description}}` | Product description                |
| `{{variantId}}`   | First variant ID (for add to cart) |
| `{{handle}}`      | Product handle (URL slug)          |

### 4. Interactive Elements

| Attribute                          | Description                    |
| ---------------------------------- | ------------------------------ |
| `data-add-to-cart="{{variantId}}"` | Add product to cart            |
| `data-variant-selector`            | Dropdown for variant selection |
| `data-quantity="2"`                | Set quantity (default: 1)      |

## Usage in Webflow

1. Upload the built `dist/shopify-headless-app.js` to your hosting/CDN
2. Add to your Webflow site's Custom Code (before `</body>`):

```html
<script src="https://your-cdn.com/shopify-headless-app.js"></script>
<script>
  document.addEventListener('DOMContentLoaded', async () => {
    // Fetch and display collections
    const collections = await ShopifyHeadlessApp.fetchCollections();
    ShopifyHeadlessApp.renderCollections(collections);

    // Search functionality
    document
      .getElementById('search-form')
      .addEventListener('submit', async (e) => {
        e.preventDefault();
        const term = e.target.querySelector('input').value;
        const results = await ShopifyHeadlessApp.searchProducts(term);
        ShopifyHeadlessApp.renderSearchResults(results);
      });
  });
</script>
```

## Project Structure

```
shopify-headless-app
├── src
│   ├── constants.js        # Contains class name constants for styling and element identification
│   ├── config.js           # Configuration constants for API requests and caching
│   ├── cache.js            # Caching functionality for optimizing data retrieval
│   ├── api.js              # Handles API requests to the Shopify Storefront API
│   ├── products.js         # Functions to fetch product data from the Shopify API
│   ├── collections.js       # Functions to fetch collection data and products within collections
│   ├── search.js           # Functionality for searching products
│   ├── cart.js             # Manages cart functionality
│   ├── checkout.js         # Handles checkout process
│   ├── renderers.js        # Functions for rendering components in the application
│   ├── pagination.js       # Pagination functionality for managing item display
│   └── index.js            # Entry point for the application
├── package.json             # npm configuration file
└── README.md                # Project documentation
```

## Setup Instructions

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd shopify-headless-app
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure your Shopify Storefront API credentials:**

   - Update the `src/config.js` file with your `SHOPIFY_DOMAIN` and `STOREFRONT_TOKEN`.

4. **Run the application:**
   ```bash
   npm start
   ```

## Usage

- The application allows users to browse products, view collections, search for items, manage their cart, and proceed to checkout.
- The UI components are rendered dynamically based on the data fetched from the Shopify API.

## Checkout

- `checkout()` - Create cart and redirect to Shopify checkout (uses modern Cart API)
- `checkoutExistingCart()` - Use existing cart or create new one for checkout
- `createCart(lineItems)` - Create a new Shopify cart
- `getCartDetails(cartId)` - Get cart details by ID
- `addToCartAPI(cartId, lineItems)` - Add items to existing cart

## Cart API Migration

This project has been updated to use Shopify's modern **Cart API** instead of the deprecated Checkout API. The new implementation:

✅ **Uses Cart API** - Modern, supported approach
✅ **Better Performance** - More efficient cart operations
✅ **Enhanced Features** - Better cart management capabilities
✅ **Future-Proof** - Won't be deprecated like the old Checkout API

### Key Changes:

- `checkout()` now creates a cart using Cart API and redirects to `checkoutUrl`
- Cart operations are more robust with proper error handling
- Local cart changes automatically invalidate stored cart IDs
- Supports both new cart creation and existing cart checkout

### Migration Notes:

- Old checkout URLs using deprecated Checkout API will no longer work
- All cart operations now use the Cart API GraphQL mutations
- Cart IDs are stored locally for better cart persistence

## Cache System

The application now uses **localStorage for cache persistence**, meaning cached data (products, collections, search results) will persist between browser sessions.

### Cache Management

**Debugging Cache:**

```javascript
// In browser console
CartTests.debugCacheState(); // Show all cache contents
ShopifyCacheDebug.debugCache(); // Detailed cache view
```

**Clearing Cache:**

```javascript
// Clear all cache
ShopifyCacheDebug.clearCache();

// Clear specific cache type
ShopifyCacheDebug.clearCache('products');
ShopifyCacheDebug.clearCache('collections');
ShopifyCacheDebug.clearCache('search');
```

**Cache Location:**
Cache data is stored in localStorage with these keys:

- `shopify-cache-productById` - Product details by ID
- `shopify-cache-productByHandle` - Product details by handle
- `shopify-cache-collections` - Products within collections
- `shopify-cache-search` - Search results
- `shopify-cache-collectionsList` - List of all collections

**Cache Duration:**
Cache entries expire after 5 minutes (configurable via `CACHE_TTL` environment variable).

## Troubleshooting

If you encounter issues with the Cart API or checkout functionality:

📋 **See [CART_API_MIGRATION.md](./CART_API_MIGRATION.md)** for detailed troubleshooting guide

Common issues:

- **Checkout not working?** Check your Storefront API credentials
- **Invalid variant IDs?** Make sure you're using real product variant IDs from your store
- **Environment variables not loading?** Verify your `.env` file and build process

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License.

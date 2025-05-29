# Shopify Headless App

[![Build and Deploy](https://github.com/yourusername/shopify-headless-app/actions/workflows/build-and-deploy.yml/badge.svg)](https://github.com/yourusername/shopify-headless-app/actions/workflows/build-and-deploy.yml)

A headless Shopify application using JavaScript for managing products, collections, and cart functionality. Perfect for integrating Shopify into existing websites like Webflow.

## Features

- Product browsing and search
- Collection management
- Cart functionality
- Checkout integration
- Caching for performance
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

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License.

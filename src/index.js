// Export all modules for UMD bundle
export * as Config from './config.js';
export * as Products from './products.js';
export * as Collections from './collections.js';
export * as Search from './search.js';
export * as Cart from './cart.js';
export * as Checkout from './checkout.js';
export * as Render from './renderers.js';
export { paginate } from './pagination.js';
export * as Utils from './utils.js';
export { clearCache, debugCache } from './cache.js';

// Import validateConfig for internal use
import { validateConfig } from './utils.js';

// Import and export declarative system
import ShopifyDeclarativeLoader from './declarative.js';
export { ShopifyDeclarativeLoader };

// Initialize when used as a script tag
if (typeof window !== 'undefined') {
  // Make declarative loader available globally
  window.ShopifyDeclarativeLoader = ShopifyDeclarativeLoader;
  
  document.addEventListener('DOMContentLoaded', async () => {
    console.log('Shopify Headless App loaded');

    try {
      // Validate configuration
      validateConfig();
      console.log('Configuration validated successfully');
    } catch (error) {
      console.error('Configuration error:', error.message);
      console.log('Please check your environment variables in .env file');
    }
  });
}

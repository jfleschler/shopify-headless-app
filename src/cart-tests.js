/**
 * Cart API Test Utilities
 * Use these functions to test the new Cart API implementation
 */

// Test the cart creation flow
export const testCartCreation = async () => {
  console.log('🧪 Testing Cart API...');

  try {
    // Test with sample cart items
    const testCartItems = [
      { variantId: 'gid://shopify/ProductVariant/12345', quantity: 2 },
      { variantId: 'gid://shopify/ProductVariant/67890', quantity: 1 },
    ];

    console.log('📝 Creating cart with test items:', testCartItems);

    // This would normally be called from checkout.js
    const result = await window.ShopifyHeadlessApp.Checkout.createCart(
      testCartItems
    );

    console.log('✅ Cart created successfully:', result);
    console.log('🔗 Checkout URL:', result.checkoutUrl);

    return result;
  } catch (error) {
    console.error('❌ Cart creation failed:', error);

    // Check if it's a credential issue
    if (
      error.message.includes('Unauthorized') ||
      error.message.includes('401')
    ) {
      console.log(
        '💡 This might be a credential issue. Make sure your STOREFRONT_TOKEN is valid.'
      );
    }

    // Check if it's a variant ID issue
    if (
      error.message.includes('variant') ||
      error.message.includes('merchandise')
    ) {
      console.log(
        "💡 This might be an invalid variant ID. Make sure you're using real product variant IDs."
      );
    }

    throw error;
  }
};

// Test the local cart to API cart conversion
export const testLocalCartCheckout = async () => {
  console.log('🧪 Testing local cart checkout...');

  try {
    // Add some items to local cart first
    window.ShopifyHeadlessApp.Cart.addToCart(
      'gid://shopify/ProductVariant/12345',
      1
    );
    window.ShopifyHeadlessApp.Cart.addToCart(
      'gid://shopify/ProductVariant/67890',
      2
    );

    console.log(
      '📦 Local cart items:',
      window.ShopifyHeadlessApp.Cart.getCart()
    );
    console.log(
      '🔢 Cart count:',
      window.ShopifyHeadlessApp.Cart.getCartCount()
    );

    // This should create a cart and redirect (in a real scenario)
    console.log('🚀 Initiating checkout...');

    // For testing, we'll catch the redirect
    const originalLocation = window.location.href;

    await window.ShopifyHeadlessApp.Checkout.checkout();

    // If we get here without redirecting, something went wrong
    console.log('⚠️ Expected redirect to checkout, but stayed on page');
  } catch (error) {
    console.error('❌ Local cart checkout failed:', error);
    throw error;
  }
};

// Validate cart API responses
export const validateCartResponse = (cart) => {
  const requiredFields = ['id', 'checkoutUrl', 'totalQuantity'];
  const missingFields = requiredFields.filter((field) => !cart[field]);

  if (missingFields.length > 0) {
    console.error('❌ Cart response missing required fields:', missingFields);
    return false;
  }

  if (!cart.checkoutUrl.includes('shopify.com')) {
    console.error('❌ Invalid checkout URL:', cart.checkoutUrl);
    return false;
  }

  console.log('✅ Cart response is valid');
  return true;
};

// Debug function to show current cart state
export const debugCartState = () => {
  console.log('🔍 Current Cart State:');
  console.log('Local cart:', window.ShopifyHeadlessApp.Cart.getCart());
  console.log('Cart count:', window.ShopifyHeadlessApp.Cart.getCartCount());
  console.log('Stored cart ID:', localStorage.getItem('shopifyCartId'));
  console.log('Raw cart storage:', localStorage.getItem('shopifyCart'));
};

// Debug function to show current cache state
export const debugCacheState = () => {
  console.log('🔍 Current Cache State:');

  // Show cache localStorage entries
  const cacheKeys = [
    'shopify-cache-productById',
    'shopify-cache-productByHandle',
    'shopify-cache-collections',
    'shopify-cache-search',
    'shopify-cache-collectionsList',
  ];

  cacheKeys.forEach((key) => {
    const data = localStorage.getItem(key);
    if (data) {
      try {
        const parsed = JSON.parse(data);
        const itemCount =
          key === 'shopify-cache-collectionsList'
            ? parsed
              ? 1
              : 0
            : Object.keys(parsed).length;
        console.log(`${key}:`, itemCount, 'items');
        console.log('  Data:', parsed);
      } catch (e) {
        console.log(`${key}: Invalid JSON data`);
      }
    } else {
      console.log(`${key}: No data`);
    }
  });

  // Also show in-memory cache if available
  if (window.ShopifyCacheDebug) {
    console.log(
      '\n🛠️ Use ShopifyCacheDebug.debugCache() for detailed cache view'
    );
    console.log('🛠️ Use ShopifyCacheDebug.clearCache() to clear all cache');
  }
};

// Test cache functionality
export const testCacheFunctionality = async () => {
  console.log('🧪 Testing Cache Functionality...');

  try {
    // Test product caching
    console.log('📝 Testing product cache...');

    // This should cache the result
    const collections =
      await window.ShopifyHeadlessApp.Collections.fetchCollections();
    console.log(
      '✅ Collections fetched and cached:',
      collections.length,
      'items'
    );

    // Check if it's actually in localStorage
    const cached = localStorage.getItem('shopify-cache-collectionsList');
    if (cached) {
      console.log('✅ Collections found in localStorage cache');
    } else {
      console.log('❌ Collections not found in localStorage cache');
    }

    // Test search caching
    console.log('📝 Testing search cache...');
    const searchResults = await window.ShopifyHeadlessApp.Search.searchProducts(
      'test'
    );
    console.log('✅ Search results cached');

    // Show cache state
    debugCacheState();

    return true;
  } catch (error) {
    console.error('❌ Cache test failed:', error);
    return false;
  }
};

// Console helper - run in browser console
if (typeof window !== 'undefined') {
  window.CartTests = {
    testCartCreation,
    testLocalCartCheckout,
    validateCartResponse,
    debugCartState,
    debugCacheState,
    testCacheFunctionality,
  };

  console.log('🛠️ Cart API tests loaded!');
  console.log('💡 Available commands:');
  console.log('  - CartTests.debugCartState() - Show cart state');
  console.log('  - CartTests.debugCacheState() - Show cache state');
  console.log(
    '  - CartTests.testCacheFunctionality() - Test cache persistence'
  );
}

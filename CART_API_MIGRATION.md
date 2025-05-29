# Cart API Migration Troubleshooting

## Common Issues and Solutions

### 1. **Checkout Button Not Working**

**Symptoms:**
- Clicking checkout does nothing
- Console shows errors about cart creation
- Getting 401/403 errors

**Solutions:**
```javascript
// Check your credentials in browser console
console.log('Domain:', window.ShopifyHeadlessApp.Config.SHOPIFY_DOMAIN);
console.log('Has Token:', !!window.ShopifyHeadlessApp.Config.STOREFRONT_TOKEN);

// Test with sample cart
CartTests.debugCartState();
```

### 2. **Invalid Variant IDs**

**Symptoms:**
- Cart creation fails with "Invalid variant ID" 
- Console shows merchandise errors

**Solutions:**
- Make sure variant IDs are in format: `gid://shopify/ProductVariant/123456789`
- Use real product variant IDs from your store
- Test with products from your actual Shopify store

### 3. **Environment Variables Not Loading**

**Symptoms:**
- Getting default placeholder values
- STOREFRONT_TOKEN shows "your-storefront-access-token"

**Solutions:**
```bash
# Check your .env file exists
ls -la .env

# Verify webpack config includes dotenv
grep -n "Dotenv" webpack.config.js

# Rebuild with environment variables
npm run build
```

### 4. **GitHub Actions Build Failing**

**Symptoms:**
- Actions show environment variable errors
- Build succeeds but runtime shows placeholder values

**Solutions:**
1. Check GitHub repository secrets:
   - Go to Settings → Secrets and Variables → Actions
   - Verify `SHOPIFY_DOMAIN` and `STOREFRONT_TOKEN` are set

2. Update workflow file to use secrets properly:
```yaml
env:
  SHOPIFY_DOMAIN: ${{ secrets.SHOPIFY_DOMAIN }}
  STOREFRONT_TOKEN: ${{ secrets.STOREFRONT_TOKEN }}
```

### 5. **Cart Items Not Persisting**

**Symptoms:**
- Cart empties on page refresh
- Cart count shows 0 unexpectedly

**Solutions:**
```javascript
// Check localStorage
console.log('Stored cart:', localStorage.getItem('shopifyCart'));
console.log('Stored cart ID:', localStorage.getItem('shopifyCartId'));

// Clear and rebuild cart
localStorage.removeItem('shopifyCart');
localStorage.removeItem('shopifyCartId');
```

## Testing the New Cart API

### Quick Test in Browser Console

```javascript
// 1. Add items to cart
ShopifyHeadlessApp.Cart.addToCart('gid://shopify/ProductVariant/REAL_ID', 2);

// 2. Check cart state
CartTests.debugCartState();

// 3. Test checkout (will redirect if successful)
ShopifyHeadlessApp.Checkout.checkout();
```

### Test with Real Products

1. **Get real variant IDs:**
   - Go to your Shopify admin
   - Find a product → Variants
   - Copy the variant ID (usually a long number)
   - Format as: `gid://shopify/ProductVariant/YOUR_VARIANT_ID`

2. **Test the full flow:**
```javascript
// Use real variant ID from your store
const realVariantId = 'gid://shopify/ProductVariant/123456789';
ShopifyHeadlessApp.Cart.addToCart(realVariantId, 1);
ShopifyHeadlessApp.Checkout.checkout();
```

## API Differences: Old vs New

### Old Checkout API (Deprecated)
```javascript
// ❌ Old way - no longer works
const mutation = `mutation($input: CheckoutCreateInput!) {
  checkoutCreate(input: $input) {
    checkout { webUrl }
  }
}`;
```

### New Cart API (Current)
```javascript
// ✅ New way - uses Cart API
const mutation = `mutation cartCreate($input: CartInput!) {
  cartCreate(input: $input) {
    cart { 
      id 
      checkoutUrl 
    }
  }
}`;
```

## Key Migration Changes

1. **API Endpoint:** Still uses Storefront API GraphQL
2. **Mutation Name:** `checkoutCreate` → `cartCreate`
3. **Input Format:** `CheckoutCreateInput` → `CartInput`
4. **Response Field:** `checkout.webUrl` → `cart.checkoutUrl`
5. **Line Items:** Same format, different wrapper

## Getting Help

If you're still having issues:

1. **Check the console** for specific error messages
2. **Use the debug tools** provided in `cart-tests.js`
3. **Verify your Shopify setup** has Storefront API enabled
4. **Test with minimal cart** (single item) first
5. **Check Shopify's API documentation** for Cart API specifics

## Useful Links

- [Shopify Cart API Documentation](https://shopify.dev/docs/api/storefront/latest/mutations/cartcreate)
- [Storefront API Access Token Setup](https://shopify.dev/docs/api/usage/authentication#getting-started-with-private-access)
- [GraphQL Playground for Testing](https://shopify.dev/docs/api/usage/graphql-playground)

import { request } from './api.js';
import { CREATE_CART, ADD_CART_LINES, GET_CART } from './queries/checkout.js';

// Modern Cart API approach
export const createCart = async (lineItems = []) => {
  try {
    const cartInput = {
      lines: lineItems.map((item) => ({
        quantity: item.quantity,
        merchandiseId: item.variantId,
      })),
    };

    const { cartCreate } = await request(CREATE_CART, { input: cartInput });

    if (cartCreate.userErrors && cartCreate.userErrors.length > 0) {
      throw new Error(
        cartCreate.userErrors.map((error) => error.message).join(', ')
      );
    }

    // Store cart ID for future operations
    localStorage.setItem('shopifyCartId', cartCreate.cart.id);

    return cartCreate.cart;
  } catch (error) {
    console.error('Error creating cart:', error);
    throw error;
  }
};

export const getCartDetails = async (cartId) => {
  try {
    const { cart } = await request(GET_CART, { id: cartId });
    return cart;
  } catch (error) {
    console.error('Error fetching cart:', error);
    throw error;
  }
};

export const addToCartAPI = async (cartId, lineItems) => {
  try {
    const lines = lineItems.map((item) => ({
      quantity: item.quantity,
      merchandiseId: item.variantId,
    }));

    const { cartLinesAdd } = await request(ADD_CART_LINES, {
      cartId,
      lines,
    });

    if (cartLinesAdd.userErrors && cartLinesAdd.userErrors.length > 0) {
      throw new Error(
        cartLinesAdd.userErrors.map((error) => error.message).join(', ')
      );
    }

    return cartLinesAdd.cart;
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
};

// Main checkout function - creates cart and redirects to checkout
export const checkout = async () => {
  try {
    const localCart = JSON.parse(localStorage.getItem('shopifyCart') || '[]');

    if (localCart.length === 0) {
      throw new Error('Cart is empty');
    }

    // Create a new cart with current items
    const cart = await createCart(localCart);

    if (!cart.checkoutUrl) {
      throw new Error('Failed to get checkout URL');
    }

    // Redirect to Shopify checkout
    window.location.href = cart.checkoutUrl;
  } catch (error) {
    console.error('Checkout error:', error);
    alert(`Checkout failed: ${error.message}`);
    throw error;
  }
};

// Alternative: Get existing cart and redirect to checkout
export const checkoutExistingCart = async () => {
  try {
    const cartId = localStorage.getItem('shopifyCartId');

    if (!cartId) {
      // No existing cart, create a new one
      return await checkout();
    }

    const cart = await getCartDetails(cartId);

    if (!cart || !cart.checkoutUrl) {
      // Cart doesn't exist or has issues, create a new one
      localStorage.removeItem('shopifyCartId');
      return await checkout();
    }

    // Redirect to existing cart checkout
    window.location.href = cart.checkoutUrl;
  } catch (error) {
    console.error('Existing cart checkout error:', error);
    // Fallback to creating new cart
    return await checkout();
  }
};

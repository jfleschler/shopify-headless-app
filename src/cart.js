// filepath: /shopify-headless-app/shopify-headless-app/src/cart.js
import { request } from './api.js';
import { GET_CART_VARIANTS } from './queries/cart.js';
import { createCart, addToCartAPI, getCartDetails } from './checkout.js';

let cart = JSON.parse(localStorage.getItem('shopifyCart') || '[]');

const sync = () => localStorage.setItem('shopifyCart', JSON.stringify(cart));

export const addToCart = (variantId, qty = 1) => {
  const item = cart.find((i) => i.variantId === variantId);
  if (item) {
    item.quantity += qty;
  } else {
    cart.push({ variantId, quantity: qty });
  }
  sync();
  
  // Clear stored cart ID when local cart changes
  // This ensures we create a fresh cart on checkout
  localStorage.removeItem('shopifyCartId');
};

export const removeFromCart = (variantId) => {
  cart = cart.filter((i) => i.variantId !== variantId);
  sync();
  localStorage.removeItem('shopifyCartId');
};

export const updateCartItem = (variantId, qty) => {
  const item = cart.find((i) => i.variantId === variantId);
  if (item) {
    if (qty <= 0) {
      removeFromCart(variantId);
    } else {
      item.quantity = qty;
      sync();
      localStorage.removeItem('shopifyCartId');
    }
  }
};

export const clearCart = () => {
  cart = [];
  sync();
  localStorage.removeItem('shopifyCartId');
};

export const getCart = () => [...cart];

export const getCartCount = () =>
  cart.reduce((sum, item) => sum + item.quantity, 0);

export const hydrateCart = async () => {
  if (!cart.length) return [];
  const ids = cart.map((i) => i.variantId);
  const { nodes } = await request(GET_CART_VARIANTS, { ids });
  return nodes.map((n) => ({
    variantId: n.id,
    quantity: cart.find((i) => i.variantId === n.id).quantity,
    price: n.price.amount,
    product: {
      id: n.product.id,
      title: n.product.title,
      handle: n.product.handle,
      image: n.product.images.edges[0]?.node.url || '',
    },
  }));
};

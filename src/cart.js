// filepath: /shopify-headless-app/shopify-headless-app/src/cart.js
import { request } from './api.js';
import { GET_CART_VARIANTS } from './queries/cart.js';

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
};

export const removeFromCart = (variantId) => {
  cart = cart.filter((i) => i.variantId !== variantId);
  sync();
};

export const updateCartItem = (variantId, qty) => {
  const item = cart.find((i) => i.variantId === variantId);
  if (item) {
    item.quantity = qty;
  }
  sync();
};

export const clearCart = () => {
  cart = [];
  sync();
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

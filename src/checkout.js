import { request } from './api.js';
import { CREATE_CHECKOUT } from './queries/checkout.js';

export const checkout = async () => {
  const lineItems = JSON.parse(localStorage.getItem('shopifyCart') || '[]');
  const { checkoutCreate } = await request(CREATE_CHECKOUT, {
    input: { lineItems },
  });
  window.location.href = checkoutCreate.checkout.webUrl;
};

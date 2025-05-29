import { API_URL, STOREFRONT_TOKEN } from './config.js';
import { handleApiError } from './utils.js';

export const request = async (query, variables = {}) => {
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'X-Shopify-Storefront-Access-Token': STOREFRONT_TOKEN,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, variables }),
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const { data, errors } = await res.json();

    if (errors) {
      throw new Error(errors.map((e) => e.message).join('\n'));
    }

    return data;
  } catch (error) {
    return handleApiError(error, 'Shopify API request');
  }
};

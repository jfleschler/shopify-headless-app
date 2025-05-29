export const SHOPIFY_DOMAIN =
  process.env.SHOPIFY_DOMAIN || 'your-store.myshopify.com';
export const STOREFRONT_TOKEN =
  process.env.STOREFRONT_TOKEN || 'your-storefront-access-token';
export const API_VERSION = process.env.API_VERSION || '2023-04';
export const API_URL = `https://${SHOPIFY_DOMAIN}/api/${API_VERSION}/graphql.json`;
export const CACHE_TTL = parseInt(process.env.CACHE_TTL) || 5 * 60 * 1000; // 5 minutes

// Error handling utilities
export const handleApiError = (error, context = 'API request') => {
  console.error(`Error in ${context}:`, error);

  // You can customize this based on your needs
  if (error.message.includes('GraphQL')) {
    console.error('GraphQL Error - check your query syntax');
  }

  if (error.message.includes('Unauthorized')) {
    console.error('Authentication Error - check your Storefront Access Token');
  }

  // Return a user-friendly error object
  return {
    error: true,
    message: 'Something went wrong. Please try again later.',
    details: error.message,
  };
};

export const validateRequired = (value, name) => {
  if (!value) {
    throw new Error(`${name} is required`);
  }
  return value;
};

export const validateConfig = () => {
  const errors = [];

  if (
    !process.env.SHOPIFY_DOMAIN ||
    process.env.SHOPIFY_DOMAIN === 'your-store.myshopify.com'
  ) {
    errors.push('SHOPIFY_DOMAIN must be configured');
  }

  if (
    !process.env.STOREFRONT_TOKEN ||
    process.env.STOREFRONT_TOKEN === 'your-storefront-access-token'
  ) {
    errors.push('STOREFRONT_TOKEN must be configured');
  }

  if (errors.length > 0) {
    throw new Error(`Configuration errors: ${errors.join(', ')}`);
  }
};

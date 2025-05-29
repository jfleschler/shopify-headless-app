export const CREATE_CHECKOUT = `
  mutation($input: CheckoutCreateInput!) {
    checkoutCreate(input: $input) {
      checkout {
        webUrl
      }
      checkoutUserErrors {
        field
        message
      }
    }
  }
`;

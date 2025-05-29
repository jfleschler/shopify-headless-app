export const GET_CART_VARIANTS = `
  query($ids: [ID!]!) {
    nodes(ids: $ids) {
      ...on ProductVariant {
        id
        price {
          amount
        }
        product {
          id
          title
          handle
          images(first: 1) {
            edges {
              node {
                url
              }
            }
          }
        }
      }
    }
  }
`;

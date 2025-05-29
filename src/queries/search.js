export const SEARCH_PRODUCTS = `
  query($q: String!) {
    products(first: 100, query: $q) {
      edges {
        node {
          id
          title
          images(first: 1) {
            edges {
              node {
                url
              }
            }
          }
          variants(first: 1) {
            edges {
              node {
                id
                price {
                  amount
                }
              }
            }
          }
        }
      }
    }
  }
`;

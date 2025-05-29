export const GET_COLLECTIONS = `
  query {
    collections(first: 50) {
      edges {
        node {
          id
          title
          handle
        }
      }
    }
  }
`;

export const GET_PRODUCTS_BY_COLLECTION = `
  query($collectionTitle: String!) {
    collections(first: 1, query: $collectionTitle) {
      edges {
        node {
          products(first: 100) {
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
      }
    }
  }
`;

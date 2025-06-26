export const GET_COLLECTIONS = `
  query {
    collections(first: 50) {
      edges {
        node {
          id
          title
          handle
          description
          image {
            url
          }
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
                handle
                description
                images(first: 5) {
                  edges {
                    node {
                      url
                      altText
                    }
                  }
                }
                variants(first: 10) {
                  edges {
                    node {
                      id
                      title
                      price {
                        amount
                        currencyCode
                      }
                      availableForSale
                    }
                  }
                }
                priceRange {
                  minVariantPrice {
                    amount
                    currencyCode
                  }
                  maxVariantPrice {
                    amount
                    currencyCode
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

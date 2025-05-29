export const GET_PRODUCT_BY_ID = `
  query($id: ID!) {
    product(id: $id) {
      id
      title
      description
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
`;

export const GET_PRODUCT_BY_HANDLE = `
  query($handle: String!) {
    productByHandle(handle: $handle) {
      id
      title
      description
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
`;

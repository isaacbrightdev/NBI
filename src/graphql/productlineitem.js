const PRODUCT_LINE_ITEM_QUERY = `#graphql
  query GetProduct($handle: String!) {
    product(handle: $handle) {
      id
      tags
      included_formats: metafield(namespace: "course", key:"included_formats") {
         value
      }
      variants(first: 10) {
        edges {
          node {
            id
            selectedOptions {
              name
              value
            }
            credits: metafield(namespace: "course", key: "credits"){
              id
              key
              namespace
              value
              type
            }
          }
        }
      }
      productType
    }
  }
`;

export default PRODUCT_LINE_ITEM_QUERY;

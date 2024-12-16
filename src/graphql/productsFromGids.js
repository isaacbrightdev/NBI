const PRODUCT_QUERY_BY_GIDS = `#graphql
  query GetProductsByGIDs($ids: [ID!]!, $fields: [HasMetafieldsIdentifier!]!) {
    nodes(ids: $ids) {
      ... on Product {
        id
        title
        handle
        description
        featuredImage {
          id
          url
        }
        image: images(first: 1) {
          edges {
            node {
              id
              url
            }
          }
        }
        metafields(identifiers: $fields) {
          id
          key
          namespace
          value
          type
        }
        rating: metafield(namespace: "course", key: "rating") {
          value
          type
        }
        tags
        product_type: productType
        variants(first: 10) {
          edges {
            node {
              id
              title
              barcode
              credits: metafield(namespace: "course", key: "credits") {
                id
                key
                namespace
                value
                type
              }
            }
          }
        }
      }
    }
  }
`;

export default PRODUCT_QUERY_BY_GIDS;

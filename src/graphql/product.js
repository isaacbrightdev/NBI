const PRODUCT_QUERY = `#graphql
  query GetProduct($handle: String!, $fields: [HasMetafieldsIdentifier!]!) {
    product(handle: $handle) {
      id
      title
      collections(first: 10) {
        edges {
          node {
            id
            title
            handle
          }
        }
      }
      descriptionHtml
      tags
      published_at: publishedAt
      featuredImage {
        id
        url
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
      metafields(identifiers: $fields) {
        id
        key
        namespace
        value
        type
      }
      collections(first: 10){
        edges {
          node {
            id
            title
            handle
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
            sku
            barcode
            availableForSale
            quantityAvailable
            image {
              id
              url
            }
            selectedOptions {
              name
              value
            }
            credits: metafield(namespace: "course", key: "credits") {
              id
              key
              namespace
              value
              type
            }
            discount: metafield(namespace: "discount", key: "details") {
              id
              key
              namespace
              value
              type
            }
            descriptionSubtext: metafield(namespace: "course", key: "description-subtext") {
              value
            }
            product {
              included_formats: metafield(namespace: "course", key: "included_formats"){
                value
                type
              }
            }
          }
        }
      }
      tags
      productType
      product_type: productType
    }
  }
`;

export default PRODUCT_QUERY;

export const BASIC_PRODUCT_QUERY = `#graphql
  query GetBasicProductQuery($handle: String!) {
    product(handle: $handle) {
      id
      title
      productType
      vendor
      variants(first: 1) {
        edges {
          node {
            id
            title
            sku
            price {
              amount
            }
            sellingPlanAllocations(first: 1) {
              edges {
                node {
                  sellingPlan {
                    id
                    name
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

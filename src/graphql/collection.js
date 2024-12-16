const COLLECTION_QUERY = `#graphql
query GetCollection($handle: String!) {
	collection(handle: $handle) {
		id
    title
    handle
    products(first: 15) {
      edges {
        node {
          title
          featuredImage {
            id
            url
          }
          description
          descriptionHtml
          handle
          id
          product_type: productType
          published_at: publishedAt
          tags
          rating: metafield(namespace: "course", key: "rating") {
            value
            type
          }
          hours: metafield(namespace: "course", key: "hours") {
            value
            type
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
          variants(first: 10) {
            edges {
              node {
                id
                title
                availableForSale
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
                price {
                  amount
                  currencyCode
                }
                compareAtPrice {
                  amount
                  currencyCode
                }
                credits: metafield(namespace: "course", key: "credits") {
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
              }
            }
          }
        }
      }
    }
	}
}`;

export default COLLECTION_QUERY;

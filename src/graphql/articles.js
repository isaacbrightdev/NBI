const RELATED_ARTICLES_QUERY = `#graphql
  query($handle: String!, $query: String!){
    blog(handle: $handle) {
        articles(first: 10, query: $query, sortKey: PUBLISHED_AT) {
            edges {
                node {
                    title
                    id
                    image {
                        altText
                        url
                        height
                        width
                    }
                    content
                    excerpt
                    author: metafield(namespace: "custom", key: "byline_author") {
                        type
                        value
                    }
                    authorV2 {
                        name
                    }
                    publishedAt
                    handle
                }
            }
        }
    }
  }
`;

export default RELATED_ARTICLES_QUERY;

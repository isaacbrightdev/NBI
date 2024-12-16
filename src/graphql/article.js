const ARTICLE_QUERY = `#graphql
  query($handle: String!, $articleHandle: String!){
    blog(handle: $handle) {
        articleByHandle(handle: $articleHandle) {
            id
            tags
            title
            blog {
              handle
            }
        }
    }
  }
`;

export default ARTICLE_QUERY;

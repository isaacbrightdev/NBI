const PAGE_QUERY = `#graphql
  query($handle: String!) {
    page(handle: $handle) {
      id
      title
      body
      createdAt
      updatedAt
      onlineStoreUrl
      displayTitle: metafield(namespace: "custom", key: "display_title") {
        key
        value
      }
      displayLastUpdated: metafield(namespace: "custom", key: "display_last_updated") {
        key
        value
      }
    }
  }
`;

export default PAGE_QUERY;

const METAOBJECTS_QUERY = `#graphql
query($type: String!, $first: Int = 20) {
	metaobjects(type: $type, first: $first) {
    edges {
      node {
        id
        handle
        fields {
          key
          value
          type
        }
      }
    }
  }
}
`;

export default METAOBJECTS_QUERY;

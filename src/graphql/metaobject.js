const METAOBJECT_QUERY = `#graphql
query($id: ID!) {
	metaobject(id: $id) {
    id
    handle
    fields {
      key
      value
    }
  }
}
`;

export default METAOBJECT_QUERY;

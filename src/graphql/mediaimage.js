const MEDIAIMAGE_QUERY = `#graphql
query($id: ID!) {
	node(id: $id) {
        id
        __typename
        ... on MediaImage {
          image {
            altText
            url
            width
            height
          }
        }
    }
}
`;

export default MEDIAIMAGE_QUERY;

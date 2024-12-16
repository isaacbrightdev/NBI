const CUSTOMER_FRAGMENT = `#graphql
  fragment Menu on Menu {
    id
    title
    itemsCount
    items {
      id
      title
      url
      items {
        id
        title
        url
        items {
          id
          title
          url
        }
      }
    }
  }
`;

const CUSTOMER_QUERY = `#graphql
  query GetCustomer($token: String!) {
    customer(customerAccessToken: $token) {
      id
      email
      metafields(identifiers: [{ namespace: "subscriptions", key: "type" }]) {
        key
        value
      }
    }
  }
  ${CUSTOMER_FRAGMENT}
`;

export default CUSTOMER_QUERY;

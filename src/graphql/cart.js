export const USER_ERROR_FRAGMENT = `#graphql
  fragment ErrorFragment on CartUserError {
    message
    field
    code
  }
`;

export const LINE_ITEM_FRAGMENT = `#graphql
  fragment CartLineFragment on CartLine {
    id
    quantity
    discountAllocations {
      discountedAmount {
        amount
        currencyCode
      }
    }
    attributes {
      key
      value
    }
    cost {
      totalAmount {
        amount
        currencyCode
      }
      amountPerQuantity {
        amount
        currencyCode
      }
      compareAtAmountPerQuantity {
        amount
        currencyCode
      }
    }
    sellingPlanAllocation {
      sellingPlan {
        id
        name
        description
      }
    }
    merchandise {
      ... on ProductVariant {
        id
        availableForSale
        compareAtPrice {
          ...MoneyFragment
        }
        price {
          ...MoneyFragment
        }
        requiresShipping
        title
        image {
          ...ImageFragment
        }
        product {
          handle
          title
          id
          onlineStoreUrl
          productType
          metafield(namespace: "course", key: "event-date-timestamp") {
            value
            type
          }
        }
        credits: metafield(key: "credits", namespace: "course") {
          type
          value
        }
        discount: metafield(key: "details", namespace: "discount") {
          type
          value
        }
        selectedOptions {
          name
          value
        }
        sku
      }
    }
  }
`;

const MONEY_FRAGMENT = `#graphql
  fragment MoneyFragment on MoneyV2 {
    currencyCode
    amount
  }
`;

const IMAGE_FRAGMENT = `#graphql
  fragment ImageFragment on Image {
    id
    url
    altText
    width
    height
  }
`;

export const CART_FRAGMENT = `#graphql
  fragment CartFragment on Cart {
      id
      checkoutUrl
      totalQuantity
      buyerIdentity {
        countryCode
        customer {
          id
          email
          firstName
          lastName
          displayName
        }
        email
        phone
      }
      discountAllocations {
        discountedAmount {
          amount
          currencyCode
        }
      }
      lines(first: $numCartLines) {
        nodes {
          ...CartLineFragment
        }
      }
      cost {
        subtotalAmount {
          ...MoneyFragment
        }
        totalAmount {
          ...MoneyFragment
        }
        totalDutyAmount {
          ...MoneyFragment
        }
        totalTaxAmount {
          ...MoneyFragment
        }
      }
      note
      attributes {
        key
        value
      }
      discountCodes {
        code
        applicable
      }
    }
    ${LINE_ITEM_FRAGMENT}
    ${MONEY_FRAGMENT}
    ${IMAGE_FRAGMENT}
`;

export const CART_DISCOUNT_CODES_QUERY = `#graphql
  query cartDiscountCodesQuery($id: ID!) {
    cart(id: $id) {
      discountCodes {
        code
        applicable
      }
    }
  }
`;

export const CART_DISCOUNT_QUERY = `#graphql
  query GetCart($id: ID!) {
    cart: cart(id: $id) {
      id
      cost {
        subtotalAmount {
          ...MoneyFragment
        }
        totalAmount {
          ...MoneyFragment
        }
        totalDutyAmount {
          ...MoneyFragment
        }
        totalTaxAmount {
          ...MoneyFragment
        }
      }
      discountAllocations {
        discountedAmount {
          amount
          currencyCode
        }
      }
      discountCodes {
        applicable
        code
      }
    }
  }
  ${MONEY_FRAGMENT}
`;

export const CREATE_CART_MUTATION = `#graphql
  mutation cartCreate($input: CartInput!) {
    result: cartCreate(input: $input) {
      cart {
        ...CartFragment
      }
      errors: userErrors {
        ...ErrorFragment
      }
    }
  }
  ${MONEY_FRAGMENT}
  ${IMAGE_FRAGMENT}
  ${LINE_ITEM_FRAGMENT}
  ${CART_FRAGMENT}
  ${USER_ERROR_FRAGMENT}
`;

export const LINE_UPDATE_MUTATION = `#graphql
  mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFragment
      }
      userErrors {
        field
        message
      }
    }
  }
  ${MONEY_FRAGMENT}
  ${IMAGE_FRAGMENT}
  ${LINE_ITEM_FRAGMENT}
  ${CART_FRAGMENT}
`;

export const LINE_ADD_MUTATION = `#graphql
  mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    result: cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFragment
      }
      errors: userErrors {
        ...ErrorFragment
      }
    }
  }
  ${MONEY_FRAGMENT}
  ${IMAGE_FRAGMENT}
  ${LINE_ITEM_FRAGMENT}
  ${CART_FRAGMENT}
  ${USER_ERROR_FRAGMENT}
`;

export const CART_QUERY = `#graphql
  query GetCart($id: ID!, $numCartLines:Int ) {
    cart(id: $id) {
      ...CartFragment
    }
  }
  ${CART_FRAGMENT}
`;

export const CART_SUMMARY_QUERY = `#graphql
  query GetCart($id: ID!, $numCartLines:Int) {
    cart(id: $id) {
      discountAllocations {
        discountedAmount {
          amount
        }
      }
      lines(first: $numCartLines) {
        nodes {
          cost {
            subtotalAmount {
              amount
            }
          }
          quantity
          discountAllocations {
            discountedAmount {
              amount
            }
          }
        }
      }
    }
  }
`;

export const QUERY_VARIANT_SELLING_PLAN = `#graphql
  query GetVariantIdSellingPlan($id: ID!) {
    node (id: $id) {
      ...on ProductVariant {
        id
        title
        sku
        sellingPlanAllocations (first: 1) {
          edges {
            node {
              sellingPlan {
                id
              }
            }
          }
        }
      }
    }
  }
`;

export const CART_SUB_FRAGMENT = `#graphql
  fragment CartSubFragment on Cart {
    id
    checkoutUrl
    createdAt
    updatedAt
    lines (first: 10) {
      edges {
        node {
          ...CartLinesSubFragment
        }
      }
    }
  }
`;

export const CART_LINES_SUB_FRAGMENT = `#graphql
  fragment CartLinesSubFragment on CartLine {
    id
    quantity
    merchandise {
      ... on ProductVariant {
        id
        title
        sku
        product {
          id
          title
        }
        sellingPlanAllocations (first: 1) {
          edges {
            node {
              sellingPlan {
                id
              }
            }
          }
        }
      }
    }
  }
`;

export const CREATE_CART_SUB_MUTATION = `#graphql
  mutation cartCreate($input: CartInput!) {
    result: cartCreate(input: $input) {
      cart {
        ...CartSubFragment
      }
      errors: userErrors {
        field
        message
      }
    }
  }
  ${CART_SUB_FRAGMENT}
  ${CART_LINES_SUB_FRAGMENT}
`;

// If cart is made already
export const ADD_SUB_TO_CART_MUTATION = `#graphql
  mutation AddSubToCart($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        ...CartSubFragment
      }
    }
  }
  ${CART_SUB_FRAGMENT}
  ${CART_LINES_SUB_FRAGMENT}
`;

export const FETCH_ACTIVE_STORE = `#graphql
  query FetchActiveStore($id: ID!) {
    cart (id: $id) {
      ...CartSubFragment
    }
  }
  ${CART_SUB_FRAGMENT}
  ${CART_LINES_SUB_FRAGMENT}
`;

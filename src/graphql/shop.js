const MENU_FRAGMENT = `#graphql
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

const SHOP_QUERY = `#graphql
  query {
    mainMenu: menu(handle: "main-menu") {
      ...Menu
    }
    accountMenu: menu(handle: "main-menu-account") {
      ...Menu
    }
    firmAdmin: menu(handle: "firm-admin") {
      ...Menu
    }
    supportMenu: menu(handle: "main-menu-support") {
      ...Menu
    }
    footer: menu(handle: "footer") {
      ...Menu
    }
    footerPolicies: menu(handle: "footer-policies") {
      ...Menu
    }
    announcementBar: metaobject(handle: {type: "announcement_bar", handle: "main"}) {
      fields {
        key
        value
      }
    }
    settings: metaobject(handle: {type: "site_settings", handle: "main"}) {
      fields {
        key
        value
      }
    }
  }
  ${MENU_FRAGMENT}
`;

export default SHOP_QUERY;

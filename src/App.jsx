import CartCohesion from '@/components/CartCohesion';
import LoadingPage from '@/components/LoadingPage';
import router from '@/router';
import '@/utils/directory-page-nav';
import '@/utils/faqs';
import '@/utils/marketing-promo-carousel';
import {
  AlgoliaFacets,
  AlgoliaProductIndexName,
  searchClient
} from '@/utils/searchClient';
import shopifyClient from '@/utils/shopify-api';
import '@/utils/upcoming-programs-carousel';
import {
  CartProvider,
  ShopifyProvider,
  useShopifyCookies
} from '@shopify/hydrogen-react';
import log from 'loglevel';
import { Suspense, useEffect, useState } from 'react';
import { Configure, InstantSearch } from 'react-instantsearch';
import { RouterProvider } from 'react-router-dom';
import aa from 'search-insights';
import useLocalStorage from 'use-local-storage';
import { CART_FRAGMENT } from './graphql/cart';
import useCustomer from './hooks/useCustomer';
import dateHelper from './utils/dateHelper';

const App = () => {
  useShopifyCookies();
  const matches = window.location.pathname.match(/\/collections\/([^/]+)/i);
  const collectionHandle =
    Boolean(matches) && matches.length === 2 ? matches[1] : null;

  const { today, tomorrow, weekEnd, nextWeekStart, nextWeekEnd } = dateHelper;

  const [initialDelay, setInitialDelay] = useState(false);

  const format = (dates, useEndTime = false, tomorrow = false) => {
    return dates.map((date, index) => {
      let aDate;
      const unixDate = date.toUnix();

      if (useEndTime && index == 1) {
        aDate = new Date(unixDate * 1000);
        aDate.setHours(23, 59, 59, 999);

        if( tomorrow ){
          aDate.setDate(aDate.getDate());
        }
      } else {
        aDate = new Date(unixDate * 1000);
        aDate.setHours(0, 0, 0, 0);
      }

      return Math.trunc(aDate.getTime() / 1000);
    });
  };

  const dates = {
    today: format([today, today], true),
    tomorrow: format([tomorrow, tomorrow], true, true),
    thisweek: format([today, weekEnd], true),
    nextweek: format([nextWeekStart, nextWeekEnd], true)
  };

  /* Commenting out in order to test the CartCohesion component.
     If that component proves successful, then delete this code
     and delete the AddMagic.jsx script file.
  useEffect(() => {
    const initCart = async () => {
      try {
        await fetchOrCreateCartId();
      } catch (error) {
        // silent
      }
    };

    initCart();
  }, []);
*/

  // Check if the Login cookie is present and has a value
  const customer = useCustomer();

  useEffect(() => {
    const cookieNBI = import.meta.env.VITE_PUBLIC_COOKIE;
    const authCookieMatch = document.cookie.match(
      new RegExp(`(?:^|; )${cookieNBI}=([^;]*)`)
    );
    const isAuthCookieValid = authCookieMatch && authCookieMatch[1] !== '';

    if (!customer && isAuthCookieValid) {
      const accountLogin = import.meta.env.VITE_PUBLIC_ACCOUNT_DOMAIN;
      const storeDomain = import.meta.env.VITE_PUBLIC_STORE_DOMAIN;
      const returnUrl = encodeURIComponent(storeDomain);
      // Needs the 'https://' please don't remove
      const redirectUrl = `https://${accountLogin}/Login?returnUrl=https://${returnUrl}`;
      window.location.href = redirectUrl;
    }
  }, [customer]);

  useEffect(() => {
    // We have to use window.location since we are outside of React Router's provider.
    const isSearchPage = window.location.pathname.startsWith('/search');
    const isCollectionPage = window.location.pathname.startsWith('/collection');


    if (!isSearchPage && !isCollectionPage) return;

    const urlParams = new URLSearchParams(window.location.search);
    const upcoming = urlParams.get('upcoming');

    if (!upcoming || !dates[upcoming]) return;

    const [start, end] = dates[upcoming];
    const redirect = `${window.location.pathname}?${AlgoliaProductIndexName}[range][meta.course.event-date-timestamp]=${start}:${end}`;

    window.location = encodeURI(redirect);
  }, []);

  aa('init', {
    appId: window.Algolia.app_id,
    apiKey: window.Algolia.search_api_key,
    anonymousUserToken: true,
    authenticatedUserToken: useCustomer()?.id || undefined,
    useCookie: true,
    inferQueryID: true
  });

  const refinementKeyToGA4Param = {
    'named_tags.topic': 'topic',
    'named_tags.subtopic': 'subtopic',
    'meta.course.credits.credit-type.credit-name': 'credit_specialty',
    'named_tags.format': 'type',
    'meta.course.duration_group': 'duration',
    'meta.course.level': 'level',
    'named_tags.statespecific': 'state_content'
  };


  // Initialize the jurisdictionKeys state
  const [jurisdictionKeys, setJurisdictionKeys] = useLocalStorage(
    'jurisdictionKeys',
    []
  );

  const mergeJurisdictionKeys = (newKeys) => {
    // Add new keys to the jurisdictionKeys array if they don't already exist
    const updatedKeys = [...new Set([...jurisdictionKeys, ...newKeys])];

    setJurisdictionKeys(updatedKeys);
  };


  const onInstantSearchStateChange = ({ uiState, setUiState }) => {
    const searchParams = uiState[AlgoliaProductIndexName];

    // Collect the selected items from the HierarchicalMenu(s)
    // Transform the selected Credit into the correct value used for the old meta.course.credits.credit-title-group facet.
    // The meta.course.credits.credit-title-group values are still used for the Credit Details cards on the PDP
    const credit_title_groups_from_hierarchicalMenu = [];
    if (searchParams?.hierarchicalMenu) {
      for (const [facetAttr, filterValue] of Object.entries(
        searchParams?.hierarchicalMenu
      )) {
        const prefix = Object.entries(AlgoliaFacets).find(([, facet]) => {
          return facet.attr === facetAttr;
        });
        if (prefix) {
          credit_title_groups_from_hierarchicalMenu.push(
            `${prefix[1].prefix}${filterValue[0]}`
          );
        }
      }

      mergeJurisdictionKeys(credit_title_groups_from_hierarchicalMenu);
    }

    const credit_specialty_groups_from_hierarchicalMenu = [];
    if (searchParams?.hierarchicalMenu) {
      for (const [facetAttr, filterValue] of Object.entries(
        searchParams?.hierarchicalMenu
      )) {
        const prefix = Object.entries(AlgoliaFacets).find(([, facet]) => {
          return facet.attr === facetAttr;
        });
        if (prefix) {
          credit_specialty_groups_from_hierarchicalMenu.push(
            `${prefix[1].prefix}${filterValue[1]}`
          );
        }
      }
    }

    try {
      // Only fire advanced searches if on the advanced search page
      if (window.location.pathname.match(/^\/(search|collections)/i)) {
        // Now handle tracking searching to the dataLayer object that is consumed
        // by Elevar / GA4
        const ga4DataLayerObject = {
          event: 'search',
          search_type: 'advanced',
          cle_state: '',
          credit_specialty: '',
          state_content: '',
          topic: '',
          subtopic: '',
          type: '',
          duration: '',
          level: '',
          event_date: ''
        };

        for (const refinementKey in searchParams.refinementList) {
          const refinementArray = searchParams.refinementList[refinementKey];

          if (refinementKeyToGA4Param[refinementKey])
            ga4DataLayerObject[refinementKeyToGA4Param[refinementKey]] =
              refinementArray.join(', ');
        }

        // Convert timestamp date range to "Events today"-esque or "Events tomorrow" text param
        if (
          searchParams.range &&
          searchParams.range['meta.course.event-date-timestamp']
        ) {
          ga4DataLayerObject.event_date =
            dateHelper.convertTimeRangeToSearchLabel(
              searchParams.range['meta.course.event-date-timestamp']
            );
        }

        ga4DataLayerObject.cle_state = credit_title_groups_from_hierarchicalMenu.join(', ');
        ga4DataLayerObject.credit_specialty = credit_specialty_groups_from_hierarchicalMenu.join(', ');

        window.dataLayer = window.dataLayer || [];

        // JSON.stringify is a pretty consistent duplicate object checker for objects a single level deep
        const windowdatalayer = window.dataLayer
        .slice()
        .reverse()
        .find((layer) => layer.search_type === 'advanced');

        let filteredLayer;

        if (windowdatalayer) {
          filteredLayer = JSON.parse(JSON.stringify(windowdatalayer, (key, value) => {
            // Ignore gtm id when processing the layer object
            return key === 'gtm.uniqueEventId' ? null : value;
          }));
        }

        const hasAdvancedSearch = window.dataLayer.some((layer) => layer.search_type === 'advanced');

        if (
          !hasAdvancedSearch ||
          JSON.stringify(filteredLayer) != JSON.stringify(ga4DataLayerObject)
        ) {
          window.dataLayer.push(ga4DataLayerObject);
        }
      }
    } catch (err) {
      log.error(`GA4 Instant Search Handling Error: ${err.message}`);
    }


    if( searchParams.range && !initialDelay ){
      setUiState(uiState);

      setTimeout(() => {
        setUiState(uiState);
      }, 1000);

      setInitialDelay(true);
    }else{
      setUiState(uiState);
    }

    //redirect user if filtering states in a collection page
    if( window.location.pathname.match(/^\/(collections)/i) && searchParams?.hierarchicalMenu ){
      setTimeout(() => {
        window.location.assign('/search' + window.location.search);
      }, 500)
    }

  };

  if (
    import.meta.env.VITE_PUBLIC_RINGCENTRAL_CHAT_TOKEN != null &&
    import.meta.env.VITE_PUBLIC_RINGCENTRAL_CHAT_TOKEN.length > 0
  ) {
    (function (d) {
      var cm = d.createElement('scr' + 'ipt');
      cm.type = 'text/javascript';
      cm.async = true;
      cm.src = `https://7gn8zmhfug.chat.digital.ringcentral.com/chat/${import.meta.env.VITE_PUBLIC_RINGCENTRAL_CHAT_TOKEN}/loader.js`;
      var s = d.getElementsByTagName('scr' + 'ipt')[0];
      s.parentNode.insertBefore(cm, s);
    })(document);
  }

  return (
    <ShopifyProvider
      storeDomain={shopifyClient.getShopifyDomain()}
      storefrontToken={import.meta.env.VITE_PUBLIC_STOREFRONT_API_TOKEN}
      storefrontApiVersion={import.meta.env.VITE_PUBLIC_STOREFRONT_API_VERSION}
      countryIsoCode="US"
      languageIsoCode="EN"
    >

      <CartProvider cartFragment={CART_FRAGMENT}>
        <InstantSearch
          searchClient={searchClient}
          indexName={AlgoliaProductIndexName}
          insights={true}
          routing={true}
          onStateChange={onInstantSearchStateChange}
          future={{ preserveSharedStateOnUnmount: true }}
        >
          {collectionHandle ? (
            <Configure
              clickAnalytics={true}
              analytics={true}
              distinct={true}
              filters={`collections:${collectionHandle}`}
            />
          ) : (
            <Configure clickAnalytics={true} analytics={true} distinct={true} />
          )}
          <Suspense fallback={<LoadingPage />}>
            <RouterProvider router={router} />
          </Suspense>
        </InstantSearch>
        <CartCohesion/>
      </CartProvider>
    </ShopifyProvider>
  );
};

export default App;

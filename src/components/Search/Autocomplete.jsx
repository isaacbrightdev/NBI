import ProductItemHit from '@/components/Search/ProductItemHit';
import {
  AlgoliaFacets,
  AlgoliaProductIndexName,
  querySuggestionsPlugin,
  searchClient
} from '@/utils/searchClient';
import { autocomplete, getAlgoliaResults } from '@algolia/autocomplete-js';
import {
  createElement,
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { createRoot } from 'react-dom/client';
import { useInstantSearch, useSearchBox } from 'react-instantsearch';

export function Autocomplete(props) {
  const containerRef = useRef(null);
  const panelRootRef = useRef(null);
  const rootRef = useRef(null);
  const { uiState } = useInstantSearch();
  const { query, refine: setQuery } = useSearchBox();
  const autocompleteRef = useRef(null);

  const searchParams = uiState[AlgoliaProductIndexName];
  let credit_title_groups_from_hierarchicalMenu = [];
    if (searchParams?.hierarchicalMenu) {
      credit_title_groups_from_hierarchicalMenu = [];
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
    }

  const [instantSearchUiState, setInstantSearchUiState] = useState({
    query
  });

  const onSubmit = useCallback(({ state }) => {
    setInstantSearchUiState({ query: state.query });
    if (!window.location.pathname.match(/^\/search/i)) {
      let url = new URL(window.location);
      let params = new URLSearchParams(url.search);
      if (state?.query?.length > 0) {
        params.set(`${AlgoliaProductIndexName}[query]`, state.query);
      } else {
        params.delete(`${AlgoliaProductIndexName}[query]`);
      }

      const ga4DataLayerObject = {
        event: 'search',
        search_type: 'simple',
        cle_state: '',
        content: '',
        topic: '',
      };

      const topics = [];
      const cle_states = [];

      params.forEach((value, name) => {
        if (name == `${AlgoliaProductIndexName}[query]`)
          ga4DataLayerObject.content = value;
        else if (name.includes('[refinementList][named_tags.topic]'))
          topics.push(value);
        else if (name.includes(credit_title_groups_from_hierarchicalMenu))
          cle_states.push(value);
      });

      ga4DataLayerObject.topic = topics.join(', ');
      ga4DataLayerObject.cle_state = cle_states.join(', ');

      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(ga4DataLayerObject);

      window.location.href = `/search?${params.toString()}`;
    }
  }, []);


  useEffect(() => {
    setQuery(instantSearchUiState.query);

    return () => {
      setQuery(instantSearchUiState.query);
    };
  }, [instantSearchUiState]);

  useMemo(() => {
    if (!containerRef.current || autocompleteRef.current) {
      return undefined;
    }
    autocompleteRef.current = autocomplete({
      placeholder: 'Enter Keyword or Product ID',
      insights: true,
      container: containerRef.current,
      initialState: { query },
      getSources({ query, state }) {
        if (!query) {
          return [];
        }
        return [
          {
            sourceId: 'products',
            getItems() {
              return getAlgoliaResults({
                searchClient,
                queries: [
                  {
                    indexName: AlgoliaProductIndexName,
                    query
                  }
                ]
              });
            },
            templates: {
              item({ item, components }) {
                return <ProductItemHit hit={item} components={components} />;
              },
              footer() {
                return (
                  <div className="mt-3.5 text-right text-[0.75rem] font-normal italic text-[#687692]">
                    Press enter to search
                  </div>
                );
              },
              noResults() {
                return (
                  <div>
                    No results for
                    <span className="ml-1 font-semibold">{state?.query}</span>
                  </div>
                );
              }
            }
          }
        ];
      },
      onStateChange({ state }) {
        if (state.query !== query) {
          setQuery(state.query);
        }
      },
      onSubmit,
      onReset() {
        setInstantSearchUiState({ query: '' });
      },
      plugins: [querySuggestionsPlugin],
      renderer: {
        createElement,
        Fragment,
        render: () => {}
      },
      render({ children }, root) {
        if (!panelRootRef.current || rootRef.current !== root) {
          rootRef.current = root;
          panelRootRef.current?.unmount();
          panelRootRef.current = createRoot(root);
        }
        panelRootRef.current.render(children);
      },
      ...props
    });

    // eslint-disable-next-line react/prop-types
    if (props?.autocompleteInstance?.current === null) {
      // eslint-disable-next-line react/prop-types
      props.autocompleteInstance.current = autocompleteRef.current;
    }
    // don't destroy for now... need shared instance between mobile and desktop.
    // maybe add to `NavSearchWrapper.jsx` and add useEffect to properly destroy there.
  }, [props, querySuggestionsPlugin, uiState, instantSearchUiState]);

  // eslint-disable-next-line react/prop-types
  const aClassName = `${props?.isMobileMenu ? '' : 'flex-grow'}`;
  return <div className={aClassName} ref={containerRef} />;
}

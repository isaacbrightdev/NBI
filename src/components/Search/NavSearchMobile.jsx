import { Autocomplete } from '@/components/Search/Autocomplete';
import DisclosurePanel from '@/components/Search/DisclosurePanel';
import HierarchicalMenuMobileMenu from '@/components/Search/HierarchicalMenuMobileMenu';
import MobileDialog from '@/components/Search/MobileDialog';
import RefinementListMobileMenu from '@/components/Search/RefinementListMobileMenu';
import SvgIcon from '@/components/SvgIcon';
import { AlgoliaFacets, AlgoliaProductIndexName } from '@/utils/searchClient';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useInstantSearch, useSearchBox } from 'react-instantsearch';

// eslint-disable-next-line no-unused-vars
const NavSearchMobile = ({
  className,
  jurisdictionHeading,
  jurisdictionAttributes
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef(null);
  const url = new URL(window.location);
  const params = new URLSearchParams(url.search);
  const hasSearchQuery = params.has(`${AlgoliaProductIndexName}[query]`);
  const searchQuery =
    (hasSearchQuery && params.get(`${AlgoliaProductIndexName}[query]`)) ||
    false;

  const { query, refine: setQuery } = useSearchBox();

  const [instantSearchUiState, setInstantSearchUiState] = useState({
    query
  });
  const { uiState } = useInstantSearch();

  useEffect(() => {
    setQuery(instantSearchUiState.query);
  }, [instantSearchUiState]);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  useEffect(() => {
    if (isOpen) {
      rootRef.current.dataset.query =
        uiState[AlgoliaProductIndexName]?.query || '';
    }
  }, [isOpen]);

  const onStateChange = useCallback(({ prevState, state }) => {
    if (prevState.query !== state.query) {
      rootRef.current.dataset.query = state.query;
    }
    if (prevState.isOpen !== state.isOpen) {
      rootRef.current.classList.toggle(`navsearch-is-showing`, state.isOpen);

      if (!state.isOpen) {
        setInstantSearchUiState({ query: state.query });
      }
    }
  }, []);

  const onSubmit = useCallback(({ state }) => {
    const aQuery = state?.query || query || rootRef.current.dataset.query || '';
    let url = new URL(window.location);
    let params = new URLSearchParams(url.search);
    if (state?.query?.length > 0) {
      params.set(`${AlgoliaProductIndexName}[query]`, aQuery);
    } else {
      params.delete(`${AlgoliaProductIndexName}[query]`);
    }
    window.location.href = `/search?${params.toString()}`;
  }, []);

  const onSearchSubmit = useCallback(() => {
    const aQuery = rootRef.current.dataset.query || '';
    let url = new URL(window.location);
    let params = new URLSearchParams(url.search);
    if (aQuery?.length > 0) {
      params.set(`${AlgoliaProductIndexName}[query]`, aQuery);
    } else {
      params.delete(`${AlgoliaProductIndexName}[query]`);
    }
    window.location.href = `/search?${params.toString()}`;
  }, []);

  const transformItemsTopic = useCallback((items) => {
    return items.map((item) => {
      return {
        ...item,
        highlighted: item.highlighted.replaceAll('+', ' '),
        label: item.label.replaceAll('+', ' ')
      };
    });
  }, []);

  return (
    <div className={className}>
      <button
        type="button"
        onClick={openModal}
        className="btn relative flex w-full border-grey bg-white text-left !text-primary"
      >
        <span className="flex flex-grow flex-col truncate pr-[60px]">
          <span className="data-hj-allow truncate text-h4-mobile font-normal not-italic leading-[130%]">
            {searchQuery && <>{searchQuery}</>}
            {!searchQuery && <>Enter Keyword or Product ID</>}
          </span>
          <span className="truncate text-[.75rem] font-medium not-italic leading-[130%] text-grey-dark">
            Add Category - Add {jurisdictionHeading}
          </span>
        </span>
        <span className="btn btn--accent absolute bottom-0 right-0 top-0 flex h-full items-center !rounded-l-none">
          <SvgIcon className="icon-search" name="search" />
        </span>
      </button>

      <MobileDialog rootRef={rootRef} onClose={closeModal} show={isOpen}>
        <div className="flex items-center rounded-t-2xl border-b border-grey bg-white px-7 py-4">
          <div className="navsearch-is-showing-show flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="21"
              viewBox="0 0 20 21"
              fill="none"
            >
              <path
                d="M18.0016 10.3H2.40156"
                className="stroke-accent-text-color"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M6.59993 14.5L2.39993 10.3L6.59993 6.09998"
                className="stroke-accent-text-color"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="ml-auto flex items-center justify-end">
            <span className="navsearch-is-showing-show translate-x-7">
              Search Courses
            </span>
            <button
              type="button"
              className={[
                'no-underline',
                'whitespace-nowrap',
                'align-middle',
                'select-none',
                'transition-colors',
                'bg-transparent',
                'flex',
                'items-center',
                'justify-center',
                'rounded-full',
                'text-primary',
                'leading-snug',
                'text-sm-body',
                'p-2',
                'navsearch-is-showing-hide'
              ].join(' ')}
              onClick={() => setIsOpen(false)}
              aria-label="Close"
            >
              <svg
                className="select-none"
                aria-hidden="true"
                focusable="false"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="21"
                viewBox="0 0 20 21"
                fill="none"
              >
                <path
                  d="M17.6 2.90002L2.39996 18.1"
                  className="stroke-current"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2.39996 2.90002L17.6 18.1"
                  className="stroke-current"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
        <div className="flex-auto overflow-y-auto overscroll-contain bg-[#f3f5f9] px-7 py-4">
          <div className="flex flex-col gap-8 pt-4">
            <h4 className="text-center text-h3-mobile font-medium">
              Search Courses
            </h4>

            <Autocomplete
              openOnFocus={true}
              detachedMediaQuery=""
              placeholder="Enter Keyword or Product ID"
              isMobileMenu={true}
              onStateChange={onStateChange}
              onSubmit={onSubmit}
              classNames={{
                detachedCancelButton: '!hidden',
                detachedFormContainer:
                  'detachedFormContainer bg-[#f3f5f9] px-5 pt-5 pb-8',
                detachedContainer:
                  'detachedContainer !top-[86px] bg-[#f3f5f9] !max-w-full !rounded-none !shadow-none !border-none bottom-[82px]',
                detachedOverlay:
                  'detachedOverlay !bg-transparent h-auto bottom-[82px]',
                detachedSearchButton:
                  'detachedSearchButton bg-white h-auto p-5 border-grey rounded-full text-primary',
                detachedSearchButtonIcon: 'detachedSearchButtonIcon',
                detachedSearchButtonPlaceholder:
                  'detachedSearchButtonPlaceholder',
                detachedSearchButtonQuery:
                  'detachedSearchButtonQuery data-hj-allow',
                form: 'rounded-full text-primary border border-solid border-grey hover:!border-grey focus-within:!border-grey focus-within:shadow-[0px_1px_5px_0px_rgba(9,34,84,0.20)] focus-within:!bg-white focus:bg-white focus:outline-none focus-visible:ring-0 transition-colors data-hj-allow',
                input:
                  'input !bg-transparent !h-auto !py-4 focus:!ring-0 !ring-0 !ring-transparent placeholder:text-grey-dark placeholder:text-[1rem] placeholder:font-normal placeholder:leading-[130%] data-hj-allow',
                inputWrapper: 'inputWrapper',
                inputWrapperPrefix: 'inputWrapperPrefix',
                inputWrapperSuffix: 'p-4',
                panel: 'panel !bg-[#f3f5f9]',
                item: 'aa-autocomplete-item border-0 !bg-transparent data-hj-allow',
                label: 'label',
                list: 'list',
                loadingIndicator: 'loadingIndicator',
                panelLayout: 'panelLayout',
                clearButton:
                  'bg-accent rounded-full text-primary w-[1.5625rem] h-[1.5625rem] p-[0.3125rem]',
                root: 'root w-full',
                sourceFooter: 'sourceFooter',
                sourceHeader: 'sourceHeader',
                sourceNoResults: 'sourceNoResults',
                submitButton: 'submitButton'
              }}
            />

            <hr className={'border-grey'} />
            <DisclosurePanel
              header={jurisdictionHeading}
              attribute={jurisdictionAttributes[0]}
              className={[
                'border',
                'border-grey',
                'rounded-[0.625rem]',
                'overflow-hidden',
                'nav-search-mobile-disclosure-panel'
              ].join(' ')}
              btnClassName={['!bg-transparent', '!p-5'].join(' ')}
              isMega={true}
            >
              <HierarchicalMenuMobileMenu
                attributes={jurisdictionAttributes}
                sortBy={['isRefined', 'name:asc']}
              />
            </DisclosurePanel>

            <DisclosurePanel
              header={AlgoliaFacets.Topic.title}
              attribute={AlgoliaFacets.Topic.attr}
              className={[
                'border',
                'border-grey',
                'rounded-[0.625rem]',
                'overflow-hidden',
                'nav-search-mobile-disclosure-panel',
                'data-hj-allow'
              ].join(' ')}
              btnClassName={[
                '!bg-transparent',
                '!p-5',
                'transition-colors'
              ].join(' ')}
              isMega={true}
            >
              <RefinementListMobileMenu
                attribute={AlgoliaFacets.Topic.attr}
                sortBy={['isRefined', 'name:asc']}
                transformItems={transformItemsTopic}
              />
            </DisclosurePanel>
          </div>
        </div>
        <div className="fixed bottom-0 left-0 right-0 z-[99999] items-center gap-4 flex border-t border-grey bg-white px-4 py-4">
          <button
            type="button"
            className="btn btn--accent"
            onClick={onSearchSubmit}
          >
            <SvgIcon
              height={25}
              w={25}
              className="icon-search mr-2 inline"
              name="search"
            />
            <span>Search</span>
          </button>
          <a
            href="/search"
            className="sm-body block font-medium leading-[130%] text-secondary underline"
          >
            Clear all
          </a>
        </div>
      </MobileDialog>
    </div>
  );
};
NavSearchMobile.propTypes = {
  className: PropTypes.string,
  jurisdictionHeading: PropTypes.string,
  jurisdictionSubHeading: PropTypes.string,
  jurisdictionAttributes: PropTypes.arrayOf(PropTypes.string)
};
export default NavSearchMobile;

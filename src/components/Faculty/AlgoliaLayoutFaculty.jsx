import PropTypes from 'prop-types';
import { useCallback, useRef, useState } from 'react';
import {
  ClearRefinements,
  Hits,
  Index,
  SearchBox,
  SortBy,
  Stats,
  useClearRefinements,
  useInstantSearch
} from 'react-instantsearch';
import AlgoliaWidgetsFaculty from '@/components/Search/AlgoliaWidgetsFaculty';
import MobileDialog from '@/components/Search/MobileDialog';
import SvgIcon from '@/components/SvgIcon';
import { AlgoliaFacultyAccountsIndexName } from '@/utils/searchClient';
import CustomPagination from '../CustomPagination';
import FacultyCard from './FacultyCard';

const Hit = ({ hit }) => {
  if (hit?.accountName) {
    return (
      <div className="mb-4">
        <FacultyCard {...hit} />
      </div>
    );
  }
};

Hit.propTypes = {
  hit: PropTypes.any
};

const NoResultsBoundary = ({ children, fallback }) => {
  const { results } = useInstantSearch();
  // The `__isArtificial` flag makes sure not to display the No Results message
  // when no hits have been returned.
  if (!results.__isArtificial && results.nbHits === 0) {
    return (
      <>
        {fallback}
        <div hidden>{children}</div>
      </>
    );
  }

  return children;
};

NoResultsBoundary.propTypes = {
  results: PropTypes.any,
  children: PropTypes.any,
  fallback: PropTypes.any
};

const NoResults = () => {
  const { setIndexUiState } = useInstantSearch();
  const { refine } = useClearRefinements();
  const onclick = useCallback(() => {
    setIndexUiState((indexUiState) => ({
      ...indexUiState,
      query: ''
    }));
    refine();
  }, []);

  return (
    <div
      className={[
        'relative',
        'flex',
        'flex-col',
        'min-w-0',
        'bg-white',
        'bg-clip-border',
        'border',
        'rounded-[0.625rem]',
        'border-solid',
        'border-grey',
        'break-words',
        'items-stretch'
      ].join(' ')}
    >
      <div className="flex flex-col items-center justify-center px-5 py-12">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="46"
          height="47"
          fill="none"
        >
          <path
            stroke="url(#a)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="4"
            d="M43.9 2.6 2.1 44.4"
          />
          <path
            stroke="url(#b)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="4"
            d="m2.1 2.6 41.8 41.8"
          />
          <defs>
            <linearGradient
              id="a"
              x1="42.998"
              x2="-6.088"
              y1="44.4"
              y2="17.942"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="var(--tw-primary)" />
              <stop offset="1" stopColor="var(--tw-secondary)" />
            </linearGradient>
            <linearGradient
              id="b"
              x1="42.998"
              x2="-6.088"
              y1="44.4"
              y2="17.942"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="var(--tw-primary)" />
              <stop offset="1" stopColor="var(--tw-secondary)" />
            </linearGradient>
          </defs>
        </svg>
        <p className="mt-[15px] text-center">Sorry, no results were found.</p>

        <button
          type="button"
          className="btn mt-[5px] !border-0 !bg-white !p-0 text-[0.875rem] font-medium not-italic leading-[130%] text-secondary underline"
          onClick={onclick}
        >
          Clear Search
        </button>
      </div>
    </div>
  );
};

NoResults.propTypes = {
  refine: PropTypes.any,
  setIndexUiState: PropTypes.any,
  indexUiState: PropTypes.any
};

const AlgoliaLayoutFaculty = () => {
  const { results, indexUiState, setIndexUiState } = useInstantSearch();
  let [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef(null);
  const [inputValue, setInputValue] = useState('');

  const handleSortChange = (selectedSortValue) => {
    // Preserve the selected facet values
    const preservedFacets = { ...indexUiState, sortBy: selectedSortValue };

    // Update the Algolia index UI state
    setIndexUiState(preservedFacets);
  };

  const handleInputChange = (event) => {
    if (event.target.value === '') setInputValue('');
    else setInputValue(event.target.value);
  };

  const handleResetClick = () => {
    setInputValue('');
  };

  const classes = {
    paginationArrow: `ais-Pagination-item-arrow rounded-full bg-grey-light w-[2.75rem] h-[2.75rem] !text-primary mx-2 lg:mx-4`,
    resetActive: `bg-accent text-white top-[12px] absolute h-[20px] w-[20px] rounded-[20px] flex items-center justify-center right-[12px]`,
    resetInactive: `hidden`
  };

  const resetButtonClass =
    inputValue !== '' ? classes.resetActive : classes.resetInactive;

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  return (
    <div
      className={[
        'collection',
        'max-w-screen-2xl',
        'items-start',
        'justify-between',
        'container-fluid',
        'gx-sm',
        'xl:gx-xl',
        'py-10'
      ].join(' ')}
    >
      <Index
        indexId={AlgoliaFacultyAccountsIndexName}
        indexName={AlgoliaFacultyAccountsIndexName}
      >
        <div className="row justify-center">
          <div className="col-12 mb-7 flex lg-max:flex-col lg:items-center lg:justify-between">
            <Stats
              classNames={{
                root: 'text-primary text-callout leading-[130%] tracking-[2.1px] uppercase lg-max:mb-4'
              }}
              translations={{
                rootElementText({ nbHits }) {
                  const isSearchPage = Boolean(
                    window.location.href.match(/\/search/)
                  );
                  return `${nbHits.toLocaleString()} ${
                    isSearchPage
                      ? nbHits === 1
                        ? 'Result'
                        : 'Results'
                      : nbHits === 1
                        ? 'Faculty Member'
                        : 'Faculty Members'
                  }`;
                }
              }}
            />

            <div className="flex items-center justify-between">
              <SortBy
                classNames={{
                  select: `!rounded-full !border-primary !text-callout relative`
                }}
                items={[
                  {
                    label: 'Sort by: Last Name',
                    value: `${AlgoliaFacultyAccountsIndexName}_last_name_asc`
                  },
                  {
                    label: 'Sort by: First Name',
                    value: `${AlgoliaFacultyAccountsIndexName}_first_name_asc`
                  }
                ]}
                className="relative"
                onChange={(event) => handleSortChange(event.target.value)}
              />

              <button
                type="button"
                onClick={openModal}
                className="btn !p-2 lg:hidden"
              >
                <SvgIcon
                  width={20}
                  height={20}
                  className="icon-filter"
                  name="filter"
                />
              </button>
            </div>
          </div>
          <div className="lg:w-[358px] lg:pr-12">
            <div className="lg-max:hidden">
              <AlgoliaWidgetsFaculty />
            </div>
            <div className="lg:hidden">
              <MobileDialog
                rootRef={rootRef}
                onClose={closeModal}
                show={isOpen}
              >
                <div className="flex items-center rounded-t-2xl border-b border-grey bg-white px-7 py-4">
                  <div className="text-h3-mobile font-medium">Filters</div>
                  <div className="ml-auto flex items-center justify-end">
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

                <div
                  className={[
                    'p-5',
                    'relative',
                    'flex-auto',
                    'overscroll-contain',
                    'overflow-y-auto'
                  ].join(' ')}
                >
                  <AlgoliaWidgetsFaculty />
                </div>

                <div
                  className={[
                    'px-7',
                    'py-4',
                    'flex',
                    'items-center',
                    'bg-white',
                    'justify-between',
                    'border-t',
                    'border-grey',
                    'fixed',
                    'left-0',
                    'right-0',
                    'bottom-0',
                    'z-[99999]'
                  ].join(' ')}
                >
                  <ClearRefinements
                    classNames={{
                      root: '',
                      button:
                        'text-secondary sm-body font-medium leading-[130%] underline',
                      disabledButton: '!text-grey !opacity-80'
                    }}
                    translations={{
                      resetButtonText: 'Clear all'
                    }}
                  />

                  <button
                    type="button"
                    className="btn btn--accent !flex items-center gap-2"
                    onClick={closeModal}
                  >
                    <SvgIcon
                      height={25}
                      w={25}
                      className="icon-search"
                      name="search"
                    />
                    <span>Close Filters</span>
                  </button>
                </div>
              </MobileDialog>
            </div>

            <SearchBox
              translations={{ placeholder: 'Search Directory' }}
              searchAsYouType={true}
              classNames={{
                root: 'my-3',
                form: 'relative data-hj-allow',
                input:
                  'w-full border border-grey rounded-full py-3 px-5 focus:ring-0 data-hj-allow',
                placeholder: 'text-grey',
                submit: '!hidden',
                submitIcon: 'w-[15px] h-[15px]',
                resetIcon: 'w-[8px] h-[8px]',
                reset: `${resetButtonClass}`
              }}
              onInput={handleInputChange}
              onResetCapture={handleResetClick}
              placeholder="Search Directory"
              value={inputValue}
            />
          </div>
          <div className="col-12 lg:col">
            <NoResultsBoundary fallback={<NoResults results={results} />}>
              <Hits
                hitComponent={({ hit }) => {
                  return <Hit hit={hit} />;
                }}
              />
            </NoResultsBoundary>
            <CustomPagination />
          </div>
        </div>
      </Index>
    </div>
  );
};

AlgoliaLayoutFaculty.propTypes = {
  children: PropTypes.any,
  rootRef: PropTypes.any,
  isOpen: PropTypes.any,
  setIsOpen: PropTypes.any,
  filteredHits: PropTypes.any,
  setFilteredHits: PropTypes.any,
  selectedLetter: PropTypes.any,
  setSelectedLetter: PropTypes.any,
  onClickLetter: PropTypes.any
};

export default AlgoliaLayoutFaculty;

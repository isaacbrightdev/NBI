import CourseCard from '@/components/CourseCard';
import AlgoliaWidgets from '@/components/Search/AlgoliaWidgets';
import SvgIcon from '@/components/SvgIcon';
import useCustomer from '@/hooks/useCustomer';
import { AlgoliaProductIndexName } from '@/utils/searchClient';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useRef } from 'react';
import {
  Hits,
  SortBy,
  Stats,
  useClearRefinements,
  useInstantSearch
} from 'react-instantsearch';
import aa from 'search-insights';
import CustomPagination from './CustomPagination';

const Hit = ({ hit }) => {
  const customer = useCustomer();

  const handleClick = useCallback(() => {
    const queryID = hit.__queryID;
    localStorage.setItem('Algolia_QueryID', queryID);

    aa('convertedObjectIDsAfterSearch', {
      authenticatedUserToken: customer?.id || undefined,
      eventName: 'Product Clicked After Search',
      index: AlgoliaProductIndexName,
      queryID: hit.__queryID,
      objectIDs: [hit.objectID]
    });
  }, [hit]);

  return (
    <div onClick={handleClick}>
      <CourseCard product={hit} />
    </div>
  );
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
  children: PropTypes.any,
  fallback: PropTypes.any
};

const NoResults = () => {
  const { setUiState } = useInstantSearch();
  const { refine } = useClearRefinements();
  const onclick = useCallback(() => {
    setUiState((prevUiState) => ({
      ...prevUiState,
      [AlgoliaProductIndexName]: {
        ...prevUiState[AlgoliaProductIndexName].query,
        query: ''
      }
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
      <div className="flex flex-col items-center justify-center gap-2.5 px-5 py-12">
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
              <stop stopColor="#092254" />
              <stop offset="1" stopColor="#0069A5" />
            </linearGradient>
            <linearGradient
              id="b"
              x1="42.998"
              x2="-6.088"
              y1="44.4"
              y2="17.942"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#092254" />
              <stop offset="1" stopColor="#0069A5" />
            </linearGradient>
          </defs>
        </svg>
        <p>Sorry, no results were found.</p>

        <button
          type="button"
          className="btn !border-0 !bg-white !p-0 text-[0.875rem] font-medium not-italic leading-[130%] text-secondary underline"
          onClick={onclick}
        >
          Clear Search
        </button>
      </div>
    </div>
  );
};

const AlgoliaLayoutMobile = () => {
  /**
   * Because Algolia re-renders when state changes (ie classNames), we have to use useRef,
   * not useState to the mobile filters work when modal is closed. In addition, we can not
   * use Headless Ui Dialog because it internally uses useState to open/close
   * */
  const ref = useRef(null);

  return (
    <div className="ml-5 lg:hidden">
      <button
        type="button"
        onClick={() => {
          ref.current.classList.toggle('hidden');
          document.body.classList.toggle('overflow-hidden');
        }}
        className="btn !p-2"
      >
        <SvgIcon width={20} height={20} className="icon-filter" name="filter" />
      </button>

      <div
        ref={ref}
        className={`fixed left-0 top-0 z-[1055] hidden h-full w-full overflow-y-auto overflow-x-hidden`}
      >
        <div className="fixed inset-0 z-[1019] bg-primary opacity-50"></div>
        <div className="fixed inset-0 z-[1020] h-full overflow-y-auto">
          <div className="flex max-h-full min-h-full items-stretch justify-center overflow-hidden px-0 pb-0 pt-4 text-center">
            <div className="relative flex w-full transform flex-col overflow-hidden rounded-t-2xl bg-white text-left align-middle shadow-xl transition-all">
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
                    onClick={() => {
                      ref.current.classList.toggle('hidden');
                      document.body.classList.toggle('overflow-hidden');
                    }}
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
                <AlgoliaWidgets hideClearRefinements={true} />
              </div>

              <div
                className={[
                  'px-7',
                  'py-4',
                  'flex',
                  'bg-white',
                  'border-t',
                  'border-grey',
                  'gap-4',
                  'items-center'
                ].join(' ')}
              >
                <button
                  type="button"
                  className="btn btn--accent"
                  onClick={() => {
                    ref.current.classList.toggle('hidden');
                    document.body.classList.toggle('overflow-hidden');
                  }}
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Banners = () => {
  const { results } = useInstantSearch();
  const banners = results?.renderingContent?.widgets?.banners;

  if (banners) {
    return (
      <div id="banner">
        {banners.map((banner, index) => (
          <a key={index} href={banner?.link?.url}>
            <img
              src={banner?.image?.urls?.[0]?.url}
              alt={banner?.image?.title}
              loading="lazy"
              width={banner?.image?.urls?.[0]?.width}
              height={banner?.image?.urls?.[0]?.height}
            />
          </a>
        ))}
      </div>
    );
  }
};

const Redirect = () => {
  const { results } = useInstantSearch();
  const redirectUrl = results?.renderingContent?.redirect?.url;

  useEffect(() => {
    if (redirectUrl) {
      window.location.assign(redirectUrl);
    }
  }, [redirectUrl]);

  return null;
};

const AlgoliaLayout = ({ isSearchPage = false }) => {
  return (
    <div
      className={[
        'collection',
        'max-w-screen-2xl',
        'items-start',
        'justify-between',
        'container-fluid',
        'gx-sm',
        'xl:px-10',
        '2xl:px-24',
        'py-10'
      ].join(' ')}
    >
      <div className="row justify-center">
        <Redirect />
        <div className="col-12 mb-7 flex flex-col justify-center md:flex-row md:items-center">
          <Banners />
        </div>
        <div className="col-12 mb-7 flex flex-col md:flex-row md:items-center md:justify-between">
          <Stats
            classNames={{
              root: 'text-primary text-callout leading-[130%] tracking-[2.1px] uppercase mb-4 md:mb-0'
            }}
            translations={{
              rootElementText({ nbHits }) {
                return `${nbHits.toLocaleString()} ${
                  isSearchPage
                    ? nbHits === 1
                      ? 'Result'
                      : 'Results'
                    : nbHits === 1
                      ? 'Course'
                      : 'Courses'
                }`;
              }
            }}
          />

          <div className="flex items-center justify-between">
            <div className="mr-2 font-semibold">Sort by:</div>
            <SortBy
              classNames={{
                select: '!rounded-full !border-primary !text-callout'
              }}
              items={[
                { label: 'Featured', value: AlgoliaProductIndexName },
                {
                  label: 'Event Date (Desc)',
                  value: `${AlgoliaProductIndexName}_event_date_desc`
                },
                {
                  label: 'Event Date (Asc)',
                  value: `${AlgoliaProductIndexName}_event_date_asc`
                },
                {
                  label: 'Most Popular',
                  value: `${AlgoliaProductIndexName}_most_popular`
                },
                {
                  label: 'Top Rated',
                  value: `${AlgoliaProductIndexName}_top_rated`
                },
                {
                  label: 'Newly Added',
                  value: `${AlgoliaProductIndexName}_newly_added`
                }
              ]}
            />

            <AlgoliaLayoutMobile />
          </div>
        </div>
        <div className="lg:w-[358px] lg:pr-12">
          <div className="lg-max:hidden">
            <AlgoliaWidgets />
          </div>
        </div>
        <div className="col-12 lg:col">
          <NoResultsBoundary fallback={<NoResults />}>
            <Hits
              classNames={{
                list: 'md:grid md:grid-auto-rows-fr md:grid-cols-2 md:gap-4 lg:gap-x-0 lg:flex lg:flex-col',
                item: 'flexs'
              }}
              hitComponent={({ hit }) => <Hit hit={hit} />}
            />
          </NoResultsBoundary>
          <CustomPagination />
        </div>
      </div>
    </div>
  );
};

AlgoliaLayout.propTypes = {
  isSearchPage: PropTypes.bool
};

export default AlgoliaLayout;

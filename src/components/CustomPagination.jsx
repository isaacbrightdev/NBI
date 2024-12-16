// import log from 'loglevel';
import PropTypes from 'prop-types';
import { usePagination } from 'react-instantsearch';
import PaginationBack from '@/components/svg/PaginationBack';
import PaginationBackDisabled from '@/components/svg/PaginationBackDisabled';
import PaginationForward from '@/components/svg/PaginationForward';
import PaginationForwardDisabled from '@/components/svg/PaginationForwardDisabled';
import useSettings from '@/hooks/useSettings';

const PaginationButton = ({ disabled, onClick, children, isActive }) => {
  const listItemClasses = ['border-b-[5px]', 'font-medium', 'text-secondary'];

  if (isActive) {
    listItemClasses.push('border-accent');
  } else {
    listItemClasses.push('border-transparent');
  }

  const buttonClasses = [
    'flex',
    'flex-col',
    'items-center',
    'justify-center',
    'p-2.5',
    'text-current'
  ];

  if (disabled) {
    buttonClasses.push('disabled');
  }

  return (
    <li className={listItemClasses.join(' ')}>
      <button
        type="button"
        className={buttonClasses.join(' ')}
        onClick={onClick}
        disabled={disabled}
      >
        {children}
      </button>
    </li>
  );
};

PaginationButton.propTypes = {
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  children: PropTypes.node,
  isActive: PropTypes.bool
};

const determineVisiblePages = (
  current,
  first,
  last,
  visiblePageCount = 2,
  totalPageCount
) => {
  const visiblePages = [current];

  if (totalPageCount <= 4) {
    for (let i = first; i <= last; i++) {
      if (i !== current) {
        visiblePages.push(i);
      }
    }
    return { visiblePages: visiblePages.sort((a, b) => a - b) };
  }

  let showFirstEllipsis = false;
  let showLastEllipsis = false;

  for (let i = 1; i < visiblePageCount; i++) {
    let next = current + i;
    let prev = current - i;

    // add next pages
    if (next <= last && prev !== first + 1) {
      visiblePages.push(next);

      // if there is no prev, add another next to keep another page visible
      if (prev === -1 && i + 1 === visiblePageCount) {
        visiblePages.push(next + 1);
      }
    } else {
      showLastEllipsis = true;
    }

    // add previous pages
    if (prev >= first && next !== last - 1) {
      // If previous page is not close to the start/end, don't append
      if (prev < first + 2 || prev >= last - 2) visiblePages.unshift(prev);

      // if there is no next, add another previous to keep another page visible
      if (next === last + 1 && i + 1 === visiblePageCount) {
        visiblePages.unshift(prev - 1);
      }
    } else {
      showFirstEllipsis = true;
    }
  }

  // determine if we need to add ellipsis
  if (visiblePages[0] > first + 1) {
    showFirstEllipsis = true;
  }

  if (visiblePages[visiblePages.length - 1] < last - 1) {
    showLastEllipsis = true;
  }

  return {
    visiblePages,
    showFirstEllipsis,
    showLastEllipsis
  };
};

determineVisiblePages.propTypes = {
  current: PropTypes.number,
  first: PropTypes.number,
  last: PropTypes.number
};

function CustomPagination(props) {
  const { rootRef } = useSettings();
  const { currentRefinement, nbPages, isFirstPage, isLastPage, refine } =
    usePagination(props);
  const onPageChange = (page) => {
    refine(page);
    setTimeout(() => rootRef.current.scrollIntoView());
  };

  if (nbPages <= 1) return null;

  const firstPage = 0;
  const lastPage = nbPages - 1;

  const { visiblePages, showFirstEllipsis, showLastEllipsis } =
    determineVisiblePages(currentRefinement, firstPage, lastPage, 2, nbPages);

  return (
    <nav aria-label="Search Navigation" className="w-full py-6 lg:py-12">
      <ul className="flex items-center justify-center">
        <PaginationButton
          disabled={isFirstPage}
          onClick={() => onPageChange(currentRefinement - 1)}
        >
          {isFirstPage ? PaginationBackDisabled() : PaginationBack()}
        </PaginationButton>

        {/* First page and First ellipsis */}
        {visiblePages[0] !== firstPage && (
          <>
            <PaginationButton
              disabled={false}
              onClick={() => onPageChange(firstPage)}
              isActive={currentRefinement === firstPage}
            >
              {firstPage + 1}
            </PaginationButton>
            {showFirstEllipsis && (
              <PaginationButton disabled={true}>{'...'}</PaginationButton>
            )}
          </>
        )}

        {/* Current pages */}
        {visiblePages.map((page) => (
          <PaginationButton
            key={page}
            disabled={currentRefinement === page}
            onClick={() => onPageChange(page)}
            isActive={currentRefinement === page}
          >
            {page + 1}
          </PaginationButton>
        ))}

        {/* Last ellipsis and Last page */}
        {visiblePages[visiblePages.length - 1] !== lastPage && (
          <>
            {showLastEllipsis && (
              <PaginationButton disabled={true}>{'...'}</PaginationButton>
            )}
            <PaginationButton
              disabled={false}
              onClick={() => onPageChange(lastPage)}
              isActive={currentRefinement === lastPage}
            >
              {lastPage + 1}
            </PaginationButton>
          </>
        )}

        <PaginationButton
          disabled={isLastPage}
          onClick={() => onPageChange(currentRefinement + 1)}
        >
          {isLastPage ? PaginationForwardDisabled() : PaginationForward()}
        </PaginationButton>
      </ul>
    </nav>
  );
}

CustomPagination.propTypes = {
  nbPages: PropTypes.number,
  currentRefinement: PropTypes.number,
  isFirstPage: PropTypes.bool,
  isLastPage: PropTypes.bool,
  pages: PropTypes.arrayOf(PropTypes.number),
  refine: PropTypes.func
};

export default CustomPagination;

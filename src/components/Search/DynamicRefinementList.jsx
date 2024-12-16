import PropTypes from 'prop-types';
import { RefinementList } from 'react-instantsearch';
import useRefinementList from '@/utils/useRefinementListRoot';

const DynamicRefinementList = ({
  attribute,
  isLongList = false,
  transformItems
}) => {
  useRefinementList();
  return (
    <RefinementList
      attribute={attribute}
      limit={isLongList ? 4 : 100}
      showMore={isLongList}
      showMoreLimit={isLongList ? 100 : undefined}
      transformItems={transformItems}
      searchable={isLongList}
      searchablePlaceholder={'Search'}
      sortBy={isLongList ? ['isRefined:desc', 'name:asc'] : undefined}
      translations={{
        noResultsText: 'Nothing to filter'
      }}
      classNames={{
        root: 'RefinementList-root flex flex-col',
        list: 'RefinementList-list flex flex-col gap-0.5',
        item: 'RefinementList-item flex transition-colors rounded-[0.3125rem] bg-white text-[0.875rem] focus-within:!text-secondary focus-within:!bg-[#f3f5f9] hover:!text-secondary hover:!bg-[#f3f5f9]',
        input: 'data-hj-allow',
        label:
          'RefinementList-label p-1.5 flex items-center w-full clear-both font-normal no-underline flex bg-transparent border-0',
        checkbox:
          'RefinementList-checkbox !ring-current align-top bg-white bg-no-repeat bg-center bg-contain border appearance-none w-[1.5625rem] h-[1.5625rem] rounded-[0.25em] border-solid text-primary',
        labelText:
          'ml-2.5 RefinementList-labelText text-primary text-base not-italic leading-[130%]',
        count: '!hidden',
        noResults: 'text-center text-primary text-base'
      }}
    />
  );
};

DynamicRefinementList.propTypes = {
  attribute: PropTypes.string,
  transformItems: PropTypes.func,
  isLongList: PropTypes.bool
};

export default DynamicRefinementList;

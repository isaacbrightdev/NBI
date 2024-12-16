import PropTypes from 'prop-types';
import { RefinementList } from 'react-instantsearch';
import useRefinementList from '@/utils/useRefinementListRoot';

const RefinementListMobileMenu = ({ transformItems, attribute, sortBy }) => {
  useRefinementList();

  return (
    <RefinementList
      attribute={attribute}
      searchable={true}
      searchablePlaceholder={'Search'}
      transformItems={transformItems}
      sortBy={sortBy}
      limit={500}
      classNames={{
        root: 'RefinementList-root flex flex-col pt-5 px-5 border-t border-grey',
        list: 'RefinementList-list flex flex-col gap-2 flex-auto',
        item: 'RefinementList-item flex transition-colors rounded-[0.3125rem] bg-transparent focus-within:!text-secondary focus-within:!bg-[#f3f5f9] hover:!text-secondary hover:!bg-[#f3f5f9] data-hj-allow',
        input: 'data-hj-allow',
        selectedItem:
          'RefinementList-selectedItem select-none !text-secondary !bg-[#f3f5f9]',
        label:
          'RefinementList-label select-none p-1.5 flex w-full clear-both font-normal no-underline bg-transparent border-0',
        checkbox:
          'RefinementList-checkbox !ring-current align-top bg-white bg-no-repeat bg-center bg-contain border appearance-none w-[1.5625rem] h-[1.5625rem] rounded-[0.25em] border-solid text-primary',
        labelText:
          'ml-2.5 RefinementList-labelText select-none text-primary text-base not-italic font-normal leading-[130%]',
        count: '!hidden',
        noResults: 'text-center text-primary text-base'
      }}
    />
  );
};
RefinementListMobileMenu.propTypes = {
  attribute: PropTypes.string,
  transformItems: PropTypes.func,
  children: PropTypes.any,
  heading: PropTypes.string,
  subHeading: PropTypes.string,
  sortBy: PropTypes.any
};
export default RefinementListMobileMenu;

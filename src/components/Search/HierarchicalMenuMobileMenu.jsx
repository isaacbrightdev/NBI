import PropTypes from 'prop-types';
import { HierarchicalMenu } from 'react-instantsearch';

const HierarchicalMenuMobileMenu = ({ attributes, sortBy }) => {
  return (
    <HierarchicalMenu
      attributes={attributes}
      sortBy={sortBy}
      limit={100}
      classNames={{
        count: '!hidden',
        link: 'text-primary',
        list: 'my-1',
        selectedItem: 'font-extrabold',
        showMore: 'text-primary'
      }}
    />
  );
};
HierarchicalMenuMobileMenu.propTypes = {
  attributes: PropTypes.arrayOf(PropTypes.string),
  sortBy: PropTypes.any
};
export default HierarchicalMenuMobileMenu;

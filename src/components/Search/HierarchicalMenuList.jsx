import PropTypes from 'prop-types';
import { HierarchicalMenu } from 'react-instantsearch';

const HierarchicalMenuList = ({ attributes, label, separator = ' > ' }) => {
  return (
    <HierarchicalMenu
      attributes={attributes}
      label={label}
      separator={separator}
      sortBy={['isRefined:desc']}
      limit={100}
      title={label}
      name={label}
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

HierarchicalMenuList.propTypes = {
  attributes: PropTypes.arrayOf(PropTypes.string),
  label: PropTypes.string,
  separator: PropTypes.string
};

export default HierarchicalMenuList;

import PropTypes from 'prop-types';
import { ToggleRefinement } from 'react-instantsearch';

const DynamicToggleRefinement = ({ attribute, label }) => {
  return (
    <ToggleRefinement
      label={label}
      attribute={attribute}
      classNames={{
        root: 'ToggleRefinement-root flex flex-col',
        list: 'ToggleRefinement-list flex flex-col gap-2',
        item: [
          'ToggleRefinement-item',
          'flex',
          'transition-colors',
          'rounded-[0.3125rem]',
          'bg-white',
          'focus-within:!text-secondary',
          'focus-within:!bg-[#f3f5f9]',
          'hover:!text-secondary',
          'hover:!bg-[#f3f5f9]'
        ].join(' '),
        selectedItem:
          'ToggleRefinement-selectedItem !text-secondary !bg-[#f3f5f9]',
        label: [
          'ToggleRefinement-label',
          'p-1.5',
          'flex',
          'w-full',
          'clear-both',
          'font-normal',
          'no-underline',
          'bg-transparent',
          'border-0'
        ].join(' '),
        checkbox: [
          'ToggleRefinement-checkbox',
          '!ring-current',
          'align-top',
          'bg-white',
          'bg-no-repeat',
          'bg-center',
          'bg-contain',
          'border',
          'appearance-none',
          'w-[1.5625rem]',
          'h-[1.5625rem]',
          'rounded-[0.25em]',
          'border-solid',
          'text-primary'
        ].join(' '),
        labelText:
          'ml-2.5 ToggleRefinement-labelText text-primary text-base not-italic font-normal leading-[130%]',
        count: '!hidden'
      }}
    />
  );
};

DynamicToggleRefinement.propTypes = {
  attribute: PropTypes.string,
  label: PropTypes.string
};

export default DynamicToggleRefinement;

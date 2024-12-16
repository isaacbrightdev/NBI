/* eslint-disable */
import { Popover } from '@headlessui/react';
import PropTypes from 'prop-types';
import { memo, useRef } from 'react';
import { RefinementList, useCurrentRefinements } from 'react-instantsearch';
import useMutationObserver from '@/hooks/useMutationObserver';
import useRefinementList from '@/utils/useRefinementListRoot';

const ListMenuText = memo(({ subHeading, attribute, items, canRefine }) => {
  if (canRefine && items.length > 0) {
    if (items[0].attribute === attribute) {
      const count = items[0].refinements.length;
      const aSplit = items[0].refinements[0].value.split('_');
      const text = !!aSplit[1] ? aSplit[1] : aSplit[0].replaceAll('+', ' ');
      return (
        <>
          {count > 1 && <>{count} Selected</>}
          {count === 1 && <>{text}</>}
        </>
      );
    } else {
      return <>{subHeading}</>;
    }
  } else {
    return <>{subHeading}</>;
  }
});

const MenuRefinementList = ({ attribute, sortBy, transformItems }) => {
  useRefinementList();
  return (
    <RefinementList
      attribute={attribute}
      searchable={true}
      searchablePlaceholder={'Search'}
      sortBy={sortBy}
      limit={500}
      transformItems={transformItems}
      classNames={{
        root: 'RefinementList-root flex flex-col max-h-80',
        list: 'RefinementList-list flex flex-col gap-2 overscroll-contain scroll-bar overflow-y-auto flex-auto',
        item: 'RefinementList-item flex transition-colors rounded-[0.3125rem] bg-white focus-within:!text-secondary focus-within:!bg-[#f3f5f9] hover:!text-secondary hover:!bg-[#f3f5f9] data-hj-allow',
        input: 'data-hj-allow',
        selectedItem:
          'RefinementList-selectedItem !text-secondary !bg-[#f3f5f9]',
        label:
          'RefinementList-label p-1.5 flex items-center w-full clear-both font-normal no-underline bg-transparent border-0',
        checkbox:
          'RefinementList-checkbox !ring-current align-top bg-white bg-no-repeat bg-center bg-contain border appearance-none w-[1.5625rem] h-[1.5625rem] rounded-[0.25em] border-solid text-primary',
        labelText:
          'ml-2.5 RefinementList-labelText text-primary text-base not-italic font-normal leading-[130%]',
        count: '!hidden',
        noResults: 'text-center text-primary text-base'
      }}
    />
  );
};

const RefinementListMenu = ({
  attribute,
  setMenuOpen,
  heading,
  isRounded,
  subHeading,
  sortBy,
  transformItems
}) => {
  const mutationRef = useRef();
  const incrementMutationCount = (mutationList) => {
    for (const mutation of mutationList) {
      if (mutation.type === 'attributes') {
        return setMenuOpen(
          mutationRef.current?.dataset?.headlessuiState === 'open'
        );
      }
    }
  };
  if (setMenuOpen) {
    useMutationObserver(mutationRef, incrementMutationCount);
  }
  const { items, canRefine } = useCurrentRefinements({
    includedAttributes: [attribute]
  });
  return (
    <Popover as="div" className="relative flex max-w-[33%]" ref={mutationRef}>
      {({ open }) => (
        <>
          <Popover.Button
            className={[
              'overflow-hidden',
              'no-underline',
              'align-middle',
              'cursor-pointer',
              'select-none',
              'border',
              'border-solid',
              'border-transparent',
              'justify-center',
              'group',
              'inline-flex',
              'flex-col',
              'bg-transparent',
              'px-7',
              'py-[.65rem]',
              'text-base',
              'font-medium',
              'text-primary',
              'hover:!border-grey',
              'hover:bg-[#f3f5f9]',
              'hover:z-10',
              'focus-within:!border-grey',
              'focus-within:shadow-dropdown',
              'focus-within:bg-[#f3f5f9]',
              'focus:bg-[#f3f5f9]',
              'focus:outline-none',
              'focus-visible:ring-0',
              'transition-colors',
              `${open ? '!border-grey !bg-white shadow-dropdown' : ''}`,
              `${isRounded ? 'rounded-full' : 'rounded-l-full'}`
            ].join(' ')}
          >
            <span className="block text-[0.75rem] font-semibold not-italic leading-[130%]">
              {heading}
            </span>
            <span className="block w-full overflow-hidden text-ellipsis whitespace-nowrap text-[1rem] font-normal not-italic leading-[130%] text-grey-dark">
              <ListMenuText
                subHeading={subHeading}
                attribute={attribute}
                items={items}
                canRefine={canRefine}
              />
            </span>
          </Popover.Button>

          <Popover.Panel
            unmount={false}
            className="absolute right-0 top-full z-[1000] mt-0.5 w-[25rem] origin-top-right rounded-md bg-white bg-clip-padding p-7 text-left shadow-lg"
          >
            <MenuRefinementList
              attribute={attribute}
              sortBy={sortBy}
              transformItems={transformItems}
            />
          </Popover.Panel>
        </>
      )}
    </Popover>
  );
};
RefinementListMenu.propTypes = {
  attribute: PropTypes.string,
  transformItems: PropTypes.func,
  setMenuOpen: PropTypes.func,
  children: PropTypes.any,
  isRounded: PropTypes.bool,
  heading: PropTypes.string,
  subHeading: PropTypes.string,
  sortBy: PropTypes.any
};
export default RefinementListMenu;

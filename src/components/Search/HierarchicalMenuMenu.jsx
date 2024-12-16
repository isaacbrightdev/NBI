/* eslint-disable */
import { Popover } from '@headlessui/react';
import PropTypes from 'prop-types';
import { memo, useRef } from 'react';
import { HierarchicalMenu, useCurrentRefinements } from 'react-instantsearch';
import useMutationObserver from '@/hooks/useMutationObserver';

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

const HierarchicalMenuMenu = ({
  attributes,
  setMenuOpen,
  heading,
  isRounded,
  subHeading,
  sortBy
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
    includedAttributes: [attributes[0]]
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
            <span className="block w-full max-w-[20rem] overflow-hidden text-ellipsis whitespace-nowrap text-[1rem] font-normal not-italic leading-[130%] text-grey-dark">
              <ListMenuText
                subHeading={subHeading}
                attribute={attributes[0]}
                items={items}
                canRefine={canRefine}
              />
            </span>
          </Popover.Button>

          <Popover.Panel
            unmount={false}
            className="absolute right-0 top-full z-[1000] mt-0.5 max-h-96 w-[25rem] origin-top-right overflow-y-scroll rounded-md bg-white bg-clip-padding p-7 text-left shadow-lg"
          >
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
          </Popover.Panel>
        </>
      )}
    </Popover>
  );
};
HierarchicalMenuMenu.propTypes = {
  attributes: PropTypes.arrayOf(PropTypes.string),
  setMenuOpen: PropTypes.func,
  children: PropTypes.any,
  isRounded: PropTypes.bool,
  heading: PropTypes.string,
  subHeading: PropTypes.string,
  sortBy: PropTypes.any
};
export default HierarchicalMenuMenu;

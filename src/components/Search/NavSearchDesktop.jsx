/* eslint-disable */
import { Autocomplete } from '@/components/Search/Autocomplete';
import RefinementListMenu from '@/components/Search/RefinementListMenu';
import useMutationObserver from '@/hooks/useMutationObserver';
import { AlgoliaFacets } from '@/utils/searchClient';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useRef, useState } from 'react';
import HierarchicalMenuMenu from './HierarchicalMenuMenu';

const VerticalRule = () => (
  <div className="inline-block h-[2.5em] min-h-[1em] w-px self-center bg-[#B0B7C6] opacity-25 transition-opacity group-focus-within:opacity-0 group-hover:opacity-0"></div>
);
const NavSearchDesktop = ({
  className,
  jurisdictionHeading,
  jurisdictionSubHeading,
  jurisdictionAttributes,
  ...rest
}) => {
  const [isMenuOpen, setMenuOpen] = useState(false);
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
  useMutationObserver(mutationRef, incrementMutationCount);

  const transformItemsTopic = useCallback((items) => {
    return items.map((item) => {
      return {
        ...item,
        highlighted: item.highlighted.replaceAll('+', ' '),
        label: item.label.replaceAll('+', ' ')
      };
    });
  }, []);

  const containerRef = useRef(null);

  const autocompleteInstance = useRef(null);

  useEffect(() => {
    if (autocompleteInstance.current !== null && isMenuOpen) {
      autocompleteInstance.current.setIsOpen(false);
    }
  }, [isMenuOpen]);

  return (
    <div
      ref={containerRef}
      className={[
        'flex',
        'group',
        'items-center',
        'bg-white',
        'rounded-full',
        'border-solid',
        'border-grey',
        'border',
        'items-stretch',
        'search-autocomplete-container',
        'focus-within:!bg-[#f3f5f9]',
        `${isMenuOpen ? '!bg-[#f3f5f9]' : ''}`,
        className
      ].join(' ')}
      {...rest}
    >
      <Autocomplete
        openOnFocus={true}
        detachedMediaQuery="none"
        panelContainer={containerRef.current}
        classNames={{
          form: 'form !static rounded-full text-primary border border-solid border-transparent bg-transparent hover:bg-[#f3f5f9] hover:!border-grey focus-within:!border-grey focus-within:shadow-dropdown focus-within:!bg-white focus:bg-white hover:z-10 focus:outline-none focus-visible:ring-0 transition-colors data-hj-allow',
          input:
            'input px-7 pt-6 pb-[0.6rem] !bg-transparent !shadow-none !ring-0 !border-none h-[auto] placeholder:text-grey-dark placeholder:text-[1rem] placeholder:font-normal placeholder:leading-[130%] data-hj-allow',
          inputWrapper: 'inputWrapper inputWrapper-desktop',
          inputWrapperPrefix:
            'inputWrapperPrefix absolute right-0 h-full inset-y-0',
          inputWrapperSuffix: 'inputWrapperSuffix px-4',
          item: 'aa-autocomplete-item data-hj-allow',
          label: 'label',
          list: 'list',
          loadingIndicator: 'loadingIndicator',
          panel:
            'xl:!left-0 xl:!right-0 xl:!top-[58px] !rounded-[1.25rem] !shadow-dropdown xl:min-w-[530px] 2xl:min-w-[781px]',
          panelLayout:
            'panelLayout !flex-col !justify-center !items-start !gap-[0.9375rem] !p-[1.875rem]',
          clearButton:
            'clearButton bg-accent rounded-full text-accent-text-color w-[1.5625rem] h-[1.5625rem] p-[0.3125rem]',
          root: 'root w-full',
          sourceFooter: 'sourceFooter',
          sourceHeader: 'sourceHeader',
          sourceNoResults: 'sourceNoResults',
          submitButton:
            'flex items-center justify-center bg-accent text-accent-text-color w-[65px] p-0 rounded-[0_50%_50%_0]'
        }}
        placeholder="Enter Keyword or Product ID"
        autocompleteInstance={autocompleteInstance}
      />

      <VerticalRule />
      <RefinementListMenu
        setMenuOpen={setMenuOpen}
        attribute={AlgoliaFacets.Topic.attr}
        isRounded={true}
        subHeading="Select Category"
        sortBy={['isRefined', 'name:asc']}
        heading={AlgoliaFacets.Topic.title}
        transformItems={transformItemsTopic}
      />
      <VerticalRule />
      <HierarchicalMenuMenu
        setMenuOpen={setMenuOpen}
        attributes={jurisdictionAttributes}
        subHeading={jurisdictionSubHeading}
        heading={jurisdictionHeading}
        sortBy={['isRefined', 'name:asc']}
      />
    </div>
  );
};
NavSearchDesktop.propTypes = {
  className: PropTypes.string,
  jurisdictionHeading: PropTypes.string,
  jurisdictionSubHeading: PropTypes.string,
  jurisdictionAttributes: PropTypes.arrayOf(PropTypes.string)
};
export default NavSearchDesktop;

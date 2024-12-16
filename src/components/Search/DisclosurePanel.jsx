import SvgIcon from '@/components/SvgIcon';
import { IS_IPE } from '@/utils/constants';
import { AlgoliaFacets } from '@/utils/searchClient';
import { Disclosure } from '@headlessui/react';
import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { useCurrentRefinements } from 'react-instantsearch';
import { useLocation } from 'react-router-dom';

const DisclosurePanel = ({
  attribute,
  children,
  header,
  className,
  btnClassName,
  isJurisdictionCoupled = false,
  initializeOpen = false,
  refinementCountTransform,
  isMega = false
}) => {
  const { items } = useCurrentRefinements({
    includedAttributes: [attribute]
  });

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const { items: jurisdictionItems } = useCurrentRefinements({
    includedAttributes: [AlgoliaFacets.Jurisdiction.attr]
  });

  const refinementCount = useMemo(() => {
    const count = refinementCountTransform
      ? refinementCountTransform(items)
      : items[0]?.refinements?.length;

    return count;
  }, [items, refinementCountTransform]);


  const refinementLabel = useMemo(() => {
    const label = refinementCountTransform
      ? refinementCountTransform(items)
      : ( items[0]?.refinements?.length > 1 ? 'Selected': items[0]?.refinements[0]?.value );
    if( !label ){
      return false;
    }

    return label;
  }, [items, refinementCountTransform]);

  const creditSpecialtyNoJurisdictionSelectedText = IS_IPE
    ? 'Please select Credit first.'
    : 'Please select CLE State or Other Credit first.';

  const shouldInitializeOpen = useMemo(() => {
    let isAttributePresent = false;

    for (const key of searchParams.keys()) {
      isAttributePresent |= key.includes(attribute);
    }

    return isAttributePresent || initializeOpen;
  }, [searchParams, initializeOpen, attribute]);

  return (
    <Disclosure
      className={[
        'ais-Panel',
        'flex',
        'flex-col',
        'disclosure-panel',
        className
      ].join(' ')}
      as="div"
      defaultOpen={shouldInitializeOpen}
    >
      {({ open }) => (
        <>
          <Disclosure.Button
            className={[
              'ais-Panel-header',
              'relative',
              'flex',
              'py-3',
              'items-center',
              'leading-snug',
              'w-full',
              'text-h4-mobile',
              'text-left',
              'font-medium',
              'bg-white',
              'rounded-none',
              'border-0',
              'text-primary',
              'select-none',
              open ? 'is-open' : 'is-closed',
              btnClassName
            ].join(' ')}
          >
            <span className="flex-grow">{header}</span>
            <span className="flex flex-shrink-0 justify-end items-center gap-2.5">
              {refinementCount > 0 && (
                <>
                {isMega ? (
                  <>
                    <span className={`${ refinementLabel == 'Selected' ? 'flex' : 'hidden' } xl:flex h-5 flex-col items-center justify-center gap-2.5 rounded-full bg-[#dffbe7] px-2.5 text-[0.625rem] font-semibold`}>
                      {refinementCount}
                    </span>
                    <span className="xl:hidden flex-none pe-2.5 text-[0.825rem] font-semibold opacity-[.5] -line-clamp-1 max-w-[200px] md:max-w-[600px] overflow-hidden whitespace-nowrap text-ellipsis">
                      {refinementLabel}
                    </span>
                  </>
                ) : (
                  <span className={`flex h-5 flex-col items-center justify-center gap-2.5 rounded-full bg-[#dffbe7] px-2.5 text-[0.625rem] font-semibold`}>
                    {refinementCount}
                  </span>
                )}
                </>
              )}

              <SvgIcon
                className={`flex-none transition-transform ${
                  open ? '-rotate-180 transform' : ''
                }`}
                name="caret-down"
                width={15}
                height={15}
              />
            </span>
          </Disclosure.Button>
          <Disclosure.Panel unmount={false} className="ais-Panel-body pb-6">
            {!isJurisdictionCoupled ||
            (isJurisdictionCoupled && jurisdictionItems.length) ? (
              children
            ) : (
              <p>{creditSpecialtyNoJurisdictionSelectedText}</p>
            )}
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};
DisclosurePanel.propTypes = {
  children: PropTypes.any,
  header: PropTypes.any,
  footer: PropTypes.any,
  attribute: PropTypes.string,
  className: PropTypes.string,
  btnClassName: PropTypes.string,
  isJurisdictionCoupled: PropTypes.bool,
  initializeOpen: PropTypes.bool,
  refinementCountTransform: PropTypes.func,
  isMega: PropTypes.bool,
};
export default DisclosurePanel;

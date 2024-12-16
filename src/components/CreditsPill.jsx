import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { useInstantSearch } from 'react-instantsearch';
import SvgIcon from '@/components/SvgIcon';
import useSettings from '@/hooks/useSettings';
import useVariantCreditData from '@/hooks/useVariantCreditData';
import { IS_IPE } from '@/utils/constants';
import { AlgoliaFacets } from '@/utils/searchClient';
import truncateStringWithEllipsis from '@/utils/truncateStringWithEllipsis';

const btnClass = [
  'btn--secondary',
  'btn--credit',
  'cursor-pointer',
  'select-none',
  'whitespace-nowrap',
  'relative',
  'z-10',
  'text-fine-print',
  'font-medium'
];

const creditsRefinement = IS_IPE
  ? AlgoliaFacets.CreditsParalegal.attr
  : AlgoliaFacets.CreditsState.attr;
const creditTitleGroupPrefix = IS_IPE ? 'Paralegal_' : 'CLE_';

const CreditsPill = ({
  display_vertical = false,
  product,
  className,
  spanClassName,
  plusSvgClassName,
  creditSvgWidth
}) => {
  const { dispatch } = useSettings();
  const credits = useVariantCreditData(product);
  const { indexUiState } = useInstantSearch();

  const selectedCredit = useMemo(() => {
    return indexUiState?.hierarchicalMenu?.[creditsRefinement];
  }, [indexUiState?.hierarchicalMenu]);

  const selectedCreditDisplayText = useMemo(() => {
    if (selectedCredit?.length > 0) {
      const credit = credits.find(
        (c) =>
          c['credit-title-group'] === creditTitleGroupPrefix + selectedCredit[0]
      );
      const specialty =
        selectedCredit?.length > 1
          ? credit?.['credit-type'].find(
              (ct) => ct['credit-name'] === selectedCredit[1]
            )
          : null;

      if (credit) {
        const total = credit['credit-total'];
        const state = credit['credit-state'];
        const category = credit['credit-category'];
        const extra = specialty
          ? `, including ${specialty['credit-value']} ${specialty['credit-name']}`
          : '';

        return `${total} ${state} ${category}${extra}`;
      }
    }

    if (credits.length === 0) {
      return 'No Credits Available';
    }

    return `${credits.length} Credit Options`;
  }, [selectedCredit]);

  const buttonClasses = [
    ...btnClass,
    ...(Array.isArray(className) ? className : [className])
  ];

  const spanClass = ['select-none', 'align-middle'];
  const spanClasses = [
    ...spanClass,
    ...(Array.isArray(spanClassName) ? spanClassName : [spanClassName])
  ];

  const plusSvgClass = ['align-middle', 'select-none', 'icon-plus'];

  const plusSvgClasses = [
    ...plusSvgClass,
    ...(Array.isArray(plusSvgClassName) ? plusSvgClassName : [plusSvgClassName])
  ];

  if (!product || !selectedCreditDisplayText) return <></>;

  return (
    <button
      type="button"
      aria-label={selectedCreditDisplayText}
      className={[
        ...buttonClasses,
        ...(display_vertical
          ? ['border-0', 'transition-none', '!pl-0']
          : ['transition-all', 'xl-max:border-0'])
      ].join(' ')}
      onClick={() => {
        dispatch({
          type: 'SET_MODAL',
          data: {
            name: 'credits',
            state: true,
            product: {
              ...product,
              meta: {
                course: {
                  credits
                }
              }
            }
          }
        });
      }}
    >
      <SvgIcon
        height={creditSvgWidth ? creditSvgWidth : 15}
        width={creditSvgWidth ? creditSvgWidth : 15}
        className="icon-credits select-none "
        name="credits"
      />
      <span className={[...spanClasses].join(' ')}>
        {truncateStringWithEllipsis(selectedCreditDisplayText, 55)}
      </span>
      {!display_vertical && (
        <SvgIcon
          height={15}
          width={15}
          className={[...plusSvgClasses].join(' ')}
          name="plus"
        />
      )}
    </button>
  );
};

CreditsPill.propTypes = {
  product: PropTypes.shape({
    variants: PropTypes.shape({
      edges: PropTypes.arrayOf(
        PropTypes.shape({
          node: PropTypes.shape({
            credits: PropTypes.shape({
              value: PropTypes.string
            }),
            metafields: PropTypes.shape({
              course: PropTypes.shape({
                credits: PropTypes.arrayOf(
                  PropTypes.shape({
                    'credit-key': PropTypes.string,
                    'credit-title': PropTypes.string,
                    'credit-total': PropTypes.string
                  })
                )
              })
            })
          })
        })
      )
    }),
    meta: PropTypes.shape({
      course: PropTypes.shape({
        credits: PropTypes.arrayOf(
          PropTypes.shape({
            'credit-key': PropTypes.string,
            'credit-title': PropTypes.string,
            'credit-total': PropTypes.any
          })
        )
      })
    }),
    credits: PropTypes.shape({
      value: PropTypes.string
    })
  }),
  className: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string)
  ]),
  spanClassName: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string)
  ]),
  plusSvgClassName: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string)
  ]),
  creditSvgWidth: PropTypes.number,
  display_vertical: PropTypes.bool
};
export default CreditsPill;

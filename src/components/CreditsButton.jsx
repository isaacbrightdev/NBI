import log from 'loglevel';
import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { useInstantSearch } from 'react-instantsearch';
import useLocalStorage from 'use-local-storage';
import SvgIcon from '@/components/SvgIcon';
import useSettings from '@/hooks/useSettings';
import useVariantCreditData from '@/hooks/useVariantCreditData';
import { AlgoliaFacets } from '@/utils/searchClient';

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

const CreditsButton = ({
  display_vertical = false,
  product,
  className,
  spanClassName,
  plusSvgClassName,
  creditSvgWidth
}) => {
  const { dispatch } = useSettings();
  const [jurisdictions] = useLocalStorage('jurisdictionKeys', []);
  const credits = useVariantCreditData(product);
  const { indexUiState } = useInstantSearch();

  const specialtyCredits = useMemo(() => {
    return (
      indexUiState?.refinementList?.[AlgoliaFacets.CreditSpecialty.attr] ?? []
    );
  }, [indexUiState.refinementList]);

  const specialtyCreditLabel = useMemo(() => {
    return specialtyCredits.length == 1 ? ` ${specialtyCredits[0]}` : '';
  }, [specialtyCredits]);

  const selectedCredits = useMemo(() => {
    return credits.filter(
      (credit, index, self) =>
        jurisdictions.includes(credit['credit-title-group']) &&
        self.indexOf(credit) === index
    );
  }, [credits, jurisdictions]);

  const creditLabel = useMemo(() => {
    try {
      if (selectedCredits.length === 0 || selectedCredits.length > 1)
        return `${credits.length} Credit Options`;

      const total = selectedCredits[0]['credit-total'];
      const state = selectedCredits[0]['credit-state'];
      const category = selectedCredits[0]['credit-category'];

      return `${total} ${state} ${category}${specialtyCreditLabel}`;
    } catch (error) {
      log.error(error);
      return 'Credit Options';
    }
  }, [jurisdictions]);

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

  if (!product || creditLabel === '') return <></>;

  return (
    <button
      type="button"
      aria-label={creditLabel}
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
      <span className={[...spanClasses].join(' ')}>{creditLabel}</span>
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

CreditsButton.propTypes = {
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
export default CreditsButton;

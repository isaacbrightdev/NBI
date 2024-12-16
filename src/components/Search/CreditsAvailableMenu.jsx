import SvgIcon from '@/components/SvgIcon';
import useSettings from '@/hooks/useSettings';
import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { HierarchicalMenu } from 'react-instantsearch';
import states from 'states-us';

const toTitleCase = (str) =>
  str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );

const replaceStateWithAbbreviation = (str) => {
  for (const state of states) {
    const regex = new RegExp(`\\b${state.name}\\b`, 'gi');
    if (regex.test(str)) {
      return str.replace(regex, state.abbreviation);
    }
  }
  return str;
};

const preserveAcronyms = (str) => {
  const acronyms = [
    'AICP',
    'CP',
    'CPE',
    'HRCI',
    'NALA',
    'NASBA',
    'NFPA',
    'SCP',
    'SHRM',
    'TBLS'
  ];
  for (const acronym of acronyms) {
    const regex = new RegExp(`\\b${acronym}\\b`, 'gi');
    str = str.replace(regex, acronym);
  }
  return str;
};

const getStateAbbreviation = (
  item,
  creditStatus,
  creditTotal,
  earnUntil,
  islive,
  hasEarnUntil,
  closeModal
) => {
  const creditStatuses = {
    approved: { class: 'bg-active-light', icon: 'check' },
    'not approved': { class: 'bg-error-light', icon: 'close' },
    'not available': { class: 'bg-error-light', icon: 'close' },
    pending: { class: 'bg-[#FBF3D7]', icon: 'pending' },
    'upon request': { class: 'bg-[#D0F7FF]', icon: 'post-apply' },
    reciprocity: { class: 'bg-grey', icon: 'reciprocity' }
  };

  const lowerCaseCreditStatus = creditStatus.toLowerCase();
  const hasCLEPrefix = item.label.includes('CLE');
  let stateName = hasCLEPrefix
    ? item.label.replace('CLE', '').trim()
    : item.label.trim();

  const creditStatusInlineClass =
    creditStatuses[lowerCaseCreditStatus]?.class || '';
  const creditStatusInlineIcon =
    creditStatuses[lowerCaseCreditStatus]?.icon || '';

  const state = states.find(
    (state) => state.name.toUpperCase() === stateName.toUpperCase()
  );
  const colClassState = hasEarnUntil ? 'col-3 md:col-2' : 'col-4';
  const colClassStatus = hasEarnUntil ? 'col-5 md:col-4' : 'col-4';
  const colClassTotal = hasEarnUntil ? 'col-4 md:col-3' : 'col-4';
  const colClassHidden = hasEarnUntil ? 'col-4 md:col-3' : 'col-4';

  const creditTotalDecimal = creditTotal;

  let processedLabel = toTitleCase(item.label);
  processedLabel = replaceStateWithAbbreviation(processedLabel);
  processedLabel = preserveAcronyms(processedLabel);

  const generateLabel = (
    label,
    colClassState,
    colClassStatus,
    colClassTotal,
    colClassHidden,
    creditStatusInlineClass,
    creditStatusInlineIcon,
    creditStatus,
    creditTotalDecimal,
    earnUntil,
    islive,
    hasEarnUntil
  ) => (
    <>
      <button
        type="button"
        className="border-light-grey relative flex w-full items-center border-b bg-white py-2.5 text-left text-callout font-normal text-primary no-underline md:text-base"
        onClick={(e) => {
          e.preventDefault();
          closeModal();
        }}
      >
        <span
          className={`${colClassState} break-words text-fine-print font-semibold sm:text-sm-body md:text-base`}
        >
          {label}
        </span>
        <span
          className={`${colClassStatus} break-words text-fine-print font-semibold sm:text-sm-body md:text-base`}
        >
          <span className="flex items-center gap-1 text-fine-print sm:text-sm-body md:gap-2 md:text-base">
            <span
              className={`flex h-5 w-5 items-center justify-center rounded-full md:h-[30px] md:w-[30px] ${creditStatusInlineClass}`}
            >
              <SvgIcon
                width={15}
                height={15}
                stroke={1}
                className="h-2.5 w-2.5 text-primary md:h-[15px] md:w-[15px]"
                name={creditStatusInlineIcon}
              />
            </span>
            {creditStatus}
          </span>
        </span>
        <div
          className={`${colClassTotal} break-words text-fine-print font-semibold sm:text-sm-body md:text-base`}
        >
          <div className="flex items-center justify-between text-fine-print font-bold sm:text-sm-body md:items-start md:text-base">
            <span className="break-words text-fine-print font-semibold sm:text-sm-body md:text-base">
              {creditTotalDecimal} Total
            </span>
            {!hasEarnUntil && (
              <div className="col-1">
                <SvgIcon height={15} width={15} name="caret-right" />
              </div>
            )}
          </div>
        </div>
        {hasEarnUntil && (
          <span className={`${colClassHidden}`}>
            {earnUntil ? (
              <span className="flex items-center justify-between text-fine-print sm:text-sm-body md:items-start md:text-base">
                {earnUntil}
                <div className="col-1 relative flex items-center justify-between pr-4 md:col-3">
                  <SvgIcon height={15} width={15} name="caret-right" />
                </div>
              </span>
            ) : (
              <span className="flex items-center justify-end text-fine-print sm:text-sm-body md:items-start md:text-base">
                <div className="col-1 relative flex items-center justify-between pr-4 md:col-3">
                  <SvgIcon height={15} width={15} name="caret-right" />
                </div>
              </span>
            )}
          </span>
        )}
      </button>
    </>
  );

  if (state) {
    return {
      ...item,
      label: generateLabel(
        hasCLEPrefix ? `${state.abbreviation} CLE` : state.abbreviation,
        colClassState,
        colClassStatus,
        colClassTotal,
        colClassHidden,
        creditStatusInlineClass,
        creditStatusInlineIcon,
        creditStatus,
        creditTotalDecimal,
        earnUntil,
        islive,
        hasEarnUntil
      ),
      abbreviation: state.abbreviation
    };
  } else {
    return {
      ...item,
      label: generateLabel(
        processedLabel,
        colClassState,
        colClassStatus,
        colClassTotal,
        colClassHidden,
        creditStatusInlineClass,
        creditStatusInlineIcon,
        creditStatus,
        creditTotalDecimal,
        earnUntil,
        islive,
        hasEarnUntil
      ),
      abbreviation: processedLabel
    };
  }
};

const CreditsAvailableMenu = ({ attributes, islive }) => {
  const { modals, dispatch } = useSettings();
  const currentProductCard = modals.credits.product;

  const closeModal = () => {
    setTimeout(() => {
      dispatch({
        type: 'SET_MODAL',
        data: {
          name: 'credits',
          state: false
        }
      });
    }, 100);
  };

  const transformItems = useMemo(
    () => (items) => {
      if (!Array.isArray(items)) {
        return [];
      }

      const credits = [
        ...(currentProductCard?.meta?.course?.credits || []),
        ...(currentProductCard?.variant?.node?.credits?.map((credit) =>
          JSON.parse(credit?.value)
        ) || [])
      ];

      const creditTitles = credits.map((data) => data['credit-title']);
      const creditStatusState = credits.map((data) => data['credit-status']);
      const creditTotals = credits.map((data) => data['credit-total']);
      const earnUntil = credits.map((data) => data['earn-until']);

      const hasEarnUntil = earnUntil.some((value) => value);

      return items
        .filter((item) => creditTitles.includes(item.label))
        .map((item) => {
          const index = creditTitles.indexOf(item.label);
          const creditStatus = creditStatusState[index];
          const creditTotal = creditTotals[index];
          const earnUntilValue = earnUntil[index];

          return getStateAbbreviation(
            item,
            creditStatus,
            creditTotal,
            hasEarnUntil ? earnUntilValue : null,
            islive,
            hasEarnUntil,
            closeModal,
            dispatch
          );
        })
        .sort((a, b) => a.abbreviation.localeCompare(b.abbreviation));
    },
    [currentProductCard, islive]
  );

  return (
    <div>
      <HierarchicalMenu
        attributes={attributes}
        transformItems={transformItems}
        limit={100}
        classNames={{
          count: '!hidden',
          link: 'text-primary',
          list: 'my-1',
          selectedItem: 'font-extrabold',
          showMore: 'text-primary'
        }}
      />
    </div>
  );
};

CreditsAvailableMenu.propTypes = {
  attributes: PropTypes.arrayOf(PropTypes.string).isRequired,
  islive: PropTypes.bool
};

export default CreditsAvailableMenu;

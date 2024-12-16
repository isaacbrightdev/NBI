import SvgIcon from '@/components/SvgIcon';
import useSettings from '@/hooks/useSettings';
import {
  AlgoliaProductIndexName,
  MetaCourseCreditsAttributes
} from '@/utils/searchClient';
import PropTypes from 'prop-types';
import { useInstantSearch } from 'react-instantsearch';
import useLocalStorage from 'use-local-storage';

const CourseCreditsComponent = ({ data, islive }) => {
  const { dispatch } = useSettings();

  const { uiState, setUiState } = useInstantSearch();
  const creditStatuses = {
    approved: { class: 'bg-active-light', icon: 'check' },
    'not approved': { class: 'bg-error-light', icon: 'close' },
    'not available': { class: 'bg-error-light', icon: 'close' },
    pending: { class: 'bg-[#FBF3D7]', icon: 'pending' },
    'upon request': { class: 'bg-[#D0F7FF]', icon: 'post-apply' },
    reciprocity: { class: 'bg-grey', icon: 'reciprocity' }
  };
  const creditStatus = data['credit-status']
    ? data['credit-status'].toLowerCase()
    : '';
  const creditSpecialty = data['specialty-credit'] || false;
  const [currentStates, setCurrentStates] = useLocalStorage(
    'jurisdictionKeys',
    []
  );

  if (!data) return null;

  const creditStatusInlineClass = creditStatuses[creditStatus]
    ? creditStatuses[creditStatus].class
    : '';
  const creditStatusInlineIcon = creditStatuses[creditStatus]
    ? creditStatuses[creditStatus].icon
    : '';

  return (
    <button
      type="button"
      className="border-light-grey relative flex w-full items-center border-b bg-white py-2.5 text-left text-callout font-normal text-primary no-underline md:text-base"
      onClick={(e) => {
        e.preventDefault();

        if (!currentStates.includes(data['credit-title-group'])) {
          const arr2 =
            (uiState[AlgoliaProductIndexName]?.refinementList &&
              uiState[AlgoliaProductIndexName]?.refinementList[
                MetaCourseCreditsAttributes.key
              ]) ||
            [];
          let arr = [...currentStates, ...arr2, data['credit-title-group']];
          let mergedArr = [...new Set(arr)];
          setUiState((prevUiState) => ({
            ...prevUiState,
            [AlgoliaProductIndexName]: {
              ...prevUiState[AlgoliaProductIndexName].refinementList,
              refinementList: {
                ...prevUiState[AlgoliaProductIndexName].refinementList,
                [MetaCourseCreditsAttributes.key]: mergedArr
              }
            }
          }));
          setCurrentStates(mergedArr);
        }
        setTimeout(() => {
          dispatch({
            type: 'SET_MODAL',
            data: {
              name: 'credits',
              state: false
            }
          });
        }, 100);
      }}
    >
      <div
        className={`${
          islive ? 'col-4' : 'col-3 md:col-2'
        } break-words text-fine-print font-semibold sm:text-sm-body md:text-base`}
      >
        {data['credit-state'].length > 1
          ? `${data['credit-state']} ${data['short-desc']}`
          : data['short-desc']}
      </div>
      <div
        className={`${
          islive ? 'col-4' : 'col-5 md:col-4'
        } flex items-center gap-1 text-fine-print sm:text-sm-body md:gap-2 md:text-base`}
      >
        <span
          className={`flex h-5 w-5 items-center justify-center rounded-full md:h-[30px] md:w-[30px] ${creditStatusInlineClass}`}
        >
          <SvgIcon
            width={15}
            height={15}
            stroke={1}
            className="h-2.5 w-2.5 text-primary md:h-[15px] md:w-[15px]"
            name={`${creditStatusInlineIcon}`}
          />
        </span>
        {data['credit-status']}
      </div>
      <div
        className={`${
          islive ? 'col-4' : 'col-4 md:col-3'
        } flex items-start justify-between`}
      >
        {data['credit-type'] &&
        data['credit-type'].length > 0 &&
        creditSpecialty ? (
          <div className="flex flex-col items-center md:items-start">
            <span className="text-fine-print font-bold sm:text-sm-body md:text-base">
              {data['credit-total'].toString()} Total
            </span>

            {data['credit-type'].map((type, index) => (
              <span
                key={index}
                className="hidden text-sm-body md:block md:text-base"
              >
                {`${type['credit-value'].toString()} - ${type['credit-name']}`}
              </span>
            ))}
          </div>
        ) : (
          <>
            <span className="flex flex-col items-center text-fine-print font-bold sm:text-sm-body md:items-start md:text-base">
              {data['credit-total'].toFixed(1)} Total
            </span>
          </>
        )}
        {islive && <SvgIcon height={15} width={15} name="caret-right" />}
      </div>
      {!islive && (
        <div className="col-1 relative flex items-center justify-between pr-4 md:col-3">
          <span className="hidden md:block">{data['earn-until']} </span>
          <SvgIcon height={15} width={15} name="caret-right" />
        </div>
      )}
    </button>
  );
};

CourseCreditsComponent.propTypes = {
  data: PropTypes.object,
  islive: PropTypes.bool
};

export default CourseCreditsComponent;

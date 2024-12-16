import jurisdictionKeysToCheckboxState from '@/utils/jurisdictionKeysToCheckboxState';
import {
  AlgoliaProductIndexName,
  MetaCourseCreditsAttributes
} from '@/utils/searchClient';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useInstantSearch } from 'react-instantsearch';
import SvgIcon from './SvgIcon';

const CreditDetailsCard = ({
  matchingStateData,
  savedStates,
  setSavedStates
}) => {
  const { setUiState } = useInstantSearch();
  // eslint-disable-next-line no-unused-vars
  const [storedCheckboxData, setStoredCheckboxData] = useState(
    jurisdictionKeysToCheckboxState(savedStates)
  );

  if (!matchingStateData) return <></>;

  const category = matchingStateData.category;
  const creditType = matchingStateData['credit-type'] || null,
    earnUntil = matchingStateData['earn-until'] || null,
    creditTotal = matchingStateData['credit-total'] || null,
    creditStatus = matchingStateData['credit-status'] || null,
    creditMessage = matchingStateData['credit-message'] || null,
    creditTitle = matchingStateData['credit-title'] || null,
    warningText = matchingStateData['warning-text'] || null;

  // classnames for the creditStatus
  const creditStatusClassNames = {
    Approved: 'bg-active-light',
    Pending: 'bg-[#FBF3D7]',
    'Not Approved': 'bg-[#FDE0E0]',
    'Not Available': 'bg-[#FDE0E0]',
    'Upon Request': 'bg-[#D0F7FF]',
    Reciprocity: 'bg-[#EBDCFF]'
  };

  const creditIcon = {
    Approved: 'check',
    Pending: 'pending',
    'Not Approved': 'close',
    'Not Available': 'close',
    'Upon Request': 'post-apply',
    Reciprocity: 'reciprocity',
    default: 'check'
  };
  const creditIconClass = creditIcon[creditStatus] || creditIcon.default;
  const creditClass = creditStatusClassNames[creditStatus];

  let dateWarningIcon = null;
  let formattedDate = null;

  // need to render the date from the data, the date is in the format '06-19-2025'
  // we need to convert it to '6/19/2025'
  if (earnUntil) {
    const date = earnUntil.split('-');
    const month = date[0];
    const day = date[1];
    const year = date[2];
    formattedDate = `${month}/${day}/${year}`;

    // if the date is within 25 days of the current date, we need to add a warning class
    const currentDate = new Date();

    // need to calculate 25 days from the current date
    const currentDatePlus25 = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() + 25
    );
    const dateIsWithin25Days =
      currentDate < new Date(formattedDate) &&
      new Date(formattedDate) < currentDatePlus25;

    // how many days left until the earn until is reached
    const daysUntil = Math.floor(
      (new Date(formattedDate) - currentDate) / (1000 * 60 * 60 * 24)
    );
    // if the date is within 25 days, we need to add a warning icon
    dateWarningIcon = dateIsWithin25Days ? (
      <div
        className={`tag flex rounded-[100px] bg-error-light px-2.5 font-semibold text-error`}
      >
        <SvgIcon width={15} height={15} name="alert" />
        <span>{daysUntil} Days Left</span>
      </div>
    ) : null;
  }

  // if they click the close state button, we need to remove the state from localStorage
  const closeState = (e) => {
    e.preventDefault();
    const updatedStates = savedStates.filter((state) => state !== category);
    const formattedStates = jurisdictionKeysToCheckboxState(updatedStates);
    setStoredCheckboxData((prev) => ({
      ...prev,
      ...formattedStates
    }));
    setUiState((prevUiState) => ({
      ...prevUiState,
      [AlgoliaProductIndexName]: {
        ...prevUiState[AlgoliaProductIndexName].refinementList,
        refinementList: {
          ...prevUiState[AlgoliaProductIndexName].refinementList,
          [MetaCourseCreditsAttributes.key]: updatedStates
        }
      }
    }));
    setSavedStates(updatedStates);
  };

  if (!creditStatus) return <></>;

  return (
    <div className="relative flex flex-col rounded-[10px] border p-[20px]">
      <div
        className={`absolute -right-[12px] -top-[20px] z-0 flex h-[45px] w-[45px] items-center justify-center rounded-full ${creditClass}`}
      >
        <SvgIcon width={20} height={20} name={creditIconClass} />
      </div>
      <h4 className="mb-1 font-medium">{creditTitle}</h4>
      <div className="flex">
        <span className="mr-2">Credit Status</span>
        <div
          className={`tag rounded-[100px] px-2.5 font-semibold ${creditClass}`}
        >
          <span>{creditStatus}</span>
          {/* TODO: comment this back in when tooltips are ready - post launch */}
          {/* <SvgIcon width={15} height={15} name="alert-2" /> */}
        </div>
      </div>
      <hr className="my-4" />

      <>
        <div className="flex h-full flex-col justify-between">
          {creditTotal && creditTotal > 0 && (
            <div className="flex items-start">
              <SvgIcon width={15} height={15} name="credits" className="mt-1" />
              <div className="ml-2 flex flex-col">
                <span className="font-semibold">
                  {creditTotal.toString()} Total Credits
                </span>
                {creditType.map((credit) => {
                  return (
                    <span
                      className="text-sm text-gray-500"
                      key={credit['credit-name']}
                    >
                      {`${credit['credit-value'].toString()} ${credit['credit-name']}`}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
          {earnUntil && (
            <div className="mt-2 flex w-full justify-between">
              <div className="flex">
                <SvgIcon
                  width={15}
                  height={15}
                  name="calendar"
                  className="mt-1"
                />
                <div className="ml-2 flex">
                  <span>Earn Until {formattedDate}</span>
                </div>
              </div>
              {dateWarningIcon && <div className="ml-4">{dateWarningIcon}</div>}
            </div>
          )}
          {warningText && (
            <div className="mt-2 flex items-start">
              <span className="pt-1 text-fine-print font-medium italic">
                {warningText}
              </span>
            </div>
          )}
        </div>
      </>
      {creditMessage && <p>{creditMessage}</p>}
      {/* close state */}
      {creditStatus && (
        <button
          type="button"
          className="text-sm mt-[20px] text-left font-medium text-primary"
          onClick={(e) => closeState(e)}
        >
          <span className="border-b border-primary">Close State</span>
        </button>
      )}
    </div>
  );
};

CreditDetailsCard.propTypes = {
  savedStates: PropTypes.array,
  setSavedStates: PropTypes.func,
  matchingStateData: PropTypes.shape({
    category: PropTypes.string,
    'credit-type': PropTypes.arrayOf(
      PropTypes.shape({
        'credit-name': PropTypes.string,
        'credit-value': PropTypes.number
      })
    ),
    'credit-title': PropTypes.string,
    'earn-until': PropTypes.string,
    'credit-total': PropTypes.number,
    'credit-status': PropTypes.string,
    'credit-message': PropTypes.string,
    'warning-text': PropTypes.string
  })
};

export default CreditDetailsCard;

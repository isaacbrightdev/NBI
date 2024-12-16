import { Disclosure } from '@headlessui/react';
import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { ClearRefinements, useRange, useInstantSearch } from 'react-instantsearch';
import { Calendar, DateObject } from 'react-multi-date-picker';
import SvgIcon from '@/components/SvgIcon';
import { AlgoliaFacets, AlgoliaProductIndexName } from '@/utils/searchClient';
import UpcomingEvents from './UpcomingEventsPartial';

const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

const DateDisclosurePanel = ({ attribute }) => {
  const { uiState, setUiState } = useInstantSearch();

  const state = useRange({
    attribute
  });
  const { start, range, refine } = state;

  const min = new DateObject(
    Math.max(new Date().setHours(0, 0, 0, 0), range.min * 1000)
  );
  const max = new DateObject(
    new Date(range.max * 1000).setHours(23, 59, 59, 999)
  );

  const isDisabled = useMemo(() => {
    return range.min * 1000 > Date.now() && range.max * 1000 < Date.now();
  }, [range]);

  const values = useMemo(() => {
    if (isDisabled) return [];

    let dates;
    dates = start.map((date) => new DateObject(new Date(date * 1000)));

    if( ( isNaN(dates[1]) && !isNaN(dates[0]) ) && range.max ){
      dates[1] = new DateObject(new Date(range.max * 1000))
    }

    return dates;
  }, [start, range]);


  const convertDates = (theDate, isEnd = false) => {
    let aDate;
    if (isEnd) {
      aDate = new Date(theDate * 1000);

      aDate.setDate(aDate.getDate());
      aDate.setHours(23, 59, 59, 999);
    } else {
      aDate = new Date(theDate * 1000);
      aDate.setHours(0, 0, 0, 0);
    }

    return Math.trunc(aDate.getTime() / 1000);
  };

  const handleDateChange = (values, rangeBol = false) => {
    if (rangeBol && values.length == 1) return;
    
    const dates = values.map((date) => date.toUnix());
    let start = convertDates(dates[0]);
    const end = convertDates(dates.length > 1 ? dates[1] : dates[0], true);

    if(end > max){
      refine([start, max]);
    }else{
      refine([start, end]);
    }

    //this is to bypass the error regarding the selected date equals the minimum range from the results filter
    if( start == min.toUnix() ){
      setUiState({
        ...uiState,
        [AlgoliaProductIndexName]: {
          ...uiState[AlgoliaProductIndexName],
          range: {
            'meta.course.event-date-timestamp': start + ':' + end,
          },
        },
      });
    }
  };


  return (
    <Disclosure
      className={`ais-Panel disclosure-panel flex flex-col`}
      as="div"
      defaultOpen={true}
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
              'text-primary'
            ].join(' ')}
          >
            <span className="flex-grow">{AlgoliaFacets.EventDate.title}</span>
            <span className="flex flex-shrink-0 items-center gap-2.5">
              {values?.filter((v) => v.isValid).length > 0 && (
                <span
                  className={[
                    'flex',
                    'justify-center',
                    'items-center',
                    'h-5',
                    'px-2.5',
                    'rounded-full',
                    'bg-[#dffbe7]',
                    'font-semibold',
                    'text-[0.625rem]',
                    'whitespace-nowrap'
                  ].join(' ')}
                >
                  {values.map((value, index) => (
                    <span key={index}>
                      {index > 0 && <> - </>}
                      {value.format('MMM DD')}
                    </span>
                  ))}
                </span>
              )}

              <SvgIcon
                className={`transition-transform ${
                  open ? '-rotate-180 transform' : ''
                }`}
                name="caret-down"
                width={15}
                height={15}
              />
            </span>
          </Disclosure.Button>
          <Disclosure.Panel unmount={false} className="ais-Panel-body pb-6">
            {isDisabled && (
              <p className="my-4 text-sm-body">
                Displayed events have no event dates.
              </p>
            )}

            <div
              className={[
                'ais-Panel-body pb-6',
                isDisabled ? 'pointer-events-none opacity-50' : ''
              ]}
            >
              {!isDisabled && (
                <UpcomingEvents
                  dates={values}
                  setEvent={handleDateChange}
                  clear={() => refine([])}
                  range={range}
                />
              )}
              <Calendar
                disabled={isDisabled}
                range={true}
                rangeHover={true}
                headerOrder={['MONTH_YEAR', 'LEFT_BUTTON', 'RIGHT_BUTTON']}
                weekDays={weekDays}
                value={values}
                shadow={false}
                dateSeparator=" - "
                minDate={min}
                maxDate={max}
                editable={false}
                onChange={(values) => handleDateChange(values, true)}
                renderButton={(direction, handleClick) => (
                  <button
                    type="button"
                    className="btn !border-0 !p-[0.35rem]"
                    onClick={handleClick}
                  >
                    {direction === 'right' ? (
                      <SvgIcon name="caret-right" height={20} width={20} />
                    ) : (
                      <SvgIcon name="caret-left" height={20} width={20} />
                    )}
                  </button>
                )}
              />
            </div>

            <ClearRefinements
              includedAttributes={[attribute]}
              classNames={{
                button:
                  'text-secondary text-sm-body font-medium leading-[130%] underline',
                disabledButton: 'opacity-0'
              }}
              translations={{
                resetButtonText: 'Clear selection'
              }}
            />
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

DateDisclosurePanel.propTypes = {
  attribute: PropTypes.string,
  events: PropTypes.array,
  resetEvents: PropTypes.func
};

export default DateDisclosurePanel;

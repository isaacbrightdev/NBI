import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { DateObject } from 'react-multi-date-picker';
import dateHelper from '@/utils/dateHelper';
import { useInstantSearch } from 'react-instantsearch';

const defaultEvents = [
  { id: 'today', name: 'Events today' },
  { id: 'tomorrow', name: 'Events tomorrow' },
  { id: 'thisweek', name: 'Events this week' },
  { id: 'nextweek', name: 'Events next week' }
];

const UpcomingEvents = ({ dates, setEvent, clear, range }) => {
  const { today, tomorrow, weekEnd, nextWeekStart, nextWeekEnd } = dateHelper;
  const [minSelectedDays, maxSelectedDays] = dates.map((d) => d?.toDays());
  const minRangeDays = new DateObject(range.min * 1000).toDays();
  const maxRangeDays = new DateObject(range.max * 1000).toDays();

  const { results, indexUiState } = useInstantSearch();
  const activeFilters = Object.entries(indexUiState.refinementList || {}).some(([values]) => values.length > 0 );

  const eventHandlers = useMemo(
    () => ({
      today: {
        checked: () => {
          return (
            minSelectedDays == today.toDays() &&
            maxSelectedDays == today.toDays()
          );
        },
        disabled: () => {
          if(activeFilters && results?.nbPages == 1){
            return !results?.hits?.some(value => {
              if( value.meta?.course?.['event-date-timestamp'] ){
                const eventTimeStamp = new DateObject(value.meta?.course?.['event-date-timestamp'] * 1000);

                return eventTimeStamp.toDays() === today.toDays();
              }else{
                return false;
              }
            } );
          }else{
            if( results?.hits?.length < 12 ){
              return !results?.hits?.some(value => {
                if( value.meta?.course?.['event-date-timestamp'] ){
                  const eventTimeStamp = new DateObject(value.meta?.course?.['event-date-timestamp'] * 1000);
  
                  return eventTimeStamp.toDays() === today.toDays();
                }else{
                  return false;
                }
              } );
            }else{
              return minRangeDays > today.toDays() || maxRangeDays < today.toDays();
            }
            
          }
        },
        refine: () => {
          setEvent([today]);
        }
      },
      tomorrow: {
        checked: () => {
          return (
            minSelectedDays == tomorrow.toDays() &&
            maxSelectedDays == tomorrow.toDays()
          );
        },
        disabled: () => {
          if(activeFilters && results?.nbPages == 1){
            return !results?.hits?.some(value => {
              if( value.meta?.course?.['event-date-timestamp'] ){
                const eventTimeStamp = new DateObject(value.meta?.course?.['event-date-timestamp'] * 1000);

                return eventTimeStamp.toDays() === tomorrow.toDays();
              }else{
                return false;
              }
            } );
          }else{
            if( results?.hits?.length < 12 ){
              return !results?.hits?.some(value => {
                if( value.meta?.course?.['event-date-timestamp'] ){
                  const eventTimeStamp = new DateObject(value.meta?.course?.['event-date-timestamp'] * 1000);
  
                  return eventTimeStamp.toDays() === tomorrow.toDays();
                }else{
                  return false;
                }
              } );
            }else{
              return (
                minRangeDays > tomorrow.toDays() || maxRangeDays < tomorrow.toDays()
              );
            }
          }
        },
        refine: () => {
          setEvent([tomorrow]);
        }
      },
      thisweek: {
        checked: () => {
          return (
            minSelectedDays >= today.toDays() &&
            maxSelectedDays != minSelectedDays && maxSelectedDays <= weekEnd.toDays()
          );
        },
        disabled: () => {
          if(activeFilters && results?.nbPages == 1){
            return !results?.hits?.some(value => {
              if( value.meta?.course?.['event-date-timestamp'] ){
                const eventTimeStamp = new DateObject(value.meta?.course?.['event-date-timestamp'] * 1000);

                return eventTimeStamp.toDays() <= weekEnd.toDays() && eventTimeStamp.toDays() >= today.toDays();
              }else{
                return false;
              }
            } );
          }else{
            if( results?.hits?.length < 12 ){
              return !results?.hits?.some(value => {
                if( value.meta?.course?.['event-date-timestamp'] ){
                  const eventTimeStamp = new DateObject(value.meta?.course?.['event-date-timestamp'] * 1000);
  
                  return eventTimeStamp.toDays() <= weekEnd.toDays() && eventTimeStamp.toDays() >= today.toDays();
                }else{
                  return false;
                }
              } );
            }else{
              return (
                minRangeDays > today.toDays() && maxRangeDays < weekEnd.toDays()
              );
            }
            
          }
        },
        refine: () => {
          setEvent([today, weekEnd], true);
        }
      },
      nextweek: {
        checked: () => {
          return (
            minSelectedDays >= nextWeekStart.toDays() &&
            maxSelectedDays != minSelectedDays && maxSelectedDays <= nextWeekEnd.toDays()
          );
        },
        disabled: () => {
          if(activeFilters && results?.nbPages == 1 ){
            return !results?.hits?.some(value => {
              if( value.meta?.course?.['event-date-timestamp'] ){
                const eventTimeStamp = new DateObject(value.meta?.course?.['event-date-timestamp'] * 1000);

                return eventTimeStamp.toDays() <= nextWeekEnd.toDays() && eventTimeStamp.toDays() >= nextWeekStart.toDays();
              }else{
                return false;
              }
            } );
          }else{
            return (
              minRangeDays > nextWeekStart.toDays() &&
              maxRangeDays < nextWeekEnd.toDays()
            );
            
          }
        },
        refine: () => {
          setEvent([nextWeekStart, nextWeekEnd], true);
        }
      }
    }),
    [dates, setEvent, range]
  );

  const events = useMemo(() => {
    return defaultEvents.map((event) => {
      return {
        ...event,
        ...eventHandlers[event.id]
      };
    });
  }, [dates]);

  const handleChange = (event) => {
    event.checked() ? clear() : event.refine();
  };

  return (
    <div className="mb-4">
      {events.map((event) => (
        <label
          key={event.id}
          className="ais-RefinementList-label RefinementList-label clear-both flex w-full items-center border-0 bg-transparent p-1.5 font-normal no-underline"
        >
          <input
            className="ais-RefinementList-checkbox RefinementList-checkbox h-[1.5625rem] w-[1.5625rem] appearance-none !rounded-full border border-solid bg-white bg-contain bg-center bg-no-repeat align-top text-primary !ring-current"
            type="checkbox"
            value="Live In-Person"
            checked={event.checked()}
            disabled={event.disabled()}
            onChange={() => handleChange(event)}
          />
          <span
            className={[
              'ais-RefinementList-labelText',
              'RefinementList-labelText',
              'ml-2.5',
              'text-base',
              'not-italic',
              'leading-[130%]',
              event.disabled() && !event.checked() ? 'text-grey' : 'text-primary'
            ].join(' ')}
          >
            {event.name}
          </span>
        </label>
      ))}
    </div>
  );
};

UpcomingEvents.propTypes = {
  dates: PropTypes.arrayOf(PropTypes.objectOf(DateObject)),
  setEvent: PropTypes.func,
  clear: PropTypes.func,
  range: PropTypes.shape({
    max: PropTypes.number,
    min: PropTypes.number
  }),
  isDisabled: PropTypes.bool
};

export default UpcomingEvents;

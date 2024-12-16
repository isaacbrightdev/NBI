import { DateObject } from 'react-multi-date-picker';

// Today timestamps
const today = new DateObject();

// Tomorrow timestamps
const tomorrow = new DateObject().add('1', 'day');
// End of this week timestamps
const weekEnd = new DateObject().add(7 - today.weekDay.number, 'day');

// Next week timestamps
const nextWeekStart = new DateObject().add(8 - today.weekDay.number, 'day');
const nextWeekEnd = new DateObject().add(8 - today.weekDay.number, 'day').add('6', 'day');

const convertTimeRangeToSearchLabel = (timeRange) => {
  if (!timeRange.includes(':')) return '';

  const [startTime, endTime] = timeRange.split(':');

  const startTimeDateString = new Date(startTime * 1000).toLocaleDateString(
    'en-US',
    { year: 'numeric', month: 'long', day: 'numeric' }
  );
  const endTimeDateString = new Date(endTime * 1000).toLocaleDateString(
    'en-US',
    { year: 'numeric', month: 'long', day: 'numeric' }
  );

  if (startTimeDateString == endTimeDateString) return startTimeDateString;

  return `${startTimeDateString} - ${endTimeDateString}`;
};

export default {
  today,
  tomorrow,
  weekEnd,
  nextWeekStart,
  nextWeekEnd,
  convertTimeRangeToSearchLabel
};

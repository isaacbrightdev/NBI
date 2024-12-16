import { useMemo } from 'react';

const useFormattedHours = (hours) => {
  return useMemo(() => {
    if (!hours) return null;

    const wholeHours = Math.floor(hours);
    const wholeMinutes = Math.floor((hours - wholeHours) * 60);

    const wholeHoursString = wholeHours
      ? `${wholeHours} hour${wholeHours > 1 ? 's' : ''}`
      : null;
    const wholeMinutesString = wholeMinutes
      ? `${wholeMinutes} minute${wholeMinutes > 1 ? 's' : ''}`
      : null;

    const durationString = [wholeHoursString, wholeMinutesString].join(' ');
    return durationString;
  }, [hours]);
};

export default useFormattedHours;

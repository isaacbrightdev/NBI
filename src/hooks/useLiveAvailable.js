import { log } from 'loglevel';
import { useMemo } from 'react';

const useLiveAvailable = (product) => {
  const liveAvailable = useMemo(() => {
    try {
      if (
        !product ||
        'event-date-timestamp' in product.metafields.course == false
      ) {
        return false;
      }

      const expire = new Date(
        parseInt(product.metafields.course['event-date-timestamp']) * 1000
      );
      const now = new Date();

      let hours = 3; // a generous default, in case there is no metafield value.
      if (product?.metafields?.course?.hours) {
        hours = parseInt(product?.metafields?.course?.hours);
      }

      return (expire - now) / (60 * 1000) > -60 * hours;
    } catch (error) {
      log.error('Error calculating liveAvailable: useLiveAvailable.js');
      log.error(error);
      return false;
    }
  }, [product]);

  return liveAvailable;
};

export default useLiveAvailable;

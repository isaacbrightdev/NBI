import { useMemo } from 'react';
import slugify from 'slugify';

const useSpeakerNameSlug = (accountName, facultyWebUserId) => {
  return useMemo(() => {
    return slugify(`${accountName}-${facultyWebUserId}`, {
      lower: true,
      remove: /[*+~.()'"!:@]/g
    });
  }, [accountName, facultyWebUserId]);
};

export default useSpeakerNameSlug;

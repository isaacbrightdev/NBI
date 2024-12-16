import { useMemo } from 'react';
import useProductState from '@/hooks/useProductState';
import {
  LIVE_VIDEO_FORMAT_CODES,
  PRODUCT_FORM_SUBSCRIPTION_STATES
} from '@/utils/constants';

const { ALL_INCLUSIVE_SUBSCRIBER, ONDEMAND_SUBSCRIBER } =
  PRODUCT_FORM_SUBSCRIPTION_STATES;

const useAccessBlockState = (product) => {
  const {
    isElearning,
    isTrainingPath,
    isLiveTrainingPath,
    previouslyPurchased,
    subType,
    hasOnDemandVideo,
    hasLiveInPerson,
    hasLiveOnlineVideo,
    previouslyPurchasedFormats
  } = useProductState(product);

  const courseIsJoinable = useMemo(() => {
    if (
      !product?.metafields?.course ||
      !product?.metafields?.course['event-date-timestamp']
    ) {
      return false;
    }

    let hours = 1;
    if (product?.metafields?.course?.hours) {
      hours = parseInt(product?.metafields?.course?.hours);
    }

    const now = new Date();

    const eventDate = new Date(
      parseInt(product.metafields.course['event-date-timestamp']) * 1000
    );

    const minutesUntil = Math.floor((eventDate - now) / 60000);
    return minutesUntil <= 15 && minutesUntil >= -60 * hours;
  }, [product]);

  const metaBlockHandle = useMemo(() => {
    let prefix = subType;
    let suffix = '';
    let secondarySuffix = '';

    /* PREFIX HANDLING */
    if (previouslyPurchased) prefix = 'pp';
    else if (subType == ALL_INCLUSIVE_SUBSCRIBER) prefix = 'all';
    else if (subType == ONDEMAND_SUBSCRIBER) prefix = 'ond';

    /* SUFFIX HANDLING */
    if (isElearning) suffix = 'elrn';
    else if (isTrainingPath) {
      // Only check for live variants in trainingpath if the sub status is ondemand only, as ondemand sub won't cover live variants within training path
      suffix = 'trainingpath';

      // Switch the suffix if a bundle item isn't covered (ondemand sub vs live variant)
      if (isLiveTrainingPath && prefix != 'ond') suffix = 'haslivetrainingpath';
    } else if (hasLiveOnlineVideo) {
      suffix = 'hasliveonline';

      if (
        prefix == 'pp' &&
        subType == ONDEMAND_SUBSCRIBER &&
        !previouslyPurchasedFormats.some((format) =>
          LIVE_VIDEO_FORMAT_CODES.includes(format)
        )
      ) {
        prefix = 'ond';
        suffix = 'nolivevideo';
        secondarySuffix = 'soon';
      }
    } else if (hasLiveInPerson) {
      suffix = 'hasliveinperson';

      if (
        prefix == 'pp' &&
        subType == ONDEMAND_SUBSCRIBER &&
        !previouslyPurchasedFormats.includes('REG')
      ) {
        prefix = 'ond';
        suffix = 'noliveaudio';
        secondarySuffix = 'soon';
      }
    } else if (hasOnDemandVideo) suffix = 'nolivevideo';
    else suffix = 'noliveaudio';

    /* SECONDARY SUFFIX HANDLING */
    if (
      courseIsJoinable &&
      (suffix == 'hasliveonline' || suffix == 'hasliveinperson') &&
      prefix != 'ond'
    )
      secondarySuffix = 'now';

    if (
      (suffix == 'nolivevideo' &&
        product.tags?.includes(`[Title:OnDemand Video]stage:postproduction`)) ||
      (suffix == 'noliveaudio' &&
        product.tags?.includes(`[Title:OnDemand Audio]stage:postproduction`))
    )
      secondarySuffix = 'soon';

    return `${prefix}-${suffix}${secondarySuffix ? `-${secondarySuffix}` : ''}`;
  }, [
    courseIsJoinable,
    subType,
    isElearning,
    isTrainingPath,
    isLiveTrainingPath,
    hasLiveOnlineVideo,
    hasLiveInPerson,
    hasOnDemandVideo
  ]);

  return {
    metaBlockHandle,
    courseIsJoinable
  };
};

export default useAccessBlockState;

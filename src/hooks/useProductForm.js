import log from 'loglevel';
import { useEffect, useMemo, useState } from 'react';
import useCustomer from '@/hooks/useCustomer';
import useMetaobjects from '@/hooks/useMetaobjects';
import {
  LIVE_VIDEO_FORMAT_CODES,
  PRODUCT_FORM_SUBSCRIPTION_STATES
} from '@/utils/constants';
import mapFields from '@/utils/mapFields';
import useProductState from './useProductState';

const { ALL_INCLUSIVE_SUBSCRIBER } = PRODUCT_FORM_SUBSCRIPTION_STATES;

const useProductForm = (product) => {
  const customer = useCustomer();
  const metaobjects = useMetaobjects('register_block', 100);
  const [activeBlock, setActiveBlock] = useState(null);
  const {
    liveAvailable,
    isElearning,
    hasLiveInPerson,
    hasLiveOnlineVideo,
    hasLiveOnlineAudio,
    hasOnDemandVideo,
    hasOnDemandAudio,
    isTrainingPath,
    isLiveTrainingPath,
    previouslyPurchased,
    subType,
    cartSubType,
    activeSub,
    previouslyPurchasedFormats
  } = useProductState(product, customer);

  const registerBlocks = useMemo(() => {
    return metaobjects
      ? metaobjects.reduce(
          (acc, block) => ({ ...acc, [block.handle]: mapFields(block.fields) }),
          {}
        )
      : null;
  }, [metaobjects]);

  useEffect(() => {
    if (!registerBlocks) return;
    try {
      let suffix, prefix;

      // All Inclusive takes priority over cart sub
      if (subType == ALL_INCLUSIVE_SUBSCRIBER) prefix = 'all';
      else if (cartSubType) prefix = cartSubType;
      else prefix = subType;

      // Set the correct suffix
      if (isElearning) suffix = 'elrn';
      else if (isTrainingPath) {
        // Only check for live variants in trainingpath if the sub status is ondemand only, as ondemand sub won't cover live variants within training path
        suffix = 'trainingpath';

        // Switch the suffix if a bundle item isn't covered (ondemand sub vs live variant)
        if (isLiveTrainingPath) {
          if (
            (subType == 'ond' && !previouslyPurchased) ||
            cartSubType == 'cartond'
          )
            suffix = 'haslivetrainingpath';
        }

        if ((!isLiveTrainingPath && subType == 'ond') || subType == 'all')
          prefix = 'ppallond';
        else if (
          (!isLiveTrainingPath && cartSubType == 'cartond') ||
          cartSubType == 'cartall'
        )
          prefix = 'cartallond';
      } else if (hasLiveOnlineVideo) suffix = 'hasliveonline';
      else if (hasLiveInPerson) suffix = 'hasliveinperson';
      else if (hasLiveOnlineAudio) suffix = 'haslivepodcast';
      else if (hasOnDemandVideo) {
        // Doesn't have live video, but has on demand video
        suffix = 'nolivevideo';

        if (subType == 'ond' || subType == 'all') prefix = 'ppallond';
      } else {
        suffix = 'noliveaudio';

        if (subType == 'ond' || subType == 'all') prefix = 'ppallond';
      }

      // depending on the type of course being looked at, the pre-payed prefix should be different
      if (previouslyPurchased) {
        // Keep the ondemand prefix if the live format isn't the format purchased, little hacky but it's an edge case
        if (
          subType == 'ond' &&
          ((suffix == 'hasliveonline' &&
            !previouslyPurchasedFormats.some((format) =>
              LIVE_VIDEO_FORMAT_CODES.includes(format)
            )) ||
            (suffix == 'hasliveinperson' &&
              !previouslyPurchasedFormats.includes('REG')))
        ) {
          prefix = 'ond';
        } else if (
          suffix == 'hasliveonline' ||
          suffix == 'hasliveinperson' ||
          suffix == 'haslivepodcast' ||
          suffix == 'elrn'
        )
          prefix = 'ppall';
        else prefix = 'ppallond';
      }

      if (prefix == 'all') prefix = `pp${prefix}`;

      const blockHandle = `${prefix}-${suffix}`;

      log.info('[NOTICE] Block rendered: ', blockHandle);

      const registerBlockExists = blockHandle in registerBlocks;

      if (registerBlockExists === false) {
        log.error(
          `Register block "${blockHandle}" does not exist. Please ensure it is created and has the exact handle "${blockHandle}" when saving it.`
        );
        return;
      }

      setActiveBlock({
        ...registerBlocks[blockHandle],

        subType,
        activeSub,
        liveAvailable
      });
    } catch (error) {
      log.error(error);
    }
  }, [
    registerBlocks,
    isElearning,
    hasLiveInPerson,
    hasLiveOnlineVideo,
    hasLiveOnlineAudio,
    hasOnDemandVideo,
    hasOnDemandAudio,
    isTrainingPath,
    isLiveTrainingPath,
    previouslyPurchased,
    subType,
    liveAvailable,
    product,
    customer
  ]);

  return { form: activeBlock };
};

export default useProductForm;

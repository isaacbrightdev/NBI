import { flattenConnection, useCart } from '@shopify/hydrogen-react';
import log from 'loglevel';
import { useEffect, useMemo, useState } from 'react';
import useCustomer from '@/hooks/useCustomer';
import PRODUCT_QUERY_BY_GIDS from '@/graphql/productsFromGids';
import {
  ELEARN_FORMAT_CODES,
  LIVE_AUDIO_FORMAT_CODES,
  LIVE_FORMAT_CODES,
  LIVE_VIDEO_FORMAT_CODES,
  ONDEMAND_AUDIO_FORMAT_CODES,
  ONDEMAND_VIDEO_FORMAT_CODES,
  PRODUCT_FORM_SUBSCRIPTION_STATES,
  SUBSCRIPTION_SKU_SUFFIXES,
  SUBSCRIPTION_TYPES
} from '@/utils/constants';
import shopify from '@/utils/shopify-api';
import useLiveAvailable from './useLiveAvailable';

const {
  ALL_INCLUSIVE_IN_CART,
  ALL_INCLUSIVE_SUBSCRIBER,
  NO_SUBCRIPTION_PRESENT,
  ONDEMAND_SUBSCRIBER,
  ONDEMAND_IN_CART
} = PRODUCT_FORM_SUBSCRIPTION_STATES;

const useProductState = (product) => {
  const customer = useCustomer();
  const { lines } = useCart();
  const [trainingPathProducts, setTrainingPathProducts] = useState(null);

  const variants = product?.variants ? flattenConnection(product.variants) : [];

  const liveAvailable = useLiveAvailable(product);

  // load training path products for training path check
  useEffect(() => {
    const coursesString = product?.metafields?.bundle?.courses;
    if (!coursesString) return;

    // parse attempt
    let courses;

    try {
      courses = JSON.parse(coursesString);
    } catch (error) {
      log.error('Error parsing courses in series.');
      return null;
    }

    const load = async () => {
      try {
        const data = await shopify.query(PRODUCT_QUERY_BY_GIDS, {
          ids: courses,
          fields: []
        });

        if (data.nodes === null || data === null) {
          throw 'No product found';
        }

        if (data?.nodes && data?.nodes.length > 0) {
          // Filter out null values for not-found courses.
          setTrainingPathProducts(data?.nodes.filter((n) => n));
        }
      } catch (error) {
        log.error('error', error);
      }
    };

    load();

    return;
  }, [product]);

  const previouslyPurchased = useMemo(() => {
    const prevRegistrations = customer?.metafields?.prev_reg?.courses;

    return (
      prevRegistrations &&
      variants.some((variant) => prevRegistrations.includes(variant.id))
    );
  }, [product, customer]);

  const previouslyPurchasedFormats = useMemo(() => {
    const prevRegistrations = customer?.metafields?.prev_reg?.courses;

    if (prevRegistrations) {
      return prevRegistrations
        .filter((variantID) => {
          return variants.some((variant) => variant.id == variantID);
        })
        .map((variantID) => {
          const curVariant = variants.find(
            (variant) => variant.id == variantID
          );

          if (curVariant) return curVariant.barcode;
        });
    }
    return [];
  }, [product, customer]);

  const isTrainingPath = useMemo(() => {
    return trainingPathProducts && trainingPathProducts.length > 0;
  }, [trainingPathProducts]);

  const isLiveTrainingPath = useMemo(() => {
    return (
      trainingPathProducts &&
      trainingPathProducts.some((currentProduct) => {
        if (!currentProduct?.variants) return false;

        return flattenConnection(currentProduct.variants).some((variant) =>
          LIVE_FORMAT_CODES.includes(variant.barcode)
        );
      })
    );
  }, [product, trainingPathProducts]);

  const hasLiveInPerson = useMemo(() => {
    return (
      variants.some((variant) => variant.barcode == 'REG') && liveAvailable
    );
  }, [product, liveAvailable]);

  const hasLiveOnlineVideo = useMemo(() => {
    return (
      variants.some((variant) =>
        LIVE_VIDEO_FORMAT_CODES.includes(variant.barcode)
      ) && liveAvailable
    );
  }, [product, liveAvailable]);

  const hasLiveOnlineAudio = useMemo(() => {
    return (
      variants.some((variant) =>
        LIVE_AUDIO_FORMAT_CODES.includes(variant.barcode)
      ) && liveAvailable
    );
  }, [product, liveAvailable]);

  const hasOnDemandVideo = useMemo(() => {
    return variants.some((variant) =>
      ONDEMAND_VIDEO_FORMAT_CODES.includes(variant.barcode)
    );
  }, [product]);

  const hasOnDemandAudio = useMemo(() => {
    return variants.some((variant) =>
      ONDEMAND_AUDIO_FORMAT_CODES.includes(variant.barcode)
    );
  }, [product]);

  const isElearning = useMemo(() => {
    if (variants.length === 0) return false;
    const variantBarcode = variants[0].barcode ?? '';
    return ELEARN_FORMAT_CODES.includes(variantBarcode) ? true : false;
  }, [product]);

  const cartSubType = useMemo(() => {
    try {
      const subscription = lines
        .sort((line) => {
          const subSku = line?.merchandise?.sku ?? '';
          if (line.sellingPlanAllocation) {
            if (
              line.merchandise.product.title.toLowerCase().includes('all') ||
              subSku.includes(SUBSCRIPTION_SKU_SUFFIXES.ALL_INCLUSIVE_ANY)
            ) {
              return -1;
            } else {
              return 0;
            }
          }
        })
        .find((line) => line.sellingPlanAllocation);

      if (!subscription) {
        return false;
      }

      const currentSubSku = subscription.merchandise.sku ?? '';

      if (currentSubSku.includes(SUBSCRIPTION_SKU_SUFFIXES.ALL_INCLUSIVE_ANY)) {
        return ALL_INCLUSIVE_IN_CART;
      }

      if (currentSubSku.includes(SUBSCRIPTION_SKU_SUFFIXES.ONDEMAND_ANY)) {
        return ONDEMAND_IN_CART;
      }

      return false;
    } catch (error) {
      log.error('Error calculating cart sub state: useProductState.js');
      log.error(error);
    }
  }, [lines, liveAvailable, product]);

  const userHasSub = useMemo(() => {
    try {
      if (!customer) {
        return false;
      }

      const { course } = product?.metafields?.course
        ? product.metafields
        : { course: {} };

      const { subscriptions } = customer?.metafields?.subscriptions
        ? customer.metafields
        : { subscriptions: {} };

      const customerSubExpirationTimestamp = subscriptions?.details[
        'expiration-timestamp'
      ]
        ? parseInt(subscriptions.details['expiration-timestamp'] + '000')
        : 1672560000000;

      const customerSubExpiration = new Date(customerSubExpirationTimestamp);

      const customerSubType =
        subscriptions?.details['sub-type']?.toLowerCase() ?? 'none';

      const productEventDateTimestamp = course['event-date-timestamp']
        ? parseInt(course['event-date-timestamp'] + '000')
        : 1672560000000;

      return (
        SUBSCRIPTION_TYPES.includes(customerSubType) &&
        customerSubExpiration > Date.now() &&
        customerSubExpiration > productEventDateTimestamp
      );

      // new Date(productEventDateTimestamp)
    } catch (error) {
      log.error('Count not compute userHasSub: useProductState.js');
      log.error(error);
      return false;
    }
  }, [customer, product]);

  /** @type {PRODUCT_FORM_SUBSCRIPTION_STATES[keyof PRODUCT_FORM_SUBSCRIPTION_STATES]} */
  const subType = useMemo(() => {
    try {
      const userSubType = userHasSub
        ? customer?.metafields?.subscriptions?.details[
            'sub-type'
          ]?.toLowerCase()
        : NO_SUBCRIPTION_PRESENT;

      if (userSubType == 'all') return ALL_INCLUSIVE_SUBSCRIBER;
      else if (userSubType === 'ondemand') return ONDEMAND_SUBSCRIBER;
      else return userSubType;
    } catch (error) {
      log.error(error);
      return 'nosub';
    }
  }, [customer, userHasSub, liveAvailable, isElearning, isTrainingPath]);

  const activeSub = useMemo(() => {
    try {
      if (isElearning && subType === 'noall') {
        return false;
      }

      // To cover 'live' subscribers viewing non-live products
      if (
        !product?.productType?.toLowerCase()?.includes('live') &&
        subType === 'live'
      ) {
        return false;
      }

      return subType !== 'nosub';
    } catch (error) {
      log.error(error);
      return false;
    }
  }, [subType, customer, product]);

  return {
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
    previouslyPurchasedFormats,
    subType,
    cartSubType,
    activeSub
  };
};

export default useProductState;

import { useCart, useCartLine } from '@shopify/hydrogen-react';
import log from 'loglevel';
import { createContext, useContext, useEffect, useMemo } from 'react';
import slugify from 'slugify';
import '@/utils/cartCalculations';
import {
  getFinalSubscriptionDiscountQuantity,
  getInCartSubscriptionCounts
} from '@/utils/cartCalculations';
import { SUBSCRIPTION_SKU_SUFFIXES } from '@/utils/constants';
import useCustomer from './useCustomer';

export const DiscountContext = createContext();

const NON_ON_DEMAND_SUFFIXES = [
  'ELRN',
  'ER',
  'SUBM',
  'SUBA',
  'SUB' // just in case
];

function isCoveredByOnDemandSub(variantSku) {
  if (!variantSku) return false;
  return NON_ON_DEMAND_SUFFIXES.reduce((stillValid, currentBarcode) => {
    if (variantSku.includes(currentBarcode)) stillValid = false;
    return stillValid;
  }, true);
}

const useLineDiscounts = () => {
  const customer = useCustomer();
  const { lines } = useCart();
  const line = useCartLine();
  const { setCartDiscount, upsellDiscountClaimedLine } =
    useContext(DiscountContext);

  const lineItemIsSubscription = useMemo(() => {
    try {
      return line?.merchandise?.product?.productType === 'Subscription';
    } catch (error) {
      log.error(error);
    }
  }, [line]);

  const userSubType = useMemo(() => {
    try {
      if (!customer) return 'none';
      const expire =
        customer.metafields.subscriptions.details['expiration-timestamp'] *
        1000;
      const now = Date.now();

      if (expire <= now) return 'none';

      // Check expiration against the event date
      const productMetafield = line.merchandise.product.metafield;

      if (
        productMetafield &&
        productMetafield.type === 'single_line_text_field'
      ) {
        const eventDateTimestamp = productMetafield.value;
        const eventDate = eventDateTimestamp
          ? new Date(Number(eventDateTimestamp) * 1000)
          : null;

        if (expire && eventDate && eventDate > expire) {
          return 'none';
        }
      }

      return customer.metafields.subscriptions.details['sub-type'];
    } catch (error) {
      log.error(error);
    }
  }, [customer, line]);

  const cartSubType = useMemo(() => {
    const subItems = lines.filter(
      (item) => item.merchandise.product.productType === 'Subscription'
    );

    let subType = 'none';

    for (const foundSubItem of subItems) {
      // TODO: Remove handle checks for SubType once SKUs are accurately updated
      const subSku = foundSubItem.merchandise.sku;
      if (
        foundSubItem.merchandise.product.handle.includes('all') ||
        subSku.includes(SUBSCRIPTION_SKU_SUFFIXES.ALL_INCLUSIVE_ANY)
      ) {
        subType = 'all';
        break;
      }
      if (
        foundSubItem.merchandise.product.handle.includes('ondemand') ||
        subSku.includes(SUBSCRIPTION_SKU_SUFFIXES.ONDEMAND_ANY)
      ) {
        subType = 'ondemand';
      }
    }

    return subType;
  }, [lines]);

  /**
   * Returns whether or not:
   *
   * (1) the logged-in user's subscription status (if present)
   *
   * **OR**
   *
   * (2) the current user's in-cart subscription items
   *
   * match the line item variant's required subscription tier to be considered for discounts.
   *
   * @type {Boolean}
   */
  const subTypeMatchesVariantType = useMemo(() => {
    if (lineItemIsSubscription) return false;

    const lineType = slugify(line.merchandise.title, { lower: true }).replace(
      '-',
      ''
    );

    let result = false;

    if (userSubType !== 'none') {
      if (userSubType === 'all') {
        result = true;
      } else {
        result = lineType.includes(userSubType);
      }
    }

    if (cartSubType !== 'none' && result === false) {
      if (cartSubType === 'all') {
        result = true;
      } else {
        result = cartSubType.includes('all') || lineType.includes(cartSubType);
      }
    }

    return result;
  }, [lineItemIsSubscription, userSubType, line, cartSubType]);

  const upsellDiscount = useMemo(() => {
    if (!line?.merchandise?.product?.tags?.includes('upsell-eligible')) {
      return 0;
    }

    if (
      !customer?.metafields ||
      !customer?.metafields?.recentOrderAmount?.details
    )
      return 0;
    if (cartSubType === 'none' || userSubType !== 'none') return 0;

    return customer.metafields.recentOrderAmount.details.reduce(
      (subDiscount, currentDiscountDetail) => {
        try {
          // Get upsell details
          const subTypeMatch =
            currentDiscountDetail['sub-type'] === cartSubType;
          const isNotExpired =
            Date.now() < new Date(currentDiscountDetail.expiration);
          const discountAmountIsValid = !isNaN(currentDiscountDetail.amount);

          if (subTypeMatch && isNotExpired && discountAmountIsValid) {
            // Don't let this discount return a number greater than the line's actual cost.
            if (
              currentDiscountDetail.amount >
              parseFloat(line.cost.totalAmount.amount)
            ) {
              return parseFloat(line.cost.totalAmount.amount);
            } else {
              return currentDiscountDetail.amount;
            }
          }
        } catch (error) {
          log.error(
            'Could not process customer upsell discount for display: ',
            error
          );
        }
      },
      0
    );
  }, [customer, cartSubType]);

  const totalSubCounts = useMemo(() => {
    let result = getInCartSubscriptionCounts(lines);

    // Check for + add customer sub to totals
    if (userSubType !== 'none') {
      if (!result[userSubType])
        log.error(
          `Customer metafield property 'sub-type' has an invalid value of: "${userSubType}"`
        );
      result[userSubType] += 1;
    }

    return result;
  }, [line, lines, userSubType]);

  const multiRegDiscount = useMemo(() => {
    try {
      if (line.quantity === 1) {
        return 0;
      }

      const { multiRegistration } = JSON.parse(
        line.merchandise?.discount.value ? line.merchandise?.discount.value : '[]'
      );

      return multiRegistration;
    } catch (error) {
      return 0;
    }
  }, [line]);

  const savings = useMemo(() => {
    try {
      let savings = multiRegDiscount * line.quantity;
      if (!line.discountAllocations) {
        log.warn('line.discountAllocations is a falsy value.');
        return savings;
      }

      if (
        (!upsellDiscountClaimedLine.current ||
          upsellDiscountClaimedLine.current == line.id) &&
        upsellDiscount > 0
      ) {
        if (line.merchandise.product.handle.includes(cartSubType)) {
          savings += upsellDiscount;
          upsellDiscountClaimedLine.current = line.id;
          return savings;
        }
      }

      // sum the Shopify-applied disounts with the upsell and multi-reg discounts
      const lineDiscounts = line.discountAllocations.reduce(
        (total, { discountedAmount }) =>
          total + parseFloat(discountedAmount.amount),
        savings
      );

      if (
        subTypeMatchesVariantType &&
        line?.merchandise?.product?.productType !== 'Subscription'
      ) {
        // Get Line Item coverage conditions
        const coveredByOnDemandSub = isCoveredByOnDemandSub(
          line?.merchandise?.sku
        );

        // Get Subscriber conditions (cart AND user, we need both)
        const isAllInclusiveSubscriber =
          userSubType === 'all' || cartSubType === 'all';

        const isOnDemandSubscriberAndCoversVariant =
          (userSubType === 'ondemand' || cartSubType === 'ondemand') &&
          coveredByOnDemandSub;

        if (isAllInclusiveSubscriber || isOnDemandSubscriberAndCoversVariant) {
          // Using all available subs + coverage conditions, get final qty of full discounts.
          const subDiscountQuantity = getFinalSubscriptionDiscountQuantity(
            totalSubCounts,
            {
              isAllInclusiveSubscriber,
              coveredByOnDemandSub
            }
          );

          const lineAmount = parseFloat(line.cost.totalAmount.amount);
          const amountPerQuantity = parseFloat(
            line.cost.amountPerQuantity.amount
          );

          // subtract out multi-reg discounts that were applied to sub-covered "seats"
          const subDiscount =
            amountPerQuantity * subDiscountQuantity +
            lineDiscounts -
            multiRegDiscount * subDiscountQuantity;

          return subDiscount > lineAmount ? lineAmount : subDiscount;
        }
      }

      return lineDiscounts;
    } catch (error) {
      log.error('Error calculating line item savings: useLineDiscounts.js');
      log.error(error);
      return 0;
    }
  }, [
    lines,
    customer,
    subTypeMatchesVariantType,
    upsellDiscount,
    userSubType,
    cartSubType
  ]);

  useEffect(() => {
    setCartDiscount({ id: line.id, amount: savings });
  }, [line, savings, upsellDiscount]);

  return {
    savings,
    activeSub: subTypeMatchesVariantType,
    userSubType,
    cartSubType
  };
};

export default useLineDiscounts;

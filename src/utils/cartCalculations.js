/** @typedef {import("@shopify/hydrogen-react/storefront-api-types").CartLine} CartLine */

/** @typedef {Partial<CartLine & { bundledLines: String[] }>} ConsolidatedCartLine */

/** @typedef {Partial<CartLine & { bundledLines: String[] }>} ConsolidatedCartLine */
import log from 'loglevel';
import { SUBSCRIPTION_SKU_SUFFIXES } from './constants';

/**
 *
 * @param {CartLine[]} lines
 * @returns
 */
export const getCalculatedSubtotal = (lines) => {
  return lines.reduce((calculated, currentLine) => {
    const lineAmtPerQty = parseFloat(currentLine.cost.amountPerQuantity.amount);
    const lineQuantity = currentLine.quantity;
    return (calculated += lineAmtPerQty * lineQuantity);
  }, 0);
};

/**
 * `fixOutdatedCost()`
 *
 * Checks if the `line.cost.totalAmount.amount` matches the expected amount of:
 * `line.quantity * line.cost.amountPerQuantity.amount`
 *
 * This can become outdated if an attendee was removed that had an active subscription
 * or other active discount applied. This seems to be a bug in the Storefront API itself,
 * fetching a miscalculated cart in between Shopify Function runs.
 *
 * **Note: This directly mutates the line passed to it.**
 *
 * @param {Partial<CartLine>} line
 * @returns {void}
 */
const fixOutdatedCost = (line) => {
  const currentTotal = parseFloat(line.cost.totalAmount.amount);
  const expectedTotal =
    parseFloat(line.cost.amountPerQuantity.amount) * line.quantity;

  if (line.discountAllocations.length == 0 && currentTotal !== expectedTotal) {
    line.cost.totalAmount.amount = expectedTotal.toFixed(2);
  }
};

/**
 * `consolidatedLines` callback
 *
 * Combines CartLines after Shopify Functions or Discount codes have caused Shopify to
 * split the cart into lines with duplicate `merchandise.id` values. This function
 * recombines them to properly display summed totals and discounts before checkout.
 *
 * @callback ReducerCallback
 * @param {ConsolidatedCartLine[]} processedLines - The processed lines so far
 * @param {Partial<CartLine>} currentLine - The current line to be processed
 * @returns {ConsolidatedCartLine[]} Combined CartLines with discountAllocations and totalCosts adjusted
 */

/**
 *
 *
 * @param {Partial<CartLine>[]} lines
 * @returns {Partial<CartLine & { bundledLines: String[] }>[]}
 */
export const consolidateLines = (lines) => {
  const consolidatedLines = lines.reduce(
    /** @type {ReducerCallback} */
    (processedLines, originalCurrentLine) => {
      // get deep copy
      /** @type {Partial<CartLine>} */
      const currentLine = JSON.parse(JSON.stringify(originalCurrentLine));

      // if same variant + discount allocs, combine
      const seenVariantIndex = processedLines.findIndex((proceesedLine) => {
        return proceesedLine.merchandise.id === currentLine.merchandise.id;
      });

      if (seenVariantIndex === -1) {
        fixOutdatedCost(currentLine);
        processedLines.push({ ...currentLine });
        return processedLines;
      }

      // Merge Cart Lines with duplicate variants
      if (seenVariantIndex > -1) {
        const seenLineId = processedLines[seenVariantIndex].id;
        const seenLineQuantity = processedLines[seenVariantIndex].quantity;

        // Increment line.cost.total for AttendeeLine
        const seenTotalCost =
          parseFloat(
            processedLines[seenVariantIndex].cost.amountPerQuantity.amount
          ) * processedLines[seenVariantIndex].quantity;

        const currentTotalCost =
          parseFloat(currentLine.cost.amountPerQuantity.amount) *
          currentLine.quantity;

        const newTotalCost = (seenTotalCost + currentTotalCost).toFixed(2);
        processedLines[seenVariantIndex].cost.totalAmount.amount = newTotalCost;

        // Create de-structured copy of line IDs to use for breaking up attendee lines later
        const currentBundledLines = processedLines[seenVariantIndex]
          .bundledLines
          ? [...processedLines[seenVariantIndex].bundledLines]
          : [...Array(seenLineQuantity).fill(`${seenLineId}`)];

        // Add the line IDs for the current line
        currentBundledLines.push(
          ...Array(currentLine.quantity).fill(`${currentLine.id}`)
        );

        // Assign the newly updated line IDs to the stored line object
        processedLines[seenVariantIndex].bundledLines = [
          ...currentBundledLines
        ];

        // Increment quantity of already stored line
        processedLines[seenVariantIndex].quantity += currentLine.quantity;
      }

      // Combine discountAllocations for calculations later
      if (currentLine.discountAllocations.length > 0) {
        const currentLineDiscounts = [...currentLine.discountAllocations];
        const processedLineDiscounts = [
          ...processedLines[seenVariantIndex].discountAllocations
        ];

        // Assign newly combined discountAllocations to stored line object
        processedLines[seenVariantIndex].discountAllocations = [
          ...currentLineDiscounts,
          ...processedLineDiscounts
        ];
      }

      return processedLines;
    },
    []
  );

  // Put Subscriptions at the top to help improve UX at attendee reg because
  // all registrants must be added before discounts are calculated.
  consolidatedLines.sort((lineA, lineB) => {
    if (lineA?.merchandise?.product?.productType === 'Subscription') {
      return -1;
    } else if (lineB?.merchandise?.product?.productType === 'Subscription') {
      return 1;
    } else {
      return 0;
    }
  });

  return consolidatedLines;
};

/**
 * @typedef {Object} SubscriptionCounts
 * @property {Number} all
 * @property {Number} ondemand
 */

/**
 * @typedef {Object} SubscriptionCoverageConditions
 * @property {Boolean} isAllInclusiveSubscriber
 * @property {Boolean} coveredByOnDemandSub
 *
 */

/**
 * Returns the counts of each Subscription type that are present within a set of
 * CartLines.
 *
 * @param {Partial<CartLine>[]} lines
 * @returns {SubscriptionCounts}
 */
export const getInCartSubscriptionCounts = (lines) => {
  return lines.reduce(
    (subCounts, line) => {
      if (line?.merchandise?.product?.productType === 'Subscription') {
        const subSku = line?.merchandise?.sku ?? '';

        if (subSku.includes(SUBSCRIPTION_SKU_SUFFIXES.ALL_INCLUSIVE_ANY)) {
          subCounts.all += line?.quantity ?? 0;
        }

        if (subSku.includes(SUBSCRIPTION_SKU_SUFFIXES.ONDEMAND_ANY)) {
          subCounts.ondemand += line?.quantity ?? 0;
        }
      }

      return subCounts;
    },
    { all: 0, ondemand: 0 }
  );
};

/**
 * getFinalSubscriptionDiscountQuantity
 *
 * Returns the final quantity of subscription (full) discounts that should be
 * applied to a line item, given the subscription coverage conditions.
 *
 * @param {SubscriptionCounts} subCounts
 * @param {SubscriptionCoverageConditions} subConditions
 * @returns {Number}
 */
export const getFinalSubscriptionDiscountQuantity = (
  subCounts,
  subConditions
) => {
  let totalDiscountQuantity = 0;

  if (subConditions.isAllInclusiveSubscriber) {
    totalDiscountQuantity += subCounts.all;
  }
  if (subConditions.coveredByOnDemandSub) {
    totalDiscountQuantity += subCounts.ondemand;
  }

  if (totalDiscountQuantity === 0)
    log.error(
      'A course has qualified for discounts but could not have them calculated correctly.'
    );

  return totalDiscountQuantity;
};

/**
 * @typedef {Object} RecentOrderAmount
 * @property {"all" | "ondemand"} sub-type - The type of subscription to be discounted
 * @property {Number} amount - Discount amount to place on the subscription
 * @property {String} expiration - Expiration date in the format of "YYYY-MM-DD"
 */

/**
 * getMaxUpsellDiscount()
 *
 * Provided a customer's recentOrderAmount metafield, returns the highest available and
 * usable discount, given what subscription line items are present in-cart.
 *
 * @param {Partial<CartLine>[]} lines
 * @param {RecentOrderAmount[] | undefined} recentOrderAmounts
 * @returns {RecentOrderAmount | null}
 *
 */
export const getMaxUpsellDiscount = (lines, recentOrderAmounts) => {
  if (!recentOrderAmounts || recentOrderAmounts.length === 0) return null;

  // Gather available subs in cart
  const subCounts = getInCartSubscriptionCounts(lines);
  const availableSubs = [];

  Object.entries(subCounts).forEach(([subType, subCount]) => {
    if (subCount > 0) availableSubs.push(subType);
  });

  if (availableSubs.length === 0) return null;

  // Prep empty recentOrderAmount
  const now = new Date();
  /** @type {RecentOrderAmount} */
  let greatest = {
    amount: 0,
    'sub-type': '',
    expiration: `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`
  };

  // Check for greatest discount
  for (const recentOrderAmount of recentOrderAmounts) {
    if (
      recentOrderAmount.amount > greatest.amount &&
      availableSubs.includes(recentOrderAmount['sub-type']) &&
      new Date(recentOrderAmount.expiration) > now
    ) {
      greatest = { ...recentOrderAmount };
    }

    if (
      recentOrderAmount.amount === greatest.amount &&
      recentOrderAmount['sub-type'] === 'all' &&
      availableSubs.includes('all') &&
      new Date(recentOrderAmount.expiration) > now
    ) {
      greatest = { ...recentOrderAmount };
    }
  }

  return greatest['sub-type'] === '' ? null : greatest;
};

/**
 * getRealUpsellDiscountClaimedLine()
 *
 * If present, returns a subscription line item's merchandise (variant) ID
 * that has been discounted by an Automatic Discount (the upsell discount),
 * else returns null.
 *
 * @param {Partial<CartLine>[]} lines - The real underlying cart lines returned by Hydrogen's useCart() hook.
 * @param {String} expectedAmountString - The amount the upsell discount is expected to be.
 * @returns {String | null} - The merchandise (variant) ID of the matching discounted line item
 */
export const getRealUpsellDiscountClaimedLine = (
  lines,
  expectedAmountString
) => {
  const expectedDiscountAmount = parseFloat(expectedAmountString ?? '0');
  if (expectedDiscountAmount === 0) {
    log.error(
      "Invalid value for 'amount' passed to 'getRealUpsellDiscountClaimedLine()'."
    );
    return null;
  }

  const onlySubscriptionLines = lines.filter(
    (line) => line?.merchandise?.product?.productType === 'Subscription'
  );

  for (const line of onlySubscriptionLines) {
    if (
      line?.discountAllocations?.length &&
      line?.discountAllocations?.length > 0
    ) {
      const lineCostPerQuantity = parseFloat(
        line?.cost?.amountPerQuantity?.amount ?? '0'
      );

      if (lineCostPerQuantity === 0) {
        log.warn(
          'Line item encountered as error with no valid cost per quantity. Discounts may no longer be correctly calculated as a result.'
        );
        continue;
      }

      for (const discount of line.discountAllocations) {
        const upsellIsGreaterThanCost =
          expectedDiscountAmount > lineCostPerQuantity;

        const isFullDiscount =
          lineCostPerQuantity ===
          parseFloat(discount?.discountedAmount?.amount);

        if (isFullDiscount && upsellIsGreaterThanCost) {
          return line.merchandise.id;
        }

        if (
          expectedDiscountAmount ===
          parseFloat(discount?.discountedAmount?.amount)
        ) {
          return line.merchandise.id;
        }
      }
    }
  }

  return null;
};

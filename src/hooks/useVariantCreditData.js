import log from 'loglevel';
import { useMemo } from 'react';

// loops through a product to extract credit data from product variants into an array
// uses hierarchy of:
// 1. algolia product.meta.credits
// 2. shopify product variant credits (live registration variant)
// 3. shopify product variant credits (on-demand variant)
// 4. shopify product variants credits (all variants flattend into a single array)

const extractVariantCreditData = (product) => {
  // Early return for null product
  if (!product) return [];

  // First Hierarchy: algolia product.meta.credits
  if (product?.meta?.course?.credits) return product.meta.course.credits;

  // Second and Third Hierarchies: Check variants
  if (product?.variants?.edges) {
    // Initialize credits array
    let variantCredits = [];

    // Handle on-demand variant and fallback
    for (const edge of product.variants.edges) {
      if (
        edge?.node?.title?.toLowerCase().includes('live') ||
        product.tags?.includes('format:Live Online')
      ) {
        try {
          return JSON.parse(edge.node.credits.value ? edge.node.credits.value : null);
        } catch (e) {
          log.error('Error parsing live registration credits: ', e);
          continue;
        }
      }

      if (
        edge?.node?.title?.toLowerCase().includes('ondemand') ||
        product.tags?.includes('format:OnDemand')
      ) {
        try {
          const onDemandCredits = edge?.node?.credits?.value
            ? JSON.parse(edge?.node?.credits?.value)
            : [];
          return onDemandCredits;
        } catch (error) {
          log.error('Error parsing on-demand credits: ', error);
        }
      } else if (edge?.metafields?.credits) {
        variantCredits = [
          ...variantCredits,
          ...(edge.metafields.credits || [])
        ];
      } else if (edge?.node?.title?.toLowerCase().includes('elearning')) {
        try {
          const eLearningCredits = edge?.node?.credits?.value
            ? JSON.parse(edge?.node?.credits?.value)
            : [];
          variantCredits = [...variantCredits, ...eLearningCredits];
        } catch (error) {
          log.error('Error parsing eLearning credits: ', error);
        }
      }
    }

    // Fourth Hierarchy: fallback to all flattened credits
    return variantCredits;
  }

  // Final fallback
  return [];
};

const useVariantCreditData = (product) => {
  const credits = useMemo(() => {
    return extractVariantCreditData(product);
  }, [product]);

  return credits;
};

export default useVariantCreditData;
export { extractVariantCreditData };

import { useRelatedProducts } from '@algolia/recommend-react';
import log from 'loglevel';
import { useEffect, useRef, useState } from 'react';
import HorizontalProductDisplayCourseCard from '@/components/HorizontalProductDisplayCourseCard';
import { mapProductIds, mapProductVariantIds } from '@/utils/mapProducts';
import { AlgoliaProductIndexName, recommendClient } from '@/utils/searchClient';

const HorizontalProductDisplayAlgolia = ({
  // eslint-disable-next-line react/prop-types
  variantId,
  // eslint-disable-next-line react/prop-types
  isAddToCart = false
}) => {
  const ref = useRef(null);
  const [data, setData] = useState({ title: 'You May Also Like' });
  const [algoliaRecommendations, setAlgoliaRecommendations] = useState(null);
  const { products = [], product = {} } = window.meta;
  let currentObjectIDs;

  if (!variantId) {
    if (products?.length) {
      currentObjectIDs = mapProductVariantIds(products);
    }
    if (product?.variants?.length) {
      currentObjectIDs = mapProductIds(product.variants);
    }
  } else {
    currentObjectIDs = [variantId];
  }

  const { recommendations } = useRelatedProducts({
    recommendClient,
    indexName: AlgoliaProductIndexName + '_courses',
    objectIDs: currentObjectIDs.slice(0, 1),
    maxRecommendations: 3,
    queryParameters: {
      distinct: true,
      analytics: true,
      clickAnalytics: true
    }
  });

  useEffect(() => {
    if (!variantId) {
      try {
        const scriptData = JSON.parse(
          ref.current.parentElement.querySelector(
            "script[type='application/json']"
          ).textContent ? ref.current.parentElement.querySelector(
            "script[type='application/json']"
          ).textContent : JSON.stringify({ title: 'You May Also Like' })
        );
        setData(scriptData);
      } catch (error) {
        log.error(
          `Could not properly parse config for "HorizontalProductDisplayAlgolia.jsx: `,
          error
        );
      }
    }
  }, []);

  useEffect(() => {
    if (recommendations.length > 0) {
      setAlgoliaRecommendations(
        [...recommendations].map((product) => {
          return {
            ...product,
            id: `gid://shopify/ProductVariant/${product.objectID}`
          };
        })
      );
    }
  }, [recommendations]);

  return (
    <div className="horizontal-product-display-grid-wrapper" ref={ref}>
      {algoliaRecommendations && (
        <>
          <div
            className={[
              'flex',
              'items-center',
              'lg-max:container-fluid',
              ...(isAddToCart ? ['mb-3'] : ['mb-5 lg:mb-7'])
            ].join(' ')}
          >
            <div className="flex-grow">
              {data?.title && (
                <h3
                  className={[
                    ...(isAddToCart
                      ? ['text-h4-mobile', 'lg:text-h4']
                      : ['text-h3', 'lg-max:!text-h3-mobile'])
                  ].join(' ')}
                >
                  {data?.title}
                </h3>
              )}
            </div>
          </div>
          <div className="horizontal-product-display-grid grid grid-cols-1 gap-5 rounded-[0.625rem] border border-solid border-grey p-5">
            {algoliaRecommendations &&
              algoliaRecommendations.map((product) => (
                <HorizontalProductDisplayCourseCard
                  key={product.objectID}
                  product={product}
                  is_algolia={true}
                />
              ))}
          </div>
        </>
      )}
    </div>
  );
};

export default HorizontalProductDisplayAlgolia;

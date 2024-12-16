import { useRelatedProducts } from '@algolia/recommend-react';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import HorizontalProductWrapper from '@/components/Carousels/HorizontalProductWrapper';
import { mapProductIds, mapProductVariantIds } from '@/utils/mapProducts';
import { AlgoliaProductIndexName, recommendClient } from '@/utils/searchClient';

const RelatedProductCarousel = ({ products, product }) => {
  const [data, setData] = useState(null);

  let currentObjectIDs;
  if (products?.length) {
    currentObjectIDs = mapProductVariantIds(products);
  }
  if (product?.variants?.length) {
    currentObjectIDs = mapProductIds(product.variants);
  }

  const { recommendations } = useRelatedProducts({
    recommendClient,
    indexName: AlgoliaProductIndexName + '_courses',
    objectIDs: currentObjectIDs.slice(0, 1),
    maxRecommendations: 10,
    queryParameters: {
      distinct: true,
      analytics: true,
      clickAnalytics: true
    }
  });

  const carouselRef = useRef(null);

  useEffect(() => {
    const data = JSON.parse(
      carouselRef.current.parentElement.querySelector(
        "script[type='application/json']"
      ).textContent ? carouselRef.current.parentElement.querySelector(
        "script[type='application/json']"
      ).textContent : null
    );

    setData(data);
  }, []);

  return (
    <HorizontalProductWrapper
      carouselRef={carouselRef}
      products={recommendations}
      useObjectId={true}
      data={data}
    />
  );
};

RelatedProductCarousel.propTypes = {
  products: PropTypes.array,
  product: PropTypes.object
};

export default RelatedProductCarousel;

import { useProduct } from '@shopify/hydrogen-react';
import PropTypes from 'prop-types';
import RatingStars from '@/components/RatingStars';

const ProductBannerReviews = ({ svgWidth }) => {
  const product = useProduct();
  const rating = product?.product?.metafields?.course?.rating?.value;
  if (!rating) return null;

  const parsedRating = JSON.parse(rating);

  return (
    <div className="flex items-center pb-5 lg:pb-0">
      <RatingStars
        rating={{ value: parsedRating, scale_max: 5.0 }}
        svgWidth={svgWidth}
      />
    </div>
  );
};

ProductBannerReviews.propTypes = {
  svgWidth: PropTypes.number
};

export default ProductBannerReviews;

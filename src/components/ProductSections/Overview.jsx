import { useProduct } from '@shopify/hydrogen-react';
import PropTypes from 'prop-types';
import ProductSeries from './ProductSeries';

const Overview = () => {
  const { product } = useProduct();
  const { metafields, descriptionHtml: description } = product;

  return (
    <div className="mb-10 mt-12">
      <h2 className="mb-2.5 text-h2-mobile lg:text-h2">Overview</h2>
      {metafields?.overview?.title && (
        <h3 className="mb-10 text-h3-mobile text-grey-dark lg:text-h3">
          {metafields.overview.title}
        </h3>
      )}
      {description && (
        <div
          className="product--overview mb-10"
          dangerouslySetInnerHTML={{ __html: description }}
        />
      )}
      {metafields?.course && 'abbreviated-agenda' in metafields.course && (
        <div className="product--overview">
          <div
            dangerouslySetInnerHTML={{
              __html: metafields.course['abbreviated-agenda']
            }}
          />
        </div>
      )}
      {metafields?.bundle && 'courses' in metafields.bundle && (
        <ProductSeries />
      )}
    </div>
  );
};

Overview.propTypes = {
  description: PropTypes.any,
  metafields: PropTypes.any
};

export default Overview;

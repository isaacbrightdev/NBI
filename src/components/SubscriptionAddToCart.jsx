import { ProductProvider } from '@shopify/hydrogen-react';
import PropTypes from 'prop-types';
import Link from '@/components/Link';
import SvgIcon from '@/components/SvgIcon';

const SubscriptionAddToCart = ({
  productData,
  subscriptionType,
  setSubscriptionInCart
}) => {
  const cta = subscriptionType === 'monthly' ? productData.cta : (productData.cta2 ? productData.cta2 : productData.cta);
  const productHandle = productData[subscriptionType].product.handle;

  const cartLink = `/cart?handle=${productHandle}`;

  function addToCart() {
    setSubscriptionInCart(productData[subscriptionType], subscriptionType);
  }

  return (
    <ProductProvider data={productData[subscriptionType].product}>
      <Link
        className="btn btn--accent mx-auto mt-4 flex w-fit items-center gap-2"
        to={cartLink}
        onClick={addToCart}
      >
        {cta}
        <SvgIcon
          className="icon-arrow hidden rotate-180 md:block"
          width={13}
          name="arrow"
        />
      </Link>
    </ProductProvider>
  );
};

SubscriptionAddToCart.propTypes = {
  productData: PropTypes.shape({
    monthly: PropTypes.shape({
      product: PropTypes.object,
      details: PropTypes.shape({
        firstVariantID: PropTypes.string,
        sellingPlanID: PropTypes.string
      }),
      cta: PropTypes.string
    }),
    annual: PropTypes.shape({
      product: PropTypes.object,
      details: PropTypes.shape({
        firstVariantID: PropTypes.string,
        sellingPlanID: PropTypes.string
      }),
      cta: PropTypes.string
    }),
    cta: PropTypes.string
  }),
  subscriptionType: PropTypes.oneOf(['monthly', 'annual']),
  setSubscriptionInCart: PropTypes.func
};

export default SubscriptionAddToCart;

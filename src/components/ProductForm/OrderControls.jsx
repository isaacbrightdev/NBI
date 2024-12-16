import { Money } from '@shopify/hydrogen-react';
import { useProduct } from '@shopify/hydrogen-react';
import PropTypes from 'prop-types';
import { useMemo } from 'react';
import aa from 'search-insights';
import SvgIcon from '@/components/SvgIcon';
import { AlgoliaProductIndexName } from '@/utils/searchClient';
import useCustomer from '@/hooks/useCustomer';
import useBrowserName from '@/hooks/useBrowserName';
import useOS from '@/hooks/useOS';
import { IS_IPE } from '@/utils/constants';
import useLocale from '@/hooks/useLocale';

const OrderControls = ({
  handleSubmit,
  setQuantity,
  quantity,
  addToCartButtonText,
  variantPrice,
  coveredBySub,
  multiRegDiscountAmount
}) => {
  const decrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increase = () => {
    if (quantity < 20) {
      setQuantity(quantity + 1);
    }
  };

  const { product, selectedVariant } = useProduct();

  const productId = product.id.replace('gid://shopify/Product/', '');

  const variantIds = product.variants.edges.map((edge) =>
    edge.node.id.replace('gid://shopify/ProductVariant/', '')
  );

  let objectIDs = [
    variantPrice.objectID,
    ...(productId ? [productId] : []),
    ...(variantIds.length > 0 ? variantIds : [])
  ];

  // Filter out any falsy values (including undefined, null, and empty strings)
  objectIDs = objectIDs.filter(Boolean);

  const showPrice = useMemo(() => {
    var price = { ...variantPrice };

    if (quantity >= 2 && multiRegDiscountAmount && price.amount != '0') {
      price.amount = parseFloat(price.amount);
      price.amount -= quantity * multiRegDiscountAmount;
      price.amount = price.amount.toString();
    }

    return price;
  }, [variantPrice, multiRegDiscountAmount, quantity]);

  const customer = useCustomer();
  const browser = useBrowserName();
  const os = useOS();
  const customerLocale = useLocale();

  const handleSubmitWithTracking = (event) => {
    handleSubmit(event);

    let queryID = localStorage.getItem('Algolia_QueryID');
    const storeDomain = import.meta.env.VITE_PUBLIC_STORE_DOMAIN;
    const brandVendor = IS_IPE ? 'IPE' : 'NBI';
    const URL = window.location.href;
    const parts = URL.split('/');
    const handle = parts[parts.length - 1];
    const checkoutURL = storeDomain+ '/cart?handle=' + handle;

    const item = {
      authenticatedUserToken: customer?.id || undefined,
      id: selectedVariant.sku,
      eventName: 'Item Added to Cart After Search',
      index: AlgoliaProductIndexName,
      objectIDs: objectIDs,
      queryID: queryID,
      title: product.title,
      name: selectedVariant.title,
      price: `$${parseFloat(selectedVariant.price.amount).toFixed(2)}`,
      $value: parseFloat(selectedVariant.price.amount).toFixed(2),
      productType: selectedVariant.title,
      category: selectedVariant.product_type,
      sku: selectedVariant.sku,
      checkout_url: checkoutURL,
      variant: selectedVariant.title,
      handle: handle,
      brand: brandVendor,
      vendor: brandVendor,
      productId: product.id.split('/').pop(),
      productGID: product.id,
      variant_id: selectedVariant.id.split('/').pop(),
      variant_GID: selectedVariant.id,
      URL: URL,
      ImageURL: product.featuredImage,
      tags: product.tags,
      CustomerLocale: customerLocale,
      Collections: product.collections.edges.map(edge => edge.node.title),
      $currency: 'USD',
      quantity: 1,
      browser: browser,
      os: os,
      page: storeDomain,
    };

    aa('addedToCartObjectIDs', item);
    if (window.klaviyo) {
      window.klaviyo.push(["track", "Added to Cart", item]);
    }
  };


  return (
    <div className={`${!multiRegDiscountAmount ? ' pb-4' : ''} flex items-center justify-between`}>
      {!coveredBySub && (
        <div className="flex rounded-full border border-white px-2 text-white">
          <button
            className="flex w-[25px] items-center justify-center"
            type="button"
            onClick={decrease}
          >
            <SvgIcon name="minus" width={14} />
          </button>
          <p className="w-[25px] p-2 text-center">{quantity}</p>
          <button
            className="flex w-[25px] items-center justify-center"
            type="button"
            onClick={increase}
          >
            <SvgIcon name="plus" width={14} />
          </button>
        </div>
      )}

      {coveredBySub && (
        <div className="flex w-1/4 rounded-full px-2 text-white"></div>
      )}

      <button
        data-cy="product-form-submit"
        className="btn btn--accent ml-4 w-full px-2"
        onClick={handleSubmitWithTracking}
      >
        {addToCartButtonText} | <Money data={showPrice} as="span" />
      </button>
    </div>
  );
};

OrderControls.propTypes = {
  handleSubmit: PropTypes.func,
  setQuantity: PropTypes.func,
  quantity: PropTypes.number,
  variantPrice: PropTypes.object,
  addToCartButtonText: PropTypes.any,
  coveredBySub: PropTypes.bool,
  multiRegDiscountAmount: PropTypes.number
};

export default OrderControls;

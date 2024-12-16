import FallbackImage from '@/components/Image';
import Link from '@/components/Link';
import Price from '@/components/ProductPrice';
import SubWarning from '@/components/SubWarning';
import SvgIcon from '@/components/SvgIcon';
import useBrowserName from '@/hooks/useBrowserName';
import useCustomer from '@/hooks/useCustomer';
import useLineDiscounts from '@/hooks/useLineDiscounts';
import useLocale from '@/hooks/useLocale';
import useOS from '@/hooks/useOS';
import useProductLineItem from '@/hooks/useProductLineItem';
import { IS_IPE } from '@/utils/constants';
import { AlgoliaProductIndexName } from '@/utils/searchClient';
import {
  CartLineQuantity,
  CartLineQuantityAdjustButton,
  Image,
  useCartLine
} from '@shopify/hydrogen-react';
import PropTypes from 'prop-types';
import { useMemo } from 'react';
import useLocalStorage from 'use-local-storage';

const LineItem = ({ hasMultipleUniqueSubs }) => {
  const line = useCartLine();
  const [savedStates] = useLocalStorage('jurisdictionKeys', []);
  const selectedJurisdiction = useMemo(() => {
    const credits = line.merchandise.credits?.value
      ? JSON.parse(line.merchandise.credits.value)
      : null;
    return savedStates && credits
      ? credits.find((item) => savedStates.indexOf(item['credit-title']) > -1)
      : false;
  }, [savedStates]);

  const discounts = useLineDiscounts();

  const product = line.merchandise.product;
  const productLineItem = useProductLineItem(product.handle);

  const includedFormats = productLineItem?.included_formats?.value
    ? JSON.parse(productLineItem.included_formats.value)
    : null;

  const getDeliveryText = (productLineItem, line, includedFormats) => {
    let deliveryText = productLineItem?.tags
      ?.find((tag) => tag.startsWith('delivery-text:encoded:'))
      ?.substring('delivery-text:encoded:'.length) ||
      line.merchandise.product?.productType;

      if (includedFormats) {
        if (includedFormats.some(format => format.toLowerCase().includes('live in-person'))) {
          deliveryText = deliveryText.replace(/\+/g, ' ');
        }
      }
    return decodeURIComponent(deliveryText);
  };
  const deliveryText = getDeliveryText(productLineItem, line, includedFormats)

  const customer = useCustomer();
  let queryID = localStorage.getItem('Algolia_QueryID');
  const browser = useBrowserName();
  const os = useOS();
  const storeDomain = import.meta.env.VITE_PUBLIC_STORE_DOMAIN;
  const brandVendor = IS_IPE ? 'IPE' : 'NBI';
  const customerLocale = useLocale();
  const price = `$${parseFloat(line.cost.amountPerQuantity.amount).toFixed(2)}`;
  const value = parseFloat(line.cost.amountPerQuantity.amount).toFixed(2);
  const product_ID = product.id.split('/').pop();
  const variant_id = line.merchandise.id.split('/').pop();

  function addToCart() {
    const item = {
      authenticatedUserToken: customer?.id || undefined,
      id: line.merchandise.sku,
      eventName: 'Item Added to Cart LineItem',
      index: AlgoliaProductIndexName,
      queryID: queryID,
      title: product.title,
      name: product.title,
      price: price,
      value: value,
      productType: product.productType,
      category: product.productType,
      sku: line.merchandise.sku,
      variant: line.merchandise.title,
      handle: product.handle,
      brand: brandVendor,
      vendor: brandVendor,
      productId: product_ID,
      productGID: product.id,
      variant_id: variant_id,
      variant_GID: line.merchandise.id,
      URL: window.location.href,
      ImageURL: line.merchandise?.image?.url,
      CustomerLocale: customerLocale,
      $currency: 'USD',
      quantity: 1,
      browser: browser,
      os: os,
      page: storeDomain
    };

    window.dataLayer.push({
      event: 'add_to_cart',
      ecommerce: {
        currencyCode: line.cost.amountPerQuantity.currencyCode,
        products: [item]
      }
    });

    if (window.klaviyo) {
      window.klaviyo.push(['track', 'Added to Cart', item]);
    }
  }

  function removeFromCart() {
    const item = {
      authenticatedUserToken: customer?.id || undefined,
      id: line.merchandise.sku,
      eventName: 'Item Removed from Cart LineItem',
      index: AlgoliaProductIndexName,
      queryID: queryID,
      title: product.title,
      name: product.title,
      price: price,
      value: value,
      productType: product.productType,
      category: product.productType,
      sku: line.merchandise.sku,
      variant: line.merchandise.title,
      handle: product.handle,
      brand: brandVendor,
      vendor: brandVendor,
      productId: product_ID,
      productGID: product.id,
      variant_id: variant_id,
      variant_GID: line.merchandise.id,
      URL: window.location.href,
      ImageURL: line.merchandise?.image?.url,
      CustomerLocale: customerLocale,
      $currency: 'USD',
      quantity: 1,
      browser: browser,
      os: os,
      page: storeDomain
    };

    window.dataLayer.push({
      event: 'remove_from_cart',
      ecommerce: {
        currencyCode: line.cost.amountPerQuantity.currencyCode,
        products: [item]
      }
    });

    if (window.klaviyo) {
      window.klaviyo.push(['track', 'Remove from Cart', item]);
    }
  }

  const calculatedLineTotal = useMemo(() => {
    if (!line) return 'loading...';
    const result = (
      parseFloat(line.cost.amountPerQuantity.amount) * line.quantity
    ).toFixed(2);
    return {
      ...line.cost.totalAmount,
      amount: result
    };
  }, [line]);

  let productLink = `/products/${line.merchandise.product.handle}`;

  if (line.merchandise.product.productType.toLowerCase() === 'subscription') {
    productLink = `/pages/subscribe-save`;
  }

  return (
    <div className="line mb-6 block rounded-lg border border-grey p-5">
      <div className="flex flex-wrap items-center justify-between gap-4 lg:flex-nowrap lg:justify-normal lg:gap-5">
        <Link className="order-1" to={productLink}>
          {line.merchandise.image ? (
            <Image
              data={line.merchandise.image}
              width={180}
              height={130}
              className="rounded-lg"
            />
          ) : (
            <FallbackImage className="h-[130px] w-[180px] rounded-lg" />
          )}
        </Link>
        <div className="order-3 lg:order-2 lg:flex-1">
          <h4 className="mb-2.5">
            <Link to={productLink}>{line.merchandise.product.title}</Link>
          </h4>

          <p className="mb-4 text-callout">
            <strong>Includes:</strong>{' '}
            {includedFormats?.join(', ') || line.merchandise.title}
          </p>
          <div className="flex gap-6">
            {selectedJurisdiction ? (
              <span className="my-4 flex items-center gap-2">
                <SvgIcon
                  width={18}
                  height={18}
                  className="icon-credits"
                  name="credits"
                />
                <span className="text-fine-print">
                  {selectedJurisdiction && selectedJurisdiction['credit-total']}{' '}
                  {selectedJurisdiction && selectedJurisdiction['credit-state']}{' '}
                  {selectedJurisdiction && selectedJurisdiction['short-desc']}
                </span>
              </span>
            ) : null}
            <span className="flex items-center gap-2 text-fine-print">
              {deliveryText && (
                <>
                  <SvgIcon
                    height={15}
                    width={15}
                    className="icon-platform"
                    name="platform"
                  />
                  {deliveryText}
                </>
              )}
            </span>
          </div>
        </div>
        <div className="order-2 lg:order-3">
          <div className="flex items-center rounded-full border border-grey">
            <CartLineQuantityAdjustButton
              onClick={removeFromCart}
              adjust="decrease"
              className="p-3.5"
            >
              <SvgIcon
                width={15}
                height={15}
                className="icon-minus"
                name="minus"
              />
            </CartLineQuantityAdjustButton>
            <CartLineQuantity />
            <CartLineQuantityAdjustButton
              onClick={addToCart}
              adjust="increase"
              className="p-3.5"
            >
              <SvgIcon
                width={15}
                height={15}
                className="icon-plus"
                name="plus"
              />
            </CartLineQuantityAdjustButton>
          </div>
          <div className="mt-2 lg:hidden">
            <Price
              activeSub={discounts.activeSub}
              price={calculatedLineTotal}
            />
          </div>
        </div>
        <div className="order-4 hidden lg:block">
          <Price
            activeSub={discounts.activeSub}
            price={calculatedLineTotal}
            savings={discounts.savings}
          />
        </div>
      </div>
      {hasMultipleUniqueSubs && line.sellingPlanAllocation && <SubWarning />}
    </div>
  );
};

LineItem.propTypes = {
  hasMultipleUniqueSubs: PropTypes.bool
};

export default LineItem;

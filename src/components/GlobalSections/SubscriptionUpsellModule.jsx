import { composeGid } from '@shopify/admin-graphql-api-utilities';
import {
  ProductProvider,
  AddToCartButton,
  useCart
} from '@shopify/hydrogen-react';
import log from 'loglevel';
import PropType from 'prop-types';
import { useEffect, useState } from 'react';
import useCustomer from '@/hooks/useCustomer';
import {
  SUBSCRIPTION_SKU_SUFFIXES,
  CUSTOMER_SUBSCRIPTION_STATES
} from '@/utils/constants';

const { ALL_INCLUSIVE_SUBSCRIBER, ONDEMAND_SUBSCRIBER } =
  CUSTOMER_SUBSCRIPTION_STATES;

const SubscriptionUpsellModule = ({ setShowModule }) => {
  const customer = useCustomer();
  const { lines, status, error } = useCart();
  const [displayModule, setDisplayModule] = useState(true);
  const [ctaLabel, setCtaLabel] = useState(
    window.UpSellModuleSettings?.cta?.default
  );
  const [title, setTitle] = useState(
    window.UpSellModuleSettings?.title?.default
  );
  const [displayPrice, setDisplayPrice] = useState(
    window.UpSellModuleSettings?.product?.price
  );
  const [displayText, setDisplayText] = useState(
    window.UpSellModuleSettings?.text
  );
  const currency = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    trailingZeroDisplay: 'stripIfInteger'
  });
  const [cartSubmitted, setCartSubmitted] = useState(false);
  useEffect(() => {
    if (setShowModule) {
      setShowModule(displayModule);
    }
  }, [displayModule]);

  useEffect(() => {
    if (cartSubmitted && status === 'idle' && !error) {
      window.location.href = '/cart';
    }

    try {
      let hasOnDemand = false;
      let hasLive = false;
      let hasAll = false;
      for (const line of lines) {
        if (
          line?.merchandise?.product?.productType.toLowerCase() ===
          'subscription'
        ) {
          // TODO: Remove handle checks for subType
          let subType = line.merchandise.product.handle.replaceAll('-', '');
          const subSku = line.merchandise.sku;
          if (
            (subType.indexOf('ondemand') > -1 ||
              subSku.includes(SUBSCRIPTION_SKU_SUFFIXES.ONDEMAND_ANY)) &&
            !hasAll
          ) {
            hasOnDemand = true;
          }
          if (
            subType.indexOf('all') > -1 ||
            subSku.includes(SUBSCRIPTION_SKU_SUFFIXES.ALL_INCLUSIVE_ANY)
          ) {
            hasAll = true;
            if (hasOnDemand) hasOnDemand = false;
            break;
          }
        }
      }

      if (hasOnDemand || hasLive) {
        setCtaLabel(window.UpSellModuleSettings.cta.upgrade);
        setTitle(window.UpSellModuleSettings.title.upgrade);
      }

      if (hasAll) {
        setDisplayModule(false);
      }
      if (customer?.has_account) {
        if (
          customer.metafields?.subscriptions?.details['sub-type'] !== 'none'
        ) {
          const customerSubType =
            customer.metafields?.subscriptions?.details['sub-type'] ?? '';

          if (customerSubType.toLowerCase() === ONDEMAND_SUBSCRIBER) {
            hasOnDemand = true;
          }

          if (customerSubType.toLowerCase() === ALL_INCLUSIVE_SUBSCRIBER) {
            setDisplayModule(false);
          }

          if (hasOnDemand || hasLive) {
            setCtaLabel(window.UpSellModuleSettings.cta.upgrade);
          }

          if (hasLive) {
            setTitle(window.UpSellModuleSettings.title.upgradeLive);
          }

          if (hasOnDemand) {
            setTitle(window.UpSellModuleSettings.title.upgrade);
          }
        }

        if (customer.metafields?.recentOrderAmount?.details) {
          const origPrice = Math.abs(
            window.UpSellModuleSettings.product.json.price / 100
          );
          const discountObj =
            customer.metafields.recentOrderAmount?.details.find(
              (item) => item['sub-type'] === 'all'
            );

          if (discountObj) {
            const expirationDate = new Date(
              discountObj.expiration.replace(/-/g, '/')
            );
            const todaysDate = new Date();
            const discountAmount =
              window.UpSellModuleSettings?.type === 'month'
                ? discountObj.amount / 12
                : discountObj.amount;

            if (todaysDate <= expirationDate) {
              if (Math.floor(origPrice - discountAmount) >= 0) {
                setDisplayPrice(
                  currency.format(Math.floor(origPrice - discountAmount))
                );
                setTitle(
                  window.UpSellModuleSettings?.title?.upsell.replace(
                    '[$XX]',
                    displayPrice
                  )
                );
              }
              if (Math.floor(origPrice - discountAmount) <= 0) {
                setDisplayPrice(currency.format(0));
                setTitle(
                  window.UpSellModuleSettings?.title?.upsell.replace(
                    '[$XX]',
                    currency.format(origPrice)
                  )
                );
              }

              setCtaLabel(window.UpSellModuleSettings?.cta?.discount);
              setDisplayText(
                'Offer vaid until ' +
                  expirationDate.toLocaleString('en-US', {
                    month: '2-digit',
                    day: '2-digit',
                    year: '2-digit'
                  })
              );
            }
          }
        }
      }
    } catch (error) {
      log.error(error);
    }
  }, [customer, lines, cartSubmitted, status, error]);

  const addToCartSubmit = () => {
    setCartSubmitted(true);
  };

  return window.UpSellModuleSettings && displayModule ? (
    <div
      className={`upsell-module ${window.UpSellModuleSettings.background?.imageSize} ${window.UpSellModuleSettings.background?.imagePosition}`}
      style={{
        backgroundImage: `url(${window.UpSellModuleSettings.background?.image})`,
        backgroundColor: window.UpSellModuleSettings.background?.color
      }}
    >
      <div>
        <h3
          className="upsell-module--title"
          dangerouslySetInnerHTML={{
            __html: title
          }}
        />
        <h4 className="my-3.5">
          {displayPrice}
          <span className="text-grey">
            /{window.UpSellModuleSettings?.type}
          </span>
        </h4>
        <div
          className="hidden text-callout font-normal text-grey md:block"
          dangerouslySetInnerHTML={{ __html: displayText }}
        />
      </div>
      <div>
        <ProductProvider data={window.UpSellModuleSettings.product.json}>
          <AddToCartButton
            className="btn mx-auto mt-4 flex w-fit items-center gap-2 whitespace-nowrap border-white text-white"
            variantId={composeGid(
              'ProductVariant',
              window.UpSellModuleSettings.product.variantID
            )}
            sellingPlanId={composeGid(
              'SellingPlan',
              window.UpSellModuleSettings.product.sellingPlanID
            )}
            quantity={1}
            onClick={addToCartSubmit}
          >
            {ctaLabel}
          </AddToCartButton>
          <div
            className="mt-[15px] text-center text-callout font-normal text-white md:hidden"
            dangerouslySetInnerHTML={{ __html: displayText }}
          />
        </ProductProvider>
      </div>
    </div>
  ) : null;
};

SubscriptionUpsellModule.propTypes = {
  setShowModule: PropType.func
};

export default SubscriptionUpsellModule;

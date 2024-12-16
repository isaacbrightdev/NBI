import Link from '@/components/Link';
import SvgIcon from '@/components/SvgIcon';
import useCustomer from '@/hooks/useCustomer';
import useProductState from '@/hooks/useProductState';
import useScrollPosition from '@/hooks/useScrollPosition';
import useSettings from '@/hooks/useSettings';
import {
  IS_IPE,
  ONDEMAND_AUDIO_FORMAT_CODES,
  ONDEMAND_VIDEO_FORMAT_CODES,
  PRODUCT_FORM_SUBSCRIPTION_STATES
} from '@/utils/constants';
import {
  parseMetafield,
  RichText,
  useCart,
  useProduct
} from '@shopify/hydrogen-react';
import log from 'loglevel';
import PropTypes from 'prop-types';
import { useMemo, useRef, useState } from 'react';
import AccessBlock from './AccessBlock';
import OrderControls from './OrderControls';
import ProductOptions from './ProductOptions';

const {
  ALL_INCLUSIVE_IN_CART,
  ALL_INCLUSIVE_SUBSCRIBER,
  NO_ALL_INCLUSIVE,
  NO_SUBCRIPTION_PRESENT,
  ONDEMAND_SUBSCRIBER,
  ONDEMAND_IN_CART
} = PRODUCT_FORM_SUBSCRIPTION_STATES;

function isCoveredByOnDemandSub(
  variantBarcode,
  isTrainingPath,
  isLiveTrainingPath
) {
  if (isTrainingPath) return !isLiveTrainingPath;

  return [
    ...ONDEMAND_VIDEO_FORMAT_CODES,
    ...ONDEMAND_AUDIO_FORMAT_CODES
  ].includes(variantBarcode);
}

const SubUpsell = ({ form, showAccess, productID, upsellProductHandle }) => (
  <div
    className={`bg-primary px-6 py-3 text-center lg:rounded-b-xl ${
      showAccess ? `border-t border-grey` : ``
    }`}
  >
    {!showAccess && (
      <div className="mb-5 flex items-center justify-between">
        <hr className="block w-full border-secondary" />
        <span className="inline-block px-4 text-fine-print text-white">or</span>
        <hr className="block w-full border-secondary" />
      </div>
    )}

    {form.sub_upsell_wording && (
      <h4 className="mb-2 inline-block px-4 text-white">
        {form.sub_upsell_wording} for{' '}
        <span className="italic text-accent">Free</span>
      </h4>
    )}

    {form.sub_upsell_price && (
      <h4 className="mb-2 text-center text-white">
        {form.sub_upsell_price.split('/')[0]}
        <span className="font-light">
          /{form.sub_upsell_price.split('/')[1]}
        </span>
      </h4>
    )}

    <Link
      to={`/cart?handles[]=${productID}&handles[]=${upsellProductHandle}`}
      className="btn block w-full border-white text-white"
    >
      {form.sub_upsell_cta_text || 'Get All Inclusive'}
    </Link>

    {form.sub_upsell_fine_print && (
      <p className="mt-2 whitespace-pre-line text-center text-fine-print text-grey">
        {form.sub_upsell_fine_print}
      </p>
    )}
  </div>
);

SubUpsell.propTypes = {
  form: PropTypes.any,
  showAccess: PropTypes.bool,
  productID: PropTypes.string,
  upsellProductHandle: PropTypes.string
};

const ProductForm = ({ form }) => {
  const customer = useCustomer();
  const { linesAdd } = useCart();
  const { selectedVariant, product } = useProduct();
  const {
    isElearning,
    isTrainingPath,
    isLiveTrainingPath,
    previouslyPurchased,
    subType,
    activeSub,
    cartSubType
  } = useProductState(product);
  const { dispatch, hasInvalidJurisdictions } = useSettings();
  const [quantity, setQuantity] = useState(1);
  const [formLocked, setFormLocked] = useState(false);
  const formEl = useRef();
  const { scrollPosition } = useScrollPosition();
  const formBreak = document.querySelector('[data-product-form-break]');
  const productNav = document.querySelector('#product-nav');
  const [registerBlockExpanded, setRegisterBlockExpanded] = useState(false);

  const addToCartButtonText = useMemo(() => {
    const result = form.add_to_cart_cta_text ?? 'Order';
    return result;
  }, [selectedVariant]);

  const multiRegDiscountAmount = useMemo(() => {
    try {
      if (!selectedVariant?.discount) return null;

      const { parsedValue } = parseMetafield(selectedVariant.discount);

      if (parsedValue?.multiRegistration > 0) {
        return parsedValue.multiRegistration;
      }
    } catch (error) {
      log.error('Error computing multi reg discount: ProductForm/index.jsx');
      log.error(error);
      return null;
    }
  }, [selectedVariant]);

  const positionTop = useMemo(() => {
    try {
      const navHeight = productNav.getBoundingClientRect().bottom;

      // Lock the form once the bottom of the page is reached
      if (formBreak && formEl.current) {
        const breakTop = formBreak.getBoundingClientRect().top;
        if (breakTop < window.innerHeight) {
          setFormLocked(true);
          return breakTop - formEl.current.getBoundingClientRect().height;
        }
      }

      setFormLocked(false);

      if (window.innerHeight > 1200) {
        return scrollPosition > navHeight ? 174 : navHeight;
      }

      return scrollPosition > navHeight ? navHeight + 24 : 316;
    } catch (error) {
      log.error('Error calculating Register Block scroll height: ProductForm');
      log.error(error);
    }
  }, [formEl, scrollPosition]);

  const toggleRegisterBlockExpanded = () => {
    setRegisterBlockExpanded(!registerBlockExpanded);
  };

  const productID = useMemo(() => {
    if (selectedVariant.sku.toLowerCase().startsWith('series'))
      return selectedVariant.sku.toLowerCase();

    return selectedVariant.sku.match(/^\d*/)[0];
  }, [selectedVariant]);

  const subCoversVariant = useMemo(() => {
    if (!selectedVariant.title) return false;
    const isValidOnDemand = isCoveredByOnDemandSub(
      selectedVariant.barcode,
      isTrainingPath,
      isLiveTrainingPath
    );

    if (
      subType === ALL_INCLUSIVE_SUBSCRIBER ||
      cartSubType === ALL_INCLUSIVE_IN_CART
    ) {
      return true;
    } else if (isValidOnDemand) {
      return (
        (subType !== NO_ALL_INCLUSIVE && subType !== NO_SUBCRIPTION_PRESENT) ||
        cartSubType == ONDEMAND_IN_CART
      );
    } else {
      return false;
    }
  }, [
    selectedVariant,
    form,
    subType,
    isTrainingPath,
    isLiveTrainingPath,
    cartSubType
  ]);

  const numberOfCourses = useMemo(() => {
    return product.metafields?.bundle?.courses
      ? JSON.parse(
          product.metafields?.bundle?.courses
            ? product.metafields?.bundle?.courses
            : '[]'
        )?.length
      : null;
  }, [product]);

  const showAccess = useMemo(() => {
    try {
      if (customer && previouslyPurchased) {
        return true;
      }

      if (customer && activeSub && subType === ALL_INCLUSIVE_SUBSCRIBER) {
        return true;
      }

      return (
        customer &&
        activeSub &&
        subType === ONDEMAND_SUBSCRIBER &&
        !isLiveTrainingPath &&
        !isElearning
      );
    } catch (error) {
      log.error(error);
      return false;
    }
  }, [
    customer,
    previouslyPurchased,
    activeSub,
    subType,
    isLiveTrainingPath,
    isElearning
  ]);

  const variantPrice = useMemo(() => {
    const perUnitPrice = parseFloat(selectedVariant.price.amount);
    let currentPrice = perUnitPrice * quantity;

    // If theres an access block, it means the price should be full to purchase for another
    if (subCoversVariant && !showAccess) currentPrice -= perUnitPrice;

    return {
      currencyCode: selectedVariant?.price?.currencyCode ?? 'USD',
      amount: currentPrice.toFixed(2)
    };
  }, [selectedVariant, subCoversVariant, quantity, showAccess]);

  const handleSubmit = () => {
    try {
      const updates = [
        {
          merchandiseId: selectedVariant.id,
          quantity
        }
      ];

      linesAdd(updates);

      dispatch({
        type: 'SET_MODAL',
        data: {
          name: 'addToCart',
          state: true,
          product: { ...selectedVariant, productTitle: product.title }
        }
      });
    } catch (error) {
      log.error('ProductForm handleSubmit', error);
    }
  };

  return (
    selectedVariant && (
      <div
        ref={formEl}
        data-cy="product-form"
        style={{ top: positionTop === 'auto' ? 'auto' : `${positionTop}px` }}
        className={[
          'product-form',
          'container-fluid',
          'pointer-events-none',
          'lg:fixed',
          ...(formLocked ? [] : ['z-10', 'transition-[top]', 'ease-in-out'])
        ].join(' ')}
      >
        <div className="row">
          <div className="pointer-events-auto bg-primary lg:col-3 lg:offset-8 2xl:col-2 lg:min-w-[420px] lg:bg-transparent">
            {/* ACCESS BLOCK */}
            {showAccess && <AccessBlock />}

            {/* REGISTER BLOCK WITH ACCESS BLOCK FUNCTIONALITY */}
            {/* NOT EXPANDED */}
            {showAccess && !registerBlockExpanded && (
              <div
                className={`border-t border-solid border-gray-400 bg-primary p-6 ${
                  form.show_upsell == 'true' ? '' : 'lg:rounded-b-xl'
                }`}
              >
                <div className="flex">
                  <div className="">
                    <h3 className="mb-2 text-white">{form.header}</h3>
                    <p className="mb-2 text-grey">
                      {form.collapsed_subtext || 'Click to buy for your team'}{' '}
                      <a
                        className="bold cursor-pointer text-white underline"
                        onClick={toggleRegisterBlockExpanded}
                      >
                        {form.collapsed_expansion_text || 'Learn More'}
                      </a>
                    </p>
                  </div>
                  <div
                    className="flex flex-grow cursor-pointer items-center justify-end"
                    onClick={toggleRegisterBlockExpanded}
                  >
                    <SvgIcon
                      name="caret-down"
                      color="white"
                      width={24}
                      height={24}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* EXPANDED */}
            {showAccess && registerBlockExpanded && (
              <div
                className={`border-t border-solid border-gray-400 bg-primary p-6 ${
                  form.show_upsell == 'true' ? '' : 'lg:rounded-b-xl'
                }`}
              >
                <div className="flex">
                  <div>
                    <h3 className="mb-2 text-white">{form.header}</h3>
                    <p className="mb-2 text-grey">
                      {form.collapsed_subtext || 'Click to buy for your team'}{' '}
                      <a
                        className="bold cursor-pointer text-white underline"
                        onClick={toggleRegisterBlockExpanded}
                      >
                        {form.collapsed_expansion_text || 'Learn More'}
                      </a>
                    </p>
                  </div>
                  <div
                    className="flex flex-grow cursor-pointer items-center justify-end"
                    onClick={toggleRegisterBlockExpanded}
                  >
                    <SvgIcon
                      name="caret-up"
                      color="white"
                      width={24}
                      height={24}
                    />
                  </div>
                </div>
                <div className="my-4">
                  <ProductOptions
                    form={form}
                    mainVariant={selectedVariant}
                    showStateWarning={hasInvalidJurisdictions}
                    numberOfCourses={numberOfCourses}
                    gradientBackground={showAccess}
                    coveredBySub={false}
                    multiRegDiscountAmount={multiRegDiscountAmount}
                    quantity={quantity}
                  />
                </div>
                <OrderControls
                  handleSubmit={handleSubmit}
                  setQuantity={setQuantity}
                  quantity={quantity}
                  addToCartButtonText={addToCartButtonText}
                  variantPrice={variantPrice}
                  multiRegDiscountAmount={multiRegDiscountAmount}
                />
                {multiRegDiscountAmount && (
                  <div className="row mt-2 p-3 text-center text-sm-body text-white">
                    <p>
                      <span className="text-base italic text-accent">
                        Save ${multiRegDiscountAmount}
                      </span>{' '}
                      when you buy 2 or more seats!
                    </p>
                  </div>
                )}
                {form.disclaimer_section && (
                  <RichText
                    data={form.disclaimer_section}
                    className="text-center text-sm-body text-white"
                  />
                )}
              </div>
            )}

            {/* REGISTER BLOCK WITHOUT ACCESS BLOCK */}
            {!showAccess && (
              <div
                className={`bg-primary px-6 pt-6 ${
                  form.show_upsell == 'true'
                    ? 'lg:rounded-t-xl'
                    : 'lg:rounded-xl'
                }`}
              >
                <div className="text-center">
                  <h3 className="mb-2 text-white">{form.header}</h3>
                </div>

                {subCoversVariant && (
                  <div className="text-center italic text-accent">
                    <p>
                      Included with the{' '}
                      {cartSubType == ALL_INCLUSIVE_IN_CART
                        ? 'All Inclusive'
                        : 'OnDemand'}{' '}
                      CLE Pass
                    </p>
                  </div>
                )}

                <div className="my-4">
                  <ProductOptions
                    form={form}
                    mainVariant={selectedVariant}
                    showStateWarning={hasInvalidJurisdictions}
                    numberOfCourses={numberOfCourses}
                    gradientBackground={showAccess}
                    coveredBySub={subCoversVariant}
                    multiRegDiscountAmount={multiRegDiscountAmount}
                    quantity={quantity}
                  />
                </div>
                <OrderControls
                  handleSubmit={handleSubmit}
                  setQuantity={setQuantity}
                  quantity={quantity}
                  addToCartButtonText={addToCartButtonText}
                  variantPrice={variantPrice}
                  coveredBySub={subCoversVariant}
                  multiRegDiscountAmount={multiRegDiscountAmount}
                />
                {multiRegDiscountAmount && (
                  <div className="row mt-2 p-3 text-center text-sm-body text-white">
                    <p>
                      <span className="text-base italic text-accent">
                        Save ${multiRegDiscountAmount}
                      </span>{' '}
                      when you buy 2 or more seats!
                    </p>
                  </div>
                )}
                {form.disclaimer_section && (
                  <RichText
                    data={form.disclaimer_section}
                    className="text-center text-sm-body text-white"
                  />
                )}
              </div>
            )}

            {form.show_upsell == 'true' && (
              <SubUpsell
                form={form}
                showAccess={showAccess}
                productID={productID}
                upsellProductHandle={
                  IS_IPE
                    ? 'unlimited-cle-pass-monthly'
                    : 'all-inclusive-subscription-monthly'
                }
              />
            )}
          </div>
        </div>
      </div>
    )
  );
};

ProductForm.propTypes = {
  form: PropTypes.any
};

export default ProductForm;

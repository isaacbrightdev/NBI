/* eslint-disable */
import CreditsButton from '@/components/CreditsButton';
import Link from '@/components/Link';
import Price from '@/components/ProductPrice';
import SvgIcon from '@/components/SvgIcon';
import useMediaImage from '@/hooks/useMediaImage';
import useSettings from '@/hooks/useSettings';
import {
  AddToCartButton,
  CartProvider,
  ProductProvider,
  useCart,
  useProduct
} from '@shopify/hydrogen-react';
import log from 'loglevel';
import PropTypes from 'prop-types';
import { useMemo, useState } from 'react';
import { AlgoliaProductIndexName } from '@/utils/searchClient';
import useCustomer from '@/hooks/useCustomer';
import useBrowserName from '@/hooks/useBrowserName';
import useOS from '@/hooks/useOS';
import { IS_IPE } from '@/utils/constants';
import useLocale from '@/hooks/useLocale';

const ProductAddToCartButton = () => {
  const { selectedVariant, product } = useProduct();
  const { dispatch } = useSettings();

  if (!selectedVariant?.id) {
    return null;
  }
  return (
    <>
      <AddToCartButton
        variantId={selectedVariant?.id}
        className="btn btn--accent flex items-center font-medium"
        onClick={() => {
          dispatch({
            type: 'SET_MODAL',
            data: {
              name: 'addToCart',
              state: true,
              product: { ...selectedVariant, productTitle: product.title }
            }
          });
        }}
      >
        <span className="mr-2.5 hidden sm:inline-block">Add</span>
        <SvgIcon className="icon-plus" width={15} height={15} name="plus" />
      </AddToCartButton>
    </>
  );
};

// eslint-disable-next-line react/prop-types
const ProductAddToCartButtonAlgolia = ({ selectedVariant }) => {
  const { dispatch } = useSettings();
  const { linesAdd } = useCart();
  const [disabled, setDisabled] = useState(false);
  const customer = useCustomer();
  const browser = useBrowserName();
  const os = useOS();
  const customerLocale = useLocale();

  let queryID = localStorage.getItem('Algolia_QueryID');
  const storeDomain = import.meta.env.VITE_PUBLIC_STORE_DOMAIN;
  const brandVendor = IS_IPE ? 'IPE' : 'NBI';
  const URL = storeDomain + '/products/' + selectedVariant.handle;
  const checkoutURL = storeDomain+ '/cart?handle=' + selectedVariant.handle;

  const handleClick = () => {
    setDisabled(true);
    try {
      const updates = [
        {
          // eslint-disable-next-line react/prop-types
          merchandiseId: selectedVariant.id,
          quantity: 1
        }
      ];
      linesAdd(updates);
      dispatch({
        type: 'SET_MODAL',
        data: {
          name: 'addToCart',
          state: true,
          product: { ...selectedVariant, productTitle: selectedVariant?.title }
        }
      });

      const item = {
        authenticatedUserToken: customer?.id || undefined,
        id: selectedVariant.sku,
        eventName: 'Item Added To Cart from Recommendations',
        index: AlgoliaProductIndexName,
        queryID: queryID,
        title: selectedVariant.title,
        name: selectedVariant.title,
        price: `$${parseFloat(selectedVariant.price).toFixed(2)}`,
        $value: parseFloat(selectedVariant.price).toFixed(2),
        productType: selectedVariant.title,
        category: selectedVariant.product_type,
        sku: selectedVariant.sku,
        checkout_url: checkoutURL,
        variant: selectedVariant.title,
        handle: selectedVariant.handle,
        brand: brandVendor,
        vendor: brandVendor,
        variant_id: selectedVariant.id.split('/').pop(),
        variant_GID: selectedVariant.id,
        URL: URL,
        CustomerLocale: customerLocale,
        $currency: 'USD',
        quantity: 1,
        browser: browser,
        os: os,
        page: storeDomain,
      };

      window.dataLayer.push({
        event: 'add_to_cart',
        ecommerce: {
          currencyCode: selectedVariant.price,
          products: [item]
        }
      });

      if (window.klaviyo) {
        window.klaviyo.push(["track", "Added to Cart", item]);
      }

      setTimeout(() => setDisabled(false), 500);
    } catch (error) {
      log.error(error);
      setTimeout(() => setDisabled(false), 500);
    }
  };

  return (
    <>
      <CartProvider>
        <button
          type="button"
          className={[
            'btn',
            'btn--accent ',
            'flex',
            'items-center',
            'font-medium',
            ...(disabled ? ['opacity-50', 'pointer-events-none'] : [])
          ].join(' ')}
          onClick={handleClick}
          disabled={disabled}
        >
          <span className="mr-2.5 sm:inline-block">Add</span>
          <SvgIcon className="icon-plus" width={15} height={15} name="plus" />
        </button>
      </CartProvider>
    </>
  );
};

const HorizontalProductDisplayCourseCard = ({
  product,
  className,
  is_algolia = false,
  ...rest
}) => {
  const classes = {
    image: [
      'absolute',
      'w-full',
      'h-full',
      'left-0',
      'top-0',
      'object-cover',
      'object-center',
      'overflow-hidden',
      'rounded-[0.625rem]',
      'select-none'
    ],
    card: [
      'course-card',
      'group',
      'relative',
      'flex',
      'flex-col',
      'min-w-0',
      'bg-white',
      'bg-clip-border',
      'break-words',
      'items-stretch'
    ]
  };

  if (!product) return null;

  const price = useMemo(() => {
    try {
      if (is_algolia && product.price) {
        return {
          amount: product.price.toString(),
          currencyCode: window.Shopify?.currency?.active || 'USD'
        };
      }

      if (is_algolia == false && product.variants) {
        return product.variants.edges[0].node.price;
      }
    } catch (error) {
      log.error(
        'Error calculating price: HorizontalProductDisplayCourseCard.jsx'
      );
      log.error(error);
      return null;
    }
  }, [is_algolia, product]);

  const { course_block_placeholder_image } = useSettings();

  return (
    <div {...rest} className={[...classes.card, className].join(' ')}>
      <div className={`flex flex-col gap-5 sm:flex-row`}>
        <div className="flex w-full">
          <div className="flex flex-grow flex-col sm:flex-row">
            <div className="mb-3 sm:mb-0 sm:flex-shrink-0">
              <div className="course-card-image relative h-[110px] w-[150px]">
                <img
                  alt={product.title}
                  className={classes.image.join(' ')}
                  src={
                    product.image ||
                    product.featuredImage?.url ||
                    useMediaImage(course_block_placeholder_image).url
                  }
                />
              </div>
            </div>
            <div className="sm:flex sm:flex-grow sm:pl-4">
              <div className="flex flex-col leading-snug sm:flex-grow sm:justify-between">
                {product.title && (
                  <Link to={`/products/${product.handle}`}>
                    <h4
                      className={[
                        'course-card-title',
                        'text-h4-mobile',
                        'text-secondary',
                        'mb-1',
                        'line-clamp-2'
                      ].join(' ')}
                    >
                      {product.title}
                    </h4>
                  </Link>
                )}
                <div className="mb-2 text-sm-body">
                  {price && <Price price={price} />}
                </div>
                <div>
                  <CreditsButton display_vertical={true} product={product} />
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-shrink-0 items-center pl-3.5 leading-snug">
            {is_algolia ? (
              <ProductAddToCartButtonAlgolia selectedVariant={product} />
            ) : (
              <ProductProvider data={product}>
                <ProductAddToCartButton />
              </ProductProvider>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

HorizontalProductDisplayCourseCard.propTypes = {
  className: PropTypes.string,
  display_vertical: PropTypes.bool,
  is_algolia: PropTypes.bool,
  product: PropTypes.shape({
    objectID: PropTypes.string,
    title: PropTypes.string,
    image: PropTypes.string,
    body_html_safe: PropTypes.string,
    handle: PropTypes.string,
    price: PropTypes.any,
    id: PropTypes.any,
    product_type: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    meta: PropTypes.shape({
      course: PropTypes.shape({
        rating: PropTypes.string,
        hours: PropTypes.string
      })
    }),
    variants: PropTypes.shape({
      edges: PropTypes.arrayOf(
        PropTypes.shape({
          node: PropTypes.shape({
            id: PropTypes.string,
            title: PropTypes.string,
            availableForSale: PropTypes.bool,
            image: PropTypes.any,
            selectedOptions: PropTypes.arrayOf(
              PropTypes.shape({
                name: PropTypes.string,
                value: PropTypes.string
              })
            ),
            price: PropTypes.shape({
              amount: PropTypes.string,
              currencyCode: PropTypes.string
            }),
            compareAtPrice: PropTypes.any
          })
        })
      )
    })
  })
};

export default HorizontalProductDisplayCourseCard;

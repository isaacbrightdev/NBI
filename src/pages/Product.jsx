import { ProductProvider, parseMetafield } from '@shopify/hydrogen-react';
import log from 'loglevel';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import LoadingPage from '@/components/LoadingPage';
import ProductBanner from '@/components/ProductBanner';
import ProductBannerNav from '@/components/ProductBannerNav';
import ProductForm from '@/components/ProductForm';
import FaqAddToCart from '@/components/ProductForm/FaqAddToCart';
import ProductSections from '@/components/ProductSections';
import StatesModal from '@/components/modals/StatesModal';
import useProductForm from '@/hooks/useProductForm';
import useProductSectionIntersectionObserver from '@/hooks/useProductSectionIntersectionObserver';
import PRODUCT_QUERY from '@/graphql/product';
import shopify from '@/utils/shopify-api';

const mapNamespace = (fields) => {
  try {
    const unsupported = [
      'metaobject_reference',
      'list.metaobject_reference',
      'list.product_reference'
    ];

    return fields
      .filter((field) => field !== null)
      .map((field) =>
        unsupported.includes(field.type) ? field : parseMetafield(field)
      )
      .reduce(
        (acc, { key, parsedValue, value, namespace }) => ({
          ...acc,
          [namespace]: {
            ...acc[namespace],
            [key]: parsedValue ? parsedValue : value
          }
        }),
        {}
      );
  } catch (error) {
    log.error('Error mapping metafield namespace: Product.jsx', fields, error);
    return fields;
  }
};

const Product = () => {
  const { handle } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const { form } = useProductForm(product);
  const [currentNav, setCurrentNav] = useState('Overview');
  const mounted = useRef(false);
  const observer = useProductSectionIntersectionObserver(
    mounted,
    setCurrentNav
  );

  // Used so we can get the proper height of the header later.
  useEffect(() => {
    mounted.current = true;
    return () => (mounted.current = false);
  }, []);

  useEffect(() => {
    try {
      setLoading(true);
      const load = async () => {
        const data = await shopify.query(PRODUCT_QUERY, {
          handle,
          // fields should work with the mapNamespace function correctly
          fields: [
            { namespace: 'overview', key: 'title' },
            { namespace: 'agenda', key: 'style' },
            { namespace: 'agenda', key: 'details' },
            { namespace: 'course', key: 'why-you-need' },
            { namespace: 'course', key: 'rating' },
            { namespace: 'course', key: 'speakers' },
            { namespace: 'course', key: 'hours' },
            { namespace: 'course', key: 'icon_list' },
            { namespace: 'overview', key: 'title' },
            { namespace: 'course', key: 'event-date-timestamp' },
            { namespace: 'course', key: 'event-date-end-timestamp' },
            { namespace: 'bundle', key: 'courses' },
            { namespace: 'course', key: 'abbreviated-agenda' },
            { namespace: 'custom', key: 'banner-image' },
            { namespace: 'course', key: 'description-subtext' },
            { namespace: 'course', key: 'who_should_attend' },
            { namespace: 'course', key: 'included_formats' }
          ]
        });

        if (data.product === null) {
          throw 'No product found';
        }

        if (data?.product?.metafields) {
          setProduct({
            ...data.product,
            metafields: mapNamespace(data?.product?.metafields)
          });
        }
      };
      load();
    } catch (error) {
      log.error('Error loading product data: Product.jsx', handle, error);
    } finally {
      setLoading(false);
    }
  }, []);

  return loading ? (
    <LoadingPage />
  ) : (
    product && (
      <ProductProvider data={product}>
        <ProductBanner data={product} />
        <ProductBannerNav
          currentNav={currentNav}
          setCurrentNav={setCurrentNav}
        />
        {form && <ProductForm form={form} />}
        <ProductSections observer={observer} />
        <StatesModal data={product} />
        <FaqAddToCart data={product} />
      </ProductProvider>
    )
  );
};

export function Component() {
  return <Product />;
}

Component.displayName = 'Product';

export default Product;

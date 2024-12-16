import useAccessBlockState from '@/hooks/useAccessBlockState';
import useCustomer from '@/hooks/useCustomer';
import useMetaobjects from '@/hooks/useMetaobjects';
import useSettings from '@/hooks/useSettings';
import { IS_IPE } from '@/utils/constants';
import mapFields from '@/utils/mapFields';
import { useProduct } from '@shopify/hydrogen-react';
import log from 'loglevel';
import PropTypes from 'prop-types';
import { useMemo, useState } from 'react';
import { v4 as uuid } from 'uuid';

const AccessBlock = () => {
  const { product, selectedVariant } = useProduct();
  const { access_block_url } = useSettings();
  const metaobjects = useMetaobjects('access_block', 100);
  const { metaBlockHandle } = useAccessBlockState(product);
  const customer = useCustomer();
  const address = customer.addresses[0];

  const collections = product.collections.edges.map((edge) => edge.node);
  const collectionHandles = collections.map((collection) => collection.handle);

  const accessBlocks = useMemo(() => {
    return metaobjects
      ? metaobjects.reduce(
          (acc, block) => ({ ...acc, [block.handle]: mapFields(block.fields) }),
          {}
        )
      : null;
  }, [metaobjects]);

  const text = useMemo(() => {
    if (!accessBlocks || !metaBlockHandle) {
      return null;
    }

    if (!(metaBlockHandle in accessBlocks)) {
      log.error(
        `WARNING: Access Block ${metaBlockHandle} not found in access_block metaobject!`
      );
      return null;
    }

    const currentAccessBlock = accessBlocks[metaBlockHandle];

    if (!currentAccessBlock?.header || !currentAccessBlock?.text) {
      log.error(
        `WARNING: Header or Text is missing for ${metaBlockHandle} access block in access_block metaobject!`
      );
      return null;
    }

    return {
      header: currentAccessBlock.header,
      additional_text: currentAccessBlock.text,
      cta_text: currentAccessBlock.cta_text
    };
  }, [metaBlockHandle, accessBlocks]);
  log.info('[NOTICE] ACCESS Block rendered: ', metaBlockHandle);

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const handleCTAClick = () => {
    setIsButtonDisabled(true);
    setTimeout(() => {
      setIsButtonDisabled(false);
    }, 3000);

    window.dataLayer = window.dataLayer || [];
    const eventData = {
      event: 'purchase',
      purchase_type: 'subscriber',
      ecommerce: {
        currency: 'USD',
        value: 0.0,
        transaction_id: uuid(),
        tax: 0.0,
        items: [
          {
            id: selectedVariant.sku,
            name: product.title,
            brand: IS_IPE ? 'IPE' : 'NBI',
            category: product.productType,
            variant: selectedVariant.title,
            price: selectedVariant.price.amount,
            quantity: 1,
            list: collectionHandles,
            product_id: product.id.split('/').pop(),
            variant_id: selectedVariant.id.split('/').pop()
          }
        ]
      },
      user: {
        user_id: customer.id,
        email: customer.email,
        phone: customer.phone,
        first_name: customer.first_name,
        last_name: customer.last_name,
        street: address.street,
        city: address.city,
        region: address.state_code,
        postal_code: address.zip,
        country: address.country_code,
        customer_tags: customer.tags
      }
    };

    window.dataLayer.push(eventData);
  };

  return (
    text && (
      <div
        data-cy="access-block"
        className="access-block bg-primary p-6 text-center text-white lg:rounded-t-xl"
      >
        <h3 className="">{text.header}</h3>
        {text.additional_text && <p className="my-3">{text.additional_text}</p>}
        {text.cta_text && (
          <a
            href={`${access_block_url}${selectedVariant?.sku}`}
            className={`btn btn--accent inline-block w-2/3 ${isButtonDisabled ? 'disabled' : ''}`}
            onClick={handleCTAClick}
            disabled={isButtonDisabled}
          >
            {text.cta_text}
          </a>
        )}
      </div>
    )
  );
};

AccessBlock.propTypes = {
  form: PropTypes.any,
  previouslyPurchased: PropTypes.bool,
  activeSub: PropTypes.bool
};

export default AccessBlock;

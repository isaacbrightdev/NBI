import { parseGid, useCart } from '@shopify/hydrogen-react';
import PropType from 'prop-types';
import { useEffect, useState } from 'react';
import HorizontalProductDisplayAlgolia from '@/components/HorizontalProductDisplayAlgolia';
import Link from '@/components/Link';
import SubWarning from '@/components/SubWarning';
import useSettings from '@/hooks/useSettings';
import AddToCartLineItem from '../AddToCartLineItem';
import Modal from '../Modal';

const AddToCartModalHorizontalProductDisplayAlgolia = ({ variantID }) => {
  if (!variantID) {
    return null;
  }
  const { id } = parseGid(variantID);

  return (
    <>
      <hr className="my-[1.875rem] border-grey" />
      <HorizontalProductDisplayAlgolia isAddToCart={true} variantId={id} />
    </>
  );
};

const AddToCartModal = () => {
  const { dispatch, modals } = useSettings();
  const product = modals.addToCart.product;
  const { lines, checkoutUrl } = useCart();
  const [hasMultipleUniqueSubs, setHasMultipleUniqueSubs] = useState(false);
  const metaProduct = window?.meta?.product;

  useEffect(() => {
    window.dataLayer = window.dataLayer || [];

    if (!metaProduct || !product) return;

    var selectedVariant = metaProduct.variants.find((currentVariant) =>
      product.id.includes(currentVariant.id)
    );

    window.dataLayer.push({
      event: 'add_to_cart',
      ecommerce: {
        currencyCode: product.price?.currencyCode
          ? product.price?.currencyCode
          : 'USD',
        products: [
          {
            id: product.sku || selectedVariant?.sku,
            name: product.productTitle,
            brand: metaProduct.vendor,
            category: metaProduct.type,
            variant: product.variant_title || selectedVariant.public_title,
            price: product.price?.amount
              ? Number(product.price.amount)
              : Number(product.price),
            quantity: 1,
            product_id: metaProduct.id.toString(),
            variant_id: product.objectID || selectedVariant.id.toString()
          }
        ]
      }
    });
  }, [metaProduct, product]);

  useEffect(() => {
    const sellingPlanIds = new Set(
      lines
        .map((line) => line.sellingPlanAllocation?.sellingPlan.id)
        .filter((id) => id)
    );
    setHasMultipleUniqueSubs(sellingPlanIds.size > 1);
  }, [lines]);

  return (
    <Modal name="addToCart" title="Added to Cart">
      {product ? (
        <div className="mb-7">
          <AddToCartLineItem product={product} />
        </div>
      ) : (
        <p>Your cart is empty</p>
      )}

      {hasMultipleUniqueSubs && <SubWarning />}

      <div className="my-4 flex justify-between gap-x-4">
        <Link
          className="btn btn-primary flex w-1/2 justify-center"
          to="/cart"
          onClick={() => {
            dispatch({
              type: 'SET_MODAL',
              data: { name: 'addToCart', state: false }
            });
          }}
        >
          View Cart
        </Link>
        {checkoutUrl && (
          <Link
            className={`btn btn--accent flex w-1/2 justify-center ${hasMultipleUniqueSubs ? 'disabled' : ''}`}
            disabled={hasMultipleUniqueSubs}
            aria-disabled={hasMultipleUniqueSubs ? 'true' : 'false'}
            to={checkoutUrl}
            onClick={() => {
              dispatch({
                type: 'SET_MODAL',
                data: { name: 'addToCart', state: false }
              });
            }}
          >
            Checkout
          </Link>
        )}
      </div>

      <AddToCartModalHorizontalProductDisplayAlgolia variantID={product?.id} />
    </Modal>
  );
};

AddToCartModalHorizontalProductDisplayAlgolia.propTypes = {
  variantID: PropType.any
};

AddToCartModal.propTypes = {
  product: PropType.object
};

export default AddToCartModal;

import { Money, useCart } from '@shopify/hydrogen-react';
import PropTypes from 'prop-types';
import aa from 'search-insights';
import useCustomer from '@/hooks/useCustomer';
import { AlgoliaProductIndexName } from '@/utils/searchClient';

const CartSummary = ({
  subtotal,
  total,
  savings,
  checkoutURL,
  hasMultipleUniqueSubs
}) => {
  const { cost, discountCodes, lines } = useCart();

  const merchandiseDetails = lines.map((line) => {
    const {
      id,
      product: { title, productType },
      sku,
      price: { amount: price }
    } = line.merchandise;
    const {
      quantity,
      cost: {
        totalAmount: { amount: totalAmount }
      }
    } = line;

    const objectID = id.replace('gid://shopify/ProductVariant/', '');

    return {
      objectID,
      title,
      sku,
      productType,
      quantity,
      price,
      totalAmount
    };
  });

  const merchandiseVariantIds = merchandiseDetails.map(
    ({ objectID }) => objectID
  );

  const customer = useCustomer();
  let queryID = localStorage.getItem('Algolia_QueryID');

  const handleCheckoutClick = (e) => {
    if (hasMultipleUniqueSubs) {
      e.preventDefault();
    }

    aa('purchasedObjectIDsAfterSearch', {
      authenticatedUserToken: customer?.id || undefined,
      index: AlgoliaProductIndexName,
      eventName: 'Item Checkout After Search',
      objectIDs: merchandiseVariantIds,
      queryID: queryID,
      details: merchandiseDetails
    });
  };

  return (
    <div className="bg-primary px-5 py-7 md:rounded-3xl">
      <h3 className="text-center font-medium text-white">Cart Summary</h3>
      <div className="my-6 rounded-xl bg-white p-5">
        <p className="flex justify-between">
          Subtotal <Money as="span" data={subtotal} />
        </p>
        {discountCodes &&
          discountCodes.map((code) =>
            code.applicable ? (
              <div
                key={code.code}
                className="my-1 flex items-center justify-between"
              >
                <p className="text-sm-body text-secondary">Discount Code</p>
                <p className="text-sm-body text-secondary">
                  {code.code.toLocaleUpperCase()}
                </p>
              </div>
            ) : null
          )}
        {savings > 0 && (
          <p className="mt-2 flex justify-between text-secondary">
            Savings{' '}
            <Money
              as="span"
              data={{
                ...cost.totalAmount,
                amount: savings.toString()
              }}
            />
          </p>
        )}
        <hr className="my-2.5 border-grey" />
        <h4 className="flex justify-between">
          Est. Total{' '}
          {total ? (
            <Money as="span" data={total} />
          ) : (
            <span className="block h-full self-end text-sm-body">
              ...calculating
            </span>
          )}
        </h4>
      </div>
      <a
        className={`btn btn--accent block w-full ${hasMultipleUniqueSubs ? 'disabled' : ''}`}
        disabled={hasMultipleUniqueSubs}
        aria-disabled={hasMultipleUniqueSubs ? 'true' : 'false'}
        href={!hasMultipleUniqueSubs ? checkoutURL : undefined}
        onClick={handleCheckoutClick}
      >
        Checkout
      </a>
      <div
        className="cart-summary--text"
        dangerouslySetInnerHTML={{
          __html: window?.CartSettings?.cartSummaryText
        }}
      />
    </div>
  );
};

CartSummary.propTypes = {
  subtotal: PropTypes.shape({
    currencyCode: PropTypes.string,
    amount: PropTypes.string
  }),
  total: PropTypes.shape({
    currencyCode: PropTypes.string,
    amount: PropTypes.string
  }),
  savings: PropTypes.number,
  checkoutURL: PropTypes.string,
  hasMultipleUniqueSubs: PropTypes.bool
};

export default CartSummary;

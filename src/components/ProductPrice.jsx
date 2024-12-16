import { Money } from '@shopify/hydrogen-react';
import PropTypes from 'prop-types';

const ProductPrice = ({ activeSub = false, price, savings }) => {
  if (!price) return null;

  if (activeSub || savings > 0)
    return (
      <>
        <p>
          {(activeSub || savings > 0) && (
            <>
              <Money
                as="span"
                data={price}
                className="text-grey-dark line-through"
              />{' '}
            </>
          )}
          <Money
            as="span"
            data={{
              ...price,
              amount: (
                parseFloat(price.amount) - (savings ?? parseFloat(price.amount))
              ).toString()
            }}
          />
        </p>
        {(activeSub || savings > 0) && (
          <p className="text-sm-body italic text-secondary">
            {activeSub ? 'Included' : 'Discounted'}
          </p>
        )}
      </>
    );

  return <Money as="p" data={price} />;
};

ProductPrice.propTypes = {
  activeSub: PropTypes.bool,
  subType: PropTypes.string,
  savings: PropTypes.number,
  price: PropTypes.shape({
    amount: PropTypes.any,
    currencyCode: PropTypes.string
  })
};

export default ProductPrice;

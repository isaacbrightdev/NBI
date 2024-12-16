import { Money } from '@shopify/hydrogen-react';
import { useProduct } from '@shopify/hydrogen-react';
import PropTypes from 'prop-types';
import { useMemo } from 'react';
import SvgIcon from '@/components/SvgIcon';

const ProductOption = ({
  header,
  mainVariant,
  showStateWarning,
  numberOfCourses,
  coveredBySub,
  multiRegDiscountAmount,
  quantity
}) => {
  const showDiscount =
    (quantity >= 2 && multiRegDiscountAmount) || coveredBySub;

  const oldPrice = useMemo(() => {
    return parseFloat(mainVariant?.price?.amount || '0').toString();
  }, [mainVariant]);

  const showPrice = useMemo(() => {
    let price = oldPrice;

    if (quantity >= 2 && multiRegDiscountAmount)
      price -= multiRegDiscountAmount;

    if (coveredBySub) price = 0;

    return price.toString();
  }, [oldPrice, quantity, multiRegDiscountAmount, coveredBySub]);

  const { product } = useProduct();
  const { metafields } = product || {};
  const { included_formats } = metafields?.course || {};

  return !mainVariant ? null : (
    <div>
      <div className="flex items-center justify-between">
        <p className="font-bold">{header || mainVariant.title}</p>
        <div>
          <p className="font-bold">
            {showDiscount && oldPrice && (
              <>
                <Money
                  as="span"
                  data={{
                    ...mainVariant.price,
                    amount: oldPrice
                  }}
                  className="text-grey-dark line-through"
                />{' '}
              </>
            )}

            <Money
              as="span"
              data={{
                ...mainVariant.price,
                amount: showPrice ? showPrice : '0'
              }}
            />
          </p>
        </div>
      </div>
      {Array.isArray(included_formats) && included_formats.length > 0 && (
        <hr className="mb-4 mt-2" />
      )}
      <div className="text-left">
        {Array.isArray(included_formats) &&
          included_formats.map((format, index) => {
            if (format.includes('{num_courses}')) {
              format = format.replaceAll('{num_courses}', numberOfCourses);
            }

            return (
              <div key={index} className="flex items-center">
                {included_formats.length > 1 && (
                  <SvgIcon width={14} name="check" className="mr-2" />
                )}
                <p className="text-sm-body">{format}</p>
              </div>
            );
          })}
      </div>
      {showStateWarning && (
        <span className="inline-flex pt-3 text-fine-print leading-4 text-error">
          <SvgIcon width={12} name="alert" className="mr-2 min-w-max" />
          {
            'This course does not qualify for credit within one or more of your selected jurisdictions.'
          }
        </span>
      )}
    </div>
  );
};

ProductOption.propTypes = {
  header: PropTypes.string,
  mainVariant: PropTypes.any,
  showStateWarning: PropTypes.bool,
  numberOfCourses: PropTypes.number,
  coveredBySub: PropTypes.bool,
  multiRegDiscountAmount: PropTypes.number,
  quantity: PropTypes.number
};

export default ProductOption;

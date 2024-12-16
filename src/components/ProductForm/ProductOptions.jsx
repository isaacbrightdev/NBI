import PropTypes from 'prop-types';
import ProductOption from './ProductOption';

const optionClass = [
  'product-option',
  'rounded',
  'p-4',
  'mb-4',
  'text-left',
  'bg-white',
  'select-none'
].join(' ');

const gradientOptionClass = [
  'product-option',
  'rounded',
  'p-4',
  'mb-4',
  'text-left',
  'bg-gradient-to-tl from-primary to-secondary',
  'text-white',
  'select-none'
].join(' ');

const ProductOptions = ({
  form,
  mainVariant,
  showStateWarning,
  numberOfCourses,
  gradientBackground,
  coveredBySub,
  multiRegDiscountAmount,
  quantity
}) => {
  const { activeSub, course_block_header, course_block_wording } = form;

  return (
    <div className="product-options">
      <div
        data-cy="product-option"
        className={gradientBackground ? gradientOptionClass : optionClass}
      >
        <ProductOption
          activeSub={activeSub}
          header={course_block_header}
          wording={course_block_wording}
          mainVariant={mainVariant}
          showStateWarning={showStateWarning}
          numberOfCourses={numberOfCourses}
          coveredBySub={coveredBySub}
          multiRegDiscountAmount={multiRegDiscountAmount}
          quantity={quantity}
        />
      </div>
    </div>
  );
};

ProductOptions.propTypes = {
  form: PropTypes.any,
  mainVariant: PropTypes.any,
  showStateWarning: PropTypes.bool,
  numberOfCourses: PropTypes.number,
  gradientBackground: PropTypes.bool,
  coveredBySub: PropTypes.bool,
  multiRegDiscountAmount: PropTypes.number,
  quantity: PropTypes.number
};

export default ProductOptions;

import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';
import SvgIcon from '@/components/SvgIcon';
import useHandleSubmit from '@/hooks/useHandleSubmit';
import useCustomer from '@/hooks/useCustomer';
import {
  SUBSCRIPTION_SKU_SUFFIXES,
  CUSTOMER_SUBSCRIPTION_STATES
} from '@/utils/constants';

const { ALL_INCLUSIVE_SUBSCRIBER, ONDEMAND_SUBSCRIBER } =
  CUSTOMER_SUBSCRIPTION_STATES;

const FaqAddToCart = ({ data }) => {
  const FaqAddEl = document.querySelector('#getThisCourse');
  const handleSubmit = useHandleSubmit();
  const customer = useCustomer();

  if (!data) return;
  
  const isInclusive = data?.tags?.some(value => /\]validinsub:allinclusive/.test(value)) ?? false;
  const isOndemand = data?.tags?.some(value => /\]validinsub:ondemand/.test(value)) ?? false;


  if( customer ){
    const customerSubType = customer.metafields?.subscriptions?.details['sub-type'] ?? '';

    if( isOndemand && customerSubType.toLowerCase() == ONDEMAND_SUBSCRIBER.toLowerCase() ){
      return;
    }
    
    if( isInclusive && customerSubType.toLowerCase() == ALL_INCLUSIVE_SUBSCRIBER.toLowerCase() ){
      return;
    }
  }

  return (
    FaqAddEl &&
    createPortal(
      <button
        data-cy="product-form-submit"
        className="btn btn--accent flex select-none items-center"
        id="get-course-button"
        onClick={handleSubmit}
      >
        Get This Course
        <span className="ml-2.5">
          <SvgIcon
            className="icon-arrow rotate-180"
            name="arrow"
            width={15}
            height={10}
          />
        </span>
      </button>,
      FaqAddEl
    )
  );
};

FaqAddToCart.propTypes = {
  data: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string
  })
};

export default FaqAddToCart;

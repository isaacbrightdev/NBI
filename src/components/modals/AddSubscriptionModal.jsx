import { useCart } from '@shopify/hydrogen-react';
import PropType from 'prop-types';
import Link from '@/components/Link';
import useSettings from '@/hooks/useSettings';
import Modal from '../Modal';

const AddSubscriptionModal = ({ item }) => {
  const { dispatch } = useSettings();
  const { checkoutUrl } = useCart();

  return (
    <Modal name="addSubscription" title="Added to Cart">
      {item && (
        <div className="my-2">
          <div className="flex flex-col rounded border p-3">
            <p className="mb-2 pt-2 font-medium text-secondary">{item.title}</p>
            <p className="text-sm-body">
              {item.price} / {item.type}
            </p>
          </div>
        </div>
      )}
      <div className="my-4 flex justify-between gap-x-4">
        <Link
          className="btn btn-primary flex w-1/2 justify-center"
          to="/cart"
          onClick={() => {
            dispatch({
              type: 'SET_MODAL',
              data: { name: 'addSubscription', state: false }
            });
          }}
        >
          View Cart
        </Link>
        {checkoutUrl && (
          <Link
            className="btn btn--accent flex w-1/2 justify-center"
            to={checkoutUrl}
            onClick={() => {
              dispatch({
                type: 'SET_MODAL',
                data: { name: 'addSubscription', state: false }
              });
            }}
          >
            Checkout
          </Link>
        )}
      </div>
    </Modal>
  );
};

AddSubscriptionModal.propTypes = {
  item: PropType.any
};

export default AddSubscriptionModal;

import { useCart, useProduct } from '@shopify/hydrogen-react';
import log from 'loglevel';
import useSettings from '@/hooks/useSettings';

const useHandleSubmit = () => {
  const { linesAdd } = useCart();
  const { selectedVariant, product } = useProduct();
  const { dispatch } = useSettings();

  const handleSubmit = () => {
    try {
      const updates = [
        {
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
          product: { ...selectedVariant, productTitle: product.title }
        }
      });
    } catch (error) {
      log.error('FaqAddToCart handleSubmit', error);
    }
  };

  return handleSubmit;
};

export default useHandleSubmit;

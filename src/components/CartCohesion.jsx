import { useCart } from '@shopify/hydrogen-react';
import log from 'loglevel';
import { useEffect, useState } from 'react';

const CartCohesion = () => {
  const { lines, linesAdd, linesRemove } = useCart();
  const [tempCart, setTempCart] = useState('');

  const saveCartToLocalStorage = () => {
    if (tempCart != '') {
      localStorage.setItem('sessioncart', tempCart);

      setTempCart('');
    } else {
      localStorage.setItem('sessioncart', JSON.stringify(lines));
    }
  };

  useEffect(() => {
    saveCartToLocalStorage();
  }, [lines]);

  const clearCartAndReAdd = async () => {
    localStorage.setItem('refreshcart', 'true');

    if (lines.length > 0) {
      const filteredLines = lines.filter(
        (line) =>
          !line.attributes.some(
            (attr) => attr.key === 'source' || attr.key === 'magicUrl'
          )
      );

      const lineItemIds = filteredLines.map((item) => item.id);

      try {
        setTempCart(localStorage.getItem('sessioncart'));

        linesRemove(lineItemIds);

        reAddCartFromLocalStorage(false);
      } catch (error) {
        log.error('CartCohesion clear cart error', error);
      }
    } else {
      reAddCartFromLocalStorage(true);
    }
  };

  useEffect(() => {
    if (localStorage.getItem('refreshcart') === null) {
      localStorage.setItem('refreshcart', 'true');

      reAddCartFromLocalStorage(true)
    }else if( localStorage.getItem('refreshcart') === 'false' ){
      clearCartAndReAdd()
    }
  }, []);

  const reAddCartFromLocalStorage = (instant = false) => {
    const parsedCart = JSON.parse(localStorage.getItem('sessioncart')) || [];

    if (parsedCart.length > 0) {
      try {
        const lineItems = parsedCart.map((item) => ({
          merchandiseId: item.merchandise.id,
          quantity: item.quantity,
          ...(item.sellingPlanAllocation?.sellingPlan?.id && {
            sellingPlanId: item.sellingPlanAllocation.sellingPlan.id
          })
        }));

        if( instant ){
          linesAdd(lineItems);
        }else{
          setTimeout(() => {
            linesAdd(lineItems);
          }, 2000);
        }
        
      } catch (error) {
        log.error('CartCohesion rehydrate cart error', error);
      }
    }
  };

  return null;
};

export default CartCohesion;

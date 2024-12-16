import { CartLineProvider, useCart } from '@shopify/hydrogen-react';
import log from 'loglevel';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import CartSummary from '@/components/Cart/CartSummary';
import DiscountForm from '@/components/Cart/DiscountForm';
import IconList from '@/components/Cart/IconList';
import LineItem from '@/components/LineItem';
import { DiscountContext } from '@/hooks/useLineDiscounts';
import {
  consolidateLines,
  getCalculatedSubtotal
} from '@/utils/cartCalculations';

const Cart = () => {
  const {
    lines,
    totalQuantity,
    checkoutUrl,
    cost,
    discountAllocations,
    status
  } = useCart();
  const [discounts, setDiscounts] = useState({});
  const upsellDiscountClaimedLine = useRef(null);

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const discountCode = searchParams.get('discount');
    if (discountCode) {
      applyDiscountCode(discountCode);
    }
  }, [searchParams]);

  const applyDiscountCode = (code) => {
    log.debug('Applying discount:', code);
    // Apply the discount logic here, possibly updating the cart's state
  };

  const removeDiscountCode = () => {
    // Example function to remove discount code
    if (searchParams.has('discount')) {
      searchParams.delete('discount');
      setSearchParams(searchParams);
    }
  };

  const setCartDiscount = (discount) => {
    setDiscounts((prevState) => {
      const prevLineDiscounts = { ...prevState }; // this isn't a deeply nested object, so we're fine here.
      for (const previousDiscount in prevLineDiscounts) {
        const matchedLine = lines.find((line) => line.id === previousDiscount);
        if (!matchedLine) {
          delete prevLineDiscounts[previousDiscount];
        }
      }

      return {
        ...prevLineDiscounts,
        [discount.id]: discount.amount
      };
    });
  };

  const consolidatedLines = useMemo(() => {
    upsellDiscountClaimedLine.current = null;
    return consolidateLines(lines);
  }, [lines, cost]);

  const calculatedSubtotal = useMemo(() => {
    if (!cost)
      return {
        currencyCode: 'USD',
        amount: '0'
      };

    return {
      ...cost.subtotalAmount,
      amount: getCalculatedSubtotal(lines).toFixed(2)
    };
  }, [lines, cost, status, discounts]);

  const savings = useMemo(() => {
    const cartDiscounts = discountAllocations
      ? discountAllocations.reduce(
          (total, { discountedAmount }) =>
            total + parseFloat(discountedAmount.amount),
          0
        )
      : 0;

    const calculatedLineDiscounts = { ...discounts };
    for (const lineDiscount in calculatedLineDiscounts) {
      const matchedLine = lines.find((line) => line.id === lineDiscount);
      if (!matchedLine) {
        delete calculatedLineDiscounts[lineDiscount];
      }
    }

    const newSavings = Object.values(calculatedLineDiscounts).reduce(
      (acc, discount) => acc + discount,
      cartDiscounts
    );

    return newSavings > parseFloat(calculatedSubtotal.amount)
      ? parseFloat(calculatedSubtotal.amount)
      : newSavings;
  }, [discounts, calculatedSubtotal, lines]);

  const total = useMemo(() => {
    if (!cost)
      return {
        currencyCode: 'USD',
        amount: '0'
      };

    try {
      const newTotal = parseFloat(calculatedSubtotal.amount) - savings;
      return {
        ...cost.subtotalAmount,
        amount: newTotal > 0 ? newTotal.toFixed(2) : '0.00'
      };
    } catch (error) {
      log.error('Error calculating cart total: Cart.jsx');
      log.error(error);
    }
  }, [calculatedSubtotal]);

  return (
    <DiscountContext.Provider
      value={{
        setCartDiscount,
        savings,
        total,
        upsellDiscountClaimedLine
      }}
    >
      <div className="cart container mb-20 mt-12 xl:gx-xl">
        <h2 className="mb-8 flex items-center gap-4">
          <button onClick={removeDiscountCode}>Remove Discount</button>
          Your Cart{' '}
          <span className="text-base">
            ({totalQuantity === 1 ? `1 course` : `${totalQuantity} courses`})
          </span>
        </h2>
        {consolidatedLines.length ? (
          <div className="md:flex md:items-start md:gap-5">
            <div className="lines mb-6 w-full md:w-3/5 md:gap-6 lg:w-8/12">
              {consolidatedLines?.map((line) => (
                <CartLineProvider key={line.id} line={line}>
                  <LineItem />
                </CartLineProvider>
              ))}
            </div>
            <aside className="w-full md:w-2/5 lg:w-4/12">
              <CartSummary
                subtotal={calculatedSubtotal}
                savings={savings}
                total={total}
                checkoutURL={checkoutUrl}
              />
              <IconList />
              <DiscountForm />
            </aside>
          </div>
        ) : (
          <h4>Your cart is empty</h4>
        )}
      </div>
    </DiscountContext.Provider>
  );
};

export default Cart;

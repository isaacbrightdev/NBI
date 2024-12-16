import CartSummary from '@/components/Cart/CartSummary';
import DiscountForm from '@/components/Cart/DiscountForm';
import IconList from '@/components/Cart/IconList';
import CourseCardShimmer from '@/components/CourseCardShimmer';
import LineItem from '@/components/LineItem';
import { CART_DISCOUNT_CODES_QUERY } from '@/graphql/cart';
import { BASIC_PRODUCT_QUERY } from '@/graphql/product';
import { DiscountContext } from '@/hooks/useLineDiscounts';
import { getCalculatedSubtotal } from '@/utils/cartCalculations';
import shopify from '@/utils/shopify-api';
import { CartLineProvider, useCart } from '@shopify/hydrogen-react';
import log from 'loglevel';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const Cart = () => {
  const {
    lines,
    totalQuantity,
    checkoutUrl,
    cost,
    discountAllocations,
    status,
    discountCodesUpdate,
    linesAdd,
    id: cartId // Add this line to get the cart ID
  } = useCart();
  const [discounts, setDiscounts] = useState({});
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const upsellDiscountClaimedLine = useRef(null);

  const [hasMultipleUniqueSubs, setHasMultipleUniqueSubs] = useState(false);

  useEffect(() => {
    const sellingPlanIds = new Set(
      lines
        .map((line) => line.sellingPlanAllocation?.sellingPlan.id)
        .filter((id) => id)
    );
    setHasMultipleUniqueSubs(sellingPlanIds.size > 1);
  }, [lines, status]);

  const fetchData = async (handle) => {
    if (!handle) return null;

    const quantity = parseInt(searchParams.get('quantity'), 10) || 1;
    const discount = searchParams.get('discount');

    try {
      const response = await shopify.query(BASIC_PRODUCT_QUERY, { handle });
      const { product } = response;
      if (product.variants.edges.length === 0) return null;

      const firstVariant = product.variants.edges[0].node;
      const variantId = firstVariant.id;
      const sellingPlanAllocations = firstVariant.sellingPlanAllocations.edges;
      const sellingPlanId =
        sellingPlanAllocations.length > 0
          ? sellingPlanAllocations[0].node.sellingPlan.id
          : null;
      const vendor = product.vendor;
      const productType = product.productType;
      const amount = firstVariant.price.amount;
      const variantTitle = firstVariant.title;
      const sku = firstVariant.sku;
      const productId = product.id;
      const productTitle = product.title;

      return {
        handle,
        variantId,
        quantity,
        discount,
        merchandiseId: variantId,
        sellingPlanId,
        vendor,
        productType,
        amount,
        variantTitle,
        sku,
        productId,
        productTitle
      };
    } catch (error) {
      return null;
    }
  };

  const processCartDetails = async (details, lines) => {
    for (const detail of details) {
      const { merchandiseId, quantity, sellingPlanId } = detail;
      const existingLine = lines.find(
        (line) =>
          line.merchandise.id === merchandiseId &&
          line.attributes.some(
            (attr) => attr.key === 'source' && attr.value === 'magicUrl'
          )
      );

      if (!existingLine) {
        try {
          await linesAdd([
            {
              merchandiseId,
              quantity,
              attributes: [{ key: 'source', value: 'magicUrl' }],
              ...(sellingPlanId && { sellingPlanId })
            }
          ]);

          const item = {
            id: detail.sku,
            name: detail.productTitle,
            brand: detail.vendor,
            category: detail.productType,
            variant: detail.variantTitle,
            price: Number(detail.amount),
            quantity: 1,
            product_id: detail.productId.split('/').pop(),
            variant_id: detail.variantId.split('/').pop()
          };

          window.dataLayer = window.dataLayer || [];

          window.dataLayer.push({
            event: 'add_to_cart',
            ecommerce: {
              currencyCode: 'USD',
              products: [item]
            }
          });

          if (window.klaviyo) {
            window.klaviyo.push(["track", "Added to Cart", item]);
          }
        } catch (error) {
          log.error('Error adding line:', error);
        }
      }
    }
  };

  const applyDiscount = async () => {
    const discount = searchParams.get('discount');
    if (discount) {
      try {
        await discountCodesUpdate([discount]);

        const cartDiscountCodesUpdate = await shopify.query(
          CART_DISCOUNT_CODES_QUERY,
          { id: cartId }
        );
        const { cart } = cartDiscountCodesUpdate;

        if (cart.discountCodes.length > 0) {
          setSearchParams((params) => {
            params.delete('discount');
            return params;
          });
          return true; // Discount applied
        }
      } catch (error) {
        log.error('Error applying discount:', error);
      }
    }
    return false; // No discount to apply
  };

  const fetchToCart = async () => {
    const handles = searchParams.getAll('handles[]');
    const handle = searchParams.get('handle');
    const discount = searchParams.get('discount');

    let handleArray = [];
    if (handles.length > 0) {
      handleArray = handles;
    } else if (handle) {
      handleArray = [handle];
    }

    let cancelCallback = () => {};

    const sleep = (period) => {
      return new Promise((resolve) => {
        cancelCallback = () => {
          return resolve('Canceled');
        };
        setTimeout(() => {
          resolve('tick');
        }, period);
      });
    };

    const poll = (promiseFn, period, timeout) => {
      return promiseFn()
        .then(async (done) => {
          const asleep = async (period) => {
            let respond = await sleep(period);

            const nextHandle = handleArray[0];
            if (nextHandle) {
              searchParams.set('handle', nextHandle);
              setSearchParams(searchParams);
            }

            return respond;
          };

          if (cancelCallback.toString() === '() => {}') {
            setTimeout(() => {
              cancelCallback();
            }, timeout);
          }

          await asleep(period);

          if (done) {
            if (discount) {
              await sleep(window.cart_poll_discount || 100);
              const discountApplied = await applyDiscount();

              if (discountApplied) {
                searchParams.delete('discount');
                setSearchParams(searchParams);
              }
            }

            setLoading(false);
            searchParams.delete('handle');
            searchParams.delete('handles[]');
            searchParams.delete('quantity');
            setSearchParams(searchParams);
            return; // Stop polling if done
          }

          return poll(promiseFn, period, timeout);
        })
        .catch((error) => {
          console.error('Error during polling:', error);
        });
    };

    const promiseFn = async () => {
      if (handleArray.length === 0) {
        return true; // Stop polling if no handles are left
      }

      const currentHandle = handleArray[0];

      try {

        const fetchedData = await fetchData(currentHandle);
        if (fetchedData) {
          await processCartDetails([fetchedData], lines);
        }
      } catch (error) {
        console.error('Error fetching data for handle:', error);
      }

      handleArray.shift();

      return handleArray.length === 0; // Return true if all handles are processed
    };

    const startPolling = async () => {
      try {
        await poll(
          () =>
            new Promise((resolve) => {
              promiseFn()
                .then((done) => resolve(done))
                .catch((error) => {
                  console.error('Error in promiseFn:', error);
                  resolve(false);
                });
            }),
          window.cart_poll_interval || 900, // poll add product to cart
          window.cart_poll_total || 1000 // total time of polling
        );
      } catch (error) {
        console.error('Error starting polling:', error);
      }
    };

    startPolling();
  };

  useEffect(() => {
    fetchToCart();
  }, []);

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
          Your Cart{' '}
          <span className="text-base">
            ({totalQuantity === 1 ? `1 course` : `${totalQuantity} courses`})
          </span>
        </h2>
        {loading ? (
          <div className="loading">
            <CourseCardShimmer />
          </div>
        ) : lines.length ? (
          <div className="md:flex md:items-start md:gap-5">
            <div className="lines mb-6 w-full md:w-3/5 md:gap-6 lg:w-8/12">
              {lines?.map((line) => (
                <CartLineProvider key={line.id} line={line}>
                  <LineItem hasMultipleUniqueSubs={hasMultipleUniqueSubs} />
                </CartLineProvider>
              ))}
            </div>
            <aside className="w-full md:w-2/5 lg:w-4/12">
              <CartSummary
                subtotal={calculatedSubtotal}
                savings={savings}
                total={total}
                checkoutURL={checkoutUrl}
                hasMultipleUniqueSubs={hasMultipleUniqueSubs}
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

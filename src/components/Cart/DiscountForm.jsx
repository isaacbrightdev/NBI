import { useCart } from '@shopify/hydrogen-react';
import log from 'loglevel';
import { useEffect, useState } from 'react';
import { CART_DISCOUNT_CODES_QUERY } from '@/graphql/cart';
import shopify from '@/utils/shopify-api';

const DiscountForm = () => {
  const { discountCodesUpdate, id, discountCodes } = useCart();
  const [discountState, setDiscountState] = useState({
    code: '',
    message: '',
    showMessage: false,
    error: false,
    disabled: false,
    dirty: false
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    // an empty array will clear the discount code on the cart
    // the empty string '' counts as a code
    const code = !discountState.code ? [] : discountState.code;

    // use Hydrogen hook to update code in background
    discountCodesUpdate(code);

    // set "loading" state
    setDiscountState((previousValue) => ({
      ...previousValue,
      disabled: true, // disable button while useEffect makes its request
      dirty: true // user touched and submitted form, ok to show messages
    }));
  };

  useEffect(() => {
    if (discountState.showMessage) {
      const clearMessage = setTimeout(() => {
        setDiscountState((previousValue) => ({
          ...previousValue,
          showMessage: false,
          error: false,
          disabled: false
        }));
      }, 5000);

      return () => {
        clearTimeout(clearMessage);
      };
    }
  }, [discountState.showMessage]);

  useEffect(() => {
    (async () => {
      try {
        const cartDiscountCodesUpdate = await shopify.query(
          CART_DISCOUNT_CODES_QUERY,
          { id: id }
        );
        const { cart } = cartDiscountCodesUpdate;

        // No discount codes present in get cart response
        if (cart.discountCodes.length === 0) {
          return setDiscountState((previousValue) => ({
            ...previousValue,
            message: '',
            showMessage: false,
            error: false,
            disabled: false
          }));
        }

        // check for invalid discount codes
        let invalidCodeApplied = false;
        for (const discountCode of cart.discountCodes) {
          if (!discountCode.applicable) {
            invalidCodeApplied = true;
            break;
          }
        }

        // clear form if bad code submitted
        // don't show message if form isn't dirty - user already submitted this code prior
        // set error message if invalid code applied
        // re-enable button
        setDiscountState({
          code: invalidCodeApplied ? '' : cart.discountCodes[0].code,
          message: invalidCodeApplied
            ? 'The discount code you entered is invalid or cannot be applied to your cart.'
            : 'Your discount code was successfully applied.',
          showMessage: discountState.dirty ? true : false,
          error: invalidCodeApplied,
          disabled: false,
          dirty: discountState.dirty
        });
      } catch (error) {
        log.error(error);
      }
    })();
  }, [id, discountCodes]);

  return (
    <form
      id="discount_form"
      onSubmit={handleSubmit}
      className="my-6 flex flex-wrap justify-center rounded-3xl border border-grey px-5 pt-5 lg:px-5 lg:pt-8"
    >
      <label htmlFor="discount" className="sr-only">
        Enter a discount code
      </label>
      <div className="basis-full xl:basis-[69%]">
        <input
          type="text"
          id="discount"
          name="discount"
          className={[
            'input--regular',
            'w-full',
            ...(discountState.error && discountState.showMessage
              ? ['border-error']
              : [])
          ].join(' ')}
          placeholder="Discount Code"
          onChange={(e) =>
            setDiscountState((previousValue) => ({
              ...previousValue,
              code: e.target.value
            }))
          }
          value={discountState.code}
          data-hj-allow
        />
      </div>
      <div className="basis-full md:w-full xl:w-auto xl:basis-auto xl:pl-2 2xl:pl-5">
        <button
          type="submit"
          className="btn btn--accent mt-4 w-full xl:mt-0 xl:w-auto"
          disabled={discountState.disabled}
        >
          Apply
        </button>
      </div>
      <span
        className={`${
          discountState.showMessage ? 'pt-3 lg:pt-5' : 'pt-5 lg:pt-8'
        } basis-full transition-all`}
      ></span>
      <p
        className={`${discountState.error ? 'text-error' : 'text-active'}
        ${
          discountState.showMessage
            ? 'pb-3 leading-6 opacity-100 lg:pb-5'
            : 'leading-[0px] opacity-0'
        }
        overflow-hidden text-center transition-all duration-300
        `}
      >
        {discountState.message}
      </p>
    </form>
  );
};

export default DiscountForm;

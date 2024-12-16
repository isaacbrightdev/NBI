import { useProduct, AddToCartButton } from '@shopify/hydrogen-react';
import PropTypes from 'prop-types';
import CourseBookVariantImage from '@/components/svg/CourseBookVariantImage';
import useSettings from '@/hooks/useSettings';

const CourseBookSection = () => {
  const { product } = useProduct();
  const { dispatch } = useSettings();
  const variantList = product?.variants?.edges || [];

  return (
    <div className="mb-10">
      {variantList ? (
        variantList.map(({ node }) => {
          if (node.title.toLowerCase().includes('book')) {
            const priceFormatter = new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: node.price.currencyCode,
              currencySign: 'accounting'
            });
            const price = priceFormatter.format(node.price.amount);

            return (
              <div key={node.id}>
                <p className="mb-4 text-h4 font-medium leading-tight">
                  Get The Book
                </p>
                <div className="border-lineColor rounded-lg border p-5 md:flex md:gap-5">
                  <div className="mb-5 md:col-4 md:mb-0">
                    <CourseBookVariantImage className="aspect-[4/3]" />
                  </div>
                  <div className="flex flex-col justify-center md:col">
                    <div className="flex flex-1 flex-col items-start justify-center">
                      <p className="mb-[5px] text-h4 font-medium leading-tight text-secondary">
                        {node.title}
                      </p>
                      <p className="mb-5 text-sm-body md:mb-[15px]">
                        Included for <i className="text-secondary">free</i> with
                        with each course purchase. <br />
                        Available for single purchase.
                      </p>
                      <AddToCartButton
                        variantId={node.id}
                        quantity={1}
                        className="btn btn--accent"
                        onClick={() => {
                          dispatch({
                            type: 'SET_MODAL',
                            data: {
                              name: 'addToCart',
                              state: true,
                              product: { ...node, productTitle: node.title }
                            }
                          });
                        }}
                      >
                        Buy Book | {price}
                      </AddToCartButton>
                    </div>
                  </div>
                </div>
              </div>
            );
          }
        })
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

CourseBookSection.propTypes = {
  variants: PropTypes.object
};

export default CourseBookSection;

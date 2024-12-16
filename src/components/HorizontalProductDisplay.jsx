import loader from '@/loaders/collection';
import log from 'loglevel';
import { useEffect, useRef, useState } from 'react';
import HorizontalProductDisplayCourseCard from '@/components/HorizontalProductDisplayCourseCard';

const HorizontalProductDisplay = () => {
  const ref = useRef(null);
  const [data, setData] = useState(null);
  const [products, setProducts] = useState(null);

  useEffect(() => {
    let scriptData = null;
    try {
      scriptData = JSON.parse(
        ref.current.parentElement.querySelector(
          "script[type='application/json']"
        ).textContent ? ref.current.parentElement.querySelector(
          "script[type='application/json']"
        ).textContent : null
      );
    } catch (error) {
      log.error(
        `Could not parse settings data for section "Horizontal Product Display": `,
        error
      );
    }

    setData(scriptData);

    if (scriptData && scriptData?.collectionHandle) {
      const load = async () => {
        const data = await loader(scriptData.collectionHandle);
        if (data?.products) {
          const updatedData = data?.products.map((product) => {
            return {
              ...product,
              meta: {
                course: {
                  credits: [],
                  hours: product?.hours?.value,
                  rating: JSON.stringify(product?.rating?.value)
                }
              }
            };
          });
          setProducts(updatedData.slice(0, 3));
        }
      };
      load();
    }
  }, []);

  return (
    <div className="horizontal-product-display-grid-wrapper" ref={ref}>
      {products && (
        <>
          <div className="mb-5 flex items-center lg-max:container-fluid lg:mb-7">
            <div className="flex-grow">
              {data?.title && (
                <h3 className="text-h3 lg-max:!text-h3-mobile">
                  {data?.title}
                </h3>
              )}
            </div>
          </div>

          <div className="horizontal-product-display-grid grid grid-cols-1 gap-5 rounded-[0.625rem] border border-solid border-grey p-5">
            {products &&
              products.map((product) => (
                <HorizontalProductDisplayCourseCard
                  key={product.id}
                  product={product}
                />
              ))}
          </div>
        </>
      )}
    </div>
  );
};

export default HorizontalProductDisplay;

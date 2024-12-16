import { useProduct } from '@shopify/hydrogen-react';
import { Splide, SplideSlide, SplideTrack } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';
import log from 'loglevel';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import PRODUCT_QUERY_BY_GIDS from '@/graphql/productsFromGids';
import shopify from '@/utils/shopify-api';
import ProductSeriesItem from '../ProductSeriesItem';

const ProductSeries = () => {
  const { product } = useProduct();
  const [seriesProducts, setSeriesProducts] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const coursesString = product?.metafields?.bundle?.courses;
        const courses = coursesString ? JSON.parse(coursesString) : null;
        if (!courses) {
          throw 'No product found';
        }

        const data = await shopify.query(PRODUCT_QUERY_BY_GIDS, {
          ids: courses,
          fields: [
            { namespace: 'course', key: 'rating' },
            { namespace: 'course', key: 'hours' },
            { namespace: 'course', key: 'why-you-need' }
          ]
        });

        if (data.nodes === null || data === null) {
          throw 'No product found';
        }

        if (data?.nodes && data?.nodes.length > 0) {
          // Filter out null values for not-found courses.
          setSeriesProducts(data?.nodes.filter((n) => n));
        }
      } catch (error) {
        log.error('error', error);
      }
    };

    load();

    return () => {
      setSeriesProducts(null);
    };
  }, [product?.metafields?.bundle?.courses]);

  if (!seriesProducts) return <></>;

  return (
    <div className="my-[40px]">
      {/* desktop title */}
      <h3 className="hidden text-h4-mobile font-medium text-primary lg:mb-4 lg:block lg:text-h4">
        Courses Included
      </h3>
      {/* mobile has a slideshow (for array count greater than 1) */}
      {seriesProducts && seriesProducts.length === 0 ? (
        <>
          <h3 className="mb-4 text-h4-mobile font-medium text-primary lg:hidden">
            Courses Included
          </h3>
          <div className="block lg:hidden">
            {seriesProducts.map((course, index) => (
              <ProductSeriesItem
                key={course.id + index + '_mobile'}
                item={course}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="flex flex-col lg:hidden">
          {/* mobile slideshow */}
          <Splide
            hasTrack={false}
            aria-label="course series"
            options={{
              perPage: 1.3,
              gap: '1rem',
              permove: 1,
              arrows: true,
              pagination: false,
              isNavigation: true,
              focus: 'center',
              classes: {
                arrows: 'splide__arrows',
                arrow: 'splide__arrow',
                prev: 'splide__arrow--prev',
                next: 'splide__arrow--next'
              }
            }}
          >
            <div className="relative mb-5 flex items-center justify-between">
              <div className="relative">
                <h3 className="text-h4-mobile font-medium text-primary lg:text-h4">
                  Courses Included
                </h3>
              </div>
              <div className="relative inline-block w-[110px]">
                <div className="splide__arrows" />
              </div>
            </div>
            <SplideTrack>
              {seriesProducts.map((course, index) => (
                <SplideSlide
                  key={course.id + index + '_slideshow'}
                  style={{ border: 'none' }}
                  className="flex items-stretch"
                >
                  <ProductSeriesItem item={course} className="h-full" />
                </SplideSlide>
              ))}
            </SplideTrack>
          </Splide>
        </div>
      )}
      <div className="hidden lg:flex lg:flex-col">
        {seriesProducts.map((course, index) => (
          <ProductSeriesItem
            key={course.id + index + '_desktop'}
            item={course}
          />
        ))}
      </div>
    </div>
  );
};

ProductSeries.propTypes = {
  courses: PropTypes.string
};

export default ProductSeries;

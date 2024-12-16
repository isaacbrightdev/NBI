import { Splide, SplideSlide, SplideTrack } from '@splidejs/react-splide';
import PropTypes from 'prop-types';
import CourseCard from '@/components/CourseCard';
import SvgIcon from '@/components/SvgIcon';

const HorizontalProductWrapper = ({
  products,
  carouselRef,
  useObjectId,
  data
}) => {
  return (
    <div ref={carouselRef} className="">
      {products && (
        <Splide
          hasTrack={false}
          className="splide-horizontal-product-carousel"
          options={{
            perPage: data?.twoColumns ? 2 : 4,
            gap: '1.5rem',
            pagination: false,
            breakpoints: {
              768: {
                perPage: 1,
                fixedWidth: '70%',
                padding: { left: '1rem', right: '1rem' }
              },
              1024: {
                fixedWidth: '22.5rem',
                padding: { left: '1rem' }
              }
            }
          }}
          aria-label="My Favorite Images"
        >
          <div className="mb-5 flex items-center lg-max:container-fluid lg:mb-7">
            <div className="flex-grow">
              {data?.title && (
                <h3 className="text-h3 lg-max:!text-h3-mobile">
                  {data?.title ?? 'Related Courses'}
                </h3>
              )}
              {data?.subTitle && (
                <p className="mt-1.5 max-w-[30rem] text-grey-dark lg-max:hidden">
                  {data?.subTitle ?? ''}
                </p>
              )}
            </div>

            <div className="flex flex-shrink-0 items-center gap-2.5 lg:gap-4">
              <div className="splide__arrows flex items-center gap-2.5 lg:gap-4">
                <button className="splide__arrow splide__arrow--prev !btn--nav !relative !left-auto !translate-y-0">
                  <SvgIcon name="caret-right" />
                </button>
                <button className="splide__arrow splide__arrow--next !btn--nav !relative !right-auto !translate-y-0">
                  <SvgIcon name="caret-right" />
                </button>
              </div>

              {data?.showViewAll && (
                <a
                  role="button"
                  className="btn btn--accent flex items-center gap-2 lg-max:hidden"
                  href={
                    data?.collectionHandle
                      ? `${window.location.origin}/collections/${data?.collectionHandle}`
                      : '#'
                  }
                >
                  Browse All
                  <svg
                    className="icon-arrow rotate-180 text-inherit"
                    width="16"
                    height="9"
                    aria-hidden="true"
                    strokeWidth="1"
                  >
                    <use href="#icon-arrow"></use>
                  </svg>
                </a>
              )}
            </div>
          </div>

          <SplideTrack>
            {products &&
              products.map((product) => (
                <SplideSlide key={useObjectId ? product.objectID : product.id}>
                  <CourseCard
                    className={`h-full`}
                    product={product}
                    display_vertical={true}
                  />
                </SplideSlide>
              ))}
          </SplideTrack>
        </Splide>
      )}
    </div>
  );
};

HorizontalProductWrapper.propTypes = {
  carouselRef: PropTypes.any,
  collectionHandle: PropTypes.string,
  products: PropTypes.any,
  useObjectId: PropTypes.bool,
  data: PropTypes.shape({
    title: PropTypes.string,
    subTitle: PropTypes.string,
    showViewAll: PropTypes.bool,
    twoColumns: PropTypes.bool,
    collectionUrl: PropTypes.string,
    collectionHandle: PropTypes.string
  })
};
export default HorizontalProductWrapper;

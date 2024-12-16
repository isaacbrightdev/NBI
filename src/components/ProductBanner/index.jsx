import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { createPortal } from 'react-dom';
import ProductBannerCategories from '@/components/ProductBanner/ProductBannerCategories';
import ProductBannerInfoBlock from '@/components/ProductBanner/ProductBannerInfoBlock';
import ProductBannerLinks from '@/components/ProductBanner/ProductBannerLinks';
import ProductBannerReviews from '@/components/ProductBanner/ProductBannerReviews';
import ProductBannerTitleDesc from '@/components/ProductBanner/ProductBannerTitleDesc';
import useMediaImage from '@/hooks/useMediaImage';

const ProductBanner = ({ data }) => {
  const bannerEl = document.querySelector('#product-banner');
  const { url: bannerImageUrl } = useMediaImage(
    data?.metafields?.custom?.['banner-image']
  );
  const backgroundStyle = useMemo(() => {
    if (bannerImageUrl) {
      return { backgroundImage: `url(${bannerImageUrl})` };
    }
  }, [bannerImageUrl]);

  if (!data) return;
  return (
    bannerEl &&
    createPortal(
      <div className="relative min-h-[543px] w-full lg:min-h-[404px]">
        {/* TODO: Add dynamic image? */}
        <div
          className="absolute inset-0 z-0 w-full bg-accent-light bg-cover bg-center"
          style={backgroundStyle}
        />
        <div className="container xl:gx-xl">
          <div className="relative z-10 flex w-full flex-col justify-start">
            <div className="relative flex flex-row items-center justify-between py-10">
              <ProductBannerCategories />
              <div className="hidden lg:block">
                <ProductBannerReviews svgWidth={25} />
              </div>
              <ProductBannerLinks title={data.title} />
            </div>
            <div className="block lg:hidden">
              <ProductBannerReviews svgWidth={25} />
            </div>
            <ProductBannerTitleDesc
              title={data.title}
              description={data.description}
            />
            <ProductBannerInfoBlock />
          </div>
        </div>
      </div>,
      bannerEl
    )
  );
};

ProductBanner.propTypes = {
  data: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string
  })
};

export default ProductBanner;

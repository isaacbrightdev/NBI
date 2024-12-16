import { parseMetafield } from '@shopify/hydrogen-react';
import log from 'loglevel';
import PropTypes from 'prop-types';
import { useMemo } from 'react';
import Badge from '@/components/Badge';
import Link from '@/components/Link';
import useFormattedHours from '@/hooks/useFormattedHours';
import useMediaImage from '@/hooks/useMediaImage';
import useSettings from '@/hooks/useSettings';
import parseBadges from '@/utils/parseBadges';
import CreditsButton from './CreditsButton';
import ProductBannerReviews from './ProductBanner/ProductBannerReviews';
import SvgIcon from './SvgIcon';

const ProductSeriesItem = ({ item }) => {
  const productData = useMemo(() => {
    return { ...item };
  }, [item]);

  const hoursMetafield = productData.metafields.find(
    (metafield) => metafield?.key === 'hours'
  );
  const hoursFormatted = useFormattedHours(hoursMetafield?.value);

  const tags = productData?.tags;
  const badges = parseBadges(tags);
  const { course_block_placeholder_image } = useSettings();
  const placeholderImage = useMediaImage(course_block_placeholder_image);

  const imgSrc = useMemo(() => {
    try {
      return productData?.image && productData?.image?.edges?.length > 0
        ? productData?.image?.edges[0].node.url
        : placeholderImage.url;
    } catch (error) {
      log.error(error);
      return placeholderImage.url;
    }
  }, [productData, placeholderImage]);

  if (!item || !item.id) return null;

  // Format metafields for CreditsButton
  productData.meta = productData.metafields
    .filter((field) => field !== null)
    .reduce((parsedMetafields, currentMetafield) => {
      const { namespace, key, parsedValue } = parseMetafield(currentMetafield);
      if (!parsedMetafields[namespace]) parsedMetafields[namespace] = {};
      parsedMetafields[namespace][key] = parsedValue;
      return parsedMetafields;
    }, {});

  return (
    <div className="flex flex-col rounded-[10px] border border-grey p-5 lg:mb-4 lg:flex-row">
      <div className="mb-2 mr-4 w-full lg:w-[185px]">
        <img loading="lazy" src={imgSrc} alt={item.title} className="rounded-[10px]" />
      </div>
      <div className="flex flex-grow basis-0 flex-col">
        {badges.length > 0 && (
          <div className="flex flex-row items-center justify-start">
            {badges.map((badge) => {
              return (
                <Badge key={badge.key} color={badge.color} icon={badge.icon}>
                  {badge.text}
                </Badge>
              );
            })}
          </div>
        )}
        <div className="pt-1 lg:mb-[10px]">
          <ProductBannerReviews svgWidth={15} />
        </div>
        <Link to={`/products/${productData.handle}`} title={productData.title}>
          <h4 className="mb-[5px] max-w-[400px] font-medium leading-[130%] text-secondary">
            {productData.title}
          </h4>
        </Link>
        {productData?.metafields?.map((metafield) => {
          if (metafield?.key === 'why-you-need') {
            return (
              <div
                key={metafield.key}
                className="hidden pb-[18px] text-sm-body lg:block"
                dangerouslySetInnerHTML={{ __html: metafield.value }}
              />
            );
          }
        })}
        <div className="flex flex-col lg:flex-row">
          <CreditsButton
            className={'ml-0 flex border-none pl-0 lg:mr-1'}
            plusSvgClassName={'hidden'}
            creditSvgWidth={15}
            product={productData}
          />
          <div className={`mb-[14px] flex items-center lg:mb-0 lg:mr-[15px]`}>
            <SvgIcon
              className={`mr-2`}
              name="platform"
              width={11}
              height={11}
            />
            <span className="text-fine-print">{productData.productType}</span>
          </div>
          {hoursFormatted && (
            <div className={`hidden items-center lg:mb-0 lg:mr-[15px] lg:flex`}>
              <SvgIcon className={`mr-1`} name="time" width={11} height={11} />
              <span className="text-fine-print">{hoursFormatted}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

ProductSeriesItem.propTypes = {
  item: PropTypes.object.isRequired
};

export default ProductSeriesItem;

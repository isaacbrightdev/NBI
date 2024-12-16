import { useProduct } from '@shopify/hydrogen-react';
import propTypes from 'prop-types';
import Badge from '@/components/Badge';
import parseBadges from '@/utils/parseBadges';

const ProductBannerCategories = () => {
  const { product } = useProduct();
  // tag format: badge-<color>-<icon>:<badgeText>
  const badges = parseBadges(product);

  if (!badges.length) return null;

  return (
    <div className="flex flex-row items-center justify-start">
      {badges.map((badge, i) => {
        if (!badge.text) return null;
        return (
          <Badge
            key={`${badge.text}-${i}`}
            color={badge.color}
            icon={badge.icon}
          >
            {badge.text}
          </Badge>
        );
      })}
    </div>
  );
};

propTypes.ProductBannerCategories = {
  product: propTypes.any
};

export default ProductBannerCategories;

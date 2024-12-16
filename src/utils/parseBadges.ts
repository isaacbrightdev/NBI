// Example badges
// badge-red:exp[2024-11-18]:New!
// badge-blue:Best Seller
// badge-dark-blue-full-sun:eLearning
// badge-green-location-dot:Live In-Person
// badge-grey:Accounting
import { Product } from '@shopify/hydrogen-react/storefront-api-types';

const parseBadges = (tags: string[]) => {
  const badges = tags
    .filter((tag) => tag.startsWith('badge-'))
    .map((badge) => badge.replace('badge-', ''));
  return badges.map((badge, index) => {
    const [colorIcon, textOrExp, textOrNull] = badge.split(':');
    let text = textOrExp;
    if (textOrExp && textOrNull && textOrExp.startsWith('exp[')) {
      const [year, month, date] = textOrExp
        .substring('exp['.length, textOrExp.length - 1)
        .split('-');
      const expDate = new Date(
        Number.parseInt(year),
        Number.parseInt(month) - 1,
        Number.parseInt(date)
      );
      const today = new Date(new Date().toDateString());
      if (expDate < today) {
        return null;
      } else {
        text = textOrNull;
      }
    }

    if (colorIcon.startsWith('dark-blue')) {
      return {
        index,
        color: 'dark-blue',
        icon: colorIcon.substring('dark-blue-'.length),
        text
      };
    } else {
      const [color, icon] = colorIcon.split('-');
      return { index, color, icon, text };
    }
  });
};

const parseAllBadges = (product: Product) => {
  if (!product || !product.tags) return [];

  return parseBadges([...product.tags]).filter((tag) => tag);
};

export default parseAllBadges;

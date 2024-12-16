import log from 'loglevel';
import PropTypes from 'prop-types';
import { useMemo } from 'react';
import Badge from '@/components/Badge';
import Link from '@/components/Link';
import SvgIcon from '@/components/SvgIcon';
import useFormattedHours from '@/hooks/useFormattedHours';
import useMediaImage from '@/hooks/useMediaImage';
import useSettings from '@/hooks/useSettings';
import parseBadges from '@/utils/parseBadges';
import CreditsPill from './CreditsPill';
import RatingStars from './RatingStars';

const CourseCardTags = ({ tag }) => {
  return (
    <Badge color={tag.color} icon={tag.icon}>
      {tag.text}
    </Badge>
  );
};

const mapProductTagsValues = (obj) =>
  Object.keys(obj).map((key) =>
    Array.isArray(obj[key])
      ? obj[key].map((aValue) => `${key}:${aValue}`)
      : `${key}:${obj[key]}`
  );
// eslint-disable-next-line no-unused-vars
const CourseCard = ({
  product,
  display_vertical = false,
  className,
  ...rest
}) => {
  const classes = {
    image: [
      'absolute',
      'w-full',
      'h-full',
      'left-0',
      'top-0',
      'object-cover',
      'object-center',
      'overflow-hidden',
      'rounded-[0.625rem]',
      'select-none'
    ],
    card: [
      'course-card',
      'h-full',
      'group',
      'relative',
      'flex',
      'flex-col',
      'min-w-0',
      'bg-white',
      'bg-clip-border',
      'border',
      'rounded-[0.625rem]',
      'border-solid',
      'border-grey',
      'break-words',
      'items-stretch',
      'p-5',
      'mb-4',
      'md:mb-0'
    ]
  };
  const hasMetaRating = !!product.meta?.course?.rating;
  // eslint-disable-next-line react/prop-types
  const hasRating = !!product?.rating;
  let rating = hasMetaRating && JSON.parse(product.meta.course.rating);
  if (!rating && hasRating) {
    // eslint-disable-next-line react/prop-types
    rating = product?.rating?.value;
    if (typeof rating === 'string') {
      rating = JSON.parse(rating ? rating : null);
    }
  }

  let productTags = [];

  if (product.named_tags) {
    productTags = mapProductTagsValues(product.named_tags).flat();
  } else if (product.tags) {
    productTags = [...product.tags];
  }

  const badges = parseBadges({ ...product, tags: productTags });

  const { course_block_placeholder_image } = useSettings();
  const placeholderImage = useMediaImage(course_block_placeholder_image);

  const isLiveInPerson = productTags.some(
    (tag) => tag.toLowerCase() === 'format:live in-person'
  );
  const isLive =
    isLiveInPerson ||
    productTags.some((tag) => tag.toLowerCase() === 'format:live online');

  const deliveryText = useMemo(() => {
    let text =
      productTags
        .find((tag) => tag.startsWith('delivery-text'))
        ?.substring('delivery-text:'.length) ||
      product?.product_type ||
      '';

    text = decodeURIComponent(text.replace('encoded:', ''));

    if (isLiveInPerson) {
      text = text.replaceAll('+', ' ');
    }
    return text;
  }, [productTags]);

  const eventDateFormattedString = useMemo(() => {
    try {
      if (!product?.meta?.course) return null;
      if ('event-date-timestamp' in product.meta.course == false) return null;

      const eventDate = product.meta?.course['event-date-timestamp'];
      const eventDateFormatted = eventDate ? new Date(eventDate * 1000) : null;
      const eventDateOptions = {
        month: 'short',
        day: 'numeric',
        hour12: true,
        hour: 'numeric',
        minute: 'numeric' // Added minute option
      };
      return eventDateFormatted
        ? eventDateFormatted.toLocaleDateString('en-US', eventDateOptions)
        : null;
    } catch (error) {
      log.error('Error computing eventDate string: CourseCard.jsx');
      log.error(error);
      return null;
    }
  }, [product]);

  const descriptionSubtext =
    product?.meta?.course && 'description-subtext' in product.meta.course
      ? product?.meta?.course['description-subtext']
      : '';

  const hoursFormatted = useFormattedHours(product?.meta?.course?.hours);

  if (!product) return null;

  return (
    <div {...rest} className={[...classes.card, className].join(' ')}>
      <div
        className={`max-w-full overflow-hidden xl-max:row xl:flex ${
          display_vertical
            ? 'flex-[1_0_0%] !flex-col'
            : 'gap-5 xl-max:flex-[1_0_0%]'
        }`}
      >
        <div
          className={`col-12 xl:flex-shrink-0 ${
            display_vertical ? 'mb-5' : 'xl:col-4'
          }`}
        >
          <div className="course-card-image relative aspect-7/4 h-full w-full xl:aspect-7/5">
            <img
              alt={product.title}
              className={classes.image.join(' ')}
              src={
                product.image ||
                product?.featuredImage?.url ||
                placeholderImage?.url
              }
              loading="lazy"
            />
          </div>
        </div>
        <div className="flex flex-col justify-between leading-snug xl-max:col-12 xl:flex-grow">
          {badges.length > 0 && (
            <div className="mb-4 flex flex-wrap items-center gap-0.5 gap-y-2 leading-snug">
              {badges.map((tag) => (
                <CourseCardTags key={tag.index} tag={tag} />
              ))}
            </div>
          )}

          {rating && (
            <div className="mb-2.5 flex gap-0.5 leading-snug">
              <RatingStars rating={rating} />
            </div>
          )}

          <div className="flex-grow xl-max:mb-5">
            {product.title && (
              <h4
                className={[
                  'course-card-title',
                  'text-h4-mobile',
                  'text-secondary',
                  'mb-1',
                  'line-clamp-2',
                  'transition-all',
                  'focus-within:underline',
                  'group-focus-within:underline',
                  'group-hover:underline',
                  ...(display_vertical ? [] : ['xl:text-h4'])
                ].join(' ')}
              >
                {product.title}
              </h4>
            )}
            {!display_vertical && product.body_html_safe && (
              <p
                className="course-card-sub-title line-clamp-2 text-sm-body leading-snug text-primary"
                dangerouslySetInnerHTML={{ __html: product.body_html_safe }}
              ></p>
            )}
          </div>
          {descriptionSubtext && (
            <div className="my-2 text-sm-body italic">{descriptionSubtext}</div>
          )}
          <div className="flex flex-wrap items-center gap-2.5">
            <CreditsPill
              display_vertical={display_vertical}
              product={product}
            />

            {deliveryText && (
              <span className="flex items-center gap-[0.3125rem] text-fine-print font-medium leading-snug">
                <SvgIcon
                  height={15}
                  width={15}
                  className={isLiveInPerson ? 'icon-location' : 'icon-platform'}
                  name={isLiveInPerson ? 'location' : 'platform'}
                />
                {deliveryText}
              </span>
            )}

            {!display_vertical && !isLive && hoursFormatted && (
              <span className="hidden items-center gap-[0.3125rem] text-fine-print font-medium leading-snug xl:flex">
                <SvgIcon
                  height={15}
                  width={15}
                  className="icon-time"
                  name="time"
                />
                {hoursFormatted}
              </span>
            )}

            {!display_vertical && isLive && eventDateFormattedString && (
              <span className="flex items-center gap-[0.3125rem] text-fine-print font-medium leading-snug">
                <SvgIcon
                  className={`icon-calendar mr-1`}
                  name="calendar"
                  width={18}
                  height={18}
                />
                <span>{eventDateFormattedString}</span>
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-col justify-end leading-snug xl-max:col-12 xl:col-auto xl:flex-shrink-0 xl:justify-center">
          <Link
            className={[
              'text-primary',
              'stretched-link',
              'self-end',
              'inline-block',
              'text-base',
              'font-normal',
              'leading-snug',
              'text-center',
              'no-underline',
              'align-middle',
              'cursor-pointer select-none',
              ...(display_vertical
                ? []
                : [
                    'xl:w-full',
                    'border',
                    'bg-white',
                    'px-4',
                    'py-2',
                    'rounded-full',
                    'transition-all',
                    'border-solid',
                    'border-primary',
                    'whitespace-nowrap',
                    'focus-within:text-secondary',
                    'focus:shadow-[0_1px_5px_rgba(9,34,84,0.2)]',
                    'focus-within:shadow-[0_1px_5px_rgba(9,34,84,0.2)]',
                    'focus-within:border-secondary',
                    'focus-within:ring-0',
                    'focus:ring-0',
                    'focus:outline-none',
                    'group-hover:text-secondary',
                    'group-hover:shadow-[0_1px_5px_rgba(9,34,84,0.2)]',
                    'group-hover:border-secondary'
                  ])
            ].join(' ')}
            to={`/products/${product.handle}`}
          >
            {!display_vertical && (
              <>
                Details
                <SvgIcon
                  className="inline-block select-none"
                  width={15}
                  height={15}
                  name="caret-right"
                />
              </>
            )}
          </Link>
        </div>
      </div>
    </div>
  );
};

CourseCardTags.propTypes = {
  tag: PropTypes.any
};

CourseCard.propTypes = {
  className: PropTypes.string,
  display_vertical: PropTypes.bool,
  product: PropTypes.shape({
    objectID: PropTypes.string,
    title: PropTypes.string,
    image: PropTypes.string,
    featuredImage: PropTypes.shape({
      id: PropTypes.string,
      url: PropTypes.string
    }),
    body_html_safe: PropTypes.string,
    handle: PropTypes.string,
    id: PropTypes.any,
    product_type: PropTypes.string,
    published_at: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    named_tags: PropTypes.any,
    meta: PropTypes.shape({
      course: PropTypes.shape({
        rating: PropTypes.string,
        hours: PropTypes.string,
        'event-date-timestamp': PropTypes.any,
        'description-subtext': PropTypes.string
      })
    }),
    variants: PropTypes.shape({
      edges: PropTypes.arrayOf(
        PropTypes.shape({
          node: PropTypes.shape({
            id: PropTypes.string,
            title: PropTypes.string,
            availableForSale: PropTypes.bool,
            image: PropTypes.any,
            selectedOptions: PropTypes.arrayOf(
              PropTypes.shape({
                name: PropTypes.string,
                value: PropTypes.string
              })
            ),
            price: PropTypes.shape({
              amount: PropTypes.string,
              currencyCode: PropTypes.string
            }),
            compareAtPrice: PropTypes.any
          })
        })
      )
    })
  })
};

export default CourseCard;

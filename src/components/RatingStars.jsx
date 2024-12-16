import PropTypes from 'prop-types';
import SvgIcon from '@/components/SvgIcon';

const RatingStars = ({ rating, svgWidth = 15 }) => {
  return (
    <>
      {[...Array(parseInt(rating.scale_max))].map((_, index) => {
        let aValue = Number(rating.value);
        const aIndex = index + 1;
        let aIconName = '';
        if (aIndex <= aValue) {
          aIconName = 'star-fill';
        } else if ((aIndex - 1) / aValue < 1) {
          aIconName = 'star-half';
        } else {
          aIconName = 'star-empty';
        }

        return (
          <SvgIcon
            key={index}
            width={svgWidth}
            height={svgWidth}
            className={`icon-star icon-${aIconName}`}
            name={aIconName}
          />
        );
      })}
      <span className="ml-2.5 text-fine-print leading-snug">
        {rating.value}
      </span>
    </>
  );
};

RatingStars.propTypes = {
  rating: PropTypes.shape({
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    scale_max: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  }),
  svgWidth: PropTypes.number
};

export default RatingStars;

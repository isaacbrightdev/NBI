import PropTypes from 'prop-types';

const SvgIcon = ({
  name,
  prefix = 'icon',
  width = 20,
  height = 20,
  strokeWidth,
  ...rest
}) => {
  const symbolId = `#${prefix}-${name}`;

  return (
    <svg
      width={width}
      height={height}
      aria-hidden="true"
      strokeWidth={strokeWidth}
      {...rest}
    >
      <use href={symbolId} />
    </svg>
  );
};

SvgIcon.propTypes = {
  color: PropTypes.string,
  prefix: PropTypes.string,
  name: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  className: PropTypes.string,
  strokeWidth: PropTypes.any
};

export default SvgIcon;

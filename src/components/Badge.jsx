import PropTypes from 'prop-types';
import SvgIcon from '@/components/SvgIcon';

const Badge = ({ color, icon, children }) => {
  const styles = {
    grey: 'tag--grey',
    blue: 'tag--blue',
    red: 'tag--red',
    purple: 'tag--purple',
    yellow: 'tag--yellow',
    'dark-blue': 'tag--dark-blue',
    green: 'tag--green',
    orange: 'tag--orange'
  };

  return (
    <span className={`tag mr-2 w-fit ${styles[color]}`}>
      {icon && <SvgIcon width={15} height={15} strokeWidth={1} name={icon} />}
      {children}
    </span>
  );
};

Badge.propTypes = {
  color: PropTypes.any,
  icon: PropTypes.any,
  children: PropTypes.any
};

export default Badge;

import PropTypes from 'prop-types';

const ShopLink = ({ to, children, ...rest }) => (
  <a href={to} {...rest}>
    {children}
  </a>
);

ShopLink.propTypes = {
  to: PropTypes.string,
  children: PropTypes.any
};

export default ShopLink;

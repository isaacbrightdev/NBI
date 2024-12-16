import PropTypes from 'prop-types';

const Account = ({ isCustomerLoggedIn, ...props }) => (
  <>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 26 26"
      {...props}
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M13.223 10.098a4.018 4.018 0 1 0 0-8.036 4.018 4.018 0 0 0 0 8.036ZM21.258 23.491H5.187v-1.786a8.036 8.036 0 0 1 16.071 0v1.786Z"
      />
    </svg>
    {!isCustomerLoggedIn && ' Log In'}
  </>
);

Account.propTypes = {
  isCustomerLoggedIn: PropTypes.bool,
};

export default Account;

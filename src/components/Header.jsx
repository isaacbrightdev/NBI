import PropTypes from 'prop-types';
import Nav from '@/components/Nav';

const Header = ({ data, enableShortNav }) => {
  return (
    <Nav
      main={data.mainMenu}
      account={data.accountMenu}
      firm={data.firmAdmin}
      support={data.supportMenu}
      settings={data.settings}
      isShortNav={enableShortNav}
    />
  );
};

Header.propTypes = {
  data: PropTypes.shape({
    announcementBar: PropTypes.any,
    mainMenu: PropTypes.any,
    accountMenu: PropTypes.any,
    firmAdmin: PropTypes.any,
    supportMenu: PropTypes.any,
    settings: PropTypes.shape({
      logo: PropTypes.string,
      logo_mobile: PropTypes.string
    })
  }),
  enableShortNav: PropTypes.bool
};

export default Header;

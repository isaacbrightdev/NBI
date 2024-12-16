import PropTypes from 'prop-types';
import Link from '@/components/Link';

const FooterNav = ({ menu, displayHorizontally = false }) => {
  if (!menu?.items) return null;

  if (displayHorizontally) {
    return (
      <nav className="footer__nav">
        <ul className="flex flex-wrap justify-center">
          {menu.items.map((item) => {
            return (
              <li key={item.id} className="footer__nav-item py-2">
                <Link
                  className="footer__nav-item-link-bottom px-5 text-fine-print font-normal text-white"
                  to={item.url}
                  target={item.url.includes('terms-of-use') ? '_blank' : ''}
                >
                  {item.title}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    );
  } else {
    return (
      <nav className="footer__nav">
        {menu.title ? (
          <h4 className="mb-3 text-h4-mobile text-secondary lg:text-h4">
            {menu.title}
          </h4>
        ) : null}
        <ul>
          {menu.items.map((item) => {
            return (
              <li key={item.id} className="footer__nav-item py-2">
                <Link className="py-1.5 font-normal text-white" to={item.url}>
                  {item.title}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    );
  }
};

FooterNav.propTypes = {
  menu: PropTypes.any,
  title: PropTypes.bool,
  displayHorizontally: PropTypes.bool
};

export default FooterNav;

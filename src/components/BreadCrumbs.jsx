import PropTypes from 'prop-types';
import Link from '@/components/Link';
import SvgIcon from '@/components/SvgIcon';

const BreadCrumbs = ({ links }) => {
  return (
    <div className="breadcrumbs flex items-center">
      {links.map((link, index) => (
        <div key={link.url} className="flex items-center">
          <Link to={link.url} className="text-sm-body">
            {link.title}
          </Link>
          {index != links.length - 1 && (
            <SvgIcon
              className="icon-caret icon-caret-right mx-2"
              name="caret-right"
              width={10}
              height={10}
            />
          )}
        </div>
      ))}
    </div>
  );
};

BreadCrumbs.propTypes = {
  links: PropTypes.any
};

export default BreadCrumbs;

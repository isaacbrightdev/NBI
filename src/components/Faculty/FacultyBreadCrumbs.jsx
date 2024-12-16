import PropTypes from 'prop-types';
import Link from '../Link';
import SvgIcon from '../SvgIcon';

const FacultyBreadCrumbs = ({ links }) => {
  if (!links) return <></>;

  return (
    <div className="flex justify-start text-left">
      {links.map((link, index) => {
        const linkClasses =
          index === links.length - 1
            ? 'text-sm-body text-primary'
            : 'text-sm-body text-secondary underline';
        return (
          <div key={link.url} className="flex items-center">
            <Link to={link.url} className={linkClasses}>
              {link.title}
            </Link>
            {index != links.length - 1 && (
              <SvgIcon
                className="icon-caret icon-caret-right mx-[10px]"
                name="caret-right"
                width={10}
                height={10}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

FacultyBreadCrumbs.propTypes = {
  links: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      url: PropTypes.string,
      map: PropTypes.func,
      length: PropTypes.number
    })
  )
};

export default FacultyBreadCrumbs;

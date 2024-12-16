import PropTypes from 'prop-types';
import { useEffect, useRef } from 'react';

export const MobileNavItem = ({
  linkTitle,
  link,
  navIsOpen,
  setNavOpen,
  setCurrentNav,
  isActive,
  key
}) => {
  const currentLink = useRef('');

  useEffect(() => {
    if (currentLink.current === '' || navIsOpen) return;

    const targetAnchorElement = document.getElementById(link.replace('#', ''));
    // overview section has top padding built-in to its wrapper, the rest do not
    const topPad = link != '#product-overview' ? 48 : 0;
    if (targetAnchorElement) {
      // we do one instant short scroll to trigger any changes to the site header for sticky states, etc
      // this allows us to read correct heights of all site header elements for the subsequent scrollTo calcs
      window.scrollTo(0, 100);
      window.scrollTo(
        0,
        window.scrollY +
          targetAnchorElement.getBoundingClientRect().top -
          (document.querySelector('#main-header').getBoundingClientRect()
            .bottom +
            document.querySelector('#product-nav').getBoundingClientRect()
              .height +
            topPad)
      );
      setCurrentNav(linkTitle);
    }
    currentLink.current = '';
  }, [navIsOpen]);

  const handleAnchorClick = (element) => {
    element.preventDefault();
    currentLink.current = link;
    setNavOpen(false);
  };

  const linkClasses = [
    'relative',
    'text-[20px]',
    'font-medium',
    'capitalize',
    'leading-[130%]',
    'border-b-4'
  ];

  return (
    <div className="py-4" key={key}>
      <a
        className={
          isActive
            ? linkClasses.join(' ') + ' border-accent'
            : linkClasses.join(' ') + ' border-transparent'
        }
        href={link}
        title={linkTitle}
        onClick={(e) => handleAnchorClick(e)}
      >
        {linkTitle}
      </a>
    </div>
  );
};

MobileNavItem.propTypes = {
  linkTitle: PropTypes.string,
  link: PropTypes.string,
  setNavOpen: PropTypes.func,
  navIsOpen: PropTypes.bool,
  setCurrentNav: PropTypes.func,
  isActive: PropTypes.bool,
  key: PropTypes.string
};

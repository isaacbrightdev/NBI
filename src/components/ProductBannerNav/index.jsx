import PropTypes from 'prop-types';
import { useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { throttle } from 'throttle-debounce';
import DesktopBannerNav from './DesktopBannerNav';
import MobileBannerNav from './MobileBannerNav';

const ProductBannerNav = ({ currentNav, setCurrentNav }) => {
  const navEl = document.querySelector('#product-nav');
  navEl.parentElement.classList.add('sticky');

  const calculatePositions = useCallback(
    throttle(
      50,
      () => {
        const mainEl = document.querySelector('#main-header');
        const mainTopPosition = mainEl.getBoundingClientRect().bottom;
        navEl.parentElement.style.top = mainTopPosition + 'px';
      },
      { noLeading: true }
    ),
    [navEl, document]
  );

  useEffect(() => {
    calculatePositions();

    window.addEventListener('scroll', calculatePositions);
    window.addEventListener('resize', calculatePositions);

    return () => {
      window.removeEventListener('scroll', calculatePositions);
      window.removeEventListener('resize', calculatePositions);
    };
  }, []);

  return (
    navEl &&
    createPortal(
      <div className="flex w-full items-center border-b border-grey bg-white xl:gx-xl">
        <div className="container-fluid gx-sm max-w-screen-2xl xl:gx-xl">
          <div className="relative flex flex-row items-center justify-between">
            <MobileBannerNav
              currentNav={currentNav}
              setCurrentNav={setCurrentNav}
            />
            <DesktopBannerNav />
          </div>
        </div>
      </div>,
      navEl
    )
  );
};

ProductBannerNav.propTypes = {
  currentNav: PropTypes.string,
  setCurrentNav: PropTypes.func
};

export default ProductBannerNav;

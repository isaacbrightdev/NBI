import { useProduct } from '@shopify/hydrogen-react';
import PropTypes from 'prop-types';
import useProductState from '@/hooks/useProductState';

const DesktopBannerNav = () => {
  const { product } = useProduct();
  const { hasLiveInPerson } = useProductState(product);
  const { metafields } = product;
  const { agenda } = metafields;
  const { details } = agenda ? agenda : {};

  const DesktopNavItem = ({ href, title, children }) => (
    <div className="border-b-4 border-transparent py-4 transition-colors duration-200 hover:border-accent active:border-accent">
      <a
        className="relative px-[10px] text-sm-body font-medium uppercase leading-[130%] tracking-[1.4px]"
        href={href}
        title={title}
        onClick={(e) => {
          e.preventDefault();
          const el = document.getElementById(href.replace('#', ''));
          // overview section has top padding built-in to its wrapper, the rest do not
          const topPad = href != '#product-overview' ? 48 : 0;
          if (el) {
            // we do one instant short scroll to trigger any changes to the site header for sticky states, etc
            // this allows us to read correct heights of all site header elements for the subsequent scrollTo calcs
            window.scrollTo(0, 100);
            window.scrollTo(
              0,
              window.scrollY +
                el.getBoundingClientRect().top -
                (document.querySelector('#main-header').getBoundingClientRect()
                  .bottom +
                  document.querySelector('#product-nav').getBoundingClientRect()
                    .height +
                  topPad)
            );
          }
        }}
      >
        {children}
      </a>
    </div>
  );

  DesktopNavItem.propTypes = {
    href: PropTypes.string,
    title: PropTypes.string,
    children: PropTypes.string
  };

  return (
    <div className="relative hidden items-center justify-between lg:mr-5 lg:flex lg:w-3/5">
      <DesktopNavItem href="#product-overview" title="overview">
        Overview
      </DesktopNavItem>
      {hasLiveInPerson && (
        <DesktopNavItem href="#product-location" title="location">
          Location
        </DesktopNavItem>
      )}
      <DesktopNavItem href="#product-credit-details" title="credit details">
        Credit Details
      </DesktopNavItem>
      {details ? (
        <DesktopNavItem href="#product-agenda" title="agenda">
          Agenda
        </DesktopNavItem>
      ) : null}
      <DesktopNavItem href="#product-speakers" title="speaker">
        Speaker
      </DesktopNavItem>
      <DesktopNavItem href="#product-faqs" title="faqs">
        FAQS
      </DesktopNavItem>
    </div>
  );
};

export default DesktopBannerNav;

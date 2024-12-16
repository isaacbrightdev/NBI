import { Dialog } from '@headlessui/react';
import { AddToCartButton, useProduct } from '@shopify/hydrogen-react';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import useProductState from '@/hooks/useProductState';
import useSettings from '@/hooks/useSettings';
import SvgIcon from '../SvgIcon';
import { MobileNavItem } from './MobileBannerNavItem';
import {
  SUBSCRIPTION_SKU_SUFFIXES,
  CUSTOMER_SUBSCRIPTION_STATES
} from '@/utils/constants';
import useCustomer from '@/hooks/useCustomer';


const { ALL_INCLUSIVE_SUBSCRIBER, ONDEMAND_SUBSCRIBER } =
  CUSTOMER_SUBSCRIPTION_STATES;

const MobileBannerNav = ({ currentNav, setCurrentNav }) => {
  const { selectedVariant, product } = useProduct();
  const { hasLiveInPerson } = useProductState(product);
  const { dispatch } = useSettings();
  const [navIsOpen, setNavOpen] = useState(false);
  const { metafields } = product;
  const { agenda } = metafields;
  const { details } = agenda ? agenda : {};
  const customer = useCustomer();
  const [isSameType, setIsSameType] = useState(false);

  // Define an array of navigation items
  const navItems = [
    { id: 'product-overview', title: 'Overview' },
    { id: 'product-location', title: 'Location' },
    { id: 'product-credit-details', title: 'Credit Details' },
    { id: 'product-agenda', title: 'Agenda Details' },
    { id: 'product-speakers', title: 'Speakers' },
    { id: 'product-faqs', title: 'FAQS' },
    { id: 'related-courses', title: 'Related Courses' }
  ].filter((item) => {
    if (item.id === 'product-agenda') {
      return details ? item : null;
    }

    if (item.id === 'product-location') {
      return hasLiveInPerson ? item : null;
    }

    return item;
  });

  const elementExists = (id) => document.getElementById(id) !== null;

  const navItemParams = { navIsOpen, setNavOpen, setCurrentNav };

  useEffect(() => {
    if( customer && product ){
      const isInclusive = product?.tags?.some(value => /\]validinsub:allinclusive/.test(value)) ?? false;
      const isOndemand = product?.tags?.some(value => /\]validinsub:ondemand/.test(value)) ?? false;

      const customerSubType = customer?.metafields?.subscriptions?.details['sub-type'] ?? '';
  
      if( isOndemand && customerSubType.toLowerCase() == ONDEMAND_SUBSCRIBER.toLowerCase() ){
        setIsSameType(true);
      }
      
      if( isInclusive && customerSubType.toLowerCase() == ALL_INCLUSIVE_SUBSCRIBER.toLowerCase() ){
        setIsSameType(true);
      }
    }
  }, [])
  

  return (
    <div className="flex w-full items-center justify-between lg:hidden">
      <div className="flex flex-row items-center py-[9px] pr-[20px]">
        <button
          className="text-body-sm mr-1.5 flex flex-row items-center py-[15px] font-medium uppercase leading-[130%] tracking-[1.4px] text-primary lg:hidden"
          onClick={() => setNavOpen(true)}
          aria-label="open dialog"
        >
          {currentNav}
          <SvgIcon name="caret-down" width={15} height={15} className="ml-2" />
        </button>
      </div>
      { !isSameType ? 
      <div className="flex flex-row items-center">
        <AddToCartButton
          selectedvariant={selectedVariant}
          className="btn btn--accent font-medium capitalize"
          onClick={() => {
            dispatch({
              type: 'SET_MODAL',
              data: { name: 'addToCart', state: true, product: selectedVariant }
            });
          }}
        >
          Get this course
        </AddToCartButton>
      </div>  : ''
      }
      {/* dialog dropdown open full viewport on mobile */}
      <Dialog as="nav" open={navIsOpen} onClose={() => setNavOpen(false)}>
        <Dialog.Overlay className="fixed inset-0 z-50 rounded-t-[20px] bg-white text-primary" />
        <Dialog.Panel className="fixed top-0 z-[60] flex w-full flex-col rounded-t-[20px]">
          <Dialog.Title className="border-b border-grey px-[30px] py-[15px]">
            <div className="flex flex-row items-center justify-between">
              <h4>Section</h4>
              <button onClick={() => setNavOpen(false)}>
                <SvgIcon name="close" width={20} height={20} />
              </button>
            </div>
          </Dialog.Title>
          <Dialog.Description as="div">
            <div className="flex min-h-screen flex-col items-center justify-center">
              {navItems.map((navItem) => {
                if (elementExists(navItem.id)) {
                  return MobileNavItem({
                    key: navItem.id,
                    linkTitle: navItem.title,
                    link: `#${navItem.id}`,
                    isActive: currentNav === navItem.title,
                    ...navItemParams
                  });
                }
                return null;
              })}
            </div>
          </Dialog.Description>
        </Dialog.Panel>
      </Dialog>
    </div>
  );
};

MobileBannerNav.propTypes = {
  currentNav: PropTypes.string,
  setCurrentNav: PropTypes.func
};

export default MobileBannerNav;

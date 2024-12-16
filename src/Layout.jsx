import loader from '@/loaders/layout';
import log from 'loglevel';
import { useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useInstantSearch } from 'react-instantsearch';
import { Outlet } from 'react-router-dom';
import useLocalStorage from 'use-local-storage';
import AnnouncementBar from '@/components/AnnouncementBar';
import HorizontalProductCarousel from '@/components/Carousels/HorizontalProductCarousel';
import RelatedProductCarousel from '@/components/Carousels/RelatedProductCarousel';
import Footer from '@/components/Footer';
import GlobalSections from '@/components/GlobalSections';
import Header from '@/components/Header';
import HorizontalProductDisplay from '@/components/HorizontalProductDisplay';
import HorizontalProductDisplayAlgolia from '@/components/HorizontalProductDisplayAlgolia';
import Modals from '@/components/Modals';
import HeroModuleFacultyAccounts from '@/components/Search/HeroModuleFacultyAccounts';
import NavSearchWrapper from '@/components/Search/NavSearchWrapper';
import Section from '@/components/Section';
import useMetaobjects from '@/hooks/useMetaobjects';
import { SettingsContext } from '@/hooks/useSettings';
import { MetaCourseCreditsAttributes } from '@/utils/searchClient';
import useCustomer from './hooks/useCustomer';

const MODALS = {
  addToCart: { state: false },
  credits: { state: false },
  states: { state: false },
  speaker: { state: false },
  addSubscription: { state: false }
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'LOAD_DATA': {
      return {
        ...state,
        ...action.data,
        settings: {
          ...action?.data?.settings,
          modals: { ...MODALS }
        }
      };
    }
    case 'UPDATE_LOAD_DATA': {
      return {
        ...state,
        ...action.data,
        settings: {
          ...state.settings,
          ...action?.data?.settings
        }
      };
    }
    case 'SET_MODAL': {
      return {
        ...state,
        settings: {
          ...state.settings,
          modals: {
            ...state.settings.modals,
            [action.data.name]: action.data
          }
        }
      };
    }
    case 'SET_JURISDICTION': {
      return {
        ...state,
        settings: {
          ...state.settings,
          jurisdiction: action.data
        }
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
};

const Layout = () => {
  const rootRef = useRef(null);
  const [store, dispatch] = useReducer(reducer, null);
  const [jurisdiction, setJurisdiction] = useLocalStorage(
    'jurisdictionKeys',
    []
  );
  const isJurisdictionSet = sessionStorage.getItem('isJurisdictionSet');

  const metaobjects = useMetaobjects('credit_data', 20);

  useEffect(() => {
    try {
      const data = metaobjects && metaobjects[0]?.fields[0]?.value
        ? JSON.parse(metaobjects[0]?.fields[0]?.value)
        : { specialties: [] };
      window.creditData = data?.specialties;
    } catch (error) {
      log.error(
        'Error parsing credit specialties setting from metaobject',
        error
      );
      window.creditData = [];
    }
  }, [metaobjects]);

  const customer = useCustomer();
  const customerJurisdictions = customer?.metafields?.creditJurisdictions || [];
  const { indexUiState, setIndexUiState } = useInstantSearch();
  const body = document.querySelector('body');
  const headerEl = document.querySelector('header#main-header');
  const templateName = body?.dataset?.template || '';
  const enableShortNav = headerEl.dataset.shortNav === 'true';
  const footerEl = document.querySelector('footer#main-footer');
  const sectionEls = Array.from(document.querySelectorAll('.meta-section'));
  const horizontalProductCarouselEls = Array.from(
    document.querySelectorAll('[data-horizontal-product-carousel]')
  );
  const relatedProductsCarouselEls = Array.from(
    document.querySelectorAll('[data-related-products-carousel]')
  );

  const horizontalProductDisplayEls = Array.from(
    document.querySelectorAll('[data-horizontal-product-display]')
  );

  const horizontalProductDisplayAlgoliaEls = Array.from(
    document.querySelectorAll('[data-horizontal-product-display-algolia]')
  );

  const announcementEl = document.querySelector('#announcement-bar');
  const heroModuleSearchEl = document.querySelector('#hero-module-search');
  const heroModuleFacultyAccountsEl = document.querySelector(
    '#hero-module-faculty_accounts'
  );
  const isAnnouncementBarEnabled = useMemo(
    () => store?.announcementBar?.enabled.toLowerCase() === 'true',
    [store]
  );

  const refinementListJurisdictions = useMemo(() => {
    return (
      (indexUiState?.refinementList &&
        indexUiState?.refinementList[MetaCourseCreditsAttributes.key]) ||
      []
    );
  }, [indexUiState?.refinementList]);

  useEffect(() => {
    const load = async () => {
      const data = await loader();
      dispatch({ type: 'LOAD_DATA', data });
      body.classList.remove('opacity-0');

      if (jurisdiction && !isJurisdictionSet && customerJurisdictions.length) {
        const mergedJurisdictions = [
          ...new Set([...jurisdiction, ...customerJurisdictions])
        ];
        if (!isJurisdictionSet) {
          dispatch({
            type: 'SET_JURISDICTION',
            data: mergedJurisdictions
          });
          sessionStorage.setItem('isJurisdictionSet', 'true'); // Mark this block as having been run
        }
      } else if (jurisdiction) {
        dispatch({ type: 'SET_JURISDICTION', data: jurisdiction });
      }
    };
    load();
  }, []);


  const [navAdded, setNavAdded] = useState(false);
  useEffect(() => {
    if( store?.mainMenu?.itemsCount && !navAdded ){
      setNavAdded(true);

      if (headerEl) {
          headerEl.innerHTML = '';
      }
      
      if (heroModuleFacultyAccountsEl) {
          heroModuleFacultyAccountsEl.innerHTML = '';
      }
    }
  }, [store]);

  // commits any state/jurisdiction changes from other components into local storage
  useEffect(() => {
    if (store?.settings?.jurisdiction) {
      const storeJurisdictions = store.settings.jurisdiction || [];
      const mergedJurisdictions = [
        ...storeJurisdictions,
        ...refinementListJurisdictions
      ];
      setJurisdiction(mergedJurisdictions);
    }
  }, [store?.settings?.jurisdiction]);

  useEffect(() => {
    setJurisdiction(refinementListJurisdictions);
  }, [refinementListJurisdictions]);

  useEffect(() => {
    if (store?.settings?.jurisdiction) {
      setTimeout(() => {
        const storeJurisdictions = store.settings.jurisdiction || [];
        const refinementListJurisdictions =
          (indexUiState?.refinementList &&
            indexUiState?.refinementList[MetaCourseCreditsAttributes.key]) ||
          [];
        const mergedJurisdictions = [
          ...new Set([...storeJurisdictions, ...refinementListJurisdictions])
        ];
        setIndexUiState((prevIndexUiState) => ({
          ...prevIndexUiState,
          refinementList: {
            ...prevIndexUiState.refinementList,
            [MetaCourseCreditsAttributes.key]: mergedJurisdictions
          }
        }));
      }, 1);
    }
  }, [store?.settings?.jurisdiction]);

  useEffect(() => {
    if (heroModuleSearchEl) {
      heroModuleSearchEl.setAttribute('data-hj-allow', 'true');
    }
  }, [heroModuleSearchEl]);

  return store ? (
    <SettingsContext.Provider
      value={{ ...store.settings, dispatch, templateName, rootRef }}
    >
      <div ref={rootRef} className="layout">
        {isAnnouncementBarEnabled &&
          createPortal(
            <AnnouncementBar fields={store.announcementBar} />,
            announcementEl
          )}

        {heroModuleSearchEl &&
          createPortal(<NavSearchWrapper />, heroModuleSearchEl)}

        {navAdded && heroModuleFacultyAccountsEl &&
          createPortal(
            <HeroModuleFacultyAccounts
              facultyImageCount={
                heroModuleFacultyAccountsEl.dataset?.facultyImageCount
              }
            />,
            heroModuleFacultyAccountsEl
          )}

        {navAdded && createPortal(
          <Header data={store} enableShortNav={enableShortNav} />,
          headerEl
        )}
        <Outlet />
        <GlobalSections />
        {sectionEls.map((el) => (
          <Section key={el.dataset.sectionId} element={el} />
        ))}
        {horizontalProductCarouselEls.map((el) =>
          createPortal(
            <HorizontalProductCarousel key={el.dataset.sectionId} />,
            el
          )
        )}

        {relatedProductsCarouselEls.map((el) => {
          if (window?.meta) {
            return createPortal(
              <RelatedProductCarousel
                key={el.dataset.sectionId}
                products={window.meta?.products}
                product={window.meta?.product}
              />,
              el
            );
          }
        })}

        {horizontalProductDisplayEls.map((el) =>
          createPortal(
            <HorizontalProductDisplay key={el.dataset.sectionId} />,
            el
          )
        )}
        {horizontalProductDisplayAlgoliaEls.map((el) =>
          createPortal(
            <HorizontalProductDisplayAlgolia key={el.dataset.sectionId} />,
            el
          )
        )}

        {createPortal(<Footer data={store} />, footerEl)}
        <Modals />
      </div>
    </SettingsContext.Provider>
  ) : null;
};

export default Layout;

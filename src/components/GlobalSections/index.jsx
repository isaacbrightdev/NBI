import { createPortal } from 'react-dom';
import SubscriptionUpsellModule from '@/components/GlobalSections/SubscriptionUpsellModule';

const SECTIONS = {
  subscription_upsell_module: <SubscriptionUpsellModule />
};

const GlobalSections = () => {
  const sectionEls = [...document.querySelectorAll('[data-component')];
  return sectionEls.map((sectionEl) =>
    createPortal(SECTIONS[sectionEl.dataset.component], sectionEl)
  );
};

export default GlobalSections;

import PropTypes from 'prop-types';
import { useCallback } from 'react';
import useLocalStorage from 'use-local-storage';
import DisclosurePanel from '@/components/Search/DisclosurePanel';
import DynamicRefinementList from '@/components/Search/DynamicRefinementList';
import { AlgoliaFacets } from '@/utils/searchClient';

const CreditSpecialtyDynamicRefinementList = ({ attribute }) => {
  const [jurisdiction] = useLocalStorage('jurisdictionKeys', []);

  const filterCreditSpecialtiesByJurisdiction = (jurisdictions) => {
    if (window.creditData && window.creditData.length === 0) {
      return [];
    }

    const creditData = window.creditData
      .filter((item) => jurisdictions.includes(item.id))
      .map((item) => item.items)
      .flat();

    return [...new Set(creditData)];
  };

  const transformItems = useCallback(
    (items) => {
      const foundCreditSpecialties =
        filterCreditSpecialtiesByJurisdiction(jurisdiction);

      if (foundCreditSpecialties.length === 0) {
        return items;
      }

      return items.filter((creditSpecialty) =>
        foundCreditSpecialties.includes(creditSpecialty.value)
      );
    },
    [jurisdiction]
  );

  return (
    <DynamicRefinementList
      searchable={true}
      attribute={attribute}
      transformItems={transformItems}
    />
  );
};

CreditSpecialtyDynamicRefinementList.propTypes = {
  attribute: PropTypes.string
};

const CreditSpecialtyDisclosurePanel = ({ attribute }) => {
  return (
    <DisclosurePanel
      header={AlgoliaFacets.CreditSpecialty.title}
      attribute={attribute}
      isJurisdictionCoupled={true}
    >
      <CreditSpecialtyDynamicRefinementList attribute={attribute} />
    </DisclosurePanel>
  );
};

CreditSpecialtyDisclosurePanel.propTypes = {
  attribute: PropTypes.string
};

export default CreditSpecialtyDisclosurePanel;

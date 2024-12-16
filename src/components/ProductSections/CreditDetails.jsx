import { useProduct } from '@shopify/hydrogen-react';
import log from 'loglevel';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import useLocalStorage from 'use-local-storage';
import useSettings from '@/hooks/useSettings';
import useVariantCreditData from '@/hooks/useVariantCreditData';
import CreditDetailsCard from '../CreditDetailsCard';
import StateSelectionButton from '../StateSelectionButton';
import BrochureWordingSection from './BrochureWordingSection';

const CreditDetails = () => {
  const { product, selectedVariant } = useProduct();
  const [savedStates, setSavedStates] = useLocalStorage('jurisdictionKeys', []);
  const [formattedStates, setFormattedStates] = useState([]);
  const [statesNotIncluded, setStatesNotIncluded] = useState([]);
  const [stateCredits, setStateCredits] = useState([]);
  const { dispatch } = useSettings();
  const variantCreditData = useVariantCreditData(product);

  log.trace({ variantCreditData: variantCreditData });

  const findMatchingStates = (creditsArray, savedStates) => {
    return savedStates.filter((state) =>
      creditsArray.some((credit) => `${credit['credit-title-group']}` === state)
    );
  };

  const findStatesNotIncluded = (matchingStates, savedStates) => {
    return savedStates.filter((state) => !matchingStates.includes(state));
  };

  //"Other_CPE for Accountants/NASBA"
  const transformStatesNotIncluded = (statesNotIncluded) => {
    return statesNotIncluded.map((state) => {
      const [creditTitle] = state.split('_');
      return {
        key: state,
        'credit-state': state,
        'credit-title': creditTitle,
        'credit-status': 'Not Available',
        'credit-type': null,
        'earn-until': null,
        'credit-message':
          'Accreditation is not currently available in this jurisdiction'
      };
    });
  };

  useEffect(() => {
    if (!selectedVariant || !selectedVariant?.credits?.value) return;

    setStateCredits(variantCreditData);

    const matchingStates = findMatchingStates(variantCreditData, savedStates);

    const statesNotIncluded = findStatesNotIncluded(
      matchingStates,
      savedStates
    );

    dispatch({
      type: 'UPDATE_LOAD_DATA',
      data: {
        settings: { hasInvalidJurisdictions: statesNotIncluded.length > 0 }
      }
    });

    const statesNotIncludedData = transformStatesNotIncluded(statesNotIncluded);

    setStatesNotIncluded(statesNotIncludedData);

    const statesData = matchingStates.map((state) => {
      const stateData = variantCreditData.find(
        (credit) => credit['credit-title-group'] === state
      );

      if (!stateData) return;

      return {
        key: stateData['short-desc'] + '_' + stateData['credit-title'],
        ...stateData
      };
    });

    setFormattedStates(statesData.filter(Boolean));
  }, [selectedVariant, savedStates]);

  if (!selectedVariant) return null;

  return (
    <section>
      <div className="mb-10 flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <h4 className="mb-[10px] text-h2-mobile leading-none lg:mb-0 lg:text-h2">
          Credit Details
        </h4>
        <div className="relative mt-2 w-auto lg:mt-0">
          <button
            className="btn btn--secondary"
            onClick={() => {
              dispatch({
                type: 'SET_MODAL',
                data: {
                  name: 'credits',
                  state: true,
                  product: {
                    ...product,
                    meta: {
                      course: {
                        credits: variantCreditData
                      }
                    }
                  }
                }
              });
            }}
          >
            View All Credits
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 items-stretch gap-y-5 lg:grid-cols-2 lg:gap-x-5">
        {selectedVariant && stateCredits && (
          <>
            {formattedStates.map((creditData) => {
              const formattedCategory = creditData['credit-title-group'];
              return (
                <CreditDetailsCard
                  key={creditData.key}
                  savedStates={savedStates}
                  setSavedStates={setSavedStates}
                  matchingStateData={{
                    key: creditData.key,
                    category: formattedCategory,
                    ...creditData
                  }}
                />
              );
            })}
            {statesNotIncluded.map((state) => {
              const creditTitle = state.key.split('_')[1];
              return (
                <CreditDetailsCard
                  key={state.key}
                  savedStates={savedStates}
                  setSavedStates={setSavedStates}
                  matchingStateData={{
                    state: state['credit-state'],
                    category: state['credit-state'],
                    'credit-state': state['credit-state'],
                    'credit-title': creditTitle,
                    'credit-status': 'Not Available',
                    'credit-type': null,
                    'earn-until': null,
                    'credit-message': state['credit-message']
                  }}
                />
              );
            })}
          </>
        )}
        <StateSelectionButton />
      </div>
      {selectedVariant && savedStates?.length > 0 && (
        <BrochureWordingSection
          savedStates={savedStates}
          product={product}
          findMatchingStates={findMatchingStates}
        />
      )}
    </section>
  );
};

CreditDetails.propTypes = {
  savedStates: PropTypes.arrayOf(PropTypes.string),
  formattedStates: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string,
      category: PropTypes.string,
      'credit-state': PropTypes.string,
      'credit-title': PropTypes.string,
      'credit-status': PropTypes.string,
      'credit-type': PropTypes.array,
      'earn-until': PropTypes.string,
      'credit-total': PropTypes.string
    })
  ),
  statesNotIncluded: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string,
      'credit-state': PropTypes.string,
      'credit-title': PropTypes.string,
      'credit-status': PropTypes.string,
      'credit-type': PropTypes.array,
      'earn-until': PropTypes.string
    })
  ),
  stateCredits: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string,
      category: PropTypes.string,
      'credit-state': PropTypes.string,
      'credit-title': PropTypes.string,
      'credit-status': PropTypes.string,
      'credit-type': PropTypes.array,
      'earn-until': PropTypes.string,
      'credit-total': PropTypes.string
    })
  ),
  variantCreditData: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string,
      category: PropTypes.string,
      'credit-state': PropTypes.string,
      'credit-title': PropTypes.string,
      'credit-status': PropTypes.string,
      'credit-type': PropTypes.array,
      'earn-until': PropTypes.string,
      'credit-total': PropTypes.string
    })
  ),
  transformCredits: PropTypes.func,
  findMatchingStates: PropTypes.func,
  findStatesNotIncluded: PropTypes.func,
  transformStatesNotIncluded: PropTypes.func,
  savedStateBrochureWording: PropTypes.func
};

export default CreditDetails;

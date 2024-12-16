import { Disclosure } from '@headlessui/react';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { useInstantSearch } from 'react-instantsearch';
import useLocalStorage from 'use-local-storage';
import Modal from '@/components/Modal';
import useSettings from '@/hooks/useSettings';
import useVariantCreditData from '@/hooks/useVariantCreditData';
import checkboxStateToJurisdictionKeys from '@/utils/checkboxStateToJurisdictionKeys';
import jurisdictionKeysToCheckboxState from '@/utils/jurisdictionKeysToCheckboxState';
import {
  AlgoliaProductIndexName,
  MetaCourseCreditsAttributes
} from '@/utils/searchClient';
import StateCheckbox from '../StateCheckbox';
import SvgIcon from '../SvgIcon';

const StatesModal = ({ data }) => {
  const { dispatch } = useSettings();
  const { setUiState } = useInstantSearch();
  const [storedJurisdictionKeys, setStoredJurisdictionKeys] = useLocalStorage(
    'jurisdictionKeys',
    []
  );
  const [checkboxState, _setCheckboxState] = useState(
    jurisdictionKeysToCheckboxState(storedJurisdictionKeys)
  );
  const [tempCheckboxState, setTempCheckboxState] = useState(checkboxState);
  const [stateOptions, setStateOptions] = useState({});
  const variantCreditData = useVariantCreditData(data);
  const formRef = useRef();

  // loop into the product to build out the checkboxes for the State Jurisdiction Modal
  function createStateOptionsFromData() {
    const newCreditCategories = {};

    variantCreditData.forEach((credit) => {
      const creditCategory = credit['credit-category'];
      const creditState = credit['credit-state'];
      const creditKey = `${credit['credit-title-group']}`;

      // Initialize the creditCategory if it does not already exist
      if (!newCreditCategories[creditCategory]) {
        newCreditCategories[creditCategory] = {
          creditKeys: [], // this will hold the credit-titles
          creditStates: [] // this will hold multiple credit-states
        };
      }

      // Add the credit-state under the credit-category
      // 'N' (National) events always get added
      if (
        creditState === 'N' ||
        !newCreditCategories[creditCategory].creditKeys.some(
          (item) => item.creditState === creditState
        )
      ) {
        newCreditCategories[creditCategory].creditKeys.push({
          creditState: creditState,
          creditKey: creditKey,
          isChecked: false
        });
      }
    });

    // we need to sort the creditStates such that 'Other' always comes last
    const otherKeyLast = Object.keys(newCreditCategories).sort((a, b) => {
      if (a.toLowerCase() === 'other') return 1;
      if (b.toLowerCase() === 'other') return -1;
      return a.localeCompare(b);
    });

    const sortedCategories = {};
    otherKeyLast.forEach((key) => {
      sortedCategories[key] = newCreditCategories[key];
    });

    return sortedCategories;
  }

  // closes the modal
  const closeModal = () => {
    dispatch({ type: 'SET_MODAL', data: { name: 'states', state: false } });
  };

  // if localStorage setter - updates localStorage and states
  const updateLocalStorageAndState = () => {
    const keys = checkboxStateToJurisdictionKeys(tempCheckboxState);
    setStoredJurisdictionKeys(keys);

    setUiState((prevUiState) => ({
      ...prevUiState,
      [AlgoliaProductIndexName]: {
        ...prevUiState[AlgoliaProductIndexName].refinementList,
        refinementList: {
          ...prevUiState[AlgoliaProductIndexName].refinementList,
          [MetaCourseCreditsAttributes.key]: keys
        }
      }
    }));
    setTempCheckboxState(tempCheckboxState);
    _setCheckboxState(tempCheckboxState);
  };

  // when the clear button is clicked, clear all checkboxes
  const handleClearClick = (e) => {
    e.preventDefault();

    // clear any stored states
    _setCheckboxState(jurisdictionKeysToCheckboxState([]));
    setTempCheckboxState(jurisdictionKeysToCheckboxState([]));

    // clear localStorage
    setStoredJurisdictionKeys([]);

    setUiState((prevUiState) => ({
      ...prevUiState,
      [AlgoliaProductIndexName]: {
        ...prevUiState[AlgoliaProductIndexName].refinementList,
        refinementList: {
          ...prevUiState[AlgoliaProductIndexName].refinementList,
          [MetaCourseCreditsAttributes.key]: []
        }
      }
    }));
    // reset the form
    formRef.current.reset();

    // close the modal
    closeModal();
  };

  const handleCheckboxChange = (creditKey, stateKey, checkedValue) => {
    const newKey = creditKey;

    setTempCheckboxState((prev) => {
      return {
        ...prev,
        [newKey]: {
          isChecked: checkedValue
        }
      };
    });
  };

  const getStateName = (creditKey) => {
    const creditSplit = creditKey.split('_');
    const shortDesc = creditSplit[0];
    if (
      creditSplit[0] == creditSplit[1] ||
      shortDesc !== 'CLE' ||
      shortDesc !== 'PLE'
    ) {
      return creditSplit[1];
    }
    const stateName = creditSplit[1].replace(shortDesc, '');
    return stateName.trim();
  };

  useEffect(() => {
    const newCheckboxState = jurisdictionKeysToCheckboxState(
      storedJurisdictionKeys
    );
    if (!storedJurisdictionKeys) {
      setStoredJurisdictionKeys([]);
    }
    if (storedJurisdictionKeys) {
      _setCheckboxState(newCheckboxState);
      setTempCheckboxState(newCheckboxState);
    }
  }, [storedJurisdictionKeys]);

  // on mount, set the stateOptions
  useEffect(() => {
    setStateOptions(createStateOptionsFromData());
  }, []);

  return (
    <Modal name="states" title="Select Jurisdiction">
      {Object.entries(stateOptions).length === 0 ? (
        <div className="flex flex-col">
          <p className="text-base text-secondary">
            There are no states available for this course.
          </p>
          <div className="mt-10 flex justify-between">
            <button
              className="text-sm-body text-secondary underline"
              type="button"
              onClick={() => {
                dispatch({
                  type: 'SET_MODAL',
                  data: { name: 'states', state: false }
                });
              }}
            >
              Close
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col">
          <form
            ref={formRef}
            onSubmit={(e) => {
              e.preventDefault();
              updateLocalStorageAndState();
              closeModal();
            }}
          >
            <div className="max-h-[60vh] overflow-y-auto">
              {Object.entries(stateOptions).map(
                ([creditCategory, { creditKeys }]) => (
                  <Disclosure key={creditCategory}>
                    <Disclosure.Button className="flex w-full justify-between px-1 py-2">
                      <span>{creditCategory}</span>
                      <span className="ml-6">
                        {open ? (
                          <SvgIcon name="caret-down" />
                        ) : (
                          <SvgIcon name="caret-up" />
                        )}
                      </span>
                    </Disclosure.Button>
                    <Disclosure.Panel className="mx-1 py-5">
                      {creditKeys.map(({ creditState, creditKey }) => {
                        return (
                          <StateCheckbox
                            key={creditKey}
                            id={creditKey}
                            label={getStateName(creditKey)}
                            isDisabled={false}
                            namespace={creditKey}
                            isChecked={tempCheckboxState[creditKey]?.isChecked}
                            checkboxState={checkboxState}
                            handleCheckboxChange={handleCheckboxChange}
                            creditKey={creditKey}
                            stateKey={creditState}
                          />
                        );
                      })}
                    </Disclosure.Panel>
                  </Disclosure>
                )
              )}
            </div>

            <div className="mt-10 flex flex-row items-center">
              <button
                type="submit"
                className="text-sm-body text-secondary underline"
                onClick={(e) => {
                  handleClearClick(e);
                }}
              >
                Clear
              </button>
              <button
                type="button"
                className="btn btn--accent ml-auto"
                onClick={(e) => {
                  e.preventDefault();
                  updateLocalStorageAndState();
                  closeModal();
                }}
              >
                Apply
              </button>
            </div>
          </form>
        </div>
      )}
    </Modal>
  );
};

StatesModal.propTypes = {
  dispatch: PropTypes.func,
  storedJurisdictionKeys: PropTypes.array,
  checkboxState: PropTypes.object,
  tempCheckboxState: PropTypes.object,
  stateOptions: PropTypes.object,
  formRef: PropTypes.object,
  updateLocalStorageAndState: PropTypes.func,
  closeModal: PropTypes.func,
  handleCheckboxChange: PropTypes.func,
  handleClearClick: PropTypes.func,
  getStateName: PropTypes.func,
  data: PropTypes.object
};

export default StatesModal;

import PropTypes from 'prop-types';
import DynamicRefinementList from '@/components/Search/DynamicRefinementList';
import { IS_IPE } from '@/utils/constants';
import DisclosurePanel from './DisclosurePanel';

const CreditDisclosurePanel = ({ attribute, header }) => {
  
  const refinementCountCle = (items) => {
    return items[0]?.refinements?.filter((value) => {
      return value.value.startsWith('CLE_');
    }).length;
  };

  const refinementCountNotCle = (items) => {
    return items[0]?.refinements?.filter((value) => {
      return !value.value.startsWith('CLE_');
    }).length;
  };

  return (
    <>
      {!IS_IPE && (
        <DisclosurePanel
          header={header}
          attribute={attribute}
          refinementCountTransform={refinementCountCle}
        >
          <DynamicRefinementList
            attribute={attribute}
            isLongList={true}
            transformItems={(items) => {
              return items
                .filter((item) => {
                  return item.value.startsWith('CLE_');
                })
                .map((item) => {
                  return {
                    ...item,
                    highlighted: item.highlighted.split('_')[1],
                    label: item.label.split('_')[1]
                  };
                });
            }}
          />
        </DisclosurePanel>
      )}
      <DisclosurePanel
        header={IS_IPE ? 'Credits' : 'Other Credits'}
        attribute={attribute}
        refinementCountTransform={refinementCountNotCle}
      >
        <DynamicRefinementList
          attribute={attribute}
          title={IS_IPE ? 'Credits' : 'Other Credits'}
          transformItems={(items) => {
            return items
              .filter((item) => {
                return item.value.startsWith('CLE_') == false;
              })
              .sort((a, b) => {
                // Prefixes that aren't "Other_" come before "Other_"
                // Then everything gets ordered alphabetically, including with prefix
                if (
                  a.value.startsWith('Other_') &&
                  !b.value.startsWith('Other_')
                )
                  return 1;
                else if (
                  !a.value.startsWith('Other_') &&
                  b.value.startsWith('Other_')
                )
                  return -1;
                else return a.value.localeCompare(b.value);
              })
              .map((item) => {
                return {
                  ...item,
                  highlighted: item.highlighted.split('_')[1],
                  label: item.label.split('_')[1]
                };
              });
          }}
        />
      </DisclosurePanel>
    </>
  );
};

CreditDisclosurePanel.propTypes = {
  attribute: PropTypes.string,
  header: PropTypes.string
};

export default CreditDisclosurePanel;

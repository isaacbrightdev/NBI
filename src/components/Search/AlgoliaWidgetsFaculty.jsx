import { ClearRefinements, DynamicWidgets } from 'react-instantsearch';
import DisclosurePanel from '@/components/Search/DisclosurePanel';
import DynamicRefinementList from '@/components/Search/DynamicRefinementList';

const AlgoliaWidgetsFaculty = () => {
  return (
    <div className="disclosure-panels">
      <ClearRefinements
        translations={{
          resetButtonText: 'Clear all'
        }}
        classNames={{
          root: 'mb-4 lg-max:hidden',
          button:
            'text-[0.875rem] text-secondary not-italic font-medium leading-[130%] underline',
          disabledButton: 'opacity-0'
        }}
      />
      <DynamicWidgets maxValuesPerFacet={500}>
        <DisclosurePanel header="Location" attribute="billAddress">
          <DynamicRefinementList attribute="billAddress" />
        </DisclosurePanel>

        <DisclosurePanel header="Practice Area" attribute="areasOfPractice">
          <DynamicRefinementList attribute="areasOfPractice" />
        </DisclosurePanel>
      </DynamicWidgets>
    </div>
  );
};

export default AlgoliaWidgetsFaculty;

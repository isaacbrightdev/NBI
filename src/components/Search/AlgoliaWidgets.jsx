import PropTypes from 'prop-types';
import { DynamicWidgets } from 'react-instantsearch';
import DateDisclosurePanel from '@/components/Search/DateDisclosurePanel';
import DisclosurePanel from '@/components/Search/DisclosurePanel';
import DynamicRefinementList from '@/components/Search/DynamicRefinementList';
import { AlgoliaFacets } from '@/utils/searchClient';
import CreditDisclosurePanel from './CreditDisclosurePanel';
import CreditSpecialtyDisclosurePanel from './CreditSpecialtyDisclosurePanel';
import HierarchicalMenuList from './HierarchicalMenuList';
import IncludedWithSub from './IncludedWithSub';

const AlgoliaWidgets = ({ hideClearRefinements = false }) => {
  return (
    <div className="disclosure-panels">
      {!hideClearRefinements && (
        <a
          href="/search"
          className="text-[0.875rem] font-medium not-italic leading-[130%] text-secondary underline"
        >
          Clear all
        </a>
      )}

      <IncludedWithSub />

      <DynamicWidgets maxValuesPerFacet={500}>
        <CreditDisclosurePanel
          attribute={AlgoliaFacets.Jurisdiction.attr}
          header={AlgoliaFacets.Jurisdiction.title}
        />
        <CreditSpecialtyDisclosurePanel
          attribute={AlgoliaFacets.CreditSpecialty.attr}
        />
        <DisclosurePanel
          header={AlgoliaFacets.CreditsState.title}
          attribute={AlgoliaFacets.CreditsState.attr}
        >
          <HierarchicalMenuList
            attributes={[
              AlgoliaFacets.CreditsState.attr,
              AlgoliaFacets.CreditsState.attr.replace('lvl0', 'lvl1')
            ]}
            separator=" > "
            label={AlgoliaFacets.CreditsState.title}
          />
        </DisclosurePanel>
        <DisclosurePanel
          header={AlgoliaFacets.CreditsParalegal.title}
          attribute={AlgoliaFacets.CreditsParalegal.attr}
        >
          <HierarchicalMenuList
            attributes={[
              AlgoliaFacets.CreditsParalegal.attr,
              AlgoliaFacets.CreditsParalegal.attr.replace('lvl0', 'lvl1')
            ]}
            separator=" > "
            label={AlgoliaFacets.CreditsParalegal.title}
          />
        </DisclosurePanel>
        <DisclosurePanel
          header={AlgoliaFacets.CreditsOther.title}
          attribute={AlgoliaFacets.CreditsOther.attr}
        >
          <HierarchicalMenuList
            attributes={[
              AlgoliaFacets.CreditsOther.attr,
              AlgoliaFacets.CreditsOther.attr.replace('lvl0', 'lvl1')
            ]}
            separator=" > "
            label={AlgoliaFacets.CreditsOther.title}
          />
        </DisclosurePanel>
        <DisclosurePanel
          header={AlgoliaFacets.StateSpecific.title}
          attribute={AlgoliaFacets.StateSpecific.attr}
        >
          <DynamicRefinementList
            attribute={AlgoliaFacets.StateSpecific.attr}
            isLongList={true}
            transformItems={(items) => {
              return items.map((item) => {
                return {
                  ...item,
                  highlighted: item.label + ' Content Only',
                  label: item.label + ' Content Only'
                };
              });
            }}
          />
        </DisclosurePanel>
        <DisclosurePanel
          header={AlgoliaFacets.Topic.title}
          attribute={AlgoliaFacets.Topic.attr}
        >
          <DynamicRefinementList
            attribute={AlgoliaFacets.Topic.attr}
            isLongList={true}
          />
        </DisclosurePanel>
        <DisclosurePanel
          header={AlgoliaFacets.Subtopic.title}
          attribute={AlgoliaFacets.Subtopic.attr}
        >
          <DynamicRefinementList
            attribute={AlgoliaFacets.Subtopic.attr}
            isLongList={true}
          />
        </DisclosurePanel>
        <DateDisclosurePanel attribute={AlgoliaFacets.EventDate.attr} />
        <DisclosurePanel
          header={AlgoliaFacets.CourseFormat.title}
          attribute={AlgoliaFacets.CourseFormat.attr}
          initializeOpen={true}
        >
          <DynamicRefinementList attribute={AlgoliaFacets.CourseFormat.attr} />
        </DisclosurePanel>
        <DisclosurePanel
          header={AlgoliaFacets.ProductType.title}
          attribute={AlgoliaFacets.ProductType.attr}
        >
          <DynamicRefinementList attribute={AlgoliaFacets.ProductType.attr} />
        </DisclosurePanel>
        <DisclosurePanel
          header={AlgoliaFacets.Duration.title}
          attribute={AlgoliaFacets.Duration.attr}
        >
          <DynamicRefinementList attribute={AlgoliaFacets.Duration.attr} />
        </DisclosurePanel>
        <DisclosurePanel
          header={AlgoliaFacets.Level.title}
          attribute={AlgoliaFacets.Level.attr}
        >
          <DynamicRefinementList attribute={AlgoliaFacets.Level.attr} />
        </DisclosurePanel>
      </DynamicWidgets>
    </div>
  );
};

AlgoliaWidgets.propTypes = {
  hideClearRefinements: PropTypes.bool
};

export default AlgoliaWidgets;

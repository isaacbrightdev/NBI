import { createQuerySuggestionsPlugin } from '@algolia/autocomplete-plugin-query-suggestions';
import recommend from '@algolia/recommend';
import algoliasearch from 'algoliasearch/lite';

export const AlgoliaProductIndexName = `${window.Algolia.index_prefix}products`;
export const AlgoliaFacultyAccountsIndexName =
  window.Algolia.algolia_faculty_accounts_index_name;
export const searchClient = algoliasearch(
  window.Algolia.app_id,
  window.Algolia.search_api_key
);
export const querySuggestionsPlugin = createQuerySuggestionsPlugin({
  searchClient,
  indexName: window.Algolia.query_suggestions_index_name
});

export const recommendClient = recommend(
  window.Algolia.app_id,
  window.Algolia.search_api_key
);

export const AlgoliaFacets = {
  Jurisdiction: {
    title: 'CLE State',
    attr: 'meta.course.credits.credit-title-group'
  },
  Topic: {
    title: 'Topic',
    attr: 'named_tags.topic'
  },
  Subtopic: {
    title: 'Subtopic',
    attr: 'named_tags.subtopic'
  },
  CreditSpecialty: {
    title: 'Credit Specialty',
    attr: 'meta.course.credits.credit-type.credit-name'
  },
  CourseFormat: {
    title: 'Type',
    attr: 'named_tags.format'
  },
  Duration: {
    title: 'Duration',
    attr: 'meta.course.duration_group'
  },
  Level: {
    title: 'Level',
    attr: 'meta.course.level'
  },
  EventDate: {
    title: 'Upcoming Live Events',
    attr: 'meta.course.event-date-timestamp'
  },
  StateSpecific: {
    title: 'State-Specific Content',
    attr: 'named_tags.statespecific'
  },
  ProductType: {
    title: 'Product Type',
    attr: 'product_type'
  },
  IncludedWithSub: {
    title: 'Included with My Subscription',
    attr: 'named_tags.validinsub'
  },
  CreditsState: {
    title: 'CLE State',
    attr: 'credits_state.lvl0',
    prefix: 'CLE_'
  },
  CreditsParalegal: {
    title: 'Paralegal Credit',
    attr: 'credits_paralegal.lvl0',
    prefix: 'Paralegal_'
  },
  CreditsOther: {
    title: 'Other Credits',
    attr: 'credits_other.lvl0',
    prefix: 'Other_'
  }
};

export const MetaCourseCreditsAttributes = {
  key: 'meta.course.credits.credit-title-group',
  state: 'meta.course.credits.credit-state',
  status: 'meta.course.credits.credit-status',
  title: 'meta.course.credits.credit-title-group',
  total: 'meta.course.credits.credit-total',
  creditName: 'meta.course.credits.credit-type.credit-name'
};

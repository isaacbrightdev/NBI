import { Configure, Index } from 'react-instantsearch';
import AlgoliaLayoutFaculty from '@/components/Faculty/AlgoliaLayoutFaculty';
import { AlgoliaFacultyAccountsIndexName } from '@/utils/searchClient';

const Faculty = () => (
  <Index indexName={AlgoliaFacultyAccountsIndexName}>
    <Configure hitsPerPage={10} attributesToHighlight={[]} />
    <AlgoliaLayoutFaculty />
  </Index>
);

export default Faculty;

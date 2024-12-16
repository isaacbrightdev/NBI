import { useProduct } from '@shopify/hydrogen-react';
import PropTypes from 'prop-types';
import Link from '@/components/Link';
import { AlgoliaProductIndexName } from '@/utils/searchClient';

const RelatedTopics = () => {
  const { product } = useProduct();
  const { tags } = product;
  const filteredTags = tags
    .filter((tag) => tag.startsWith('topic'))
    .map((tag) => {
      return {
        url: decodeURIComponent(tag).replaceAll('topic:encoded:', ''),
        label: decodeURIComponent(tag)
          .replaceAll('topic:encoded:', '')
          .replaceAll('+', ' ')
      };
    })
    .sort();

  return (
    tags && (
      <div className="mb-10">
        <h4 className="mb-4 text-h4-mobile lg:text-h4">Related Topics</h4>
        <ul className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredTags.map((tag, i) => {
            return (
              <li key={i}>
                <Link
                  className="font-semibold"
                  to={`/search?${AlgoliaProductIndexName}[refinementList][named_tags.topic][0]=${encodeURIComponent(
                    tag.url?.replaceAll('+', ' ')
                  )}`}
                >
                  {tag.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    )
  );
};

RelatedTopics.propTypes = {
  collections: PropTypes.any
};

export default RelatedTopics;

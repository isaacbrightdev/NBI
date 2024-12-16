import PropTypes from 'prop-types';
import aa from 'search-insights';

const ProductItemHit = ({ hit, components }) => {
  const handleClick = () => {
    aa('clickedObjectIDsAfterSearch', {
      eventName: 'Product Clicked After Search',
      index: window.Algolia.indexName,
      objectIDs: [hit.objectID],
      positions: [hit.__position],
      queryID: hit.__queryID
    });
  };

  return (
    <a
      href={`/products/${hit?.handle}`}
      className="aa-ItemLink"
      title={hit.title}
      onClick={handleClick}
    >
      <div className="aa-ItemContent">
        <div className="aa-ItemTitle flex items-center">
          <div className="flex-shrink-0">
            <div
              className={`relative aspect-square h-[2.8125rem] w-[2.8125rem] rounded-[0.3125rem] bg-grey-light ${
                !hit.image && 'animate-pulse '
              }`}
            >
              {hit.image && (
                <img
                  className="absolute left-0 top-0 h-full w-full object-cover object-center"
                  src={hit.image}
                  alt={hit.title}
                  loading="lazy"
                  width="46"
            height="46"
                />
              )}
            </div>
          </div>
          <div className="ml-4 flex flex-grow flex-col gap-1">
            <div className="line-clamp-1 text-h4-mobile font-normal not-italic leading-[130%] text-primary">
              <components.Snippet hit={hit} attribute="title" />
            </div>
            <div className="text-[0.75rem] font-medium not-italic leading-[130%] text-grey-dark">
              {hit?.product_type}
            </div>
          </div>
        </div>
      </div>
    </a>
  );
};

ProductItemHit.propTypes = {
  hit: PropTypes.any,
  components: PropTypes.any
};

export default ProductItemHit;

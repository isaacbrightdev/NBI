import { flattenConnection } from '@shopify/hydrogen-react';
import log from 'loglevel';
import COLLECTION_QUERY from '@/graphql/collection';
import shopify from '@/utils/shopify-api';

const loader = async (handle) => {
  try {
    if (!handle) return { collection: {}, products: [] };

    const data = await shopify.query(COLLECTION_QUERY, {
      handle: handle
    });

    if (!data?.collection?.products) {
      return { collection: {}, products: [] };
    }

    const products = flattenConnection(data.collection.products).map((item) => {
      if (item.rating) {
        return {
          ...item,
          rating: {
            value: JSON.parse(item.rating.value ? item.rating.value : null),
            type: item.rating.type
          }
        };
      }
      return item;
    });

    return { collection: data.collection, products };
  } catch (error) {
    log.error(error);
    return { collection: {}, products: [] };
  }
};

export default loader;

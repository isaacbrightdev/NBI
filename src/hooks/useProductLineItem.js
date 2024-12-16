import log from 'loglevel';
import { useState, useEffect } from 'react';
import PRODUCT_LINE_ITEM_QUERY from '@/graphql/productlineitem';
import shopify from '@/utils/shopify-api';

const useProductLineItem = (handle) => {
  const [productLineItem, setProductLineItem] = useState();

  useEffect(() => {
    const load = async () => {
      try {
        const data = await shopify.query(PRODUCT_LINE_ITEM_QUERY, { handle });
        setProductLineItem(data.product);
      } catch (error) {
        log.error(error);
      }
    };

    load();
  }, [handle]);

  return productLineItem;
};

export default useProductLineItem;

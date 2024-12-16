import { flattenConnection } from '@shopify/hydrogen-react';
import log from 'loglevel';
import { useState, useEffect } from 'react';
import METAOBJECTS_QUERY from '@/graphql/metaobjects';
import shopify from '@/utils/shopify-api';

const useMetaobjects = (type, first) => {
  const [metaobjects, setMetaobjects] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await shopify.query(METAOBJECTS_QUERY, { type, first });
        setMetaobjects(flattenConnection(data.metaobjects));
      } catch (error) {
        log.error(error);
      }
    };

    load();
  }, [type, first]);

  return metaobjects;
};

export default useMetaobjects;

import log from 'loglevel';
import { useState, useEffect } from 'react';
import METAOBJECT_QUERY from '@/graphql/metaobject';
import mapFields from '@/utils/mapFields';
import shopify from '@/utils/shopify-api';

const useMetaobject = (id) => {
  const [metaobject, setMetaobject] = useState({ fields: null });

  useEffect(() => {
    const load = async () => {
      try {
        const data = await shopify.query(METAOBJECT_QUERY, { id });
        setMetaobject({
          ...data.metaobject,
          fields: mapFields(data.metaobject.fields)
        });
      } catch (error) {
        log.error(error);
      }
    };

    load();
  }, [id]);

  return metaobject;
};

export default useMetaobject;

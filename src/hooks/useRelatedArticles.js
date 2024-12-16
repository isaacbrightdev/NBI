import log from 'loglevel';
import { useState, useEffect } from 'react';
import RELATED_ARTICLES_QUERY from '@/graphql/articles';
import shopify from '@/utils/shopify-api';

const useRelatedArticles = (handle, query) => {
  const [relatedArticles, setRelatedArticles] = useState();

  useEffect(() => {
    const load = async () => {
      try {
        const { blog } = await shopify.query(RELATED_ARTICLES_QUERY, {
          handle,
          query
        });
        setRelatedArticles(blog);
      } catch (error) {
        log.error(error);
      }
    };

    load();
  }, [handle]);

  return relatedArticles;
};

export default useRelatedArticles;

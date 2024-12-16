import log from 'loglevel';
import ARTICLE_QUERY from '@/graphql/article';
import shopify from '@/utils/shopify-api';

const loader = async ({ params }) => {
  try {
    const { blog } = await shopify.query(ARTICLE_QUERY, {
      handle: params.handle,
      articleHandle: params.article
    });

    return blog.articleByHandle;
  } catch (error) {
    log.error(error);
  }
};

export default loader;

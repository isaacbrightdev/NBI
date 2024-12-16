import log from 'loglevel';
import PAGE_QUERY from '@/graphql/page';
import shopify from '@/utils/shopify-api';

const loader = async ({ params }) => {
  try {
    const { page } = await shopify.query(PAGE_QUERY, {
      handle: params.handle
    });

    return page;
  } catch (error) {
    log.error(error);
  }
};

export default loader;

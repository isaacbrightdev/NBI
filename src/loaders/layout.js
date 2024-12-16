import log from 'loglevel';
import SHOP_QUERY from '@/graphql/shop';
import mapFields from '@/utils/mapFields';
import shopify from '@/utils/shopify-api';

const loader = async () => {
  try {
    const data = await shopify.query(SHOP_QUERY);

    data.settings = mapFields(data.settings.fields);
    data.announcementBar = mapFields(data.announcementBar.fields);

    return data;
  } catch (error) {
    log.error(error);
  }
};

export default loader;

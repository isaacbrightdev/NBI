import log from 'loglevel';
import { useEffect, useState } from 'react';
import MEDIAIMAGE_QUERY from '@/graphql/mediaimage';
import shopify from '@/utils/shopify-api';

const useMediaImage = (id) => {
  const [mediaimage, setMediaImage] = useState({ fields: null });

  useEffect(() => {
    const load = async () => {
      if (id) {
        try {
          const data = await shopify.query(MEDIAIMAGE_QUERY, { id });
          setMediaImage({
            ...data.node.image
          });
        } catch (error) {
          log.error(error);
        }
      } else {
        setMediaImage({ fields: null });
      }
    };

    load();
  }, [id]);

  return mediaimage;
};

export default useMediaImage;

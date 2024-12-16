import loader from '@/loaders/collection';
import log from 'loglevel';
import { useEffect, useRef, useState } from 'react';
import HorizontalProductWrapper from '@/components/Carousels/HorizontalProductWrapper';

const HorizontalProductCarousel = () => {
  const carouselRef = useRef(null);
  const [products, setProducts] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    try {
      if (!carouselRef.current) return;
      
      const scriptData = JSON.parse(
        carouselRef.current.parentElement?.querySelector(
          "script[type='application/json']"
        ).textContent ? carouselRef.current.parentElement?.querySelector(
          "script[type='application/json']"
        ).textContent : null
      );

      setData(scriptData);

      if( scriptData?.collectionHandle != null || scriptData?.collectionHandle ){
        carouselRef.current.closest('section').classList.remove('hidden');
      }

      if (scriptData?.collectionHandle) {
        const load = async () => {
          const data = await loader(scriptData?.collectionHandle);
          setProducts(data?.products);
        };
        load();
      }
    } catch (error) {
      log.error(error);
    }
  }, [carouselRef]);

  return (
    <HorizontalProductWrapper
      carouselRef={carouselRef}
      products={products}
      data={data}
    />
  );
};

export default HorizontalProductCarousel;

import { useLayoutEffect, useRef, useState } from 'react';

// Source: https://github.com/konvajs/use-image/blob/master/index.js

function useImage(url, crossOrigin, referrerpolicy) {
  // let's use refs for image and status so we can update them during render to have instant update in status/image when new data comes in
  const statusRef = useRef('loading');
  const imageRef = useRef();

  // we are not going to use token but we need to just to trigger state update
  // eslint-disable-next-line no-unused-vars
  const [_, setStateToken] = useState(0);

  // keep track of old props to trigger changes
  const oldUrl = useRef();
  const oldCrossOrigin = useRef();
  const oldReferrerPolicy = useRef();
  if (
    oldUrl.current !== url ||
    oldCrossOrigin.current !== crossOrigin ||
    oldReferrerPolicy.current !== referrerpolicy
  ) {
    statusRef.current = 'loading';
    imageRef.current = undefined;
    oldUrl.current = url;
    oldCrossOrigin.current = crossOrigin;
    oldReferrerPolicy.current = referrerpolicy;
  }

  useLayoutEffect(
    function () {
      if (!url) return;
      const img = document.createElement('img');

      const onload = () => {
        statusRef.current = 'loaded';
        imageRef.current = img;
        setStateToken(Math.random());
      };

      const onerror = () => {
        statusRef.current = 'failed';
        imageRef.current = undefined;
        setStateToken(Math.random());
      };

      img.addEventListener('load', onload);
      img.addEventListener('error', onerror);
      crossOrigin && (img.crossOrigin = crossOrigin);
      referrerpolicy && (img.referrerPolicy = referrerpolicy);
      img.src = url;

      return function cleanup() {
        img.removeEventListener('load', onload);
        img.removeEventListener('error', onerror);
      };
    },
    [url, crossOrigin, referrerpolicy]
  );
  return [imageRef.current, statusRef.current];
}

export default useImage;

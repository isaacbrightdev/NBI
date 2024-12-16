import { useState, useEffect } from 'react';

const useOS = () => {
  const [os, setOS] = useState('Unknown');

  useEffect(() => {
    const platform = navigator.platform;
    let osName = 'Unknown';

    if (platform.indexOf('Win') > -1) {
      osName = 'Windows';
    } else if (platform.indexOf('Mac') > -1) {
      osName = 'MacOS';
    } else if (platform.indexOf('Linux') > -1) {
      osName = 'Linux';
    } else if (platform.indexOf('iPhone') > -1 || platform.indexOf('iPad') > -1) {
      osName = 'iOS';
    } else if (platform.indexOf('Android') > -1) {
      osName = 'Android';
    }

    setOS(osName);
  }, []);

  return os;
};

export default useOS;

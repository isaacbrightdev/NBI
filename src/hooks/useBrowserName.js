import { useState, useEffect } from 'react';

const useBrowserName = () => {
  const [browserName, setBrowserName] = useState('Unknown');

  useEffect(() => {
    const userAgent = navigator.userAgent;
    let name = 'Unknown';
    if (userAgent.indexOf('Chrome') > -1) {
      name = 'Chrome';
    } else if (userAgent.indexOf('Firefox') > -1) {
      name = 'Firefox';
    } else if (userAgent.indexOf('Safari') > -1) {
      name = 'Safari';
    } else if (userAgent.indexOf('MSIE') > -1 || userAgent.indexOf('Trident/') > -1) {
      name = 'Internet Explorer';
    } else if (userAgent.indexOf('Edge') > -1) {
      name = 'Edge';
    }
    setBrowserName(name);
  }, []);

  return browserName;
};

export default useBrowserName;

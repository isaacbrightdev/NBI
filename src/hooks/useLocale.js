import { useState, useEffect } from 'react';

const useLocale = () => {
  const [locale, setLocale] = useState('');

  useEffect(() => {
    const userLocale = navigator.language || navigator.userLanguage;
    setLocale(userLocale);
  }, []);

  return locale;
};

export default useLocale;

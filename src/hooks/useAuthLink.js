import log from 'loglevel';
import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

const useAuthLink = (link) => {
  const location = useLocation();

  const authLink = useMemo(() => {
    try {
      if (location.pathname == '/') return link;

      return `${link}?returnUrl=https://${
        import.meta.env.VITE_PUBLIC_STORE_DOMAIN
      }${location.pathname}`;
    } catch (error) {
      log.error('Could not compute authLink redirect URI');
      log.error(error);
      return '';
    }
  }, [location, link]);

  return authLink;
};

export default useAuthLink;

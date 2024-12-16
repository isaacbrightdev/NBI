import { useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import useSettings from '@/hooks/useSettings';

const Account = () => {
  const location = useLocation();
  const settings = useSettings();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const accountDomain = import.meta.env.VITE_PUBLIC_ACCOUNT_DOMAIN;
    const redirect = searchParams.has('checkout_url')
      ? `${settings.auth_link}?returnUrl=${window.location.origin}${searchParams.get('checkout_url')}`
      : `https://${accountDomain}`;
    window.location = redirect;
  }, [location, settings, searchParams]);
  return <></>;
};

export default Account;

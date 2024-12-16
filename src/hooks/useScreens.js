import { useMediaQuery } from 'react-responsive';

const useScreens = () => {
  const isMobile = useMediaQuery({ maxWidth: '1024px' });
  const isTablet = useMediaQuery({ minWidth: '1024px' });
  const isDesktop = useMediaQuery({ minWidth: '1200px' });
  const isXlDesktop = useMediaQuery({ minWidth: '1440px' });

  return { isMobile, isTablet, isDesktop, isXlDesktop };
};

export default useScreens;

import { useCallback, useEffect, useMemo, useState } from 'react';

const useScrollPosition = () => {
  // TODO: This all needs to be handled an IntersectionObserver
  // Nothing else uses this hook but the Reg/Access block state
  // Causes memory leaks/way too many re-renders
  const [scrollPosition, setScrollPosition] = useState(0);
  const updatePosition = useCallback(() => {
    setScrollPosition(window.scrollY);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', updatePosition);
    updatePosition();
    return () => window.removeEventListener('scroll', updatePosition);
  }, []);

  const percentScrolled = useMemo(() => {
    const pageHeight = Math.floor(document.body.getBoundingClientRect().height);
    return scrollPosition / (pageHeight - window.innerHeight);
  }, [scrollPosition]);

  return { scrollPosition, percentScrolled };
};

export default useScrollPosition;

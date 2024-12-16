import { useMemo } from 'react';
import { Index } from 'react-instantsearch';
import NavSearchDesktop from '@/components/Search/NavSearchDesktop';
import NavSearchMobile from '@/components/Search/NavSearchMobile';
import useScreens from '@/hooks/useScreens';
import useSettings from '@/hooks/useSettings';
import { IS_IPE } from '@/utils/constants';
import { AlgoliaFacets, AlgoliaProductIndexName } from '@/utils/searchClient';

const NavSearchWithOutIndex = () => {
  const { isDesktop } = useScreens();
  const { jurisdictionHeading, jurisdictionSubHeading } = useSettings();
  const jurisdictionAttributes = useMemo(() => {
    const primeAttr = IS_IPE
      ? AlgoliaFacets.CreditsParalegal.attr
      : AlgoliaFacets.CreditsState.attr;
    return [primeAttr, primeAttr.replace('lvl0', 'lvl1')];
  }, [import.meta.env.VITE_PUBLIC_STORE_DOMAIN]);

  return (
    <>
      {isDesktop && (
        <NavSearchDesktop
          className="NavSearchDesktop mx-auto w-full"
          jurisdictionHeading={jurisdictionHeading}
          jurisdictionSubHeading={jurisdictionSubHeading}
          jurisdictionAttributes={jurisdictionAttributes}
        />
      )}
      {!isDesktop && (
        <NavSearchMobile
          className="NavSearchMobile"
          jurisdictionHeading={jurisdictionHeading}
          jurisdictionSubHeading={jurisdictionSubHeading}
          jurisdictionAttributes={jurisdictionAttributes}
        />
      )}
    </>
  );
};

const NavSearchWithIndex = () => {
  return (
    <>
      <Index indexName={AlgoliaProductIndexName}>
        <NavSearchWithOutIndex />
      </Index>
    </>
  );
};

const NavSearchWrapper = () => {
  const { templateName } = useSettings();
  const useIndex = ['page-faculty', 'index'].includes(templateName);
  if (useIndex) {
    return <NavSearchWithIndex />;
  }
  return <NavSearchWithOutIndex />;
};
export default NavSearchWrapper;

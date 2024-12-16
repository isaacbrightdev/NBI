import PropTypes from 'prop-types';
import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { Configure, Index, useHits } from 'react-instantsearch';
import Link from '@/components/Link';
import useImage from '@/hooks/useImage';
import useSettings from '@/hooks/useSettings';
import useSpeakerNameSlug from '@/hooks/useSpeakerNameSlug';
import getInitials from '@/utils/getInitials';
import { AlgoliaFacultyAccountsIndexName } from '@/utils/searchClient';

const randomIntegerInRange = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const HeroModuleFacultyAccountsHitImage = ({ person }) => {
  // eslint-disable-next-line no-unused-vars
  const [, status] = useImage(person?.imageUrl);
  const isDefaultUrl =
    person?.imageUrl ===
    `https://742192ac4c5bb0c70831-f65be32ef428fd412f1987b5dbd54030.ssl.cf2.rackcdn.com/default.jpg`;

  if (status === 'loading') {
    return null;
  }

  return (
    <>
      {status === 'loaded' && !isDefaultUrl && (
        <img
          className={[
            'absolute',
            'w-full',
            'h-full',
            'left-0',
            'top-0',
            'object-cover',
            'object-center',
            'overflow-hidden',
            'rounded-[0.625rem]',
            'select-none'
          ].join(' ')}
          src={person?.imageUrl}
          alt={person?.accountName}
          loading="lazy"
          width="46"
          height="46"
        />
      )}
      {(status === 'failed' || isDefaultUrl) && (
        <span className="text-sm font-medium text-white">
          {getInitials(person?.firstName, person?.lastName)}
        </span>
      )}
    </>
  );
};
const HeroModuleFacultyAccountsHit = ({ person, index }) => {
  const hasInitials = !person?.imageUrl || person?.imageUrl === '';
  const { faculty_member_url } = useSettings();

  const speakerNameSlug = useSpeakerNameSlug(
    person.accountName,
    person.facultyWebUserId
  );

  if (hasInitials) {
    return null;
  }

  return (
    <Link
      to={`${faculty_member_url}/${speakerNameSlug}`}
      title={`${person?.accountName} - ${person?.professionalTitle}`}
      key={person?.facultyWebUserId}
      style={{ transform: `translateX(-${40 * index}%)` }}
      className="relative flex aspect-square h-[50px] w-[50px] transform select-none items-center justify-center overflow-hidden rounded-full border-2 border-white bg-primary"
    >
      <HeroModuleFacultyAccountsHitImage
        person={person}
        key={person?.facultyWebUserId}
      />
    </Link>
  );
};

const HeroModuleFacultyAccountsHits = ({ facultyImageCount }) => {
  const { hits } = useHits();
  const validHits = hits.filter(
    (person) => !(!person?.imageUrl || person?.imageUrl === '')
  );
  const slicedHits = validHits.slice(0, facultyImageCount);

  const facultyComponents = useMemo(() => {
    return slicedHits.map((person, index) => {
      return (
        <HeroModuleFacultyAccountsHit
          key={person?.facultyWebUserId}
          person={person}
          index={index + 2}
        />
      );
    });
  }, [slicedHits]);

  return <>{facultyComponents}</>;
};

HeroModuleFacultyAccountsHits.propTypes = {
  facultyImageCount: PropTypes.string
};

const HeroModuleFacultyAccounts = ({ facultyImageCount }) => {
  const ref = useRef();
  const [randomPage, setRandomPage] = useState(null);
  const [hitsPerPage, setHitsPerPage] = useState(0);

  useEffect(() => {
    setRandomPage(randomIntegerInRange(0, 15));
  }, []);

  useEffect(() => {
    setHitsPerPage(Number(facultyImageCount));
  }, []);

  if (randomPage === null || hitsPerPage === 0) {
    return null;
  }

  // NBI-297: increasing the number of hits from algolia here to give us more profiles -- thus increasing the
  // chances of returning good data with valid images, currently NBI is not returning enough good images to fill the FSD

  return (
    <div className="relative flex transform" ref={ref}>
      <Index indexName={AlgoliaFacultyAccountsIndexName}>
        <Configure
          clickAnalytics={true}
          analytics={true}
          hitsPerPage={hitsPerPage * 4} // increased here
          page={randomPage}
          filters={`hideFromDirectory:false`}
          attributesToRetrieve={[
            'facultyWebUserId',
            'accountName',
            'professionalTitle',
            'imageUrl',
            'lastName',
            'firstName'
          ]}
          attributesToHighlight={[]}
          responseFields={['hits']}
        />
        <HeroModuleFacultyAccountsHits facultyImageCount={facultyImageCount} />
      </Index>
    </div>
  );
};

const MemoHeroModuleFacultyAccounts = memo(HeroModuleFacultyAccounts);
export default MemoHeroModuleFacultyAccounts;

HeroModuleFacultyAccounts.propTypes = {
  facultyImageCount: PropTypes.string
};

HeroModuleFacultyAccountsHitImage.propTypes = {
  person: PropTypes.shape({
    facultyWebUserId: PropTypes.number,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    accountName: PropTypes.string,
    companyName: PropTypes.string,
    professionalTitle: PropTypes.string,
    billAddress: PropTypes.string,
    website: PropTypes.string,
    accountFacultyBio: PropTypes.string,
    hideFromDirectory: PropTypes.bool,
    imageUrl: PropTypes.string,
    areasOfPractice: PropTypes.arrayOf(PropTypes.string),
    courses: PropTypes.array,
    badges: PropTypes.shape({
      'outstanding-faculty': PropTypes.shape({
        years: PropTypes.array
      })
    }),
    objectID: PropTypes.string,
    _highlightResult: PropTypes.shape({
      accountName: PropTypes.shape({
        value: PropTypes.string,
        matchLevel: PropTypes.string,
        matchedWords: PropTypes.array
      }),
      companyName: PropTypes.shape({
        value: PropTypes.string,
        matchLevel: PropTypes.string,
        matchedWords: PropTypes.array
      }),
      billAddress: PropTypes.shape({
        value: PropTypes.string,
        matchLevel: PropTypes.string,
        matchedWords: PropTypes.array
      }),
      areasOfPractice: PropTypes.arrayOf(
        PropTypes.shape({
          value: PropTypes.string,
          matchLevel: PropTypes.string,
          matchedWords: PropTypes.array
        })
      )
    })
  })
};
HeroModuleFacultyAccountsHit.propTypes = {
  index: PropTypes.number,
  person: PropTypes.shape({
    facultyWebUserId: PropTypes.number,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    accountName: PropTypes.string,
    companyName: PropTypes.string,
    professionalTitle: PropTypes.string,
    billAddress: PropTypes.string,
    website: PropTypes.string,
    accountFacultyBio: PropTypes.string,
    hideFromDirectory: PropTypes.bool,
    imageUrl: PropTypes.string,
    areasOfPractice: PropTypes.arrayOf(PropTypes.string),
    courses: PropTypes.array,
    badges: PropTypes.shape({
      'outstanding-faculty': PropTypes.shape({
        years: PropTypes.array
      })
    }),
    objectID: PropTypes.string,
    _highlightResult: PropTypes.shape({
      accountName: PropTypes.shape({
        value: PropTypes.string,
        matchLevel: PropTypes.string,
        matchedWords: PropTypes.array
      }),
      companyName: PropTypes.shape({
        value: PropTypes.string,
        matchLevel: PropTypes.string,
        matchedWords: PropTypes.array
      }),
      billAddress: PropTypes.shape({
        value: PropTypes.string,
        matchLevel: PropTypes.string,
        matchedWords: PropTypes.array
      }),
      areasOfPractice: PropTypes.arrayOf(
        PropTypes.shape({
          value: PropTypes.string,
          matchLevel: PropTypes.string,
          matchedWords: PropTypes.array
        })
      )
    })
  })
};

import { useProduct } from '@shopify/hydrogen-react';
import PropTypes from 'prop-types';
import { useState } from 'react';
import SvgIcon from '@/components/SvgIcon';
import SpeakerModal from '@/components/modals/SpeakerModal';
import useSettings from '@/hooks/useSettings';
import fullSpeakerName from '@/utils/fullSpeakerName';

const Speaker = ({ speaker }) => {
  return (
    <div className="flex items-center gap-2.5 text-left">
      {speaker['profile-image'] ? (
        <img
          className="h-20 w-20 rounded-full object-cover md:h-[100px] md:w-[100px]"
          src={speaker['profile-image']}
          alt={`Image of ${speaker['first-name']} ${speaker['last-name']}`}
          loading="lazy"
        />
      ) : (
        <span className="profile__badge h-20 w-20 text-h3-mobile md:h-[100px] md:w-[100px] lg:text-h3">
          {speaker['first-name'].charAt(0)}
          {speaker['last-name'].charAt(0)}
        </span>
      )}
      <div className="flex-1">
        <p
          className="font-semibold"
          dangerouslySetInnerHTML={{
            __html: fullSpeakerName(speaker, '&nbsp;')
          }}
        ></p>
        <p className="text-callout font-normal">{speaker['law-firm']}</p>
      </div>
      <SvgIcon className="icon-plus" width={22} height={22} name="plus" />
    </div>
  );
};

Speaker.propTypes = {
  speaker: PropTypes.any
};

const Speakers = () => {
  const { product } = useProduct();
  const { metafields } = product;
  const { speakers } = metafields.course;
  const { dispatch } = useSettings();
  const [currentSpeaker, setCurrentSpeaker] = useState(null);

  return (
    <div className="mb-10">
      {currentSpeaker && (
        <SpeakerModal
          currentSpeaker={currentSpeaker}
          setCurrentSpeaker={setCurrentSpeaker}
        />
      )}
      <h4 className="mb-10 text-h2-mobile leading-none lg:text-h2">Speakers</h4>
      <div className="grid gap-2.5 md:grid-cols-2 md:gap-x-6 md:gap-y-4">
        {speakers &&
          Object.entries(speakers).map(([key, value]) => {
            const speaker =
              typeof value == 'string' ? JSON.parse(value) : value;
            return (
              <button
                key={key}
                type="button"
                className="rounded-md border border-grey p-5"
                aria-label={`Read ${speaker['first-name']} ${speaker['last-name']}'s bio.`}
                onClick={() => {
                  setCurrentSpeaker(speaker);
                  dispatch({
                    type: 'SET_MODAL',
                    data: { name: 'speaker', state: true }
                  });
                }}
              >
                <Speaker speaker={speaker} />
              </button>
            );
          })}
      </div>
    </div>
  );
};

Speakers.propTypes = {
  speakers: PropTypes.any
};

export default Speakers;

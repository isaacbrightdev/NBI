import PropTypes from 'prop-types';
import slugify from 'slugify';
import Link from '@/components/Link';
import Modal from '@/components/Modal';
import SvgIcon from '@/components/SvgIcon';
import useSettings from '@/hooks/useSettings';
import useSpeakerNameSlug from '@/hooks/useSpeakerNameSlug';

const SpeakerModal = ({ currentSpeaker, setCurrentSpeaker }) => {
  const { dispatch, faculty_member_url } = useSettings();
  // Note: In some instances, the 'first-name' field will contain two names
  // for example: the 'first-name' field will contain Eric Stephan for Eric Stephan Bailey
  const speakerName = currentSpeaker ? currentSpeaker['account-name'] : '';
  const slug = slugify(speakerName);

  const speakerNameSlug = useSpeakerNameSlug(
    slug,
    currentSpeaker.facultyWebUserId
  );

  let bioText = currentSpeaker['bio-text'];

  if (bioText.startsWith('<p>'))
    bioText = `${bioText.slice(0, bioText.indexOf('<p>') + 3)}${speakerName} ${bioText.slice(bioText.indexOf('<p>') + 3)}`;
  else bioText = `${speakerName} ${bioText}`;

  return currentSpeaker ? (
    <Modal name="speaker" title="Speaker Bio">
      {currentSpeaker['profile-image'] ? (
        <img
          className="mb-8 h-40 w-40 rounded-full object-cover"
          src={currentSpeaker['profile-image']}
          alt={`Image of ${currentSpeaker['account-name']}`}
          loading="lazy"
        />
      ) : (
        <span className="profile__badge mb-8 h-20 w-20 text-h2-mobile lg:h-40 lg:w-40 lg:text-h2">
          {currentSpeaker['first-name'].charAt(0)}
          {currentSpeaker['last-name'].charAt(0)}
        </span>
      )}
      <h3 className="text-h3-mobile leading-normal lg:text-h3">
        {speakerName}
      </h3>
      <p className="mb-8">{currentSpeaker['law-firm']}</p>
      <div dangerouslySetInnerHTML={{ __html: bioText }}></div>
      <div className="mt-10 flex justify-between">
        <button
          className="text-sm-body text-secondary underline"
          type="button"
          onClick={() => {
            dispatch({
              type: 'SET_MODAL',
              data: { name: 'speaker', state: false }
            });
            setCurrentSpeaker(null);
          }}
        >
          Close
        </button>
        <Link
          className="btn btn--accent flex items-center gap-2.5"
          to={`${faculty_member_url}/${speakerNameSlug}`}
        >
          View Full Profile
          <SvgIcon
            className="icon-arrow rotate-180 text-inherit"
            width={15}
            height={15}
            name="arrow"
          />
        </Link>
      </div>
    </Modal>
  ) : (
    <Modal name="speaker" title="Speaker Bio"></Modal>
  );
};

SpeakerModal.propTypes = {
  currentSpeaker: PropTypes.object,
  setCurrentSpeaker: PropTypes.func
};

export default SpeakerModal;

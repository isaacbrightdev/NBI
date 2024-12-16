import PropTypes from 'prop-types';
import Link from '@/components/Link';
import useSettings from '@/hooks/useSettings';
import useSpeakerNameSlug from '@/hooks/useSpeakerNameSlug';

const SpeakerProfile = ({ speaker, index, speakerInitialsArray }) => {
  const { 'profile-image': profileImage } = speaker;
  const { faculty_member_url } = useSettings();
  // calculate the translate-x value for the profile image based on the index
  // this is to overlap the profile images
  const position = 25 * index;
  const offsetX = index > 0 ? `translateX(-${position}px)` : 'translateX(0px)';

  const speakerNameSlug = useSpeakerNameSlug(
    `${speaker['first-name']}-${speaker['last-name']}`,
    speaker.facultyWebUserId
  );

  return (
    <Link
      to={`${faculty_member_url}/${speakerNameSlug}`}
      style={{ transform: offsetX, zIndex: index, minWidth: 50 }}
      className="relative z-10"
    >
      {profileImage ? (
        <img
          alt={`${speaker['first-name']} ${speaker['last-name']}`}
          title={`${speaker['first-name']} ${speaker['last-name']}`}
          src={profileImage}
          width={50}
          height={50}
          className="h-[50px] w-[50px] rounded-full border-2 border-white object-cover"
          loading="lazy"
        />
      ) : (
        <div className="profile__badge h-[50px] w-[50px]">
          <span className="text-sm font-medium text-white">
            {speakerInitialsArray[index]}
          </span>
        </div>
      )}
    </Link>
  );
};

SpeakerProfile.propTypes = {
  speaker: PropTypes.shape({
    'first-name': PropTypes.string,
    'last-name': PropTypes.string,
    'law-firm': PropTypes.string,
    'bio-text': PropTypes.string,
    facultyWebUserId: PropTypes.string,
    'profile-image': PropTypes.string
  }),
  index: PropTypes.number,
  speakerInitialsArray: PropTypes.array
};

export default SpeakerProfile;

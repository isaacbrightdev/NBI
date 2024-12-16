import PropTypes from 'prop-types';
import Link from '@/components/Link';
import useMediaImage from '@/hooks/useMediaImage';
import useMetaobject from '@/hooks/useMetaobject';
import useSettings from '@/hooks/useSettings';

const FooterSocialMediaIcon = ({ icon }) => {
  const { url, altText, width, height } = useMediaImage(icon);

  return <img loading="lazy" src={url} alt={altText ? altText : 'Social Icon'} width={width} height={height} />;
};

FooterSocialMediaIcon.propTypes = {
  icon: PropTypes.string
};

const FooterSocialMediaLink = ({ id }) => {
  const { fields } = useMetaobject(id, 20);

  return fields ? (
    <Link to={fields.link} target="_blank" rel="noopener noreferrer">
      <FooterSocialMediaIcon icon={fields.icon} />
    </Link>
  ) : null;
};

FooterSocialMediaLink.propTypes = {
  id: PropTypes.string
};

const FooterSocialMediaLinks = () => {
  const { social_media_links } = useSettings();
  const ids = JSON.parse(social_media_links ? social_media_links : null);

  return (
    <div className="mx-[auto] mb-10 mt-[62px] grid w-[184px] grid-cols-3 items-center gap-4 md:mx-0 md:mb-0 md:mt-[50px]">
      {ids.map((id) => (
        <FooterSocialMediaLink key={id} id={id} />
      ))}
    </div>
  );
};

export default FooterSocialMediaLinks;

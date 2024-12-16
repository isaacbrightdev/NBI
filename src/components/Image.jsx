import { Image as HydrogenImage } from '@shopify/hydrogen-react';
import PropTypes from 'prop-types';
import useMediaImage from '@/hooks/useMediaImage';
import GradientCircles from './svg/GradientCirlces';

export const FallBack = ({ className = '', ...rest }) => (
  <div className={`overflow-hidden ${className}`} {...rest}>
    <GradientCircles
      className={[
        'object-cover',
        'object-right-bottom',
        'w-full',
        'h-full',
        'block',
        'scale-[2]'
      ].join(' ')}
    />
  </div>
);

FallBack.propTypes = {
  className: PropTypes.string
};

const SrcImage = ({ src, ...rest }) => <img loading="lazy" src={src} {...rest} />;

SrcImage.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string
};

const Image = ({ id = null, src = null, data = null, ...rest }) => {
  const imageFromId = useMediaImage(id);
  if (id == null && src == null) {
    return <FallBack {...rest} />;
  }

  if (src) {
    return <SrcImage src={src} {...rest} />;
  }

  const imageData = imageFromId ?? data;

  return imageData ? (
    <HydrogenImage data={imageData} {...rest} />
  ) : (
    <FallBack {...rest} />
  );
};

Image.propTypes = {
  id: PropTypes.string,
  src: PropTypes.string,
  data: PropTypes.object
};

export default Image;

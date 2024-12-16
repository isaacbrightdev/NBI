import PropTypes from 'prop-types';
import { useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import SvgIcon from '@/components/SvgIcon';

const ProductBannerLinks = ({ title }) => {
  const [value] = useState(window.location.href);
  const [copied, setCopied] = useState(false);

  const handleLinkClick = () => {
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  const confirmationClass = [
    'scale-75',
    'lg:scale-100',
    'absolute',
    'motion-reduce:transition-none',
    'transition-opacity',
    'duration-1000',
    'ease-out',
    '-right-6',
    'lg:right-0',
    'top-16',
    'lg:top-20',
    'rounded-[500px]',
    'px-5',
    'py-2',
    'bg-primary',
    'text-white',
    'flex',
    'items-center'
  ];

  return (
    <>
      {/* copies a link to the current product url */}
      <div className="flex justify-center text-primary">
        <CopyToClipboard text={value} onCopy={handleLinkClick}>
          <button
            role="button"
            className="flex items-center justify-center px-2"
          >
            <SvgIcon className="icon-link mr-1" name="link" />
          </button>
        </CopyToClipboard>
        {/* direct link to mailto: - opens an email client */}
        <a
          className="text-primary"
          href={`mailto:?subject=NBI | ${title}&body=NBI Course for legal professionals: ${value}`}
        >
          <SvgIcon className="icon-email mr-2" name="email" />
        </a>
      </div>
      {/* confirmation message for the copy link fn (hidden by default) */}
      <div
        className={[
          ...confirmationClass,
          ...(copied ? ['opacity-100'] : ['opacity-0'])
        ].join(' ')}
      >
        <SvgIcon
          className="icon-check mr-2"
          name="check"
          width={20}
          height={20}
        />
        Copied To Clipboard
      </div>
    </>
  );
};

ProductBannerLinks.propTypes = {
  title: PropTypes.string
};

export default ProductBannerLinks;

import PropTypes from 'prop-types';
import { useState } from 'react';
import SvgIcon from '@/components/SvgIcon';

const BrochureWording = ({ wording, variant }) => {
  const [collapsed, setCollapsed] = useState(true);

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div>
      <p
        className={`${
          collapsed ? 'py-4' : 'pt-4'
        } cursor-pointer border-t border-t-gray-200 align-middle text-sm-body font-semibold uppercase tracking-[1.4px] text-primary`}
        onClick={toggleCollapse}
      >
        <SvgIcon
          name={collapsed ? 'plus' : 'minus'}
          width={16}
          height={16}
          className="mb-1 mr-3 inline"
        />
        {variant.title.split('-')[0]} - {wording.creditTitle} -{' '}
        {variant.title.split('-')[1]}
      </p>
      {!collapsed && (
        <div>
          {wording.creditLogoSlug &&
            window.CreditLogos?.[wording.creditLogoSlug] && (
              <img
                className="my-2"
                src={window.CreditLogos[wording.creditLogoSlug]}
                loading="lazy"
                alt="Credit Logo"
              />
            )}
          {variant.wording && (
            <div
              dangerouslySetInnerHTML={{ __html: variant.wording }}
              className="my-5 text-sm-body text-primary"
            ></div>
          )}
          {variant['specialty-wording'] && (
            <div
              dangerouslySetInnerHTML={{ __html: variant['specialty-wording'] }}
              className="my-5 text-sm-body text-primary"
            ></div>
          )}
        </div>
      )}
    </div>
  );
};

BrochureWording.propTypes = {
  wording: PropTypes.any,
  variant: PropTypes.any
};

export default BrochureWording;

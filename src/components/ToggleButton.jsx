import PropTypes from 'prop-types';
import { useState } from 'react';
import SvgIcon from '@/components/SvgIcon';

const ToggleButton = ({
  id,
  label,
  isChecked = false,
  isDisabled = false,
  ...rest
}) => {
  const [checked, setChecked] = useState(isChecked);

  return (
    <div {...rest}>
      <label
        className="toggle-wrapper"
        tabIndex={0}
        htmlFor={id}
        onKeyUp={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && !isDisabled) {
            setChecked(!checked);
          }
        }}
      >
        <input
          id={id}
          type="checkbox"
          aria-checked={checked}
          checked={checked}
          disabled={isDisabled}
          className="toggle"
          onChange={() => setChecked(!checked)}
        />
        <span className="toggle-button">
          <SvgIcon width={11} height={9} className="icon-check" name="check" />
        </span>
        <span className="sr-only">{label}</span>
      </label>
    </div>
  );
};

ToggleButton.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  isChecked: PropTypes.bool,
  isDisabled: PropTypes.bool
};

export default ToggleButton;

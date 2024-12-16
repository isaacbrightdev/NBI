import PropTypes from 'prop-types';
import { useState } from 'react';

const RadioButton = ({
  id,
  label,
  isChecked = false,
  isDisabled = false,
  namespace,
  ...props
}) => {
  const [checked, setChecked] = useState(isChecked);

  return (
    <label
      className="flex items-center gap-2"
      tabIndex={0}
      htmlFor={id}
      onKeyUp={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && !isDisabled) {
          setChecked(!checked);
        }
      }}
      {...props}
    >
      <input
        id={id}
        name={namespace}
        type="radio"
        aria-checked={checked}
        checked={checked}
        disabled={isDisabled}
        className="cursor-pointer rounded-full !border-current bg-white checked:bg-white checked:bg-none checked:hover:bg-white"
        onChange={() => setChecked(!checked)}
      />
      <span>{label}</span>
    </label>
  );
};

RadioButton.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  isChecked: PropTypes.bool,
  isDisabled: PropTypes.bool,
  namespace: PropTypes.string
};

export default RadioButton;

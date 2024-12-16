import PropTypes from 'prop-types';

const ToggleSwitch = ({
  options = [],
  selectedIndex,
  setValFunc,
  onChangeFunc,
  ...rest
}) => {
  const handleChange = (e) => {
    if (setValFunc) {
      setValFunc(e.target.value);
    }

    if (onChangeFunc) {
      onChangeFunc(e.target.value);
    }
  };

  return (
    <div className="switch" {...rest}>
      <input
        type="radio"
        id={options[0].id}
        name={options[0].name}
        value={options[0].value}
        aria-checked={0 === selectedIndex}
        checked={0 === selectedIndex}
        onChange={handleChange}
      />
      <label htmlFor={options[0].id} tabIndex={0}>
        {options[0].label}
      </label>
      <input
        type="radio"
        id={options[1].id}
        name={options[1].name}
        value={options[1].value}
        aria-checked={1 === selectedIndex}
        checked={1 === selectedIndex}
        onChange={handleChange}
      />
      <label htmlFor={options[1].id} tabIndex={0}>
        {options[1].label}
      </label>
      <div className="switch-wrapper">
        <div className="switch-options">
          {options.map((option, i) => {
            return (
              <div className="switch-option" key={i}>
                {option.label}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

ToggleSwitch.propTypes = {
  options: PropTypes.array,
  selectedIndex: PropTypes.any,
  setValFunc: PropTypes.func,
  onChangeFunc: PropTypes.func
};

export default ToggleSwitch;

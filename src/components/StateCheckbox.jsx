import PropTypes from 'prop-types';
import Checkbox from '@/components/Checkbox';

// this is the component that renders the checkbox
const StateCheckbox = ({
  id,
  label,
  isChecked,
  isDisabled,
  namespace,
  creditKey,
  stateKey,
  handleCheckboxChange
}) => {
  return (
    <div className="mb-3">
      <Checkbox
        id={id}
        label={label}
        isChecked={isChecked}
        isDisabled={isDisabled}
        namespace={namespace}
        onChange={(checkedValue) =>
          handleCheckboxChange(creditKey, stateKey, checkedValue)
        }
      />
    </div>
  );
};

StateCheckbox.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  isChecked: PropTypes.bool,
  isDisabled: PropTypes.bool,
  creditType: PropTypes.string,
  stateKey: PropTypes.string,
  namespace: PropTypes.string,
  onChange: PropTypes.func,
  handleCheckboxChange: PropTypes.func.isRequired,
  creditKey: PropTypes.string.isRequired
};

export default StateCheckbox;

import PropTypes from 'prop-types';

const Checkbox = ({
  id,
  label,
  isChecked = false,
  isDisabled = false,
  namespace,
  onChange,
  checkboxClassName = 'border-primary text-primary',
  className = 'flex items-center gap-2',
  isRichTextLabel = false,
  children,
  ...rest
}) => {
  const Label = () =>
    isRichTextLabel ? (
      <span dangerouslySetInnerHTML={{ __html: label }}></span>
    ) : (
      <span>{label}</span>
    );

  return (
    <label
      className={`${className} cursor-pointer`}
      tabIndex={0}
      htmlFor={id}
      {...rest}
    >
      <input
        id={id}
        name={namespace}
        type="checkbox"
        aria-checked={isChecked}
        checked={isChecked}
        disabled={isDisabled}
        className={checkboxClassName}
        onChange={(e) => {
          if (onChange) {
            onChange(e.target.checked);
          }
        }}
      />
      {label && <Label />}
      {children}
    </label>
  );
};

Checkbox.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  isChecked: PropTypes.bool,
  isDisabled: PropTypes.bool,
  namespace: PropTypes.string,
  props: PropTypes.any,
  checkboxClassName: PropTypes.any,
  className: PropTypes.any,
  onChange: PropTypes.func,
  isRichTextLabel: PropTypes.bool,
  children: PropTypes.any
};

export default Checkbox;

import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import SvgIcon from '@/components/SvgIcon';

const SelectDropdown = ({
  label: defaultLabel,
  options = [],
  defaultOptionIndex,
  namespace = 'option',
  type = 'select',
  setValFunc,
  onChangeFunc,
  sortLabel = 'Sort by ',
  ...rest
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false),
    [selected, setSelected] = useState(defaultOptionIndex ?? 0),
    setOptionLabel = (option) => {
      return option.indexOf(':') > -1 ? option.split(':')[1] : option;
    },
    setOptionValue = (option) => {
      return option.indexOf(':') > -1 ? option.split(':')[0] : option;
    },
    [label, setLabel] = useState(
      defaultLabel
        ? defaultLabel
        : setOptionLabel(options[defaultOptionIndex ?? 0])
    );

  const selectOptionAndClose = (index) => {
      setSelected(index);
      setIsDropdownOpen(false);

      if (setValFunc) {
        setValFunc(setOptionValue(options[index]));
      }

      if (onChangeFunc) {
        onChangeFunc(setOptionValue(options[index]));
      }
    },
    registerOpenDropdownHandlers = ({
      optionsLength,
      selected,
      setSelected
    }) => {
      const keyDownCallback = (keyDownEvent) => {
        switch (keyDownEvent.key) {
          case 'Up':
          case 'ArrowUp':
            keyDownEvent.preventDefault();
            setSelected(selected <= 0 ? optionsLength - 1 : selected - 1);
            return;
          case 'Down':
          case 'ArrowDown':
            keyDownEvent.preventDefault();
            setSelected(selected + 1 === optionsLength ? 0 : selected + 1);
            return;
          case 'Enter':
          case ' ': // Space
            keyDownEvent.preventDefault();
            selectOptionAndClose(selected);
            return;
          case 'Esc':
          case 'Escape':
            keyDownEvent.preventDefault();
            selectOptionAndClose(selected);
            return;
          case 'PageUp':
          case 'Home':
            keyDownEvent.preventDefault();
            setSelected(0);
            return;
          case 'PageDown':
          case 'End':
            keyDownEvent.preventDefault();
            setSelected(optionsLength - 1);
            return;
        }
      };
      document.addEventListener('keydown', keyDownCallback);
      return () => {
        document.removeEventListener('keydown', keyDownCallback);
      };
    };

  useEffect(() => {
    if (isDropdownOpen) {
      return registerOpenDropdownHandlers({
        selected,
        setSelected,
        optionsLength: options.length
      });
    }
  }, [isDropdownOpen, selected]);

  useEffect(() => {
    if (type === 'sort') {
      setLabel(`${sortLabel} ${setOptionLabel(options[defaultOptionIndex])}`);
    }

    if (defaultOptionIndex !== undefined && type !== 'sort') {
      setLabel(setOptionLabel(options[defaultOptionIndex]));
    }
  }, [type, selected, options, defaultOptionIndex]);

  return (
    <div className="select--custom-wrapper" {...rest}>
      <button
        className="select--custom-label"
        role="combobox"
        aria-haspopup="listbox"
        aria-controls={`${namespace}_dropdown`}
        aria-labelledby={`${namespace}_label`}
        aria-expanded={isDropdownOpen}
        aria-activedescendant={`${namespace}_element_${options[selected]}`}
        onClick={() => {
          setIsDropdownOpen(!isDropdownOpen);
        }}
      >
        {label}{' '}
        <SvgIcon className="icon--caret ml-2" name="caret-down" width={12} />
      </button>
      <ul
        role="listbox"
        id={`${namespace}_dropdown`}
        tabIndex={-1}
        aria-multiselectable={false}
        className="select--custom-options"
      >
        {options.map((option, i) => {
          const optionLabel = setOptionLabel(option);
          const optionValue = setOptionValue(option);
          return (
            <li
              key={`${optionLabel}-${i}`}
              id={`${namespace}_element_${option}`}
              aria-selected={i === selected}
              role="option"
              className="select--custom-option"
            >
              <label
                htmlFor={`${namespace}-${i}`}
                className="select--custom-option-label"
              >
                <input
                  type="radio"
                  className="select--custom-option-radio"
                  name={`${namespace}_radio`}
                  id={`${namespace}-${i}`}
                  value={optionValue}
                  aria-checked={selected === i}
                  checked={selected === i}
                  onChange={() => selectOptionAndClose(i)}
                />
                {optionLabel}
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

SelectDropdown.propTypes = {
  options: PropTypes.array,
  label: PropTypes.string,
  defaultOptionIndex: PropTypes.number,
  namespace: PropTypes.string,
  type: PropTypes.string,
  setValFunc: PropTypes.func,
  onChangeFunc: PropTypes.func,
  sortLabel: PropTypes.string
};

export default SelectDropdown;

const jurisdictionKeysToCheckboxState = (jurisdictionKeys) => {
  if (!jurisdictionKeys) {
    return {};
  }

  const checkboxState = {};

  jurisdictionKeys.forEach((key) => {
    checkboxState[key] = {
      isChecked: true
    };
  });

  return checkboxState;
};

export default jurisdictionKeysToCheckboxState;

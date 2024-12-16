const checkboxStateToJurisdictionKeys = (checkboxState) => {
  if (!checkboxState) {
    return [];
  }
  const jurisdictionKeys = Object.keys(checkboxState).filter((key) => {
    return checkboxState[key].isChecked;
  });
  return jurisdictionKeys;
};

export default checkboxStateToJurisdictionKeys;

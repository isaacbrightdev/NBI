const addHoursToDate = (date, hours) => {
  const addMlSeconds = hours * 60 * 60 * 1000;

  return new Date(date * 1000 + addMlSeconds);
};

export default addHoursToDate;

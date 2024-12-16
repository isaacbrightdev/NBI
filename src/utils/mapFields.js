const mapFields = (fields) => {
  return fields.reduce(
    (acc, { key, value }) => ({
      ...acc,
      [key]: value
    }),
    {}
  );
};

export default mapFields;

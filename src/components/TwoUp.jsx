import PropTypes from 'prop-types';

const TwoUp = ({ fields }) => {
  return (
    <div className="two-up">
      <h4>{fields.title}</h4>
    </div>
  );
};

TwoUp.propTypes = {
  fields: PropTypes.any
};

export default TwoUp;

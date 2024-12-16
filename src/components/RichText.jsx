import PropTypes from 'prop-types';

const RichText = ({ root }) => {
  return (
    <>
      {root.children.map((child, index) => {
        switch (child.type) {
          case 'paragraph':
            return (
              <p key={`${child.type}_${index}`}>
                {child.children.map((child, index) => {
                  const spanClass = [];

                  if (child.bold) spanClass.push('font-bold');
                  if (child.italic) spanClass.push('italic');

                  return spanClass.length ? (
                    <span
                      key={`${child.type}_${index}`}
                      className={spanClass.join(' ')}
                    >
                      {child.value}
                    </span>
                  ) : (
                    child.value
                  );
                })}
              </p>
            );
        }
      })}
    </>
  );
};

RichText.propTypes = {
  root: PropTypes.shape({
    type: PropTypes.string,
    children: PropTypes.array
  })
};

export default RichText;

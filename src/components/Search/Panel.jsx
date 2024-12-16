import PropTypes from 'prop-types';

export function Panel({ children, header, footer }) {
  return (
    <div className="ais-Panel disclosure-panel flex flex-col">
      {header && (
        <div className="ais-Panel-header relative flex w-full items-center rounded-none border-0 bg-white py-3 text-left text-h4-mobile font-medium leading-snug text-primary">
          {header}
        </div>
      )}
      <div className="ais-Panel-body pb-3">{children}</div>
      {footer && <div className="ais-Panel-footer">{footer}</div>}
    </div>
  );
}

Panel.propTypes = {
  children: PropTypes.any,
  header: PropTypes.any,
  footer: PropTypes.any
};

export default Panel;

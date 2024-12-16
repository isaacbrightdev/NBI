import log from 'loglevel';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import TwoUp from '@/components/TwoUp';
import mapFields from '@/utils/mapFields';
import shopify from '@/utils/shopify-api';

const QUERY = `#graphql
  query($handle: MetaobjectHandleInput) {
    metaobject(handle: $handle) {
      fields {
        key
        value
      }
    }
  }
`;

const SECTIONS = (fields) => ({
  two_up: <TwoUp fields={fields} />
});

const Section = ({ element }) => {
  const [fields, setFields] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const { metaobject } = await shopify.query(QUERY, {
          handle: {
            type: element.dataset.metaType,
            handle: element.dataset.metaHandle
          }
        });

        setFields(mapFields(metaobject.fields));
      } catch (error) {
        log.error(error);
      }
    };

    load();
  }, []);

  return fields
    ? createPortal(SECTIONS(fields)[element.dataset.metaType], element)
    : null;
};

Section.propTypes = {
  element: PropTypes.any
};

export default Section;

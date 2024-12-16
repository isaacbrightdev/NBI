import { useProduct } from '@shopify/hydrogen-react';
// import log from 'loglevel';
import PropTypes from 'prop-types';
import { useMemo } from 'react';

const returnLocaleTime = (date, time) => {
  const eventDate = new Date(date * 1000);
  const [timePart, period] = time.split(' ');
  let [hours, minutes] = timePart.split(':').map(Number);

  if (period === 'PM' && hours !== 12) {
    hours += 12;
  } else if (period === 'AM' && hours === 12) {
    hours = 0;
  }

  const utcDate = new Date(Date.UTC(
    eventDate.getUTCFullYear(),
    eventDate.getUTCMonth(),
    eventDate.getUTCDate(),
    hours,
    minutes
  ));

  return utcDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit'
  });
};

const AgendaDetail = ({ detail, eventDate }) => {
  const startTime = useMemo(() => {
    return returnLocaleTime(eventDate, detail['scheduled-start-time']);
  }, [detail]);
  const endTime = useMemo(() => {
    return returnLocaleTime(eventDate, detail['scheduled-end-time']);
  }, [detail]);

  return (
    <li className="agenda__detail border-lineColor relative mb-4 flex gap-2 rounded-lg border p-5">
      <div className="agenda__detail-content">
        <p className="leading mb-2 text-sm-body font-medium uppercase text-secondary">
          {startTime} - {endTime} | {detail.speaker}
        </p>
        <h4 className="leading mb-2 text-h4-mobile lg:text-h4">
          {detail.topic}
        </h4>
        <div dangerouslySetInnerHTML={{ __html: detail.description }} />
      </div>
    </li>
  );
};

AgendaDetail.propTypes = {
  detail: PropTypes.object,
  eventDate: PropTypes.object
};

const AgendaDetails = () => {
  const { product } = useProduct();
  const { metafields } = product;
  const { agenda } = metafields;
  const { details, style } = agenda ? agenda : {};
  const styles = { enumerated: 'agenda--roman-numerals', plain: '' };

  const timeZoneName = useMemo(() => {
    const date = new Date().toLocaleDateString('en-US', {
      day: '2-digit',
      timeZoneName: 'long'
    });
    return date.substring(4);
  }, []);

  if (!details) return null;

  return (
    <section key={details.key} className="product__section">
      <hr className="my-12 bg-grey" />
      <h2 className="text-h2-mobile leading-none lg:text-h2">Agenda</h2>
      <p className="mb-10 mt-2 text-grey-dark">
        All times are shown in {timeZoneName}.
      </p>
      <ol className={`agenda ${styles[style]}`}>
        {details.map((detail, i) => (
          <AgendaDetail key={i} detail={detail} eventDate={metafields.course['event-date-timestamp']} />
        ))}
      </ol>
      {metafields?.course && 'who_should_attend' in metafields.course && (
        <div
          className="who_should_attend mt-10"
          dangerouslySetInnerHTML={{
            __html: metafields.course['who_should_attend']
          }}
        />
      )}
    </section>
  );
};

AgendaDetails.propTypes = {
  details: PropTypes.any,
  style: PropTypes.any
};

export default AgendaDetails;

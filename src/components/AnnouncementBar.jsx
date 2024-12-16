import PropTypes from 'prop-types';
import Link from '@/components/Link';
import useSessionStorage from '@/hooks/useSessionStorage';

const AnnouncementBar = ({ fields }) => {
  const [hideAnnouncementBar, setHideAnnouncementBar] = useSessionStorage(
    'HideAnnouncementBar',
    false
  );

  if (hideAnnouncementBar) {
    return false;
  }

  return (
    <div className="relative bg-warn-light py-2.5">
      <div className="announcement-bar container-fluid gx-sm max-w-screen-2xl text-sm-body text-primary xl:gx-xl">
        <div className="items-center xl:row xl-max:flex">
          <div className="xl:col-3 xl-max:hidden">
            <strong className="mr-1.5">{fields.phone_number_message}</strong>
            {fields.phone_number}
          </div>
          <div className="flex-grow text-left xl:col-auto xl:col-6 xl:text-center">
            <span className="xl-max:hidden">{fields.message}</span>
            <Link
              className="block text-primary xl:hidden"
              to={fields.button_url}
            >
              {fields.message}
            </Link>

            {fields.button_text && (
              <Link
                className="ml-7 inline-block whitespace-nowrap rounded-full bg-primary px-[0.65em] py-[0.35em] text-center align-baseline text-sm-body font-semibold text-white xl-max:hidden"
                to={fields.button_url}
              >
                {fields.button_text}
              </Link>
            )}
          </div>
          <div className="flex flex-shrink-0 items-center justify-end xl:col-3">
            <button
              type="button"
              className="inline-block select-none whitespace-nowrap rounded-full bg-transparent p-2 align-middle text-sm-body leading-snug text-current no-underline transition-colors"
              aria-label="Close"
              onClick={() => {
                setHideAnnouncementBar(true);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 25 25"
                aria-hidden="true"
                focusable="false"
                className="pointer-events-none h-[15px] w-[15px] select-none"
              >
                <path
                  className="stroke-current"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M22 3 3 22M3 3l19 19"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

AnnouncementBar.propTypes = {
  fields: PropTypes.shape({
    message: PropTypes.string,
    button_text: PropTypes.string,
    button_url: PropTypes.string,
    phone_number: PropTypes.string,
    phone_number_message: PropTypes.string
  })
};

export default AnnouncementBar;

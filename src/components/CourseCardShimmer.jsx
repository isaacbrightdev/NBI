import PropTypes from 'prop-types';

// eslint-disable-next-line no-unused-vars
const CourseCardShimmer = ({ size = 6, display_vertical, className }) => {
  return (
    <>
      {Array(size)
        .fill()
        .map((e, i) => (
          <div
            key={i}
            className={`${className} course-card border-light-grey relative mb-4 flex min-w-0 select-none flex-col break-words rounded-[0.625rem] border border-solid bg-white bg-clip-border p-5`}
          >
            <div className="row">
              <div
                className={`col-12 ${
                  display_vertical ? 'mb-5' : 'mb-5 xl:col-4 xl:mb-0'
                }`}
              >
                <div className="course-card-image relative aspect-7/4 w-full xl:aspect-7/5">
                  <div className="absolute left-0 top-0 h-full w-full animate-pulse select-none overflow-hidden rounded-[0.625rem] bg-gradient-to-r  from-[--tw-gradient-light-stop] to-[--tw-gradient-light-stop-end] object-cover object-center"></div>
                </div>
              </div>
              <div className="col-12 flex animate-pulse flex-col justify-between xl:col">
                <div className="grid grid-cols-4 gap-1">
                  <div className="col-span-2 col-start-1 h-[1.375rem] rounded bg-grey-light"></div>
                  <div className="col-span-1 col-start-1 my-1.5 h-4 rounded bg-grey-light"></div>
                </div>
                <div className="grid grid-cols-4 gap-1">
                  <div className="col-span-4 mr-4 h-[1.375rem] rounded bg-grey-light"></div>
                  <div className="col-span-4 mr-4 h-[1.375rem] rounded bg-grey-light"></div>
                  <div className="col-span-3 mr-4 h-[1.375rem] rounded bg-grey-light"></div>
                </div>
                <div className="grid grid-cols-4 gap-1">
                  <div className="col-span-4 mt-3 h-[1.375rem] rounded bg-grey-light"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
    </>
  );
};

CourseCardShimmer.propTypes = {
  className: PropTypes.string,
  display_vertical: PropTypes.bool,
  size: PropTypes.number
};

export default CourseCardShimmer;

import CourseCardShimmer from '@/components/CourseCardShimmer';

const LoadingPage = () => {
  return (
    <div className="container">
      <div className="row justify-center">
        <div className="col-10">
          <div className="py-6">
            <CourseCardShimmer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingPage;

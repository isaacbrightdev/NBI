import PropTypes from 'prop-types';
import CourseCard from '@/components/CourseCard';
import CourseCardShimmer from '@/components/CourseCardShimmer';

const ProductRow = ({ hits }) => (
  <div className="collection gx-[0px] container-fluid max-w-full py-10">
    <div className="row">
      {!hits && (
        <div className="flex w-full snap-x flex-row gap-6 overflow-x-auto py-14">
          <CourseCardShimmer
            className={`w-[18.125rem] flex-shrink-0`}
            display_vertical={true}
            size={15}
          />
        </div>
      )}

      <div className="flex w-full snap-x flex-row gap-6 overflow-x-auto py-14">
        {hits &&
          hits.map((product) => (
            <CourseCard
              key={product.id}
              display_vertical={true}
              product={product}
              className={`w-[18.125rem] flex-shrink-0`}
            />
          ))}
      </div>
    </div>
  </div>
);

ProductRow.propTypes = {
  hits: PropTypes.array
};

export default ProductRow;

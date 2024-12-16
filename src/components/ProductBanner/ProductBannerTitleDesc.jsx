import PropTypes from 'prop-types';

const ProductBannerTitleDesc = ({ title, description }) => {
  return (
    <>
      <h1 className="max-w-[719px] text-h2-mobile font-medium leading-tight lg:text-h2 lg:font-normal">
        {title}
      </h1>
      <div className="pb-[27px] pt-[15px] lg:hidden">
        <p>{description}</p>
      </div>
    </>
  );
};

ProductBannerTitleDesc.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string
};

export default ProductBannerTitleDesc;

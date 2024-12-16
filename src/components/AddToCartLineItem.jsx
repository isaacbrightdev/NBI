import Image from '@/components/Image';
import useCustomer from '@/hooks/useCustomer';
import useMediaImage from '@/hooks/useMediaImage';
import useSettings from '@/hooks/useSettings';
import { AlgoliaProductIndexName } from '@/utils/searchClient';
import { Link } from 'react-router-dom';
import aa from 'search-insights';

// eslint-disable-next-line react/prop-types
const AddToCartLineItem = ({ product }) => {
  const customer = useCustomer();
  const productData = product;

  const { dispatch, course_block_placeholder_image } = useSettings();
  const placeholderImage = useMediaImage(course_block_placeholder_image);

  if (!productData) return null;

  let queryID = localStorage.getItem('Algolia_QueryID');

  const handleClick = () => {
    aa('convertedObjectIDsAfterSearch', {
      authenticatedUserToken: customer?.id || undefined,
      eventName: 'Product Added to Cart from Line Item',
      index: AlgoliaProductIndexName,
      objectIDs: [productData.objectID],
      queryID: queryID,
      title: productData.productTitle,
      price: productData.price,
      productType: productData.title,
      sku: productData.sku
    });
  };

  const productIncludes = JSON.parse(
    productData?.product?.included_formats?.value || '[]'
  ).join(', ');

  return (
    <div className="flex rounded border border-solid border-grey p-3 lg-max:flex-col">
      <div className="flex-shrink-0">
        <div className="relative aspect-square w-[110px]">
          <Image
            src={
              productData?.image?.url ||
              productData?.image ||
              placeholderImage.url
            }
            alt={productData?.productTitle || 'Product Image'}
            width={110}
            className="absolute top-0 h-full w-full object-cover object-center"
          />
        </div>
      </div>
      <div className="pl-4">
        <Link
          to={productData?.url}
          onClick={() => {
            dispatch({
              type: 'SET_MODAL',
              data: { name: 'addToCart', state: false }
            });
            handleClick();
          }}
        >
          <p className="pt-2 font-medium text-secondary">
            {productData?.productTitle}
          </p>
        </Link>
        {productIncludes && (
          <p className="mt-1 text-sm-body">
            <span className="font-medium">Includes:</span> {productIncludes}
          </p>
        )}
      </div>
    </div>
  );
};

export default AddToCartLineItem;

import { useProduct } from '@shopify/hydrogen-react';
import useProductState from '@/hooks/useProductState';
import SvgIcon from '../../components/SvgIcon';

const ProductLocation = () => {
  const { product } = useProduct();
  const { hasLiveInPerson } = useProductState(product);

  const productLocationImage = (
    <div className="mb-5 flex flex-col md:col md:mb-0">
      <img
        alt="Product Location Logo"
        className="mx-auto rounded-lg"
        height="400"
        loading="eager"
        src={`${window.ProductLocationSettings?.image?.image}`}
      ></img>
    </div>
  );

  return (
    <div>
      {window.ProductLocationSettings && hasLiveInPerson && (
        <div className="mb-10">
          <p className="mb-4 text-h4 font-medium leading-tight text-primary">
            The Location
          </p>
          <div className="border-lineColor rounded-lg border border-grey p-5 md:flex md:gap-5">
            {window.ProductLocationSettings.image?.imageSide == 'left' &&
              productLocationImage}
            <div className="flex flex-col justify-center md:col">
              <div className="product--location flex flex-1 flex-col items-start justify-center">
                <p className="mb-[5px] text-h3 font-medium leading-tight text-secondary">
                  {window.ProductLocationSettings.header.text}
                </p>
                {window.ProductLocationSettings.description?.text && (
                  <p className="mb-[5px]">
                    {window.ProductLocationSettings.description?.text}
                  </p>
                )}
                {(window.ProductLocationSettings.description?.address_line_1 ||
                  window.ProductLocationSettings.description?.address_line_2 ||
                  window.ProductLocationSettings.description
                    ?.address_line_3) && (
                  <p className="mb-[5px]">
                    {window.ProductLocationSettings.description?.address_line_1
                      ? window.ProductLocationSettings.description
                          ?.address_line_1
                      : ''}
                    {window.ProductLocationSettings.description
                      ?.address_line_1 &&
                    window.ProductLocationSettings.description
                      ?.address_line_2 ? (
                      <br />
                    ) : (
                      ''
                    )}
                    {window.ProductLocationSettings.description?.address_line_2
                      ? `${window.ProductLocationSettings.description?.address_line_2}`
                      : ''}
                    {window.ProductLocationSettings.description
                      ?.address_line_3 &&
                    window.ProductLocationSettings.description
                      ?.address_line_3 ? (
                      <br />
                    ) : (
                      ''
                    )}
                    {window.ProductLocationSettings.description?.address_line_3
                      ? `${window.ProductLocationSettings.description?.address_line_3}`
                      : ''}
                  </p>
                )}
                {(window.ProductLocationSettings.description?.bullet_point_1 ||
                  window.ProductLocationSettings.description?.bullet_point_2 ||
                  window.ProductLocationSettings.description
                    ?.bullet_point_3) && (
                  <ul>
                    {window.ProductLocationSettings.description
                      .bullet_point_1 && (
                      <li>
                        {
                          window.ProductLocationSettings.description
                            .bullet_point_1
                        }
                      </li>
                    )}
                    {window.ProductLocationSettings.description
                      .bullet_point_2 && (
                      <li>
                        {
                          window.ProductLocationSettings.description
                            .bullet_point_2
                        }
                      </li>
                    )}
                    {window.ProductLocationSettings.description
                      .bullet_point_3 && (
                      <li>
                        {
                          window.ProductLocationSettings.description
                            .bullet_point_3
                        }
                      </li>
                    )}
                  </ul>
                )}
                {window.ProductLocationSettings.cta?.text &&
                  window.ProductLocationSettings.cta?.url && (
                    <a
                      className="btn mt-3 flex w-fit items-center text-primary"
                      rel="noreferrer"
                      target="_blank"
                      href={window.ProductLocationSettings.cta?.url}
                    >
                      {window.ProductLocationSettings.cta?.text}{' '}
                      <SvgIcon
                        width={19.5}
                        height={10.5}
                        className="icon-arrow ml-2 rotate-180"
                        name="arrow"
                      />
                    </a>
                  )}
              </div>
            </div>
            {window.ProductLocationSettings.image?.imageSide == 'right' &&
              productLocationImage}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductLocation;

import log from 'loglevel';
import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';
import { extractVariantCreditData } from '@/hooks/useVariantCreditData';
import PRODUCT_QUERY_BY_GIDS from '@/graphql/productsFromGids';
import shopify from '@/utils/shopify-api';
import BrochureWording from './BrochureWording';

const BrochureWordingSection = ({
  savedStates,
  findMatchingStates,
  product
}) => {
  const isSeriesProduct = useMemo(
    () => product?.metafields?.bundle?.courses?.length || false,
    [product]
  );
  const [seriesProducts, setSeriesProducts] = useState([]);

  useEffect(() => {
    const load = async () => {
      if (isSeriesProduct) {
        try {
          const data = await shopify.query(PRODUCT_QUERY_BY_GIDS, {
            ids: JSON.parse(product.metafields.bundle.courses ? product.metafields.bundle.courses : '[]'),
            fields: []
          });

          if (data?.nodes && data?.nodes.length > 0) {
            const coursedata = data?.nodes
              .filter((n) => n)
              .map((course) => {
                return {
                  id: course.id,
                  title: course.title,
                  brochureWording: brochureWordingData(course)
                };
              });
            setSeriesProducts(coursedata);
          }
        } catch (error) {
          log.error('BrochureWordingSection - loading series products', error);
        }
      } else {
        setSeriesProducts([
          {
            id: product.id,
            title: product.title,
            brochureWording: brochureWordingData(product)
          }
        ]);
      }
    };

    load();

    return () => {
      setSeriesProducts([
        {
          id: product.id,
          title: product.title,
          brochureWording: brochureWordingData(product)
        }
      ]);
    };
  }, [product, savedStates]);

  const brochureWordingData = (course) => {
    try {
      const variantCreditData = extractVariantCreditData(course);
      const matchingStates = findMatchingStates(variantCreditData, savedStates);
      const matchingCredits = matchingStates.map((state) => {
        const stateData = variantCreditData.find(
          (credit) => credit['credit-title-group'] === state
        );

        if (!stateData) return;

        return {
          ...stateData
        };
      });

      return matchingCredits.map((credit) => ({
        creditTitle: credit['credit-title'],
        totalCredits: credit['credit-total'],
        creditTitleGroup: credit['credit-title-group'],
        brochureWording: credit['brochure-wording'],
        creditLogoSlug: credit['credit-logo-slug']
      }));
    } catch (error) {
      log.error('error in getSavedStateBrochureWording', error);
    }
  };

  return (
    <div className="mt-5 border-b border-solid border-b-gray-200 text-gray-500 lg:mt-10">
      <>
        {seriesProducts.map((course, index) => (
          <div key={course.id + index}>
            {isSeriesProduct && (
              <h5 className="font-medium text-secondary">{course.title}</h5>
            )}
            {course.brochureWording?.length > 0 &&
              course.brochureWording.map((wording, index) => {
                return (
                  <div
                    key={`${wording.creditTitle}-${index}`}
                    className="text-gray-500"
                  >
                    {wording.brochureWording.map((variant, subIndex) => {
                      return (
                        <BrochureWording
                          key={`${wording.creditTitle}-${index}-${subIndex}`}
                          wording={wording}
                          variant={variant}
                        />
                      );
                    })}
                  </div>
                );
              })}
          </div>
        ))}
      </>
    </div>
  );
};

BrochureWordingSection.propTypes = {
  savedStates: PropTypes.arrayOf(PropTypes.string),
  product: PropTypes.any,
  findMatchingStates: PropTypes.func
};

export default BrochureWordingSection;

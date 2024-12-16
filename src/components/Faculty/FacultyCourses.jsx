import log from 'loglevel';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import HorizontalProductWrapper from '@/components/Carousels/HorizontalProductWrapper';
import PRODUCT_QUERY_BY_GIDS from '@/graphql/productsFromGids';
import shopify from '@/utils/shopify-api';

const FacultyCourses = ({ courses, firstName }) => {
  const [facultyCourseData, setFacultyCourseData] = useState([]);
  const carouselRef = useRef(null);

  // query shopify on the GID we get from algolia
  useEffect(() => {
    const load = async () => {
      try {
        if (!courses) {
          throw 'No product found';
        }

        const data = await shopify.query(PRODUCT_QUERY_BY_GIDS, {
          ids: courses,
          fields: [
            { namespace: 'course', key: 'hours' },
            { namespace: 'course', key: 'why-you-need' }
          ]
        });

        if (data.nodes === null || data === null) {
          throw 'No product found';
        }

        if (data?.nodes && data?.nodes.length > 0) {
          const faculty_courses = data?.nodes.map((course) => ({
            ...course,
            image: course?.image?.edges[0]?.node?.url
          }));
          setFacultyCourseData(faculty_courses);
        }
      } catch (error) {
        log.error('error', error);
      }
    };

    load();
  }, [courses]);

  if (
    !courses ||
    !facultyCourseData ||
    facultyCourseData.length <= 0 ||
    facultyCourseData.every((course) => course === null)
  )
    return <></>;

  const data = {
    title: `${firstName}'s Courses`,
    twoColumns: true
  };

  return (
    <HorizontalProductWrapper
      carouselRef={carouselRef}
      products={facultyCourseData}
      data={data}
    />
  );
};

FacultyCourses.propTypes = {
  courses: PropTypes.arrayOf(PropTypes.string),
  firstName: PropTypes.string
};

export default FacultyCourses;

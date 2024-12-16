import PropTypes from 'prop-types';
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import AgendaDetails from '@/components/ProductSections/AgendaDetails';
import CourseBookSection from '@/components/ProductSections/CourseBookSection';
import CreditDetails from '@/components/ProductSections/CreditDetails';
import Overview from '@/components/ProductSections/Overview';
import ProductLocation from '@/components/ProductSections/ProductLocation';
import RelatedTopics from '@/components/ProductSections/RelatedTopics';
import Speakers from '@/components/ProductSections/Speakers';
import WhyYouNeed from '@/components/ProductSections/WhyYouNeed';
import ProductSeries from './ProductSeries';

const SECTIONS = {
  overview: <Overview />,
  series: <ProductSeries />,
  related_topics: <RelatedTopics />,
  course_book: <CourseBookSection />,
  product_location: <ProductLocation />,
  agenda_details: <AgendaDetails />,
  credit_details: <CreditDetails />,
  speakers: <Speakers />,
  why_you_need: <WhyYouNeed />
};

const ProductSections = ({ observer }) => {
  const sectionEls = [...document.querySelectorAll('[data-component')];
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (mounted.current === true) {
      const sectionTargets = [...document.querySelectorAll('[data-component')];
      sectionTargets.forEach((target) => {
        observer.observe(target);
      });
    }
  }, [mounted.current]);

  return sectionEls.map((sectionEl) =>
    createPortal(SECTIONS[sectionEl.dataset.component], sectionEl)
  );
};

ProductSections.propTypes = {
  observer: PropTypes.instanceOf(IntersectionObserver)
};

export default ProductSections;

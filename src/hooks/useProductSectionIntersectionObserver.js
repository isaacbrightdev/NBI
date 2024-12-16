import log from 'loglevel';
import { useCallback, useMemo, useRef } from 'react';

/**
 * Creates an intersection observer with a specific callback to handle the Mobile Product Nav's
 * Title changes as the user scrolls up/down the page.
 *
 *
 * @param { import('react').MutableRefObject<boolean> } mounted - A boolean ref used to track if the parent component has been mounted.
 * @param { import('react').Dispatch<React.SetStateAction<string>> } setCurrentNav - A React `setState()` function to set the title of the Mobile Nav in the parent component.
 * @returns {IntersectionObserver}
 */
const useProductSectionIntersectionObserver = (mounted, setCurrentNav) => {
  const previousAnchoredComponentElements = useRef({});

  const nonAnchoredSections = [
    'icon_list',
    'related_topics',
    'product_id',
    'page_break',
    'course_book',
    'why_you_need',
    'subscription_upsell_module'
  ];

  const anchoredSections = [
    'overview',
    'credit_details',
    'agenda_details',
    'product_location',
    'speakers',
    'faqs'
  ];

  /**
   * Receives the component name from a portal root element's dataset
   * and converts it into a human-readable navigation title.
   *
   * @param {string} targetComponent
   * @returns {string}
   */
  const getNavTitle = useCallback((targetComponent) => {
    return targetComponent
      .split('_')
      .map((word) => {
        return word[0].toUpperCase() + word.substring(1);
      })
      .join(' ');
  }, []);

  /**
   * Returns the previous available anchored component element, if available. Will cache
   * each found element as they are requested and found.
   *
   * @param {HTMLElement} targetComponentElement
   * @param {HTMLElement?} originalTarget - Only required during the internal recursive call.
   * @returns {HTMLElement | null}
   */
  const getPreviousAnchoredComponentElement = useCallback(
    (targetComponentElement, originalTarget) => {
      const cachedElements = { ...previousAnchoredComponentElements.current };
      const targetComponent = targetComponentElement.dataset.component;

      if (cachedElements[targetComponent] !== undefined) {
        return cachedElements[targetComponent];
      }

      let currentSectionElement =
        targetComponentElement.closest('.shopify-section');
      let previousSection = currentSectionElement.previousElementSibling;

      const previousSectionRoot =
        previousSection.querySelector('[data-component]');

      // No React portal root present in previous Shopify section on page, stop searching.
      if (!previousSectionRoot) {
        cachedElements[targetComponent] = null;
        previousAnchoredComponentElements.current = {
          ...cachedElements
        };
        return null;
      }

      // Get name/attribute of previous component.
      const previousComponent = previousSectionRoot.dataset.component;

      if (anchoredSections.includes(previousComponent)) {
        const newCachedElementKey =
          originalTarget?.dataset?.component ?? targetComponent;

        // Cache found anchored element.
        cachedElements[newCachedElementKey] = previousSectionRoot;
        previousAnchoredComponentElements.current = {
          ...cachedElements
        };
        return previousSectionRoot;
      } else if (previousComponent) {
        // Keep searching...
        return getPreviousAnchoredComponentElement(
          previousSection,
          originalTarget ?? targetComponentElement
        );
      } else {
        // This shouldn't trigger - but just in case.
        log.error(
          'useProductSectionIntersectionObserver() is encountering an unexpected issue finding anchored elements.'
        );
        return null;
      }
    },
    []
  );

  /**
   * Callback for intersection observer that powers active title of MobileBannerNav.
   * Checks for minimum 10% section intersection in the main viewport upon entry
   * and falls back to the previous element's title upon exit.
   *
   * @param {IntersectionObserverEntry[]} entries
   */
  const onObserve = useCallback((entries) => {
    entries.forEach((entry) => {
      const targetComponent = entry.target.dataset.component;
      if (targetComponent === undefined) return;
      // Check for existing defined components - complain if new one added.
      if (
        !anchoredSections.includes(targetComponent) &&
        !nonAnchoredSections.includes(targetComponent)
      ) {
        log.error(
          `The section ${targetComponent} is not recognized as an anchored
            or non-anchored content section to the page's navigation. Please ensure
            it is added to the list of known and unknown components within this hook
            and that it has the proper "dataset.component" attribute set, if needed.`
        );
        return;
      }

      if (entry.isIntersecting && anchoredSections.includes(targetComponent)) {
        // Section comes at least 10% into view on the way down
        const newNav = getNavTitle(targetComponent);
        setCurrentNav(newNav);
      } else if (
        entry.boundingClientRect.y > 0 &&
        entry.boundingClientRect.y < entry.rootBounds.height &&
        anchoredSections.includes(targetComponent)
      ) {
        // Section is exiting from the bottom on the way up
        // Get previous anchored component element
        let previousComponentElement = getPreviousAnchoredComponentElement(
          entry.target
        );

        // If it's available, set to previous element's link title.
        if (previousComponentElement) {
          const newNav = getNavTitle(
            previousComponentElement.dataset.component
          );
          setCurrentNav(newNav);
        }
      }
    });
  }, []);

  // Recalculates header height on mount - causes slight scroll bugs
  // without that mounted ref.
  const observer = useMemo(() => {
    const headerHeight = document
      .getElementById('main-header')
      .getBoundingClientRect().height;

    return new IntersectionObserver(onObserve, {
      root: document.main,
      rootMargin: `${headerHeight}px 0px 0px 0px`,
      threshold: 0.1
    });
  }, [mounted.current]);

  return observer;
};

export default useProductSectionIntersectionObserver;

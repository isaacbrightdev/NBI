import { useEffect } from 'react';

const useRefinementList = () => {
  useEffect(() => {
    const refinementListRoot = document.querySelector('.RefinementList-root');

    if (refinementListRoot) {
      const inputs = refinementListRoot.querySelectorAll('input');
      inputs.forEach((input) => {
        input.setAttribute('data-hj-allow', 'true');
      });
    }
  }, []);
};

export default useRefinementList;

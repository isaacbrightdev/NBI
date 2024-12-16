class FaqNav extends HTMLElement {
  constructor() {
    super();
  }

  intersectionObserverCallback(entries) {
    entries.forEach((entry) => {
      const intersecting = entry.isIntersecting;
      if (!intersecting) {
        this.dropdown.classList.add('faq-fixed-top', 'border-b', 'border-grey');
        this.dropdown.classList.remove('relative');
        // this.sentinel.classList.add('h-[80px]');
      } else {
        this.dropdown.classList.add('relative');
        // this.sentinel.classList.remove('h-[80px]');
        this.dropdown.classList.remove(
          'faq-fixed-top',
          'border-b',
          'border-grey'
        );
      }
    });
  }

  connectedCallback() {
    this.sentinel = this.querySelector('.sentinel');
    this.observer = new IntersectionObserver(
      this.intersectionObserverCallback.bind(this),
      {
        root: null,
        rootMargin: '-80px',
        threshold: 0
      }
    );
    const mediaQuery = window.matchMedia('(min-width: 1200px)');

    const handleTabletChange = (e) => {
      if (e.matches) {
        this.observer.disconnect();
      } else {
        this.observer.observe(this.sentinel);
      }
    };

    mediaQuery.addEventListener('change', handleTabletChange);

    handleTabletChange(mediaQuery);
    this.dropdown = this.querySelector('[data-drop-down]');
    this.toggleBtn = this.querySelector('button');
    const toggleContainer = this.querySelector('[data-toggle-container]');
    this.toggleBtn.addEventListener('click', () => {
      toggleContainer.classList.toggle('lg-max:!hidden');
    });

    this.querySelectorAll('a').forEach((linkEl) => {
      linkEl.addEventListener('click', (event) => {
        event.preventDefault();
        toggleContainer.classList.toggle('lg-max:!hidden');

        setTimeout(() => {
          const faqHeadingEl = document.querySelector(linkEl.hash);
          window.scrollTo(0, 100);
          window.scrollTo(
            0,
            window.scrollY + faqHeadingEl.getBoundingClientRect().top - 180
          );
        }, 100);
      });
    });
  }
}
if (!window.customElements.get('faq-nav')) {
  window.customElements.define('faq-nav', FaqNav);
}
const onKeyUpEscape = (event) => {
  if (event.code.toUpperCase() !== 'ESCAPE') return;

  const openDetailsElement = event.target.closest('details[open]');
  if (!openDetailsElement) return;

  const summaryElement = openDetailsElement.querySelector('summary');
  openDetailsElement.removeAttribute('open');
  summaryElement.setAttribute('aria-expanded', false);
  summaryElement.focus();
};

document.querySelectorAll('[id^="Details-"] summary').forEach((summary) => {
  summary.setAttribute('role', 'button');
  summary.setAttribute(
    'aria-expanded',
    summary.parentNode.hasAttribute('open')
  );

  summary.classList.toggle('is-open', summary.parentNode.hasAttribute('open'));

  if (summary.nextElementSibling.getAttribute('id')) {
    summary.setAttribute('aria-controls', summary.nextElementSibling.id);
  }

  summary.addEventListener('click', (event) => {
    event.currentTarget.setAttribute(
      'aria-expanded',
      !event.currentTarget.closest('details').hasAttribute('open')
    );

    summary.classList.toggle(
      'is-open',
      !event.currentTarget.closest('details').hasAttribute('open')
    );
  });

  summary.parentElement.addEventListener('keyup', onKeyUpEscape);
});

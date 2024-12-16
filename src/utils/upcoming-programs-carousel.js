import Splide from '@splidejs/splide';

class UpcomingProgramsCarousel extends HTMLElement {
  constructor() {
    super();

    this.splide = new Splide(this, {
      gap: '1.5rem',
      pagination: false,
      classes: {
        arrows: 'splide__arrows your-class-arrows',
        arrow: 'splide__arrow !btn--nav !relative !translate-y-0',
        prev: 'splide__arrow--prev !left-auto',
        next: 'splide__arrow--next !right-auto'
      },
      fixedWidth: '70%',
      padding: { left: '1rem' },
      perPage: 1,
      mediaQuery: 'min',
      breakpoints: {
        768: {
          destroy: true
        }
      }
    }).mount();
  }

  connectedCallback() {}
}
if (!window.customElements.get('upcoming-programs-carousel')) {
  window.customElements.define(
    'upcoming-programs-carousel',
    UpcomingProgramsCarousel
  );
}

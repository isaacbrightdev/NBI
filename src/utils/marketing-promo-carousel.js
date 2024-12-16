import Splide from '@splidejs/splide';

class MarketingPromoCarousel extends HTMLElement {
  constructor() {
    super();

    this.splide = new Splide(this, {
      perPage: this.dataset.twoColumns === 'true' ? 2 : 4,
      gap: '1.5rem',
      pagination: false,
      classes: {
        arrows: 'splide__arrows your-class-arrows',
        arrow: 'splide__arrow !btn--nav !relative !translate-y-0',
        prev: 'splide__arrow--prev !left-auto',
        next: 'splide__arrow--next !right-auto'
      },
      breakpoints: {
        768: {
          fixedWidth: '70%',
          padding: { left: '1rem', right: '1rem' },
          perPage: 1
        },
        1024: {
          fixedWidth: '22.5rem',
          padding: { left: '1rem' }
        }
      }
    }).mount();
  }

  connectedCallback() {}
}
if (!window.customElements.get('marketing-promo-carousel')) {
  window.customElements.define(
    'marketing-promo-carousel',
    MarketingPromoCarousel
  );
}

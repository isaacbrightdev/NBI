class DirectoryPageNav extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.querySelectorAll('a').forEach((linkEl) => {
      linkEl.addEventListener('click', (event) => {
        event.preventDefault();
        const header = document.querySelector('#main-header');
        const headerHeight = header.getBoundingClientRect().height + 20;
        const faqHeadingEl = document.querySelector(linkEl.hash);
        const faqHeadingTop = faqHeadingEl.getBoundingClientRect().top;
        window.scrollTo({
          top: faqHeadingTop - headerHeight,
          left: 0,
          behavior: 'smooth'
        });
      });
    });
  }
}

if (!window.customElements.get('directory-page-nav')) {
  window.customElements.define('directory-page-nav', DirectoryPageNav);
}

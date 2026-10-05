class navHeader extends HTMLElement {
  constructor() {
    super();

    this._html = document.querySelector('html');
    this._body = document.querySelector('body');

    this._iconHeader = this.querySelector('.header-icons');
    this._navHeaderMd = this.querySelector('.header-nav__md');
    this._overlay = this.querySelector('.overlay');

    this._searchToggle = this.querySelector(
      'button[name="header-search-toggle"]'
    );

    this._mobileSearch = this.querySelector('.header-search-mobile');
    this._mobileSearchInput = this.querySelector(
      '.header-search-mobile__input'
    );

    if (this._iconHeader) {
      this._iconHeader.addEventListener(
        'click',
        this._onHeaderIconClick.bind(this)
      );
    }

    if (this._overlay) {
      this._overlay.addEventListener(
        'click',
        this._closeMenu.bind(this)
      );
    }

    document.addEventListener(
      'keydown',
      this._onKeyDown.bind(this)
    );
  }

  _onHeaderIconClick(e) {
    const searchButton = e.target.closest(
      'button[name="header-search-toggle"]'
    );

    const menuButton = e.target.closest(
      'button[name="header-menu"]'
    );

    if (searchButton) {
      this._toggleSearch(searchButton);
      return;
    }

    if (menuButton) {
      this._toggleMenu(menuButton);
    }
  }

  _toggleSearch(searchButton) {
    if (!this._mobileSearch) return;

    const isOpening =
      !this._mobileSearch.classList.contains('active');

    if (
      isOpening &&
      this._navHeaderMd &&
      this._navHeaderMd.classList.contains('active')
    ) {
      this._closeMenu();
    }

    this._mobileSearch.classList.toggle(
      'active',
      isOpening
    );

    searchButton.setAttribute(
      'aria-expanded',
      String(isOpening)
    );

    if (isOpening && this._mobileSearchInput) {
      setTimeout(() => {
        this._mobileSearchInput.focus();
      }, 100);
    }
  }

  _toggleMenu(menuButton) {
    if (!this._navHeaderMd || !this._overlay) return;

    const isOpening =
      !this._navHeaderMd.classList.contains('active');

    if (isOpening) {
      this._closeSearch();
    }

    this._html.classList.toggle(
      'overflow-hidden',
      isOpening
    );

    this._body.classList.toggle(
      'overflow-hidden',
      isOpening
    );

    this._navHeaderMd.classList.toggle(
      'active',
      isOpening
    );

    this._overlay.classList.toggle(
      'active',
      isOpening
    );

    menuButton.classList.toggle(
      'active',
      isOpening
    );
  }

  _closeSearch() {
    if (this._mobileSearch) {
      this._mobileSearch.classList.remove('active');
    }

    if (this._searchToggle) {
      this._searchToggle.setAttribute(
        'aria-expanded',
        'false'
      );
    }
  }

  _closeMenu() {
    const menuButton = this.querySelector(
      'button[name="header-menu"]'
    );

    this._html.classList.remove('overflow-hidden');
    this._body.classList.remove('overflow-hidden');

    if (this._navHeaderMd) {
      this._navHeaderMd.classList.remove('active');
    }

    if (this._overlay) {
      this._overlay.classList.remove('active');
    }

    if (menuButton) {
      menuButton.classList.remove('active');
    }
  }

  _onKeyDown(e) {
    if (e.key !== 'Escape') return;

    this._closeSearch();
    this._closeMenu();
  }
}

if (!customElements.get('header-nav')) {
  customElements.define('header-nav', navHeader);
}
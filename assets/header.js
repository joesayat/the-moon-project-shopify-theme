class navHeader extends HTMLElement {
  constructor() {
    super();

    this._body = document.querySelector('body');
    this._iconHeader = document.querySelector('.header-icons');
    this._navHeaderMd = document.querySelector('.header-nav__md');
    this._overlay = document.querySelector('.overlay');

    this._iconHeader.addEventListener('click', this._onMenuIconClick.bind(this));
  }

  _onMenuIconClick(e) {
    const menuIcon = e.target.closest('button[name="header-menu"]');

    if (!menuIcon) return;

    this._body.classList.toggle('overflow-hidden');
    this._navHeaderMd.classList.toggle('active');
    this._overlay.classList.toggle('active');
    menuIcon.classList.toggle('active');
  }
}

customElements.define('header-nav', navHeader);

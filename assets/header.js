class navHeaderMd {
  constructor() {
    this._parentElement = document.querySelector('.header-nav__md');
    this._headerIcons = document.querySelector('.header-icons');

    this._headerIcons.addEventListener('click', this._handleNavHeaderMd.bind(this));
  }

  _handleNavHeaderMd(e) {
    const btnHeaderMenu = e.target.closest('button[name="header-menu"]');
    
    if (!btnHeaderMenu) return;

    this._parentElement.classList.toggle('active');
  }
}

new navHeaderMd();

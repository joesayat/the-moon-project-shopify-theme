export class QuantityInput extends HTMLElement {
  static observedAttributes = ['data-value'];

  constructor() {
    super();

    this.container = this.closest('.cta-container__product');
    this.input = this.querySelector('input[name="quantity"]');
    this.setInputValues();
    this.addEventListener('click', this.onBtnClick);
  }

  get errorMsg() {
    return document.querySelector('.error-message');
  }

  get isProductAvailable() {
    return this.dataset.available === 'true';
  }

  get productName() {
    const size = this.dataset.size.toLocaleLowerCase().includes('default')
      ? ''
      : ` - ${this.dataset.size}`;

    return `${this.dataset.name}${size}`;
  }

  get productQuantity() {
    return Number(this.dataset.value);
  }

  set productQuantity(value) {
    this.dataset.value = value;

    return value;
  }

  get productQuantityMax() {
    return Number(this.dataset.max);
  }

  get productQuantityMin() {
    return Number(this.dataset.min);
  }

  setInputValues() {
    this.input.value = this.productQuantity;
    this.input.max = this.productQuantityMax;
    this.input.min = this.productQuantityMin;
  }

  handleDecrementValue() {
    this.input.value <= this.input.min
      ? ''
      : (this.productQuantity = --this.input.value);
  }

  handleIncrementValue() {
    this.input.value >= this.input.max
      ? this.renderErrorMsg('add more')
      : (this.productQuantity = ++this.input.value);
  }

  handleCalculation() {
    this.btn.getAttribute('name') === 'increment'
      ? this.handleIncrementValue()
      : this.handleDecrementValue();
  }

  onBtnClick(e) {
    e.preventDefault();

    if (!e.target.closest('button')) return;

    this.btn = e.target.closest('button');

    this.removeErrorMsg();
    this.handleCalculation();
  }

  renderErrorIcon() {
    return `<svg
      class="icon-error-alert"
      clip-rule="evenodd"
      fill-rule="evenodd"
      stroke-linejoin="round"
      stroke-miterlimit="2"
      width="2.4rem"
      heights="2.4rem"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="m12.002 21.534c5.518 0 9.998-4.48 9.998-9.998s-4.48-9.997-9.998-9.997c-5.517 0-9.997 4.479-9.997 9.997s4.48 9.998 9.997 9.998zm0-8c-.414 0-.75-.336-.75-.75v-5.5c0-.414.336-.75.75-.75s.75.336.75.75v5.5c0 .414-.336.75-.75.75zm-.002 3c-.552 0-1-.448-1-1s.448-1 1-1 1 .448 1 1-.448 1-1 1z"
        fill-rule="nonzero"
      />
    </svg>`;
  }

  getContent(action) {
    switch (true) {
      case !this.isProductAvailable:
        return `${this.productName} is not available`;
      case this.isProductAvailable && this.productQuantityMax === 0:
        return `All ${this.productName} is in your cart.`;
      default:
        return `You can't ${action} ${this.productName}`;
    }
  }

  renderErrorMsg(action) {
    const content = this.getContent(action);
    const icon = this.renderErrorIcon();
    const html = `<div class="error-message">
      ${icon} ${content}
    </div>`;

    this.container.insertAdjacentHTML('beforeend', html);
  }

  removeErrorMsg() {
    this.errorMsg?.remove();
  }
}

customElements.define('quantity-input', QuantityInput);

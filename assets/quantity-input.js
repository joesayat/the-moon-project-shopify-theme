export class QuantityInput extends HTMLElement {
  constructor() {
    super();

    this.addEventListener('click', this.onBtnClick);
  }

  connectedCallback() {
    this.container = this.closest('.cta-container__product');
  }

  get inputQuantity() {
    return this.querySelector('input[name="quantity"]');
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

  setInputQuantityValue(newValue) {
    this.inputQuantity.value = newValue;
  }

  handleDecrementValue(value, minValue) {
    value <= minValue ? '' : this.setInputQuantityValue(--value);
  }

  handleIncrementValue(value, maxValue) {
    value >= maxValue
      ? this.renderErrorMsg('add more')
      : this.setInputQuantityValue(++value);
  }

  handleCalculation() {
    const { max, min, value } = this.inputQuantity;

    this.btn.getAttribute('name') === 'decrement'
      ? this.handleDecrementValue(Number(value), Number(min))
      : this.handleIncrementValue(Number(value), Number(max));
  }

  onBtnClick(e) {
    e.preventDefault();

    if (!e.target.closest('button')) return;

    this.btn = e.target.closest('button');

    this.removeErrorMsg();
    this.handleCalculation();
    this.updateCart();
  }

  updateCart() {
    // cart-quantity-input
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
      case this.isProductAvailable && Number(this.inputQuantity.max) === 0:
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

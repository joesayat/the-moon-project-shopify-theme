class QuantityInput extends HTMLElement {
  static observedAttributes = ['data-value'];

  constructor() {
    super();

    this.input = this.querySelector('input[name="quantity"]');
    this.setInputValues();
    this.addEventListener('click', this.onBtnClick);
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (name === 'data-value') {
      console.log(oldVal, newVal);
      this.fetchJSON();
    }
  }

  get isProductAvailable() {
    return this.dataset.available === 'true';
  }

  get productName() {
    return `${this.dataset.name} - ${this.dataset.size}`;
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
      ? this.renderErrorMsg('remove')
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
    const html = `<div class="error-message">
      ${this.renderErrorIcon()} ${content}
    </div>`;

    this.parentElement.insertAdjacentHTML('beforeend', html);
  }

  removeErrorMsg() {
    document.querySelector('.error-message')?.remove();
  }

  // USED IN CART
  async fetchJSON() {
    const id = this.closest('.product-cart-item')?.dataset.key;
    const quantity = this.productQuantity;

    if (!id) return;

    const formData = {
      id,
      quantity,
    };

    console.log(formData);

    const res = await fetch(`/cart/change.js`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    const data = await res.json();

    const format = document
      .querySelector('[data-money-format')
      .getAttribute('data-money-format');
    const subTotal = formatMoney(data.total_price, format);
    const item = data.items.find((item) => item.key === id);
    const itemPrice = formatMoney(item.final_line_price, format);
    const subTotalEl = document.querySelector('.price__cart');
    const itemPriceEl = document.querySelector(
      `[data-key="${id}"] .product-total__cart`
    );

    subTotalEl.textContent = subTotal;
    itemPriceEl.textContent = itemPrice;
  }

  // NOT USING AT THE MOMENT
  async fetchHTML() {
    const sectionId = document
      .querySelector('[data-section')
      .getAttribute('data-section');

    console.log(sectionId);
    const res = await fetch(`/cart?section_id=${sectionId}`);
    const data = await res.text();
    const html = new DOMParser().parseFromString(data, 'text/html');
    const cartNew = html.querySelector('#cart_form');
    const cartOld = document.querySelector('#cart_form');

    const newArr = [...cartNew.getElementsByTagName('*')];
    const oldArr = [...cartOld.getElementsByTagName('*')];

    oldArr.forEach((el, i) => {
      if (el.childNodes.length === 1) {
        if (el.isEqualNode(newArr[i])) return;

        el.innerHTML = newArr[i].innerHTML;
      }
    });
  }
}

customElements.define('quantity-input', QuantityInput);

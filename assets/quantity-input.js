class QuantityInput extends HTMLElement {
  static observedAttributes = ['data-value'];

  constructor() {
    super();

    this.btnAdd = this.querySelector('[name="increment"]');
    this.btnMinus = this.querySelector('[name="decrement"]');
    this.input = this.querySelector('input[name="quantity"]');
    this.setInputValues();
    this.addEventListener('click', this.onBtnClick);
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (name === 'data-value') {
      if (newVal >= this.input.max) {
        this.setDisabled(this.btnAdd);
      }

      if (newVal <= this.input.min) {
        this.setDisabled(this.btnMinus);
      }

      if (oldVal) {
        this.fetchJSON();
      }
    }
  }

  getQuantity() {
    return this.dataset.value;
  }

  setInputValues() {
    const { value, max, min } = this.dataset;

    this.input.value = Number(value);
    this.input.max = Number(max);
    this.input.min = Number(min);
  }

  onBtnClick(e) {
    e.preventDefault();
    this.btn = e.target.closest('button');

    this.handleCalculation();
  }

  handleCalculation() {
    if (!this.btn) return;

    const btns = [...this.querySelectorAll('button')];

    btns.forEach(btn => this.removeDisabled(btn));
    this.btn === this.btnAdd ? this.handleIncrementValue() : this.handleDecrementValue();
  }

  handleDecrementValue() {
    if (this.input.value <= this.input.min) return;

    this.dataset.value = --this.input.value;
  }

  handleIncrementValue() {
    if (this.input.value >= this.input.max) return;

    this.dataset.value = ++this.input.value;
  }

  async fetchJSON() {
    const id = this.closest('.product-cart-item')?.dataset.key;
    const quantity = this.dataset.value;

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

    const format = document.querySelector('[data-money-format').getAttribute('data-money-format');
    const subTotal = formatMoney(data.total_price, format);
    const item = data.items.find(item => item.key === id);
    const itemPrice = formatMoney(item.final_line_price, format);
    const subTotalEl = document.querySelector('.price__cart');
    const itemPriceEl = document.querySelector(`[data-key="${id}"] .product-total__cart`)

    subTotalEl.textContent = subTotal;
    itemPriceEl.textContent = itemPrice;
  }

  async fetchHTML() {
    const sectionId = document.querySelector('[data-section').getAttribute('data-section');

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

  setDisabled(el) {
    el.setAttribute('disabled', '');
  }

  removeDisabled(el) {
    el.removeAttribute('disabled');
  }
}

customElements.define('quantity-input', QuantityInput);

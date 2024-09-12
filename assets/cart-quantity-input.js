import { QuantityInput } from './quantity-input.js';
import { formatMoney } from './utility-methods.js';

class CartQuantityInput extends QuantityInput {
  constructor() {
    super();
  }

  connectedCallback() {
    this.container = this.closest('.form-container__cart');
    this.id = this.getProductId();
    this.subTotalEl = document.querySelector('.price__cart');
    this.itemPriceEl = document.querySelector(
      `[data-key="${this.id}"] .product-total__cart`
    );
    this.format = document
      .querySelector('[data-money-format]')
      .getAttribute('data-money-format');
  }

  getProductId() {
    return this.closest('.product-cart-item')?.dataset?.key;
  }

  async fetchJSON() {
    if (!this.id) return;

    const formData = {
      id: this.id,
      quantity: this.inputQuantity.value,
    };

    const res = await fetch(`/cart/change.js`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    return res.json();
  }

  renderPrices() {
    if (!this.data) return;

    const item = this.data.items.find((item) => item.key === this.id);
    const subTotal = formatMoney(this.data.total_price, this.format);
    const itemPrice = formatMoney(item.final_line_price, this.format);

    this.subTotalEl.textContent = subTotal;
    this.itemPriceEl.textContent = itemPrice;
  }

  async updateCart() {
    this.data = await this.fetchJSON();

    this.renderPrices();
  }
}

customElements.define('cart-quantity-input', CartQuantityInput);

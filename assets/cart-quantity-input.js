import { QuantityInput } from './quantity-input.js';

class CartQuantityInput extends QuantityInput {
  static observedAttributes = ['data-value'];
  
  constructor() {
    super();

    this.container = this.closest('.form-container__cart');
  }

  attributeChangedCallback(name) {
    if (name === 'data-value') {
      this.fetchJSON();
    }
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
}

customElements.define('cart-quantity-input', CartQuantityInput);

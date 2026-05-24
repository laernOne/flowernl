
const CartPage = (() => {
  const renderCart = () => {
    const list = document.querySelector("[data-cart-list]");
    const summary = document.querySelector("[data-cart-summary]");
    if (!list || !summary) return;

    const items = Store.getDetailedCart();

    if (!items.length) {
      list.innerHTML = `<div class="empty">Кошик порожній. Перейдіть до каталогу, щоб додати товари.</div>`;
      summary.innerHTML = `
        <div class="summary-row"><span>Товарів</span><strong>0</strong></div>
        <div class="summary-row"><span>До сплати</span><strong>${Store.formatCurrency(0)}</strong></div>
        <a class="btn" href="catalog.html">Перейти в каталог</a>
      `;
      return;
    }

    list.innerHTML = items.map(({ product, quantity, subtotal }) => `
      <article class="cart-item">
        <img src="${product.image}" alt="${product.name}">
        <div>
          <h3>${product.name}</h3>
          <p>${product.categoryName} · ${Store.formatCurrency(product.price)}</p>
          <div class="qty">
            <button type="button" data-cart-minus="${product.id}" aria-label="Зменшити кількість">−</button>
            <strong>${quantity}</strong>
            <button type="button" data-cart-plus="${product.id}" aria-label="Збільшити кількість">+</button>
          </div>
        </div>
        <div class="actions">
          <strong>${Store.formatCurrency(subtotal)}</strong>
          <button class="btn btn--small btn--ghost" type="button" data-cart-remove="${product.id}">Видалити</button>
        </div>
      </article>
    `).join("");

    summary.innerHTML = `
      <div class="summary-row"><span>Кількість позицій</span><strong>${items.length}</strong></div>
      <div class="summary-row"><span>Кількість товарів</span><strong>${Store.getCartCount()}</strong></div>
      <div class="summary-row"><span>До сплати</span><strong>${Store.formatCurrency(Store.getCartTotal())}</strong></div>
      <a class="btn" href="checkout.html">Оформити замовлення</a>
      <button class="btn btn--light" type="button" data-clear-cart>Очистити кошик</button>
    `;
  };

  document.addEventListener("DOMContentLoaded", () => {
    renderCart();

    document.body.addEventListener("click", (event) => {
      const minus = event.target.closest("[data-cart-minus]");
      const plus = event.target.closest("[data-cart-plus]");
      const remove = event.target.closest("[data-cart-remove]");
      const clear = event.target.closest("[data-clear-cart]");

      if (minus) {
        const id = Number(minus.dataset.cartMinus);
        const item = Store.getCart().find(row => Number(row.productId) === id);
        if (item) Store.updateCartItem(id, item.quantity - 1);
      }

      if (plus) {
        const id = Number(plus.dataset.cartPlus);
        const item = Store.getCart().find(row => Number(row.productId) === id);
        if (item) Store.updateCartItem(id, item.quantity + 1);
      }

      if (remove) {
        Store.removeFromCart(Number(remove.dataset.cartRemove));
      }

      if (clear) {
        Store.clearCart();
      }

      if (minus || plus || remove || clear) {
        renderCart();
      }
    });
  });

  return { renderCart };
})();

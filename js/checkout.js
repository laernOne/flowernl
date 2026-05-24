
const CheckoutPage = (() => {
  const setFieldError = (field, message = "") => {
    const wrapper = field.closest(".field");
    const error = wrapper?.querySelector(".error-message");
    if (!wrapper || !error) return;

    if (message) {
      wrapper.classList.add("has-error");
      error.textContent = message;
    } else {
      wrapper.classList.remove("has-error");
      error.textContent = "";
    }
  };

  const validate = (form) => {
    let isValid = true;
    const values = Object.fromEntries(new FormData(form).entries());

    const rules = {
      customerName: value => value.trim().length >= 2 ? "" : "Вкажіть ім’я не коротше 2 символів.",
      phone: value => /^\+?[\d\s()\-]{10,18}$/.test(value.trim()) ? "" : "Вкажіть коректний номер телефону.",
      email: value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) ? "" : "Вкажіть коректний email.",
      city: value => value.trim().length >= 2 ? "" : "Вкажіть місто доставки.",
      address: value => value.trim().length >= 5 ? "" : "Вкажіть повну адресу доставки.",
      deliveryDate: value => {
        if (!value) return "Оберіть дату доставки.";
        const selected = new Date(value + "T00:00:00");
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return selected >= today ? "" : "Дата доставки не може бути в минулому.";
      },
      paymentMethod: value => value ? "" : "Оберіть спосіб оплати."
    };

    Object.entries(rules).forEach(([name, rule]) => {
      const field = form.elements[name];
      const message = rule(values[name] || "");
      setFieldError(field, message);
      if (message) isValid = false;
    });

    return isValid;
  };

  const renderSummary = () => {
    const summary = document.querySelector("[data-checkout-summary]");
    if (!summary) return;

    const items = Store.getDetailedCart();

    if (!items.length) {
      summary.innerHTML = `
        <div class="empty">Кошик порожній. Оформлення замовлення недоступне.</div>
        <a class="btn" href="catalog.html">Перейти в каталог</a>
      `;
      return;
    }

    summary.innerHTML = `
      ${items.map(item => `
        <div class="summary-row">
          <span>${item.product.name} × ${item.quantity}</span>
          <strong>${Store.formatCurrency(item.subtotal)}</strong>
        </div>
      `).join("")}
      <div class="summary-row"><span>Разом</span><strong>${Store.formatCurrency(Store.getCartTotal())}</strong></div>
    `;
  };

  document.addEventListener("DOMContentLoaded", () => {
    renderSummary();

    const dateField = document.querySelector('input[name="deliveryDate"]');
    if (dateField) {
      dateField.min = new Date().toISOString().slice(0, 10);
    }

    const form = document.querySelector("[data-checkout-form]");
    if (!form) return;

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!Store.getDetailedCart().length) {
        App.showToast("Кошик порожній.", "error");
        return;
      }

      if (!validate(form)) {
        App.showToast("Перевірте правильність заповнення форми.", "error");
        return;
      }

      const data = Object.fromEntries(new FormData(form).entries());
      const result = Store.createOrder({
        customerName: data.customerName.trim(),
        phone: data.phone.trim(),
        email: data.email.trim(),
        city: data.city.trim(),
        address: data.address.trim(),
        deliveryDate: data.deliveryDate,
        paymentMethod: data.paymentMethod,
        comment: data.comment.trim()
      });

      if (result.ok) {
        form.reset();
        renderSummary();
        App.updateCartCount();

        const box = document.querySelector("[data-order-result]");
        if (box) {
          box.innerHTML = `
            <div class="notice">
              Замовлення №${result.order.id} створено. Його можна переглянути в адмін-панелі.
            </div>
            <a class="btn" href="catalog.html">Повернутися до каталогу</a>
          `;
        }
      } else {
        App.showToast(result.message, "error");
      }
    });
  });
})();

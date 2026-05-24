
const App = (() => {
  const updateCartCount = () => {
    document.querySelectorAll("[data-cart-count]").forEach(element => {
      element.textContent = Store.getCartCount();
    });
  };

  const initNav = () => {
    const button = document.querySelector(".nav-toggle");
    const nav = document.querySelector(".nav");

    if (!button || !nav) return;

    button.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("is-open");
      button.setAttribute("aria-expanded", String(isOpen));
    });
  };

  const showToast = (message, type = "ok") => {
    let toast = document.querySelector(".toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.className = "toast";
      document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.dataset.type = type;
    toast.style.cssText = `
      position: fixed;
      left: 50%;
      bottom: 24px;
      transform: translateX(-50%);
      z-index: 120;
      max-width: min(420px, calc(100% - 24px));
      padding: 13px 16px;
      border-radius: 14px;
      color: #fff;
      background: ${type === "error" ? "#ba2d2d" : "#24382f"};
      box-shadow: 0 18px 45px rgba(0,0,0,.18);
      font-weight: 700;
      text-align: center;
    `;

    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.remove(), 2600);
  };

  document.addEventListener("cart:updated", updateCartCount);
  document.addEventListener("DOMContentLoaded", () => {
    initNav();
    updateCartCount();

    document.body.addEventListener("click", (event) => {
      const button = event.target.closest("[data-add-to-cart]");
      if (!button) return;

      const id = Number(button.dataset.addToCart);
      const result = Store.addToCart(id, 1);
      showToast(result.message, result.ok ? "ok" : "error");
    });
  });

  return {
    updateCartCount,
    showToast
  };
})();

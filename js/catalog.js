
const CatalogPage = (() => {
  const state = {
    query: "",
    category: "all",
    sort: "default",
    stock: "all",
    maxPrice: ""
  };

  const categoryOptions = () => {
    return (window.FLOWER_CATEGORIES || [])
      .map(category => `<option value="${category.id}">${category.name}</option>`)
      .join("");
  };

  const productCard = (product) => {
    const stockBadge = product.inStock && product.quantity > 0
      ? `<span class="badge badge--ok">У наявності: ${product.quantity}</span>`
      : `<span class="badge badge--danger">Немає в наявності</span>`;

    return `
      <article class="product-card">
        <a class="product-card__image" href="catalog.html?product=${product.id}" aria-label="${product.name}">
          <img src="${product.image}" alt="${product.name}">
        </a>
        <div class="product-card__body">
          <div class="product-card__meta">
            <span class="badge">${product.categoryName}</span>
            ${stockBadge}
          </div>
          <h3>${product.name}</h3>
          <p>${product.description}</p>
          <div class="product-card__bottom">
            <span class="price">${Store.formatCurrency(product.price)}</span>
            <button class="btn btn--small" type="button" data-add-to-cart="${product.id}" ${!product.inStock ? "disabled" : ""}>
              До кошика
            </button>
          </div>
        </div>
      </article>
    `;
  };

  const getFilteredProducts = () => {
    let products = Store.getProducts();

    if (state.query.trim()) {
      const query = state.query.trim().toLowerCase();
      products = products.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.categoryName.toLowerCase().includes(query)
      );
    }

    if (state.category !== "all") {
      products = products.filter(product => product.category === state.category);
    }

    if (state.stock === "in") {
      products = products.filter(product => product.inStock && product.quantity > 0);
    }

    if (state.maxPrice) {
      products = products.filter(product => Number(product.price) <= Number(state.maxPrice));
    }

    if (state.sort === "price-asc") {
      products = [...products].sort((a, b) => Number(a.price) - Number(b.price));
    }

    if (state.sort === "price-desc") {
      products = [...products].sort((a, b) => Number(b.price) - Number(a.price));
    }

    if (state.sort === "name") {
      products = [...products].sort((a, b) => a.name.localeCompare(b.name, "uk"));
    }

    return products;
  };

  const renderProducts = () => {
    const grid = document.querySelector("[data-products-grid]");
    const counter = document.querySelector("[data-products-counter]");
    if (!grid) return;

    const products = getFilteredProducts();
    counter && (counter.textContent = `${products.length} товарів`);

    grid.innerHTML = products.length
      ? products.map(productCard).join("")
      : `<div class="empty">За обраними параметрами товари не знайдено.</div>`;
  };

  const renderProductModal = () => {
    const params = new URLSearchParams(location.search);
    const id = params.get("product");
    if (!id) return;

    const product = Store.getProductById(id);
    if (!product) return;

    const modal = document.querySelector("[data-product-modal]");
    const content = document.querySelector("[data-product-modal-content]");
    if (!modal || !content) return;

    content.innerHTML = `
      <div class="layout-two">
        <img src="${product.image}" alt="${product.name}" style="border-radius:20px;border:1px solid var(--line);background:var(--surface-2)">
        <div>
          <span class="badge">${product.categoryName}</span>
          <h2>${product.name}</h2>
          <p>${product.description}</p>
          <p><strong>Походження:</strong> ${product.origin}</p>
          <p><strong>Догляд:</strong> ${product.care}</p>
          <p><strong>Доступна кількість:</strong> ${product.quantity}</p>
          <p class="price">${Store.formatCurrency(product.price)}</p>
          <button class="btn" type="button" data-add-to-cart="${product.id}" ${!product.inStock ? "disabled" : ""}>Додати до кошика</button>
        </div>
      </div>
    `;

    modal.classList.add("is-open");
  };

  const closeModal = () => {
    const modal = document.querySelector("[data-product-modal]");
    if (modal) modal.classList.remove("is-open");
    const url = new URL(location.href);
    url.searchParams.delete("product");
    history.replaceState({}, "", url.pathname + url.search);
  };

  const initFilters = () => {
    const category = document.querySelector("[data-filter-category]");
    if (category) {
      category.innerHTML = categoryOptions();
    }

    const controls = {
      query: document.querySelector("[data-filter-query]"),
      category,
      sort: document.querySelector("[data-filter-sort]"),
      stock: document.querySelector("[data-filter-stock]"),
      maxPrice: document.querySelector("[data-filter-price]")
    };

    Object.entries(controls).forEach(([key, element]) => {
      if (!element) return;
      element.addEventListener("input", () => {
        state[key] = element.value;
        renderProducts();
      });
    });

    const reset = document.querySelector("[data-reset-filters]");
    if (reset) {
      reset.addEventListener("click", () => {
        Object.keys(state).forEach(key => state[key] = key === "category" || key === "stock" ? "all" : key === "sort" ? "default" : "");
        Object.entries(controls).forEach(([key, element]) => {
          if (element) element.value = state[key];
        });
        renderProducts();
      });
    }
  };

  document.addEventListener("DOMContentLoaded", () => {
    initFilters();
    renderProducts();
    renderProductModal();

    document.querySelectorAll("[data-close-modal]").forEach(button => {
      button.addEventListener("click", closeModal);
    });

    document.querySelector("[data-product-modal]")?.addEventListener("click", event => {
      if (event.target.matches("[data-product-modal]")) closeModal();
    });
  });

  return {
    renderProducts
  };
})();

const AdminPage = (() => {
  let editingProductId = null;
  const DEFAULT_IMAGE = "img/product-1.svg";
  const allowedImageTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
  const maxImageSize = 2 * 1024 * 1024;

  const escapeHtml = (value = "") => String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

  const getStatusBadgeClass = (status) => {
    if (status === "Нове") return "badge--warning";
    if (status === "Виконано") return "badge--ok";
    if (status === "Скасовано") return "badge--danger";
    return "badge--muted";
  };

  const setImageValue = (value) => {
    const form = document.querySelector("[data-product-form]");
    const preview = document.querySelector("[data-image-preview]");
    if (form?.elements.image) form.elements.image.value = value || DEFAULT_IMAGE;
    if (preview) preview.src = value || DEFAULT_IMAGE;
  };

  const renderStats = () => {
    const products = Store.getProducts();
    const orders = Store.getOrders();
    const totalRevenue = orders
      .filter(order => order.status !== "Скасовано")
      .reduce((sum, order) => sum + Number(order.total || 0), 0);

    const stats = document.querySelector("[data-admin-stats]");
    if (!stats) return;

    stats.innerHTML = `
      <div class="stat-card"><span>Товарів</span><strong>${products.length}</strong></div>
      <div class="stat-card"><span>Активних товарів</span><strong>${products.filter(p => p.inStock).length}</strong></div>
      <div class="stat-card"><span>Замовлень</span><strong>${orders.length}</strong></div>
      <div class="stat-card"><span>Сума замовлень</span><strong>${Store.formatCurrency(totalRevenue)}</strong></div>
    `;
  };

  const renderProducts = () => {
    const body = document.querySelector("[data-admin-products]");
    if (!body) return;

    const products = Store.getProducts();

    if (!products.length) {
      body.innerHTML = `<tr><td colspan="6">Товари ще не додані.</td></tr>`;
      return;
    }

    body.innerHTML = products.map(product => `
      <tr>
        <td><img src="${product.image || DEFAULT_IMAGE}" alt="${escapeHtml(product.name)}"></td>
        <td>
          <strong>${escapeHtml(product.name)}</strong><br>
          <span class="badge">${escapeHtml(product.categoryName)}</span>
        </td>
        <td>${Store.formatCurrency(product.price)}</td>
        <td>${Number(product.quantity || 0)}</td>
        <td>${product.inStock ? '<span class="badge badge--ok">Активний</span>' : '<span class="badge badge--danger">Вимкнений</span>'}</td>
        <td>
          <div class="actions">
            <button class="btn btn--small btn--light" type="button" data-edit-product="${product.id}">Редагувати</button>
            <button class="btn btn--small btn--danger" type="button" data-delete-product="${product.id}">Видалити</button>
          </div>
        </td>
      </tr>
    `).join("");
  };

  const renderOrders = () => {
    const body = document.querySelector("[data-admin-orders]");
    if (!body) return;

    const orders = Store.getOrders();

    if (!orders.length) {
      body.innerHTML = `<tr><td colspan="7">Замовлення ще не створені.</td></tr>`;
      return;
    }

    body.innerHTML = orders.map(order => `
      <tr>
        <td><strong>№${order.id}</strong><br><span>${Store.formatDate(order.createdAt)}</span></td>
        <td>${escapeHtml(order.customerName)}<br><span>${escapeHtml(order.phone)}</span></td>
        <td>${order.items.map(item => `${escapeHtml(item.name)} × ${Number(item.quantity || 0)}`).join("<br>")}</td>
        <td>${Store.formatCurrency(order.total)}</td>
        <td>${Store.formatDate(order.deliveryDate)}</td>
        <td>
          <span class="badge ${getStatusBadgeClass(order.status)}">${escapeHtml(order.status)}</span>
          <select class="select" data-order-status="${order.id}" style="margin-top:8px">
            ${(window.ORDER_STATUSES || []).map(status => `<option value="${status}" ${status === order.status ? "selected" : ""}>${status}</option>`).join("")}
          </select>
        </td>
        <td>
          <button class="btn btn--small btn--danger" type="button" data-delete-order="${order.id}">Видалити</button>
        </td>
      </tr>
    `).join("");
  };

  const renderCategoryOptions = () => {
    const select = document.querySelector('select[name="category"]');
    if (!select) return;

    select.innerHTML = (window.FLOWER_CATEGORIES || [])
      .filter(category => category.id !== "all")
      .map(category => `<option value="${category.id}">${category.name}</option>`)
      .join("");
  };

  const openProductModal = (product = null) => {
    const modal = document.querySelector("[data-product-editor]");
    const form = document.querySelector("[data-product-form]");
    const title = document.querySelector("[data-editor-title]");
    if (!modal || !form) return;

    editingProductId = product ? Number(product.id) : null;
    title.textContent = product ? "Редагування товару" : "Додавання товару";

    form.reset();
    renderCategoryOptions();

    if (product) {
      form.elements.name.value = product.name;
      form.elements.category.value = product.category;
      form.elements.price.value = product.price;
      form.elements.quantity.value = product.quantity;
      form.elements.description.value = product.description;
      form.elements.care.value = product.care;
      form.elements.inStock.checked = Boolean(product.inStock);
      setImageValue(product.image || DEFAULT_IMAGE);
    } else {
      form.elements.inStock.checked = true;
      setImageValue(DEFAULT_IMAGE);
    }

    modal.classList.add("is-open");
  };

  const closeProductModal = () => {
    const modal = document.querySelector("[data-product-editor]");
    if (modal) modal.classList.remove("is-open");
    editingProductId = null;
  };

  const saveProduct = (event) => {
    event.preventDefault();

    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    const products = Store.getProducts();
    const category = (window.FLOWER_CATEGORIES || []).find(item => item.id === data.category);
    const payload = {
      id: editingProductId || Date.now(),
      name: data.name.trim(),
      category: data.category,
      categoryName: category ? category.name : data.category,
      origin: "Netherlands",
      price: Number(data.price),
      image: (data.image || "").trim() || DEFAULT_IMAGE,
      description: data.description.trim(),
      care: data.care.trim(),
      inStock: Boolean(data.inStock),
      quantity: Number(data.quantity)
    };

    if (!payload.name || !payload.description || !payload.care || payload.price <= 0 || payload.quantity < 0) {
      App.showToast("Заповніть коректні дані товару.", "error");
      return;
    }

    const updated = editingProductId
      ? products.map(product => Number(product.id) === editingProductId ? payload : product)
      : [payload, ...products];

    try {
      Store.saveProducts(updated);
      closeProductModal();
      renderAll();
      App.showToast("Дані товару збережено.");
    } catch (error) {
      App.showToast("Не вдалося зберегти товар. Зменшіть розмір зображення.", "error");
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!allowedImageTypes.includes(file.type)) {
      event.target.value = "";
      App.showToast("Підтримуються лише JPEG, PNG, WebP, GIF або SVG.", "error");
      return;
    }

    if (file.size > maxImageSize) {
      event.target.value = "";
      App.showToast("Зображення завелике. Максимальний розмір – 2 МБ.", "error");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setImageValue(String(reader.result || DEFAULT_IMAGE));
    reader.onerror = () => App.showToast("Не вдалося прочитати файл зображення.", "error");
    reader.readAsDataURL(file);
  };

  const renderAll = () => {
    renderStats();
    renderProducts();
    renderOrders();
  };

  const initTabs = () => {
    const tabs = document.querySelectorAll("[data-admin-tab]");
    const sections = document.querySelectorAll("[data-admin-section]");

    tabs.forEach(tab => {
      tab.addEventListener("click", () => {
        tabs.forEach(item => item.classList.remove("is-active"));
        sections.forEach(item => item.classList.remove("is-active"));
        tab.classList.add("is-active");
        document.querySelector(`[data-admin-section="${tab.dataset.adminTab}"]`)?.classList.add("is-active");
      });
    });
  };

  document.addEventListener("DOMContentLoaded", () => {
    if (!AdminAuth.requireAuth()) return;

    initTabs();
    renderCategoryOptions();
    renderAll();

    document.querySelector("[data-add-product]")?.addEventListener("click", () => openProductModal());
    document.querySelector("[data-close-editor]")?.addEventListener("click", closeProductModal);
    document.querySelector("[data-product-form]")?.addEventListener("submit", saveProduct);
    document.querySelector('input[name="imageFile"]')?.addEventListener("change", handleImageUpload);
    document.querySelector("[data-admin-logout]")?.addEventListener("click", AdminAuth.logout);
    document.querySelector("[data-clear-image]")?.addEventListener("click", () => setImageValue(DEFAULT_IMAGE));

    document.body.addEventListener("click", (event) => {
      const edit = event.target.closest("[data-edit-product]");
      const del = event.target.closest("[data-delete-product]");
      const delOrder = event.target.closest("[data-delete-order]");
      const reset = event.target.closest("[data-reset-products]");
      const clearOrders = event.target.closest("[data-clear-orders]");

      if (edit) {
        const product = Store.getProductById(Number(edit.dataset.editProduct));
        if (product) openProductModal(product);
      }

      if (del) {
        const id = Number(del.dataset.deleteProduct);
        if (confirm("Видалити товар з каталогу?")) {
          Store.saveProducts(Store.getProducts().filter(product => Number(product.id) !== id));
          renderAll();
        }
      }

      if (delOrder) {
        const id = Number(delOrder.dataset.deleteOrder);
        if (confirm("Видалити замовлення?")) {
          Store.deleteOrder(id);
          renderAll();
        }
      }

      if (reset) {
        if (confirm("Повернути початковий набір товарів? Поточні зміни буде втрачено.")) {
          Store.resetProducts();
          renderAll();
        }
      }

      if (clearOrders) {
        if (confirm("Очистити всі замовлення?")) {
          Store.saveOrders([]);
          renderAll();
        }
      }
    });

    document.body.addEventListener("change", (event) => {
      const status = event.target.closest("[data-order-status]");
      if (!status) return;

      Store.updateOrderStatus(Number(status.dataset.orderStatus), status.value);
      renderAll();
    });
  });
})();

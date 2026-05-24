
const Store = (() => {
  const keys = {
    products: "flowernl_products",
    cart: "flowernl_cart",
    orders: "flowernl_orders"
  };

  const read = (key, fallback = []) => {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : fallback;
    } catch (error) {
      console.warn("LocalStorage read error:", error);
      return fallback;
    }
  };

  const write = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  };

  const seedProducts = () => {
    if (!localStorage.getItem(keys.products)) {
      write(keys.products, window.FLOWER_PRODUCTS || []);
    }
  };

  const getProducts = () => {
    seedProducts();
    return read(keys.products, []);
  };

  const saveProducts = (products) => {
    write(keys.products, products);
  };

  const resetProducts = () => {
    write(keys.products, window.FLOWER_PRODUCTS || []);
  };

  const getProductById = (id) => {
    return getProducts().find(product => Number(product.id) === Number(id));
  };

  const getCart = () => read(keys.cart, []);

  const saveCart = (cart) => {
    write(keys.cart, cart);
    document.dispatchEvent(new CustomEvent("cart:updated"));
  };

  const addToCart = (productId, quantity = 1) => {
    const product = getProductById(productId);
    if (!product || !product.inStock || Number(product.quantity) <= 0) {
      return { ok: false, message: "Товар недоступний для замовлення." };
    }

    const cart = getCart();
    const existing = cart.find(item => Number(item.productId) === Number(productId));
    const requested = existing ? existing.quantity + quantity : quantity;

    if (requested > Number(product.quantity)) {
      return { ok: false, message: "Кількість перевищує доступний залишок товару." };
    }

    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({ productId: Number(productId), quantity });
    }

    saveCart(cart);
    return { ok: true, message: "Товар додано до кошика." };
  };

  const updateCartItem = (productId, quantity) => {
    const product = getProductById(productId);
    let cart = getCart();

    if (quantity <= 0) {
      cart = cart.filter(item => Number(item.productId) !== Number(productId));
    } else if (product && quantity <= Number(product.quantity)) {
      cart = cart.map(item => Number(item.productId) === Number(productId) ? { ...item, quantity } : item);
    }

    saveCart(cart);
  };

  const clearCart = () => saveCart([]);

  const removeFromCart = (productId) => {
    const cart = getCart().filter(item => Number(item.productId) !== Number(productId));
    saveCart(cart);
  };

  const getDetailedCart = () => {
    return getCart()
      .map(item => {
        const product = getProductById(item.productId);
        if (!product) return null;
        return {
          ...item,
          product,
          subtotal: Number(product.price) * Number(item.quantity)
        };
      })
      .filter(Boolean);
  };

  const getCartTotal = () => {
    return getDetailedCart().reduce((sum, item) => sum + item.subtotal, 0);
  };

  const getCartCount = () => {
    return getCart().reduce((sum, item) => sum + Number(item.quantity), 0);
  };

  const getOrders = () => read(keys.orders, []);

  const saveOrders = (orders) => write(keys.orders, orders);

  const createOrder = (orderData) => {
    const detailedCart = getDetailedCart();
    if (!detailedCart.length) {
      return { ok: false, message: "Кошик порожній." };
    }

    const order = {
      id: Date.now(),
      ...orderData,
      items: detailedCart.map(item => ({
        productId: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        subtotal: item.subtotal
      })),
      total: getCartTotal(),
      status: "Нове",
      createdAt: new Date().toISOString()
    };

    const orders = getOrders();
    orders.unshift(order);
    saveOrders(orders);
    clearCart();

    return { ok: true, order };
  };

  const updateOrderStatus = (orderId, status) => {
    const orders = getOrders().map(order => Number(order.id) === Number(orderId) ? { ...order, status } : order);
    saveOrders(orders);
  };

  const deleteOrder = (orderId) => {
    const orders = getOrders().filter(order => Number(order.id) !== Number(orderId));
    saveOrders(orders);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("uk-UA", {
      style: "currency",
      currency: "UAH",
      maximumFractionDigits: 0
    }).format(Number(value || 0));
  };

  const formatDate = (value) => {
    if (!value) return "Не вказано";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat("uk-UA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }).format(date);
  };

  return {
    keys,
    seedProducts,
    getProducts,
    saveProducts,
    resetProducts,
    getProductById,
    getCart,
    saveCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    getDetailedCart,
    getCartTotal,
    getCartCount,
    getOrders,
    saveOrders,
    createOrder,
    updateOrderStatus,
    deleteOrder,
    formatCurrency,
    formatDate
  };
})();

Store.seedProducts();

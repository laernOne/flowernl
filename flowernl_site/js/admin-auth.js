const AdminAuth = (() => {
  const config = () => window.ADMIN_CONFIG || {};

  const toHex = (buffer) => {
    return Array.from(new Uint8Array(buffer))
      .map(byte => byte.toString(16).padStart(2, "0"))
      .join("");
  };

  const sha256 = async (text) => {
    if (!window.crypto || !window.crypto.subtle) {
      throw new Error("Браузер не підтримує Web Crypto API для перевірки пароля.");
    }
    const encoded = new TextEncoder().encode(text);
    const buffer = await window.crypto.subtle.digest("SHA-256", encoded);
    return toHex(buffer);
  };

  const isAuthenticated = () => {
    const key = config().sessionKey || "flowernl_admin_session";
    return sessionStorage.getItem(key) === "active";
  };

  const login = async (username, password) => {
    const current = config();
    if (!current.username || !current.passwordHash) {
      return { ok: false, message: "Файл конфігурації адміністратора заповнений некоректно." };
    }

    const hash = await sha256(password);
    const ok = username === current.username && hash === current.passwordHash;

    if (!ok) {
      return { ok: false, message: "Невірний логін або пароль." };
    }

    sessionStorage.setItem(current.sessionKey || "flowernl_admin_session", "active");
    return { ok: true };
  };

  const logout = () => {
    const key = config().sessionKey || "flowernl_admin_session";
    sessionStorage.removeItem(key);
    window.location.href = "admin-login.html";
  };

  const requireAuth = () => {
    if (!isAuthenticated()) {
      window.location.href = "admin-login.html";
      return false;
    }
    return true;
  };

  return { login, logout, requireAuth, isAuthenticated, sha256 };
})();

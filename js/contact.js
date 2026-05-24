
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("[data-contact-form]");
  const result = document.querySelector("[data-contact-result]");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());

    if (!data.name.trim() || !data.email.trim() || !data.message.trim()) {
      App.showToast("Заповніть усі обов’язкові поля.", "error");
      return;
    }

    form.reset();
    if (result) {
      result.innerHTML = `<div class="notice">Повідомлення підготовлено. У демонстраційній версії воно не надсилається на сервер.</div>`;
    }
  });
});

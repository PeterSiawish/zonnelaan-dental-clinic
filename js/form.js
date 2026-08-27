/* Contact form validation + Formspree AJAX submit.
   No-ops on pages without #callback-form. The real <form action="..." method="POST">
   attribute remains in the HTML as a no-JS fallback. */
(function () {
  // TODO: replace with real Formspree endpoint before launch.
  var FORMSPREE_ENDPOINT = "https://formspree.io/f/mwlkerqe";

  document.addEventListener("DOMContentLoaded", function () {
    var form = document.getElementById("callback-form");
    if (!form) return;

    var successBox = document.getElementById("form-success");
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    var phonePattern = /^[0-9+\-\s()]{6,20}$/;

    var fields = [
      { id: "field-name", type: "required" },
      { id: "field-email", type: "email" },
      { id: "field-phone", type: "phone" },
      { id: "field-patient-status", type: "required" },
      { id: "field-callback-window", type: "required" },
      { id: "field-consent", type: "checkbox" },
    ];

    function errorKeyFor(type) {
      if (type === "email") return "contact.form.errorEmail";
      if (type === "phone") return "contact.form.errorPhone";
      if (type === "checkbox") return "contact.form.errorConsent";
      return "contact.form.errorRequired";
    }

    function currentText(key) {
      if (!window.ZonnelaanI18n) return key;
      var lang = window.ZonnelaanI18n.getLang();
      var dict =
        window.ZonnelaanI18n.translations[lang] ||
        window.ZonnelaanI18n.translations.nl;
      return dict[key] || key;
    }

    function validateField(field) {
      var el = document.getElementById(field.id);
      var errorEl = document.getElementById(field.id + "-error");
      if (!el) return true;

      var value = field.type === "checkbox" ? el.checked : el.value.trim();
      var valid = true;

      if (field.type === "checkbox") {
        valid = value === true;
      } else if (!value) {
        valid = false;
      } else if (field.type === "email" && !emailPattern.test(value)) {
        valid = false;
      } else if (field.type === "phone" && !phonePattern.test(value)) {
        valid = false;
      }

      if (!valid) {
        el.setAttribute("aria-invalid", "true");
        if (errorEl) errorEl.textContent = currentText(errorKeyFor(field.type));
      } else {
        el.removeAttribute("aria-invalid");
        if (errorEl) errorEl.textContent = "";
      }

      return valid;
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      var allValid = fields.map(validateField).every(Boolean);
      if (!allValid) return;

      var submitBtn = form.querySelector("button[type=submit]");
      if (submitBtn) submitBtn.disabled = true;

      fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form),
      })
        .then(function (response) {
          if (response.ok) {
            form.hidden = true;
            if (successBox) successBox.hidden = false;
          } else {
            throw new Error("Formspree submission failed");
          }
        })
        .catch(function () {
          var genericError = document.getElementById("form-generic-error");
          if (genericError)
            genericError.textContent = currentText("contact.form.errorSubmit");
        })
        .finally(function () {
          if (submitBtn) submitBtn.disabled = false;
        });
    });
  });
})();

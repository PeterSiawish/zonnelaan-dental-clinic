(function () {
  const FORMSPREE_ENDPOINT = "https://formspree.io/f/mrpgagdl";

  document.addEventListener("DOMContentLoaded", () => {
    fetch("./content/register.json")
      .then((r) => r.json())
      .then((data) => {
        const title = document.querySelector(".js-title");
        if (title && data.title) title.textContent = data.title;

        const subtitle = document.querySelector(".js-subtitle");
        if (subtitle && data.subtitle) subtitle.textContent = data.subtitle;

        const nameLabel = document.querySelector(".js-name-label");
        if (nameLabel && data.name_label) nameLabel.textContent = data.name_label;

        const emailLabel = document.querySelector(".js-email-label");
        if (emailLabel && data.email_label) emailLabel.textContent = data.email_label;

        const bsnLabel = document.querySelector(".js-bsn-label");
        if (bsnLabel && data.bsn_label) bsnLabel.textContent = data.bsn_label;

        const phoneLabel = document.querySelector(".js-phone-label");
        if (phoneLabel && data.phone_label) phoneLabel.textContent = data.phone_label;

        const consentText = document.querySelector(".js-consent-text");
        if (consentText && data.consent_text) consentText.textContent = data.consent_text;

        const submitLabel = document.querySelector(".js-submit-label");
        if (submitLabel && data.submit_label) submitLabel.textContent = data.submit_label;
      });

    const form = document.getElementById("register-form");
    if (!form) return;

    const successBox = document.getElementById("register-success");
    const submitError = document.getElementById("submit-error");
    const turnstileError = document.getElementById("turnstile-error");
    const submitButton = form.querySelector('button[type="submit"]');

    const fieldIds = ["name", "email", "bsn", "phone", "consent"];

    function resetTurnstile() {
      if (window.turnstile) window.turnstile.reset();
    }

    function clearFieldError(id) {
      const input = document.getElementById(id);
      const error = document.getElementById(`${id}-error`);
      if (input) input.removeAttribute("aria-invalid");
      if (error) error.textContent = "";
    }

    function showFieldError(id, message) {
      const input = document.getElementById(id);
      const error = document.getElementById(`${id}-error`);
      if (input) input.setAttribute("aria-invalid", "true");
      if (error) error.textContent = message;
    }

    function validate() {
      let firstInvalidField = null;
      fieldIds.forEach((id) => clearFieldError(id));

      fieldIds.forEach((id) => {
        const input = document.getElementById(id);
        if (!input) return;
        if (!input.checkValidity()) {
          showFieldError(id, input.validationMessage);
          if (!firstInvalidField) firstInvalidField = input;
        }
      });

      if (firstInvalidField) firstInvalidField.focus();
      return !firstInvalidField;
    }

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      submitError.textContent = "";
      turnstileError.textContent = "";

      if (!validate()) return;

      const turnstileResponse = form.elements["cf-turnstile-response"];
      if (!turnstileResponse || !turnstileResponse.value) {
        turnstileError.textContent = "Bevestig dat u geen robot bent.";
        return;
      }

      submitButton.disabled = true;

      try {
        const response = await fetch(FORMSPREE_ENDPOINT, {
          method: "POST",
          body: new FormData(form),
          headers: { Accept: "application/json" },
        });

        if (response.ok) {
          form.hidden = true;
          successBox.hidden = false;
          successBox.focus();
        } else {
          submitError.textContent =
            "Er ging iets mis bij het versturen. Probeer het opnieuw of neem telefonisch contact op.";
          submitButton.disabled = false;
          resetTurnstile();
        }
      } catch (err) {
        submitError.textContent =
          "Er ging iets mis bij het versturen. Controleer uw internetverbinding en probeer het opnieuw.";
        submitButton.disabled = false;
        resetTurnstile();
      }
    });
  });
})();

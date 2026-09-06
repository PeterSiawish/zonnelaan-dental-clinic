(function () {
  const FORMSPREE_ENDPOINT = "https://formspree.io/f/mrpgagdl";

  document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("register-form");
    if (!form) return;

    const successBox = document.getElementById("register-success");
    const submitError = document.getElementById("submit-error");
    const turnstileError = document.getElementById("turnstile-error");
    const submitButton = form.querySelector('button[type="submit"]');

    const fieldIds = ["first-name", "last-name", "email", "bsn", "phone", "consent"];

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

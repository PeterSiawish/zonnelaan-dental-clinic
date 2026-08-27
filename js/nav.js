/* Mobile hamburger menu open/close. The sticky mobile CTA bar needs no JS
   (pure CSS media query), so this file stays focused on the nav panel. */
(function () {
  document.addEventListener("DOMContentLoaded", function () {
    var toggleBtn = document.querySelector(".hamburger-btn");
    var panel = document.querySelector(".mobile-nav-panel");
    if (!toggleBtn || !panel) return;

    function closePanel() {
      panel.setAttribute("hidden", "");
      toggleBtn.setAttribute("aria-expanded", "false");
    }

    function openPanel() {
      panel.removeAttribute("hidden");
      toggleBtn.setAttribute("aria-expanded", "true");
    }

    toggleBtn.addEventListener("click", function () {
      var isOpen = toggleBtn.getAttribute("aria-expanded") === "true";
      if (isOpen) closePanel();
      else openPanel();
    });

    panel.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closePanel);
    });

    document.addEventListener("click", function (event) {
      var isOpen = toggleBtn.getAttribute("aria-expanded") === "true";
      if (!isOpen) return;
      if (panel.contains(event.target) || toggleBtn.contains(event.target)) return;
      closePanel();
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && toggleBtn.getAttribute("aria-expanded") === "true") {
        closePanel();
        toggleBtn.focus();
      }
    });
  });
})();

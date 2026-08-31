/* Treatments accordion. Multiple sections may be open at once (not exclusive)
   so a visitor can compare categories. No-ops on pages without .accordion-header.

   Click handling uses event delegation (one listener on document) rather than
   binding to each .accordion-header individually, because categories on
   treatments.html are cloned in after a fetch() resolves — a per-header
   listener attached at DOMContentLoaded would miss them entirely.

   expandFromHash() is exposed on window.ZonnelaanAccordion so treatments.js
   can re-run it once its cards exist in the DOM (this script's own
   DOMContentLoaded-time call runs too early to see them). */
(function () {
  function expandFromHash() {
    var hash = window.location.hash.replace("#", "");
    var target = hash && document.getElementById(hash);
    if (!target || !target.classList.contains("accordion-item")) return;
    var header = target.querySelector(".accordion-header");
    var panel = target.querySelector(".accordion-panel");
    if (header && panel && header.getAttribute("aria-expanded") !== "true") {
      header.setAttribute("aria-expanded", "true");
      panel.removeAttribute("hidden");
    }
  }

  window.ZonnelaanAccordion = { expandFromHash: expandFromHash };

  document.addEventListener("DOMContentLoaded", function () {
    document.addEventListener("click", function (e) {
      var header = e.target.closest(".accordion-header");
      if (!header) return;

      var expanded = header.getAttribute("aria-expanded") === "true";
      var panelId = header.getAttribute("aria-controls");
      var panel = panelId ? document.getElementById(panelId) : null;
      if (!panel) return;

      header.setAttribute("aria-expanded", expanded ? "false" : "true");
      if (expanded) panel.setAttribute("hidden", "");
      else panel.removeAttribute("hidden");
    });

    // Auto-expand the category linked to from the home page services section
    // (e.g. treatments.html#cat1). No-ops here on pages whose accordion
    // content is rendered asynchronously (treatments.html) since the
    // matching element doesn't exist yet at DOMContentLoaded time; that
    // page calls expandFromHash() again itself once rendering is done.
    expandFromHash();
  });
})();

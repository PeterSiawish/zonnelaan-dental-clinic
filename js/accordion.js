/* Treatments accordion. Multiple sections may be open at once (not exclusive)
   so a visitor can compare categories. No-ops on pages without .accordion-header.

   Click handling uses event delegation (one listener on document) rather than
   binding to each .accordion-header individually, because categories on
   treatments.html are cloned in after a fetch() resolves — a per-header
   listener attached at DOMContentLoaded would miss them entirely.

   expandFromHash() is exposed on window.ZonnelaanAccordion so treatments.js
   can re-run it once its cards exist in the DOM (this script's own
   DOMContentLoaded-time call runs too early to see them). Because those
   cards are added after page load, the browser's own jump-to-#hash has
   already missed them, so expandFromHash() also scrolls the item into view.

   categoryId() is the single source of truth for a treatment category's
   element id: treatments.js uses it to set the id, home.js uses it to build
   the "Onze zorg" card links (treatments.html#<id>). */
(function () {
  function slugify(text) {
    return (text || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  function categoryId(category, index) {
    return (
      (category.slug || "").trim() ||
      slugify(category.title) ||
      "cat-" + index
    );
  }

  function expandFromHash() {
    var hash = decodeURIComponent(window.location.hash.replace("#", ""));
    var target = hash && document.getElementById(hash);
    if (!target || !target.classList.contains("accordion-item")) return;
    var header = target.querySelector(".accordion-header");
    var panel = target.querySelector(".accordion-panel");
    if (header && panel && header.getAttribute("aria-expanded") !== "true") {
      header.setAttribute("aria-expanded", "true");
      panel.removeAttribute("hidden");
    }
    // Jump straight there, like a normal #anchor on page load, instead of
    // the site-wide smooth scrolling (css/tokens.css). Done by toggling the
    // CSS property rather than behavior: "instant" for older Safari.
    var root = document.documentElement;
    var previous = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";
    target.scrollIntoView(true);
    root.style.scrollBehavior = previous;
  }

  window.ZonnelaanAccordion = {
    expandFromHash: expandFromHash,
    categoryId: categoryId,
  };

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
    // (e.g. treatments.html#preventief). No-ops here on pages whose accordion
    // content is rendered asynchronously (treatments.html) since the
    // matching element doesn't exist yet at DOMContentLoaded time; that
    // page calls expandFromHash() again itself once rendering is done.
    expandFromHash();
  });
})();

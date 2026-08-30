/* Treatments accordion. Multiple sections may be open at once (not exclusive)
   so a visitor can compare categories. No-ops on pages without .accordion-header. */
(function () {
  document.addEventListener("DOMContentLoaded", function () {
    var headers = document.querySelectorAll(".accordion-header");

    headers.forEach(function (header) {
      header.addEventListener("click", function () {
        var expanded = header.getAttribute("aria-expanded") === "true";
        var panelId = header.getAttribute("aria-controls");
        var panel = panelId ? document.getElementById(panelId) : null;
        if (!panel) return;

        header.setAttribute("aria-expanded", expanded ? "false" : "true");
        if (expanded) panel.setAttribute("hidden", "");
        else panel.removeAttribute("hidden");
      });
    });

    // Auto-expand the category linked to from the home page services section
    // (e.g. treatments.html#preventief), since a plain anchor jump would
    // otherwise land on a collapsed panel.
    var hash = window.location.hash.replace("#", "");
    var target = hash && document.getElementById(hash);
    if (!target || !target.classList.contains("accordion-item")) return;
    var targetHeader = target.querySelector(".accordion-header");
    var targetPanel = target.querySelector(".accordion-panel");
    if (targetHeader && targetPanel && targetHeader.getAttribute("aria-expanded") !== "true") {
      targetHeader.setAttribute("aria-expanded", "true");
      targetPanel.removeAttribute("hidden");
    }
  });
})();

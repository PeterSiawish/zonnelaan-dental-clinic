/* "Accepting new patients" badge.
   Deliberately a manual flag, not date/time-based logic — flip it by hand
   when the practice's intake status changes. */
(function () {
  var ACCEPTING_NEW_PATIENTS = true;

  document.addEventListener("DOMContentLoaded", function () {
    var badges = document.querySelectorAll(".status-badge");
    if (!badges.length) return;

    var key = ACCEPTING_NEW_PATIENTS ? "badge.accepting" : "badge.notAccepting";
    var cssClass = ACCEPTING_NEW_PATIENTS ? "badge-accepting" : "badge-not-accepting";

    badges.forEach(function (badge) {
      badge.classList.remove("badge-accepting", "badge-not-accepting");
      badge.classList.add(cssClass);
      badge.setAttribute("data-i18n", key);
    });

    if (window.ZonnelaanI18n) {
      window.ZonnelaanI18n.applyTranslations(window.ZonnelaanI18n.getLang());
    }
  });
})();

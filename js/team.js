/* Fetches content/our-team.json and fills in the 4 staff cards on team.html.
   Doctor content is single-language (Dutch) — it does not react to the
   NL/EN toggle. Only the BIG/KRT dt label is re-synced through the existing
   i18n dictionary, since it's page furniture, not editor-authored content. */
(function () {
  var CARD_PREFIXES = ["doctor-1", "doctor-2", "doctor-3", "doctor-4"];

  function setText(id, value) {
    var el = document.getElementById(id);
    if (el && value) el.textContent = value;
  }

  function applyPhoto(prefix, doctor) {
    if (!doctor.photo) return; // keep the existing initials-circle fallback
    var avatar = document.getElementById(prefix + "-avatar");
    if (!avatar) return;
    avatar.textContent = "";
    var img = document.createElement("img");
    img.className = "avatar-photo";
    img.src = doctor.photo;
    img.alt = doctor.name || "";
    avatar.appendChild(img);
  }

  fetch("./content/our-team.json")
    .then(function (r) {
      return r.json();
    })
    .then(function (data) {
      (data.doctors || []).forEach(function (doctor, i) {
        var prefix = CARD_PREFIXES[i];
        if (!prefix) return; // more entries than cards on the page: ignored for now

        setText(prefix + "-name", doctor.name);
        setText(prefix + "-role", doctor.role);
        setText(prefix + "-license-number", doctor.license_number);
        setText(prefix + "-specializations", doctor.specializations);
        setText(prefix + "-languages", doctor.languages);
        setText(prefix + "-bio", doctor.bio);
        applyPhoto(prefix, doctor);

        var labelEl = document.getElementById(prefix + "-license-label");
        if (labelEl && doctor.license_type) {
          labelEl.setAttribute(
            "data-i18n",
            doctor.license_type === "KRT" ? "team.label.krt" : "team.label.big",
          );
        }
      });

      if (window.ZonnelaanI18n) {
        window.ZonnelaanI18n.applyTranslations(window.ZonnelaanI18n.getLang());
      }
    });
})();

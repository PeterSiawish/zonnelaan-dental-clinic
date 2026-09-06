/* Clones content/our-team.json's "doctors" array into one card per entry
   on team.html, using #staff-card-template as the markup source. */
(function () {
  var TITLE_WORD = /^(drs\.?|dr\.?|prof\.?|mevr\.?|mr\.?)$/i;

  function initials(name) {
    var words = (name || "")
      .split(/\s+/)
      .filter(function (w) { return w && !TITLE_WORD.test(w); });
    if (words.length === 0) return "";
    if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  }

  function setOrHide(el, value) {
    if (!el) return;
    el.hidden = !value;
    if (value) el.textContent = value;
  }

  function setRowOrHide(dt, dd, value) {
    if (!dt || !dd) return;
    dt.hidden = dd.hidden = !value;
    if (value) dd.textContent = value;
  }

  function applyAvatar(avatarEl, doctor, index) {
    avatarEl.className = "avatar avatar-" + ((index % 4) + 1);
    if (doctor.photo) {
      var img = document.createElement("img");
      img.className = "avatar-photo";
      img.src = doctor.photo;
      img.alt = doctor.name || "";
      avatarEl.appendChild(img);
    } else {
      avatarEl.textContent = initials(doctor.name);
    }
  }

  function buildCard(doctor, index, template) {
    var node = template.content.firstElementChild.cloneNode(true);

    node.querySelector(".js-name").textContent = doctor.name;
    setOrHide(node.querySelector(".js-role"), doctor.role);
    setRowOrHide(
      node.querySelector(".js-license-label"),
      node.querySelector(".js-license-number"),
      doctor.license_number
    );
    setRowOrHide(
      node.querySelector(".js-specializations-label"),
      node.querySelector(".js-specializations"),
      doctor.specializations
    );
    setRowOrHide(
      node.querySelector(".js-languages-label"),
      node.querySelector(".js-languages"),
      doctor.languages
    );
    setOrHide(node.querySelector(".js-bio"), doctor.bio);

    var licenseLabel = node.querySelector(".js-license-label");
    if (licenseLabel && doctor.license_type) {
      licenseLabel.textContent =
        doctor.license_type === "KRT" ? "KRT-nummer" : "BIG-nummer";
    }

    applyAvatar(node.querySelector(".avatar"), doctor, index);
    return node;
  }

  fetch("./content/our-team.json")
    .then(function (r) {
      return r.json();
    })
    .then(function (data) {
      var title = document.querySelector(".js-title");
      if (title && data.title) title.textContent = data.title;

      var subtitle = document.querySelector(".js-subtitle");
      if (subtitle && data.subtitle) subtitle.textContent = data.subtitle;

      var grid = document.getElementById("staff-grid");
      var template = document.getElementById("staff-card-template");
      if (!grid || !template) return;

      (data.doctors || []).forEach(function (doctor, i) {
        if (!doctor.name) return; // incomplete entry, nothing to show yet
        grid.appendChild(buildCard(doctor, i, template));
      });
    });
})();

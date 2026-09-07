/* Fills the homepage's flat text fields from content/index.json, and
   clones up to 4 doctor cards from content/our-team.json's "doctors" array
   (same source as team.html) into #staff-preview-grid using
   #staff-preview-card-template. */
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
    applyAvatar(node.querySelector(".avatar"), doctor, index);
    return node;
  }

  var TEXT_FIELDS = [
    "hero-title",
    "hero-subtitle",
    "location-title",
    "location-subtitle",
    "address",
    "hours-weekday",
    "hours-weekend",
    "services-title",
    "services-subtitle",
    "service-1-title",
    "service-1-text",
    "service-2-title",
    "service-2-text",
    "service-3-title",
    "service-3-text",
    "service-4-title",
    "service-4-text",
    "team-title",
    "team-subtitle",
  ];

  fetch("./content/index.json")
    .then(function (r) {
      return r.json();
    })
    .then(function (data) {
      TEXT_FIELDS.forEach(function (field) {
        var el = document.querySelector(".js-" + field);
        var value = data[field.replace(/-/g, "_")];
        if (el && value) el.textContent = value;
      });

      var phone = document.querySelector(".js-phone");
      if (phone && data.phone) {
        phone.textContent = data.phone;
        phone.href = "tel:" + data.phone.replace(/[^\d+]/g, "");
      }

      var email = document.querySelector(".js-email");
      if (email && data.email) {
        email.textContent = data.email;
        email.href = "mailto:" + data.email;
      }
    });

  fetch("./content/our-team.json")
    .then(function (r) {
      return r.json();
    })
    .then(function (data) {
      var grid = document.getElementById("staff-preview-grid");
      var template = document.getElementById("staff-preview-card-template");
      if (!grid || !template) return;

      (data.doctors || [])
        .filter(function (doctor) { return doctor.name; })
        .slice(0, 4)
        .forEach(function (doctor, i) {
          grid.appendChild(buildCard(doctor, i, template));
        });
    });
})();

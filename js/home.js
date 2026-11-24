/* Fills the homepage's flat text fields and the optional hero notice from
   content/index.json (opening hours are handled by js/opening-hours.js), and
   clones up to 4 doctor cards from content/our-team.json's "doctors" array
   (same source as team.html) into #staff-preview-grid using
   #staff-preview-card-template.

   The 4 "Onze zorg" cards mirror the first 4 categories of
   content/treatments.json: title and link (treatments.html#<id>, which opens
   that accordion item) come from the category, the short text from
   content/index.json's service_N_text. An empty service_N_text falls back to
   a sentence built from the category's first treatments. */
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
    "services-title",
    "services-subtitle",
    "team-title",
    "team-subtitle",
  ];

  function getJSON(url) {
    return fetch(url).then(function (r) {
      return r.json();
    });
  }

  // "Periodieke controle (halfjaarlijks)" -> "Periodieke controle";
  // "Eerste consult / uitgebreid onderzoek" -> "Eerste consult of uitgebreid onderzoek".
  function cleanItem(item) {
    return (item || "")
      .replace(/\s*\([^)]*\)/g, "")
      .replace(/\s*\/\s*/g, " of ")
      .trim();
  }

  // First 3 treatments as one sentence: "A, b en c."
  function fallbackSentence(category) {
    var items = (category.items || []).map(cleanItem).filter(Boolean).slice(0, 3);
    if (items.length === 0) return "";
    items = items.map(function (item, i) {
      return i === 0 ? item : item.charAt(0).toLowerCase() + item.slice(1);
    });
    var last = items.pop();
    return (items.length ? items.join(", ") + " en " + last : last) + ".";
  }

  function fillServiceCards(homeData, treatmentsData) {
    var cards = document.querySelectorAll(".js-service-card");
    var categoryId = window.ZonnelaanAccordion && window.ZonnelaanAccordion.categoryId;
    if (!cards.length || !categoryId) return;

    var categories = [];
    (treatmentsData.categories || []).forEach(function (category, i) {
      // Same filter as js/treatments.js, keeping the original index so the
      // generated id matches the one on treatments.html.
      if (category.title) categories.push({ category: category, index: i });
    });

    Array.prototype.forEach.call(cards, function (card, n) {
      var entry = categories[n];
      card.hidden = !entry;
      if (!entry) return;
      var text = (homeData["service_" + (n + 1) + "_text"] || "").trim();
      card.href = "treatments.html#" + categoryId(entry.category, entry.index);
      card.querySelector(".js-service-title").textContent = entry.category.title.trim();
      card.querySelector(".js-service-text").textContent =
        text || fallbackSentence(entry.category);
    });
  }

  var homeData = getJSON("./content/index.json");

  Promise.all([homeData, getJSON("./content/treatments.json")]).then(
    function (results) {
      fillServiceCards(results[0] || {}, results[1] || {});
    }
  );

  homeData
    .then(function (data) {
      TEXT_FIELDS.forEach(function (field) {
        var el = document.querySelector(".js-" + field);
        var value = data[field.replace(/-/g, "_")];
        if (el && value) el.textContent = value;
      });

      var notice = document.querySelector(".hero-notice");
      if (notice) {
        var noticeTitle = (data.notice_title || "").trim();
        var noticeText = (data.notice || "").trim();
        setOrHide(notice.querySelector(".js-notice-title"), noticeTitle);
        setOrHide(notice.querySelector(".js-notice"), noticeText);
        notice.hidden = !noticeTitle && !noticeText;
      }

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

  getJSON("./content/our-team.json")
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

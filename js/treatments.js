/* Clones content/treatments.json's "categories" array into one accordion
   item per entry on treatments.html, using #treatment-category-template as
   the markup source. Content is single-language (Dutch) — it does not
   react to the NL/EN toggle. The H1 stays hardcoded/translated via i18n.js;
   only the subtitle and the categories below it come from the CMS. */
(function () {
  function slugify(text) {
    return (text || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  function buildCategory(category, index, template) {
    var node = template.content.firstElementChild.cloneNode(true);
    var slug = category.slug || slugify(category.title) || "cat-" + index;

    node.id = slug;
    var header = node.querySelector(".accordion-header");
    var panel = node.querySelector(".accordion-panel");
    header.id = "header-" + slug;
    panel.id = "panel-" + slug;
    header.setAttribute("aria-controls", panel.id);
    panel.setAttribute("aria-labelledby", header.id);

    node.querySelector(".js-title").textContent = category.title;
    node.querySelector(".js-intro").textContent = category.intro;

    var list = node.querySelector(".js-items");
    (category.items || []).forEach(function (item) {
      var li = document.createElement("li");
      li.textContent = item;
      list.appendChild(li);
    });

    return node;
  }

  fetch("./content/treatments.json")
    .then(function (r) {
      return r.json();
    })
    .then(function (data) {
      var subtitle = document.querySelector(".js-subtitle");
      if (subtitle && data.subtitle) subtitle.textContent = data.subtitle;

      var container = document.getElementById("treatments-accordion");
      var template = document.getElementById("treatment-category-template");
      if (!container || !template) return;

      (data.categories || []).forEach(function (category, i) {
        if (!category.title) return; // incomplete entry, nothing to show yet
        container.appendChild(buildCategory(category, i, template));
      });

      if (window.ZonnelaanAccordion) window.ZonnelaanAccordion.expandFromHash();
      if (window.ZonnelaanI18n) {
        window.ZonnelaanI18n.applyTranslations(window.ZonnelaanI18n.getLang());
      }
    });
})();

/* Clones content/patient-information.json's "sections" (and their nested
   "subsections") into the page, using #patient-info-section-template and
   #patient-info-subsection-template as the markup sources. */
(function () {
  function setOrHide(el, value) {
    if (!el) return;
    el.hidden = !value;
    if (value) el.textContent = value;
  }

  function buildSubsection(subsection, template) {
    var node = template.content.firstElementChild.cloneNode(true);

    node.querySelector(".js-subsection-title").textContent = subsection.title;
    setOrHide(node.querySelector(".js-subsection-text"), subsection.text);

    var cta = node.querySelector(".js-subsection-cta");
    if (cta) {
      if (subsection.cta_label && subsection.cta_url) {
        cta.textContent = subsection.cta_label;
        cta.href = subsection.cta_url;
      } else {
        cta.hidden = true;
      }
    }

    var points = subsection.points || [];
    var list = node.querySelector(".js-subsection-points");
    if (list) {
      if (points.length === 0) {
        list.hidden = true;
      } else {
        points.forEach(function (point) {
          var li = document.createElement("li");
          li.textContent = point;
          list.appendChild(li);
        });
      }
    }

    return node;
  }

  function buildSection(section, sectionTemplate, subsectionTemplate) {
    var node = sectionTemplate.content.firstElementChild.cloneNode(true);

    node.querySelector(".js-section-title").textContent = section.title;
    setOrHide(node.querySelector(".js-section-intro"), section.intro);

    var subsectionsContainer = node.querySelector(".js-subsections");
    (section.subsections || []).forEach(function (subsection) {
      if (!subsection.title) return; // incomplete entry, nothing to show yet
      subsectionsContainer.appendChild(
        buildSubsection(subsection, subsectionTemplate)
      );
    });

    return node;
  }

  fetch("./content/patient-information.json")
    .then(function (r) {
      return r.json();
    })
    .then(function (data) {
      var title = document.querySelector(".js-title");
      if (title && data.title) title.textContent = data.title;

      var subtitle = document.querySelector(".js-subtitle");
      if (subtitle && data.subtitle) subtitle.textContent = data.subtitle;

      var container = document.getElementById("patient-info-sections");
      var sectionTemplate = document.getElementById(
        "patient-info-section-template"
      );
      var subsectionTemplate = document.getElementById(
        "patient-info-subsection-template"
      );
      if (!container || !sectionTemplate || !subsectionTemplate) return;

      (data.sections || []).forEach(function (section) {
        if (!section.title) return; // incomplete entry, nothing to show yet
        container.appendChild(
          buildSection(section, sectionTemplate, subsectionTemplate)
        );
      });
    });
})();

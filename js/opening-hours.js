/* Fills every .js-hours-weekday / .js-hours-weekend element on the page
   (homepage contact section and the footer on all pages) from
   content/index.json. The values may span multiple lines; CSS
   (white-space: pre-line) renders each line as its own row. */
(function () {
  var FIELDS = ["hours-weekday", "hours-weekend"];

  fetch("./content/index.json")
    .then(function (r) {
      return r.json();
    })
    .then(function (data) {
      FIELDS.forEach(function (field) {
        var value = (data[field.replace(/-/g, "_")] || "").trim();
        if (!value) return;
        document.querySelectorAll(".js-" + field).forEach(function (el) {
          el.textContent = value;
        });
      });
    });
})();

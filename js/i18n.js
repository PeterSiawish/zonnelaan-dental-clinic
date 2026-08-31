/* Bilingual (NL/EN) dictionary + apply/toggle/persist logic.
   Elements opt in via:
     data-i18n="key"        -> sets textContent
     data-i18n-html="key"   -> sets innerHTML (only for strings that legitimately need inline markup)
     data-i18n-attr="attr:key|attr2:key2" -> sets attribute(s), e.g. alt/placeholder/title
   Dutch is the default language and is authored as the literal content of every
   HTML file, so the NL path never flashes even before this script runs. */

(function () {
  var STORAGE_KEY = "zonnelaan-lang";
  var DEFAULT_LANG = "nl";

  var translations = {
    nl: {
      "nav.home": "Home",
      "nav.team": "Ons Team",
      "nav.treatments": "Behandelingen",
      "nav.rates": "Tarieven",
      "nav.emergency": "Spoed",
      "nav.menuToggle": "Menu openen of sluiten",

      "common.callNow": "Bel nu",
      "common.emergency": "Spoed",
      "common.readMore": "Lees meer",

      "footer.addressTitle": "Adres",
      "footer.hoursTitle": "Openingstijden",
      "footer.linksTitle": "Snel naar",
      "footer.hours.weekdays": "Ma–Vr: 08:30–17:00",
      "footer.hours.weekend": "Za–Zo: Gesloten",
      "footer.bottom": "© 2026 Tandartsenpraktijk Zonnelaan. Alle rechten voorbehouden.",

      "home.hero.title": "Welkom bij Tandartsenpraktijk Zonnelaan",
      "home.hero.subtitle": "Persoonlijke, moderne tandheelkundige zorg voor het hele gezin in Groningen.",
      "home.hero.ctaPrimary": "Maak een afspraak",
      "home.hero.ctaSecondary": "Bekijk behandelingen",
      "home.hero.ctaTertiary": "Bekijk team",

      "home.location.title": "Bezoek of bel ons",
      "home.location.subtitle": "Zonnelaan 32 in Groningen, goed bereikbaar per fiets, auto en openbaar vervoer.",
      "home.location.addressLabel": "Adres",
      "home.location.phoneLabel": "Telefoon",
      "home.location.emailLabel": "E-mail",
      "home.location.hoursLabel": "Openingstijden",
      "home.location.mapTitle": "Route",

      "home.services.title": "Onze zorg",
      "home.services.subtitle": "Van preventie tot specialistische behandelingen, helder uitgelegd.",
      "home.services.cat1.text": "Periodieke controles, gebitsreiniging en preventieve begeleiding om problemen voor te blijven.",
      "home.services.cat2.text": "Vullingen, kronen, bruggen en cosmetische behandelingen zoals bleken en facings.",
      "home.services.cat3.text": "Wortelkanaalbehandelingen, parodontologie en implantologie voor complexere zorg.",
      "home.services.cat4.text": "Rustige, stapsgewijze begeleiding voor patiënten die extra geruststelling nodig hebben.",

      "home.explore.rates": "Bekijk tarieven & vergoedingen",
      "home.explore.emergency": "Wat te doen bij een spoedgeval",

      "home.team.title": "Ons Team",
      "home.team.subtitle": "Maak kennis met onze tandartsen en mondhygiënisten.",
      "home.team.cta": "Maak kennis met het hele team",

      "team.hero.title": "Ons Team",
      "team.hero.subtitle": "Maak kennis met de tandartsen en mondhygiënisten van Tandartsenpraktijk Zonnelaan.",
      "team.placeholderNotice": "PLACEHOLDER: vervang met echte gegevens",
      "team.label.big": "BIG-nummer",
      "team.label.krt": "KRT-nummer",
      "team.label.specializations": "Specialisaties",
      "team.label.languages": "Talen",

      "treatments.hero.title": "Behandelingen",
      "treatments.hero.subtitle": "Heldere uitleg over onze zorg, in gewone taal.",
      // treatments.catN.title: category text now lives in content/treatments.json,
      // but these 4 keys stay here because index.html's homepage service cards
      // still use them directly (data-i18n="treatments.catN.title").
      "treatments.cat1.title": "Preventieve Zorg",
      "treatments.cat2.title": "Restauratief & Cosmetisch",
      "treatments.cat3.title": "Specialistische Zorg",
      "treatments.cat4.title": "Angstpatiënten (Angsttandarts)",

      "rates.hero.title": "Tarieven & Vergoedingen",
      "rates.hero.subtitle": "Wat kost een behandeling, en wat wordt vergoed?",
      "rates.nza.title": "Vaste NZa-tarieven",
      "rates.nza.text": "De tarieven voor tandheelkundige zorg in Nederland worden jaarlijks vastgesteld door de Nederlandse Zorgautoriteit (NZa) en zijn bij elke praktijk hetzelfde. Wij bepalen dus niet zelf onze prijzen. Op uw factuur staan de officiële prestatiecodes (bijv. C11, M03) die u kunt opzoeken bij de NZa.",
      "rates.insurance.title": "Aanvullende Tandartsverzekering",
      "rates.insurance.text": "De basisverzekering vergoedt reguliere tandheelkundige zorg voor volwassenen niet (alleen tot 18 jaar). Een aanvullende tandartsverzekering wordt daarom aangeraden. Vergoedingspercentages en maxima verschillen per verzekeraar en pakket. Controleer uw polisvoorwaarden.",
      "rates.billing.title": "Rechtstreekse Facturatie",
      "rates.billing.text": "Voor veel verzekeraars kunnen wij rechtstreeks factureren, zodat u niet hoeft voor te schieten. Neem contact op om te controleren of dit voor uw verzekeraar geldt.",
      "rates.billing.placeholderNote": "PLACEHOLDER: voeg hier een lijst toe van verzekeraars waarmee direct wordt gefactureerd.",

      "emergency.hero.title": "Spoedgevallen",
      "emergency.hero.subtitle": "Wat te doen bij acute tandheelkundige klachten.",
      "emergency.during.title": "Tijdens openingstijden",
      "emergency.during.text": "Bel direct 050-8795127 voor een spoedafspraak dezelfde dag. Wij proberen u zo snel mogelijk te helpen.",
      "emergency.during.cta": "Bel 050-8795127",
      "emergency.after.title": "Buiten openingstijden",
      "emergency.after.text": "Voor spoedeisende tandheelkundige zorg in de avond, het weekend of op feestdagen kunt u terecht bij de Tandartsenpost Groningen.",
      "emergency.after.placeholderWarning": "Let op: dit zijn voorlopige contactgegevens. Controleer en vervang met de actuele gegevens van de tandartsenpost voordat de site live gaat.",
      "emergency.after.postName": "Tandartsenpost Groningen (PLACEHOLDER)",
      "emergency.after.postPhoneLabel": "Telefoon (PLACEHOLDER)",
      "emergency.after.postAddressLabel": "Adres (PLACEHOLDER)",
      "emergency.symptoms.title": "Veelvoorkomende noodsituaties",
      "emergency.symptoms.item1": "Hevige kiespijn die niet overgaat",
      "emergency.symptoms.item2": "Tand eruit geslagen (bewaar vochtig, zoek binnen 1 uur hulp)",
      "emergency.symptoms.item3": "Zwelling van kaak of gezicht",
      "emergency.symptoms.item4": "Aanhoudende bloeding na een extractie",
      "emergency.symptoms.item5": "Losgeraakte vulling of kroon met pijnklachten"
    },

    en: {
      "nav.home": "Home",
      "nav.team": "Our Team",
      "nav.treatments": "Treatments",
      "nav.rates": "Rates",
      "nav.emergency": "Emergency",
      "nav.menuToggle": "Open or close menu",

      "common.callNow": "Call now",
      "common.emergency": "Emergency",
      "common.readMore": "Read more",

      "footer.addressTitle": "Address",
      "footer.hoursTitle": "Opening Hours",
      "footer.linksTitle": "Quick Links",
      "footer.hours.weekdays": "Mon–Fri: 08:30–17:00",
      "footer.hours.weekend": "Sat–Sun: Closed",
      "footer.bottom": "© 2026 Tandartsenpraktijk Zonnelaan. All rights reserved.",

      "home.hero.title": "Welcome to Tandartsenpraktijk Zonnelaan",
      "home.hero.subtitle": "Personal, modern dental care for the whole family in Groningen.",
      "home.hero.ctaPrimary": "Book an appointment",
      "home.hero.ctaSecondary": "View treatments",
      "home.hero.ctaTertiary": "View team",

      "home.location.title": "Visit or call us",
      "home.location.subtitle": "Zonnelaan 32 in Groningen, easy to reach by bike, car and public transport.",
      "home.location.addressLabel": "Address",
      "home.location.phoneLabel": "Phone",
      "home.location.emailLabel": "Email",
      "home.location.hoursLabel": "Opening hours",
      "home.location.mapTitle": "Directions",

      "home.services.title": "Our care",
      "home.services.subtitle": "From prevention to specialist treatment, explained clearly.",
      "home.services.cat1.text": "Regular check-ups, cleanings and preventive guidance to stay ahead of problems.",
      "home.services.cat2.text": "Fillings, crowns, bridges and cosmetic treatments such as whitening and veneers.",
      "home.services.cat3.text": "Root canal treatment, periodontology and implantology for more complex care.",
      "home.services.cat4.text": "Calm, step-by-step guidance for patients who need extra reassurance.",

      "home.explore.rates": "View rates & insurance",
      "home.explore.emergency": "What to do in a dental emergency",

      "home.team.title": "Our Team",
      "home.team.subtitle": "Meet our dentists and dental hygienists.",
      "home.team.cta": "Meet the full team",

      "team.hero.title": "Our Team",
      "team.hero.subtitle": "Meet the dentists and dental hygienists at Tandartsenpraktijk Zonnelaan.",
      "team.placeholderNotice": "PLACEHOLDER: replace with real data",
      "team.label.big": "BIG number",
      "team.label.krt": "KRT number",
      "team.label.specializations": "Specializations",
      "team.label.languages": "Languages",

      "treatments.hero.title": "Treatments",
      "treatments.hero.subtitle": "Clear explanations of our care, in plain language.",
      // treatments.catN.title: category text now lives in content/treatments.json,
      // but these 4 keys stay here because index.html's homepage service cards
      // still use them directly (data-i18n="treatments.catN.title").
      "treatments.cat1.title": "Preventive Care",
      "treatments.cat2.title": "Restorative & Cosmetic",
      "treatments.cat3.title": "Specialist Care",
      "treatments.cat4.title": "Anxiety Patients (Angsttandarts)",

      "rates.hero.title": "Rates & Insurance",
      "rates.hero.subtitle": "What does treatment cost, and what's covered?",
      "rates.nza.title": "Fixed NZa Rates",
      "rates.nza.text": "Rates for dental care in the Netherlands are set annually by the Nederlandse Zorgautoriteit (NZa) and are the same at every practice nationwide. We don't set our own prices. Your invoice lists the official procedure codes (e.g. C11, M03) which you can look up via the NZa.",
      "rates.insurance.title": "Supplementary Dental Insurance",
      "rates.insurance.text": "Basic Dutch health insurance does not cover routine adult dental care (only up to age 18). A supplementary dental insurance policy is therefore recommended. Coverage percentages and maximums vary per insurer and plan. Check your policy terms.",
      "rates.billing.title": "Direct Billing",
      "rates.billing.text": "For many insurers we can bill directly, so you don't have to pay upfront. Contact us to check whether this applies to your insurer.",
      "rates.billing.placeholderNote": "PLACEHOLDER: add a list of insurers with direct billing here.",

      "emergency.hero.title": "Emergency Care",
      "emergency.hero.subtitle": "What to do in a dental emergency.",
      "emergency.during.title": "During opening hours",
      "emergency.during.text": "Call 050-8795127 directly for a same-day emergency appointment. We'll help you as quickly as possible.",
      "emergency.during.cta": "Call 050-8795127",
      "emergency.after.title": "Outside opening hours",
      "emergency.after.text": "For urgent dental care in the evening, on weekends or on public holidays, you can go to Tandartsenpost Groningen.",
      "emergency.after.placeholderWarning": "Note: this is placeholder contact information. Verify and replace with the current on-call dental service details before going live.",
      "emergency.after.postName": "Tandartsenpost Groningen (PLACEHOLDER)",
      "emergency.after.postPhoneLabel": "Phone (PLACEHOLDER)",
      "emergency.after.postAddressLabel": "Address (PLACEHOLDER)",
      "emergency.symptoms.title": "Common emergencies",
      "emergency.symptoms.item1": "Severe toothache that won't go away",
      "emergency.symptoms.item2": "Knocked-out tooth (keep it moist, seek care within 1 hour)",
      "emergency.symptoms.item3": "Swelling of the jaw or face",
      "emergency.symptoms.item4": "Uncontrolled bleeding after an extraction",
      "emergency.symptoms.item5": "Lost filling or crown with pain"
    }
  };

  function getLang() {
    return localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;
  }

  function updateToggleUI(lang) {
    document.querySelectorAll("[data-lang-btn]").forEach(function (btn) {
      var isActive = btn.getAttribute("data-lang-btn") === lang;
      btn.setAttribute("aria-pressed", isActive ? "true" : "false");
    });
  }

  function applyTranslations(lang) {
    var dict = translations[lang] || translations[DEFAULT_LANG];

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      if (dict[key] !== undefined) el.textContent = dict[key];
    });

    document.querySelectorAll("[data-i18n-html]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-html");
      if (dict[key] !== undefined) el.innerHTML = dict[key];
    });

    document.querySelectorAll("[data-i18n-attr]").forEach(function (el) {
      el.getAttribute("data-i18n-attr").split("|").forEach(function (pair) {
        var parts = pair.split(":");
        var attr = parts[0];
        var key = parts[1];
        if (dict[key] !== undefined) el.setAttribute(attr, dict[key]);
      });
    });
  }

  function setLang(lang) {
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.setAttribute("lang", lang);
    applyTranslations(lang);
    updateToggleUI(lang);
  }

  window.ZonnelaanI18n = {
    getLang: getLang,
    setLang: setLang,
    applyTranslations: applyTranslations,
    translations: translations
  };

  document.addEventListener("DOMContentLoaded", function () {
    var lang = getLang();
    applyTranslations(lang);
    updateToggleUI(lang);
    document.documentElement.classList.remove("lang-en-pending");

    document.querySelectorAll("[data-lang-btn]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        setLang(btn.getAttribute("data-lang-btn"));
      });
    });
  });
})();

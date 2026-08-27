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
      "nav.contact": "Contact",
      "nav.menuToggle": "Menu openen of sluiten",

      "common.callNow": "Bel nu",
      "common.emergency": "Spoed",
      "common.readMore": "Lees meer",

      "badge.accepting": "Wij nemen nieuwe patiënten aan",
      "badge.notAccepting": "Momenteel geen nieuwe patiënten",

      "footer.addressTitle": "Adres",
      "footer.hoursTitle": "Openingstijden",
      "footer.linksTitle": "Snel naar",
      "footer.trustTitle": "Keurmerken",
      "footer.hours.weekdays": "Ma–Vr: 08:30–17:00",
      "footer.hours.weekend": "Za–Zo: Gesloten",
      "footer.trust.text": "Geregistreerd bij KNMT en KRT",
      "footer.bottom": "© 2026 Tandartsenpraktijk Zonnelaan. Alle rechten voorbehouden.",

      "home.hero.title": "Welkom bij Tandartsenpraktijk Zonnelaan",
      "home.hero.subtitle": "Persoonlijke, moderne tandheelkundige zorg voor het hele gezin in Groningen.",
      "home.hero.ctaPrimary": "Maak een afspraak",
      "home.hero.ctaSecondary": "Bekijk behandelingen",
      "home.intro.title": "Fijne tandheelkunde, dichtbij huis",
      "home.intro.text": "Bij Tandartsenpraktijk Zonnelaan combineren we vakkundige zorg met een persoonlijke, rustige aanpak. Of u nu voor een reguliere controle komt of wat extra begeleiding nodig heeft: ons team staat voor u klaar.",
      "home.highlights.title": "Alles wat u wilt weten",
      "home.highlights.team.title": "Ons Team",
      "home.highlights.team.text": "Maak kennis met onze tandartsen en mondhygiënisten.",
      "home.highlights.treatments.title": "Behandelingen",
      "home.highlights.treatments.text": "Van controle tot implantologie — helder uitgelegd.",
      "home.highlights.emergency.title": "Spoedgevallen",
      "home.highlights.emergency.text": "Weten wat u moet doen bij een tandheelkundige noodsituatie.",
      "home.highlights.rates.title": "Tarieven",
      "home.highlights.rates.text": "Vaste NZa-tarieven en informatie over vergoedingen.",
      "home.testimonials.title": "Wat patiënten zeggen",
      "home.testimonial1.text": "Heldere uitleg, vriendelijk team en nooit lang wachten. Echt een aanrader!",
      "home.testimonial1.author": "J. van der Berg",
      "home.testimonial2.text": "Als angstpatiënt voelde ik me hier voor het eerst echt op mijn gemak.",
      "home.testimonial2.author": "M. Hendriks",
      "home.testimonial3.text": "Snel geholpen met een spoedgeval in het weekend, top service.",
      "home.testimonial3.author": "R. Postma",
      "home.map.title": "Vind ons in Groningen",
      "home.map.text": "Zonnelaan 32, 9742 BM Groningen — goed bereikbaar per fiets, auto en openbaar vervoer.",
      "home.map.link": "Bekijk contactgegevens",

      "team.hero.title": "Ons Team",
      "team.hero.subtitle": "Maak kennis met de tandartsen en mondhygiënisten van Tandartsenpraktijk Zonnelaan.",
      "team.placeholderNotice": "PLACEHOLDER — vervang met echte gegevens",
      "team.label.big": "BIG-nummer",
      "team.label.krt": "KRT-nummer",
      "team.label.specializations": "Specialisaties",
      "team.label.languages": "Talen",

      "team.staff1.role": "Tandarts / Dentist",
      "team.staff1.big": "PLACEHOLDER-BIG-00000001",
      "team.staff1.specializations": "Algemene tandheelkunde, Endodontologie",
      "team.staff1.languages": "Nederlands, Engels",
      "team.staff1.bio": "Sanne is sinds 2012 werkzaam als tandarts en richt zich op een persoonlijke, rustige benadering — ideaal voor patiënten die wat extra geruststelling nodig hebben.",

      "team.staff2.role": "Tandarts / Angsttandarts",
      "team.staff2.big": "PLACEHOLDER-BIG-00000002",
      "team.staff2.specializations": "Angstbegeleiding, Cosmetische tandheelkunde",
      "team.staff2.languages": "Nederlands, Engels, Duits",
      "team.staff2.bio": "Mark heeft zich gespecialiseerd in de begeleiding van angstige patiënten en werkt nauw samen met het team om behandelingen zo comfortabel mogelijk te maken.",

      "team.staff3.role": "Mondhygiënist / Dental Hygienist",
      "team.staff3.krt": "PLACEHOLDER-KRT-00000003",
      "team.staff3.specializations": "Parodontologie, Preventieve zorg",
      "team.staff3.languages": "Nederlands, Engels",
      "team.staff3.bio": "Lisa helpt patiënten van jong tot oud bij het behouden van een gezond gebit door persoonlijke voorlichting en professionele reiniging.",

      "team.staff4.role": "Tandarts / Implantologie",
      "team.staff4.big": "PLACEHOLDER-BIG-00000004",
      "team.staff4.specializations": "Implantologie, Restauratieve tandheelkunde",
      "team.staff4.languages": "Nederlands, Engels, Arabisch",
      "team.staff4.bio": "Fatima combineert precisie met een warme, toegankelijke stijl van zorg en heeft een bijzondere interesse in implantaatbehandelingen.",

      "treatments.hero.title": "Behandelingen",
      "treatments.hero.subtitle": "Heldere uitleg over onze zorg, in gewone taal.",
      "treatments.cat1.title": "Preventieve Zorg",
      "treatments.cat1.item1": "Periodieke controle",
      "treatments.cat1.item2": "Tandsteen verwijderen (gebitsreiniging)",
      "treatments.cat1.item3": "Fluoridebehandeling",
      "treatments.cat1.item4": "Mondhygiëne-instructie",
      "treatments.cat1.item5": "Sealants voor kinderen",
      "treatments.cat1.item6": "Röntgenfoto's (diagnostisch)",
      "treatments.cat2.title": "Restauratief & Cosmetisch",
      "treatments.cat2.item1": "Composiet vullingen (tandkleurig)",
      "treatments.cat2.item2": "Kronen en bruggen",
      "treatments.cat2.item3": "Tandbleken",
      "treatments.cat2.item4": "Facings (veneers)",
      "treatments.cat2.item5": "Vervangen van oude vullingen",
      "treatments.cat3.title": "Specialistische Zorg",
      "treatments.cat3.item1": "Wortelkanaalbehandeling (endodontologie)",
      "treatments.cat3.item2": "Parodontale behandeling (tandvleesbehandeling)",
      "treatments.cat3.item3": "Implantologie",
      "treatments.cat3.item4": "Verwijzing kaakchirurgie indien nodig",
      "treatments.cat4.title": "Angstpatiënten (Angsttandarts)",
      "treatments.cat4.item1": "Uitgebreide intake en rustig tempo",
      "treatments.cat4.item2": "Verdovingsopties op maat",
      "treatments.cat4.item3": "Stap-voor-stap uitleg vooraf",
      "treatments.cat4.item4": "Mogelijkheid tot pauzes tijdens behandeling",
      "treatments.cat4.item5": "Begeleiding door ervaren angsttandarts (zie Ons Team)",

      "rates.hero.title": "Tarieven & Vergoedingen",
      "rates.hero.subtitle": "Wat kost een behandeling, en wat wordt vergoed?",
      "rates.nza.title": "Vaste NZa-tarieven",
      "rates.nza.text": "De tarieven voor tandheelkundige zorg in Nederland worden jaarlijks vastgesteld door de Nederlandse Zorgautoriteit (NZa) en zijn bij elke praktijk hetzelfde. Wij bepalen dus niet zelf onze prijzen. Op uw factuur staan de officiële prestatiecodes (bijv. C11, M03) die u kunt opzoeken bij de NZa.",
      "rates.insurance.title": "Aanvullende Tandartsverzekering",
      "rates.insurance.text": "De basisverzekering vergoedt reguliere tandheelkundige zorg voor volwassenen niet (alleen tot 18 jaar). Een aanvullende tandartsverzekering wordt daarom aangeraden. Vergoedingspercentages en maxima verschillen per verzekeraar en pakket — controleer uw polisvoorwaarden.",
      "rates.billing.title": "Rechtstreekse Facturatie",
      "rates.billing.text": "Voor veel verzekeraars kunnen wij rechtstreeks factureren, zodat u niet hoeft voor te schieten. Neem contact op om te controleren of dit voor uw verzekeraar geldt.",
      "rates.billing.placeholderNote": "PLACEHOLDER — voeg hier een lijst toe van verzekeraars waarmee direct wordt gefactureerd.",

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
      "emergency.symptoms.item5": "Losgeraakte vulling of kroon met pijnklachten",

      "contact.hero.title": "Contact & Registratie",
      "contact.hero.subtitle": "Neem contact op of meld u aan als nieuwe patiënt.",
      "contact.card.title": "Praktijkgegevens",
      "contact.card.addressLabel": "Adres",
      "contact.card.phoneLabel": "Telefoon",
      "contact.card.emailLabel": "E-mail",
      "contact.card.hoursLabel": "Openingstijden",
      "contact.map.title": "Route",
      "contact.form.title": "Terugbelverzoek / Aanmelden",
      "contact.form.nameLabel": "Volledige naam",
      "contact.form.emailLabel": "E-mailadres",
      "contact.form.phoneLabel": "Telefoonnummer",
      "contact.form.patientStatusLabel": "Nieuwe of bestaande patiënt?",
      "contact.form.patientStatusPlaceholder": "Kies een optie",
      "contact.form.patientStatusNew": "Nieuwe patiënt",
      "contact.form.patientStatusExisting": "Bestaande patiënt",
      "contact.form.callbackWindowLabel": "Gewenst tijdvak voor terugbelmoment",
      "contact.form.callbackPlaceholder": "Kies een tijdvak",
      "contact.form.callbackMorning": "Ochtend (08:30–12:00)",
      "contact.form.callbackAfternoon": "Middag (12:00–17:00)",
      "contact.form.consent": "Ik ga akkoord dat mijn gegevens worden gebruikt om contact met mij op te nemen.",
      "contact.form.submit": "Versturen",
      "contact.form.gdprNote": "Wij vragen alleen naar de gegevens die nodig zijn om u terug te bellen (naam, e-mail, telefoon, patiëntstatus en voorkeurstijd). Er wordt geen medische informatie via dit formulier verzameld. Uw gegevens worden verwerkt door Formspree als verwerker van dit formulier en alleen gebruikt om contact met u op te nemen.",
      "contact.form.errorRequired": "Dit veld is verplicht.",
      "contact.form.errorEmail": "Vul een geldig e-mailadres in.",
      "contact.form.errorPhone": "Vul een geldig telefoonnummer in.",
      "contact.form.errorConsent": "U dient akkoord te gaan om het formulier te versturen.",
      "contact.form.successMessage": "Bedankt! Uw bericht is verzonden — wij nemen zo spoedig mogelijk contact met u op.",
      "contact.form.errorSubmit": "Er ging iets mis bij het versturen. Probeer het later opnieuw of bel ons op 050-8795127.",
      "contact.trust.title": "Keurmerken & Ervaringen"
    },

    en: {
      "nav.home": "Home",
      "nav.team": "Our Team",
      "nav.treatments": "Treatments",
      "nav.rates": "Rates",
      "nav.emergency": "Emergency",
      "nav.contact": "Contact",
      "nav.menuToggle": "Open or close menu",

      "common.callNow": "Call now",
      "common.emergency": "Emergency",
      "common.readMore": "Read more",

      "badge.accepting": "Currently accepting new patients",
      "badge.notAccepting": "Not accepting new patients right now",

      "footer.addressTitle": "Address",
      "footer.hoursTitle": "Opening Hours",
      "footer.linksTitle": "Quick Links",
      "footer.trustTitle": "Registrations",
      "footer.hours.weekdays": "Mon–Fri: 08:30–17:00",
      "footer.hours.weekend": "Sat–Sun: Closed",
      "footer.trust.text": "Registered with KNMT and KRT",
      "footer.bottom": "© 2026 Tandartsenpraktijk Zonnelaan. All rights reserved.",

      "home.hero.title": "Welcome to Tandartsenpraktijk Zonnelaan",
      "home.hero.subtitle": "Personal, modern dental care for the whole family in Groningen.",
      "home.hero.ctaPrimary": "Book an appointment",
      "home.hero.ctaSecondary": "View treatments",
      "home.intro.title": "Comfortable dentistry, close to home",
      "home.intro.text": "At Tandartsenpraktijk Zonnelaan we combine skilled care with a personal, unhurried approach. Whether you're here for a routine check-up or need a little extra support, our team is ready for you.",
      "home.highlights.title": "Everything you want to know",
      "home.highlights.team.title": "Our Team",
      "home.highlights.team.text": "Meet our dentists and dental hygienists.",
      "home.highlights.treatments.title": "Treatments",
      "home.highlights.treatments.text": "From check-ups to implants — explained clearly.",
      "home.highlights.emergency.title": "Emergencies",
      "home.highlights.emergency.text": "Know what to do in a dental emergency.",
      "home.highlights.rates.title": "Rates",
      "home.highlights.rates.text": "Fixed nationwide NZa rates and insurance info.",
      "home.testimonials.title": "What patients say",
      "home.testimonial1.text": "Clear explanations, friendly team, never a long wait. Highly recommend!",
      "home.testimonial1.author": "J. van der Berg",
      "home.testimonial2.text": "As an anxious patient, I finally felt truly at ease here.",
      "home.testimonial2.author": "M. Hendriks",
      "home.testimonial3.text": "Helped quickly with a weekend emergency, excellent service.",
      "home.testimonial3.author": "R. Postma",
      "home.map.title": "Find us in Groningen",
      "home.map.text": "Zonnelaan 32, 9742 BM Groningen — easy to reach by bike, car and public transport.",
      "home.map.link": "View contact details",

      "team.hero.title": "Our Team",
      "team.hero.subtitle": "Meet the dentists and dental hygienists at Tandartsenpraktijk Zonnelaan.",
      "team.placeholderNotice": "PLACEHOLDER — replace with real data",
      "team.label.big": "BIG number",
      "team.label.krt": "KRT number",
      "team.label.specializations": "Specializations",
      "team.label.languages": "Languages",

      "team.staff1.role": "Tandarts / Dentist",
      "team.staff1.big": "PLACEHOLDER-BIG-00000001",
      "team.staff1.specializations": "General dentistry, Endodontics",
      "team.staff1.languages": "Dutch, English",
      "team.staff1.bio": "Sanne has practiced dentistry since 2012 and focuses on a calm, personal approach — ideal for patients who appreciate extra reassurance.",

      "team.staff2.role": "Dentist / Anxiety care",
      "team.staff2.big": "PLACEHOLDER-BIG-00000002",
      "team.staff2.specializations": "Anxiety guidance, Cosmetic dentistry",
      "team.staff2.languages": "Dutch, English, German",
      "team.staff2.bio": "Mark specializes in supporting anxious patients and works closely with the team to make treatments as comfortable as possible.",

      "team.staff3.role": "Mondhygiënist / Dental Hygienist",
      "team.staff3.krt": "PLACEHOLDER-KRT-00000003",
      "team.staff3.specializations": "Periodontology, Preventive care",
      "team.staff3.languages": "Dutch, English",
      "team.staff3.bio": "Lisa helps patients of all ages maintain healthy teeth through personalized guidance and professional cleanings.",

      "team.staff4.role": "Dentist / Implantology",
      "team.staff4.big": "PLACEHOLDER-BIG-00000004",
      "team.staff4.specializations": "Implantology, Restorative dentistry",
      "team.staff4.languages": "Dutch, English, Arabic",
      "team.staff4.bio": "Fatima combines precision with a warm, approachable style of care and has a particular interest in implant treatments.",

      "treatments.hero.title": "Treatments",
      "treatments.hero.subtitle": "Clear explanations of our care, in plain language.",
      "treatments.cat1.title": "Preventive Care",
      "treatments.cat1.item1": "Regular check-ups",
      "treatments.cat1.item2": "Scaling and polishing (cleaning)",
      "treatments.cat1.item3": "Fluoride treatment",
      "treatments.cat1.item4": "Oral hygiene instruction",
      "treatments.cat1.item5": "Sealants for children",
      "treatments.cat1.item6": "Diagnostic X-rays",
      "treatments.cat2.title": "Restorative & Cosmetic",
      "treatments.cat2.item1": "Composite fillings (tooth-colored)",
      "treatments.cat2.item2": "Crowns and bridges",
      "treatments.cat2.item3": "Teeth whitening",
      "treatments.cat2.item4": "Veneers",
      "treatments.cat2.item5": "Replacement of old fillings",
      "treatments.cat3.title": "Specialist Care",
      "treatments.cat3.item1": "Root canal treatment (endodontics)",
      "treatments.cat3.item2": "Periodontal treatment (gum treatment)",
      "treatments.cat3.item3": "Implantology",
      "treatments.cat3.item4": "Referral for oral surgery when needed",
      "treatments.cat4.title": "Anxiety Patients (Angsttandarts)",
      "treatments.cat4.item1": "Extended intake and unhurried pace",
      "treatments.cat4.item2": "Tailored anesthesia options",
      "treatments.cat4.item3": "Step-by-step explanation beforehand",
      "treatments.cat4.item4": "Ability to pause during treatment",
      "treatments.cat4.item5": "Guidance from an experienced anxiety-care dentist (see Our Team)",

      "rates.hero.title": "Rates & Insurance",
      "rates.hero.subtitle": "What does treatment cost, and what's covered?",
      "rates.nza.title": "Fixed NZa Rates",
      "rates.nza.text": "Rates for dental care in the Netherlands are set annually by the Nederlandse Zorgautoriteit (NZa) and are the same at every practice nationwide. We don't set our own prices. Your invoice lists the official procedure codes (e.g. C11, M03) which you can look up via the NZa.",
      "rates.insurance.title": "Supplementary Dental Insurance",
      "rates.insurance.text": "Basic Dutch health insurance does not cover routine adult dental care (only up to age 18). A supplementary dental insurance policy is therefore recommended. Coverage percentages and maximums vary per insurer and plan — check your policy terms.",
      "rates.billing.title": "Direct Billing",
      "rates.billing.text": "For many insurers we can bill directly, so you don't have to pay upfront. Contact us to check whether this applies to your insurer.",
      "rates.billing.placeholderNote": "PLACEHOLDER — add a list of insurers with direct billing here.",

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
      "emergency.symptoms.item5": "Lost filling or crown with pain",

      "contact.hero.title": "Contact & Registration",
      "contact.hero.subtitle": "Get in touch or register as a new patient.",
      "contact.card.title": "Practice details",
      "contact.card.addressLabel": "Address",
      "contact.card.phoneLabel": "Phone",
      "contact.card.emailLabel": "Email",
      "contact.card.hoursLabel": "Opening hours",
      "contact.map.title": "Directions",
      "contact.form.title": "Callback Request / Registration",
      "contact.form.nameLabel": "Full name",
      "contact.form.emailLabel": "Email address",
      "contact.form.phoneLabel": "Phone number",
      "contact.form.patientStatusLabel": "New or existing patient?",
      "contact.form.patientStatusPlaceholder": "Choose an option",
      "contact.form.patientStatusNew": "New patient",
      "contact.form.patientStatusExisting": "Existing patient",
      "contact.form.callbackWindowLabel": "Preferred callback time window",
      "contact.form.callbackPlaceholder": "Choose a time window",
      "contact.form.callbackMorning": "Morning (08:30–12:00)",
      "contact.form.callbackAfternoon": "Afternoon (12:00–17:00)",
      "contact.form.consent": "I agree that my information will be used to contact me.",
      "contact.form.submit": "Send",
      "contact.form.gdprNote": "We only ask for the information needed to call you back (name, email, phone, patient status and preferred time). No medical information is collected via this form. Your data is processed by Formspree as the processor of this form and used only to contact you.",
      "contact.form.errorRequired": "This field is required.",
      "contact.form.errorEmail": "Please enter a valid email address.",
      "contact.form.errorPhone": "Please enter a valid phone number.",
      "contact.form.errorConsent": "You must agree before submitting the form.",
      "contact.form.successMessage": "Thank you! Your message has been sent — we'll contact you as soon as possible.",
      "contact.form.errorSubmit": "Something went wrong while sending. Please try again later or call us at 050-8795127.",
      "contact.trust.title": "Registrations & Reviews"
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

  // Exposed for status-badge.js (re-applies a translated key after computing
  // acceptance status) and form.js (looks up validation-error strings).
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

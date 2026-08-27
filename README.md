# Tandartsenpraktijk Zonnelaan — Website

Static, bilingual (NL/EN) website. Plain HTML5/CSS3/vanilla JS — no build step, no
frameworks, no npm. Deploy by pushing this folder to GitHub Pages or Netlify as-is.

## Before going live

1. **Formspree endpoint** — replace `YOUR_FORM_ID` with your real Formspree form ID in
   two places in `contact.html`/`js/form.js`:
   - `contact.html`: `<form action="https://formspree.io/f/YOUR_FORM_ID" ...>`
   - `js/form.js`: `var FORMSPREE_ENDPOINT = "https://formspree.io/f/YOUR_FORM_ID";`

2. **Placeholder content — all clearly marked, search for "PLACEHOLDER"**:
   - `team.html` — 4 fictional staff cards (names, BIG/KRT numbers, bios). Replace with
     real staff, photos (currently CSS-only initials avatars), and verified registration
     numbers.
   - `emergency.html` — the after-hours "Tandartsenpost Groningen" phone/address block is
     a safety-relevant placeholder. **Verify and replace before launch.**
   - `rates.html` — add a real list of insurers with direct billing where noted.
   - Testimonials on `index.html` and `contact.html` are fictional examples — replace
     with real reviews.

3. **"Accepting new patients" badge** — toggle `ACCEPTING_NEW_PATIENTS` (true/false) at
   the top of `js/status-badge.js`. It's a manual flag, not date-based.

## Editing header/footer

Header and footer markup is **duplicated by design** across all 6 HTML files (no
templating/build step). If you edit the header or footer, copy the change into all six
files: `index.html`, `team.html`, `treatments.html`, `rates.html`, `emergency.html`,
`contact.html`. The only per-page difference inside those blocks is the `active`
class / `aria-current="page"` on the current page's nav link.

## Editing translations

All NL/EN copy lives in one dictionary: `js/i18n.js` (`translations.nl` /
`translations.en`). HTML elements opt in via:
- `data-i18n="key"` → sets element text
- `data-i18n-html="key"` → sets innerHTML (only where inline markup is genuinely needed)
- `data-i18n-attr="attr:key"` → sets an attribute (e.g. `alt`, `title`)

When adding new copy, add the key to **both** `nl` and `en` objects — a missing key
silently falls back to whatever text is already in the HTML, which is easy to miss.

## File structure

```
index.html, team.html, treatments.html, rates.html, emergency.html, contact.html
css/tokens.css      - design tokens, reset, base typography
css/layout.css      - header, nav, mobile menu, sticky CTA bar, footer
css/components.css  - buttons, cards, badges, accordion, forms, testimonials
css/pages.css       - page-specific layout
js/i18n.js          - translation dictionary + language toggle/persistence
js/status-badge.js  - "accepting new patients" badge
js/nav.js           - mobile hamburger menu
js/accordion.js     - treatments accordion
js/form.js          - contact form validation + Formspree submission
```

## Local preview

```
python3 -m http.server
```
Then open `http://localhost:8000/`.

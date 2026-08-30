# Tandartsenpraktijk Zonnelaan — Website

Static, bilingual (NL/EN) website. Plain HTML5/CSS3/vanilla JS — no build step, no
frameworks, no npm. Deploy by pushing this folder to GitHub Pages or Netlify as-is.

## Before going live

1. **Placeholder content — all clearly marked, search for "PLACEHOLDER"**:
   - `team.html`/`index.html` — 4 fictional staff cards (names, BIG/KRT numbers, bios).
     Replace with real staff, photos (currently CSS-only initials avatars), and verified
     registration numbers.
   - `emergency.html` — the after-hours "Tandartsenpost Groningen" phone/address block is
     a safety-relevant placeholder. **Verify and replace before launch.**
   - `rates.html` — add a real list of insurers with direct billing where noted.

2. **Draft home page copy** — the new home page sections (location, services, team) on
   `index.html` use draft NL/EN copy written from existing site content. Review the
   `home.location.*`, `home.services.*`, `home.explore.*` and `home.team.*` keys in
   `js/i18n.js` and refine with the client before launch.

## Editing header/footer

Header and footer markup is **duplicated by design** across all 5 HTML files (no
templating/build step). If you edit the header or footer, copy the change into all five
files: `index.html`, `team.html`, `treatments.html`, `rates.html`, `emergency.html`.
The only per-page difference inside those blocks is the `active` class /
`aria-current="page"` on the current page's nav link.

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
index.html, team.html, treatments.html, rates.html, emergency.html
css/tokens.css      - design tokens, reset, base typography
css/layout.css      - header, nav, mobile menu, footer
css/components.css  - buttons, cards, accordion
css/pages.css       - page-specific layout
js/i18n.js          - translation dictionary + language toggle/persistence
js/nav.js           - mobile hamburger menu
js/accordion.js     - treatments accordion (also auto-expands a category when
                      linked to via a #cat1..#cat4 hash from the home page)
```

## Local preview

```
python3 -m http.server
```
Then open `http://localhost:8000/`.

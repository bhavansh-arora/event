# Utsava: Weddings & Celebrations

A conversion-focused website for an Indian wedding and event planning company. It covers Haldi, Mehendi, Sangeet,
Shaadi, Roka, Baraat, birthdays, Diwali and office parties, Dandiya nights and Holi parties.

It is static HTML, CSS and JS with no build step. Open `index.html`, or turn on GitHub Pages (Settings → Pages → `main`).

## Before going live: change these
1. **WhatsApp number:** `WHATSAPP_NUMBER` at the top of `assets/js/main.js` (country code, no `+`, e.g. `919812345678`).
2. **Phone number:** search `index.html` for `+91 98765 43210` / `+919876543210` and replace it.
3. **Address, email, Instagram handle, reviews and stats** in `index.html`.
4. **Photos:** these are free Pexels stock photos (no attribution required). Replacing them with the owner's real event photos converts best.

## How leads work
Every "Get quote" form submission opens **WhatsApp** on the visitor's phone with all the details pre-filled
(event, date, city, guests, budget, name, number), addressed to the owner's number.
No server or monthly fees are needed, and leads land directly in the owner's WhatsApp.

## Structure
- `index.html`: all sections
- `assets/css/styles.css`: styling
- `assets/js/main.js`: WhatsApp links, lead form, gallery filter and lightbox, slider, animations
- `assets/img/logo.svg`, `assets/img/logo-mark.svg`, `favicon.svg`: diya logo

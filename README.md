# Utsava: Weddings & Celebrations

A multi-page website for an Indian wedding and event planning company. It is static HTML/CSS/JS, served by GitHub Pages.

| Page | What's on it |
|---|---|
| `index.html` | Home: hero, ceremonies, gallery preview, reviews, packages, quote form |
| `weddings.html` | Roka → Haldi → Mehendi → Sangeet → Baraat → Pheras → Reception, plus destination weddings |
| `celebrations.html` | Birthdays, Diwali & office parties, Dandiya, Holi, family functions, corporate events |
| `gallery.html` | 32-photo gallery with filters and full-screen viewer |
| `packages.html` | Price cards, comparison table, add-ons, pricing FAQ |
| `about.html` | Story, values, team |
| `contact.html` | Quote form, call/WhatsApp/email, map, FAQ |

## Editing the site
The pages in the repo root are **generated**. Edit the source, then rebuild:

```
python3 _src/build.py
```

- `_src/build.py`: **phone number and WhatsApp number** (`CONFIG` at the top). Change them once and every page updates.
- `_src/pages/`: one file per page (title, description and hero text at the top of each)
- `_src/partials/`: shared blocks (header, footer, quote form, reviews, packages and so on)
- `assets/css/styles.css`, `assets/js/main.js`: styling and behaviour

## How leads work
Every quote form and WhatsApp button opens WhatsApp addressed to the owner's number, with the event, date, city,
guests, budget, name and phone already typed. Links like `contact.html?type=Haldi` pre-select the event type.

## Before going live
Replace the placeholder phone/WhatsApp number in `_src/build.py`, the address and email in `_src/partials/footer.html`
and `_src/pages/contact.html`, and the sample reviews, team names and stats. The photos are free Pexels stock images;
the owner's own event photos will convert best.

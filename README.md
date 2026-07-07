# Lagos City Guide — Nigeria

A comprehensive, single-page **city guide for visitors to Lagos**, Nigeria.
Built to help people coming from across Nigeria, Africa, and the rest of the world land smoothly, get around the city, eat well on any diet, and explore Africa's largest city without the rookie mistakes.

🔗 **Live site:** [Coming soon]

> ⚠️ **Unofficial.** This guide is a community project. Always confirm prices, venues, and current conditions before visiting.

---

## What's inside

A single scrolling page with nine sections, each place linking straight to Google Maps:

| # | Section | Covers |
|---|---------|--------|
| 01 | **Getting around** | Airport (MM2), ride-hailing (Uber/Bolt), taxis, danfo buses, traffic warnings |
| 02 | **Hotels** | Victoria Island, Ikoyi, Lekki and budget options, by price and distance |
| 03 | **Food** | Filterable by **vegetarian, vegan, dairy-free, halal, non-veg** (meat type named), with spice meter |
| 04 | **Water & health** | Tap-water warning, what's safe to drink, pharmacies & hospitals |
| 05 | **SIM, data & money** | eSIM vs local SIM (MTN/Airtel/Glo/9mobile), cash, ATMs, currency (NGN) |
| 06 | **Things to do** | Landmarks, beaches, markets, art galleries, nature reserves |
| 07 | **Tech & coworking** | Meetups, coworking spaces, internet connectivity |
| 08 | **Street smart** | Safety, getting around, emergency numbers |
| 09 | **Good to know** | Visa, weather, time zone, language (English & Pidgin phrases), etiquette, accessibility |

## Accessibility

Accessibility is built in, not bolted on. A toolbar (bottom-left) offers:

- **Text size** (3 levels)
- **High contrast** mode
- **Underline links** mode
- **Reduce motion** (also auto-detects your OS setting; disables the hero ripple and the ticker)
- **Read aloud** — text-to-speech that reads the guide section by section, highlighting and scrolling as it goes (for blind / low-vision users)

Plus a "skip to content" link, visible keyboard focus, ARIA labels on map links and the spice meters, a real `<main>` landmark, and decorative graphics hidden from screen readers. Preferences are saved per-device.

## Design

Warm, lightweight "earthen" theme (beige + terracotta / ochre / olive), with faint **line-art silhouettes of Lagos landmarks** behind the content — Third Mainland Bridge, Lekki-Ikoyi Link Bridge, and iconic Lagos skyline elements. The hero title layers "Lagos" with a subtle shadow effect.

---

## Project structure

```
.
├── index.html     # the entire page (markup + inline landmark SVGs + ripple filter)
├── styles.css     # theme, layout, landmark + accessibility styles
├── app.js         # diet filter, mobile nav, a11y toolbar, read-aloud, ARIA helpers
├── .nojekyll      # tell GitHub Pages to skip Jekyll (plain static site)
├── README.md
└── CONTRIBUTING.md
```

No build step, no dependencies to install. The only external resource is Google Fonts (loaded via CDN).

## Run it locally

Because everything is static, you can just open the file:

```bash
open index.html        # macOS
```

Or serve it (recommended, so relative paths and fonts behave like production):

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploy (GitHub Pages)

This repo is served by GitHub Pages from the **`main` branch, root folder**. Any push to `main` redeploys automatically within a minute or two.

If you fork it, enable Pages under **Settings → Pages → Source: Deploy from a branch → `main` / `/ (root)`**.

> Note: `styles.css` and `app.js` are linked with a `?v=N` cache-busting query. Bump that number when you change CSS/JS so returning visitors get the new version (see [CONTRIBUTING.md](CONTRIBUTING.md)).

## Contributing

Found an out-of-date price, a closed restaurant, a better route, or want to add a spot? Contributions are very welcome — see **[CONTRIBUTING.md](CONTRIBUTING.md)** for how the page is structured and how to add cards, links, and landmarks.

## License

Content and code are provided as-is for the community. If you reuse it, please keep the "unofficial / verify the details" disclaimer.

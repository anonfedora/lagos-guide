# Contributing to the Lagos City Guide

Thanks for helping make this guide more useful for visitors to Lagos! This is a community project, and the most valuable contributions are usually **small, accurate, local corrections** — a closed restaurant, a changed fare, a better route, a new dietary option.

You don't need to be a developer. If you can spot an error, open an issue. If you're comfortable with HTML, read on.

---

## Ground rules

1. **Accuracy over hype.** Only add places you'd actually recommend. Prices and details change — phrase them as approximate ("around ₦5,000 to 15,000") and avoid hard claims.
2. **Stay unofficial.** Keep the disclaimer in the footer intact.
3. **No tracking, no heavy dependencies.** This is a static site by design. Don't add build tools, analytics, or frameworks.
4. **Keep it accessible.** Every change must keep the page usable by keyboard and screen reader (see the checklist below).

## How the page works

It's three files, no build step:

- **`index.html`** — all the content and the inline landmark SVGs.
- **`styles.css`** — the earthen theme and layout, driven by CSS variables in `:root`.
- **`app.js`** — the food diet filter, mobile nav, accessibility toolbar, read-aloud, and ARIA helpers (food emojis, map-link labels, spice-meter labels are added here at runtime).

Run it locally with `python3 -m http.server 8000` and open `http://localhost:8000`.

### Important: bump the cache version

`index.html` links assets with a version query:

```html
<link rel="stylesheet" href="styles.css?v=17" />
...
<script src="app.js?v=17"></script>
```

**If you change `styles.css` or `app.js`, increment that number** (e.g. `v=17` → `v=18`) so returning visitors don't get a stale cached copy.

---

## Adding or editing content

### A food spot

Food cards live in the `#food` section inside `<div class="food-grid">`. Copy an existing card and edit it:

```html
<div class="food" data-diet="veg vegan df">
  <div class="top">
    <h4>Place Name</h4>
    <a class="maplink" target="_blank" rel="noopener"
       href="https://www.google.com/maps/search/?api=1&amp;query=Place+Name+Area+Lagos">Map ↗</a>
  </div>
  <div class="where">Area, cuisine</div>
  <p>One or two sentences. Name the meat type for non-veg. Note dairy defaults.</p>
  <div class="tags">
    <span class="tag veg">Vegetarian</span>
    <span class="tag vegan">Vegan on request</span>
    <span class="tag df">Dairy-free on request</span>
  </div>
  <div class="foot" style="margin-top:12px">
    <span class="heat l2"><span class="hl">Spice</span><i></i><i></i><i></i></span>
  </div>
</div>
```

**`data-diet`** drives the filter buttons. Use any of these space-separated tokens (this is what gets filtered, so be accurate):

| token | meaning |
|-------|---------|
| `veg` | vegetarian (may contain dairy) |
| `vegan` | fully plant-based, or vegan on request |
| `df` | dairy-free, or dairy-free on request |
| `jain` | no onion / garlic / root veg |
| `kosher` | kosher or kosher-friendly |
| `halal` | halal meat |
| `nonveg` | contains meat / fish / egg |

**Tags** (`<span class="tag …">`) are the visible labels; use the matching class (`veg`, `vegan`, `df`, `jain`, `kosher`, `halal`, `nonveg`) and spell out the meat for non-veg (e.g. "Goat / Chicken", "Pork / Seafood").

**Spice meter** — set the level on the `heat` element: `heat l1` (mild), `heat l2` (medium), `heat l3` (hot). Always keep exactly three `<i></i>` bars; the class fills them. (`app.js` adds the screen-reader label automatically.)

### A hotel / place / "good to know" card

These use the `.cell` pattern inside a `.grid` (`g2`/`g3`/`g4` = 2/3/4 columns):

```html
<div class="cell">
  <div class="top"><h3>Name</h3><span class="tier">Luxury</span></div>
  <div class="area">Area, distance to city center</div>
  <p>Short description.</p>
  <div class="foot">
    <span class="chip">approx <b>$$$</b></span>
    <a class="maplink" target="_blank" rel="noopener"
       href="https://www.google.com/maps/search/?api=1&amp;query=Name+Lagos">Map <span class="arr">↗</span></a>
  </div>
</div>
```

Keep grids **evenly filled** (a `g3` grid should have a multiple of 3 cards) so there are no awkward gaps.

### A Google Maps link

Always use the query-search form so it works without coordinates, and **escape the `&` as `&amp;`** in HTML:

```
https://www.google.com/maps/search/?api=1&amp;query=Search+Terms+Lagos+Nigeria
```

### A landmark silhouette

Landmarks are inline `<svg class="landmark …">` placed right after a `<section>` opening tag. They're **line-art** (`fill="none" stroke="currentColor"`), low opacity, sitting behind the content. Classes:

- `lm-l` / `lm-r` — anchor left or right
- `lm-small` — corner-accent size
- `lm-feature` — larger / more prominent (used for the Gateway and Taj)

Keep them recognizable and add `aria-hidden="true"`.

---

## Writing style

- **No em dashes or en dashes** (`—` / `–`). Use commas, parentheses, "to" for ranges, or split the sentence.
- **Do** hyphenate compound modifiers: dairy-free, non-veg, air-conditioned, off-peak, ride-hailing, etc.
- Plain, friendly, concise. British or American spelling is fine; be consistent within a card.
- Nigerian terms: gloss them on first use if needed (e.g. "danfo - shared minibus").

## Accessibility checklist (required for any change)

- [ ] Decorative SVGs/emojis have `aria-hidden="true"`.
- [ ] Links have meaningful text (or an `aria-label`); new tabs use `rel="noopener"`.
- [ ] Color is never the only signal; contrast stays readable on the beige background.
- [ ] It still works with the keyboard (Tab through new interactive elements).
- [ ] It still works with **High contrast** and **Reduce motion** modes on.
- [ ] Run the **Read aloud** toolbar control over your new section to make sure it reads sensibly.

## Testing before you open a PR

1. Open the page (`python3 -m http.server 8000`).
2. Check **desktop and a ~390px mobile width** (the nav becomes a swipeable strip on mobile).
3. If you touched food: click each **diet filter** and confirm cards show/hide correctly.
4. Toggle the **accessibility** options.
5. If you changed CSS/JS, **bump the `?v=` number** in `index.html`.

## Commit & PR

- Branch off `main`, make focused commits with clear messages.
- Open a pull request describing what changed and (for content) how you verified it.
- A maintainer merges to `main`; GitHub Pages redeploys automatically.

Thanks for contributing — see you in Lagos. 🇳🇬

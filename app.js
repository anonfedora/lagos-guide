// Lagos City Guide / interactions

// --- Hero sunburst rays (generated so the markup stays clean) ---
(function buildRays() {
  const g = document.getElementById('rays');
  if (!g) return;
  const cx = 100, cy = 100, inner = 36, outer = 98;
  let svg = '';
  for (let i = 0; i < 48; i++) {
    const a = (i / 48) * Math.PI * 2;
    const x1 = cx + Math.cos(a) * inner;
    const y1 = cy + Math.sin(a) * inner;
    const x2 = cx + Math.cos(a) * outer;
    const y2 = cy + Math.sin(a) * outer;
    svg += `<line x1="${x1.toFixed(2)}" y1="${y1.toFixed(2)}" x2="${x2.toFixed(2)}" y2="${y2.toFixed(2)}"/>`;
  }
  g.innerHTML = svg;
})();

// --- Hero ticker (duplicated track for a seamless loop) ---
(function buildTicker() {
  const track = document.getElementById('ticker');
  if (!track) return;

  // Fetch live exchange rates
  async function fetchRates() {
    try {
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/NGN');
      const data = await response.json();
      return data.rates;
    } catch (e) {
      console.log('Exchange rate fetch failed:', e);
      return null;
    }
  }

  const baseItems = [
    ['Lagos, Nigeria', 1], ['Victoria Island', 0], ['Ikoyi & Lekki', 0],
    ['WAT = UTC+1', 0], ['English widely spoken', 0],
    ['Do not drink the tap water', 1], ['Use ride-hailing apps', 0], ['Emergency: 112', 1],
    ['Every place links to Maps', 0],
  ];

  // Build ticker with live rates
  fetchRates().then(rates => {
    if (rates && rates.USD && rates.EUR && rates.GBP) {
      const rateItems = [
        [`<span class="currency-symbol">$</span>1 = ₦${(1/rates.USD).toFixed(0)}`, 1],
        [`<span class="currency-symbol">€</span>1 = ₦${(1/rates.EUR).toFixed(0)}`, 1],
        [`<span class="currency-symbol">£</span>1 = ₦${(1/rates.GBP).toFixed(0)}`, 1],
      ];
      const items = [...baseItems.slice(0, 4), ...rateItems, ...baseItems.slice(4)];
      const row = items.map(([t, hl]) => `<span class="${hl ? 'hl' : ''}">${t} &nbsp;·</span>`).join('');
      track.innerHTML = row + row;
    }
  });

  // Initial fallback while loading
  const items = baseItems;
  const row = items.map(([t, hl]) => `<span class="${hl ? 'hl' : ''}">${t} &nbsp;·</span>`).join('');
  track.innerHTML = row + row; // duplicate for the -50% scroll loop
})();

// --- Lagos time display (WAT = UTC+1) ---
(function updateTimeDisplay() {
  const timeValue = document.getElementById('time-value');
  if (!timeValue) return;

  function updateTime() {
    const now = new Date();
    const options = { timeZone: 'Africa/Lagos', hour: '2-digit', minute: '2-digit', hour12: false };
    timeValue.textContent = now.toLocaleTimeString('en-GB', options);
  }

  updateTime();
  setInterval(updateTime, 1000);
})();

// --- Search functionality ---
(function initSearch() {
  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.getElementById('searchBtn');
  if (!searchInput || !searchBtn) return;

  // Collect all searchable content
  const searchableElements = [];
  document.querySelectorAll('.food h3, .hotel h3, .cell h3, .route h3, .note h3, .emerg h3').forEach(el => {
    searchableElements.push({
      element: el,
      text: el.textContent.toLowerCase(),
      parent: el.closest('.food, .hotel, .cell, .route, .note, .emerg')
    });
  });

  // Also search section headings
  document.querySelectorAll('.sec-head h2').forEach(el => {
    searchableElements.push({
      element: el,
      text: el.textContent.toLowerCase(),
      parent: el.closest('.block')
    });
  });

  function performSearch(query) {
    const searchTerm = query.toLowerCase().trim();
    
    // Clear previous highlights
    document.querySelectorAll('.search-highlight').forEach(el => {
      el.classList.remove('search-highlight');
    });

    if (!searchTerm) return;

    let firstMatch = null;

    searchableElements.forEach(item => {
      if (item.text.includes(searchTerm)) {
        item.element.classList.add('search-highlight');
        if (!firstMatch) {
          firstMatch = item.parent;
        }
      }
    });

    // Scroll to first match
    if (firstMatch) {
      firstMatch.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  searchInput.addEventListener('input', (e) => {
    performSearch(e.target.value);
  });

  searchBtn.addEventListener('click', () => {
    performSearch(searchInput.value);
  });

  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      performSearch(searchInput.value);
    }
  });
})();

// --- Currency converter ---
(function initCurrencyConverter() {
  const fromAmount = document.getElementById('fromAmount');
  const fromCurrency = document.getElementById('fromCurrency');
  const toAmount = document.getElementById('toAmount');
  const toCurrency = document.getElementById('toCurrency');
  const converterNote = document.getElementById('converterNote');
  
  if (!fromAmount || !fromCurrency || !toAmount || !toCurrency) return;

  let exchangeRates = null;

  // Fetch exchange rates
  async function fetchRates() {
    try {
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/NGN');
      const data = await response.json();
      exchangeRates = data.rates;
      converterNote.textContent = 'Rates updated: ' + new Date().toLocaleTimeString();
      convert();
    } catch (e) {
      console.log('Exchange rate fetch failed:', e);
      converterNote.textContent = 'Using cached rates (API unavailable)';
    }
  }

  function convert() {
    if (!exchangeRates) return;

    const amount = parseFloat(fromAmount.value) || 0;
    const from = fromCurrency.value;
    const to = toCurrency.value;

    // Convert from source to NGN, then to target
    const inNGN = from === 'NGN' ? amount : amount / exchangeRates[from];
    const result = to === 'NGN' ? inNGN : inNGN * exchangeRates[to];

    toAmount.value = result.toFixed(2);
  }

  // Event listeners
  fromAmount.addEventListener('input', convert);
  fromCurrency.addEventListener('change', convert);
  toCurrency.addEventListener('change', convert);

  // Initial fetch
  fetchRates();
  // Refresh rates every 5 minutes
  setInterval(fetchRates, 300000);
})();

// --- Food diet filter ---
const filterbar = document.getElementById('filterbar');
const foodCards = Array.from(document.querySelectorAll('.food'));
filterbar?.addEventListener('click', (e) => {
  const btn = e.target.closest('.filter-btn');
  if (!btn) return;
  const filter = btn.dataset.filter;
  filterbar.querySelectorAll('.filter-btn').forEach((b) =>
    b.setAttribute('aria-pressed', String(b === btn))
  );
  foodCards.forEach((card) => {
    const diets = card.dataset.diet.split(' ');
    const show = filter === 'all' || diets.includes(filter);
    card.classList.toggle('hide', !show);
  });
});

// --- Mobile nav toggle ---
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle?.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(open));
});
navLinks?.addEventListener('click', (e) => {
  if (e.target.tagName === 'A') {
    navLinks.classList.remove('open');
    navToggle?.setAttribute('aria-expanded', 'false');
  }
});

// --- Accessibility toolbar (persisted preferences) ---
(function a11y() {
  const fab = document.getElementById('a11yFab');
  const panel = document.getElementById('a11yPanel');
  if (!fab || !panel) return;
  const store = window.localStorage;
  const get = (k, d) => { try { return store.getItem(k) ?? d; } catch { return d; } };
  const set = (k, v) => { try { store.setItem(k, v); } catch {} };

  // open / close
  const setOpen = (o) => { panel.classList.toggle('open', o); fab.setAttribute('aria-expanded', String(o)); };
  fab.addEventListener('click', () => setOpen(!panel.classList.contains('open')));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
  document.addEventListener('click', (e) => {
    if (panel.classList.contains('open') && !panel.contains(e.target) && e.target !== fab && !fab.contains(e.target)) setOpen(false);
  });

  // text size (zoom scales the whole layout proportionally)
  function applySize(factor) {
    document.documentElement.style.zoom = factor === '1' ? '' : factor;
    panel.querySelectorAll('[data-size]').forEach((b) =>
      b.setAttribute('aria-pressed', String(b.dataset.size === factor))
    );
  }
  panel.querySelectorAll('[data-size]').forEach((b) =>
    b.addEventListener('click', () => { applySize(b.dataset.size); set('a11y-size', b.dataset.size); })
  );

  // boolean toggles -> body class
  function applyToggle(cls, on) {
    document.body.classList.toggle(cls, on);
    panel.querySelectorAll(`[data-toggle="${cls}"]`).forEach((b) =>
      b.setAttribute('aria-pressed', String((b.dataset.on === 'true') === on))
    );
  }
  panel.querySelectorAll('[data-toggle]').forEach((b) =>
    b.addEventListener('click', () => {
      const cls = b.dataset.toggle, on = b.dataset.on === 'true';
      applyToggle(cls, on); set('a11y-' + cls, String(on));
    })
  );

  // reset
  document.getElementById('a11yReset')?.addEventListener('click', () => {
    ['a11y-size', 'a11y-hc', 'a11y-ul-links', 'a11y-reduce-motion'].forEach((k) => { try { store.removeItem(k); } catch {} });
    applySize('1'); ['hc', 'ul-links', 'reduce-motion'].forEach((c) => applyToggle(c, false));
  });

  // restore saved prefs (default reduce-motion to the OS setting if unset)
  applySize(get('a11y-size', '1'));
  const prefersReduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  applyToggle('hc', get('a11y-hc', 'false') === 'true');
  applyToggle('ul-links', get('a11y-ul-links', 'false') === 'true');
  applyToggle('reduce-motion', get('a11y-reduce-motion', prefersReduce ? 'true' : 'false') === 'true');
})();

// --- Food cuisine emojis (decorative, hidden from screen readers) ---
(function foodEmojis() {
  const map = [
    [['seafood', 'coastal'], '�'],
    [['suya', 'asun', 'kebab', 'grilled'], '🍢'],
    [['jollof', 'rice', 'fried rice'], '�'],
    [['swallow', 'fufu', 'eba', 'pounded yam', 'amala'], '�'],
    [['vegan', 'plant based', 'organic', 'health'], '🥗'],
    [['juice', 'smoothie'], '�'],
    [['nigerian', 'local', 'traditional'], '🍴'],
    [['street food', 'suya spot'], '🥪'],
  ];
  document.querySelectorAll('.food').forEach((card) => {
    const h4 = card.querySelector('h4');
    const txt = (h4.textContent + ' ' + (card.querySelector('.where')?.textContent || '')).toLowerCase();
    let emoji = '🍴';
    for (const [keys, e] of map) { if (keys.some((k) => txt.includes(k))) { emoji = e; break; } }
    const span = document.createElement('span');
    span.className = 'fico'; span.setAttribute('aria-hidden', 'true'); span.textContent = emoji;
    h4.prepend(span);
  });
})();

// --- Screen reader labels for map links (avoid reading raw "↗") and spice meters ---
(function srLabels() {
  document.querySelectorAll('.maplink').forEach((a) => {
    const label = a.textContent.replace(/↗/g, '').trim();
    a.setAttribute('aria-label', (label.toLowerCase() === 'map' ? 'Open in Google Maps' : label + ', map') + ' (opens in a new tab)');
  });
  document.querySelectorAll('.heat').forEach((h) => {
    const lvl = h.classList.contains('l3') ? 3 : h.classList.contains('l2') ? 2 : 1;
    h.setAttribute('role', 'img');
    h.setAttribute('aria-label', `Spice level ${lvl} out of 3`);
  });
})();

// --- Read aloud (text to speech) for blind / low vision users ---
(function readAloud() {
  const play = document.getElementById('raPlay');
  const stop = document.getElementById('raStop');
  const synth = window.speechSynthesis;
  if (!play || !stop) return;
  if (!synth) { play.disabled = true; play.textContent = 'Not supported'; return; }

  const els = Array.from(document.querySelectorAll('#main h2, #main h3, #main h4, #main p, #main li'))
    .filter((el) => el.textContent.trim().length > 1 && !el.closest('[aria-hidden="true"]'));
  let i = 0, active = false;
  const reduce = () => document.body.classList.contains('reduce-motion');
  function visibleText(el) {
    const c = el.cloneNode(true);
    c.querySelectorAll('[aria-hidden="true"]').forEach((n) => n.remove());
    return c.textContent.replace(/\s+/g, ' ').trim();
  }

  function clearHi() { els.forEach((e) => e.classList.remove('reading')); }
  function speakFrom(idx) {
    if (idx >= els.length) { finish(); return; }
    i = idx; active = true;
    clearHi();
    const el = els[i];
    const text = visibleText(el);
    if (!text) { speakFrom(i + 1); return; }
    el.classList.add('reading');
    el.scrollIntoView({ block: 'center', behavior: reduce() ? 'auto' : 'smooth' });
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-NG'; u.rate = 1;
    u.onend = () => { if (active) speakFrom(i + 1); };
    synth.speak(u);
  }
  function finish() {
    active = false; clearHi(); synth.cancel();
    play.textContent = '▶ Listen'; play.classList.remove('speaking'); stop.disabled = true;
  }
  play.addEventListener('click', () => {
    if (!active) { stop.disabled = false; play.textContent = '⏸ Pause'; play.classList.add('speaking'); speakFrom(0); }
    else if (synth.paused) { synth.resume(); play.textContent = '⏸ Pause'; }
    else { synth.pause(); play.textContent = '▶ Resume'; }
  });
  stop.addEventListener('click', finish);
  window.addEventListener('beforeunload', () => synth.cancel());
})();

// --- Back to top ---
const toTop = document.getElementById('toTop');
window.addEventListener('scroll', () => {
  toTop?.classList.toggle('show', window.scrollY > 600);
}, { passive: true });
toTop?.addEventListener('click', () =>
  window.scrollTo({ top: 0, behavior: 'smooth' })
);

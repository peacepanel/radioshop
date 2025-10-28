// قراءة Google Sheets عبر GViz JSON من صفحات GitHub (بدون GAS)
async function fetchGVizJson(ssid, sheet, tq = 'select *') {
  const url = `https://docs.google.com/spreadsheets/d/${ssid}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(sheet)}&tq=${encodeURIComponent(tq)}`;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`GViz HTTP ${res.status}`);
  const txt = await res.text();
  const json = JSON.parse(txt.replace(/^\)\]\}'/, ''));
  return json;
}

function gvizToRows(json) {
  const cols = json.table.cols.map(c => (c && c.label ? String(c.label).trim() : ''));
  const rows = (json.table.rows || []).map(r => (r.c || []).map(c => (c ? c.v : '')));
  return { cols, rows };
}

function matchHeaderIndex(cols, candidates) {
  const norm = s => String(s||'').trim().toLowerCase();
  for (const name of candidates) {
    const idx = cols.findIndex(c => norm(c) === norm(name));
    if (idx >= 0) return idx;
  }
  return -1;
}

async function getPlaylistFromSheet(config, period) {
  const j = await fetchGVizJson(config.PLAYLISTS_SSID, config.PLAYLISTS_SHEET);
  const { cols, rows } = gvizToRows(j);
  const h = config.PLAYLISTS_HEADERS;
  const idx = {
    period: cols.findIndex(c => c.toLowerCase() === h.period),
    title: cols.findIndex(c => c.toLowerCase() === h.title),
    src: cols.findIndex(c => c.toLowerCase() === h.src),
    duration: cols.findIndex(c => c.toLowerCase() === h.duration)
  };
  const out = [];
  for (const r of rows) {
    const p = String(r[idx.period] || '').trim().toLowerCase();
    const t = String(r[idx.title] || '').trim();
    const s = String(r[idx.src] || '').trim();
    const d = Number(r[idx.duration] || 0);
    if (!s) continue;
    if (!period || p === period || p === '') {
      out.push({ title: t || 'Track', src: s, duration: (isFinite(d) && d > 0) ? d : undefined, period: p });
    }
  }
  return out;
}

async function getCategoryNamesFromConfigSheet(config) {
  const j = await fetchGVizJson(config.PRODUCTS_SSID, config.CONFIG_SHEET);
  const { rows } = gvizToRows(j);
  const names = rows.map(r => String(r[0] || '').trim()).filter(Boolean);
  return names;
}

async function getProductsFromSheet(config, sheetName, periodFilter) {
  const j = await fetchGVizJson(config.PRODUCTS_SSID, sheetName);
  const { cols, rows } = gvizToRows(j);
  const idx = {
    image: matchHeaderIndex(cols, config.PRODUCT_HEADERS.image),
    name:  matchHeaderIndex(cols, config.PRODUCT_HEADERS.name),
    price: matchHeaderIndex(cols, config.PRODUCT_HEADERS.price),
    link:  matchHeaderIndex(cols, config.PRODUCT_HEADERS.link),
    mood:  matchHeaderIndex(cols, config.PRODUCT_HEADERS.mood)
  };
  const fb = config.PRODUCT_FALLBACK_INDEX;
  Object.keys(idx).forEach(k => { if (idx[k] < 0 && typeof fb[k] === 'number') idx[k] = fb[k]; });

  const out = [];
  for (const r of rows) {
    const img = r[idx.image];
    if (!img) continue;
    const item = {
      image: String(img).trim(),
      name:  String(r[idx.name]  || `منتج`).trim(),
      price: String(r[idx.price] || '').trim(),
      link:  String(r[idx.link]  || '').trim(),
      mood:  String(r[idx.mood]  || '').trim().toLowerCase()
    };
    if (periodFilter && idx.mood >= 0 && item.mood && item.mood !== periodFilter) continue;
    out.push(item);
  }
  return out;
}

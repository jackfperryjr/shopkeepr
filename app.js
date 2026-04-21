const DATA_URL = 'data/plaza_items.json';

function makeTip(lines) {
  return lines.filter(Boolean).join('&#10;');
}

function itemCell(i) {
  const name = escHtml(i.tap || i.name);
  const tip  = makeTip([
    i.short ? `Short: ${escHtml(i.short)}` : null,
    i.worn  ? `Worn:  ${escHtml(i.worn)}`  : null,
  ]);
  if (!tip) return name;
  return `<span class="has-tip" data-tip="${tip}">${name}</span>`;
}

function shopCell(i) {
  const name = escHtml(i.shop);
  const tip  = makeTip([
    i.hub_room ? `Room:   ${escHtml(i.hub_room)}`          : null,
    i.owner    ? `Owner:  ${escHtml(i.owner)}`             : null,
    i.hours    ? `Hours:  ${escHtml(i.hours)} Eastern`     : null,
  ]);
  if (!tip) return name;
  return `<span class="has-tip" data-tip="${tip}">${name}</span>`;
}

function descCell(i) {
  const parts = [];
  if (i.description) parts.push(escHtml(i.description));
  return parts.join(' ');
}

function formatPrice(price) {
  if (!price) return '';
  const m = price.match(/([\d,]+)\s*(platinum|copper|gold|silver)?\s*(Kronars?|Lirums?|Dokoras?)/i);
  if (!m) return escHtml(price);
  const num   = parseInt(m[1].replace(/,/g, '')).toLocaleString();
  const curr  = (m[3] || '').toLowerCase();
  const denom = (m[2] || '').toLowerCase();
  // Only show plat label for platinum-denominated Kronars
  // Lirums and Dokoras don't use platinum denominations
  const label = (denom === 'platinum') ? 'plat' : denom || null;
  const denomSpan = label ? ` <span class="price-denom">${label}</span>` : '';
  const currLabel = curr === 'kronars' ? 'Kronars' : curr === 'lirums' ? 'Lirums' : curr === 'dokoras' ? 'Dokoras' : curr;
  return `${num}${denomSpan} ${currLabel}`;
}
let allItems = [];
let sortCol  = 'name';
let sortDir  = 'asc';

function townClass(town) {
  const t = (town || '').toLowerCase();
  if (t === 'crossing')       return 'town-crossing';
  if (t === 'riverhaven')     return 'town-riverhaven';
  if (t === 'shard')          return 'town-shard';
  if (t === 'therenborough')  return 'town-therenborough';
  return 'town-other';
}

function escHtml(s) {
  return (s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function buildShopOptions(items) {
  const town  = document.getElementById('filter-town').value;
  const shops = [...new Set(
    items.filter(i => !town || i.town === town).map(i => i.shop)
  )].sort();
  const sel = document.getElementById('filter-shop');
  const cur = sel.value;
  sel.innerHTML = '<option value="">All shops</option>' +
    shops.map(s => `<option value="${escHtml(s)}"${s===cur?' selected':''}>${escHtml(s)}</option>`).join('');
}

function filterAndSort() {
  const query = document.getElementById('search').value.toLowerCase().trim();
  const town  = document.getElementById('filter-town').value;
  const shop  = document.getElementById('filter-shop').value;

  let rows = allItems.filter(i => {
    if (town && i.town !== town) return false;
    if (shop && i.shop !== shop) return false;
    if (query) {
      const hay = `${i.name} ${i.tap || ''} ${i.short || ''} ${i.description || ''} ${i.shop}`.toLowerCase();
      if (!hay.includes(query)) return false;
    }
    return true;
  });

  rows.sort((a, b) => {
    if (sortCol === 'price') {
      const av = parseFloat((a.price || '').replace(/[^\d.]/g,'')) || 0;
      const bv = parseFloat((b.price || '').replace(/[^\d.]/g,'')) || 0;
      return sortDir === 'asc' ? av - bv : bv - av;
    }
    const av = (a[sortCol] || '').toString().toLowerCase();
    const bv = (b[sortCol] || '').toString().toLowerCase();
    if (av < bv) return sortDir === 'asc' ? -1 :  1;
    if (av > bv) return sortDir === 'asc' ?  1 : -1;
    return 0;
  });

  render(rows);
}

function render(rows) {
  const tbody = document.getElementById('items-body');
  const table = document.getElementById('items-table');
  const empty = document.getElementById('empty');

  if (rows.length === 0) {
    table.style.display = 'none';
    empty.style.display = 'block';
    document.getElementById('stats-bar').innerHTML = 'No results';
    return;
  }

  table.style.display = 'table';
  empty.style.display = 'none';
  document.getElementById('stats-bar').innerHTML =
    `Showing <span>${rows.length.toLocaleString()}</span> of <span>${allItems.length.toLocaleString()}</span> items`;

  tbody.innerHTML = rows.map(i => `
    <tr>
      <td class="cell-name">${itemCell(i)}</td>
      <td class="cell-desc">${descCell(i)}</td>
      <td class="cell-price">${formatPrice(i.price)}</td>
      <td class="cell-shop">${shopCell(i)}</td>
      <td><span class="town-badge ${townClass(i.town)}">${escHtml(i.town)}</span></td>
      <td class="cell-date">${escHtml(i.last_seen)}</td>
    </tr>
  `).join('');
}

function initSortHeaders() {
  document.querySelectorAll('thead th[data-col]').forEach(th => {
    th.addEventListener('click', () => {
      const col = th.dataset.col;
      sortDir = (sortCol === col && sortDir === 'asc') ? 'desc' : 'asc';
      sortCol = col;
      document.querySelectorAll('thead th').forEach(t => t.className = '');
      th.className = sortDir === 'asc' ? 'sorted-asc' : 'sorted-desc';
      filterAndSort();
    });
  });
  document.querySelector(`thead th[data-col="${sortCol}"]`).className = 'sorted-asc';
}

async function loadData() {
  try {
    const res  = await fetch(DATA_URL + '?t=' + Date.now());
    const data = await res.json();
    allItems   = data.items || [];

    const ts = data.updated_at && data.updated_at !== 'never'
      ? new Date(data.updated_at).toLocaleString('en-US', {
          month: 'long', day: 'numeric', year: 'numeric',
          hour: 'numeric', minute: '2-digit', timeZoneName: 'short'
        })
      : 'never';

    document.getElementById('last-updated').textContent =
      allItems.length === 0
        ? 'No data yet — run the scraper to populate.'
        : `Last updated: ${ts}`;

    document.getElementById('loading').style.display = 'none';
    buildShopOptions(allItems);
    filterAndSort();
  } catch (e) {
    document.getElementById('loading').innerHTML =
      '<span class="glyph">✦</span><p>Could not load plaza_items.json</p>';
    console.error(e);
  }
}

document.getElementById('search').addEventListener('input', filterAndSort);
document.getElementById('filter-town').addEventListener('change', () => {
  buildShopOptions(allItems);
  filterAndSort();
});
document.getElementById('filter-shop').addEventListener('change', filterAndSort);

initSortHeaders();
loadData();
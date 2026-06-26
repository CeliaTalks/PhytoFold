/* ── Dropdown nav ── */
function toggleNav(btn) {
  const menu = btn.nextElementSibling;
  const isOpen = menu.classList.contains('open');
  closeNavs();
  if (!isOpen) menu.classList.add('open');
}
function closeNavs() {
  document.querySelectorAll('.nav-dropdown-menu').forEach(m => m.classList.remove('open'));
}
document.addEventListener('click', e => {
  if (!e.target.closest('.nav-group')) closeNavs();
});

/* ── Page cache (avoids re-fetching visited pages) ── */
const _cache = {};

/* ── Core navigation: fetches pages/[id].html, injects into #app ── */
async function navigate(pageId) {
  document.querySelectorAll('.nav-dropdown-item[data-page]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.page === pageId);
  });

  const app = document.getElementById('app');

  if (_cache[pageId]) {
    app.innerHTML = _cache[pageId];
    _fadeIn(app);
    window.scrollTo({ top: 0, behavior: 'instant' });
    return;
  }

  try {
    const res = await fetch(`pages/${pageId}.html`);
    if (!res.ok) throw new Error(res.status);
    const html = await res.text();
    _cache[pageId] = html;
    app.innerHTML = html;
    _fadeIn(app);
    window.scrollTo({ top: 0, behavior: 'instant' });
  } catch {
    app.innerHTML = '<div class="coming-soon"><p style="color:rgba(26,40,18,0.4);">Page not found.</p></div>';
  }
}

function _fadeIn(el) {
  el.style.animation = 'none';
  el.offsetHeight; // force reflow
  el.style.animation = 'pgIn 0.18s ease';
}

/* ── Navigate then scroll to a section within the page ── */
async function navigateTo(pageId, sectionId) {
  await navigate(pageId);
  if (sectionId) {
    setTimeout(() => {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 60);
  }
}

/* ── Expand / collapse (used in problem.html) ── */
function toggle(id) {
  const el  = document.getElementById(id);
  const arr = document.getElementById(id + '-arrow');
  const btn = document.getElementById(id + '-btn');
  if (!el) return;
  const open = el.classList.contains('open');
  el.classList.toggle('open', !open);
  if (arr) arr.classList.toggle('open', !open);
  if (btn) btn.setAttribute('aria-expanded', String(!open));
}

function toggleDef(id) {
  document.getElementById(id)?.classList.toggle('open');
}

function toggleImpact(id) {
  const el  = document.getElementById(id);
  const arr = document.getElementById(id + '-arrow');
  if (!el) return;
  const open = el.classList.contains('open');
  el.classList.toggle('open', !open);
  if (arr) arr.classList.toggle('open', !open);
}

/* ── Lifecycle diagram hover (used in csfb.html) ── */
const SEASONS = ['march', 'june', 'sep', 'dec'];

function showSeason(diagram, season) {
  document.getElementById(diagram + '-default')?.classList.remove('visible');
  SEASONS.forEach(s => {
    document.getElementById(diagram + '-' + s)?.classList.toggle('visible', s === season);
  });
}

function hideSeason(diagram) {
  SEASONS.forEach(s => document.getElementById(diagram + '-' + s)?.classList.remove('visible'));
  document.getElementById(diagram + '-default')?.classList.add('visible');
}

/* ── BindCraft stage hover ── */
function showBCStage(n) {
  const def = document.getElementById('bc-default');
  if (def) def.style.display = 'none';
  [1,2,3].forEach(i => {
    const el = document.getElementById('bc-stage-' + i);
    if (el) el.style.display = (i === n) ? 'block' : 'none';
  });
}
function hideBCStage() {
  [1,2,3].forEach(i => {
    const el = document.getElementById('bc-stage-' + i);
    if (el) el.style.display = 'none';
  });
  const def = document.getElementById('bc-default');
  if (def) def.style.display = 'block';
}

/* ── Load home page on startup ── */
navigate('home');

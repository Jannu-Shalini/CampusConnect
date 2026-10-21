/* CampusConnect application logic: shell, shared list view, actions and page renderers. */
const NAV = [['index.html', 'Home'], ['dashboard.html', 'Dashboard'], ['announcements.html', 'Announcements'], ['events.html', 'Events'], ['clubs.html', 'Clubs'], ['resources.html', 'Campus'], ['study-resources.html', 'Study'], ['lost-found.html', 'Lost & Found'], ['feedback.html', 'Feedback'], ['profile.html', 'Profile'], ['settings.html', 'Settings']];
const L = k => { const v = Store.getData(k, []); return Array.isArray(v) ? v : []; };
const DEFAULT_PROFILE = { name: 'Ananya Reddy', dept: 'Computer Science', year: '3rd Year', email: 'ananya.reddy@campus.edu', skills: 'JavaScript, UI Design, Public Speaking', photo: '' };
const profile = () => ({ ...DEFAULT_PROFILE, ...(Store.getData('profile', {}) || {}) });
const byDate = (a, b) => b.date.localeCompare(a.date);
const PRI = { High: 0, Medium: 1, Low: 2 };

/* ---------- Seed / reset ---------- */
function seed(force) {
  ['announcements', 'events', 'clubs', 'campus', 'study', 'lostfound'].forEach(k => {
    if (force || !Array.isArray(Store.getData(k))) Store.saveData(k, DEMO[k]());
  });
  if (force) { ['regs', 'joined', 'saved', 'feedback'].forEach(k => Store.saveData(k, [])); Store.saveData('profile', DEFAULT_PROFILE); }
  else if (!Store.getData('profile')) Store.saveData('profile', DEFAULT_PROFILE);
}

/* ---------- Shell ---------- */
function setTheme(t) { document.documentElement.dataset.theme = t; Store.saveData('theme', t); }
function buildShell() {
  const page = location.pathname.split('/').pop() || 'index.html';
  $('#links').innerHTML = NAV.map(([h, t]) => `<li><a href="${h}"${h === page ? ' aria-current="page"' : ''}>${t}</a></li>`).join('');
  $('#burger').onclick = e => { const o = $('#links').classList.toggle('open'); e.currentTarget.setAttribute('aria-expanded', o); };
  $('#themeBtn').onclick = () => setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
  document.addEventListener('keydown', e => { if (e.key === 'Escape') $('#links').classList.remove('open'); });
}

/* ---------- Cards ---------- */
const avatar = (p, c = '') => p.photo ? `<img class="avatar ${c}" src="${p.photo}" alt="Profile photo of ${esc(p.name)}">` : `<div class="avatar ${c}" role="img" aria-label="Initials of ${esc(p.name)}">${esc(p.name.split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase())}</div>`;
const priBadge = p => `<span class="badge ${p}">${p === 'High' ? '▲' : p === 'Medium' ? '●' : '▼'} ${p} priority</span>`;
const annCard = a => `<article class="card"><div class="meta">${priBadge(a.priority)}<span class="badge">${esc(a.category)}</span></div><h3>${esc(a.title)}</h3><p>${esc(a.desc)}</p><small class="muted">${fmt(a.date)} · ${esc(a.author)}</small><div class="row"><button class="btn ghost sm" data-act="v-ann" data-id="${a.id}">Details</button></div></article>`;
const evCard = e => {
  const reg = L('regs').includes(e.id), past = e.date < todayISO();
  return `<article class="card"><div class="meta"><span class="badge">${esc(e.category)}</span>${past ? '<span class="badge Low">Past event</span>' : ''}${reg ? '<span class="badge ok">✔ Registered</span>' : ''}</div><h3>${esc(e.name)}</h3><p class="muted">📅 ${fmt(e.date)} · ${esc(e.time)}<br>📍 ${esc(e.location)}<br>💺 ${e.seats} of ${e.cap} seats left</p><div class="row"><button class="btn ghost sm" data-act="v-ev" data-id="${e.id}">Details</button>${reg ? `<button class="btn danger sm" data-act="unreg" data-id="${e.id}">Cancel registration</button>` : past ? '' : `<button class="btn sm" data-act="reg" data-id="${e.id}"${e.seats < 1 ? ' disabled' : ''}>${e.seats < 1 ? 'Full' : 'Register'}</button>`}</div></article>`;
};
const clubCard = c => {
  const j = L('joined').includes(c.id);
  return `<article class="card"><div class="meta"><span class="badge">${esc(c.category)}</span>${j ? '<span class="badge ok">✔ Member</span>' : ''}</div><h3>${esc(c.name)}</h3><p>${esc(c.desc)}</p><small class="muted">Coordinator: ${esc(c.coordinator)} · ${c.members} members</small><div class="row"><button class="btn ghost sm" data-act="v-club" data-id="${c.id}">Details</button><button class="btn ${j ? 'danger' : ''} sm" data-act="${j ? 'leave' : 'join'}" data-id="${c.id}">${j ? 'Leave club' : 'Join club'}</button></div></article>`;
};
const campusCard = r => `<article class="card"><span class="badge">${esc(r.category)}</span><h3>${esc(r.name)}</h3><p>${esc(r.desc)}</p><p class="muted">📍 ${esc(r.location)}<br>🕒 ${esc(r.timings)}<br>✉ ${esc(r.contact)}</p></article>`;
const studyCard = s => {
  const sv = L('saved').includes(s.id);
  return `<article class="card"><div class="meta"><span class="badge">${esc(s.type)}</span><span class="badge Low">${esc(s.subject)}</span></div><h3>${esc(s.title)}</h3><p>${esc(s.desc)}</p><div class="row"><a class="btn ghost sm" href="${esc(s.link)}" target="_blank" rel="noopener noreferrer">Open ${esc(s.title)} ↗</a><button class="btn ${sv ? '' : 'ghost'} sm" data-act="save" data-id="${s.id}" aria-pressed="${sv}">${sv ? '★ Saved' : '☆ Save'}</button></div></article>`;
};
const lfCard = i => `<article class="card${i.status === 'Resolved' ? ' dim' : ''}"><div class="meta"><span class="badge ${i.type}">${i.type === 'Lost' ? '❓ Lost' : '✔ Found'}</span><span class="badge">${esc(i.category)}</span><span class="badge ${i.status === 'Resolved' ? 'ok' : 'Medium'}">${i.status === 'Resolved' ? '✔ Resolved' : '⏳ Open'}</span></div><h3>${esc(i.name)}</h3><p>${esc(i.desc)}</p><small class="muted">📍 ${esc(i.location)} · ${fmt(i.date)}</small><div class="row"><button class="btn ghost sm" data-act="v-lf" data-id="${i.id}">Details</button><button class="btn ghost sm" data-act="resolve" data-id="${i.id}">${i.status === 'Resolved' ? 'Reopen' : 'Mark resolved'}</button>${i.own ? `<button class="btn danger sm" data-act="del-lf" data-id="${i.id}">Delete</button>` : ''}</div></article>`;
const mini = (items, fn, msg) => items.length ? `<ul class="mini">${items.map(fn).join('')}</ul>` : `<p class="muted">${msg}</p>`;
const find = (k, id) => L(k).find(x => x.id === id);

/* ---------- Actions (event delegation) ---------- */
const ACT = {
  'v-ann'(id) { const a = find('announcements', id); openModal(`<h2>${esc(a.title)}</h2><div class="meta">${priBadge(a.priority)}<span class="badge">${esc(a.category)}</span></div><p>${esc(a.desc)}</p><p class="muted">Posted ${fmt(a.date)} by ${esc(a.author)}</p>`); },
  'v-ev'(id) { const e = find('events', id), r = L('regs').includes(id), past = e.date < todayISO(); openModal(`<h2>${esc(e.name)}</h2><p>${esc(e.desc)}</p><p class="muted">📅 ${fmt(e.date)} · ${esc(e.time)}<br>📍 ${esc(e.location)}<br>🎤 Organiser: ${esc(e.organizer)}<br>🏷 ${esc(e.category)}<br>💺 ${e.seats} of ${e.cap} seats available</p><div class="row end">${r ? `<button class="btn danger" data-act="unreg" data-id="${id}">Cancel registration</button>` : past ? '' : `<button class="btn" data-act="reg" data-id="${id}"${e.seats < 1 ? ' disabled' : ''}>Register</button>`}</div>`); },
  reg(id) {
    const ev = L('events'), e = ev.find(x => x.id === id), r = L('regs');
    if (r.includes(id)) return toast('You are already registered for this event.', 'info');
    if (e.date < todayISO()) return toast('This event has already taken place.', 'err');
    if (e.seats < 1) return toast('Sorry, this event is full.', 'err');
    e.seats--; Store.saveData('events', ev); Store.saveData('regs', [...r, id]);
    closeModal(); toast(`Registered for “${e.name}”. See you there!`, 'ok', 'events');
  },
  async unreg(id) {
    if (!await confirmBox('Cancel your registration for this event?', 'Cancel registration')) return;
    const ev = L('events'), e = ev.find(x => x.id === id);
    if (e) e.seats = Math.min(e.cap, e.seats + 1);
    Store.saveData('events', ev); Store.saveData('regs', L('regs').filter(x => x !== id));
    toast('Registration cancelled.', 'ok', 'events');
  },
  'v-club'(id) { const c = find('clubs', id), j = L('joined').includes(id); openModal(`<h2>${esc(c.name)}</h2><p>${esc(c.desc)}</p><p class="muted">Category: ${esc(c.category)}<br>Coordinator: ${esc(c.coordinator)}<br>Members: ${c.members}</p><h3>Activities</h3><ul>${c.activities.map(a => `<li>${esc(a)}</li>`).join('')}</ul><div class="row end"><button class="btn ${j ? 'danger' : ''}" data-act="${j ? 'leave' : 'join'}" data-id="${id}">${j ? 'Leave club' : 'Join club'}</button></div>`); },
  join(id) {
    const j = L('joined'), cl = L('clubs'), c = cl.find(x => x.id === id);
    if (j.includes(id)) return toast('You are already a member of this club.', 'info');
    c.members++; Store.saveData('clubs', cl); Store.saveData('joined', [...j, id]);
    closeModal(); toast(`Welcome to ${c.name}!`, 'ok', 'clubs');
  },
  async leave(id) {
    if (!await confirmBox('Leave this club?', 'Leave club')) return;
    const cl = L('clubs'), c = cl.find(x => x.id === id);
    if (c) c.members = Math.max(0, c.members - 1);
    Store.saveData('clubs', cl); Store.saveData('joined', L('joined').filter(x => x !== id));
    toast('You left the club.', 'ok', 'clubs');
  },
  save(id) {
    const s = L('saved'), has = s.includes(id);
    Store.saveData('saved', has ? s.filter(x => x !== id) : [...s, id]);
    toast(has ? 'Bookmark removed.' : 'Resource bookmarked.', has ? 'info' : 'ok', 'resources');
  },
  'v-lf'(id) { const i = find('lostfound', id); openModal(`<h2>${esc(i.name)}</h2><div class="meta"><span class="badge ${i.type}">${i.type}</span><span class="badge">${esc(i.category)}</span><span class="badge">${i.status}</span></div><p>${esc(i.desc)}</p><p class="muted">📍 ${esc(i.location)}<br>📅 ${fmt(i.date)}<br>✉ Contact: ${esc(i.contact)}</p>`); },
  resolve(id) { const a = L('lostfound'), i = a.find(x => x.id === id); i.status = i.status === 'Resolved' ? 'Open' : 'Resolved'; Store.saveData('lostfound', a); toast(`Item marked as ${i.status.toLowerCase()}.`, 'ok', 'lf'); },
  async 'del-lf'(id) { if (!await confirmBox('Delete this item permanently?', 'Delete')) return; Store.saveData('lostfound', L('lostfound').filter(x => x.id !== id)); toast('Item deleted.', 'ok', 'lf'); }
};
document.addEventListener('click', async e => {
  const b = e.target.closest('[data-act]');
  if (b && ACT[b.dataset.act]) { try { await ACT[b.dataset.act](b.dataset.id); if (window.redraw) window.redraw(); } catch (err) { console.error(err); toast('Something went wrong. Please try again.', 'err'); } }
  if (e.target.closest('[data-close]') || e.target.id === 'modal') closeModal();
});

/* ---------- Generic searchable / filterable / sortable list ---------- */
function listView(o) {
  $('#app').innerHTML = `<div class="wrap"><header class="ph"><h1>${o.title}</h1><p class="muted">${o.sub}</p></header><div class="bar"><div class="grow"><label class="sr" for="q">Search</label><input id="q" type="search" placeholder="Search ${o.title.toLowerCase()}…"></div>${o.filters.map((f, i) => `<select data-f="${i}" aria-label="${f.label}"><option value="">${f.label}: All</option>${f.opts.map(v => `<option>${esc(v)}</option>`).join('')}</select>`).join('')}<select id="sort" aria-label="Sort by">${o.sorts.map((s, i) => `<option value="${i}">Sort: ${s[0]}</option>`).join('')}</select>${o.add ? `<button class="btn" id="add">${o.add}</button>` : ''}</div><p class="muted" id="count" aria-live="polite"></p><div id="list" class="grid"></div></div>`;
  const draw = () => {
    const q = $('#q').value.toLowerCase().trim();
    const items = o.items().filter(it => (!q || o.keys.some(k => String(it[k]).toLowerCase().includes(q))) && o.filters.every((f, i) => { const v = $(`[data-f="${i}"]`).value; return !v || f.get(it) === v; }));
    items.sort(o.sorts[$('#sort').value][1]);
    $('#count').textContent = `${items.length} result${items.length === 1 ? '' : 's'}`;
    $('#list').innerHTML = items.length ? items.map(o.card).join('') : empty('No results found', 'Try a different search or clear the filters.');
  };
  window.redraw = draw;
  $('#list').innerHTML = '<div class="skeleton"></div><div class="skeleton"></div><div class="skeleton"></div>';
  setTimeout(draw, 200);
  $('#q').addEventListener('input', debounce(draw));
  $$('select', $('.bar')).forEach(s => s.addEventListener('change', draw));
  if (o.add) $('#add').onclick = o.onAdd;
}
const uniq = (a, k) => [...new Set(a.map(x => x[k]))].sort();
const alpha = k => (a, b) => String(a[k]).localeCompare(String(b[k]));

/* ---------- Pages ---------- */
const LF_FIELDS = () => [
  { n: 'type', l: 'Item type', t: 'select', req: true, opts: ['Lost', 'Found'] },
  { n: 'name', l: 'Item name', t: 'text', req: true, min: 3, maxl: 60 },
  { n: 'desc', l: 'Description', t: 'textarea', req: true, min: 10, maxl: 300 },
  { n: 'category', l: 'Category', t: 'select', req: true, opts: ['Electronics', 'Books & Stationery', 'Accessories', 'ID & Cards', 'Clothing', 'Other'] },
  { n: 'date', l: 'Date', t: 'date', req: true, max: todayISO() },
  { n: 'location', l: 'Location', t: 'text', req: true, min: 3, maxl: 80 },
  { n: 'contact', l: 'Contact (email or 10-digit phone)', t: 'text', req: true, pat: /^([^\s@]+@[^\s@]+\.[^\s@]{2,}|[0-9+\-\s]{10,15})$/, pm: 'Enter a valid email or phone number.' }
];

const PAGES = {
  index() {
    const ev = L('events').filter(e => e.date >= todayISO()).sort((a, b) => a.date.localeCompare(b.date)).slice(0, 3);
    const an = L('announcements').sort(byDate).slice(0, 3);
    const feats = [['📢', 'Announcements', 'Never miss exams, placements or notices.', 'announcements.html'], ['🎟', 'Events', 'Discover and register for campus events.', 'events.html'], ['🤝', 'Clubs', 'Find your community and join in.', 'clubs.html'], ['📚', 'Study Resources', 'Bookmark notes, tutorials and practice.', 'study-resources.html'], ['🧭', 'Campus Directory', 'Timings and contacts for every service.', 'resources.html'], ['🎒', 'Lost & Found', 'Report and recover lost belongings.', 'lost-found.html']];
    $('#app').innerHTML = `<section class="hero"><div class="wrap hero-in"><div><span class="pill">Smart student services</span><h1>Your whole campus, <em>one place.</em></h1><p class="lead">CampusConnect brings announcements, events, clubs, study material and lost &amp; found together so student life runs smoothly.</p><div class="row"><a class="btn lg" href="#features">Explore Campus</a><a class="btn ghost lg" href="dashboard.html">Open Dashboard</a></div></div><div class="card hero-card"><h3>Today on campus</h3>${mini(ev.slice(0, 2), e => `<li><strong>${esc(e.name)}</strong><br><small class="muted">${fmt(e.date)} · ${esc(e.location)}</small></li>`, 'No upcoming events.')}<a href="events.html">See all events →</a></div></div></section>
    <section class="wrap sec reveal" id="features"><h2>Everything students need</h2><div class="grid">${feats.map(f => `<a class="card feat" href="${f[3]}"><span class="ico" aria-hidden="true">${f[0]}</span><h3>${f[1]}</h3><p class="muted">${f[2]}</p></a>`).join('')}</div></section>
    <section class="wrap sec reveal"><h2>How it works</h2><ol class="grid steps"><li class="card"><b>1</b><h3>Set up your profile</h3><p class="muted">Add your department, year and interests.</p></li><li class="card"><b>2</b><h3>Explore and join</h3><p class="muted">Register for events, join clubs, save study resources.</p></li><li class="card"><b>3</b><h3>Stay on track</h3><p class="muted">Your dashboard updates as you go.</p></li></ol></section>
    <section class="wrap sec reveal stats"><div class="card"><strong>${L('events').length}</strong><span>Events</span></div><div class="card"><strong>${L('clubs').length}</strong><span>Clubs</span></div><div class="card"><strong>${L('study').length}</strong><span>Study resources</span></div><div class="card"><strong>${L('lostfound').length}</strong><span>Lost &amp; found items</span></div></section>
    <section class="wrap sec reveal"><h2>Upcoming events</h2><div class="grid">${ev.map(evCard).join('')}</div></section>
    <section class="wrap sec reveal"><h2>Latest announcements</h2><div class="grid">${an.map(annCard).join('')}</div></section>
    <section class="wrap sec reveal"><h2>Student benefits</h2><ul class="grid ticks"><li>✔ One login-free place for all campus updates</li><li>✔ Personal dashboard that remembers your choices</li><li>✔ Works offline once loaded, with dark mode</li><li>✔ Fast search, filters and sorting everywhere</li></ul></section>
    <section class="wrap sec cta"><h2>Ready to get involved?</h2><p>Open your dashboard and start exploring.</p><a class="btn lg" href="dashboard.html">Go to Dashboard</a></section>`;
    window.redraw = PAGES.index;
    if ('IntersectionObserver' in window) { const io = new IntersectionObserver(es => es.forEach(x => { if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); } }), { threshold: .1 }); $$('.reveal').forEach(el => io.observe(el)); } else $$('.reveal').forEach(el => el.classList.add('in'));
  },

  dashboard() {
    const p = profile(), regIds = L('regs'), regs = L('events').filter(e => regIds.includes(e.id)).sort((a, b) => a.date.localeCompare(b.date));
    const clubs = L('clubs').filter(c => L('joined').includes(c.id)), saved = L('study').filter(s => L('saved').includes(s.id));
    const up = L('events').filter(e => e.date >= todayISO()).sort((a, b) => a.date.localeCompare(b.date)).slice(0, 3);
    const an = L('announcements').sort(byDate).slice(0, 3), lf = L('lostfound').filter(i => i.status === 'Open').sort(byDate).slice(0, 3);
    const pending = L('announcements').filter(a => a.priority === 'High').length + regs.filter(e => e.date >= todayISO() && e.date <= offISO(7)).length;
    const hr = new Date().getHours(), greet = hr < 12 ? 'Good morning' : hr < 17 ? 'Good afternoon' : 'Good evening';
    $('#app').innerHTML = `<div class="wrap"><header class="ph"><h1>${greet}, ${esc(p.name.split(' ')[0])} 👋</h1><p class="muted">Here is what is happening on campus.</p></header>
    <div class="stats"><div class="card"><strong>${regs.length}</strong><span>Events registered</span></div><div class="card"><strong>${clubs.length}</strong><span>Clubs joined</span></div><div class="card"><strong>${saved.length}</strong><span>Saved resources</span></div><div class="card"><strong>${pending}</strong><span>Pending notifications</span></div></div>
    <div class="cols"><section class="card prof">${avatar(p, 'lg')}<div><h2>${esc(p.name)}</h2><p class="muted">${esc(p.dept)} · ${esc(p.year)}<br>${esc(p.email)}</p><a href="profile.html">Edit profile →</a></div></section><section class="card"><h2>Campus weather</h2><div id="wx"></div></section><section class="card"><h2>Quick actions</h2><div class="row wrapx"><a class="btn sm" href="events.html">Browse events</a><a class="btn sm ghost" href="clubs.html">Find clubs</a><a class="btn sm ghost" href="lost-found.html">Report item</a><a class="btn sm ghost" href="feedback.html">Send feedback</a></div></section></div>
    <div class="cols"><section class="card"><h2>Upcoming events</h2>${mini(up, e => `<li><strong>${esc(e.name)}</strong><br><small class="muted">${fmt(e.date)} · ${esc(e.time)}</small></li>`, 'No upcoming events.')}</section><section class="card"><h2>Your registered events</h2>${mini(regs, e => `<li><strong>${esc(e.name)}</strong><br><small class="muted">${fmt(e.date)} · ${esc(e.location)}</small></li>`, 'You have not registered for any events yet.')}</section><section class="card"><h2>Favorite clubs</h2>${mini(clubs, c => `<li><strong>${esc(c.name)}</strong><br><small class="muted">${esc(c.category)} · ${c.members} members</small></li>`, 'You have not joined any clubs yet.')}</section></div>
    <div class="cols"><section class="card"><h2>Latest announcements</h2>${mini(an, a => `<li>${priBadge(a.priority)}<br><strong>${esc(a.title)}</strong><br><small class="muted">${fmt(a.date)}</small></li>`, 'No announcements.')}</section><section class="card"><h2>Saved study resources</h2>${mini(saved, s => `<li><a href="${esc(s.link)}" target="_blank" rel="noopener noreferrer">${esc(s.title)} ↗</a><br><small class="muted">${esc(s.type)}</small></li>`, 'Bookmark resources to see them here.')}</section><section class="card"><h2>Lost &amp; found updates</h2>${mini(lf, i => `<li><span class="badge ${i.type}">${i.type}</span> <strong>${esc(i.name)}</strong><br><small class="muted">${esc(i.location)}</small></li>`, 'No open items.')}</section></div></div>`;
    weatherWidget($('#wx'));
    window.redraw = PAGES.dashboard;
  },

  announcements() {
    listView({ title: 'Announcements', sub: 'Official notices from departments and offices.', items: () => L('announcements'), keys: ['title', 'desc', 'category', 'author'], card: annCard,
      filters: [{ label: 'Category', opts: ['Academic', 'Examination', 'Placement', 'Event', 'General'], get: a => a.category }, { label: 'Priority', opts: ['High', 'Medium', 'Low'], get: a => a.priority }],
      sorts: [['Newest', byDate], ['Oldest', (a, b) => a.date.localeCompare(b.date)], ['Priority', (a, b) => PRI[a.priority] - PRI[b.priority]], ['A–Z', alpha('title')]] });
  },
  events() {
    const bucket = e => e.date < todayISO() ? 'Past' : e.date <= offISO(7) ? 'This week' : 'Later';
    listView({ title: 'Events', sub: 'Register for upcoming events and manage your bookings.', items: () => L('events'), keys: ['name', 'desc', 'location', 'organizer', 'category'], card: evCard,
      filters: [{ label: 'Category', opts: uniq(L('events'), 'category'), get: e => e.category }, { label: 'Date', opts: ['This week', 'Later', 'Past'], get: bucket }, { label: 'Registration', opts: ['Registered', 'Not registered'], get: e => L('regs').includes(e.id) ? 'Registered' : 'Not registered' }],
      sorts: [['Soonest', (a, b) => a.date.localeCompare(b.date)], ['Latest', byDate], ['A–Z', alpha('name')], ['Most popular', (a, b) => (b.cap - b.seats) - (a.cap - a.seats)]] });
  },
  clubs() {
    listView({ title: 'Clubs', sub: 'Find a community that matches your interests.', items: () => L('clubs'), keys: ['name', 'desc', 'category', 'coordinator'], card: clubCard,
      filters: [{ label: 'Category', opts: uniq(L('clubs'), 'category'), get: c => c.category }, { label: 'Membership', opts: ['Joined', 'Not joined'], get: c => L('joined').includes(c.id) ? 'Joined' : 'Not joined' }],
      sorts: [['Most popular', (a, b) => b.members - a.members], ['A–Z', alpha('name')]] });
  },
  resources() {
    listView({ title: 'Campus Resources', sub: 'Locations, timings and contacts for campus services.', items: () => L('campus'), keys: ['name', 'desc', 'category', 'location'], card: campusCard,
      filters: [{ label: 'Category', opts: uniq(L('campus'), 'category'), get: r => r.category }], sorts: [['A–Z', alpha('name')], ['Z–A', (a, b) => b.name.localeCompare(a.name)]] });
  },
  'study-resources'() {
    listView({ title: 'Study Resources', sub: 'Curated notes, tutorials and practice material. Bookmark what you need.', items: () => L('study'), keys: ['title', 'desc', 'subject', 'type'], card: studyCard,
      filters: [{ label: 'Subject', opts: uniq(L('study'), 'subject'), get: s => s.subject }, { label: 'Type', opts: uniq(L('study'), 'type'), get: s => s.type }, { label: 'Status', opts: ['Saved', 'Not saved'], get: s => L('saved').includes(s.id) ? 'Saved' : 'Not saved' }],
      sorts: [['A–Z', alpha('title')], ['Z–A', (a, b) => b.title.localeCompare(a.title)], ['Saved first', (a, b) => L('saved').includes(b.id) - L('saved').includes(a.id)]] });
  },
  'lost-found'() {
    listView({ title: 'Lost & Found', sub: 'Report a lost or found item and help it get back to its owner.', add: '+ Report item', items: () => L('lostfound'), keys: ['name', 'desc', 'location', 'category'], card: lfCard,
      filters: [{ label: 'Type', opts: ['Lost', 'Found'], get: i => i.type }, { label: 'Category', opts: ['Electronics', 'Books & Stationery', 'Accessories', 'ID & Cards', 'Clothing', 'Other'], get: i => i.category }, { label: 'Status', opts: ['Open', 'Resolved'], get: i => i.status }],
      sorts: [['Newest', byDate], ['Oldest', (a, b) => a.date.localeCompare(b.date)], ['A–Z', alpha('name')]],
      onAdd() {
        const fs = LF_FIELDS();
        openModal(`<h2>Report an item</h2><form id="lf" novalidate>${fieldsHTML(fs)}<div class="row end"><button type="button" class="btn ghost" data-close>Cancel</button><button class="btn">Submit</button></div></form>`);
        bindForm($('#lf'), fs, v => { Store.saveData('lostfound', [{ id: uid(), ...v, status: 'Open', own: true }, ...L('lostfound')]); closeModal(); toast('Item submitted successfully.', 'ok', 'lf'); window.redraw(); });
      } });
  },

  profile() {
    const p = profile(), fs = [
      { n: 'name', l: 'Full name', t: 'text', req: true, min: 3, maxl: 50 },
      { n: 'dept', l: 'Department', t: 'select', req: true, opts: ['Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Business Administration'] },
      { n: 'year', l: 'Year', t: 'select', req: true, opts: ['1st Year', '2nd Year', '3rd Year', '4th Year'] },
      { n: 'email', l: 'Email', t: 'email', req: true },
      { n: 'skills', l: 'Skills and interests (comma separated)', t: 'text', req: true, min: 2, maxl: 120 }];
    const draw = () => {
      const q = profile(), regs = L('events').filter(e => L('regs').includes(e.id)), clubs = L('clubs').filter(c => L('joined').includes(c.id));
      $('#app').innerHTML = `<div class="wrap"><header class="ph"><h1>Profile</h1><p class="muted">Keep your details up to date.</p></header><div class="cols two"><section class="card"><div class="prof">${avatar(q, 'lg')}<div><h2>${esc(q.name)}</h2><p class="muted">${esc(q.dept)} · ${esc(q.year)}<br>${esc(q.email)}</p></div></div><p>${q.skills.split(',').map(s => `<span class="badge">${esc(s.trim())}</span>`).join(' ')}</p><label class="btn ghost sm" for="photo">Change photo</label><input class="sr" type="file" id="photo" accept="image/*"><h3>Clubs joined</h3>${mini(clubs, c => `<li>${esc(c.name)}</li>`, 'No clubs joined yet.')}<h3>Registered events</h3>${mini(regs, e => `<li>${esc(e.name)} <small class="muted">· ${fmt(e.date)}</small></li>`, 'No registrations yet.')}</section><section class="card"><h2>Edit profile</h2><form id="pf" novalidate>${fieldsHTML(fs, q)}<button class="btn">Save changes</button></form></section></div></div>`;
      bindForm($('#pf'), fs, v => { Store.saveData('profile', { ...profile(), ...v }); toast('Profile updated.'); draw(); });
      $('#photo').onchange = e => {
        const f = e.target.files[0]; if (!f) return;
        if (!f.type.startsWith('image/') || f.size > 4e5) return toast('Choose an image under 400 KB.', 'err');
        const r = new FileReader();
        r.onload = () => { if (Store.saveData('profile', { ...profile(), photo: r.result })) { toast('Photo updated.'); draw(); } else toast('Could not save the photo.', 'err'); };
        r.onerror = () => toast('Could not read that file.', 'err');
        r.readAsDataURL(f);
      };
    };
    draw(); window.redraw = null;
  },

  feedback() {
    const fs = [
      { n: 'name', l: 'Your name', t: 'text', req: true, min: 3, maxl: 50 },
      { n: 'email', l: 'Email', t: 'email', req: true },
      { n: 'topic', l: 'Topic', t: 'select', req: true, opts: ['Suggestion', 'Bug report', 'Complaint', 'Appreciation', 'Other'] },
      { n: 'message', l: 'Message', t: 'textarea', req: true, min: 10, maxl: 500 }];
    const p = profile();
    $('#app').innerHTML = `<div class="wrap"><header class="ph"><h1>Feedback &amp; Contact</h1><p class="muted">Tell us how to make CampusConnect better.</p></header><div class="cols two"><section class="card" id="fb"><form id="ff" novalidate>${fieldsHTML(fs, { name: p.name, email: p.email })}<button class="btn">Send feedback</button></form></section><section class="card"><h2>Contact the campus team</h2><p class="muted">✉ support@campus.edu<br>☎ 040-5550-1104<br>📍 Admin Block, Ground Floor<br>🕒 Mon–Sat, 9:30 AM – 4:30 PM</p><p class="muted">Feedback sent so far from this device: <strong id="fc">${L('feedback').length}</strong></p></section></div></div>`;
    bindForm($('#ff'), fs, v => {
      if (!Store.saveData('feedback', [...L('feedback'), { id: uid(), ...v, date: todayISO() }])) return toast('Could not save your feedback.', 'err');
      $('#fb').innerHTML = `<div class="empty"><div aria-hidden="true">🎉</div><h3>Thank you!</h3><p>Your feedback has been recorded.</p><button class="btn" onclick="PAGES.feedback()">Send another</button></div>`;
      $('#fc').textContent = L('feedback').length; toast('Feedback submitted. Thank you!');
    });
    window.redraw = null;
  },

  settings() {
    const s = { events: true, clubs: true, resources: true, lf: true, ...(Store.getData('settings', {}) || {}) }, th = document.documentElement.dataset.theme;
    const opts = [['events', 'Event registration alerts'], ['clubs', 'Club membership alerts'], ['resources', 'Bookmark alerts'], ['lf', 'Lost & Found alerts']];
    $('#app').innerHTML = `<div class="wrap narrow"><header class="ph"><h1>Settings</h1><p class="muted">Personalise CampusConnect.</p></header><section class="card"><h2>Appearance</h2><div class="fld"><label for="theme">Theme</label><select id="theme"><option value="light"${th === 'light' ? ' selected' : ''}>Light</option><option value="dark"${th === 'dark' ? ' selected' : ''}>Dark</option></select></div></section><section class="card"><h2>Notification preferences</h2>${opts.map(([k, t]) => `<label class="chk"><input type="checkbox" data-n="${k}"${s[k] ? ' checked' : ''}> ${t}</label>`).join('')}</section><section class="card"><h2>Data</h2><p class="muted">Clearing removes your registrations, joined clubs, bookmarks and feedback. Your profile is kept.</p><div class="row"><button class="btn danger" id="clr">Clear saved data</button><button class="btn ghost" id="rst">Reset demo data</button></div></section></div>`;
    $('#theme').onchange = e => setTheme(e.target.value);
    $$('[data-n]').forEach(c => c.onchange = () => { Store.saveData('settings', { ...s, ...Object.fromEntries($$('[data-n]').map(x => [x.dataset.n, x.checked])) }); toast('Preferences saved.', 'info'); });
    $('#clr').onclick = async () => {
      if (!await confirmBox('Clear your registrations, clubs, bookmarks and feedback?', 'Clear data')) return;
      ['regs', 'joined', 'saved', 'feedback'].forEach(k => Store.saveData(k, [])); Store.saveData('events', DEMO.events()); Store.saveData('clubs', DEMO.clubs());
      toast('Saved data cleared.');
    };
    $('#rst').onclick = async () => {
      if (!await confirmBox('Reset everything, including your profile, to the original demo data?', 'Reset')) return;
      seed(true); toast('Demo data restored.');
    };
    window.redraw = null;
  }
};

document.addEventListener('DOMContentLoaded', () => {
  try { seed(); buildShell(); const fn = PAGES[document.body.dataset.page]; if (fn) fn(); }
  catch (err) { console.error(err); $('#app').innerHTML = empty('Something went wrong', 'Please refresh the page. If the problem continues, open Settings and reset demo data.', '⚠'); }
});

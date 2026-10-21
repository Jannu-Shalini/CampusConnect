/* Small shared helpers and UI primitives (toast, modal, form validation). */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const offISO = n => { const d = new Date(); d.setDate(d.getDate() + n); return new Date(d - d.getTimezoneOffset() * 6e4).toISOString().slice(0, 10); };
const todayISO = () => offISO(0);
const fmt = d => { const t = new Date(d + 'T00:00'); return isNaN(t) ? '—' : t.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }); };
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
const debounce = (f, ms = 150) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => f(...a), ms); }; };
const empty = (t, s, i = '🔍') => `<div class="empty"><div aria-hidden="true">${i}</div><h3>${t}</h3><p>${s}</p></div>`;

/* Toast notifications. `cat` ties a toast to a notification preference. */
function toast(msg, type = 'ok', cat) {
  if (cat && Store.getData('settings', {})[cat] === false) return;
  const el = document.createElement('div');
  el.className = 'toast ' + type;
  el.innerHTML = `<span aria-hidden="true">${type === 'ok' ? '✔' : type === 'err' ? '✖' : 'ℹ'}</span> ${esc(msg)}`;
  $('#toasts').appendChild(el);
  setTimeout(() => { el.classList.add('out'); setTimeout(() => el.remove(), 300); }, 3200);
}
function openModal(html) {
  const d = $('#modal');
  d.innerHTML = `<div class="mbody"><button class="x" aria-label="Close dialog" data-close>×</button>${html}</div>`;
  if (!d.open) d.showModal();
}
function closeModal() { const d = $('#modal'); if (d.open) d.close(); }
function confirmBox(msg, label = 'Confirm') {
  return new Promise(res => {
    openModal(`<h2>Please confirm</h2><p>${esc(msg)}</p><div class="row end"><button class="btn ghost" data-close>Cancel</button><button class="btn danger" id="yes">${label}</button></div>`);
    $('#yes').onclick = () => { closeModal(); res(true); };
    $('#modal').addEventListener('close', () => res(false), { once: true });
  });
}

/* Form helpers: fields = [{n,l,t,req,min,maxl,max,opts,pat,pm}] */
function fieldsHTML(fs, v = {}) {
  return fs.map(f => {
    const id = 'f_' + f.n, val = esc(v[f.n] ?? '');
    const c = f.t === 'select'
      ? `<select id="${id}" name="${f.n}"><option value="">Select…</option>${f.opts.map(o => `<option${o === v[f.n] ? ' selected' : ''}>${esc(o)}</option>`).join('')}</select>`
      : f.t === 'textarea' ? `<textarea id="${id}" name="${f.n}" rows="4">${val}</textarea>`
      : `<input id="${id}" name="${f.n}" type="${f.t}" value="${val}"${f.max ? ` max="${f.max}"` : ''}>`;
    return `<div class="fld"><label for="${id}">${f.l}${f.req ? ' *' : ''}</label>${c}<small class="err" id="e_${f.n}" role="alert"></small></div>`;
  }).join('');
}
function validate(form, fs) {
  let ok = true; const out = {};
  fs.forEach(f => {
    const el = form.elements[f.n], v = el.value.trim(); let m = '';
    if (f.req && !v) m = f.t === 'select' ? 'Please choose an option.' : 'This field is required.';
    else if (v) {
      if (f.t === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) m = 'Enter a valid email address.';
      else if (f.t === 'date') { if (isNaN(new Date(v + 'T00:00'))) m = 'Enter a valid date.'; else if (f.max && v > f.max) m = 'Date cannot be in the future.'; }
      else if (f.min && v.length < f.min) m = `Enter at least ${f.min} characters.`;
      else if (f.maxl && v.length > f.maxl) m = `Keep it under ${f.maxl} characters.`;
      else if (f.pat && !f.pat.test(v)) m = f.pm;
    }
    $('#e_' + f.n, form).textContent = m;
    el.setAttribute('aria-invalid', String(!!m));
    if (m) { if (ok) el.focus(); ok = false; }
    out[f.n] = v;
  });
  return ok ? out : null;
}
function bindForm(form, fs, cb) {
  form.noValidate = true;
  form.addEventListener('submit', e => { e.preventDefault(); const v = validate(form, fs); if (v) cb(v); });
}

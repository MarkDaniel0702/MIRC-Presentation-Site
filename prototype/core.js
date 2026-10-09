/* MIRC prototype: shared core (router, safe HTML templates, forms, dialogs, feedback, edition switching).
   Everything runs in the browser. ED.list holds one in-memory record per conference edition: changes last until reload.
   S is a window onto the edition being worked on, so S.papers, S.events ... always mean "this edition".
   People (users) are shared by all editions, as in blueprint 7.1 (the user table has no conference id). */
'use strict';

const P = window.P = { routes: [], ui: {}, sel: {}, fe: {}, act: {}, formDefs: {}, shells: {}, msg: null, keep: false, navOpen: new Set(), groups: [] };
const ED = P.ED = { list: structuredClone(EDITIONS), cur: EDITIONS[0].conf.id, users: structuredClone(EDITIONS[0].users) };
ED.list.forEach(e => { delete e.users; });
P.edition = id => ED.list.find(e => e.conf.id === (id || ED.cur));
const S = P.S = new Proxy({}, {
  get: (_, k) => k === 'users' ? ED.users : P.edition()[k],
  set: (_, k, v) => { if (k === 'users') ED.users = v; else P.edition()[k] = v; return true; },
});
/* Switch the edition everyone is looking at. Filters, selections and half-filled forms belong to the old edition, so they are dropped. */
P.useEdition = id => {
  if (id === ED.cur || !P.edition(id)) return;
  ED.cur = id; P.sel = {}; P.fe = {};
  for (const k of Object.keys(P.ui)) if (k !== 'site.role') delete P.ui[k];
};
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

/* ---------- safe HTML: html`...` escapes every value unless it is already html (Raw) ---------- */
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
class Raw { constructor(s) { this.s = s; } }
const raw = s => new Raw(String(s));
const fmt = v => v instanceof Raw ? v.s : Array.isArray(v) ? v.map(fmt).join('') : (v === false || v == null) ? '' : esc(v);
const html = (s, ...v) => new Raw(s.reduce((o, t, i) => o + t + (i < v.length ? fmt(v[i]) : ''), ''));
const u = (k, d) => P.ui[k] ?? d;
const today = () => new Date().toISOString().slice(0, 10);

/* plain text -> paragraphs; lines starting "- " become a list */
P.text = s => html`${String(s || '').split(/\n\s*\n/).filter(Boolean).map(b => {
  const ls = b.split('\n');
  return ls.every(l => l.startsWith('- ')) ? html`<ul>${ls.map(l => html`<li>${l.slice(2)}</li>`)}</ul>` : html`<p>${ls.map((l, i) => html`${i ? raw('<br>') : ''}${l}`)}</p>`;
})}`;

/* ---------- feedback: a message that stays on screen until closed or the page changes ---------- */
const SYM = { ok: '✔', info: 'i', warn: '!', error: '✖' };
const LBL = { ok: 'Done', info: 'Note', warn: 'Please note', error: 'Problem' };
const msgHTML = () => !P.msg ? html`` : html`<div class="alert alert-${P.msg.kind}"><span class="sym" aria-hidden="true">${SYM[P.msg.kind]}</span>
  <div><strong>${LBL[P.msg.kind]}.</strong> ${P.msg.text}${P.msg.kind === 'ok' ? html` <span class="muted">(Simulated: kept only in this browser tab, nothing is saved on a server.)</span>` : ''}</div>
  <button type="button" class="linklike" data-act="dismiss">Close message</button></div>`;
P.say = (kind, text) => {
  P.msg = { kind, text };
  const fb = $('#fb');
  if (fb) { fb.innerHTML = msgHTML().s; fb.scrollIntoView({ block: 'nearest' }); }
  $('#live').textContent = (LBL[kind] + '. ' + (text instanceof Raw ? text.s.replace(/<[^>]+>/g, '') : text));
};
P.goSay = (path, kind, text) => { P.msg = { kind, text }; P.keep = true; P.go(path); };

/* ---------- form fields: labels, hints, plain-language error messages ---------- */
const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const isGroup = f => ['radio', 'checks', 'calendar', 'time'].includes(f.type);
const norm = f => (f.options || []).map(o => typeof o === 'string' ? { v: o, l: o } : o);
function fieldHTML(f, vals, errs) {
  const id = 'f-' + f.name, v = vals[f.name] ?? f.value ?? (f.type === 'checks' ? [] : ''), err = errs[f.name];
  const desc = [f.hint && id + '-h', err && id + '-e'].filter(Boolean).join(' ');
  const common = `name="${esc(f.name)}"${f.required && !isGroup(f) ? ' required aria-required="true"' : ''}${desc ? ` aria-describedby="${desc}"` : ''}${err ? ' aria-invalid="true"' : ''}${f.disabled ? ' disabled' : ''}${f.attrs ? ' ' + f.attrs : ''}`;
  const label = html`${f.label}${f.required ? html` <span class="req">(required)</span>` : ''}`;
  const hint = f.hint ? html`<p class="hint" id="${id}-h">${f.hint}</p>` : '';
  const error = err ? html`<p class="err" id="${id}-e"><span aria-hidden="true">✖</span> <strong>Problem:</strong> ${err}</p>` : '';
  const o = norm(f);
  if (f.type === 'calendar' || f.type === 'time') {
    const body = f.type === 'calendar' ? P.calField(f, v, id) : P.timeField(f, v, id);
    return html`<fieldset class="field${err ? ' has-error' : ''}" id="${id}" tabindex="-1" ${raw(desc ? `aria-describedby="${desc}"` : '')}><legend>${label}</legend>${hint}${body}${error}</fieldset>`;
  }
  if (isGroup(f)) {
    const t = f.type === 'radio' ? 'radio' : 'checkbox';
    return html`<fieldset class="field${err ? ' has-error' : ''}" id="${id}" tabindex="-1" ${raw(desc ? `aria-describedby="${desc}"` : '')}><legend>${label}</legend>${hint}
      ${o.map(x => html`<label class="choice"><input type="${t}" name="${f.name}" value="${x.v}" ${raw((t === 'radio' ? String(v) === String(x.v) : [].concat(v).includes(x.v)) ? 'checked' : '')}> ${x.l}</label>`)}${error}</fieldset>`;
  }
  let ctl;
  if (f.type === 'textarea') ctl = html`<textarea id="${id}" ${raw(common)} rows="${f.rows || 5}">${v}</textarea>`;
  else if (f.type === 'select') {
    const opt = x => html`<option value="${x.v}" ${raw(String(x.v) === String(v) ? 'selected' : '')}>${x.l}</option>`;
    ctl = html`<select id="${id}" ${raw(common)}>${o.map(opt)}${(f.groups || []).map(g => html`<optgroup label="${g.label}">${norm(g).map(opt)}</optgroup>`)}</select>`;
  }
  else if (f.type === 'file') ctl = html`<input id="${id}" type="file" ${raw(common)} ${raw(f.accept ? `accept="${esc(f.accept)}"` : '')}>`;
  else ctl = html`<input id="${id}" type="${f.type || 'text'}" ${raw(common)} value="${v}" ${raw(f.step ? `step="${f.step}"` : '')} ${raw(f.min != null ? `min="${f.min}"` : '')} ${raw(f.autocomplete ? `autocomplete="${f.autocomplete}"` : '')}>`;
  return html`<div class="field${err ? ' has-error' : ''}"><label for="${id}">${label}</label>${hint}${ctl}${error}</div>`;
}
/* Neighbouring fields marked row:true sit side by side (for example "Starts at" and "Ends at"); they stack on narrow screens. */
P.fieldsHTML = (fields, vals = {}, errs = {}) => {
  const out = [];
  for (let i = 0; i < fields.length; i++) {
    if (!fields[i].row) { out.push(fieldHTML(fields[i], vals, errs)); continue; }
    const run = []; while (i < fields.length && fields[i].row) run.push(fieldHTML(fields[i++], vals, errs)); i--;
    out.push(html`<div class="fields-row">${run}</div>`);
  }
  return html`${out}`;
};
P.readFields = (form, fields) => {
  const fd = new FormData(form), o = {};
  for (const f of fields) {
    const x = f.type === 'checks' ? fd.getAll(f.name) : f.type === 'file' ? (fd.get(f.name)?.name || '') : f.type === 'time' ? P.readTime(fd, f.name) : (fd.get(f.name) ?? '');
    o[f.name] = typeof x === 'string' ? x.trim() : x;
  }
  return o;
};
P.validate = (fields, vals, check) => {
  const e = {};
  for (const f of fields) {
    const v = vals[f.name], empty = Array.isArray(v) ? !v.length : v === '';
    if (f.type === 'time' && v && !/^\d\d:\d\d$/.test(v)) { e[f.name] = 'Please choose both the hour and the minutes.'; continue; }   // one of the two boxes was left empty
    if (f.required && empty) { e[f.name] = f.type === 'checks' ? 'Please tick at least one box.' : f.type === 'calendar' ? (f.multi ? 'Please click at least one day on the calendar.' : 'Please click a date on the calendar.') : f.type === 'time' ? 'Please choose a time (hour and minutes).' : (f.type === 'select' || f.type === 'radio') ? 'Please choose one.' : 'Please fill in this box.'; continue; }
    if (empty) continue;
    if (f.type === 'email' && !EMAIL.test(v)) e[f.name] = 'Please type an email address like name@example.org.';
    else if (f.type === 'number' && (isNaN(v) || (f.min != null && +v < f.min))) e[f.name] = `Please type a number${f.min != null ? ' of ' + f.min + ' or more' : ''}.`;
    else if (f.type === 'calendar' && !String(v).split(',').every(P.isDate)) e[f.name] = 'That date is not valid. Please click a date on the calendar.';
    else if (f.check) { const m = f.check(v, vals); if (m) e[f.name] = m; }
  }
  if (check) Object.assign(e, check(vals) || {});
  return e;
};
P.errSummary = (fields, errs) => {
  const items = fields.filter(f => errs[f.name]);
  if (!items.length) return html``;
  return html`<div class="alert alert-error" role="alert" id="errsum" tabindex="-1"><span class="sym" aria-hidden="true">✖</span><div><strong>Problem.</strong> Please fix ${items.length} item${items.length > 1 ? 's' : ''} before continuing:
    <ul>${items.map(f => html`<li><button type="button" class="linklike" data-act="focusfield" data-id="f-${f.name}">${f.label}: ${errs[f.name]}</button></li>`)}</ul></div></div>`;
};

/* in-page forms: P.defForm(name, {fields(), run(values), check?, submit?, cancel?}) then P.formHTML(name, startValues) */
P.defForm = (name, d) => { P.formDefs[name] = d; };
P.formHTML = (name, start) => {
  const d = P.formDefs[name], fields = d.fields(), fe = P.fe[name];
  const vals = fe ? fe.vals : (start || {}), errs = fe ? fe.errs : {};
  const main = fields.filter(f => !f.more), more = fields.filter(f => f.more);
  return html`<form data-form="${name}" novalidate class="stack">${P.errSummary(fields, errs)}${P.fieldsHTML(main, vals, errs)}
    ${more.length ? html`<details class="more" ${raw(more.some(f => errs[f.name]) ? 'open' : '')}><summary>${d.moreLabel || 'More options'}</summary>${P.fieldsHTML(more, vals, errs)}</details>` : ''}
    <div class="actions"><button class="btn btn-primary" type="submit">${d.submit || 'Save'}</button>${d.cancel ? html`<a class="btn btn-secondary" href="${d.cancel}">Cancel</a>` : ''}</div></form>`;
};
function onForm(form) {
  const name = form.dataset.form, d = P.formDefs[name], fields = d.fields();
  const vals = P.readFields(form, fields), errs = P.validate(fields, vals, d.check);
  if (Object.keys(errs).length) { P.fe[name] = { vals, errs }; draw(false); $('#errsum')?.focus(); return; }
  delete P.fe[name];
  d.run(vals, form);
}

/* ---------- dialogs (native <dialog>: keeps keyboard focus inside, Esc closes) ---------- */
const dlg = () => $('#dlg');
P.confirm = ({ title, text, ok = 'Yes', cancel = 'No, go back', danger }) => new Promise(res => {
  const d = dlg();
  d.className = danger ? 'danger' : '';
  d.innerHTML = html`<form method="dialog" class="dlg-body stack"><h2 id="dlg-title">${title}</h2><p>${text}</p>
    <div class="actions"><button class="btn ${danger ? 'btn-danger' : 'btn-primary'}" value="ok">${ok}</button><button class="btn btn-secondary" value="cancel" autofocus>${cancel}</button></div></form>`.s;
  d.returnValue = '';
  d.onclose = () => { if (!d.open) res(d.returnValue === 'ok'); };
  d.showModal();
});
P.show = (title, body) => {
  const d = dlg();
  d.className = '';
  d.innerHTML = html`<form method="dialog" class="dlg-body stack"><h2 id="dlg-title">${title}</h2>${body}<div class="actions"><button class="btn btn-primary" autofocus>Close</button></div></form>`.s;
  d.onclose = null;
  d.showModal();
};
/* P.form({title, intro, fields, values, check, submit}) resolves to the typed values, or null if cancelled */
P.form = o => new Promise(res => {
  const d = dlg();
  let vals = o.values || {}, errs = {}, finished = false;
  const paint = () => {
    d.className = '';
    d.innerHTML = html`<form novalidate class="dlg-body stack"><h2 id="dlg-title">${o.title}</h2>${o.intro ? html`<p>${o.intro}</p>` : ''}${P.errSummary(o.fields, errs)}${P.fieldsHTML(o.fields, vals, errs)}
      <div class="actions"><button class="btn btn-primary" type="submit">${o.submit || 'Save'}</button><button class="btn btn-secondary" type="button" data-act="dlgclose">Cancel</button></div></form>`.s;
    d.querySelector('form').onsubmit = e => {
      e.preventDefault();
      vals = P.readFields(e.target, o.fields); errs = P.validate(o.fields, vals, o.check);
      if (Object.keys(errs).length) { paint(); d.querySelector('#errsum')?.focus(); } else { finished = true; d.close(); res(vals); }
    };
  };
  d.onclose = () => { if (!d.open && !finished) res(null); };
  paint();
  d.returnValue = '';
  d.showModal();
});

/* ---------- small UI pieces ---------- */
/* Columns titled "Action"/"Actions" get one shared layout (.col-actions + .row-actions): equal-size buttons, uniform gap, no wrapped labels.
   The table scrolls sideways inside its own box (keyboard-reachable) if it ever cannot fit. */
const isAct = c => /^Actions?$/.test(c.h);
const colCls = c => [c.cls, isAct(c) && 'col-actions', c.hide && 'col-select'].filter(Boolean).join(' ');
P.table = ({ cols, rows, empty, caption }) => rows.length ? html`<div class="table-wrap" role="region" tabindex="0" aria-label="${caption} (scrolls sideways if needed)"><table><caption class="sr-only">${caption}</caption>
  <thead><tr>${cols.map(c => html`<th scope="col" class="${colCls(c)}">${c.th || (c.hide ? html`<span class="sr-only">${c.h}</span>` : c.h)}</th>`)}</tr></thead>
  <tbody>${rows.map(r => html`<tr>${cols.map(c => { const v = typeof c.v === 'function' ? c.v(r) : r[c.v]; return html`<td data-label="${c.h}" class="${colCls(c)}">${isAct(c) ? html`<div class="row-actions">${v}</div>` : v}</td>`; })}</tr>`)}</tbody></table></div>`
  : html`<p class="empty">${empty}</p>`;
const ST = { Accepted: ['✔', 'accepted'], Refused: ['✖', 'refused'], 'Awaiting update': ['!', 'awaiting'], Reviewed: ['◉', 'reviewed'], Initial: ['○', 'initial'], 'No review': ['–', 'noreview'],
  Registered: ['✔', 'accepted'], 'Needs payment': ['!', 'awaiting'], 'Pre-registered': ['○', 'initial'], Published: ['✔', 'accepted'], Draft: ['○', 'initial'] };
P.badge = s => html`<span class="badge st-${ST[s][1]}"><span aria-hidden="true">${ST[s][0]}</span> ${s}</span>`;
P.tabs = (key, items, label, cur, cls = '') => html`<div class="tabs ${cls}" role="group" aria-label="${label}">${items.map(([v, l]) =>
  html`<button type="button" class="tab" aria-pressed="${String(cur === v)}" data-act="setui" data-k="${key}" data-v="${v}" data-fk="tab-${key}-${v}">${l}</button>`)}</div>`;
P.csv = (name, rows) => {
  const q = v => { v = String(v ?? ''); if (/^[=+\-@]/.test(v)) v = "'" + v; return `"${v.replace(/"/g, '""')}"`; };
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob(['﻿' + rows.map(r => r.map(q).join(',')).join('\r\n')], { type: 'text/csv' }));
  a.download = name; document.body.append(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
};
P.logMail = (subject, to, body) => S.mailLog.unshift({ id: 'm' + Date.now() + Math.random().toString(16).slice(2, 5), date: new Date().toISOString().slice(0, 16).replace('T', ' '), subject, to, body });
P.money = n => `${n} €`;

/* ---------- router ---------- */
P.add = r => { P.routes.push(r); };
const match = path => {
  for (const r of P.routes) {
    const names = [], re = new RegExp('^' + r.path.replace(/:(\w+)/g, (_, n) => (names.push(n), '([^/]+)')) + '$'), m = re.exec(path);
    if (m) return { r, params: Object.fromEntries(names.map((n, i) => [n, decodeURIComponent(m[i + 1])])) };
  }
};
P.go = path => { if (location.hash === '#' + path) draw(true); else location.hash = path; };
/* redraw the page but keep keyboard focus on "the same" control (found again by its data-* attributes) */
const findAgain = el => el && el.dataset && Object.keys(el.dataset).length
  ? Object.entries(el.dataset).map(([k, v]) => `[data-${k.replace(/[A-Z]/g, c => '-' + c.toLowerCase())}="${CSS.escape(v)}"]`).join('') : '';
P.refresh = () => {
  const a = document.activeElement, s = findAgain(a), pos = a && a.selectionStart;
  draw(false);
  if (!s) return;
  const el = document.querySelector(s);
  if (!el) return $('#main h1')?.focus();
  el.focus();
  try { if (pos != null) el.setSelectionRange(pos, pos); } catch { /* not a text box */ }
};
function draw(moveFocus) {
  const [path, qs] = (location.hash.replace(/^#/, '') || '/admin').split('?');
  const want = new URLSearchParams(qs || '').get('ed');   // a link like #/site?ed=mirc2027 opens that edition
  if (want) P.useEdition(want);
  const m = match(path) || { r: path.startsWith('/site') ? P.notFoundSite : P.notFound, params: {} };
  P.cur = m;
  document.body.dataset.area = m.r.area;
  try { $('#app').innerHTML = P.shells[m.r.area](m).s; }
  catch (err) { console.error(err); $('#app').innerHTML = '<main id="main"><h1>Sorry, this page could not be shown</h1><p><a href="#/admin">Go to the dashboard</a></p></main>'; }
  document.title = `${P.title(m.r, m.params)} - MIRC ${S.conf.year} prototype`;
  if (moveFocus) { $('#main h1')?.focus(); window.scrollTo(0, 0); }
}
P.title = (r, params) => typeof r.title === 'function' ? r.title(params) : r.title;

/* ---------- admin page frame: top bar, task-grouped menu, breadcrumbs, "about this page" box ---------- */
const isCur = (r, cur) => r.path === cur.path ? 'aria-current="page"' : cur.parent === r.path ? 'aria-current="true"' : '';
function navHTML(cur) {
  const link = (r, label) => html`<a class="navlink" href="#${r.path}" ${raw(isCur(r, cur))}>${label}</a>`;
  return html`<ul class="navtop"><li><a class="navlink" href="#/admin" ${raw(cur.path === '/admin' ? 'aria-current="page"' : '')}>Dashboard (start here)</a></li>
    ${P.groups.map(g => html`<li><details data-nav="${g}" ${raw(cur.group === g || P.navOpen.has(g) ? 'open' : '')}><summary>${g}</summary>
      <ul>${P.routes.filter(r => r.area === 'admin' && r.group === g && r.nav).map(r => html`<li>${link(r, r.label)}</li>`)}</ul></details></li>`)}</ul>`;
}
function crumbs(r, params) {
  const t = P.title(r, params);
  const items = r.path === '/admin' ? [['Dashboard']] : [['Dashboard', '#/admin']];
  if (r.group) items.push([r.group]);
  if (r.parent) { const p = P.routes.find(x => x.path === r.parent); items.push([p.label, '#' + p.path]); }
  if (r.path !== '/admin') items.push([r.crumb || r.label || t]);
  return html`<nav class="crumbs" aria-label="You are here"><ol>${items.map(([l, h], i) => html`<li>${h ? html`<a href="${h}">${l}</a>` : i === items.length - 1 ? html`<span aria-current="page">${l}</span>` : html`<span>${l}</span>`}</li>`)}</ol></nav>`;
}
P.refBox = r => html`<details class="refbox"><summary>About this page (for the project team)</summary>
  <p><strong>Blueprint:</strong> ${r.ref || 'n/a'}</p><p><strong>In this prototype:</strong> ${r.note || 'Interface only.'}</p></details>`;
const SIZES = [['1', 'Normal'], ['2', 'Large'], ['3', 'Largest']];
const DENSITY = [['comfortable', 'Comfortable'], ['compact', 'Compact']];
P.sizeTools = () => html`<div class="textsize" role="group" aria-label="Text size"><span>Text size:</span>${SIZES.map(([v, l]) =>
  html`<button type="button" class="btn btn-small btn-ghost" data-act="size" data-v="${v}" aria-pressed="${String(document.documentElement.dataset.size === v)}">${l}</button>`)}</div>
  <div class="textsize density" role="group" aria-label="Table spacing"><span>Tables:</span>${DENSITY.map(([v, l]) =>
  html`<button type="button" class="btn btn-small btn-ghost" data-act="density" data-v="${v}" aria-pressed="${String((document.documentElement.dataset.density || 'comfortable') === v)}">${l}</button>`)}</div>`;
P.shells.admin = m => {
  const r = m.r, body = r.view(m.params);
  return html`<header class="topbar on-dark"><a class="brand" href="#/admin">MIRC <span>Conference Manager</span></a>
    <div class="topbar-tools">${P.editionPicker('Edition you are working on', true)}${P.sizeTools()}<a class="btn btn-gold" href="#/site">See the public website</a></div></header>
  <div class="layout"><button type="button" class="btn btn-secondary menu-toggle" data-act="menu" aria-expanded="${String(!!P.ui.menuOpen)}" aria-controls="sidenav">${P.ui.menuOpen ? 'Close menu' : 'Open menu'}</button>
    <nav id="sidenav" class="sidenav${P.ui.menuOpen ? ' open' : ''}" aria-label="Main menu">${navHTML(r)}</nav>
    <main id="main"><div class="main-in">${crumbs(r, m.params)}<h1 tabindex="-1">${P.title(r, m.params)}</h1>
      <div id="fb">${msgHTML()}</div>${body}${P.refBox(r)}</div></main></div>`;
};
/* The edition chooser. In the admin area it lists every edition; on the public site it lists only what the viewing role may see. */
P.editionPicker = (label, all) => {
  const list = ED.list.filter(e => all || P.canSeeEdition(e) || e.conf.id === ED.cur);
  return html`<label class="inline edpick">${label} <select data-onchange="edswitch" data-fk="edpick">${list.map(e => html`<option value="${e.conf.id}" ${raw(e.conf.id === ED.cur ? 'selected' : '')}>MIRC ${e.conf.year} (${e.conf.status === 'published' ? 'published' : 'draft'})</option>`)}</select></label> ${P.badge(S.conf.status === 'published' ? 'Published' : 'Draft')}`;
};
P.canSeeEdition = e => e.conf.status === 'published' || ['Webmaster', 'Administrator'].includes(u('site.role', 'Guest'));
P.notFound = { path: '*', area: 'admin', title: 'This page was not found', ref: 'n/a', note: 'Shown for any unknown address, with a way back.', view: () => html`<p class="lead">We could not find that page.</p><p><a class="btn btn-primary" href="#/admin">Go to the dashboard</a></p>` };
P.notFoundSite = { path: '*', area: 'site', title: 'This page was not found', view: () => html`<p class="lead">We could not find that page.</p><p><a class="btn btn-primary" href="#/site">Go to the home page</a></p>` };

/* ---------- actions and events (one listener per kind, driven by data-* attributes) ---------- */
Object.assign(P.act, {
  dismiss() { P.msg = null; $('#fb').innerHTML = ''; $('#live').textContent = ''; },
  setui(el) { P.ui[el.dataset.k] = el.dataset.v; P.refresh(); },
  sets(el) { Object.assign(P.ui, JSON.parse(el.dataset.sets)); P.go(el.dataset.path); },
  clearfilters(el) { Object.keys(P.ui).filter(k => k.startsWith(el.dataset.prefix)).forEach(k => delete P.ui[k]); P.refresh(); },
  focusfield(el) { document.getElementById(el.dataset.id)?.focus(); },
  dlgclose() { dlg().close(); },
  skip() { $('#main h1')?.focus(); },
  menu() { P.ui.menuOpen = !P.ui.menuOpen; P.refresh(); },
  edswitch(el) {
    P.useEdition(el.value);
    const r = P.cur.r, text = `You are now looking at MIRC ${S.conf.year} (${S.conf.status === 'published' ? 'published' : 'draft'}). Everything you see and change belongs to this edition only.`;
    if (Object.keys(P.cur.params).length && r.parent) P.goSay(r.parent, 'info', text);   // a page about one paper does not exist in the other edition
    else { P.refresh(); P.say('info', text); }
  },
  size(el) { document.documentElement.dataset.size = el.dataset.v; try { localStorage.setItem('size', el.dataset.v); } catch { /* storage may be blocked */ } P.refresh(); },
  density(el) { document.documentElement.dataset.density = el.dataset.v; try { localStorage.setItem('density', el.dataset.v); } catch { /* storage may be blocked */ } P.refresh(); },
});
document.addEventListener('click', e => { const el = e.target.closest('[data-act]'); if (el && P.act[el.dataset.act]) P.act[el.dataset.act](el, e); });
const uiInput = e => { const el = e.target; if (el.dataset && el.dataset.ui) { P.ui[el.dataset.ui] = el.type === 'checkbox' ? el.checked : el.value; P.refresh(); } };
document.addEventListener('input', e => { if (e.target.matches('input[type=text],input[type=search]')) uiInput(e); });
document.addEventListener('change', e => {
  const el = e.target;
  if (!el.matches('input[type=text],input[type=search]')) uiInput(e);
  if (el.dataset && el.dataset.onchange) P.act[el.dataset.onchange](el, e);
});
document.addEventListener('submit', e => { if (e.target.dataset.form) { e.preventDefault(); onForm(e.target); } });
document.addEventListener('toggle', e => { const d = e.target; if (d.dataset && d.dataset.nav) d.open ? P.navOpen.add(d.dataset.nav) : P.navOpen.delete(d.dataset.nav); }, true);
window.addEventListener('hashchange', () => { if (P.keep) P.keep = false; else P.msg = null; P.fe = {}; P.sel = {}; P.ui.menuOpen = false; Object.keys(P.ui).filter(k => k.startsWith('cal.f-')).forEach(k => delete P.ui[k]); draw(true); });

P.start = () => {
  try { document.documentElement.dataset.size = localStorage.getItem('size') || '2'; document.documentElement.dataset.density = localStorage.getItem('density') || 'comfortable'; }
  catch { document.documentElement.dataset.size = '2'; document.documentElement.dataset.density = 'comfortable'; }
  $('#reset').onclick = () => location.reload();
  if (!location.hash) location.hash = '/admin'; else draw(false);
};

/* Conference prototype: date helpers, the calendar picker and the 24-hour time picker.
   One calendar widget serves three jobs:
   - a page calendar (Schedule): shows which days are conference days, which have events, and which one is chosen; clicking a day calls the action named in cfg.pick;
   - a form field (type: 'calendar'): one date, or several days with multi: true; the answer travels in a hidden box named after the field;
   - a compact "span" view that shows only the weeks of the conference, so a 4-day conference does not need a whole month.
   Every day is a real button with a full spoken label ("Tuesday 29 September 2026, 8 events planned, selected"). Arrow keys move by day and week,
   Page Up / Page Down by month, Home / End to the start and end of the week. Selected, not-available and has-events days differ by shape and text, not by color alone. */
'use strict';
(() => {   // own scope: these helper names must not clash with the other scripts' top-level names

const DAY_MS = 864e5, WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const parseD = s => new Date(s + 'T12:00:00Z');                    // noon UTC: no time zone can move the date
const isoD = d => d.toISOString().slice(0, 10);
const addD = (s, n) => isoD(new Date(parseD(s).getTime() + n * DAY_MS));
const monIdx = s => (parseD(s).getUTCDay() + 6) % 7;               // Monday = 0: weeks start on Monday, as in en-GB
const addMonth = (ym, n) => { const [y, m] = ym.split('-').map(Number), d = new Date(Date.UTC(y, m - 1 + n, 1)); return isoD(d).slice(0, 7); };

P.isDate = s => /^\d{4}-\d\d-\d\d$/.test(s) && isoD(parseD(s)) === s;
/* "Tuesday 29 September 2026" (year left out when withYear is false) */
P.fmtDate = (s, withYear = true) => { const d = parseD(s); return `${WEEKDAYS[d.getUTCDay()]} ${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}${withYear ? ' ' + d.getUTCFullYear() : ''}`; };
P.dayShort = s => { const d = parseD(s); return `${WEEKDAYS[d.getUTCDay()].slice(0, 3)} ${d.getUTCDate()} ${MONTHS[d.getUTCMonth()].slice(0, 3)}`; };
/* "27-30 September 2026", "30 September - 2 October 2027", or one date */
P.datesText = days => {
  const a = [...days].sort(), f = a[0] && parseD(a[0]), l = a.length && parseD(a[a.length - 1]);
  if (!f) return 'Dates not set yet';
  const D = d => d.getUTCDate(), M = d => MONTHS[d.getUTCMonth()], Y = d => d.getUTCFullYear();
  if (a.length === 1 || isoD(f) === isoD(l)) return `${D(f)} ${M(f)} ${Y(f)}`;
  if (Y(f) !== Y(l)) return `${D(f)} ${M(f)} ${Y(f)} – ${D(l)} ${M(l)} ${Y(l)}`;
  return M(f) === M(l) ? `${D(f)}–${D(l)} ${M(f)} ${Y(f)}` : `${D(f)} ${M(f)} – ${D(l)} ${M(l)} ${Y(f)}`;
};

/* ---------- the calendar ----------
   cfg: id (unique on the page), label, value [dates], multi, allowed [dates] (others are "not available"), marks {date: number of events},
        noun ("event"), span (show only the conference weeks), pick (name of a P.act run when an available day is clicked),
        name (form field name for the hidden box), pop (single date in a form: fold it away behind a button), open (pop is unfolded) */
const CALS = P.cals = {};
const plural = (n, w) => `${n} ${w}${n === 1 ? '' : 's'}`;
function calSummary(c) {
  if (c.pick) return '';
  if (c.multi) return c.value.length ? `${plural(c.value.length, 'day')} chosen: ${[...c.value].sort().map(P.dayShort).join(', ')}.` : 'No day chosen yet. Click each day of the conference.';
  return c.value[0] ? `Chosen: ${P.fmtDate(c.value[0])}.` : 'No date chosen yet.';
}
function calGrid(c) {
  const sel = new Set(c.value), ok = c.allowed ? new Set(c.allowed) : null, marks = c.marks || {}, today = isoD(new Date());
  const list = ok ? [...ok].sort() : [];
  let ym = P.ui['cal.' + c.id] || (c.value[0] || list[0] || today).slice(0, 7), start, rows, title, nav = true;
  if (c.span && list.length) {
    start = addD(list[0], -monIdx(list[0]));
    const end = addD(list[list.length - 1], 6 - monIdx(list[list.length - 1])), n = Math.round((parseD(end) - parseD(start)) / DAY_MS) + 1;
    if (n / 7 <= 6) { rows = n / 7; nav = false; title = P.datesText(list); }
  }
  if (nav) {
    const first = ym + '-01', dim = new Date(Date.UTC(+ym.slice(0, 4), +ym.slice(5), 0)).getUTCDate();
    start = addD(first, -monIdx(first)); rows = Math.ceil((monIdx(first) + dim) / 7); title = `${MONTHS[+ym.slice(5) - 1]} ${ym.slice(0, 4)}`;
  }
  const cells = Array.from({ length: rows * 7 }, (_, i) => addD(start, i)).map(d => ({ d, show: !nav || d.startsWith(ym) }));
  const shown = cells.filter(x => x.show).map(x => x.d);
  const tab = shown.find(d => sel.has(d)) || shown.find(d => !ok || ok.has(d)) || shown[0];          // the one day Tab stops on
  const cell = ({ d, show }, i) => {
    if (!show) return html`<div role="gridcell" class="cal-blank" aria-hidden="true"></div>`;
    const off = ok && !ok.has(d), on = sel.has(d), n = marks[d] || 0, num = +d.slice(8);
    const label = [P.fmtDate(d), n && `${plural(n, c.noun || 'event')} planned`, off && 'not available', on && 'selected'].filter(Boolean).join(', ');
    return html`<div role="gridcell"><button type="button" class="cal-day${on ? ' is-sel' : ''}${off ? ' is-off' : ''}${n ? ' has-n' : ''}${d === today ? ' is-today' : ''}" data-act="calday" data-cal="${c.id}" data-date="${d}"
      tabindex="${d === tab ? 0 : -1}" aria-pressed="${String(on)}" ${raw(off ? 'aria-disabled="true"' : '')} aria-label="${label}"><span class="cal-num">${num}</span>${!nav && (num === 1 || i === 0) ? html`<span class="cal-mon" aria-hidden="true">${MONTHS[+d.slice(5, 7) - 1].slice(0, 3)}</span>` : ''}${n ? html`<span class="cal-n" aria-hidden="true">${n}</span>` : ''}</button></div>`;
  };
  const rowsHTML = Array.from({ length: rows }, (_, r) => html`<div role="row" class="cal-row">${cells.slice(r * 7, r * 7 + 7).map((x, i) => cell(x, r * 7 + i))}</div>`);
  return html`<div class="cal-head">${nav ? html`<button type="button" class="btn btn-secondary cal-nav" data-act="calnav" data-cal="${c.id}" data-dir="-1" aria-label="Previous month">‹</button>` : ''}
      <strong class="cal-title" id="cal-t-${c.id}" aria-live="polite">${title}</strong>
      ${nav ? html`<button type="button" class="btn btn-secondary cal-nav" data-act="calnav" data-cal="${c.id}" data-dir="1" aria-label="Next month">›</button>` : ''}</div>
    <div class="cal-grid" role="grid" aria-labelledby="cal-t-${c.id}"><div role="row" class="cal-row cal-dow">${WEEKDAYS.slice(1).concat(WEEKDAYS[0]).map(w => html`<span role="columnheader" aria-label="${w}">${w.slice(0, 3)}</span>`)}</div>${rowsHTML}</div>`;
}
function calRoot(c) {
  const legend = (c.allowed || c.marks) ? html`<ul class="cal-legend" aria-label="What the days look like">
      <li><span class="cal-key is-sel" aria-hidden="true">✔</span> Chosen day</li>${c.allowed ? html`<li><span class="cal-key" aria-hidden="true"></span> Conference day</li><li><span class="cal-key is-off" aria-hidden="true"></span> Not a conference day</li>` : ''}
      ${c.marks ? html`<li><span class="cal-key has-n" aria-hidden="true"><span class="cal-n">3</span></span> Number of ${c.noun || 'event'}s planned</li>` : ''}</ul>` : '';
  const body = html`<div class="cal" aria-label="${c.label || 'Calendar'}" role="group">${calGrid(c)}<p class="cal-status" role="status">${c.msg || calSummary(c)}</p>${legend}</div>${c.name ? html`<input type="hidden" name="${c.name}" value="${c.value.join(',')}">` : ''}`;
  const sum = c.multi ? 'Show the calendar' : c.value[0] ? `${P.fmtDate(c.value[0])} (click to change)` : 'Choose a date';
  return html`<div class="cal-root" data-cal-root="${c.id}">${c.pop ? html`<details class="cal-pop" ${raw(c.open ? 'open' : '')}><summary class="btn btn-secondary">${sum}</summary>${body}</details>` : body}</div>`;
}
P.cal = c => { CALS[c.id] = { value: [], ...c }; return calRoot(CALS[c.id]); };
/* the form-field version (core.js calls this for type: 'calendar') */
P.calField = (f, v, id) => P.cal({ id, name: f.name, label: f.label, value: (Array.isArray(v) ? v : String(v || '').split(',')).filter(Boolean), multi: !!f.multi, pop: !f.multi, allowed: f.allowed, marks: f.marks, noun: f.noun });

const calRoute = id => document.querySelector(`[data-cal-root="${CSS.escape(id)}"]`);
function calDraw(id, focus) {
  const old = calRoute(id); if (!old) return;
  const t = document.createElement('div'); t.innerHTML = calRoot(CALS[id]).s; old.replaceWith(t.firstElementChild);
  if (focus) calRoute(id)?.querySelector(focus)?.focus();
}
const calFocus = (id, d) => {
  const b = calRoute(id)?.querySelector(`.cal-day[data-date="${d}"]`); if (!b) return false;
  calRoute(id).querySelectorAll('.cal-day').forEach(x => { x.tabIndex = -1; }); b.tabIndex = 0; b.focus(); return true;
};
Object.assign(P.act, {
  calday(el, e) {
    const c = CALS[el.dataset.cal], d = el.dataset.date;
    if (el.getAttribute('aria-disabled') === 'true') {
      el.closest('.cal').querySelector('.cal-status').textContent = `${P.fmtDate(d, false)} is not a conference day. Please choose one of the days with a solid border.`; return;
    }
    if (c.pick) return P.act[c.pick](el, e);
    c.value = c.multi ? (c.value.includes(d) ? c.value.filter(x => x !== d) : [...c.value, d].sort()) : [d];
    if (c.multi) P.ui['cal.' + c.id] = d.slice(0, 7); else delete P.ui['cal.' + c.id];   // keep the month on screen when a form is redrawn after a mistake
    c.msg = c.multi ? `${P.fmtDate(d, false)} ${c.value.includes(d) ? 'added' : 'removed'}. ${calSummary(c)}` : '';
    c.open = false; calDraw(c.id, c.pop ? 'summary' : `.cal-day[data-date="${d}"]`);
    if (c.msg) $('#live').textContent = c.msg;
  },
  calnav(el) {
    const c = CALS[el.dataset.cal], ym = addMonth(P.ui['cal.' + c.id] || (c.value[0] || (c.allowed || [])[0] || isoD(new Date())).slice(0, 7), +el.dataset.dir);
    P.ui['cal.' + c.id] = ym; c.open = true; c.msg = ''; calDraw(c.id, `.cal-nav[data-dir="${el.dataset.dir}"]`);
  },
});
document.addEventListener('keydown', e => {
  const b = e.target.closest && e.target.closest('.cal-day'); if (!b) return;
  const d = b.dataset.date, id = b.dataset.cal;
  const to = { ArrowLeft: addD(d, -1), ArrowRight: addD(d, 1), ArrowUp: addD(d, -7), ArrowDown: addD(d, 7), Home: addD(d, -monIdx(d)), End: addD(d, 6 - monIdx(d)),
    PageUp: addMonth(d.slice(0, 7), -1) + '-' + d.slice(8), PageDown: addMonth(d.slice(0, 7), 1) + '-' + d.slice(8) }[e.key];
  if (!to) return;
  e.preventDefault();
  if (!P.isDate(to)) return;                                                 // e.g. 31 Jan + 1 month: stay where we are
  if (!calFocus(id, to) && !CALS[id].span) { P.ui['cal.' + id] = to.slice(0, 7); CALS[id].open = true; calDraw(id); calFocus(id, to); }
});

/* ---------- the time picker: two boxes, hour and minutes, always 24-hour (same as the schedule shows) ---------- */
P.timeField = (f, v, id) => {
  const [h = '', m = ''] = String(v || '').split(':');
  const pad = n => String(n).padStart(2, '0'), hours = Array.from({ length: 24 }, (_, i) => pad(i)), mins = Array.from({ length: 12 }, (_, i) => pad(i * 5));
  if (m && !mins.includes(m)) mins.push(m), mins.sort();
  const sel = (part, list, cur, what) => html`<select id="${id}-${part}" name="${f.name}-${part}" aria-label="${f.label}: ${what}" ${raw(f.disabled ? 'disabled' : '')}>
    ${[['', '--'], ...list.map(x => [x, x])].map(([x, l]) => html`<option value="${x}" ${raw(x === cur ? 'selected' : '')}>${l}</option>`)}</select>`;
  return html`<div class="time-pick">${sel('h', hours, h, 'hour')}<span aria-hidden="true">:</span>${sel('m', mins, m, 'minutes')}<span class="muted">(24-hour clock, for example 14:30)</span></div>`;
};
P.readTime = (fd, name) => { const h = fd.get(name + '-h') ?? '', m = fd.get(name + '-m') ?? ''; return h === '' && m === '' ? '' : `${h}:${m}`; };
})();

/* MIRC prototype: conference editions (MIRC 2026, 2027, 2028 ...) in one reusable site.
   An edition is one record in ED.list (see core.js). It owns its own dates, venue, schedule, pages, rooms, topics, email templates,
   papers, registrations and news, so changing one edition cannot change another. Only user accounts are shared.
   This file holds: how a new edition is made from an old one (the "yearly rollover" of blueprint 15.5), the publish checks,
   and the admin pages for editions, edition details and registration settings. Blueprint: 7.1 (conference.edition_year), 15.5, 17.3 D1. */
'use strict';
(() => {   // own scope: these helper names must not clash with the other scripts' top-level names

/* ---------- making an edition ---------- */
const cp = x => structuredClone(x);
/* Copies the SET-UP of an existing edition (pages, rooms, topics, email templates, settings) and starts everything else empty:
   no papers, people, schedule or news, and no dates. Page texts are copied only if asked, because they usually mention last year's dates. */
P.newEdition = ({ from, year, copyTexts = false }) => {
  const src = P.edition(from), y = Number(year), old = String(src.conf.year), swap = t => String(t ?? '').replaceAll(old, String(y));
  return {
    conf: { ...cp(src.conf), id: 'mirc' + y, year: y, status: 'draft', name: swap(src.conf.name), days: [], submission: { open: '', close: '' }, registrationDeadline: '', banner: '' },
    topics: cp(src.topics), rooms: cp(src.rooms), files: cp(src.files).filter(f => !f.logo),   // each edition brings its own logo
    templates: src.templates.map(t => ({ ...cp(t), subject: swap(t.subject), originalSubject: swap(t.originalSubject) })),
    pages: src.pages.map(p => ({ ...cp(p), body: copyTexts ? p.body : '' })),
    settings: { ...cp(src.settings), registrationOpen: false, submissionOpen: false, logo: null, logoPending: null, themePending: null, themeHistory: [], header: { ...cp(src.settings.header), title: swap(src.settings.header.title) } },
    aliases: src.aliases.map(a => ({ ...a, name: swap(a.name) })), mailLook: { ...cp(src.mailLook), header: swap(src.mailLook.header) },
    papers: [], registrations: [], reviewers: [], events: [], homeBlocks: [], news: [], lists: [], mailLog: [], rightsGroups: { ...cp(src.rightsGroups), Reviewer: 0 },
  };
};
/* A second edition, so the prototype shows the idea. It is a DRAFT made with the same function the admin button uses. All of it is sample data. */
(() => {
  const e = P.newEdition({ from: 'mirc2026', year: 2027 }), ev = (id, type, date, start, end, o) => ({ id, type, date, start, end, title: '', topic: '', chair: '', room: '', description: '', breakType: '', file: '', comms: [], ...o });
  Object.assign(e.conf, { place: 'City to be announced (sample)', venue: 'Venue to be announced (sample)', tagline: 'Theme to be announced (sample)', sub: '',
    days: ['2027-09-30', '2027-10-01', '2027-10-02'], submission: { open: '2027-04-01', close: '2027-07-15' }, registrationDeadline: '2027-08-31' });
  e.events.push(ev('e1', 'Logistics', '2027-09-30', '08:00', '17:00', { title: 'Registration' }), ev('e2', 'Speech/Intervention', '2027-09-30', '09:00', '09:30', { title: 'Opening Ceremony (sample)', room: 'rm1' }));
  ED.list.push(e);
})();

/* ---------- ready to publish? ---------- */
P.readiness = e => {
  const c = e.conf, stop = [], note = [];
  if (!c.name.trim()) stop.push('The edition has no name.');
  if (!c.days.length) stop.push('No conference days are chosen yet (Edition details, “Dates and deadlines”).');
  if (c.days.length && !e.events.length) note.push('The schedule is empty, so visitors will see “Nothing is planned”.');
  if (!c.submission.open || !c.submission.close) note.push('The abstract submission dates are not set.');
  if (!c.registrationDeadline) note.push('The registration deadline is not set.');
  if (!e.settings.logo) note.push('No logo has been uploaded yet (Conference, Logo).');
  if (/\(sample\)|to be announced/i.test(c.venue + c.tagline + c.place)) note.push('The place, venue or theme still says “to be announced”.');
  const empty = e.pages.filter(p => p.kind === 'text' && !p.body).length;
  if (empty) note.push(`${empty} text page${empty > 1 ? 's have' : ' has'} no text yet.`);
  return { stop, note };
};
const stat = e => e.conf.status === 'published' ? 'Published' : 'Draft';
const counts = e => `${e.papers.length} papers, ${e.registrations.length} registrations, ${e.events.length} events`;
const uses = (e, topic) => e.papers.filter(p => p.topic === topic).length + e.events.filter(x => x.topic === topic).length + e.reviewers.filter(r => r.topics.includes(topic)).length;

/* ================= Conference › Editions ================= */
P.defForm('ed-new', {
  submit: 'Create the edition',
  fields: () => [{ name: 'year', label: 'Year of the new edition', type: 'number', required: true, min: 2000, hint: 'For example 2028. It cannot be changed later.' },
    { name: 'from', label: 'Copy the set-up from', type: 'select', required: true, options: ED.list.map(e => ({ v: e.conf.id, l: `MIRC ${e.conf.year}` })), value: ED.cur,
      hint: 'Copies pages, rooms, topics and email templates. It never copies papers, people, the schedule or news.' },
    { name: 'copyTexts', label: 'Page texts', type: 'checks', options: [{ v: 'yes', l: 'Also copy the page texts (you must then update the old dates and names)' }] }],
  check: v => (!Number.isInteger(+v.year) || +v.year > 2100) ? { year: 'Please type a year between 2000 and 2100, for example 2028.' } : ED.list.some(e => e.conf.year === +v.year) ? { year: `MIRC ${v.year} already exists. Choose another year.` } : {},
});
P.add({
  path: '/admin/editions', area: 'admin', group: 'Conference', nav: true, label: 'Editions (years)', title: 'Conference editions: one site, many years',
  blurb: 'Create next year’s conference, switch between years, publish or hide one.',
  ref: '7.1 conference(edition_year); 15.5 yearly edition rollover (clone pages, topics, types, rooms, templates; reset dates); 17.3 D1',
  note: 'Works on sample data: create, switch, publish, unpublish and delete editions, and preview a draft. Each edition keeps its own data. Nothing survives a reload. The real site needs a database with a conference id on every table (7.1) and the Administrator role check on Publish. “Archived (read-only)” from 15.5 is not built.',
  view: () => html`<p class="lead">Every conference year is one “edition”. All editions use the same website. Each has its own dates, schedule, pages, papers and people, so working on one never changes another.</p>
    <div class="actions"><button type="button" class="btn btn-primary" data-act="ednew">Create a new edition</button></div>
    ${P.table({ caption: 'Conference editions', empty: 'No edition yet.', rows: ED.list, cols: [
      { h: 'Edition', v: e => html`${P.logoHTML(e.settings.logo, 'sm', true)}<br><strong>MIRC ${e.conf.year}</strong>${e.conf.id === ED.cur ? html` <span class="muted">(you are working on this one)</span>` : ''}<br><span class="muted">${P.datesText(e.conf.days)}</span><br><span class="muted">${counts(e)} (sample)</span>` },
      { h: 'Status', v: e => html`${P.badge(stat(e))}<br><span class="muted">${e.conf.status === 'published' ? 'Visitors can see it.' : 'Only the team can see it.'}</span><br><a href="#/site?ed=${e.conf.id}">Link for visitors</a>${e.conf.status === 'draft' ? html` <span class="muted">(works once published)</span>` : ''}` },
      { h: 'Actions', v: e => html`${e.conf.id === ED.cur ? '' : html`<button type="button" class="btn btn-small" data-act="edwork" data-id="${e.conf.id}" aria-label="Work on MIRC ${e.conf.year}">Work on it</button>`}
        <button type="button" class="btn btn-small btn-secondary" data-act="edpreview" data-id="${e.conf.id}" aria-label="Preview MIRC ${e.conf.year} as visitors see it">Preview</button>
        ${e.conf.status === 'draft' ? html`<button type="button" class="btn btn-small btn-gold" data-act="edpublish" data-id="${e.conf.id}" aria-label="Publish MIRC ${e.conf.year}">Publish</button><button type="button" class="btn btn-small btn-secondary" data-act="eddel" data-id="${e.conf.id}" aria-label="Delete the draft MIRC ${e.conf.year}">Delete</button>`
          : html`<button type="button" class="btn btn-small btn-secondary" data-act="edhide" data-id="${e.conf.id}" aria-label="Hide MIRC ${e.conf.year} from visitors">Hide</button>`}` }] })}
    <p class="muted">On the real site only the Administrator role may publish or hide an edition. This prototype has no sign-in, so every button works.</p>`,
});
Object.assign(P.act, {
  async ednew() {
    const v = await P.form({ title: 'Create a new edition', intro: 'The new edition starts as a draft that visitors cannot see.', fields: P.formDefs['ed-new'].fields(), submit: 'Create the edition', check: P.formDefs['ed-new'].check });
    if (!v) return;
    const e = P.newEdition({ from: v.from, year: v.year, copyTexts: v.copyTexts.includes('yes') });
    ED.list.push(e); ED.list.sort((a, b) => a.conf.year - b.conf.year); P.useEdition(e.conf.id);
    P.goSay('/admin/edition', 'ok', `MIRC ${e.conf.year} was created as a draft, copied from the set-up of MIRC ${P.edition(v.from).conf.year}. Next: choose the conference days under “Dates and deadlines”.`);
  },
  edwork(el) { P.useEdition(el.dataset.id); P.refresh(); P.say('info', `You are now working on MIRC ${S.conf.year}. Every page in the menu now shows this edition only.`); },
  edpreview(el) {
    P.useEdition(el.dataset.id);
    if (!['Webmaster', 'Administrator'].includes(u('site.role', 'Guest'))) P.ui['site.role'] = 'Webmaster';   // only the team may open a draft (Webmaster can also read every public page)
    P.go('/site');
  },
  async edpublish(el) {
    const e = P.edition(el.dataset.id), r = P.readiness(e);
    if (r.stop.length) return P.show(`MIRC ${e.conf.year} cannot be published yet`, html`<p>Please fix this first:</p><ul>${r.stop.map(x => html`<li>${x}</li>`)}</ul>`);
    if (!await P.confirm({ title: `Publish MIRC ${e.conf.year}?`, ok: 'Yes, publish it', text: html`Visitors will be able to see it at once.${r.note.length ? html` <strong>Still to do (you can publish anyway):</strong><ul>${r.note.map(x => html`<li>${x}</li>`)}</ul>` : ' Everything looks ready.'}` })) return;
    e.conf.status = 'published'; P.refresh(); P.say('ok', `MIRC ${e.conf.year} is now published. In this prototype that means visitors who choose “Guest” can see it.`);
  },
  async edhide(el) {
    const e = P.edition(el.dataset.id), only = ED.list.filter(x => x.conf.status === 'published').length < 2;
    if (!await P.confirm(only ? { title: 'This is the only published edition', ok: 'Yes, hide it anyway', danger: true, text: 'Visitors will see no conference at all until another edition is published.' }
      : { title: `Hide MIRC ${e.conf.year} from visitors?`, ok: 'Yes, hide it', text: 'It goes back to draft. Nothing is deleted.' })) return;
    e.conf.status = 'draft'; P.refresh(); P.say('ok', `MIRC ${e.conf.year} is a draft again. Nothing was deleted.`);
  },
  async eddel(el) {
    const e = P.edition(el.dataset.id);
    if (ED.list.length < 2) return P.show('The last edition cannot be deleted', html`<p>At least one edition must remain.</p>`);
    if (!await P.confirm({ title: `Delete the draft MIRC ${e.conf.year}?`, danger: true, ok: 'Yes, delete it', text: `Its schedule, pages, rooms and ${e.papers.length} papers will be removed. Other editions are not touched. This cannot be undone in this prototype.` })) return;
    const was = ED.cur === e.conf.id; ED.list = ED.list.filter(x => x !== e);
    if (was) { ED.cur = ED.list[0].conf.id; P.sel = {}; P.fe = {}; P.ui = { 'site.role': P.ui['site.role'] }; }
    P.refresh(); P.say('ok', `The draft MIRC ${e.conf.year} was deleted.${was ? ` You are now working on MIRC ${S.conf.year}.` : ''}`);
  },
});

/* ================= Conference › Edition details ================= */
const stranded = (removed) => removed.map(d => [d, S.events.filter(e => e.date === d).length]).filter(x => x[1]);
P.defForm('ed-name', {
  fields: () => [{ name: 'name', label: 'Full name of the conference', required: true }, { name: 'tagline', label: 'Theme (the big line on the home page)' }, { name: 'sub', label: 'Sub-line under the theme' },
    { name: 'place', label: 'City and country', required: true }, { name: 'venue', label: 'Venue (university or building)' }],
  run: v => { Object.assign(S.conf, v); P.say('ok', 'The name, theme and place were saved. The public header title is set separately under “Site settings”, “Header”.'); P.refresh(); },
});
P.defForm('ed-dates', {
  fields: () => {
    const marks = {}; S.events.forEach(e => { marks[e.date] = (marks[e.date] || 0) + 1; });
    return [{ name: 'days', label: 'Conference days', type: 'calendar', multi: true, required: true, marks, noun: 'event', hint: 'Click every day of the conference, including a sub-conference or a free day. Click a chosen day again to remove it. The arrows move to other months.' },
      { name: 'subOpen', label: 'Abstract submission opens', type: 'calendar' }, { name: 'subClose', label: 'Abstract submission closes', type: 'calendar' },
      { name: 'submissionOpen', label: 'Is the abstract form open for visitors right now?', type: 'radio', options: [{ v: 'yes', l: 'Yes, open' }, { v: 'no', l: 'No, closed' }] },
      { name: 'regDeadline', label: 'Registration deadline', type: 'calendar' },
      { name: 'registrationOpen', label: 'Is registration open for visitors right now?', type: 'radio', options: [{ v: 'yes', l: 'Yes, open' }, { v: 'no', l: 'No, closed' }] }];
  },
  check: v => {
    const e = {}, days = v.days ? v.days.split(',').sort() : [], first = days[0], last = days[days.length - 1];
    const gone = stranded((S.conf.days || []).filter(d => !days.includes(d)));
    if (gone.length) e.days = `The schedule still has events on ${gone.map(([d, n]) => `${P.fmtDate(d, false)} (${n})`).join(', ')}. Move or delete them under Program, “Schedule” first, or keep those days.`;
    if (v.subOpen && !v.subClose) e.subClose = 'Please also choose the day the submission closes.';
    else if (!v.subOpen && v.subClose) e.subOpen = 'Please also choose the day the submission opens.';
    else if (v.subOpen && v.subClose && v.subClose <= v.subOpen) e.subClose = 'The closing day must come after the opening day.';
    else if (v.subClose && first && v.subClose >= first) e.subClose = `Submission should close before the conference starts (${P.fmtDate(first, false)}).`;
    if (v.regDeadline && last && v.regDeadline > last) e.regDeadline = `The registration deadline cannot be after the last conference day (${P.fmtDate(last, false)}).`;
    return e;
  },
  run: v => {
    S.conf.days = v.days.split(',').sort(); S.conf.submission = { open: v.subOpen, close: v.subClose }; S.conf.registrationDeadline = v.regDeadline;
    S.settings.submissionOpen = v.submissionOpen === 'yes'; S.settings.registrationOpen = v.registrationOpen === 'yes';
    P.say('ok', `The dates were saved: ${P.datesText(S.conf.days)}.${S.conf.status === 'published' ? ' Visitors see them at once.' : ''}`); P.refresh();
  },
});
P.defForm('ed-topics', {
  fields: () => [{ name: 'topics', label: 'Topics of the conference', type: 'textarea', rows: 10, required: true, hint: 'One topic per line. Papers, sessions and reviewers use these names, so a topic that is in use cannot be removed or renamed here.' }],
  check: v => {
    const lines = v.topics.split('\n').map(x => x.trim()).filter(Boolean), dup = lines.find((x, i) => lines.findIndex(y => y.toLowerCase() === x.toLowerCase()) !== i), used = S.topics.filter(t => !lines.includes(t) && uses(P.edition(), t));
    if (!lines.length) return { topics: 'Please type at least one topic.' };
    if (dup) return { topics: `“${dup}” appears twice.` };
    if (used.length) return { topics: `These topics are still in use, so they must stay as they are: ${used.map(t => `“${t}” (${uses(P.edition(), t)})`).join(', ')}.` };
    return {};
  },
  run: v => { S.topics = v.topics.split('\n').map(x => x.trim()).filter(Boolean); P.say('ok', `${S.topics.length} topics saved.`); P.refresh(); },
});
P.add({
  path: '/admin/edition', area: 'admin', group: 'Conference', nav: true, label: 'Edition details', title: 'Edition details: name, dates and topics',
  blurb: 'Name, theme, place, conference days, deadlines and topics of this edition.',
  ref: '7.1 conference(title, subtitle, city, start_date, end_date, submission_*_at); 3.2 Website > General; 17.3 D1',
  note: 'Works on the sample data of the edition you are working on. Conference days come from the calendar and drive the Schedule, the public program and the dates shown on the website. The real site also stores review open/close dates (7.1); the review rules are undecided (D12), so they are not asked here.',
  view: () => {
    const tab = u('ed.tab', 'name'), c = S.conf;
    const v = tab === 'name' ? c : { days: c.days, subOpen: c.submission.open, subClose: c.submission.close, regDeadline: c.registrationDeadline,
      submissionOpen: S.settings.submissionOpen ? 'yes' : 'no', registrationOpen: S.settings.registrationOpen ? 'yes' : 'no' };
    return html`<p class="lead">You are editing <strong>MIRC ${c.year}</strong> ${P.badge(stat(P.edition()))}. The year cannot be changed after the edition was created.</p>
      ${c.status === 'published' ? html`<div class="alert alert-warn"><span class="sym" aria-hidden="true">!</span><div><strong>Please note.</strong> This edition is published. What you save here is visible to visitors at once. To prepare changes in private, hide the edition first under “Editions (years)”, or work on a draft edition.</div></div>` : ''}
      ${P.tabs('ed.tab', [['name', 'Name, theme and place'], ['dates', 'Dates and deadlines'], ['topics', 'Topics']], 'Edition sections', tab)}
      <section class="card">${tab === 'name' ? html`<h2>Name, theme and place</h2>${P.formHTML('ed-name', v)}`
        : tab === 'dates' ? html`<h2>Dates and deadlines</h2><p>These dates are used by the Schedule, the public program and the dates shown on the website. Clicking a date folds the small calendar away again.</p>${P.formHTML('ed-dates', v)}`
          : html`<h2>Topics</h2>${P.formHTML('ed-topics', { topics: S.topics.join('\n') })}`}</section>`;
  },
});

/* ================= Attendees › Registration settings ================= */
const LEVELS = [{ v: 'off', l: 'Do not ask' }, { v: 'optional', l: 'Ask (may be left empty)' }, { v: 'required', l: 'Ask (must be filled in)' }];
P.defForm('reg-settings', {
  fields: () => C.REG_OPTIONAL.map(([k, l]) => ({ name: k, label: l, type: 'select', options: LEVELS })),
  run: v => { S.settings.regFields = v; P.say('ok', 'Saved. Open the public registration page to see the form.'); P.refresh(); },
});
P.add({
  path: '/admin/registration-settings', area: 'admin', group: 'Attendees', nav: true, label: 'Registration form', title: 'Registration form: what to ask visitors',
  blurb: 'Choose which details the public registration form asks for.',
  ref: '3.6 Registration management; 2.5 Registration form fields (saved recap); 7.1 registration.extra; fees and options are undecided (D5)',
  note: 'Changes the public registration form of this edition. First name, last name and email are always asked. Fees, payment options and extra choices are not built because the blueprint leaves them undecided (D5).',
  view: () => html`<p class="lead">First name, last name and email address are always asked. For each other detail, choose whether the public registration form of <strong>MIRC ${S.conf.year}</strong> asks for it.</p>
    <p>Registration is ${S.settings.registrationOpen ? html`<strong>open</strong>` : html`<strong>closed</strong>`} for this edition. Change this, and the deadline, under <a href="#/admin/edition">Edition details</a>, “Dates and deadlines”.</p>
    <section class="card"><h2>Details to ask</h2>${P.formHTML('reg-settings', S.settings.regFields)}</section>
    <p><a href="#/site/registration">See the public registration page</a></p>`,
});
})();

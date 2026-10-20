/* Conference prototype: conference builder (Conference > My conferences). Lets an administrator create, change and delete conferences of their own
   (name, short name, first year and dates, place, theme, description, two brand colors) without editing code.
   A created conference becomes an entry in CONFERENCES (same shape as the ones in conferences.js, made by customEntry()), gets its first edition from
   P.seedConference(), and so appears in the Conference and Year boxes and everywhere else exactly like MIRC and PANTAS.
   What is SAVED (in this browser, localStorage) is the definition only. Editions are rebuilt from it at every start; what you later change inside an edition
   (pages, schedule, papers ...) lives in the tab like all other sample data. Blueprint: not covered (it describes MIRC 2026 only); builds on 7.1 and 15.5. */
'use strict';
(() => {
const LOW = s => String(s).trim().replace(/\s+/g, ' ').toLowerCase(), CODE = /^[A-Za-z][A-Za-z0-9]{1,11}$/;
const persist = () => {
  try { localStorage.setItem(CUSTOM_KEY, JSON.stringify(Object.fromEntries(Object.entries(CONFERENCES).filter(([, c]) => c.custom).map(([k, c]) => [k, c.custom])))); return true; }
  catch { return false; }   // storage blocked (private window, site data switched off)
};
const done = (path, text, ok) => P.goSay(path, ok ? 'ok' : 'warn', ok ? text : text + ' It could not be saved in this browser (storage is blocked), so it will be gone when you reload.', ok);
const YESNO = [{ v: 'yes', l: 'Yes, show it on the public website now' }, { v: 'no', l: 'No, keep it as a draft that only the team can see' }];

const fields = edit => [
  { name: 'name', label: 'Full name of the conference', required: true, hint: 'For example “Asia Pacific Education Forum”. The year is added by the site (“Asia Pacific Education Forum 2027”).' },
  { name: 'code', label: 'Short name (acronym)', required: true, hint: '2 to 12 letters or digits, starting with a letter, no spaces. For example APEF. It is shown in menus, page titles, email subjects and on the logo.' },
  ...(edit ? [] : [
    { name: 'year', label: 'Year of the first edition', type: 'number', required: true, min: 2000, hint: 'For example 2027. It cannot be changed later; more years are added under Conference, “Editions (years)”.' },
    { name: 'start', label: 'First day', type: 'date', required: true, row: true, hint: 'Type the date or use the small calendar button of your browser.' },
    { name: 'end', label: 'Last day', type: 'date', row: true, hint: 'Leave empty for a one-day conference (at most 31 days).' }]),
  { name: 'place', label: 'City and country', required: true },
  { name: 'venue', label: 'Venue (university or building)' },
  { name: 'tagline', label: 'Theme (the big line on the home page)' },
  { name: 'sub', label: 'Sub-line under the theme' },
  { name: 'description', label: 'Description of the conference', type: 'textarea', rows: 5, hint: 'Shown on the home page under “About the conference”. A blank line starts a new paragraph.' },
  { name: 'primary', label: 'Main brand color', type: 'color', hint: 'Used for headings, buttons, the logo and the dark bars. The other colors of the website are worked out from it. Choose a dark or medium color; very light colors are refused because the text would be hard to read.' },
  { name: 'accent', label: 'Accent color', type: 'color', hint: 'Used for thin lines, highlights and the year on the logo.' },
  ...(edit ? [] : [{ name: 'published', label: 'Show the first edition to visitors?', type: 'radio', options: YESNO, hint: 'Only possible with dates, which are required here. You can hide or publish it later under “Editions (years)”.' }]),
];
const check = edit => v => {
  const e = {}, self = edit ? P.cur.params.key : null, others = Object.entries(CONFERENCES).filter(([k]) => k !== self);
  // empty boxes are reported by the form itself ("Please fill in this box"); the rules below only judge what was typed
  if (v.name && (v.name.length < 3 || v.name.length > 80)) e.name = 'Please use between 3 and 80 characters.';
  else if (v.name && others.some(([, c]) => LOW(c.name) === LOW(v.name))) e.name = `A conference called “${v.name}” already exists. Choose another name.`;
  if (v.code && !CODE.test(v.code)) e.code = 'Please use 2 to 12 letters or digits, starting with a letter, with no spaces or other signs.';
  else if (v.code && others.some(([k, c]) => LOW(c.code) === LOW(v.code) || (!edit && k === LOW(v.code)))) e.code = `The short name “${v.code.toUpperCase()}” is already used by another conference. Choose another.`;
  for (const f of ['place', 'venue', 'tagline', 'sub']) if (v[f].length > 120) e[f] = 'Please use at most 120 characters.';
  if (v.description.length > 2000) e.description = 'Please use at most 2000 characters.';
  if (!edit) {
    if (!Number.isInteger(+v.year) || +v.year < 2000 || +v.year > 2100) e.year = 'Please type a year between 2000 and 2100, for example 2027.';
    if (v.start && !P.isDate(v.start)) e.start = 'Please give the first day as a date.';
    if (v.end && !P.isDate(v.end)) e.end = 'Please give the last day as a date, or leave it empty.';
    else if (v.end && P.isDate(v.start) && v.end < v.start) e.end = 'The last day cannot be before the first day.';
    else if (v.end && P.isDate(v.start) && (Date.parse(v.end) - Date.parse(v.start)) / 864e5 > 30) e.end = 'A conference can last at most 31 days here.';
    if (!e.year && P.isDate(v.start) && !v.start.startsWith(String(+v.year))) e.start = `The first day should be in ${+v.year}, the year of the first edition.`;
  }
  const bad = P.theme.checks(brandTheme(v.primary, v.accent)).filter(c => !c.ok);
  if (bad.length) e.primary = `With these colors some text would be hard to read (${bad.slice(0, 3).map(c => c.label.toLowerCase()).join('; ')}${bad.length > 3 ? '; and more' : ''}). Choose a darker main color, or a lighter or darker accent.`;
  return e;
};

/* ---------- create ---------- */
P.defForm('conf-new', {
  submit: 'Create the conference', cancel: '#/admin/my-conferences', fields: () => fields(false), check: check(false),
  run: v => {
    const key = v.code.toLowerCase(), entry = customEntry({ ...v, year: +v.year, published: v.published === 'yes' });
    if (!entry) return;
    CONFERENCES[key] = entry;
    const e = P.seedConference(key); ED.list.sort(P.byConf); P.useEdition(e.conf.id);
    done('/admin/my-conferences', `${entry.code} was created, with its first edition ${P.tag(e)} (${e.conf.status === 'published' ? 'published' : 'draft'}). It is now in the Conference and Year boxes and you are working on it. Next: choose the pages, topics and logo under the Conference menu.`, persist());
  },
});
/* ---------- change ---------- */
P.defForm('conf-edit', {
  submit: 'Save the changes', cancel: '#/admin/my-conferences', fields: () => fields(true), check: check(true),
  run: v => {
    const k = P.cur.params.key, c = CONFERENCES[k], old = c.code;
    Object.assign(c, customEntry({ ...c.custom, ...v }));
    for (const e of ED.list.filter(x => x.conf.series === k)) {   // the short name is used live everywhere; the copies written into email texts are updated here
      const sw = t => String(t ?? '').replaceAll(`${old} ${e.conf.year}`, `${c.code} ${e.conf.year}`);
      e.templates.forEach(t => { t.subject = sw(t.subject); t.originalSubject = sw(t.originalSubject); }); e.mailLook.header = sw(e.mailLook.header);
    }
    const f = P.edition(k + c.first.year);   // the first edition follows the definition; later editions keep what they were given
    if (f) {
      Object.assign(f.conf, { name: `${c.name} ${f.conf.year}`, place: c.place, venue: c.venue, tagline: c.tagline, sub: c.sub });
      f.settings.theme = { ...c.theme }; f.settings.header.title = f.conf.name;
      if (f.settings.logo?.sample) f.settings.logo = sampleLogo(k, f.conf.year);   // a logo that was uploaded is never replaced
      f.homeBlocks = f.homeBlocks.filter(b => b.id !== 'h1'); if (c.description) f.homeBlocks.unshift({ id: 'h1', title: 'About the conference', body: c.description });
    }
    done('/admin/my-conferences', `${c.code} was changed.${f ? ` ${P.tag(f)} now shows the new name, texts, colors and description.` : ''}`, persist());
  },
});

/* ---------- pages ---------- */
P.add({
  path: '/admin/my-conferences', area: 'admin', group: 'Conference', nav: true, label: 'My conferences', title: 'My conferences: create your own',
  blurb: 'Create a conference of your own, change it, or delete it. It then works like the built-in ones.',
  ref: 'Not in the blueprint (it describes MIRC 2026 only). Builds on 7.1 conference(edition_year) and 15.5 yearly rollover; a conference table is the production counterpart',
  note: 'Works on this browser: the definitions you create are saved here and are still there after a reload (“Start over” does not remove them; Delete does). Editions made from them are rebuilt at every start, so what you change inside an edition is lost on reload like all other sample data. Not built: uploading a logo while creating (use Conference, “Logo” afterwards), sharing conferences between computers.',
  view: () => {
    const list = Object.entries(CONFERENCES);
    return html`<p class="lead">A <strong>conference</strong> is a series such as ${list.slice(0, 2).map(([, c]) => c.code).join(' or ')}; each year of it is an <strong>edition</strong>. Create a conference here and it appears in the Conference and Year boxes at the top, with a first edition you can fill in.</p>
      <div class="actions"><button type="button" class="btn btn-primary" data-act="confnew">Create a new conference</button></div>
      ${P.table({ caption: 'Conferences', empty: 'No conference yet.', rows: list, cols: [
        { h: 'Conference', v: ([k, c]) => html`${P.logoHTML(P.edition(k + c.first?.year)?.settings.logo || ED.list.find(e => e.conf.series === k)?.settings.logo, 'sm', true)}<br><strong>${c.code}</strong> ${c.name}` },
        { h: 'Editions', v: ([k]) => ED.list.filter(e => e.conf.series === k).map(e => `${e.conf.year} (${e.conf.status === 'published' ? 'published' : 'draft'})`).join(', ') },
        { h: 'Made', v: ([, c]) => c.custom ? 'Here, by you (saved in this browser)' : html`In <code>conferences.js</code> (built in)` },
        { h: 'Actions', v: ([k, c]) => html`<button type="button" class="btn btn-small" data-act="confopen" data-key="${k}" aria-label="Work on ${c.code}">Work on it</button>${c.custom ? html`
          <button type="button" class="btn btn-small btn-secondary" data-act="confedit" data-key="${k}" aria-label="Change ${c.code}">Change</button><button type="button" class="btn btn-small btn-secondary" data-act="confdel" data-key="${k}" aria-label="Delete ${c.code}">Delete</button>` : ''}` }] })}
      <p class="muted">Conferences that are built in can only be changed in <code>conferences.js</code>. Years of any conference are added under <a href="#/admin/editions">Editions (years)</a>.</p>`;
  },
});
P.add({
  path: '/admin/my-conferences/new', area: 'admin', group: 'Conference', parent: '/admin/my-conferences', title: 'Create a new conference', crumb: 'Create',
  ref: 'Not in the blueprint. See “My conferences”', note: 'The definition is saved in this browser. The first edition is a copy of the set-up (pages, rooms, topics, email templates) of the first edition in the list, with your names, texts, dates, colors and a drawn placeholder logo.',
  view: () => html`<p class="lead">Fill in the details of the first edition. Everything except the short name and the year can be changed later.</p>${P.formHTML('conf-new', { primary: C.THEME_DEFAULT.primary, accent: C.THEME_DEFAULT.accent, year: new Date().getFullYear() + 1, published: 'yes' })}`,
});
P.add({
  path: '/admin/my-conferences/:key', area: 'admin', group: 'Conference', parent: '/admin/my-conferences', title: 'Change a conference', crumb: 'Change',
  ref: 'Not in the blueprint. See “My conferences”', note: 'Saving changes the saved definition and the first edition. Other years of the conference keep their own texts and colors, but show the new short name.',
  view: ({ key }) => {
    const c = CONFERENCES[key];
    if (!c || !c.custom) return html`<p class="lead">This conference was not created here, or it was deleted. Built-in conferences are changed in <code>conferences.js</code>.</p><a class="btn btn-primary" href="#/admin/my-conferences">Back to My conferences</a>`;
    return html`<p class="lead">You are changing <strong>${c.code}</strong>. The year and dates of the first edition are changed under Conference, “Edition details”.</p>
      <div class="alert alert-warn"><span class="sym" aria-hidden="true">!</span><div><strong>Please note.</strong> Saving also replaces the name, texts, colors, description and (if it is still the drawn placeholder) the logo of ${P.tag(P.edition(key + c.first.year) || ED.list.find(e => e.conf.series === key))}, the first edition. Later editions are not changed, except that they show the new short name.</div></div>
      ${P.formHTML('conf-edit', c.custom)}`;
  },
});
Object.assign(P.act, {
  confnew() { P.go('/admin/my-conferences/new'); },
  confedit(el) { P.go('/admin/my-conferences/' + el.dataset.key); },
  confopen(el) { const l = ED.list.filter(e => e.conf.series === el.dataset.key); P.useEdition(l[l.length - 1].conf.id); P.refresh(); P.say('info', `You are now working on ${P.tag()}. Use the Year box to move to another year.`); },
  async confdel(el) {
    const k = el.dataset.key, c = CONFERENCES[k], eds = ED.list.filter(e => e.conf.series === k);
    if (!c || !c.custom) return;
    if (!await P.confirm({ title: `Delete ${c.code}?`, danger: true, ok: 'Yes, delete it', text: `The conference “${c.name}” and its ${eds.length} edition${eds.length > 1 ? 's' : ''} (${eds.map(e => e.conf.year).join(', ')}) will be removed, with their pages, schedule, papers and people lists. Other conferences are not touched. This cannot be undone.` })) return;
    if (eds.some(e => e.conf.id === ED.cur)) P.useEdition(ED.list.find(e => e.conf.series !== k).conf.id);
    ED.list = ED.list.filter(e => e.conf.series !== k); delete CONFERENCES[k];
    P.refresh(); const ok = persist(); P.say(ok ? 'ok' : 'warn', `${c.code} was deleted.${ok ? '' : ' It could not be removed from this browser’s storage (blocked), so it may come back after a reload.'}`, ok);
  },
});
})();

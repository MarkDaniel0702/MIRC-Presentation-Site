/* MIRC prototype: public website preview (blueprint section 2 and 10). Shows the edition chosen in the bar; draft editions are visible only to the team.
   The menu follows the Pages module (admin), so changing a page's rights changes what each "Viewing as" role sees. */
'use strict';

const role = () => u('site.role', 'Guest');
const canSee = p => p.kind === 'folder' || p.consult.includes(role());
const pageOf = kind => S.pages.find(p => p.kind === kind);
const pageTitle = (kind, fallback) => pageOf(kind)?.title || fallback;
const pageHref = p => ({ home: '#/site', program: '#/site/program', participants: '#/site/participants', registration: '#/site/registration', submission: '#/site/submit' })[p.kind] || (p.kind === 'link' ? p.url : '#/site/p/' + p.id);

function siteMenu() {
  const here = (location.hash || '#/site').split('?')[0];
  const link = p => p.kind === 'link'
    ? html`<a href="${p.url}" target="_blank" rel="noopener">${p.title} <span class="sr-only">(opens in a new tab)</span></a>`
    : html`<a href="${pageHref(p)}" ${raw(here === pageHref(p) ? 'aria-current="page"' : '')}>${p.title}</a>`;
  const kids = f => S.pages.filter(c => c.folder === f.id && canSee(c));
  const top = S.pages.filter(p => !p.folder && (p.kind === 'folder' ? kids(p).length : canSee(p)));
  return html`<ul>${top.map(p => p.kind === 'folder'
    ? html`<li><details><summary>${p.title}</summary><ul>${kids(p).map(c => html`<li>${link(c)}</li>`)}</ul></details></li>` : html`<li>${link(p)}</li>`)}</ul>`;
}
function siteHead(logo = P.shownLogo()) {   // logo: the one to show (the editor passes the unsaved one)
  const h = S.settings.header, c = S.conf;
  if (h.type === HTYPES[1]) return html`<iframe class="hdr-frame" sandbox title="Website header" srcdoc="${h.html}"></iframe>`;
  if (h.type === HTYPES[2]) return html`<p class="hdr-pic">Header picture: ${h.picture || '(none chosen)'} <span class="muted">(sample: the picture file is not included)</span></p>`;
  const meta = [h.showPlace === 'yes' && c.place, h.showDate === 'yes' && P.datesText(c.days)].filter(Boolean).join(' · ');
  return html`<div class="hdr-quick">${logo && h.logoPlace === 'in the header' ? P.logoHTML(logo, 'lg') : ''}
    <div><p class="hero-mark small" aria-hidden="true">${c.year} MIRC</p><p class="site-name">${h.title}</p>${h.subtitle ? html`<p>${h.subtitle}</p>` : ''}${meta ? html`<p class="hdr-meta">${meta}</p>` : ''}</div></div>`;
}
P.siteHead = siteHead;
/* The signed-in menu holds the person's own pages (submissions, registration, account details) and Log out, plus the Administration area for team roles.
   It is not a portal or a dashboard, so it is called "My Account". The live Sciencesconf site calls it "My Space" (blueprint 2.6). */
const userMenu = () => role() === 'Guest' ? html`<a class="btn btn-ghost" href="#/site/login">Sign in</a>`
  : html`<details class="usermenu"><summary class="btn btn-ghost" title="Your registration, your submissions and your account details">My Account <span aria-hidden="true">▾</span></summary><ul>
    <li class="menu-note">Signed in as ${role()} <span class="sr-only">(chosen with “Viewing as” in this prototype)</span></li>
    ${['Webmaster', 'Administrator', 'Coordinator', 'Reviewer'].includes(role()) ? html`<li><a href="#/admin">Administration area</a></li>` : ''}
    <li><a href="#/site/my-submissions">My submissions</a></li><li><a href="#/site/my-registration">My registration</a></li><li><a href="#/site/account">Edit account</a></li>
    <li><button type="button" class="linklike" data-act="logout">Log out</button></li></ul></details>`;

const siteBar = () => html`<div class="sitebar on-dark"><div class="sitebar-in"><strong>Public website preview</strong>
    <label class="inline">Viewing as <select data-ui="site.role" data-fk="site.role">${C.ROLES.map(x => html`<option ${raw(role() === x ? 'selected' : '')}>${x}</option>`)}</select></label>
    ${P.editionPicker('Conference edition', false)}
    ${P.sizeTools()}<a class="btn btn-gold btn-small" href="#/admin">Back to the administration area</a></div></div>`;
/* A draft edition is for the team only: everyone else gets this page and none of the edition's content. */
const notPublished = () => {
  const latest = [...ED.list].reverse().find(e => e.conf.status === 'published');
  return html`${siteBar()}<main id="main"><div class="main-in"><h1 tabindex="-1">This conference page is not published yet</h1>
    <div class="alert alert-info"><span class="sym" aria-hidden="true">i</span><div><strong>Note.</strong> MIRC ${S.conf.year} is still being prepared. ${latest ? 'You can look at an earlier edition instead.' : 'No conference edition is published yet.'} (Team members: use “Viewing as” at the top and choose Webmaster or Administrator to preview a draft.)</div></div>
    ${latest ? html`<p><button type="button" class="btn btn-primary" data-act="edlatest">Open MIRC ${latest.conf.year}</button></p>` : ''}</div></main>`;
};
P.shells.site = m => {
  if (!P.canSeeEdition(P.edition())) return notPublished();
  const r = m.r, body = r.view(m.params), t = P.title(r, m.params), parts = [P.pendingShown() && 'logo', P.themePendingShown() && 'colors'].filter(Boolean);
  return html`${siteBar()}
  ${S.conf.status === 'draft' ? html`<p class="draft-strip" role="note"><strong>Draft preview.</strong> Visitors cannot see MIRC ${S.conf.year} yet. Publish it under “Editions (years)” in the administration area.</p>` : ''}
  ${parts.length ? html`<p class="draft-strip" role="note"><strong>Branding preview.</strong> This edition has a draft ${parts.join(' and ')} that visitors cannot see yet. Publish ${parts.length > 1 ? 'them' : 'it'} under Conference, “Logo”, or Website, “Site colors”.</p>` : ''}
  <div class="site" style="${P.theme.css(P.shownTheme())}">
  ${S.conf.banner ? html`<p class="site-banner" role="note">${S.conf.banner}</p>` : ''}
  <header class="sitehead">${siteHead()}</header>
  <nav class="sitenav on-dark" aria-label="Website menu"><div class="nav-left">${S.settings.header.logoPlace === 'in the menu' ? P.logoHTML(P.shownLogo(), 'sm') : ''}<button type="button" class="btn btn-ghost" data-act="drawer" aria-haspopup="dialog"><span aria-hidden="true">☰</span>&nbsp;Menu</button></div>
    ${userMenu()}
    <dialog id="drawer" class="drawer on-dark" aria-label="Website menu" data-act="drawerbackdrop">
      <div class="drawer-head"><span class="nav-left">${S.settings.header.logoPlace !== 'no' ? P.logoHTML(P.shownLogo(), 'sm', true) : ''}<strong>Menu</strong></span><button type="button" class="btn btn-ghost btn-small" data-act="drawerclose"><span aria-hidden="true">✖</span>&nbsp;Close</button></div>
      <div class="sitemenu">${siteMenu()}</div></dialog></nav>
  <main id="main"><div class="main-in">${r.path === '/site' ? '' : html`<nav class="crumbs" aria-label="You are here"><ol><li><a href="#/site">Home</a></li><li><span aria-current="page">${t}</span></li></ol></nav>`}
    <h1 tabindex="-1">${r.path === '/site' ? S.conf.name : t}</h1><div id="fb">${msgHTML()}</div>${body}</div></main>
  <footer class="sitefoot on-dark"><div class="stripe" aria-hidden="true"></div><div class="foot-in">
    <p>Contact the organizers: <a href="mailto:${S.settings.contactEmail}">${S.settings.contactEmail}</a> (sample address)</p>
    <p>Legal notice, privacy and accessibility statement: <span class="muted-dark">pages still to be written (blueprint section 10.1)</span></p></div></footer></div>`;
};

/* The page links live in a slide-out drawer. It is a native modal <dialog>, so Esc, the focus trap and the backdrop are built in.
   Following a link changes the hash, which redraws the page and removes the dialog, so no extra close step is needed. */
Object.assign(P.act, {
  drawer() { $('#drawer').showModal(); },
  drawerclose() { $('#drawer').close(); },
  drawerbackdrop(el, e) { if (e.target === el) el.close(); },
  edlatest() { P.useEdition([...ED.list].reverse().find(e => e.conf.status === 'published').conf.id); P.go('/site'); },
});

const restricted = pg => html`<div class="alert alert-info"><span class="sym" aria-hidden="true">i</span><div><strong>Note.</strong> The page “${pg.title}” is not open to the role “${role()}”. On the real site this menu item is simply hidden. Use “Viewing as” at the top to try another role, or change the rights under “Pages and menu” in the administration area.</div></div>`;
const gate = (kind, fallback, render) => params => {
  const pg = pageOf(kind);
  if (!pg) return html`<p class="empty">This page was removed from the menu in the administration area.</p>`;
  return canSee(pg) ? render(pg, params) : restricted(pg);
};
const site = (path, title, ref, view, o = {}) => P.add({ path, area: 'site', title, ref, view, ...o });
const needSignIn = what => html`<div class="alert alert-info"><span class="sym" aria-hidden="true">i</span><div><strong>Note.</strong> ${what} is for signed-in people. Use “Viewing as” at the top to pick a role (for example Participant), or <a href="#/site/login">see the sign-in page</a>.</div></div>`;

/* ---- Home ---- */
site('/site', () => pageTitle('home', 'Home'), '2.2 Home; 10.3 Home structure; 9.6 Hero', gate('home', 'Home', () => html`
  <section class="hero card">${S.settings.header.logoPlace !== 'no' && P.shownLogo() ? html`<div class="hero-logo">${P.logoHTML(P.shownLogo(), 'md', true)}</div>` : ''}<p class="hero-mark" aria-hidden="true">${S.conf.year} MIRC</p><p class="tagline">${S.conf.tagline}</p>${S.conf.sub ? html`<p>${S.conf.sub}</p>` : ''}
    <p class="facts">${P.datesText(S.conf.days)}${S.conf.venue ? ' · ' + S.conf.venue : ''}</p>
    <div class="actions center"><a class="btn btn-gold" href="#/site/registration">${S.settings.registrationOpen ? 'Register' : 'Registration (closed)'}</a><a class="btn btn-secondary" href="#/site/submit">Abstract submission (${S.settings.submissionOpen ? 'open' : 'closed'})</a></div></section>
  ${S.homeBlocks.map(b => html`<section class="card"><h2>${b.title}</h2>${P.text(b.body)}</section>`)}
  <section class="card"><h2>Partners and sponsors</h2><p class="empty">Partner and sponsor logos go here. The logo files, and permission to use them, are still to be provided (blueprint 17.5).</p></section>
  ${S.news.length ? html`<section class="card"><h2>Latest news</h2>${S.news.map(n => html`<article><h3>${n.title}</h3><p class="muted">${n.date}</p>${P.text(n.content)}</article>`)}</section>` : ''}`),
  { note: 'Text blocks come from “Home page text”, news from “News”.' });

/* ---- Text pages (programme, guidelines, committee, speakers, dates, themes, venue, and any page you add) ---- */
P.add({
  path: '/site/p/:id', area: 'site', ref: '2.2 Navigation pages; 2.4 Presentation guidelines; 3.2 Pages',
  title: ({ id }) => pageOf2(id)?.title || 'Page not found',
  view: ({ id }) => {
    const pg = pageOf2(id);
    if (!pg) return html`<p class="empty">This page does not exist, or it was removed in the administration area.</p>`;
    if (!canSee(pg)) return restricted(pg);
    if (pg.kind === 'news') return S.news.length ? html`${S.news.map(n => html`<article class="card"><h2>${n.title}</h2><p class="muted">${n.date}</p>${P.text(n.content)}</article>`)}` : html`<p class="empty">No news yet.</p>`;
    if (pg.kind === 'planned') return html`<div class="alert alert-info"><span class="sym" aria-hidden="true">i</span><div><strong>Note.</strong> The page type “${pg.type}” can be added to the menu, but its content is not built in this prototype.</div></div>`;
    return html`<article class="card">${pg.body ? P.text(pg.body) : html`<p class="empty">This page has no text yet. Add some under “Pages and menu”, “Change the text”.</p>`}</article>`;
  },
});
const pageOf2 = id => S.pages.find(p => p.id === id);

/* ---- Detailed program ---- */
const evTitle = e => e.type === 'Session' ? e.topic : e.title;
const dayBlock = (d, full) => {
  const evs = S.events.filter(e => e.date === d).sort((a, b) => a.start.localeCompare(b.start)), show = S.settings.showPapers === 'yes';
  return html`<section class="card" aria-labelledby="d-${d}"><h2 id="d-${d}">${dayLabel(d)}</h2>${evs.length ? evs.map(e => html`<article class="ev"><p class="ev-time">${e.start} to ${e.end}</p>
    <div><h3>${evTitle(e)}</h3><p class="muted">${EVLBL[e.type].split(' (')[0]}${e.room ? ' · ' + roomName(e.room) : ''}${e.chair ? ' · Chair: ' + e.chair : ''}</p>${e.description ? html`<p>${e.description}</p>` : ''}
      ${show && e.comms.length ? html`<ul class="talks">${e.comms.slice().sort((a, b) => a.start.localeCompare(b.start)).map(c => { const p = paperById(c.paperId); return !p ? '' : html`<li>${c.start} to ${c.end}: <strong>${p.title}</strong> <span class="muted">${authorsOf(p)}${c.speaker ? ' · speaker ' + c.speaker : ''}</span>${full ? html`<details><summary>Abstract</summary><p>${p.abstract}</p></details>` : ''}</li>`; })}</ul>` : ''}</div></article>`) : html`<p class="empty">Nothing is planned for this day.</p>`}</section>`;
};
site('/site/program', () => pageTitle('program', 'Detailed Conference Program (with Abstracts)'), '2.3 Detailed program module (day tabs, List, print); 3.3.1 PROGRAM_SHOWPAPERS',
  gate('program', 'Program', () => {
    if (!DAYS().length) return html`<p class="empty">The conference days have not been announced yet.</p>`;
    const d0 = u('site.day', ''), day = d0 === 'list' || DAYS().includes(d0) ? d0 : busyDay(), full = day === 'list';
    return html`${P.tabs('site.day', [...DAYS().map(d => [d, P.dayShort(d)]), ['list', 'Full list with abstracts']], 'Choose a day', day, 'wide')}
      ${full ? html`<div class="actions"><button type="button" class="btn btn-secondary" data-act="print">Print this list</button></div>` : ''}
      ${S.settings.showPapers === 'no' ? html`<div class="alert alert-info"><span class="sym" aria-hidden="true">i</span><div><strong>Note.</strong> Papers are hidden. Change this under Program, “Program display”.</div></div>` : ''}
      ${(full ? DAYS() : [day]).map(d => dayBlock(d, full))}`;
  }), { note: 'Built from the Schedule and Rooms in the administration area. Print uses the browser\'s own print window.' });

/* ---- List of participants ---- */
site('/site/participants', () => pageTitle('participants', 'List of Participants'), '2.2 List of Participants (A-Z index, count; not for Guests or Members)', gate('participants', 'Participants', () => {
  const list = S.registrations.filter(r => r.status === 'Registered').sort((a, b) => (a.last + a.first).localeCompare(b.last + b.first)), L = u('site.letter', 'All');
  const letters = [...new Set(list.map(r => r.last[0].toUpperCase()))].sort();
  const shown = L === 'All' ? list : list.filter(r => r.last[0].toUpperCase() === L);
  return html`<p>Number of registered people: <strong>${list.length}</strong> (sample).</p>${P.tabs('site.letter', [['All', 'All'], ...letters.map(x => [x, x])], 'Choose a letter', L)}
    ${shown.length ? html`<ul class="names">${shown.map(r => html`<li>${r.last}, ${r.first}</li>`)}</ul>` : html`<p class="empty">Nobody under this letter.</p>`}`;
}), { note: 'Only people with status “Registered” are listed. Names only; no emails are shown publicly (blueprint 13.2).' });

/* ---- Registration ---- */
P.defForm('site-register', {
  fields: () => P.REGFIELDS(true), submit: 'Save my registration',
  run: v => { const r = { id: 'r' + Date.now(), status: 'Pre-registered', total: 0, date: new Date().toISOString().slice(0, 16).replace('T', ' '), title: '', middle: '', language: 'en', phone: '', institution: '', address: '', country: '', extra: '', ...v }; S.registrations.push(r); P.ui['site.regDone'] = r.id; P.say('ok', 'Your registration has been saved.'); P.refresh(); },
});
site('/site/registration', () => pageTitle('registration', 'Registration'), '2.5 Registration module; 3.6 (status, payment)', gate('registration', 'Registration', () => {
  const done = S.registrations.find(r => r.id === u('site.regDone', ''));
  if (done) return html`<section class="card"><h2>Your registration</h2><dl class="dl">${[['Name', `${done.title} ${done.first} ${done.middle} ${done.last}`], ['Email', done.email], ['Language', done.language], ['Phone', done.phone], ['Institution', done.institution], ['Address', done.address], ['Country', done.country], ['Status', done.status]].map(([k, v]) => html`<dt>${k}</dt><dd>${v}</dd>`)}</dl>
    <p>The new person now appears under “Registered people” in the administration area.</p><button type="button" class="btn btn-secondary" data-act="setui" data-k="site.regDone" data-v="">Register another person</button></section>`;
  const dl = S.conf.registrationDeadline ? `The registration deadline is ${P.fmtDate(S.conf.registrationDeadline)}. ` : 'The registration deadline has not been announced yet. ';
  if (!S.settings.registrationOpen) return html`<div class="alert alert-info"><span class="sym" aria-hidden="true">i</span><div><strong>Note.</strong> Registration for MIRC ${S.conf.year} is not open. ${dl}The administrators open it under “Edition details”, “Dates and deadlines”.</div></div>`;
  return html`<div class="alert alert-info"><span class="sym" aria-hidden="true">i</span><div><strong>Note.</strong> ${dl}On the live site you sign in first; here anyone can try the form. The form fields are the ones shown on the live site's saved-registration page. Fees and payment are not defined yet (blueprint decision D5).</div></div>
    <section class="card"><h2>Registration form</h2>${P.formHTML('site-register', {})}</section>`;
}), { note: 'Saving adds a “Pre-registered” person to the administration list. The empty form on the live site was not seen, so the fields are those of the saved recap.' });

/* ---- Abstract submission ---- */
P.defForm('site-submit', {
  fields: () => [{ name: 'title', label: 'Title', required: true }, { name: 'authors', label: 'Authors and their institutions', type: 'textarea', rows: 3, required: true, hint: 'One author per line.' },
    { name: 'abstract', label: 'Abstract', type: 'textarea', rows: 6, required: true }, { name: 'type', label: 'Type of presentation', type: 'select', required: true, options: [{ v: '', l: '-- Choose --' }, ...C.TYPES.slice(0, 2)] },
    { name: 'topic', label: 'Topic', type: 'select', required: true, options: [{ v: '', l: '-- Choose --' }, ...S.topics] }, { name: 'file', label: 'PDF file (optional)', type: 'file', accept: '.pdf' }],
  submit: 'Send (preview only)',
  run: () => P.say('info', `Preview only. ${S.settings.submissionOpen ? '' : 'The submission period is closed, and '}sending papers needs the server part (blueprint phase 4).`),
});
site('/site/submit', () => pageTitle('submission', 'Abstract Submission'), '2.2 Abstract Submission (closed message and period); 10.3 page structure', gate('submission', 'Submission', () => html`
  <div class="alert alert-info"><span class="sym" aria-hidden="true">i</span><div><strong>Note.</strong> The abstract submission is ${S.settings.submissionOpen ? 'open' : 'closed'}. ${S.conf.submission.open && S.conf.submission.close ? `Period for abstract submission: ${P.datesText([S.conf.submission.open, S.conf.submission.close])}.` : 'The submission period has not been announced yet.'}</div></div>
  ${S.settings.submissionOpen ? html`<section class="card"><h2>Submit an abstract</h2>${P.formHTML('site-submit', {})}</section>`
    : html`<details class="card"><summary>Preview of the planned submission form (the real form was not seen; layout is proposed in the blueprint)</summary>${P.formHTML('site-submit', {})}</details>`}`),
  { note: 'Open or closed, and the period, come from the edition (Edition details). The form is a proposed layout for later; it sends nothing.' });

/* ---- Sign in and account pages ---- */
P.defForm('site-login', {
  fields: () => [{ name: 'email', label: 'Email address', type: 'email', required: true }, { name: 'pwd', label: 'Password', type: 'password', required: true, autocomplete: 'current-password' }], submit: 'Sign in (preview only)',
  run: () => P.say('info', 'Preview only: real sign-in needs an account service (the blueprint recommends one). Your password was not kept or checked. Use “Viewing as” at the top instead.'),
});
site('/site/login', 'Sign in', '2.6 Account / My Space (sign-in page itself was not seen on the live site)', () => html`<section class="card"><h2>Sign in</h2>${P.formHTML('site-login', {})}</section>`,
  { note: 'Layout only. Nothing is checked or stored.' });
const account = (title, ref, body) => site(title.path, title.t, ref, () => role() === 'Guest' ? needSignIn('This page') : body(), { note: 'Needs a signed-in role: use “Viewing as”.' });
P.defForm('site-account', {
  fields: () => [{ name: 'last', label: 'Last name', required: true }, { name: 'first', label: 'First name', required: true }, { name: 'email', label: 'Email address', type: 'email', required: true }, { name: 'language', label: 'Language', type: 'select', options: ['English', 'French', 'Spanish'] }],
  run: () => P.say('info', 'Preview only. The fields of the real “Edit account” page were not seen on the live site.'),
});
account({ path: '/site/account', t: 'Edit account' }, '2.6 Edit account (form not opened in the observation: fields are assumed)', () => html`<section class="card"><h2>Your details</h2>${P.formHTML('site-account', { last: 'Sample', first: 'Person', email: 'person@example.org', language: 'English' })}</section>`);
account({ path: '/site/my-registration', t: 'My registration' }, '2.5, 2.6 My registration', () => { const r = S.registrations[0]; if (!r) return html`<p class="empty">You have not registered for MIRC ${S.conf.year} yet. <a href="#/site/registration">Open the registration page</a>.</p>`; return html`<section class="card"><h2>Your registration (sample person)</h2><p>${P.badge(r.status)}</p><p>${r.title} ${r.first} ${r.last}, ${r.institution}</p><p><a href="#/site/registration">Open the registration page</a></p></section>`; });
account({ path: '/site/my-submissions', t: 'My submissions' }, '2.6 My submissions (the live site showed “page not found” for this account)', () => html`<p class="empty">You have not sent any paper. The submission period is closed.</p>`);

Object.assign(P.act, {
  print() { window.print(); },
  logout() { P.ui['site.role'] = 'Guest'; P.refresh(); },
});

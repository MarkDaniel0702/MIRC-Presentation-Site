/* MIRC 2026 prototype: administration area (blueprint section 3, plus 4 and 10.4).
   Each P.add({...}) is one page. "ref" points at the blueprint section, "note" says what is simulated. */
'use strict';

P.groups = ['Papers and decisions', 'Reviewers', 'Attendees', 'Program', 'Email', 'Website', 'Help'];
const GINFO = {
  'Papers and decisions': 'Read the papers authors have sent in, accept or refuse them, and prepare the book of abstracts.',
  Reviewers: 'Choose who reviews which paper, and check that every paper has a reviewer.',
  Attendees: 'See who has registered, record payments, register someone, or add a new user account.',
  Program: 'Plan the days: rooms, sessions, breaks, and which paper is presented when.',
  Email: 'Write and send emails, keep ready-made messages, and see what was sent.',
  Website: 'Change the pages, home page text, news, files, header and colors that visitors see.',
  Help: 'Explanations, who can do what, and what this prototype does and does not do.',
};
const paperById = id => S.papers.find(p => p.id === id);
const mailId = p => 'mirc2026:' + p.id;
P.paperReviewers = p => S.reviewers.filter(r => r.topics.includes(p.topic) || r.papers.includes(p.id));
const logP = (p, action, comment = '') => p.history.push({ date: today(), action, user: 'You (sample)', comment });
const authorsOf = p => p.authors.map(a => a.name).join(', ');
const roomOpts = () => [{ v: '', l: '(no room)' }, ...S.rooms.map(r => ({ v: r.id, l: r.name }))];
const roomName = id => S.rooms.find(r => r.id === id)?.name || '';
const dayLabel = d => new Date(d + 'T12:00:00').toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
const fmtSize = n => n < 1024 ? n + ' B' : n < 1048576 ? Math.round(n / 1024) + ' KB' : (n / 1048576).toFixed(1) + ' MB';
const sel = (key, label, options, all) => html`<div class="field"><label for="ui-${key}">${label}</label><select id="ui-${key}" data-ui="${key}" data-fk="${key}">
  ${[['', all], ...options.map(o => [o, o])].map(([v, l]) => html`<option value="${v}" ${raw(u(key, '') === v ? 'selected' : '')}>${l}</option>`)}</select></div>`;
const searchBox = (key, label, hint) => html`<div class="field"><label for="ui-${key}">${label}</label>${hint ? html`<p class="hint">${hint}</p>` : ''}
  <input id="ui-${key}" type="search" data-ui="${key}" data-fk="${key}" value="${u(key, '')}" autocomplete="off"></div>`;
const toolbar = (...items) => html`<div class="toolbar">${items}</div>`;

/* ================= Dashboard ================= */
P.add({
  path: '/admin', area: 'admin', title: 'Dashboard: what would you like to do?',
  ref: '3.1 Module overview, 10.4 Admin information architecture, 3.8 Admin workflows',
  note: 'All counts are calculated from the sample data you can change. The seven blueprint modules are grouped by task: Papers and decisions (Editorial Management), Reviewers (Reviewing), Attendees (Registration management + Administration), Program, Email (Mailing management), Website, Help.',
  view: () => {
    const initial = S.papers.filter(p => p.status === 'Initial').length;
    const noRev = S.papers.filter(p => !P.paperReviewers(p).length).length;
    const pay = S.registrations.filter(r => r.status === 'Needs payment').length;
    const setBtn = (path, sets, text) => html`<button type="button" class="btn btn-small" data-act="sets" data-path="${path}" data-sets="${JSON.stringify(sets)}">${text}</button>`;
    return html`
    <p class="lead">Choose a card below, or use the menu on the left. Every page has a “Dashboard” link at the top, so you can always come back here.</p>
    <section class="card" aria-labelledby="attn"><h2 id="attn">Needs your attention</h2><ul class="attn">
      <li><span><strong>${initial}</strong> new paper${initial === 1 ? '' : 's'} (status “Initial”) waiting for a decision.</span> ${setBtn('/admin/papers', { 'papers.status': 'Initial' }, 'Show them')}</li>
      <li><span><strong>${noRev}</strong> paper${noRev === 1 ? ' has' : 's have'} no reviewer yet.</span> ${setBtn('/admin/review-papers', { 'rp.view': 'none' }, 'Show them')}</li>
      <li><span><strong>${pay}</strong> ${pay === 1 ? 'person needs' : 'people need'} to pay.</span> ${setBtn('/admin/registrations', { 'reg.pre': false, 'reg.pay': true, 'reg.ok': false }, 'Show them')}</li>
      <li><span>The review period is <strong>closed</strong>, as on the live site.</span> <a href="#/admin/review-inbox">See the reviewer's view</a></li></ul></section>
    <div class="grid2">${P.groups.map(g => html`<section class="card" aria-labelledby="g-${g.replace(/\W/g, '')}"><h2 id="g-${g.replace(/\W/g, '')}">${g}</h2><p>${GINFO[g]}</p>
      <ul class="linklist">${P.routes.filter(r => r.area === 'admin' && r.group === g && r.nav).map(r => html`<li><a href="#${r.path}"><strong>${r.label}</strong></a><br><span class="muted">${r.blurb}</span></li>`)}</ul></section>`)}</div>`;
  },
});

/* ================= Papers and decisions ================= */
const BULK = { Initial: 'marked as Initial', Accepted: 'accepted', Refused: 'refused', 'Awaiting update': 'marked as Awaiting update', delete: 'deleted' };
const paperList = () => {
  const q = u('papers.q', '').toLowerCase(), st = u('papers.status', ''), ty = u('papers.type', ''), tp = u('papers.topic', '');
  return S.papers.filter(p => (!st || p.status === st) && (!ty || p.type === ty) && (!tp || p.topic === tp) &&
    (!q || (p.title + ' ' + authorsOf(p) + ' ' + p.id).toLowerCase().includes(q)));
};
P.add({
  path: '/admin/papers', area: 'admin', group: 'Papers and decisions', nav: true, label: 'Papers received', title: 'Papers received',
  blurb: 'Find a paper, read it, accept or refuse it.',
  ref: '3.4.2 Editorial Management > Submissions',
  note: 'Filters, search, select, bulk status change and delete all work on the sample data. On the real site the author is emailed after a decision (needs the email service).',
  view: () => {
    const list = paperList(), picked = P.sel.papers ||= new Set(), all = list.length && list.every(p => picked.has(p.id));
    return html`
    <p class="lead">These are the papers authors have sent in. Use the boxes to find papers, then choose “Open” to read one and decide.</p>
    <section class="card" aria-labelledby="f1"><h2 id="f1">Find papers</h2><div class="filters">
      ${searchBox('papers.q', 'Search by title, author or number')}${sel('papers.status', 'Status', C.STATUSES, 'All statuses')}${sel('papers.type', 'Type of presentation', C.TYPES, 'All types')}${sel('papers.topic', 'Topic', C.TOPICS, 'All topics')}</div>
      <button type="button" class="btn btn-secondary" data-act="clearfilters" data-prefix="papers.">Clear all filters</button></section>
    <section aria-labelledby="l1"><h2 id="l1">Papers: ${list.length} shown of ${S.papers.length} (sample)</h2>
      <div class="card bulk"><div class="field"><label for="bulk-action">With the ticked papers (${picked.size} ticked)</label>
        <select id="bulk-action"><option value="">-- Choose what to do --</option>${Object.keys(BULK).map(k => html`<option value="${k}">${k === 'delete' ? 'Delete' : 'Set status to ' + k}</option>`)}</select></div>
        <button type="button" class="btn btn-primary" data-act="bulk">Apply to ticked papers</button></div>
      ${P.table({
        caption: 'Papers received', empty: 'No paper matches these filters. Try “Clear all filters”.', rows: list, cols: [
          { h: 'Select', hide: true, th: html`<input type="checkbox" data-act="selall" data-fk="selall" aria-label="Tick or untick all papers shown" ${raw(all ? 'checked' : '')}>`, v: p => html`<input type="checkbox" data-act="selpaper" data-id="${p.id}" data-fk="sel-${p.id}" aria-label="Tick ${p.title}" ${raw(picked.has(p.id) ? 'checked' : '')}>` },
          { h: 'Status', v: p => P.badge(p.status) },
          { h: 'Paper', v: p => html`<strong>${p.title}</strong><br><span class="muted">${authorsOf(p)} · ${p.type} · ${p.topic}</span>` },
          { h: 'Actions', v: p => html`<a class="btn btn-small" href="#/admin/papers/${p.id}" aria-label="Open: ${p.title}">Open</a> <button type="button" class="btn btn-small btn-secondary" data-act="editpaper" data-id="${p.id}" aria-label="Edit title and abstract: ${p.title}">Edit</button>` },
        ],
      })}</section>`;
  },
});
Object.assign(P.act, {
  selall() { const s = P.sel.papers ||= new Set(), l = paperList(); l.every(p => s.has(p.id)) ? l.forEach(p => s.delete(p.id)) : l.forEach(p => s.add(p.id)); P.refresh(); },
  selpaper(el) { const s = P.sel.papers ||= new Set(); s.has(el.dataset.id) ? s.delete(el.dataset.id) : s.add(el.dataset.id); P.refresh(); },
  async bulk() {
    const act = $('#bulk-action').value, ids = [...(P.sel.papers || [])];
    if (!ids.length) return P.say('warn', 'Please tick at least one paper first.');
    if (!act) return P.say('warn', 'Please choose what to do with the ticked papers.');
    const del = act === 'delete';
    if (!await P.confirm({ title: del ? 'Delete these papers for good?' : 'Change the status of these papers?', danger: del, ok: del ? `Yes, delete ${ids.length}` : 'Yes, change them',
      text: html`${ids.length} paper${ids.length === 1 ? '' : 's'} will be <strong>${BULK[act]}</strong>.${del ? ' This cannot be undone in this prototype (reload to restore the sample data).' : ''}` })) return;
    if (del) { S.papers = S.papers.filter(p => !ids.includes(p.id)); S.events.forEach(e => { e.comms = e.comms.filter(c => !ids.includes(c.paperId)); }); }
    else ids.forEach(id => { const p = paperById(id); p.status = act; logP(p, `Status set to ${act} (bulk)`); });
    P.sel.papers = new Set();
    P.say('ok', `${ids.length} paper${ids.length === 1 ? ' was' : 's were'} ${BULK[act]}.`); P.refresh();
  },
  async editpaper(el) {
    const p = paperById(el.dataset.id);
    const v = await P.form({ title: 'Edit title and abstract', values: { title: p.title, abstract: p.abstract }, fields: [
      { name: 'title', label: 'Title', required: true }, { name: 'abstract', label: 'Abstract', type: 'textarea', rows: 8, required: true }] });
    if (!v) return;
    Object.assign(p, v); logP(p, 'Title/abstract edited');
    P.say('ok', 'The paper was updated.'); P.refresh();
  },
  async decide(el) {
    const p = paperById(el.dataset.id), to = el.dataset.to, verb = to === 'Accepted' ? 'accept' : 'refuse';
    if (!await P.confirm({ title: `${verb[0].toUpperCase() + verb.slice(1)} this paper?`, ok: `Yes, ${verb} it`, text: html`The status will change to <strong>${to}</strong>. On the real site the author is told by email, using the matching email template.` })) return;
    p.status = to; logP(p, `Status set to ${to}`);
    P.say('ok', html`“${p.title}” is now <strong>${to}</strong>.`); P.refresh();
  },
  async delpaper(el) {
    const p = paperById(el.dataset.id);
    if (!await P.confirm({ title: 'Delete this paper for good?', danger: true, ok: 'Yes, delete it', text: html`“${p.title}” will be removed, together with its place in the program. This cannot be undone in this prototype.` })) return;
    S.papers = S.papers.filter(x => x !== p); S.events.forEach(e => { e.comms = e.comms.filter(c => c.paperId !== p.id); });
    P.goSay('/admin/papers', 'ok', 'The paper was deleted.');
  },
  pdf() { P.say('info', 'Sample paper: no PDF file is attached in this prototype. On the real site this opens the author\'s PDF.'); },
});
const curPaper = () => paperById(P.cur.params.id);
P.defForm('paper-meta', {
  fields: () => [{ name: 'type', label: 'Type of presentation', type: 'select', options: C.TYPES }, { name: 'topic', label: 'Topic', type: 'select', options: C.TOPICS }],
  run: v => { const p = curPaper(); Object.assign(p, v); logP(p, 'Type/topic changed'); P.say('ok', 'Type and topic were saved.'); P.refresh(); },
});
P.defForm('paper-changes', {
  submit: 'Ask the author for changes',
  fields: () => [{ name: 'changeMsg', label: 'Message to the author', type: 'textarea', required: true, hint: 'Say what the author should change. On the real site this text is sent by email.' }],
  run: v => { const p = curPaper(); p.status = 'Awaiting update'; logP(p, 'Changes requested', v.changeMsg); P.say('ok', 'The status is now “Awaiting update” and the request was recorded. No email was really sent.'); P.refresh(); },
});
P.defForm('paper-note', {
  submit: 'Save private note',
  fields: () => [{ name: 'note', label: 'Private note', type: 'textarea', rows: 3, hint: 'Only coordinators can see this note. The author cannot.' }],
  run: v => { const p = curPaper(); p.note = v.note; logP(p, 'Private note saved'); P.say('ok', 'The private note was saved.'); P.refresh(); },
});
P.defForm('paper-comment', {
  submit: 'Save comment',
  fields: () => [{ name: 'comment', label: 'Comment for the author', type: 'textarea', rows: 3, hint: 'The author can read this comment.' }],
  run: v => { const p = curPaper(); p.comment = v.comment; logP(p, 'Comment for the author saved'); P.say('ok', 'The comment was saved.'); P.refresh(); },
});
P.add({
  path: '/admin/papers/:id', area: 'admin', group: 'Papers and decisions', parent: '/admin/papers',
  title: ({ id }) => paperById(id)?.title || 'Paper not found', crumb: 'One paper',
  ref: '3.4.2 Submission detail view (type and topic, opinions, history, request changes, annotate, accept, refuse, delete)',
  note: 'Decisions change the status and add a line to the history. Reviewer opinions are empty because the review form is not defined yet (blueprint decision D12). No email is sent.',
  view: ({ id }) => {
    const p = paperById(id);
    if (!p) return html`<p class="lead">This paper does not exist (it may have been deleted).</p><a class="btn btn-primary" href="#/admin/papers">Back to papers received</a>`;
    const revs = P.paperReviewers(p), start = { type: p.type, topic: p.topic };
    return html`
    <a class="btn btn-secondary" href="#/admin/papers">Back to papers received</a>
    <section class="card" aria-labelledby="d1"><h2 id="d1">The paper</h2>
      <p>${P.badge(p.status)} <span class="muted">Number: ${mailId(p)}</span></p>
      <h3>Authors</h3><ol class="plain">${p.authors.map((a, i) => html`<li>${a.name}, ${a.affil}${i === p.corresponding ? ' (corresponding author)' : ''}</li>`)}</ol>
      <h3>Abstract</h3><p>${p.abstract}</p>
      <button type="button" class="btn btn-secondary" data-act="pdf">Open the PDF version</button></section>
    <section class="card" aria-labelledby="d2"><h2 id="d2">Decision</h2>
      <p>Accepting or refusing changes the status. The author is told by email on the real site.</p>
      <div class="actions"><button type="button" class="btn btn-primary" data-act="decide" data-id="${p.id}" data-to="Accepted">Accept this paper</button>
        <button type="button" class="btn btn-secondary" data-act="decide" data-id="${p.id}" data-to="Refused">Refuse this paper</button></div>
      <h3>Ask the author for changes</h3>${P.formHTML('paper-changes', {})}</section>
    <section class="card" aria-labelledby="d3"><h2 id="d3">Type and topic</h2>${P.formHTML('paper-meta', start)}</section>
    <section class="card" aria-labelledby="d4"><h2 id="d4">Reviewers and their opinions</h2>
      <p>${revs.length ? 'Reviewers for this paper: ' + revs.map(r => r.name).join(', ') + '.' : 'No reviewer has been chosen for this paper yet.'}</p>
      <p>Opinions received: <strong>0 of ${revs.length}</strong>. The review form is not defined yet (blueprint decision D12).</p>
      <a href="#/admin/review-papers">Choose reviewers</a></section>
    <section class="card" aria-labelledby="d5"><h2 id="d5">Notes and comments</h2>${P.formHTML('paper-note', { note: p.note })}<hr>${P.formHTML('paper-comment', { comment: p.comment })}</section>
    <section class="card" aria-labelledby="d6"><h2 id="d6">History</h2>${P.table({ caption: 'History of this paper', empty: 'No history yet.', rows: p.history, cols: [{ h: 'Date', v: 'date' }, { h: 'Action', v: 'action' }, { h: 'Done by', v: 'user' }, { h: 'Comment', v: 'comment' }] })}</section>
    <section class="card" aria-labelledby="d7"><h2 id="d7">Delete</h2><p>Deleting removes the paper for good.</p>
      <button type="button" class="btn btn-danger" data-act="delpaper" data-id="${p.id}">Delete this paper</button></section>`;
  },
});

/* ---- Book of abstracts (Proceedings): 3 steps ---- */
const bookList = () => {
  if (u('book.gather', 'no') === 'no') return S.papers.filter(p => p.status === 'Accepted');
  const tp = C.TOPICS.filter((t, i) => u('book.t' + i, true)), st = C.STATUSES.filter((s, i) => u('book.s' + i, s === 'Accepted'));
  return S.papers.filter(p => tp.includes(p.topic) && st.includes(p.status));
};
const dayOfPaper = p => S.events.find(e => e.comms.some(c => c.paperId === p.id))?.date || '';
const bookGroups = () => {
  const out = {};
  bookList().forEach(p => { const k = u('book.group', 'sessions') === 'sessions' ? p.topic : (dayOfPaper(p) ? dayLabel(dayOfPaper(p)) : 'Not in the program yet'); (out[k] ||= []).push(p); });
  return out;
};
const chk = (key, label, def) => html`<label class="choice"><input type="checkbox" data-ui="${key}" data-fk="${key}" ${raw(u(key, def) ? 'checked' : '')}> ${label}</label>`;
const rad = (key, val, label, def) => html`<label class="choice"><input type="radio" name="${key}" data-ui="${key}" data-fk="${key}-${val}" value="${val}" ${raw(u(key, def) === val ? 'checked' : '')}> ${label}</label>`;
P.add({
  path: '/admin/book', area: 'admin', group: 'Papers and decisions', nav: true, label: 'Book of abstracts', title: 'Book of abstracts',
  blurb: 'Choose which papers go into the book and see a preview.',
  ref: '3.4.3 Editorial Management > Proceedings (3 steps: data source, supplementary data, display)',
  note: 'Step 1 and the preview work on the sample data. Steps 2 and 3 are only partly defined in the blueprint. The real PDF needs a server-side PDF job (blueprint phase 6); the preview can be downloaded as a CSV list.',
  view: () => {
    const step = u('book.step', '1'), steps = ['Choose papers', 'Extra pages', 'Preview'];
    const bar = html`<ol class="steps" aria-label="Steps">${steps.map((s, i) => html`<li ${raw(String(i + 1) === step ? 'aria-current="step"' : '')}><span>Step ${i + 1}</span> ${s}</li>`)}</ol>`;
    const nav = (back, next) => html`<div class="actions">${back ? html`<button type="button" class="btn btn-secondary" data-act="setui" data-k="book.step" data-v="${back}">Back</button>` : ''}${next ? html`<button type="button" class="btn btn-primary" data-act="setui" data-k="book.step" data-v="${next}">Next</button>` : ''}</div>`;
    if (step === '1') return html`${bar}<section class="card"><h2>Step 1: Which papers go in the book?</h2>
      <div class="field"><label for="book-ed">Kind of book</label><select id="book-ed"><option>Book of abstracts</option></select></div>
      <fieldset class="field"><legend>Choose papers by your own rules?</legend>${rad('book.gather', 'no', 'No: use only accepted papers', 'no')}${rad('book.gather', 'yes', 'Yes: let me choose topics and statuses', 'no')}</fieldset>
      <fieldset class="field"><legend>How should papers be grouped?</legend>${rad('book.group', 'sessions', 'By session (topic)', 'sessions')}${rad('book.group', 'days', 'By day (from the program)', 'sessions')}</fieldset>
      ${u('book.gather', 'no') === 'yes' ? html`<fieldset class="field"><legend>Topics to include</legend>${C.TOPICS.map((t, i) => chk('book.t' + i, t, true))}</fieldset>
        <fieldset class="field"><legend>Statuses to include</legend>${C.STATUSES.map((s, i) => chk('book.s' + i, s, s === 'Accepted'))}</fieldset>` : html`<p class="hint">Only papers with the status “Accepted” will be used.</p>`}
      <p><strong>${bookList().length}</strong> paper${bookList().length === 1 ? '' : 's'} match so far.</p>${nav('', '2')}</section>`;
    if (step === '2') return html`${bar}<section class="card"><h2>Step 2: Extra pages</h2>
      <p class="hint">The blueprint only says that predefined pages (for example an author index) and uploaded files can be added. Exact options are not confirmed.</p>
      ${chk('book.index', 'Add an author index', true)}
      <div class="field"><label for="book-file">Add your own file (optional)</label><input id="book-file" type="file"><p class="hint">Only the idea is shown here; nothing is uploaded.</p></div>${nav('1', '3')}</section>`;
    const groups = bookGroups(), keys = Object.keys(groups);
    return html`${bar}<section class="card"><h2>Step 3: Preview</h2>
      <p>This is a preview of the list. Making the real book (a PDF) needs the server part of the system.</p>
      ${keys.length ? keys.map(k => html`<h3>${k} (${groups[k].length})</h3><ul>${groups[k].map(p => html`<li>${p.title} <span class="muted">(${authorsOf(p)})</span></li>`)}</ul>`) : html`<p class="empty">No paper matches your choices. Go back and change step 1.</p>`}
      ${u('book.index', true) ? html`<h3>Author index (preview)</h3><p>${[...new Set(bookList().flatMap(p => p.authors.map(a => a.name)))].sort().join(', ') || 'None'}</p>` : ''}
      <div class="actions"><button type="button" class="btn btn-secondary" data-act="setui" data-k="book.step" data-v="2">Back</button>
        <button type="button" class="btn btn-primary" data-act="bookcsv">Download the list (CSV file)</button>
        <button type="button" class="btn" disabled>Make the PDF book (needs the server part)</button></div></section>`;
  },
});
P.act.bookcsv = () => { const g = bookGroups(); P.csv('book-of-abstracts-preview.csv', [['Group', 'Number', 'Title', 'Authors', 'Type', 'Topic'], ...Object.keys(g).flatMap(k => g[k].map(p => [k, mailId(p), p.title, authorsOf(p), p.type, p.topic]))]); P.say('ok', 'A CSV file of the preview list was downloaded.'); };

/* ================= Reviewers ================= */
const counts = (r, t) => { const tot = S.papers.filter(p => p.topic === t).length; return [r.topics.includes(t) ? tot : S.papers.filter(p => p.topic === t && r.papers.includes(p.id)).length, tot]; };
P.add({
  path: '/admin/reviewers', area: 'admin', group: 'Reviewers', nav: true, label: 'Choose reviewers', title: 'Choose reviewers',
  blurb: 'Add reviewers and give each one topics or single papers.',
  ref: '3.4.1 Reviewing > Reviewers (assign by topic or by paper, export CSV)',
  note: 'Adding, assigning, removing and the CSV download work on the sample data. Reviewers must already have a user account.',
  view: () => html`
    <p class="lead">A reviewer can look at every paper of a topic, or only at papers you choose one by one.</p>
    <div class="actions"><button type="button" class="btn btn-primary" data-act="addreviewer">Add a reviewer</button><button type="button" class="btn btn-secondary" data-act="revcsv">Download the list (CSV file)</button></div>
    ${P.table({ caption: 'Reviewers', empty: 'There are no reviewers yet. Choose “Add a reviewer”.', rows: S.reviewers, cols: [
      { h: 'Reviewer', v: r => html`<strong>${r.name}</strong><br><span class="muted">${r.login} · ${r.email}</span>` },
      { h: 'Papers assigned', v: r => { const rows = C.TOPICS.map(t => [t, ...counts(r, t)]).filter(x => x[1] > 0); return rows.length ? html`<ul class="plain">${rows.map(([t, n, tot]) => html`<li>${t}: ${n} of ${tot} paper${tot === 1 ? '' : 's'}</li>`)}</ul>` : 'No papers assigned yet'; } },
      { h: 'Actions', v: r => html`<button type="button" class="btn btn-small" data-act="revtopics" data-id="${r.login}">Choose topics</button> <button type="button" class="btn btn-small" data-act="revpapers" data-id="${r.login}">Choose single papers</button> <button type="button" class="btn btn-small btn-secondary" data-act="revdel" data-id="${r.login}">Remove</button>` }] })}`,
});
Object.assign(P.act, {
  async addreviewer() {
    const v = await P.form({ title: 'Add a reviewer', intro: 'The person must already have a user account.', submit: 'Add reviewer', fields: [
      { name: 'who', label: 'Login or email of the person', required: true, hint: 'For example one of the logins shown under Attendees.' }],
    check: v => { const x = S.users.find(a => a.login === v.who.toLowerCase() || a.email === v.who.toLowerCase());
      return !x ? { who: 'No account found. Add one under Attendees, “Add a user account”.' } : S.reviewers.some(r => r.login === x.login) ? { who: 'This person is already a reviewer.' } : {}; } });
    if (!v) return;
    const x = S.users.find(a => a.login === v.who.toLowerCase() || a.email === v.who.toLowerCase());
    S.reviewers.push({ login: x.login, name: `${x.first} ${x.last}`, email: x.email, topics: [], papers: [] });
    P.say('ok', `${x.first} ${x.last} was added as a reviewer.`); P.refresh();
  },
  async revtopics(el) {
    const r = S.reviewers.find(x => x.login === el.dataset.id);
    const v = await P.form({ title: `Topics for ${r.name}`, intro: 'This reviewer will see every paper of the ticked topics.', values: { topics: r.topics }, fields: [{ name: 'topics', label: 'Topics', type: 'checks', options: C.TOPICS }] });
    if (!v) return; r.topics = v.topics; P.say('ok', `Topics saved for ${r.name}.`); P.refresh();
  },
  async revpapers(el) {
    const r = S.reviewers.find(x => x.login === el.dataset.id);
    const v = await P.form({ title: `Single papers for ${r.name}`, values: { papers: r.papers }, fields: [{ name: 'papers', label: 'Papers', type: 'checks', options: S.papers.map(p => ({ v: p.id, l: p.title })) }] });
    if (!v) return; r.papers = v.papers; P.say('ok', `Papers saved for ${r.name}.`); P.refresh();
  },
  async revdel(el) {
    const r = S.reviewers.find(x => x.login === el.dataset.id);
    if (!await P.confirm({ title: 'Remove this reviewer?', danger: true, ok: 'Yes, remove', text: `${r.name} will no longer review any paper. Their account stays.` })) return;
    S.reviewers = S.reviewers.filter(x => x !== r); P.say('ok', `${r.name} was removed from the reviewers.`); P.refresh();
  },
  revcsv() { P.csv('reviewers.csv', [['Name', 'Login', 'Email', 'Topics', 'Single papers'], ...S.reviewers.map(r => [r.name, r.login, r.email, r.topics.join('; '), r.papers.join('; ')])]); P.say('ok', 'A CSV file of the reviewers was downloaded.'); },
  async addrev(el) {
    const p = paperById(el.dataset.id), free = S.reviewers.filter(r => !P.paperReviewers(p).includes(r));
    if (!free.length) return P.say('info', 'Every reviewer already covers this paper.');
    const v = await P.form({ title: 'Add a reviewer for this paper', intro: p.title, submit: 'Add reviewer', fields: [{ name: 'login', label: 'Reviewer', type: 'select', required: true, options: [{ v: '', l: '-- Choose a reviewer --' }, ...free.map(r => ({ v: r.login, l: r.name }))] }] });
    if (!v) return; S.reviewers.find(r => r.login === v.login).papers.push(p.id); P.say('ok', 'The reviewer was added for this paper.'); P.refresh();
  },
});
P.add({
  path: '/admin/review-papers', area: 'admin', group: 'Reviewers', nav: true, label: 'Who reviews which paper', title: 'Who reviews which paper',
  blurb: 'Check that every paper has a reviewer.',
  ref: '3.4.1 Reviewing > Papers (distribution by reviewer; filters status, type, topic)',
  note: 'Filters and “Add a reviewer” work on the sample data.',
  view: () => {
    const none = u('rp.view', 'all') === 'none', st = u('rp.status', ''), ty = u('rp.type', ''), tp = u('rp.topic', '');
    const list = S.papers.filter(p => (!none || !P.paperReviewers(p).length) && (!st || p.status === st) && (!ty || p.type === ty) && (!tp || p.topic === tp));
    return html`<p class="lead">See who reviews each paper, and add a reviewer where one is missing.</p>
      <section class="card" aria-labelledby="rf"><h2 id="rf">Show</h2><div class="filters">
        <fieldset class="field"><legend>Which papers?</legend>${rad('rp.view', 'all', 'All papers', 'all')}${rad('rp.view', 'none', 'Only papers without a reviewer', 'all')}</fieldset>
        ${sel('rp.status', 'Status', ['Initial', 'Reviewed', 'Awaiting update'], 'All statuses')}${sel('rp.type', 'Type of presentation', C.TYPES, 'All types')}${sel('rp.topic', 'Topic', C.TOPICS, 'All topics')}</div>
        <button type="button" class="btn btn-secondary" data-act="clearfilters" data-prefix="rp.">Clear all filters</button></section>
      <h2>${list.length} paper${list.length === 1 ? '' : 's'}</h2>
      ${P.table({ caption: 'Papers and their reviewers', empty: 'No paper matches. Try “Clear all filters”.', rows: list, cols: [
        { h: 'Paper', v: p => html`<strong>${p.title}</strong><br><span class="muted">${p.topic}</span>` },
        { h: 'Reviewers', v: p => { const r = P.paperReviewers(p); return r.length ? r.map(x => x.name).join(', ') : 'No reviewer yet'; } },
        { h: 'Action', v: p => html`<button type="button" class="btn btn-small" data-act="addrev" data-id="${p.id}">Add a reviewer</button>` }] })}`;
  },
});
P.add({
  path: '/admin/review-inbox', area: 'admin', group: 'Reviewers', nav: true, label: 'Papers waiting for review', title: 'Papers waiting for review (reviewer\'s own view)',
  blurb: 'What a reviewer sees when logged in.',
  ref: '3.4.1 Reviewing > New submissions',
  note: 'Shows the state seen on the live site: review period closed, nothing to review. The review form itself is not defined (blueprint decision D12), so it is not built.',
  view: () => html`<div class="alert alert-info"><span class="sym" aria-hidden="true">i</span><div><strong>Note.</strong> The review period is closed. Opening period for reviewing: not set.</div></div>
    <p class="empty">No paper to review.</p><p>The page where a reviewer writes an opinion has not been designed yet. It is waiting for the review rules (decision D12 in the blueprint).</p>`,
});
P.add({
  path: '/admin/review-done', area: 'admin', group: 'Reviewers', nav: true, label: 'Papers already reviewed', title: 'Papers already reviewed (reviewer\'s own view)',
  blurb: 'Opinions a reviewer has already given.',
  ref: '3.4.1 Reviewing > Submissions reviewed',
  note: 'Shows the empty state seen on the live site.',
  view: () => html`<p>A reviewer can change an opinion while the review period is open. After it closes, opinions can no longer be changed.</p><p class="empty">No paper reviewed.</p>`,
});

/* ================= Attendees ================= */
const REGFIELDS = () => [
  { name: 'title', label: 'Title', hint: 'For example Dr. or Ms.' }, { name: 'last', label: 'Last name', required: true }, { name: 'first', label: 'First name', required: true },
  { name: 'middle', label: 'Middle name' }, { name: 'email', label: 'Email address', type: 'email', required: true },
  { name: 'language', label: 'Language', type: 'select', options: [{ v: 'en', l: 'English' }, { v: 'fr', l: 'French' }, { v: 'es', l: 'Spanish' }] },
  { name: 'phone', label: 'Phone number' }, { name: 'institution', label: 'Institution' }, { name: 'address', label: 'Mailing address' },
  { name: 'country', label: 'Country of your organization', hint: 'A short code such as PH, as on the live site.' }, { name: 'extra', label: 'More information', type: 'textarea', rows: 3 }];
P.REGFIELDS = REGFIELDS;
const regRows = () => {
  const on = { 'Pre-registered': u('reg.pre', true), 'Needs payment': u('reg.pay', true), Registered: u('reg.ok', true) }, q = u('reg.q', '').toLowerCase();
  return S.registrations.filter(r => on[r.status] && (!q || (r.first + ' ' + r.last + ' ' + r.email).toLowerCase().includes(q)));
};
P.add({
  path: '/admin/registrations', area: 'admin', group: 'Attendees', nav: true, label: 'Registered people', title: 'Registered people',
  blurb: 'See who registered, record payments, resend confirmations.',
  ref: '3.6 Registration management > Participants',
  note: 'List, filters, details, payment, edit and CSV work on the sample data. “Send confirmation” only records a line in Sent emails. The three tick boxes follow the live site\'s “Preregisters / Need a payment / Registers”; which box matches which status is an assumption. Fees are placeholders (fee setup is not confirmed).',
  view: () => {
    const rows = regRows();
    return html`<p class="lead">Everyone who registered for the conference. Amounts are placeholders in this sample.</p>
      <div class="actions"><a class="btn btn-primary" href="#/admin/registrations/new">Register someone</a><button type="button" class="btn btn-secondary" data-act="regcsv">Download the list (CSV file)</button></div>
      <section class="card" aria-labelledby="rf"><h2 id="rf">Show</h2><div class="filters">${searchBox('reg.q', 'Search by name or email')}
        <fieldset class="field"><legend>Which people?</legend>${chk('reg.pre', 'Pre-registered', true)}${chk('reg.pay', 'Needs payment', true)}${chk('reg.ok', 'Registered', true)}</fieldset></div></section>
      <h2>${rows.length} of ${S.registrations.length} people (sample)</h2>
      ${P.table({ caption: 'Registered people', empty: 'Nobody matches. Tick more boxes or clear the search.', rows, cols: [
        { h: 'Person', v: r => html`<strong>${r.first} ${r.last}</strong><br><span class="muted">${r.email}<br>Registered on ${r.date}</span>` },
        { h: 'Status and amount', v: r => html`${P.badge(r.status)}<br><span class="muted">Total to pay: ${P.money(r.total)}</span>` },
        { h: 'Actions', v: r => html`<button type="button" class="btn btn-small" data-act="regsee" data-id="${r.id}">See details</button> <button type="button" class="btn btn-small" data-act="regpay" data-id="${r.id}">Payment</button> <button type="button" class="btn btn-small" data-act="regmail" data-id="${r.id}">Send confirmation</button> <button type="button" class="btn btn-small btn-secondary" data-act="regedit" data-id="${r.id}">Edit</button>` }] })}`;
  },
});
const regById = id => S.registrations.find(r => r.id === id);
Object.assign(P.act, {
  regsee(el) {
    const r = regById(el.dataset.id), rows = [['Title', r.title], ['Name', `${r.first} ${r.middle} ${r.last}`], ['Email', r.email], ['Language', r.language], ['Phone', r.phone], ['Institution', r.institution], ['Address', r.address], ['Country', r.country], ['More information', r.extra || '(none)'], ['Status', r.status], ['Total to pay', P.money(r.total)]];
    P.show(`${r.first} ${r.last}`, html`<dl class="dl">${rows.map(([k, v]) => html`<dt>${k}</dt><dd>${v}</dd>`)}</dl>`);
  },
  async regpay(el) {
    const r = regById(el.dataset.id);
    const v = await P.form({ title: `Payment for ${r.first} ${r.last}`, values: { status: r.status, total: String(r.total) }, fields: [
      { name: 'status', label: 'Status', type: 'select', options: C.REG_STATUS }, { name: 'total', label: 'Total to pay (€)', type: 'number', min: 0, required: true, hint: 'Fees are not defined in the blueprint, so this is a free number here.' }] });
    if (!v) return; r.status = v.status; r.total = +v.total; P.say('ok', `Payment information saved for ${r.first} ${r.last}.`); P.refresh();
  },
  async regmail(el) {
    const r = regById(el.dataset.id);
    if (!await P.confirm({ title: 'Send the registration confirmation?', ok: 'Yes, record it', text: `A confirmation email to ${r.email} would be sent. In this prototype no email is sent; a line is added to “Sent emails”.` })) return;
    P.logMail('[MIRC 2026] Registration confirmation', r.email, 'Registration confirmation (sample)'); P.say('ok', `A confirmation to ${r.email} was recorded in “Sent emails”. No real email was sent.`);
  },
  async regedit(el) {
    const r = regById(el.dataset.id);
    const v = await P.form({ title: `Edit ${r.first} ${r.last}`, values: r, fields: REGFIELDS() }); if (!v) return;
    Object.assign(r, v); P.say('ok', 'The details were saved.'); P.refresh();
  },
  regcsv() { P.csv('registrations.csv', [['First name', 'Last name', 'Email', 'Institution', 'Country', 'Status', 'Total (EUR)', 'Registered on'], ...regRows().map(r => [r.first, r.last, r.email, r.institution, r.country, r.status, r.total, r.date])]); P.say('ok', 'A CSV file of the people shown was downloaded.'); },
});
P.defForm('reg-new', {
  fields: () => REGFIELDS(), submit: 'Register this person',
  run: v => { S.registrations.push({ id: 'r' + Date.now(), status: 'Pre-registered', total: 0, date: new Date().toISOString().slice(0, 16).replace('T', ' '), ...v }); delete P.ui['regnew.pick']; delete P.ui['regnew.q']; P.goSay('/admin/registrations', 'ok', `${v.first} ${v.last} was registered.`); },
});
P.add({
  path: '/admin/registrations/new', area: 'admin', group: 'Attendees', parent: '/admin/registrations', title: 'Register someone', crumb: 'Register someone',
  ref: '3.6 Register someone (search an existing account, then register)',
  note: 'Searches the sample accounts. A real registration needs the account system. Status starts as “Pre-registered”.',
  view: () => {
    const pick = u('regnew.pick', ''), q = u('regnew.q', '').toLowerCase();
    if (pick) { const x = S.users.find(a => a.login === pick); return html`<p class="lead">Check the details of <strong>${x.first} ${x.last}</strong>, then register them.</p><button type="button" class="btn btn-secondary" data-act="setui" data-k="regnew.pick" data-v="">Choose another person</button>${P.formHTML('reg-new', { first: x.first, last: x.last, email: x.email })}`; }
    const taken = new Set(S.registrations.map(r => r.email)), found = q.length < 2 ? [] : S.users.filter(a => !taken.has(a.email) && (a.first + ' ' + a.last + ' ' + a.login).toLowerCase().includes(q));
    return html`<p class="lead">The person must already have an account. Type the first letters of the name.</p>${searchBox('regnew.q', 'Name of the person', 'Type at least 2 letters. Try “a”, then a second letter.')}
      ${q.length < 2 ? '' : found.length ? html`<ul class="results">${found.map(a => html`<li>${a.first} ${a.last} <span class="muted">(${a.email})</span> <button type="button" class="btn btn-small" data-act="setui" data-k="regnew.pick" data-v="${a.login}">Choose</button></li>`)}</ul>` : html`<p class="empty">No account found, or the person is already registered.</p>`}
      <p>Person has no account yet? <a href="#/admin/accounts/new">Add a user account</a>.</p>`;
  },
});
P.defForm('account-new', {
  submit: 'Create the account', cancel: '#/admin',
  fields: () => [{ name: 'email', label: 'Email address', type: 'email', required: true }, { name: 'login', label: 'Login (user name)', required: true, hint: 'The name the person types to sign in.' },
    { name: 'pwd', label: 'Password', type: 'password', required: true, autocomplete: 'new-password', hint: '7 to 20 letters or numbers.' },
    { name: 'pwd2', label: 'Type the password again', type: 'password', required: true, autocomplete: 'new-password' },
    { name: 'last', label: 'Last name', required: true }, { name: 'first', label: 'First name', required: true }],
  check: v => {
    const e = {};
    if (v.pwd && !/^[A-Za-z0-9]{7,20}$/.test(v.pwd)) e.pwd = 'Use 7 to 20 letters or numbers, without spaces or symbols.';
    if (v.pwd2 && v.pwd !== v.pwd2) e.pwd2 = 'The two passwords are not the same.';
    if (S.users.some(a => a.login === v.login.toLowerCase())) e.login = 'This login is already used. Please choose another.';
    if (S.users.some(a => a.email === v.email.toLowerCase())) e.email = 'An account with this email already exists.';
    return e;
  },
  run: v => { S.users.push({ login: v.login.toLowerCase(), first: v.first, last: v.last, email: v.email.toLowerCase() }); P.say('ok', `The account for ${v.first} ${v.last} was created. On the real site it is valid at once and no email is sent. The password is not kept in this prototype.`); P.refresh(); },
});
P.add({
  path: '/admin/accounts/new', area: 'admin', group: 'Attendees', nav: true, label: 'Add a user account', title: 'Add a user account',
  blurb: 'Create an account for someone who does not have one.',
  ref: '3.7 Administration > Create account',
  note: 'Validation (including the 7–20 letters/numbers password rule) is real. Nothing is stored except the name, login and email in memory; passwords are never kept. Real accounts need an authentication service.',
  view: () => html`<p class="lead">The new account is valid straight away. No email is sent to the person.</p>${P.formHTML('account-new', {})}`,
});

/* ================= Program ================= */
const EVLBL = { Session: 'Session (talks on one topic)', 'Speech/Intervention': 'Speech (for example an opening)', Logistics: 'Practical item (for example registration)', Break: 'Break (coffee or lunch)', Tour: 'Tour or outing' };
const eventTitle = e => e.type === 'Session' ? e.topic : e.title;
const dayOpts = () => C.DAYS.map(d => ({ v: d, l: dayLabel(d) }));
const eventFields = type => {
  const base = [{ name: 'date', label: 'Day', type: 'select', required: true, options: dayOpts() }, { name: 'start', label: 'Starts at', type: 'time', step: 300, required: true }, { name: 'end', label: 'Ends at', type: 'time', step: 300, required: true }];
  const room = { name: 'room', label: 'Room', type: 'select', options: roomOpts() }, file = { name: 'file', label: 'Attach a file (optional)', type: 'file', hint: 'Only the file name is kept in this prototype.' };
  const title = { name: 'title', label: 'Title', required: true }, desc = { name: 'description', label: 'Description', type: 'textarea', rows: 3 };
  return { Session: [...base, { name: 'topic', label: 'Topic of the session', type: 'select', required: true, options: [{ v: '', l: '-- Choose a topic --' }, ...C.TOPICS] }, { name: 'chair', label: 'Chair or speaker' }, room],
    'Speech/Intervention': [...base, { name: 'chair', label: 'Chair' }, title, room, file], Logistics: [...base, title, desc, file],
    Break: [...base, { name: 'breakType', label: 'Kind of break', type: 'select', options: ['Coffee break', 'Lunch', 'Other'], hint: 'The list of break kinds is not confirmed in the blueprint.' }, title, room, file], Tour: [...base, title, desc, file] }[type];
};
const timeCheck = v => v.end && v.start && v.end <= v.start ? { end: 'The end time must be after the start time.' } : {};
const byStart = (a, b) => a.start.localeCompare(b.start);
P.add({
  path: '/admin/schedule', area: 'admin', group: 'Program', nav: true, label: 'Schedule', title: 'Schedule: days, sessions and talks',
  blurb: 'Add sessions, breaks and talks for each day.',
  ref: '3.3.3 Program > Administration (event editor: Session, Speech/Intervention, Logistics, Break, Tour; add a communication; CSV export)',
  note: 'Adding, changing and deleting events and talks, and the CSV download, work on the sample data. Break kinds and the file attachment are simplified (names only).',
  view: () => {
    const day = u('sched.day', C.DAYS[2]), evs = S.events.filter(e => e.date === day).sort(byStart);
    return html`<p class="lead">Pick a day, then add or change what happens that day. A “session” holds talks (papers).</p>
      ${P.tabs('sched.day', C.DAYS.map(d => [d, dayLabel(d)]), 'Choose a day', day)}
      <div class="actions"><button type="button" class="btn btn-primary" data-act="evadd" data-day="${day}">Add an event on this day</button><button type="button" class="btn btn-secondary" data-act="schedcsv">Download the whole program (CSV file)</button></div>
      <h2>${dayLabel(day)}</h2>
      ${evs.length ? html`<div class="table-wrap"><table><caption class="sr-only">Events on ${dayLabel(day)}</caption><thead><tr><th scope="col">Time</th><th scope="col">Kind</th><th scope="col">What</th><th scope="col" class="col-actions">Actions</th></tr></thead><tbody>
        ${evs.map(e => html`<tr><td data-label="Time">${e.start} to ${e.end}</td><td data-label="Kind">${EVLBL[e.type].split(' (')[0]}</td><td data-label="What"><strong>${eventTitle(e)}</strong>${e.room ? html`<br><span class="muted">${roomName(e.room)}</span>` : ''}${e.chair ? html`<br><span class="muted">Chair: ${e.chair}</span>` : ''}</td>
          <td data-label="Actions" class="col-actions"><div class="row-actions"><button type="button" class="btn btn-small" data-act="evedit" data-id="${e.id}">Change</button> ${e.type === 'Session' ? html`<button type="button" class="btn btn-small" data-act="comadd" data-id="${e.id}">Add a talk</button>` : ''} <button type="button" class="btn btn-small btn-secondary" data-act="evdel" data-id="${e.id}">Delete</button></div></td></tr>
          ${e.comms.slice().sort(byStart).map(c => html`<tr class="sub"><td data-label="Time">${c.start} to ${c.end}</td><td data-label="Kind">Talk</td><td data-label="What">↳ ${paperById(c.paperId)?.title || '(paper deleted)'}${c.speaker ? html`<br><span class="muted">Speaker: ${c.speaker}</span>` : ''}</td>
            <td data-label="Actions" class="col-actions"><div class="row-actions"><button type="button" class="btn btn-small btn-secondary" data-act="comdel" data-ev="${e.id}" data-id="${c.paperId}">Remove talk</button></div></td></tr>`)}`)}</tbody></table></div>` : html`<p class="empty">Nothing is planned for this day yet. Choose “Add an event on this day”.</p>`}`;
  },
});
Object.assign(P.act, {
  async evadd(el) { await eventDialog(null, el.dataset.day); },
  async evedit(el) { await eventDialog(S.events.find(e => e.id === el.dataset.id)); },
  async evdel(el) {
    const e = S.events.find(x => x.id === el.dataset.id);
    if (!await P.confirm({ title: 'Delete this event?', danger: true, ok: 'Yes, delete it', text: `“${eventTitle(e)}”${e.comms.length ? ` and its ${e.comms.length} talk${e.comms.length > 1 ? 's' : ''}` : ''} will be removed from the program. The papers themselves stay.` })) return;
    S.events = S.events.filter(x => x !== e); P.say('ok', 'The event was deleted.'); P.refresh();
  },
  async comadd(el) {
    const e = S.events.find(x => x.id === el.dataset.id), used = new Set(S.events.flatMap(x => x.comms.map(c => c.paperId)));
    const free = S.papers.filter(p => p.status === 'Accepted' && p.topic === e.topic && !used.has(p.id));
    if (!free.length) return P.show('No paper to add', html`<p>There is no accepted paper on the topic “${e.topic}” that is not already in the program.</p>`);
    const v = await P.form({ title: 'Add a talk to this session', intro: `Session: ${e.topic}`, submit: 'Add the talk', values: { start: e.start, end: e.end }, check: timeCheck, fields: [
      { name: 'paperId', label: 'Paper', type: 'select', required: true, options: [{ v: '', l: '-- Choose a paper --' }, ...free.map(p => ({ v: p.id, l: p.title }))] },
      { name: 'start', label: 'Starts at', type: 'time', step: 300, required: true }, { name: 'end', label: 'Ends at', type: 'time', step: 300, required: true }, { name: 'speaker', label: 'Speaker' }] });
    if (!v) return; e.comms.push(v); P.say('ok', 'The talk was added to the session.'); P.refresh();
  },
  async comdel(el) {
    const e = S.events.find(x => x.id === el.dataset.ev);
    if (!await P.confirm({ title: 'Remove this talk from the session?', danger: true, ok: 'Yes, remove it', text: 'The paper stays in the system. It only leaves this session.' })) return;
    e.comms = e.comms.filter(c => c.paperId !== el.dataset.id); P.say('ok', 'The talk was removed from the session.'); P.refresh();
  },
  schedcsv() { P.csv('program.csv', [['Day', 'Start', 'End', 'Kind', 'Title or topic', 'Room', 'Chair', 'Talk', 'Speaker'], ...S.events.slice().sort((a, b) => a.date.localeCompare(b.date) || byStart(a, b)).flatMap(e => [[e.date, e.start, e.end, e.type, eventTitle(e), roomName(e.room), e.chair, '', ''], ...e.comms.map(c => [e.date, c.start, c.end, 'Talk', eventTitle(e), roomName(e.room), '', paperById(c.paperId)?.title || '', c.speaker])])]); P.say('ok', 'A CSV file of the program was downloaded.'); },
});
async function eventDialog(e, day) {
  let type = e?.type;
  if (!type) {
    const v = await P.form({ title: 'Add an event: step 1 of 2', submit: 'Next', fields: [{ name: 'type', label: 'What kind of event is it?', type: 'select', required: true, options: [{ v: '', l: '-- Choose a kind --' }, ...C.EVENT_TYPES.map(t => ({ v: t, l: EVLBL[t] }))] }] });
    if (!v) return; type = v.type;
  }
  const v = await P.form({ title: `${e ? 'Change' : 'Add'} event: ${EVLBL[type].split(' (')[0]}${e ? '' : ' (step 2 of 2)'}`, submit: e ? 'Save changes' : 'Add the event', fields: eventFields(type), values: e ? { ...e } : { date: day || C.DAYS[2] }, check: timeCheck });
  if (!v) return;
  if (e) { if (!v.file) v.file = e.file; Object.assign(e, v); } else S.events.push({ id: 'e' + Date.now(), type, title: '', topic: '', chair: '', room: '', description: '', breakType: '', file: '', comms: [], ...v });
  P.ui['sched.day'] = v.date; P.say('ok', `The event was ${e ? 'saved' : 'added'}.`); P.refresh();
}
const roomFields = () => [{ name: 'name', label: 'Room name', required: true }, { name: 'capacity', label: 'Number of seats', type: 'number', min: 0 }, { name: 'description', label: 'Description', type: 'textarea', rows: 3 }];
P.add({
  path: '/admin/rooms', area: 'admin', group: 'Program', nav: true, label: 'Rooms', title: 'Rooms', blurb: 'The rooms you can use in the schedule.',
  ref: '3.3.2 Program > Rooms (name, capacity, description)', note: 'Add, change and delete work on the sample data.',
  view: () => html`<p class="lead">Rooms appear in the schedule when you plan a session or a speech.</p>
    <div class="actions"><button type="button" class="btn btn-primary" data-act="roomadd">Add a room</button></div>
    ${P.table({ caption: 'Rooms', empty: 'No room yet. Choose “Add a room”.', rows: S.rooms, cols: [{ h: 'Room', v: r => html`<strong>${r.name}</strong>` }, { h: 'Seats', v: r => r.capacity ?? '' }, { h: 'Description', v: 'description' },
      { h: 'Actions', v: r => html`<button type="button" class="btn btn-small" data-act="roomedit" data-id="${r.id}">Change</button> <button type="button" class="btn btn-small btn-secondary" data-act="roomdel" data-id="${r.id}">Delete</button>` }] })}`,
});
Object.assign(P.act, {
  async roomadd() { const v = await P.form({ title: 'Add a room', fields: roomFields(), submit: 'Add the room' }); if (!v) return; S.rooms.push({ id: 'rm' + Date.now(), ...v }); P.say('ok', 'The room was added.'); P.refresh(); },
  async roomedit(el) { const r = S.rooms.find(x => x.id === el.dataset.id), v = await P.form({ title: 'Change room', fields: roomFields(), values: r }); if (!v) return; Object.assign(r, v); P.say('ok', 'The room was saved.'); P.refresh(); },
  async roomdel(el) {
    const r = S.rooms.find(x => x.id === el.dataset.id), used = S.events.filter(e => e.room === r.id).length;
    if (!await P.confirm({ title: 'Delete this room?', danger: true, ok: 'Yes, delete it', text: used ? `${r.name} is used by ${used} event${used > 1 ? 's' : ''}. Those events will have no room.` : `${r.name} will be removed.` })) return;
    S.events.forEach(e => { if (e.room === r.id) e.room = ''; }); S.rooms = S.rooms.filter(x => x !== r); P.say('ok', 'The room was deleted.'); P.refresh();
  },
});
P.defForm('program-display', {
  fields: () => [{ name: 'showPapers', label: 'Show the papers (talks and abstracts) in the public program?', type: 'radio', options: [{ v: 'yes', l: 'Yes, show them' }, { v: 'no', l: 'No, show only the sessions' }] }],
  run: v => { S.settings.showPapers = v.showPapers; P.say('ok', 'Saved. Open “See the public website” to check the program page.'); P.refresh(); },
});
P.add({
  path: '/admin/program-display', area: 'admin', group: 'Program', nav: true, label: 'Program display', title: 'Program display', blurb: 'Choose whether visitors see the papers in the program.',
  ref: '3.3.1 Program > Appearance (PROGRAM_SHOWPAPERS Yes/No)', note: 'The setting changes the public program page in this prototype.',
  view: () => html`<p class="lead">This changes what visitors see on the “Detailed Conference Program” page.</p>${P.formHTML('program-display', { showPapers: S.settings.showPapers })}`,
});

/* ================= Email ================= */
const RIGHTS = ['Webmaster', 'Administrative', 'Reviewer', 'Redactor', 'Administrator', 'Coordinator', 'Reviewer with at least one non-reviewed paper'];
const SUBTYPES = ['Poster Presentation', 'Oral Presentation'];
const mailGroups = () => [
  { label: 'People with a role on the site', options: RIGHTS.map(x => ({ v: 'rights:' + x, l: x })) },
  { label: 'People who sent in a paper', options: [{ v: 'sub:*:*', l: 'Submitted (all)' }, ...C.STATUSES.map(s => ({ v: `sub:${s}:*`, l: s })),
    ...SUBTYPES.flatMap(t => [{ v: `sub:*:${t}`, l: `Submitted (${t})` }, ...C.STATUSES.map(s => ({ v: `sub:${s}:${t}`, l: `${s} (${t})` }))])] },
  { label: 'People who registered (entries not confirmed)', options: [{ v: 'reg:*', l: 'Everyone registered' }, ...C.REG_STATUS.map(s => ({ v: 'reg:' + s, l: s }))] },
  ...(S.lists.length ? [{ label: 'Your mailing lists (assumed)', options: S.lists.map(l => ({ v: 'list:' + l.id, l: l.title })) }] : [])];
const groupLabel = k => mailGroups().flatMap(g => g.options).find(o => o.v === k)?.l || '';
const recipientCount = k => {
  if (!k) return 0;
  const [kind, a, b] = k.split(':');
  if (kind === 'rights') return a.startsWith('Reviewer with') ? S.reviewers.filter(r => r.papers.length || r.topics.length).length : S.rightsGroups[a] ?? 0;
  if (kind === 'sub') return S.papers.filter(p => (a === '*' || p.status === a) && (b === '*' || p.type === b)).length;
  if (kind === 'reg') return S.registrations.filter(r => a === '*' || r.status === a).length;
  return S.lists.find(l => l.id === a)?.members.length || 0;
};
const extraList = s => (s || '').split(/[,;\s]+/).filter(Boolean);
P.defForm('mail-send', {
  submit: 'Send the email', moreLabel: 'More options (their exact meaning is not confirmed)',
  fields: () => [
    { name: 'recipients', label: 'Send to', type: 'select', groups: mailGroups(), options: [{ v: '', l: '-- Choose a group of people --' }] },
    { name: 'extra', label: 'Or type email addresses', hint: 'Separate several addresses with commas.', check: v => extraList(v).every(x => EMAIL.test(x)) ? '' : 'One of the addresses does not look right.' },
    { name: 'template', label: 'Start from a ready-made message (optional)', type: 'select', options: [{ v: '', l: '-- No ready-made message --' }, ...S.templates.map(t => ({ v: t.id, l: t.name }))], attrs: 'data-onchange="filltpl"' },
    { name: 'subject', label: 'Subject', required: true }, { name: 'message', label: 'Message', type: 'textarea', rows: 10, required: true },
    { name: 'attach', label: 'Attach a file (optional)', type: 'file', hint: 'Up to 200 MB. Only the name is kept in this prototype.' },
    { name: 'corresponding', label: 'Corresponding', type: 'select', options: ['No', 'Yes'], more: true }, { name: 'ccadmin', label: 'Copy to administrator', type: 'select', options: ['No', 'Yes'], more: true },
    { name: 'notification', label: 'Notification', type: 'select', options: ['No', 'Yes'], more: true }],
  check: v => (!v.recipients && !extraList(v.extra).length) ? { recipients: 'Choose a group, or type at least one email address.' } : {},
  run: async v => {
    const n = recipientCount(v.recipients) + extraList(v.extra).length;
    if (!await P.confirm({ title: 'Send this email?', ok: 'Yes, record it as sent', text: html`This would go to about <strong>${n}</strong> ${n === 1 ? 'person' : 'people'} (sample numbers). In this prototype no email is sent; a line is added to “Sent emails”.` })) return;
    P.logMail(v.subject, [groupLabel(v.recipients), ...extraList(v.extra)].filter(Boolean).join(', '), v.message);
    P.goSay('/admin/mail/history', 'ok', 'The email was recorded in “Sent emails”. No real email was sent.');
  },
});
P.act.filltpl = el => { const t = S.templates.find(x => x.id === el.value); if (t) { $('#f-subject').value = t.subject; $('#f-message').value = t.body; } };
P.add({
  path: '/admin/mail', area: 'admin', group: 'Email', nav: true, label: 'Send an email', title: 'Send an email', blurb: 'Write a message to a group of people.',
  ref: '3.5 Mailing management > Mailing (recipient groups, template, subject, content, attachment, three yes/no options)',
  note: 'The form, group choice, ready-made message fill-in and the count are real. Sending is simulated: nothing leaves the browser. The real service has limits (blueprint 12.5: 100 emails per day on the free plan).',
  view: () => html`<p class="lead">Choose who gets the message, write it, and send. You will be asked to confirm first.</p>${P.formHTML('mail-send', {})}`,
});
const tplFields = () => [{ name: 'subject', label: 'Subject', required: true }, { name: 'body', label: 'Message', type: 'textarea', rows: 10, required: true }];
P.add({
  path: '/admin/mail/templates', area: 'admin', group: 'Email', nav: true, label: 'Ready-made messages', title: 'Ready-made messages (email templates)', blurb: 'Change the wording of messages that are sent often.',
  ref: '3.5 Mailing management > Templates (registration, submission, custom; modify, get the original, delete)',
  note: 'Create, change, restore and delete work on the sample text. The real wording and the list of tags (for example the paper tag) are not in the blueprint.',
  view: () => html`<p class="lead">These messages can be used when you send an email.</p><div class="actions"><button type="button" class="btn btn-primary" data-act="tpladd">Create a message</button></div>
    ${['Registration', 'Submission', 'Custom'].map(g => html`<h2>${g === 'Custom' ? 'Your own messages' : g + ' messages'}</h2>${P.table({ caption: g, empty: 'None yet.', rows: S.templates.filter(t => t.group === g), cols: [{ h: 'Message', v: t => html`<strong>${t.name}</strong>` },
      { h: 'Actions', v: t => html`<button type="button" class="btn btn-small" data-act="tpledit" data-id="${t.id}">Change wording</button> <button type="button" class="btn btn-small" data-act="tplreset" data-id="${t.id}">Restore the original</button> <button type="button" class="btn btn-small btn-secondary" data-act="tpldel" data-id="${t.id}">Delete</button>` }] })}`)}`,
});
Object.assign(P.act, {
  async tpladd() {
    const v = await P.form({ title: 'Create a message', submit: 'Create', fields: [{ name: 'group', label: 'Kind', type: 'select', options: ['Registration', 'Submission', 'Custom'], value: 'Custom' }, { name: 'name', label: 'Name of the message', required: true }, ...tplFields()] });
    if (!v) return; S.templates.push({ id: 't' + Date.now(), ...v, originalSubject: v.subject, originalBody: v.body }); P.say('ok', 'The message was created.'); P.refresh();
  },
  async tpledit(el) { const t = S.templates.find(x => x.id === el.dataset.id), v = await P.form({ title: t.name, values: t, fields: tplFields() }); if (!v) return; Object.assign(t, v); P.say('ok', 'The wording was saved.'); P.refresh(); },
  async tplreset(el) {
    const t = S.templates.find(x => x.id === el.dataset.id);
    if (!await P.confirm({ title: 'Restore the original wording?', ok: 'Yes, restore it', text: `Your changes to “${t.name}” will be lost.` })) return;
    t.subject = t.originalSubject; t.body = t.originalBody; P.say('ok', 'The original wording was restored.'); P.refresh();
  },
  async tpldel(el) {
    const t = S.templates.find(x => x.id === el.dataset.id);
    if (!await P.confirm({ title: 'Delete this message?', danger: true, ok: 'Yes, delete it', text: `“${t.name}” will be removed.` })) return;
    S.templates = S.templates.filter(x => x !== t); P.say('ok', 'The message was deleted.'); P.refresh();
  },
});
const listFields = () => [{ name: 'title', label: 'Name of the list', required: true }, { name: 'members', label: 'Email addresses', type: 'textarea', rows: 6, required: true, hint: 'One address per line.',
  check: v => v.split(/\r?\n/).map(x => x.trim()).filter(Boolean).every(x => EMAIL.test(x)) ? '' : 'One of the lines is not an email address.' }];
const listVals = l => l && { title: l.title, members: l.members.join('\n') };
const parseMembers = s => s.split(/\r?\n/).map(x => x.trim()).filter(Boolean);
P.add({
  path: '/admin/mail/lists', area: 'admin', group: 'Email', nav: true, label: 'Mailing lists', title: 'Mailing lists', blurb: 'Save groups of addresses you write to often.',
  ref: '3.5 Mailing management > Mailing lists (New list; the live site shows “No mailing list” at first)',
  note: 'Create, change and delete work on the sample data. Lists also appear as a group in “Send an email” (assumption).',
  view: () => html`<p class="lead">A mailing list is a saved group of email addresses.</p><div class="actions"><button type="button" class="btn btn-primary" data-act="listadd">New list</button></div>
    ${P.table({ caption: 'Mailing lists', empty: 'No mailing list yet. Choose “New list”.', rows: S.lists, cols: [{ h: 'Name', v: l => html`<strong>${l.title}</strong>` }, { h: 'Addresses', v: l => l.members.length },
      { h: 'Actions', v: l => html`<button type="button" class="btn btn-small" data-act="listedit" data-id="${l.id}">Change</button> <button type="button" class="btn btn-small btn-secondary" data-act="listdel" data-id="${l.id}">Delete</button>` }] })}`,
});
Object.assign(P.act, {
  async listadd() { const v = await P.form({ title: 'New list', fields: listFields(), submit: 'Create the list' }); if (!v) return; S.lists.push({ id: 'l' + Date.now(), title: v.title, members: parseMembers(v.members) }); P.say('ok', 'The list was created.'); P.refresh(); },
  async listedit(el) { const l = S.lists.find(x => x.id === el.dataset.id), v = await P.form({ title: 'Change list', fields: listFields(), values: listVals(l) }); if (!v) return; l.title = v.title; l.members = parseMembers(v.members); P.say('ok', 'The list was saved.'); P.refresh(); },
  async listdel(el) { const l = S.lists.find(x => x.id === el.dataset.id); if (!await P.confirm({ title: 'Delete this list?', danger: true, ok: 'Yes, delete it', text: `“${l.title}” will be removed. The people on it are not affected.` })) return; S.lists = S.lists.filter(x => x !== l); P.say('ok', 'The list was deleted.'); P.refresh(); },
});
const aliasFields = () => [{ name: 'name', label: 'Alias name', required: true }, { name: 'content', label: 'Content', type: 'textarea', rows: 4, hint: 'What an alias contains is not described in the blueprint, so this is a plain text box.' }];
P.add({
  path: '/admin/mail/aliases', area: 'admin', group: 'Email', nav: true, label: 'Email aliases', title: 'Email aliases', blurb: 'Manage the sender address names of the conference.',
  ref: '3.5 Mailing management > Alias (select an alias or create a new one)',
  note: 'Interface only. The real meaning and fields of an alias are not described in the blueprint.',
  view: () => html`<p class="lead">Aliases are the email address names used by the conference.</p><div class="actions"><button type="button" class="btn btn-primary" data-act="aliasadd">Create a new alias</button></div>
    ${P.table({ caption: 'Aliases', empty: 'No alias yet.', rows: S.aliases, cols: [{ h: 'Alias', v: a => html`<strong>${a.name}</strong>` }, { h: 'Content', v: a => a.content || '(empty)' },
      { h: 'Actions', v: a => html`<button type="button" class="btn btn-small" data-act="aliasedit" data-id="${a.id}">Change</button> <button type="button" class="btn btn-small btn-secondary" data-act="aliasdel" data-id="${a.id}">Delete</button>` }] })}`,
});
Object.assign(P.act, {
  async aliasadd() { const v = await P.form({ title: 'Create a new alias', fields: aliasFields(), submit: 'Create' }); if (!v) return; S.aliases.push({ id: 'a' + Date.now(), ...v }); P.say('ok', 'The alias was created.'); P.refresh(); },
  async aliasedit(el) { const a = S.aliases.find(x => x.id === el.dataset.id), v = await P.form({ title: 'Change alias', fields: aliasFields(), values: a }); if (!v) return; Object.assign(a, v); P.say('ok', 'The alias was saved.'); P.refresh(); },
  async aliasdel(el) { const a = S.aliases.find(x => x.id === el.dataset.id); if (!await P.confirm({ title: 'Delete this alias?', danger: true, ok: 'Yes, delete it', text: `“${a.name}” will be removed.` })) return; S.aliases = S.aliases.filter(x => x !== a); P.say('ok', 'The alias was deleted.'); P.refresh(); },
});
P.defForm('mail-look', {
  fields: () => [{ name: 'header', label: 'Top of every email (HTML)', type: 'textarea', rows: 5, hint: 'A real editor would be used on the live site.' },
    { name: 'font', label: 'Letter style', type: 'select', options: ['Sans-serif', 'Serif'], hint: 'The list of styles is not confirmed in the blueprint.' }, { name: 'footer', label: 'Bottom of every email', type: 'select', options: ['Standard', 'None'], hint: 'The list of footers is not confirmed in the blueprint.' }],
  run: v => { Object.assign(S.mailLook, v); P.say('ok', 'The email look was saved.'); P.refresh(); },
});
P.act.mailpreview = () => { const t = $('#f-header'); P.show('Preview of the top of an email', html`<iframe class="preview" sandbox title="Preview of the email header" srcdoc="${t ? t.value : S.mailLook.header}"></iframe>`); };
P.add({
  path: '/admin/mail/look', area: 'admin', group: 'Email', nav: true, label: 'Email look', title: 'Email look', blurb: 'Choose how emails look.',
  ref: '3.5 Mailing management > Appearance (MAILSKIN_HEADER, MAILSKIN_TYPO, MAILSKIN_FOOTER, Preview)',
  note: 'Saving and the preview work (the preview runs in a sandboxed frame). Options for letter style and footer are guesses because the blueprint does not list them.',
  view: () => html`<p class="lead">This sets the look of every email the system sends.</p><div class="actions"><button type="button" class="btn btn-secondary" data-act="mailpreview">Show a preview</button></div>${P.formHTML('mail-look', S.mailLook)}`,
});
P.add({
  path: '/admin/mail/history', area: 'admin', group: 'Email', nav: true, label: 'Sent emails', title: 'Sent emails', blurb: 'See the emails the system has sent.',
  ref: '3.5 Mailing management > History (filter by recipient; subject, recipients, date, view)',
  note: 'Lists only the emails you “sent” in this prototype. Each is marked as simulated; none was really sent.',
  view: () => {
    const q = u('hist.q', '').toLowerCase(), rows = S.mailLog.filter(m => !q || m.to.toLowerCase().includes(q));
    return html`<p class="lead">A record of every email. In this prototype the records are only pretend.</p>${searchBox('hist.q', 'Find by recipient')}
      ${P.table({ caption: 'Sent emails', empty: S.mailLog.length ? 'No email matches this search.' : 'No email has been sent yet. Try “Send an email”.', rows, cols: [{ h: 'Subject', v: m => html`<strong>${m.subject}</strong><br><span class="muted">Simulated, not really sent</span>` }, { h: 'Sent to', v: 'to' }, { h: 'Date', v: 'date' },
        { h: 'Actions', v: m => html`<button type="button" class="btn btn-small" data-act="mailview" data-id="${m.id}">Read it</button>` }] })}`;
  },
});
P.act.mailview = el => { const m = S.mailLog.find(x => x.id === el.dataset.id); P.show(m.subject, html`<p><strong>To:</strong> ${m.to}</p><p><strong>Date:</strong> ${m.date}</p>${P.text(m.body)}`); };

/* ================= Website ================= */
const ALLROLES = C.ROLES.length;
const rightsText = a => !a.length ? 'Nobody (built-in)' : a.length === ALLROLES ? 'Everyone' : a.join(', ');
const kindLabel = p => p.kind === 'folder' ? 'Folder' : ({ home: 'Built-in page', program: 'Built-in page', registration: 'Built-in page', participants: 'List of participants', submission: 'Abstract submission', text: 'Text page', link: 'Web link', news: 'News', planned: p.type + ' (not built here)' })[p.kind];
const folders = () => S.pages.filter(p => p.kind === 'folder');
const pageFields = () => [{ name: 'title', label: 'Title in the menu', required: true }, { name: 'folder', label: 'Put it in a folder', type: 'select', options: [{ v: '', l: '(no folder)' }, ...folders().map(f => ({ v: f.id, l: f.title }))] },
  { name: 'consult', label: 'Who can read this page', type: 'checks', options: C.ROLES, required: true }, { name: 'edit', label: 'Who can change this page', type: 'checks', options: C.ROLES }];
P.add({
  path: '/admin/pages', area: 'admin', group: 'Website', nav: true, label: 'Pages and menu', title: 'Pages and menu', blurb: 'Add, change or remove the pages visitors see.',
  ref: '3.2 Website > Pages (add page with 13 types, add folder, modify, update page content, drop; per-page rights)',
  note: 'Everything works on the sample data and changes the public preview menu. Rights decide who sees each menu item in “Viewing as”. The text box is a plain box; the live site has a full text editor.',
  view: () => html`<p class="lead">Each row is a page in the website menu. “Who can read” decides which visitors see it.</p>
    <div class="actions"><button type="button" class="btn btn-primary" data-act="pgadd">Add a page</button><button type="button" class="btn btn-secondary" data-act="fladd">Add a folder</button></div>
    ${P.table({ caption: 'Pages in the website menu', empty: 'No page yet.', rows: S.pages, cols: [
      { h: 'Page', v: p => html`<strong>${p.title}</strong><br><span class="muted">${kindLabel(p)}${p.folder ? ` · in folder “${S.pages.find(f => f.id === p.folder)?.title}”` : ''}</span>` },
      { h: 'Who can read', v: p => p.kind === 'folder' ? '' : rightsText(p.consult) }, { h: 'Who can change', v: p => p.kind === 'folder' ? '' : rightsText(p.edit) },
      { h: 'Actions', v: p => p.kind === 'folder' ? html`<button type="button" class="btn btn-small" data-act="flren" data-id="${p.id}">Rename</button> <button type="button" class="btn btn-small btn-secondary" data-act="pgdel" data-id="${p.id}">Remove</button>`
        : html`${p.kind === 'text' || p.kind === 'link' ? html`<button type="button" class="btn btn-small" data-act="pgtext" data-id="${p.id}">${p.kind === 'link' ? 'Change the link' : 'Change the text'}</button> ` : ''}<button type="button" class="btn btn-small" data-act="pgset" data-id="${p.id}">Settings</button> <button type="button" class="btn btn-small btn-secondary" data-act="pgdel" data-id="${p.id}">Remove</button>` }] })}`,
});
const pageById = id => S.pages.find(p => p.id === id);
Object.assign(P.act, {
  async pgadd() {
    const v = await P.form({ title: 'Add a page', submit: 'Add the page', fields: [{ name: 'type', label: 'Kind of page', type: 'select', required: true, options: [{ v: '', l: '-- Choose a kind --' }, ...C.PAGE_TYPES], hint: '“Customizable page” is a normal text page.' },
      { name: 'title', label: 'Title in the menu', required: true }, { name: 'url', label: 'Web address (only for “Web link”)', hint: 'Must start with http:// or https://' },
      { name: 'folder', label: 'Put it in a folder', type: 'select', options: [{ v: '', l: '(no folder)' }, ...folders().map(f => ({ v: f.id, l: f.title }))] }],
    check: v => v.type === 'Web link' && !/^https?:\/\/\S+$/.test(v.url) ? { url: 'Type a full address starting with http:// or https://' } : {} });
    if (!v) return;
    const kind = v.type === 'Customizable page' ? 'text' : v.type === 'Web link' ? 'link' : v.type === 'News' ? 'news' : 'planned';
    S.pages.push({ id: 'p' + Date.now(), title: v.title, slug: '', kind, type: v.type, consult: [...C.ROLES], edit: ['Webmaster', 'Administrator'], folder: v.folder, url: v.url, body: '' });
    P.say('ok', `The page “${v.title}” was added to the menu.`); P.refresh();
  },
  async fladd() { const v = await P.form({ title: 'Add a folder', submit: 'Add the folder', fields: [{ name: 'title', label: 'Name of the folder', required: true }] }); if (!v) return; S.pages.push({ id: 'p' + Date.now(), title: v.title, kind: 'folder', type: 'Folder', consult: [], edit: [], folder: '', body: '' }); P.say('ok', 'The folder was added.'); P.refresh(); },
  async flren(el) { const f = pageById(el.dataset.id), v = await P.form({ title: 'Rename the folder', values: f, fields: [{ name: 'title', label: 'Name of the folder', required: true }] }); if (!v) return; f.title = v.title; P.say('ok', 'The folder was renamed.'); P.refresh(); },
  async pgtext(el) {
    const p = pageById(el.dataset.id);
    const v = p.kind === 'link' ? await P.form({ title: `Link: ${p.title}`, values: p, fields: [{ name: 'url', label: 'Web address', required: true, check: x => /^https?:\/\/\S+$/.test(x) ? '' : 'Type a full address starting with http:// or https://' }] })
      : await P.form({ title: `Text of “${p.title}”`, values: p, fields: [{ name: 'body', label: 'Text', type: 'textarea', rows: 12, hint: 'Leave a blank line between paragraphs. Start a line with “- ” to make a list. The live site has a full text editor.' }] });
    if (!v) return; Object.assign(p, v); P.say('ok', 'The page was saved.'); P.refresh();
  },
  async pgset(el) {
    const p = pageById(el.dataset.id), v = await P.form({ title: `Settings of “${p.title}”`, values: p, fields: pageFields() }); if (!v) return;
    Object.assign(p, v); P.say('ok', 'The settings were saved. Check the result with “Viewing as” on the public website.'); P.refresh();
  },
  async pgdel(el) {
    const p = pageById(el.dataset.id), kids = S.pages.filter(x => x.folder === p.id).length;
    if (!await P.confirm({ title: 'Remove this from the menu?', danger: true, ok: 'Yes, remove it', text: kids ? `“${p.title}” will be removed. The ${kids} page(s) inside it move out of the folder.` : `“${p.title}” will be removed from the menu.` })) return;
    S.pages.forEach(x => { if (x.folder === p.id) x.folder = ''; }); S.pages = S.pages.filter(x => x !== p); P.say('ok', 'It was removed from the menu.'); P.refresh();
  },
});
const blockFields = () => [{ name: 'title', label: 'Title', required: true }, { name: 'body', label: 'Text', type: 'textarea', rows: 10, required: true, hint: 'Leave a blank line between paragraphs.' }];
P.add({
  path: '/admin/homepage', area: 'admin', group: 'Website', nav: true, label: 'Home page text', title: 'Home page text', blurb: 'Change the text blocks on the home page.',
  ref: '3.2 Website > Homepage (add a block of text; main column left)', note: 'Add, change and delete work, and the public home page shows the blocks.',
  view: () => html`<p class="lead">These blocks of text appear on the home page, one under the other.</p><div class="actions"><button type="button" class="btn btn-primary" data-act="hbadd">Add a block of text</button></div>
    ${P.table({ caption: 'Home page blocks', empty: 'No block yet.', rows: S.homeBlocks, cols: [{ h: 'Title', v: b => html`<strong>${b.title}</strong>` }, { h: 'Where', v: () => 'Main column (left)' },
      { h: 'Actions', v: b => html`<button type="button" class="btn btn-small" data-act="hbedit" data-id="${b.id}">Change</button> <button type="button" class="btn btn-small btn-secondary" data-act="hbdel" data-id="${b.id}">Delete</button>` }] })}`,
});
Object.assign(P.act, {
  async hbadd() { const v = await P.form({ title: 'Add a block of text', fields: blockFields(), submit: 'Add the block' }); if (!v) return; S.homeBlocks.push({ id: 'h' + Date.now(), ...v }); P.say('ok', 'The block was added.'); P.refresh(); },
  async hbedit(el) { const b = S.homeBlocks.find(x => x.id === el.dataset.id), v = await P.form({ title: 'Change block', fields: blockFields(), values: b }); if (!v) return; Object.assign(b, v); P.say('ok', 'The block was saved.'); P.refresh(); },
  async hbdel(el) { const b = S.homeBlocks.find(x => x.id === el.dataset.id); if (!await P.confirm({ title: 'Delete this block?', danger: true, ok: 'Yes, delete it', text: `“${b.title}” will disappear from the home page.` })) return; S.homeBlocks = S.homeBlocks.filter(x => x !== b); P.say('ok', 'The block was deleted.'); P.refresh(); },
});
const newsFields = () => [{ name: 'title', label: 'Title', required: true }, { name: 'content', label: 'Content', type: 'textarea', rows: 6, required: true }, { name: 'date', label: 'Date', type: 'date', required: true, value: today() }];
P.add({
  path: '/admin/news', area: 'admin', group: 'Website', nav: true, label: 'News', title: 'News', blurb: 'Post short news items.',
  ref: '3.2 Website > News (title, content, date, action; also an RSS feed)', note: 'Add, change and delete work, and news shows on the public home page. The RSS feed needs the server part.',
  view: () => html`<p class="lead">News items appear on the home page of the public website.</p><div class="actions"><button type="button" class="btn btn-primary" data-act="newsadd">Add news</button></div>
    ${P.table({ caption: 'News', empty: 'No news yet. Choose “Add news”.', rows: S.news, cols: [{ h: 'Title', v: n => html`<strong>${n.title}</strong>` }, { h: 'Content', v: n => n.content.length > 80 ? n.content.slice(0, 80) + '...' : n.content }, { h: 'Date', v: 'date' },
      { h: 'Actions', v: n => html`<button type="button" class="btn btn-small" data-act="newsedit" data-id="${n.id}">Change</button> <button type="button" class="btn btn-small btn-secondary" data-act="newsdel" data-id="${n.id}">Delete</button>` }] })}`,
});
Object.assign(P.act, {
  async newsadd() { const v = await P.form({ title: 'Add news', fields: newsFields(), submit: 'Add the news' }); if (!v) return; S.news.unshift({ id: 'n' + Date.now(), ...v }); P.say('ok', 'The news was added.'); P.refresh(); },
  async newsedit(el) { const n = S.news.find(x => x.id === el.dataset.id), v = await P.form({ title: 'Change news', fields: newsFields(), values: n }); if (!v) return; Object.assign(n, v); P.say('ok', 'The news was saved.'); P.refresh(); },
  async newsdel(el) { const n = S.news.find(x => x.id === el.dataset.id); if (!await P.confirm({ title: 'Delete this news?', danger: true, ok: 'Yes, delete it', text: `“${n.title}” will be removed.` })) return; S.news = S.news.filter(x => x !== n); P.say('ok', 'The news was deleted.'); P.refresh(); },
});
const FOLDERS = ['css', 'header', 'pages'];
P.defForm('file-add', {
  submit: 'Add the file',
  fields: () => [{ name: 'file', label: 'File', type: 'file', required: true, hint: 'Up to 200 MB. The file is not uploaded in this prototype; only its name and size are listed.' }, { name: 'folder', label: 'Kind of file', type: 'select', options: [{ v: 'pages', l: 'Picture or document for pages' }, { v: 'header', l: 'Header picture' }, { v: 'css', l: 'Style sheet (css)' }] }],
  run: (v, form) => {
    const f = form.elements.file.files[0];
    if (f && f.size > 200 * 1048576) return P.say('error', 'This file is larger than 200 MB, the limit shown on the live site.');
    S.files.push({ id: 'f' + Date.now(), title: v.file, folder: v.folder, ext: (v.file.split('.').pop() || '').toLowerCase(), size: fmtSize(f ? f.size : 0) });
    P.say('ok', `“${v.file}” was added to the list (not uploaded).`); P.refresh();
  },
});
P.add({
  path: '/admin/files', area: 'admin', group: 'Website', nav: true, label: 'Files and pictures', title: 'Files and pictures', blurb: 'The files used on the website.',
  ref: '3.2 Website > Uploads (list: title, extension, size; add up to 200 MB; view, replace, delete)',
  note: 'Choosing a file checks its size against the 200 MB limit and lists its name and size. Nothing is uploaded: real storage needs the server part.',
  view: () => html`<p class="lead">All files used by the website.</p><section class="card"><h2>Add a file</h2>${P.formHTML('file-add', {})}</section>
    ${P.table({ caption: 'Files', empty: 'No file yet.', rows: S.files, cols: [{ h: 'File', v: f => html`<strong>${f.title}</strong>` }, { h: 'Group', v: 'folder' }, { h: 'Type', v: 'ext' }, { h: 'Size', v: 'size' },
      { h: 'Actions', v: f => html`<button type="button" class="btn btn-small" data-act="fileopen" data-id="${f.id}">Open</button> <button type="button" class="btn btn-small" data-act="filerep" data-id="${f.id}">Replace</button> <button type="button" class="btn btn-small btn-secondary" data-act="filedel" data-id="${f.id}">Delete</button>` }] })}`,
});
Object.assign(P.act, {
  fileopen() { P.say('info', 'Sample file: there is no real file behind this row in the prototype.'); },
  async filerep(el) {
    const f = S.files.find(x => x.id === el.dataset.id);
    const v = await P.form({ title: `Replace ${f.title}`, submit: 'Replace', fields: [{ name: 'file', label: 'New file', type: 'file', required: true }] });
    if (!v) return; f.title = v.file; f.ext = (v.file.split('.').pop() || '').toLowerCase(); P.say('ok', 'The file entry was replaced (nothing uploaded).'); P.refresh();
  },
  async filedel(el) { const f = S.files.find(x => x.id === el.dataset.id); if (!await P.confirm({ title: 'Delete this file?', danger: true, ok: 'Yes, delete it', text: `“${f.title}” will be removed from the list.` })) return; S.files = S.files.filter(x => x !== f); P.say('ok', 'The file was deleted.'); P.refresh(); },
});
const fileOpts = folder => S.files.filter(f => f.folder === folder).map(f => f.title);
P.defForm('set-general', {
  fields: () => [{ name: 'languages', label: 'Languages of the website', type: 'checks', required: true, options: C.LANGS }, { name: 'defaultLanguage', label: 'Main language', type: 'select', options: C.LANGS },
    { name: 'contactEmail', label: 'Contact email shown to visitors', type: 'email', required: true }],
  check: v => v.languages.length && !v.languages.includes(v.defaultLanguage) ? { defaultLanguage: 'The main language must be one of the ticked languages.' } : {},
  run: v => { Object.assign(S.settings, v); P.say('ok', 'The general settings were saved. (Switching languages is not built in this prototype; the blueprint assumes English only to start.)'); P.refresh(); },
});
const HTYPES = ['Header quick form configuration', 'Customize your header in HTML', 'Header picture'];
P.defForm('set-header', {
  fields: () => {
    const t = u('hdr.type', S.settings.header.type);
    return [{ name: 'type', label: 'How do you want to make the header?', type: 'select', options: HTYPES, attrs: 'data-onchange="hdrtype"' },
      ...(t === HTYPES[0] ? [{ name: 'title', label: 'Title', required: true }, { name: 'subtitle', label: 'Subtitle' }, { name: 'logoFile', label: 'Logo', type: 'select', options: [{ v: '', l: '(none)' }, ...fileOpts('header')] },
        { name: 'logoPlace', label: 'Where does the logo go?', type: 'select', options: ['in the header', 'in the menu', 'no'] }, { name: 'showDate', label: 'Show the dates?', type: 'select', options: ['yes', 'no'] }, { name: 'showPlace', label: 'Show the place?', type: 'select', options: ['yes', 'no'] }]
        : t === HTYPES[1] ? [{ name: 'html', label: 'Header (HTML)', type: 'textarea', rows: 6, required: true, hint: 'Shown in a safe frame on the public preview.' }]
          : [{ name: 'picture', label: 'Header picture', type: 'select', required: true, options: [{ v: '', l: '-- Choose a picture --' }, ...fileOpts('header')], hint: 'Pictures come from “Files and pictures”, group “header”.' }])];
  },
  run: v => { Object.assign(S.settings.header, v); delete P.ui['hdr.type']; P.say('ok', 'The header was saved. Open the public website to see it.'); P.refresh(); },
});
P.act.hdrtype = el => { P.fe['set-header'] = { vals: { ...P.readFields(el.form, P.formDefs['set-header'].fields()), type: el.value }, errs: {} }; P.ui['hdr.type'] = el.value; P.refresh(); };
P.add({
  path: '/admin/settings', area: 'admin', group: 'Website', nav: true, label: 'Site settings', title: 'Site settings: languages, header and colors', blurb: 'Languages, contact email, header and colors.',
  ref: '3.2 Website > General, Header, Appearance; 9.3 palette',
  note: 'General and Header save and change the public preview. Colors is read-only: the live site\'s preset themes were not described, so no theme switching is built.',
  view: () => {
    const tab = u('set.tab', 'general');
    return html`${P.tabs('set.tab', [['general', 'Languages and contact'], ['header', 'Header'], ['colors', 'Colors']], 'Settings sections', tab)}
      ${tab === 'general' ? html`<section class="card"><h2>Languages and contact</h2>${P.formHTML('set-general', S.settings)}</section>`
      : tab === 'header' ? html`<section class="card"><h2>Header</h2><p>The top part of the public website.</p>${P.formHTML('set-header', S.settings.header)}</section>`
        : html`<section class="card"><h2>Colors used on this website</h2><p>These colors come from the conference images. “Exact” means the value was measured on a flat area. “Estimate” means it was measured on a gradient or photo (blueprint section 9.3). Changing colors is not offered here.</p>
        ${P.table({ caption: 'Color palette', empty: '', rows: C.PALETTE, cols: [{ h: 'Sample', v: c => html`<span class="swatch" style="background:${c[1]}" aria-hidden="true"></span>` }, { h: 'Name', v: c => c[0] }, { h: 'Code', v: c => c[1] }, { h: 'How sure', v: c => c[2] === 'exact' ? 'Exact' : 'Estimate' }, { h: 'Used for', v: c => c[3] }] })}</section>`}`;
  },
});
P.add({
  path: '/admin/stats', area: 'admin', group: 'Website', nav: true, label: 'Visitor statistics', title: 'Visitor statistics', blurb: 'How many people visit the website.',
  ref: '3.2 Website > Statistics (Matomo on the live site); decision D10 for the rebuild',
  note: 'Needs an analytics service (decision D10). Only the explanation is shown.',
  view: () => html`<p class="lead">Visitor numbers come from a separate statistics tool (the live site uses one called Matomo).</p>
    <div class="alert alert-info"><span class="sym" aria-hidden="true">i</span><div><strong>Note.</strong> This button is switched off in the prototype because there is no statistics service connected. Which service to use is still to be decided (decision D10 in the blueprint).</div></div>
    <button type="button" class="btn" disabled>Open the statistics tool (needs a statistics service)</button>`,
});

/* ================= Help ================= */
P.add({
  path: '/admin/help', area: 'admin', group: 'Help', nav: true, label: 'Help and prototype guide', title: 'Help and prototype guide', blurb: 'How to use this, who can do what, what is pretend.',
  ref: '4 User roles and permissions, 5 Reference data, 16 Roadmap, 17 Assumptions and decisions',
  note: 'The role table is calculated from the page rights you can edit under “Pages and menu”.',
  view: () => {
    const pg = k => S.pages.find(p => p.kind === k || p.slug === k), yes = (a, r) => a.includes(r) ? 'Yes' : 'No';
    const rows = [['Read general pages', pg('boa').consult], ['Read the Home and Registration pages', pg('home').consult], ['Read the list of participants', pg('participants').consult], ['Change general pages', pg('boa').edit], ['Change the list-of-participants page', pg('participants').edit]];
    return html`
    <section class="card" aria-labelledby="h1"><h2 id="h1">How to use this</h2><ul>
      <li>Start at the <a href="#/admin">Dashboard</a>. Each card lists what you can do in that area.</li>
      <li>The menu on the left groups the same pages by task. On a phone, use the “Open menu” button.</li>
      <li>The “Text size” buttons at the top make everything bigger or smaller.</li>
      <li>Before anything is removed you are asked to confirm. A message at the top of the page tells you what happened.</li>
      <li>To see what visitors see, choose “See the public website”. There you can pick a role under “Viewing as”.</li></ul></section>
    <section class="card" aria-labelledby="h2"><h2 id="h2">What is pretend in this prototype</h2><ul>
      <li><strong>Nothing is saved on a server.</strong> Your changes live in this browser tab and disappear when you reload or use “Start over”.</li>
      <li><strong>No email is sent.</strong> “Sent emails” only shows records you made.</li><li><strong>No real sign-in.</strong> Passwords are never kept. The public site uses a “Viewing as” switch instead.</li>
      <li><strong>No files are uploaded</strong> and no PDF or book is produced. CSV downloads of the sample data are real.</li><li><strong>All people, papers and numbers are invented sample data.</strong></li></ul>
      <p>The full list of what is built and what still needs a server is in <code>prototype/README.md</code>.</p></section>
    <section class="card" aria-labelledby="h3"><h2 id="h3">Words used for papers (meanings guessed from the names)</h2><dl class="dl">
      <dt>Initial</dt><dd>A new paper that nobody has dealt with yet.</dd><dt>Reviewed</dt><dd>Reviewers have given opinions.</dd><dt>Awaiting update</dt><dd>The author was asked to change something.</dd>
      <dt>Accepted / Refused</dt><dd>The decision is made.</dd><dt>No review</dt><dd>No review was done.</dd></dl></section>
    <section class="card" aria-labelledby="h4"><h2 id="h4">Who can do what</h2><p>Worked out from the rights set under “Pages and menu”.</p>
      ${P.table({ caption: 'Roles and permissions', empty: '', rows: C.ROLES, cols: [{ h: 'Role', v: role => html`<strong>${role}</strong>` }, ...rows.map(([task, rights]) => ({ h: task, v: role => yes(rights, role) }))] })}</section>`;
  },
});

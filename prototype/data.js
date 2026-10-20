/* Conference prototype: constants and SAMPLE data.
   C = lists taken from the blueprint (sections 4, 5, 9). MIRC_2026 = invented sample records, not real people.
   Conference names, places and themes are NOT here: they live in conferences.js (CONFERENCES).
   EDITIONS (bottom of file) is the list of conference editions. Each edition holds ALL of its own data, so editions never overwrite each other. Later editions are made with P.newEdition() in editions.js.
   Classic script (no modules) so the prototype opens straight from the file system. */

const C = {
  TOPICS: ['Science, Technology, Engineering, Architecture', 'Health Sciences', 'Education, Arts, Social Science, Social Work',
    'Business, Governance, Law', 'Hospitality and Tourism', 'Plenary Session', 'Special Workshop', 'Poster Session 1', 'Poster Session 2'],
  TYPES: ['Poster Presentation', 'Oral Presentation', 'Keynote Talk (Strictly for Invited Speakers)', 'Plenary Talk (Strictly for Invited Speakers)'],
  STATUSES: ['Initial', 'Reviewed', 'Awaiting update', 'Accepted', 'Refused', 'No review'],
  EVENT_TYPES: ['Session', 'Speech/Intervention', 'Logistics', 'Break', 'Tour'],
  ROLES: ['Guest', 'Member', 'Webmaster', 'Reviewer', 'Redactor', 'Administrator', 'Coordinator', 'Participant'],
  // Abstract scoring sheet (admin: Score this abstract). A rating is a whole number 1 to 5; score = sum(rating / 5 * weight), 0 to 100. The weights add up to 100.
  CRITERIA: [
    { name: 'Relevance to Journal Scope', weight: 25, text: 'The abstract clearly aligns with the theme and demonstrates relevance to technological innovation, sustainability, or community transformation.' },
    { name: 'Originality and Contribution', weight: 15, text: 'The study presents a potentially novel question, perspective, application, or contribution. No obvious signs of duplicated or recycled work are apparent from the submission.' },
    { name: 'Clarity and Readability', weight: 15, text: 'The abstract is organized, coherent, and written in understandable academic English, with a clear purpose and logical flow.' },
    { name: 'Compliance with Abstract Guidelines', weight: 10, text: 'The submission follows the prescribed abstract word limit, required components, structure, and submission instructions.' },
    { name: 'Ethical Integrity', weight: 10, text: 'The abstract raises no apparent ethical concerns, appropriately describes research involving human participants where relevant, and includes any required ethics information or declarations.' },
    { name: 'Minimum Scholarly Merit', weight: 25, text: 'The abstract identifies a clear research problem or objective, an appropriate methodology or approach, and findings, expected outputs, or a credible anticipated contribution.' },
  ],
  // Recommended decision by score, highest band first. PROPOSED editorial guidelines, not approved policy (shown as such on the scoring page).
  BANDS: [
    { min: 75, range: '75-100', label: 'Recommended for full manuscript review', text: 'The abstract demonstrates sufficient relevance, clarity, and scholarly potential to proceed to the next stage.' },
    { min: 60, range: '60-74.9', label: 'Borderline: revise or conduct further screening', text: 'The abstract may be reconsidered after clarification or revision, subject to the journal\'s submission policy.' },
    { min: 0, range: 'Below 60', label: 'Not recommended for full manuscript review', text: 'The abstract does not sufficiently meet the initial screening requirements.' },
  ],
  // The original visitor-site palette (blueprint 9.3 values). Every edition starts from it and can change its own copy (Website > Site colors).
  THEME_DEFAULT: { primary: '#296334', secondary: '#0f3416', accent: '#e1ca5e', background: '#f8fbf7', surface: '#ffffff', text: '#2f4f4f', button: '#296334', border: '#e8f1e6' },
  // Details that can be asked on the public registration form. First name, last name and email are always asked.
  REG_OPTIONAL: [['title', 'Title (Dr., Ms. ...)'], ['middle', 'Middle name'], ['language', 'Language'], ['phone', 'Phone number'], ['institution', 'Institution'], ['address', 'Mailing address'], ['country', 'Country of the organization'], ['extra', 'More information']],
  PAGE_TYPES: ['Web link', 'File', 'Customizable page', 'Browse by author', 'Browse by speaker', 'Browse by type of document',
    'Browse by topic', 'Search', 'Gallery', 'Map', 'Sponsors', 'RSS Feed', 'News'],
  LANGS: ['French', 'English', 'Spanish'],
  REG_STATUS: ['Pre-registered', 'Needs payment', 'Registered'],
  // Section 9.3. "exact" = flat fill sampled from the images, "estimate" = gradient / photo overlay.
  PALETTE: [
    ['slate-green', '#2F4F4F', 'exact', 'Body text, labels, field borders'],
    ['forest', '#296334', 'exact', 'Headings, links, main buttons'],
    ['leaf', '#297D1F', 'exact', 'Brand stripe, "done" status'],
    ['navy', '#011030', 'exact', 'Focus ring, footer, text on gold'],
    ['deep-green', '#0F3416', 'exact', 'Top bar, button hover'],
    ['white', '#FFFFFF', 'exact', 'Cards, text on dark'],
    ['gold-100', '#FCE77A', 'estimate', 'Gold gradient highlight'],
    ['gold-300', '#E1CA5E', 'estimate', 'Thin rules, links on dark'],
    ['gold-500', '#C6AE43', 'estimate', 'Accent buttons'],
    ['gold-700', '#957A14', 'estimate', 'Warning border, large text only'],
    ['hex-line', '#77AA6F', 'estimate', 'Decoration only'],
    ['mist', '#F8FBF7', 'estimate', 'Page background'],
    ['cream', '#FCFBF7', 'estimate', 'Warm background (not used here)'],
    ['tint-green', '#E8F1E6', 'estimate', 'Card borders, soft fills'],
  ],
};

/* A drawn placeholder logo (palette colors), so the prototype shows a real picture without any real logo file. */
const sampleLogo = (key, year) => {
  const k = CONFERENCES[key], t = { ...C.THEME_DEFAULT, ...k.theme }, fs = Math.min(150, Math.floor(520 / (k.code.length * .75)));   // long codes get a smaller font
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600"><circle cx="300" cy="300" r="288" fill="${t.primary}" stroke="${t.accent}" stroke-width="14"/><text x="300" y="290" font-family="Arial, sans-serif" font-size="${fs}" font-weight="800" fill="#ffffff" text-anchor="middle">${k.code}</text><text x="300" y="425" font-family="Arial, sans-serif" font-size="125" font-weight="800" fill="${t.accent}" text-anchor="middle">${year}</text></svg>`;
  return { name: `${key}-${year}-logo-sample.svg`, kind: 'svg', mime: 'image/svg+xml', bytes: svg.length, w: 600, h: 600, url: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg),
    alt: `${k.code} ${year} logo (sample placeholder)`, fit: 'contain', zoom: 1, x: 50, y: 50, fileId: 'f2', sample: true };
};

const MIRC_2026 = (() => {
  const DAYS = ['2026-09-27', '2026-09-28', '2026-09-29', '2026-09-30'], YEAR = 2026, KEY = 'mirc', K = CONFERENCES[KEY];
  const first = ['Ana', 'Ben', 'Carla', 'Dev', 'Elena', 'Farid', 'Gina', 'Hugo', 'Iris', 'Jon', 'Kira', 'Leo'];
  const last = ['Alvarez', 'Brooks', 'Chen', 'Dumont', 'Egan', 'Faulkner', 'Garcia', 'Hale', 'Ito', 'Jensen', 'Kaur', 'Lopez'];
  const person = i => ({ first: first[i % 12], last: last[(i * 5 + 3) % 12] });
  const T = C.TOPICS;

  const statusOf = ['Accepted', 'Accepted', 'Accepted', 'Accepted', 'Accepted', 'Accepted', 'Accepted', 'Accepted', 'Accepted',
    'Initial', 'Reviewed', 'Awaiting update', 'Refused', 'Accepted', 'Accepted', 'Initial', 'No review', 'Accepted',
    'Initial', 'Initial', 'Awaiting update', 'Refused', 'Reviewed', 'No review'];

  const papers = statusOf.map((status, i) => {
    const a = person(i), b = person(i + 7);
    const type = i === 5 ? C.TYPES[3] : i === 14 ? C.TYPES[2] : C.TYPES[i % 2];
    const hist = [{ date: '2026-06-' + String(1 + (i % 28)).padStart(2, '0'), action: 'Submitted', user: `${a.first} ${a.last}`, comment: '' }];
    if (status !== 'Initial') hist.push({ date: '2026-07-20', action: 'Status set to ' + status, user: 'Organizer (sample)', comment: '' });
    return {
      id: String(700001 + i),
      title: `Sample paper ${i + 1}: ${['campus energy use', 'patient care pathways', 'teaching with local stories', 'small business credit',
        'visitor satisfaction', 'city resilience', 'community workshops', 'poster design study'][i % 8]}`,
      authors: [{ name: `${a.first} ${a.last}`, affil: `Sample University ${i % 5 + 1}` }, { name: `${b.first} ${b.last}`, affil: `Sample Institute ${i % 3 + 1}` }],
      corresponding: 0,
      abstract: `This is sample abstract text for paper ${i + 1}. It stands in for the real abstract an author would send in.`,
      type, topic: T[i % 9], status, note: '', comment: '', history: hist,
    };
  });

  const users = Array.from({ length: 24 }, (_, i) => {
    const p = person(i + 2), login = `${p.first}.${p.last}${i}`.toLowerCase();
    return { login, first: p.first, last: p.last, email: `${login}@example.org` };
  });

  const regStatus = ['Registered', 'Registered', 'Needs payment', 'Registered', 'Pre-registered', 'Registered'];
  const registrations = users.slice(0, 18).map((u, i) => {
    const status = regStatus[i % 6];
    return {
      id: 'r' + (i + 1), status, total: status === 'Needs payment' ? 100 : 0, date: `2026-08-${String(1 + (i % 20)).padStart(2, '0')} 1${i % 10}:0${i % 6}`,
      title: ['Dr.', 'Ms.', 'Mr.', 'Prof.'][i % 4], first: u.first, last: u.last, middle: '', email: u.email, language: 'en',
      phone: '+00 000 000 000', institution: `Sample University ${i % 5 + 1}`, address: '1 Sample Street', country: 'PH', extra: '',
    };
  });

  const reviewers = [
    { login: users[0].login, topics: [T[0], T[1]], papers: [] },
    { login: users[1].login, topics: [T[2]], papers: ['700010'] },
    { login: users[2].login, topics: [T[3], T[4]], papers: [] },
    { login: users[3].login, topics: [T[5]], papers: [] },
    { login: users[4].login, topics: [], papers: ['700016', '700017'] },
    { login: users[5].login, topics: [], papers: [] },
  ].map(r => { const u = users.find(x => x.login === r.login); return { ...r, name: `${u.first} ${u.last}`, email: u.email }; });

  const rooms = [['Main Auditorium', 300, 'Opening and plenary sessions'], ['Lecture Room 1', 80, ''], ['Lecture Room 2', 80, ''],
    ['Poster Hall', 150, 'Poster sessions'], ['Lounge', 40, 'Breaks'], ['Campus B Hall', 120, 'Hospitality and Tourism day']]
    .map(([name, capacity, description], i) => ({ id: 'rm' + (i + 1), name: name + ' (sample)', capacity, description }));

  const ev = (id, type, date, start, end, o) => ({ id, type, date, start, end, title: '', topic: '', chair: '', room: '', description: '', breakType: '', file: '', comms: [], ...o });
  const cm = (paperId, start, end) => ({ paperId, start, end, speaker: '' });
  const events = [
    ev('e1', 'Session', DAYS[0], '07:00', '23:55', { topic: T[4], room: 'rm6' }),
    ev('e2', 'Tour', DAYS[1], '07:00', '23:55', { title: 'Free day to visit Manila City' }),
    ev('e3', 'Logistics', DAYS[2], '07:00', '17:00', { title: 'Registration' }),
    ev('e4', 'Speech/Intervention', DAYS[2], '08:00', '08:30', { title: 'Opening Ceremony', chair: 'Conference Chair (sample)', room: 'rm1' }),
    ev('e5', 'Session', DAYS[2], '08:30', '10:00', { topic: T[5], room: 'rm1', chair: 'Session chair (sample)', comms: [cm('700006', '08:30', '09:15'), cm('700015', '09:15', '10:00')] }),
    ev('e6', 'Break', DAYS[2], '10:00', '10:30', { title: 'Coffee break', breakType: 'Coffee break', room: 'rm5' }),
    ev('e7', 'Session', DAYS[2], '10:30', '12:00', { topic: T[0], room: 'rm2', comms: [cm('700001', '10:30', '10:45')] }),
    ev('e8', 'Session', DAYS[2], '10:30', '12:00', { topic: T[1], room: 'rm3', comms: [cm('700002', '10:30', '10:45')] }),
    ev('e9', 'Break', DAYS[2], '12:00', '13:00', { title: 'Lunch', breakType: 'Lunch', room: 'rm5' }),
    ev('e10', 'Session', DAYS[3], '09:00', '10:15', { topic: T[7], room: 'rm4', comms: [cm('700008', '09:00', '09:15')] }),
    ev('e11', 'Session', DAYS[3], '10:15', '11:30', { topic: T[8], room: 'rm4', comms: [cm('700009', '10:15', '10:30')] }),
    ev('e12', 'Speech/Intervention', DAYS[3], '16:00', '16:30', { title: 'Closing remarks', chair: 'Conference Chair (sample)', room: 'rm1' }),
  ];

  const ALL = C.ROLES, W_A = ['Webmaster', 'Administrator'];
  const pg = (id, title, slug, kind, type, consult, edit) => ({ id, title, slug, kind, type, consult, edit, folder: '', url: '' });
  const pages = [
    pg('p1', 'Home', '', 'home', 'Home', ['Guest', 'Member', 'Webmaster', 'Reviewer', 'Coordinator', 'Participant'], []),
    pg('p2', 'Conference Programme', 'boa', 'text', 'page', ALL, W_A),
    pg('p3', 'Detailed Conference Program (with Abstracts)', 'program', 'program', 'Home', ALL, []),
    pg('p4', 'General Information and Presentation Guidelines', 'geninfo', 'text', 'page', ALL, W_A),
    pg('p5', 'Organizing Committee', 'organizing_committee', 'text', 'page', ALL, W_A),
    pg('p6', 'Invited Speakers', 'invited_speakers', 'text', 'page', ALL, W_A),
    pg('p7', 'Important Dates', 'important_dates', 'text', 'page', ALL, W_A),
    pg('p8', 'Conference Themes', 'conference_themes', 'text', 'page', ALL, W_A),
    pg('p9', 'List of Participants', 'listeparticipants', 'participants', 'listeparticipants', ['Webmaster', 'Reviewer', 'Redactor', 'Administrator', 'Coordinator', 'Participant'], ['Administrator']),
    pg('p10', 'Venue', 'venue', 'text', 'page', ALL, W_A),
    pg('p11', 'Registration', 'registration', 'registration', 'Home', ['Guest', 'Member', 'Webmaster', 'Reviewer', 'Coordinator', 'Participant'], []),
    pg('p12', 'Abstract Submission', 'submission', 'submission', 'Submission', ALL, []),
  ];
  const bodies = {
    boa: 'The final conference programme and the poster list are published here as PDF files.\n\n(Sample page. The PDF files are not part of the prototype.)',
    geninfo: 'Presentation rules, summarised from the live site:\n\n- All sessions run on Zoom, for people in the room and people online.\n- Presenting authors attend in person. Online presenting needs approval from the organizing committee.\n- Online presenters send a recorded back-up presentation.\n- Time limits: plenary 45 min, special workshop 60 min, keynote 30 min, oral 15 min, poster session 75 min.\n- Posters are portrait, at most 5 ft x 2 ft (1524 x 610 mm). Send a PDF copy of the poster, at most 10 MB.',
    organizing_committee: 'Conference Chair: [name, sample]\nConference Co-Chair: [name, sample]\nConference Vice-Chair: [name, sample]\nConference Secretary: [name, sample]',
    invited_speakers: 'Plenary Speakers\n\n- [Speaker name, sample] (affiliation, country). Topic: [talk title, sample]\n\nKeynote Speakers\n\n- [Speaker name, sample] (affiliation, country). Topic: [talk title, sample]\n\nSpecial Session Speakers\n\n- [Speaker name, sample] (affiliation, country). Topic: [talk title, sample]',
    important_dates: 'Dates copied from the live site (the live site shows more than one date for some deadlines, see blueprint 2.2):\n\n- Call for abstracts: 30 May 2026\n- Abstract deadline: 30 June 2026, later shown as 25 July 2026 (closed)\n- Acceptance notification: 15 August 2026\n- Programme release: 25 August 2026, later shown as 28 August 2026\n- Registration deadline: 20 August 2026, 11:59 p.m.\n- Conference: 29-30 September 2026 (main), 27 September 2026 (sub-conference)',
    conference_themes: C.TOPICS.map(t => '- ' + t).join('\n'),
    venue: 'Pamantasan ng Lungsod ng Maynila (PLM), University of the City of Manila.\n\nAddress: Gen. Luna cor. Muralla Streets, Intramuros, Manila, Philippines 1002.\n\nThe sub-conference on 27 September is held at the De La Salle - College of Saint Benilde campus.',
  };
  pages.forEach(p => { p.body = bodies[p.slug] || ''; });

  const tpl = (id, group, name) => {
    const subject = `[${K.code} ${YEAR}] ${name}`, body = `Dear participant,\n\n(Sample text for "${name}". The real wording is not part of the blueprint.)\n\nKind regards,\nThe organizing team`;
    return { id, group, name, subject, body, originalSubject: subject, originalBody: body };
  };
  const templates = [
    ['Registration', 'Registration confirmation'], ['Registration', 'Payment request'], ['Registration', 'Validating the registration'],
    ['Submission', 'Submission accepted'], ['Submission', 'New submissions'], ['Submission', 'Submission refused'],
    ['Submission', 'Confirmation of abstract submission to the author'], ['Submission', 'Update needed on following submission'],
    ['Custom', 'Message to plenary speakers (sample)'],
  ].map(([g, n], i) => tpl('t' + (i + 1), g, n));

  return {
    // conf = what makes this edition different: identity, dates and deadlines, branding. days = every conference day, in order.
    conf: { id: KEY + YEAR, series: KEY, year: YEAR, status: 'published', name: `${K.name} ${YEAR}`, place: K.place, venue: K.venue,
      tagline: K.tagline, sub: K.sub, days: DAYS,
      submission: { open: '2026-05-13', close: '2026-09-20' }, registrationDeadline: '2026-08-20', banner: '' },
    topics: [...C.TOPICS],
    papers, users, registrations, reviewers, rooms, events, pages,
    homeBlocks: [{ id: 'h1', title: 'Conference Overview', body: `The ${K.name} ${YEAR} (${K.code} ${YEAR}) is a hybrid international academic conference. It brings together researchers, academicians, practitioners, policymakers and students to present and discuss research on AI, sustainability and innovation.\n\nThe main conference is held on 29-30 September 2026 at the PLM campus. A sub-conference on Hospitality and Tourism is held on 27 September 2026 at the DLSU-CSB campus.` }],
    news: [],
    files: [
      { id: 'f1', title: 'program.css', folder: 'css', ext: 'css', size: '0 B' },
      { id: 'f2', title: `${KEY}-${YEAR}-logo-sample.svg`, folder: 'header', ext: 'svg', size: '1 KB', logo: true },
      { id: 'f3', title: 'sponsor-logo-1.jpg', folder: 'pages', ext: 'jpg', size: '48 KB' },
      { id: 'f4', title: 'themes-screenshot.png', folder: 'pages', ext: 'png', size: '310 KB' },
    ],
    settings: {
      languages: ['English'], defaultLanguage: 'English', contactEmail: 'contact@example.org',
      header: { type: 'Header quick form configuration', title: `${K.name} ${YEAR}`, subtitle: '', logoPlace: 'in the header', showDate: 'yes', showPlace: 'yes', html: '<p>Custom header HTML</p>', picture: 'header-logo.png' },
      theme: { ...C.THEME_DEFAULT }, themePending: null, themeHistory: [],
      logo: sampleLogo(KEY, YEAR), logoPending: null,   // each edition has its own logo (see logo.js); this one is a drawn placeholder, not the real logo
      showPapers: 'yes', registrationOpen: true, submissionOpen: false,
      regFields: Object.fromEntries(C.REG_OPTIONAL.map(([k]) => [k, 'optional'])),
    },
    templates, lists: [], aliases: [{ id: 'a1', name: KEY + YEAR, content: '' }], mailLog: [],
    mailLook: { header: `<p style="margin:0;padding:8px;background:#E8F1E6;color:#2F4F4F">${K.code} ${YEAR} (sample email header)</p>`, font: 'Sans-serif', footer: 'Standard' },
    rightsGroups: { Webmaster: 1, Administrative: 1, Reviewer: reviewers.length, Redactor: 1, Administrator: 2, Coordinator: 1 },
  };
})();

const EDITIONS = [MIRC_2026];

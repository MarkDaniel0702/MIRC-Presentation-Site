/* The conferences this site can run. TO ADD A CONFERENCE: add one entry below (see README, "Adding a new conference"). Nothing else needs editing.
   Each key (lower case, letters and digits) is the conference id: editions get ids like "mirc2026". The ORDER here is the order of the pickers.
   An entry holds the identity every new edition of that conference starts from (an edition can still change all of it later under Edition details):
     code     short name shown in menus, titles, email subjects and the placeholder logo   (MIRC, PANTAS ...)
     name     full name; an edition's name is "name + year"                               (Manila International Research Conference 2026)
     place, venue, tagline, sub   starting texts of a NEW edition (tagline = big line on the home page, sub = line under it)
     theme    optional: the conference's own 8-color palette (see C.THEME_DEFAULT for the keys). Left out = the original green palette.
     first    only for a conference that has no sample data: the first edition created at start-up { year, status, days }.
              (MIRC does not need it: its 2026 edition is the full sample in data.js.)
   Classic script, loaded before data.js. */
const CONFERENCES = {
  mirc: {
    code: 'MIRC', name: 'Manila International Research Conference',
    place: 'Manila (Philippines)', venue: 'Pamantasan ng Lungsod ng Maynila (PLM)',
    tagline: 'Shaping Resilient Futures', sub: 'AI, Sustainability, and Inclusive Innovation',
  },
  pantas: {
    code: 'PANTAS', name: 'PANTAS Conference',   // sample: the real full name, place and theme are not known to the prototype
    place: 'City to be announced (sample)', venue: 'Venue to be announced (sample)', tagline: 'Theme to be announced (sample)', sub: '',
    theme: { primary: '#1f3a68', secondary: '#0e1f3d', accent: '#e1ca5e', background: '#f6f8fc', surface: '#ffffff', text: '#2b3a4f', button: '#1f3a68', border: '#e3e9f3' },
    first: { year: 2026, status: 'published', days: ['2026-11-11', '2026-11-12'] },
  },
};

/* ---------- conferences created on screen (Conference > My conferences, see conference-builder.js) ----------
   Their definitions are kept in this browser (localStorage) and added to CONFERENCES here, at start-up, in the same shape as the entries above.
   customEntry() is the one place that turns a saved definition into an entry, so what is loaded can never differ from what was just created. */
const CUSTOM_KEY = 'customConferences', HEX = /^#[0-9a-f]{6}$/i;
const mixHex = (a, b, t) => '#' + [1, 3, 5].map(i => Math.round(parseInt(a.slice(i, i + 2), 16) * (1 - t) + parseInt(b.slice(i, i + 2), 16) * t).toString(16).padStart(2, '0')).join('');
/* Two chosen colors become the 8-color palette the site uses: the rest are shades of the main color. The builder checks it with the same readability rules as Site colors. */
const brandTheme = (primary, accent) => ({ primary, secondary: mixHex(primary, '#000000', .45), accent, background: mixHex(primary, '#ffffff', .96), surface: '#ffffff',
  text: mixHex(primary, '#000000', .65), button: primary, border: mixHex(primary, '#ffffff', .88) });
const customEntry = d => {
  const s = v => typeof v === 'string' ? v : '';
  if (!/^[A-Za-z][A-Za-z0-9]{1,11}$/.test(s(d.code)) || !s(d.name).trim() || !HEX.test(s(d.primary)) || !HEX.test(s(d.accent)) || !Number.isInteger(d.year) || d.year < 2000 || d.year > 2100) return null;
  const days = [], t = Date.parse(s(d.start)), e = Date.parse(s(d.end) || s(d.start));   // ISO dates parse as UTC midnight, so adding 86400000 is exactly one day
  if (!isNaN(t) && !isNaN(e) && e >= t && e - t < 31 * 864e5) for (let x = t; x <= e; x += 864e5) days.push(new Date(x).toISOString().slice(0, 10));
  const def = { code: d.code.toUpperCase(), name: s(d.name).trim().replace(/\s+/g, ' '), place: s(d.place), venue: s(d.venue), tagline: s(d.tagline), sub: s(d.sub), description: s(d.description), primary: d.primary.toLowerCase(), accent: d.accent.toLowerCase(),
    year: d.year, start: s(d.start), end: s(d.end), published: !!d.published && days.length > 0 };
  return { code: def.code, name: def.name, place: def.place, venue: def.venue, tagline: def.tagline, sub: def.sub, description: def.description, theme: brandTheme(def.primary, def.accent),
    first: { year: def.year, status: def.published ? 'published' : 'draft', days }, custom: def };
};
try {
  for (const [k, d] of Object.entries(JSON.parse(localStorage.getItem(CUSTOM_KEY) || '{}'))) {
    const c = /^[a-z][a-z0-9]{1,11}$/.test(k) && !(k in CONFERENCES) && d && customEntry(d);   // storage can be edited by hand: anything that does not fit is skipped
    if (c) CONFERENCES[k] = c;
  }
} catch { /* storage may be blocked or hold something that is not JSON: then there are simply no saved conferences */ }

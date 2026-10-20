/* Conference prototype: color palette of the VISITOR website, one palette per conference edition (Website > Site colors).
   How it works: a palette is 8 colors (primary, secondary, accent, background, surface, text, button, border). P.theme.css() turns it into CSS variables
   (--t-*) on the .site wrapper of the public pages. styles.css maps them onto the existing palette variables inside .site only, so every component
   (header, menu, buttons, links, cards, forms, alerts, tables, footer) follows the palette without a color written into any component.
   The administration area has no .site wrapper, so its colors never change.
   Text colors on buttons and bars, hover and pressed colors and the focus-ring color are worked out here from the 8 colors, so they cannot be set wrong.
   Every combination that carries text or marks a control is measured against WCAG 2.1 (4.5:1 for text, 3:1 for outlines and focus rings) and shown to the administrator.
   FRONTEND ONLY: saved palettes live in the edition record in the browser tab and disappear on reload (README section 12). Blueprint: 9.3-9.6 palette, 9.9 tokens, 11.2. */
'use strict';
(() => {
  const DEFAULT = C.THEME_DEFAULT, NAVY = '#011030', WHITE = '#ffffff', BLACK = '#000000';
  const base = () => ({ ...DEFAULT, ...P.series().theme });   // the "original" palette of the edition being worked on: its conference's own palette (conferences.js), else the shared default
  const FIELDS = [
    ['primary', 'Primary', 'Headings, links, tabs, and the outline of secondary buttons.'],
    ['secondary', 'Secondary', 'The navigation bar, the menu panel and the footer.'],
    ['accent', 'Accent', 'The line under the header, the accent button (for example “Register”) and highlights.'],
    ['background', 'Page background', 'Behind every page.'],
    ['surface', 'Surface', 'Cards, the header, forms, tables, and the fill of secondary buttons.'],
    ['text', 'Text', 'Body text and the outline of form fields.'],
    ['button', 'Main button', 'The fill of main buttons. The text on them is chosen automatically.'],
    ['border', 'Border and soft fill', 'Lines around cards, the background of table headings, soft highlights.'],
  ];

  /* ---------- color arithmetic ---------- */
  const norm = s => { s = String(s ?? '').trim().toLowerCase().replace(/^#/, ''); if (/^[0-9a-f]{3}$/.test(s)) s = [...s].map(c => c + c).join(''); return /^[0-9a-f]{6}$/.test(s) ? '#' + s : null; };
  const rgb = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  const lin = v => (v /= 255) <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4;
  const lum = h => { const [r, g, b] = rgb(h).map(lin); return .2126 * r + .7152 * g + .0722 * b; };
  const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); };
  const mix = (a, b, t) => '#' + rgb(a).map((v, i) => Math.round(v * (1 - t) + rgb(b)[i] * t).toString(16).padStart(2, '0')).join('');
  const on = bg => ratio(bg, WHITE) >= ratio(bg, NAVY) ? WHITE : NAVY;               // text on a colored fill: white or navy, whichever reads better
  const veryDark = c => lum(c) < .04;
  const clean = t => Object.fromEntries(Object.keys(DEFAULT).map(k => [k, norm(t && t[k]) || DEFAULT[k]]));   // anything that is not a valid color falls back to the default
  const same = (a, b) => { a = clean(a); b = clean(b); return Object.keys(DEFAULT).every(k => a[k] === b[k]); };

  /* everything the stylesheet needs, from the 8 colors */
  const vars = theme => {
    const t = clean(theme), bg = t.background, sf = t.surface, bt = t.button, ac = t.accent, sec = t.secondary, pr = t.primary;
    const v = { primary: pr, secondary: sec, accent: ac, bg, surface: sf, text: t.text, button: bt, border: t.border,
      'on-secondary': on(sec), 'on-button': on(bt), 'on-accent': on(ac),
      ink: [NAVY, WHITE].sort((a, b) => Math.min(ratio(b, bg), ratio(b, sf)) - Math.min(ratio(a, bg), ratio(a, sf)))[0],   // focus ring and error text: the one that stands out from both page and cards
      'button-hover': veryDark(bt) ? mix(bt, WHITE, .22) : mix(bt, BLACK, .25), 'button-active': veryDark(bt) ? mix(bt, WHITE, .35) : mix(bt, BLACK, .4),
      'primary-hover': lum(bg) > .4 ? mix(pr, BLACK, .25) : mix(pr, WHITE, .25), 'surface-hover': mix(sf, pr, .12),
      'secondary-hover': mix(sec, on(sec), .18), 'accent-dark': mix(ac, BLACK, .4), 'accent-hover': lum(ac) > .7 ? mix(ac, BLACK, .1) : mix(ac, WHITE, .25) };
    v['on-button-hover'] = on(v['button-hover']); v['on-button-active'] = on(v['button-active']); v['on-accent-hover'] = on(v['accent-hover']);
    v.gradient = `linear-gradient(90deg, ${mix(ac, BLACK, .25)} 0%, ${ac} 33%, ${mix(ac, WHITE, .15)} 66%, ${mix(ac, BLACK, .25)} 100%)`;
    return v;
  };
  const css = theme => Object.entries(vars(theme)).map(([k, v]) => `--t-${k}:${v}`).join(';');

  /* ---------- the readability checks (WCAG 2.1: 1.4.3 text 4.5:1, 1.4.11 outlines and focus 3:1) ---------- */
  const checks = theme => {
    const v = vars(theme), one = (label, a, b, need, tip) => { const r = ratio(a, b); return { label, a, b, need, r, ok: r >= need, tip }; };
    const two = (label, a, b, c, need, tip) => { const x = ratio(a, b), y = ratio(a, c), r = Math.min(x, y); return { label, a, b: `${b} and ${c}`, need, r, ok: r >= need, tip }; };
    const darker = 'Make the text color much darker or the background much lighter (or the other way round).';
    return [
      one('Body text on the page background', v.text, v.bg, 4.5, darker),
      one('Body text on cards and forms', v.text, v.surface, 4.5, darker),
      one('Headings and links on the page background', v.primary, v.bg, 4.5, 'Make the primary color darker (on a light page) or lighter (on a dark page).'),
      one('Links on cards and forms', v.primary, v.surface, 4.5, 'Make the primary color darker (on a light surface) or lighter (on a dark surface).'),
      one('Text on main buttons', v['on-button'], v.button, 4.5, 'The button color is too much in the middle: choose a clearly dark or clearly light color.'),
      two('Main button against cards and page (so it can be seen as a button)', v.button, v.surface, v.bg, 3, 'Make the button color stronger, or the surface and page background lighter.'),
      one('Text on main buttons when the pointer is over them', v['on-button-hover'], v['button-hover'], 4.5, 'Choose a clearly dark or clearly light button color.'),
      one('Text on the navigation bar and footer', v['on-secondary'], v.secondary, 4.5, 'Choose a clearly dark or clearly light secondary color.'),
      one('Text on the accent button', v['on-accent'], v.accent, 4.5, 'Choose a clearly dark or clearly light accent color.'),
      one('Table headings (text on the border color)', v.text, v.border, 4.5, 'Make the border color much lighter than the text color, or the text darker.'),
      one('Secondary buttons when the pointer is over them', v.primary, v['surface-hover'], 4.5, 'Make the primary color darker (on a light surface) or lighter (on a dark surface).'),
      two('Keyboard focus ring on the page and on cards', v.ink, v.bg, v.surface, 3, 'The page background and the surface are both mid-tone. Make the background clearly light or clearly dark.'),
    ];
  };
  P.theme = { DEFAULT, FIELDS, norm, ratio, vars, css, checks, same, clean };

  /* what visitors see: the live palette; the team also sees a waiting draft palette (marked on the page) */
  P.themePendingShown = () => !!(P.teamView() && S.settings.themePending);
  P.shownTheme = () => (P.themePendingShown() ? S.settings.themePending : S.settings.theme);

  /* ---------- the editor's unsaved state ---------- */
  const stage = () => { if (!P.themeStage || P.themeStage.ed !== ED.cur) P.themeStage = { ed: ED.cur, colors: clean(S.settings.theme), errs: {} }; return P.themeStage; };
  window.addEventListener('hashchange', () => { if (!location.hash.startsWith('#/admin/colors')) P.themeStage = null; });
  const stamp = () => new Date().toISOString().slice(0, 16).replace('T', ' ');
  const retire = old => { const h = S.settings.themeHistory ||= []; if (old && !h.some(x => same(x.theme, old))) h.unshift({ theme: clean(old), replacedAt: stamp() }); S.settings.themeHistory = h.slice(0, 5); };
  const MSG = 'Type a color like #296334: a # and six letters or digits (0-9, A-F). Three digits like #369 also work.';

  /* ---------- the preview: real site components inside a .site wrapper, so it is styled by the same rules as the live site ---------- */
  const quick = () => S.settings.header.type === HTYPES[0];
  const preview = colors => html`<div class="site theme-pv" style="${css(colors)}" inert aria-hidden="true">
    <p class="site-banner">Sample banner: registration closes soon</p>
    <header class="sitehead">${quick() ? P.siteHead(S.settings.logo) : html`<div class="hdr-quick"><div><p class="site-name">${S.settings.header.title || S.conf.name}</p></div></div>`}</header>
    <nav class="sitenav on-dark"><span class="nav-left"><span class="btn btn-ghost">☰ Menu</span></span><span class="btn btn-ghost">Sign in</span></nav>
    <div class="pv-main">
      <section class="card"><h3>Sample heading</h3><p>Body text looks like this, with a <span class="pv-link">link to another page</span> inside the sentence.</p>
        <div class="actions"><span class="btn">Main button</span><span class="btn btn-secondary">Secondary button</span><span class="btn btn-gold">Accent button</span></div>
        <div class="tabs"><span class="tab" aria-pressed="true">Chosen tab</span><span class="tab" aria-pressed="false">Other tab</span></div></section>
      <section class="card"><div class="field"><label>Form field</label><input value="Text typed in a field" readonly tabindex="-1" aria-label="Sample field"></div>
        <div class="field has-error"><label>Field with a problem</label><input value="" readonly tabindex="-1" aria-label="Sample field with a problem"><p class="err"><span aria-hidden="true">✖</span> <strong>Problem:</strong> Please fill in this box.</p></div></section>
      <div class="alert alert-info"><span class="sym" aria-hidden="true">i</span><div><strong>Note.</strong> An announcement looks like this.</div></div>
      <div class="alert alert-ok"><span class="sym" aria-hidden="true">✔</span><div><strong>Done.</strong> Your registration has been saved.</div></div>
      <div class="alert alert-warn"><span class="sym" aria-hidden="true">!</span><div><strong>Please note.</strong> The deadline is close.</div></div>
      <p><span class="badge st-accepted"><span aria-hidden="true">✔</span> Accepted</span> <span class="badge st-awaiting"><span aria-hidden="true">!</span> Awaiting update</span> <span class="badge st-initial"><span aria-hidden="true">○</span> Initial</span></p>
      <div class="table-wrap"><table><thead><tr><th>Session</th><th>Room</th></tr></thead><tbody><tr><td>Opening ceremony</td><td>Main Auditorium</td></tr></tbody></table></div></div>
    <footer class="sitefoot on-dark"><div class="stripe"></div><div class="foot-in"><p>Contact the organizers: <span class="pv-link">contact@example.org</span></p></div></footer></div>`;

  const resultRow = c => html`${c.ok ? html`<span class="badge st-accepted"><span aria-hidden="true">✔</span> Passes</span>` : html`<span class="badge st-awaiting"><span aria-hidden="true">!</span> Too low</span>`}${c.ok ? '' : html`<br><span class="muted">${c.tip}</span>`}`;
  const checkTable = colors => {
    const list = checks(colors), bad = list.filter(c => !c.ok);
    return html`${P.table({ caption: 'Readability checks', empty: '', rows: list, cols: [{ h: 'Combination', v: c => c.label }, { h: 'Colors', v: c => `${c.a} on ${c.b}` },
      { h: 'Contrast', v: c => `${(Math.floor(c.r * 100) / 100).toFixed(2)} to 1` }, { h: 'Needed', v: c => `${c.need} to 1` }, { h: 'Result', v: resultRow }] })}`;
  };
  const summaryText = colors => { const bad = checks(colors).filter(c => !c.ok); return bad.length ? `${bad.length} of ${checks(colors).length} combinations are hard to read (listed below). You can still save, after a warning.` : `All ${checks(colors).length} combinations are easy to read.`; };

  /* ---------- the page ---------- */
  const swatches = t => { const c = clean(t); return html`<span class="swatches" aria-hidden="true">${Object.values(c).map(h => html`<span style="background:${h}"></span>`)}</span><span class="sr-only">${FIELDS.map(([k, l]) => `${l} ${c[k]}`).join(', ')}</span>`; };
  const row = (st, [k, label, use]) => html`<div class="color-row${st.errs[k] ? ' has-error' : ''}"><div><label for="c-${k}-hex"><strong>${label}</strong></label><p class="hint" id="c-${k}-h">${use}</p></div>
    <div class="color-inputs"><input type="color" value="${st.colors[k]}" data-theme="${k}" data-kind="picker" aria-label="${label}: pick a color" class="color-pick">
      <input type="text" id="c-${k}-hex" value="${st.colors[k]}" data-theme="${k}" data-kind="hex" maxlength="7" spellcheck="false" autocomplete="off" aria-describedby="c-${k}-h c-${k}-e" ${raw(st.errs[k] ? 'aria-invalid="true"' : '')}>
      <button type="button" class="btn btn-small btn-secondary" data-act="themeone" data-k="${k}" aria-label="${label}: use the default color ${base()[k]}">Default</button></div>
    <p class="err" id="c-${k}-e">${st.errs[k] ? html`<span aria-hidden="true">✖</span> <strong>Problem:</strong> ${st.errs[k]}` : ''}</p></div>`;
  const dirty = st => !same(st.colors, S.settings.theme);

  P.add({
    path: '/admin/colors', area: 'admin', group: 'Website', nav: true, label: 'Site colors', title: 'Site colors: the visitor website palette',
    blurb: 'Choose the colors visitors see, with a live preview and readability checks.',
    ref: '9.3 palette; 9.4-9.6 roles of colors and contrast; 9.9 design tokens; 11.2 accessibility; 3.2 Website > Appearance (the live site has preset themes, not described)',
    note: 'Each edition has its own palette. The preview is the real set of site components, so what you see is what visitors get. Saved palettes live only in the browser tab (nothing is stored on a server). The administration area keeps its own colors. Contrast is measured with the WCAG 2.1 formula; warnings do not block saving, but the administrator must confirm.',
    view: () => {
      const st = stage(), live = S.settings.theme, pend = S.settings.themePending, hist = S.settings.themeHistory || [], draftEd = S.conf.status === 'draft', isDefault = same(live, base());
      return html`<p class="lead">These are the colors visitors see on the website of <strong>${P.tag()}</strong> only. Other editions keep their own colors, and so does the administration area.</p>
      <section class="card" aria-labelledby="th-cur"><h2 id="th-cur">Colors on the website now</h2>
        <div class="logo-row">${swatches(live)}<div><p><strong>${isDefault ? 'The original palette.' : 'A custom palette.'}</strong> ${S.conf.status === 'published' ? 'Visitors see it.' : 'Visitors will see it when the edition is published.'}</p>
          ${isDefault ? '' : html`<div class="actions"><button type="button" class="btn btn-secondary" data-act="themeorig">Restore the original palette on the website now</button></div>`}</div></div></section>
      ${pend ? html`<section class="card" aria-labelledby="th-pend"><h2 id="th-pend">Draft colors waiting to be published</h2><div class="logo-row">${swatches(pend)}<div><p>Visitors still see the colors above. The team sees these when previewing the website.</p>
        <div class="actions"><button type="button" class="btn btn-gold" data-act="themepub">Publish these colors now</button><a class="btn btn-secondary" href="#/site" data-act="themeprev">Preview on the website</a><button type="button" class="btn btn-secondary" data-act="themeedit">Change them in the editor</button><button type="button" class="btn btn-secondary" data-act="themedisc">Discard this draft</button></div></div></div></section>` : ''}
      <form id="theme-form" novalidate><section class="card" aria-labelledby="th-ed"><h2 id="th-ed">Choose colors</h2>
        <p>Pick a color with the square, or type its code (HEX) in the box next to it. Nothing is saved until you press a Save button.</p>
        <div class="color-rows">${FIELDS.map(f => row(st, f))}</div>
        <p class="muted">Text on buttons and bars, hover and pressed colors, and the keyboard focus ring are worked out from these colors. Status messages (“Done”, “Problem”) always carry a word and a symbol, and their meaning never depends on color alone.</p>
        <p class="theme-dirty" id="th-dirty" role="status">${dirty(st) ? 'You have changes that are not saved.' : 'No unsaved changes.'}</p>
        <div class="actions">${draftEd ? html`<button class="btn btn-primary" type="submit" value="save">Save these colors</button>`
          : html`<button class="btn btn-primary" type="submit" value="publish">Publish these colors now</button><button class="btn btn-secondary" type="submit" value="draft">Save as a draft (visitors keep the current colors)</button>`}
          <button type="button" class="btn btn-secondary" data-act="themecancel">Cancel</button><button type="button" class="btn btn-secondary" data-act="themereset">Reset all colors to the default</button></div></section></form>
      <section class="card" aria-labelledby="th-chk"><h2 id="th-chk">Readability check</h2><p>Measured as WCAG 2.1 asks: 4.5 to 1 for text, 3 to 1 for outlines and the focus ring. The page updates as you change a color.</p>
        <p class="theme-sum" id="th-sum" role="status">${summaryText(st.colors)}</p><div class="theme-checks">${checkTable(st.colors)}</div></section>
      <section class="card" aria-labelledby="th-pv"><h2 id="th-pv">Live preview</h2><p>This is how visitors will see the site with the colors above (a sample, not a real page). Resize the window or use a phone to see it at other widths; the colors are the same everywhere.</p>
        <div class="theme-frame">${preview(st.colors)}</div></section>
      ${hist.length ? html`<section class="card" aria-labelledby="th-his"><h2 id="th-his">Earlier palettes of this edition</h2><p>Each time the colors on the website change, the old ones are kept here (the last five).</p>
        <ul class="plain">${hist.map((h, i) => html`<li class="logo-row">${swatches(h.theme)}<span>Replaced ${h.replacedAt}</span><button type="button" class="btn btn-small btn-secondary" data-act="themeload" data-i="${i}">Load into the editor</button></li>`)}</ul></section>` : ''}`;
    },
  });

  /* ---------- live updates while the administrator types or picks ---------- */
  const repaint = () => {
    const st = stage(), fr = $('.theme-pv'); if (!fr) return;
    fr.setAttribute('style', css(st.colors));
    $('.theme-checks').innerHTML = checkTable(st.colors).s;
    const sum = $('#th-sum'), t = summaryText(st.colors); if (sum.textContent !== t) sum.textContent = t;       // only touch the announcement when it changes
    const d = $('#th-dirty'), dt = dirty(st) ? 'You have changes that are not saved.' : 'No unsaved changes.'; if (d.textContent !== dt) d.textContent = dt;
  };
  const setErr = (k, text) => {
    const st = stage(), p = $(`#c-${k}-e`), hex = $(`#c-${k}-hex`);
    if (text) st.errs[k] = text; else delete st.errs[k];
    p.innerHTML = text ? `<span aria-hidden="true">✖</span> <strong>Problem:</strong> ${esc(text)}` : '';
    if (text) hex.setAttribute('aria-invalid', 'true'); else hex.removeAttribute('aria-invalid');
    hex.closest('.color-row').classList.toggle('has-error', !!text);
  };
  const onTune = e => {
    const el = e.target, k = el.dataset && el.dataset.theme; if (!k) return;
    const st = stage();
    if (el.dataset.kind === 'picker') { st.colors[k] = el.value; $(`#c-${k}-hex`).value = el.value; setErr(k, ''); }
    else {
      const h = norm(el.value), typed = el.value.trim().replace(/^#/, '');
      if (!h) { setErr(k, e.type === 'change' || typed.length >= 6 ? MSG : ''); return; }   // while typing, only complain once it looks complete; always complain when the box is left
      st.colors[k] = h; setErr(k, ''); el.closest('.color-inputs').querySelector('.color-pick').value = h;
      if (e.type === 'change') el.value = h;
    }
    repaint();
  };
  document.addEventListener('input', onTune);
  document.addEventListener('change', onTune);

  const apply = async mode => {
    const st = stage();
    if (Object.keys(st.errs).length) { const k = Object.keys(st.errs)[0]; P.say('error', 'One of the color codes is not valid, so nothing was saved. Please correct it first.'); return $(`#c-${k}-hex`)?.focus(); }
    if (!dirty(st) && mode !== 'draft') return P.say('info', 'There are no changes to save. The colors on the website are the ones in the editor.');
    const bad = checks(st.colors).filter(c => !c.ok);
    if (bad.length && !await P.confirm({ title: 'Some colors are hard to read', ok: 'Yes, save them anyway', cancel: 'No, go back and change them', danger: true,
      text: html`These combinations are below the WCAG 2.1 minimum, so some visitors may not be able to read or see them:<ul>${bad.map(c => html`<li>${c.label} (${(Math.floor(c.r * 100) / 100).toFixed(2)} to 1, needs ${c.need} to 1)</li>`)}</ul>You can restore the original palette at any time.` })) return;
    const next = clean(st.colors);
    if (mode === 'draft') { S.settings.themePending = next; P.themeStage = null; P.refresh(); return P.say('ok', `The draft colors were saved for ${P.tag()}. Visitors keep the current colors. Use “Preview on the website” to check them, then publish them.`); }
    retire(S.settings.theme); S.settings.theme = next; S.settings.themePending = null; P.themeStage = null; P.refresh();
    P.say('ok', `The colors of ${P.tag()} were saved.${S.conf.status === 'published' ? ' Visitors see them now.' : ' Visitors will see them when the edition is published.'} Open the public website to check the pages.`);
  };
  document.addEventListener('submit', e => { if (e.target.id === 'theme-form') { e.preventDefault(); apply(e.submitter ? e.submitter.value : 'save'); } });

  Object.assign(P.act, {
    themeone(el) { const st = stage(), k = el.dataset.k; st.colors[k] = base()[k]; delete st.errs[k]; P.refresh(); $(`#c-${k}-hex`)?.focus(); },
    themereset() { const st = stage(); st.colors = base(); st.errs = {}; P.refresh(); P.say('info', 'The default palette is loaded in the editor. It is not saved yet: press a Save button to use it, or Cancel to go back.'); },
    themecancel() { P.themeStage = null; P.refresh(); P.say('info', 'Cancelled. The colors on the website have not been changed.'); },
    async themeorig() {
      if (!await P.confirm({ title: 'Restore the original palette?', ok: 'Yes, restore it', text: 'The website of this edition goes back to the original colors at once. Your current colors are kept under “Earlier palettes”.' })) return;
      retire(S.settings.theme); S.settings.theme = base(); S.settings.themePending = null; P.themeStage = null; P.refresh(); P.say('ok', 'The original palette is back on the website.');
    },
    themeload(el) { const h = (S.settings.themeHistory || [])[+el.dataset.i]; if (!h) return; const st = stage(); st.colors = clean(h.theme); st.errs = {}; P.refresh(); $('#th-ed')?.focus(); P.say('info', `The earlier palette (replaced ${h.replacedAt}) is loaded in the editor. It is not saved yet.`); },
    themeedit() { const st = stage(); st.colors = clean(S.settings.themePending); st.errs = {}; P.refresh(); $('#th-ed')?.scrollIntoView({ block: 'start' }); P.say('info', 'The draft colors are loaded in the editor.'); },
    async themepub() {
      if (!await P.confirm({ title: 'Publish these colors?', ok: 'Yes, publish them', text: 'Visitors will see them at once, on every page of this edition.' })) return;
      retire(S.settings.theme); S.settings.theme = S.settings.themePending; S.settings.themePending = null; P.themeStage = null; P.refresh(); P.say('ok', 'The colors were published. Open the public website to check them.');
    },
    async themedisc() { S.settings.themePending = null; P.refresh(); P.say('ok', 'The draft colors were discarded. The colors on the website are unchanged.'); },
    themeprev() { if (!P.teamView()) P.ui['site.role'] = 'Webmaster'; },
  });
})();

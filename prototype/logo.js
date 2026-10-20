/* Conference prototype: logo management for each conference edition (Conference > Logo).
   One standard square frame (P.logoHTML) is used everywhere a logo is shown, so every edition looks the same whatever file it uploads.
   The picture is never stretched: it is fitted inside the frame ("whole logo") or fills it ("crop"), and the position and zoom are stored
   as settings next to the file (non-destructive: the original is kept).
   FRONTEND ONLY: the chosen file is read in the browser and shown from a temporary address (blob URL) that lasts until the tab is closed.
   Nothing is uploaded or stored. The checks below make the screens behave like the real thing, but they run in the visitor's browser and can be bypassed:
   the real site must repeat every check on the server (see README section 11). Blueprint: 3.2 Website > Header (LOGO_SRC, LOGO_PLACE), 7.1 conference.logo_url, 11.2, 13.1. */
'use strict';
(() => {
  /* ---------- the specification (one place; the page and the checks both read it) ----------
     Frame: 6rem square = 120 px at the default text size, 144 px at "Largest"; 7rem (168 px) on the home page.
     2x for sharp display on high-resolution screens = 240 px at the default size, hence the minimum. 600 px leaves room to zoom and still be sharp at 2x. */
  const SPEC = { maxBytes: 2 * 1048576, minLong: 240, minShort: 48, maxPx: 4000, maxRatio: 4, recommended: 600, headerPx: 120, homePx: 168,
    kinds: { png: { label: 'PNG', ext: ['png'] }, svg: { label: 'SVG', ext: ['svg'] }, jpeg: { label: 'JPEG', ext: ['jpg', 'jpeg'] }, webp: { label: 'WebP', ext: ['webp'] } } };
  const ACCEPT = '.png,.svg,.jpg,.jpeg,.webp,image/png,image/svg+xml,image/jpeg,image/webp';
  const MB = n => (n / 1048576).toFixed(1).replace('.0', '') + ' MB';
  const gcd = (a, b) => b ? gcd(b, a % b) : a;

  /* ---------- what is this file really? (the first bytes, not the name) ---------- */
  const sniff = b => {
    const at = (s, i) => [...s].every((c, k) => b[i + k] === c.charCodeAt(0));
    if ([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a].every((x, i) => b[i] === x)) return 'png';
    if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return 'jpeg';
    if (at('RIFF', 0) && at('WEBP', 8)) return 'webp';
    if (at('GIF8', 0)) return 'gif';
    const t = new TextDecoder().decode(b).replace(/^\uFEFF/, '').trimStart();
    return /^(<\?xml[^>]*\?>\s*)?(<!--[\s\S]*?-->\s*)*(<!DOCTYPE svg[^>]*>\s*)?<svg[\s>]/i.test(t) ? 'svg' : null;
  };
  /* active content that must never be in a logo: scripts, event handlers, embedded pages, links to other sites, entity tricks */
  const ACTIVE = /<script|<foreignObject|<iframe|<embed|<object|<!ENTITY|\son[a-z]+\s*=|javascript:|(?:xlink:)?href\s*=\s*["']\s*(?:https?:|\/\/|data:text)/i;
  const svgSize = t => {
    const root = (t.match(/<svg\b[^>]*>/i) || [''])[0], num = n => { const m = root.match(new RegExp('\\s' + n + '\\s*=\\s*["\']\\s*([\\d.]+)\\s*(px)?\\s*["\']', 'i')); return m ? +m[1] : 0; };
    let w = num('width'), h = num('height');
    if (!w || !h) { const v = root.match(/viewBox\s*=\s*["']\s*[-\d.]+[ ,]+[-\d.]+[ ,]+([\d.]+)[ ,]+([\d.]+)/i); if (v) { w = +v[1]; h = +v[2]; } }
    return [w, h];
  };
  const decode = url => new Promise((ok, no) => { const i = new Image(); i.onload = () => ok(i); i.onerror = no; i.src = url; });

  /* Resolves to { errors, warnings, logo }: logo is set only when there are no errors. Every message says what is wrong and what to do. */
  async function check(file) {
    const errors = [], warnings = [], ext = (file.name.split('.').pop() || '').toLowerCase();
    if (!file.size) return { errors: ['This file is empty. Please choose the picture file again.'], warnings };
    if (file.size > SPEC.maxBytes) return { errors: [`This file is ${MB(file.size)}. The limit is ${MB(SPEC.maxBytes)}. Save the logo again at a smaller size, or as an SVG, and choose it again.`], warnings };
    const buf = new Uint8Array(await file.arrayBuffer()), kind = sniff(buf.subarray(0, 600));
    if (kind === 'gif') return { errors: ['GIF pictures are not accepted. Please use PNG or SVG (best), or JPEG or WebP.'], warnings };
    if (!kind) return { errors: [`“${file.name}” is not a picture this site can use. Its contents are not a PNG, SVG, JPEG or WebP. Please export the logo again as PNG or SVG.`], warnings };
    if (!SPEC.kinds[kind].ext.includes(ext)) return { errors: [`The file name ends in “.${ext}” but the contents are ${kind === 'svg' ? 'an' : 'a'} ${SPEC.kinds[kind].label} picture. Please export the logo again in the format you want, so the name and the contents agree.`], warnings };
    let w, h;
    if (kind === 'svg') {
      const text = new TextDecoder().decode(buf);
      if (ACTIVE.test(text)) return { errors: ['This SVG contains active content (scripts, event handlers, or links to other sites). It is not accepted. Export a plain SVG, or use a PNG.'], warnings };
      [w, h] = svgSize(text);
      if (!w || !h) return { errors: ['This SVG has no width and height or viewBox, so its size is unknown. Open it in a drawing program and save it again with a size, or use a PNG.'], warnings };
    }
    const url = URL.createObjectURL(file);
    let img;
    try { img = await decode(url); } catch { URL.revokeObjectURL(url); return { errors: ['The picture could not be opened. The file may be damaged. Please export it again.'], warnings }; }
    if (kind !== 'svg') { w = img.naturalWidth; h = img.naturalHeight; }
    const long = Math.max(w, h), short = Math.min(w, h);
    if (kind !== 'svg' && long > SPEC.maxPx) errors.push(`This picture is ${w} × ${h} pixels. The largest allowed side is ${SPEC.maxPx} pixels. Make it smaller and choose it again.`);
    if (kind !== 'svg' && long < SPEC.minLong) errors.push(`This picture is only ${w} × ${h} pixels. The longest side must be at least ${SPEC.minLong} pixels, or the logo looks blurry on high-resolution screens. Recommended: ${SPEC.recommended} × ${SPEC.recommended}.`);
    else if (kind !== 'svg' && short < SPEC.minShort) errors.push(`This picture is only ${short} pixels on its short side. It must be at least ${SPEC.minShort} pixels.`);
    if (long / short > SPEC.maxRatio) errors.push(`This picture is very ${w > h ? 'wide' : 'tall'} (${w} × ${h}). The shape must be no more extreme than ${SPEC.maxRatio}:1, or it would be tiny inside the logo frame. Crop it a little and choose it again.`);
    if (errors.length) { URL.revokeObjectURL(url); return { errors, warnings }; }
    const g = gcd(w, h), r = w / h;
    if (Math.abs(r - 1) > 0.02) warnings.push(`The shape is ${r >= 1 ? r.toFixed(1) + ':1 (wide)' : '1:' + (1 / r).toFixed(1) + ' (tall)'}, not square. It will be shown whole, never stretched, with empty space around it. Use “Fill the frame” below if you prefer to crop it.`);
    if (kind === 'jpeg') warnings.push('JPEG pictures cannot have a transparent background, so a colored box may show behind the logo. PNG or SVG is better.');
    if (kind !== 'svg' && long < SPEC.recommended) warnings.push(`The picture is smaller than the recommended ${SPEC.recommended} × ${SPEC.recommended} pixels. It is accepted, but zooming in will look soft.`);
    return { errors, warnings, logo: { name: file.name, kind, mime: file.type || 'image/' + kind, bytes: file.size, w, h, ratio: `${w / g}:${h / g}`, url } };
  }
  P.logo = { SPEC, sniff, check };

  /* ---------- the one frame every logo is shown in ---------- */
  const styleOf = l => `object-fit:${l.fit === 'cover' ? 'cover' : 'contain'};object-position:${+l.x}% ${+l.y}%;transform:scale(${+l.zoom});transform-origin:${+l.x}% ${+l.y}%`;
  P.logoHTML = (l, size = 'lg', decorative = false) => l ? html`<span class="logo-frame ${size}"><img src="${l.url}" alt="${decorative ? '' : l.alt}" style="${styleOf(l)}"></span>` : '';
  /* what visitors see: the live logo; the team also sees a waiting draft logo (marked on the page) */
  P.teamView = () => ['Webmaster', 'Administrator'].includes(u('site.role', 'Guest'));
  P.pendingShown = () => !!(P.teamView() && S.settings.logoPending);
  P.shownLogo = () => (P.pendingShown() ? S.settings.logoPending : S.settings.logo);
  const fresh = (l, extra) => ({ fit: 'contain', zoom: 1, x: 50, y: 50, ...l, ...extra });

  /* ---------- the unsaved choice ("stage"): lives only on this page and is dropped when the page is left ---------- */
  const stage = () => P.logoStage && P.logoStage.ed === ED.cur ? P.logoStage : null;
  const drop = () => { if (P.logoStage) { URL.revokeObjectURL(P.logoStage.url); P.logoStage = null; } P.logoErr = null; };
  const forget = l => { if (l && l.url.startsWith('blob:')) URL.revokeObjectURL(l.url); if (l) S.files = S.files.filter(f => f.id !== l.fileId); };
  window.addEventListener('hashchange', () => { if (!location.hash.startsWith('#/admin/logo')) drop(); });

  /* ---------- blur warning that follows the zoom ---------- */
  const blur = l => {
    if (l.kind === 'svg') return '';
    const d = (l.fit === 'cover' ? Math.min(l.w, l.h) : Math.max(l.w, l.h)) / (SPEC.headerPx * l.zoom);
    return d < 1 ? 'At this zoom the logo is enlarged beyond its real size, so it will look blurry. Zoom out or choose a larger file.'
      : d < 2 ? 'At this zoom the logo may look slightly soft on high-resolution screens. Zoom out a little or choose a larger file.' : '';
  };
  const note = (kind, text) => html`<p class="logo-note logo-note-${kind}"><span class="sym" aria-hidden="true">${kind === 'warn' ? '!' : 'i'}</span><span>${text}</span></p>`;

  /* ---------- previews: the big positioning frame plus the real header, phone header and menu bar ---------- */
  const quick = () => S.settings.header.type === HTYPES[0];
  const live = l => {
    const place = S.settings.header.logoPlace, w = blur(l);
    return html`<div class="logo-pos"><p class="logo-cap" id="lg-pos">Positioning view (same logo, enlarged)</p>${P.logoHTML(l, 'xl')}</div>
      <div class="logo-looks" aria-hidden="true">
        <p class="logo-cap">As visitors will see it</p>
        <div class="mock site" style="${P.theme.css(S.settings.theme)}"><div class="sitehead">${quick() ? P.siteHead(l) : html`<p class="muted">The header is not in “quick form”, so it does not show the logo.</p>`}</div>
          <div class="sitenav on-dark"><span class="nav-left">${place === 'in the menu' ? P.logoHTML(l, 'sm') : ''}<span class="btn btn-ghost">☰ Menu</span></span></div></div>
        <p class="logo-cap">Phone width</p>
        <div class="mock mock-phone site" style="${P.theme.css(S.settings.theme)}"><div class="sitehead">${quick() ? P.siteHead(l) : ''}</div></div></div>
      ${w ? note('warn', w) : ''}`;
  };

  /* ---------- the page ---------- */
  const specs = () => html`<dl class="dl specs">
    <dt>Formats</dt><dd><strong>PNG or SVG</strong> (best). JPEG and WebP are also accepted. A transparent background is best for PNG and SVG.</dd>
    <dt>Shape</dt><dd><strong>Square, 1:1</strong>. Other shapes up to 4:1 are accepted, shown whole and never stretched.</dd>
    <dt>Size in pixels</dt><dd>Recommended <strong>${SPEC.recommended} × ${SPEC.recommended}</strong>. At least ${SPEC.minLong} pixels on the longest side. At most ${SPEC.maxPx}. (SVG has no pixel size.)</dd>
    <dt>File size</dt><dd>At most <strong>${MB(SPEC.maxBytes)}</strong>.</dd>
    <dt>Where it appears</dt><dd>In a square frame: ${SPEC.headerPx} pixels wide in the header (144 at “Largest” text), ${SPEC.homePx} on the home page, small in the menu bar. The frame has a white background.</dd>
    <dt>Safety</dt><dd>The file is checked by its contents, not only its name. SVG files with scripts or links to other sites are refused.</dd></dl>`;
  const meta = l => `${l.name} · ${l.kind === 'svg' ? 'SVG' : l.w + ' × ' + l.h + ' px'} · ${l.bytes < 1024 ? l.bytes + ' B' : fmtSize(l.bytes)}${l.sample ? ' · sample placeholder' : ''}`;

  P.defForm('logo-place', {
    fields: () => [{ name: 'logoPlace', label: 'Where should the logo appear?', type: 'radio', options: [{ v: 'in the header', l: 'In the header (large) and on the home page' }, { v: 'in the menu', l: 'In the menu bar (small) and on the home page' }, { v: 'no', l: 'Nowhere (hide the logo)' }] }],
    run: v => { S.settings.header.logoPlace = v.logoPlace; P.say('ok', 'The place of the logo was saved.'); P.refresh(); },
  });
  P.add({
    path: '/admin/logo', area: 'admin', group: 'Conference', nav: true, label: 'Logo', title: 'Logo: upload, check and place',
    blurb: 'Upload, replace or remove the logo of this edition.',
    ref: '3.2 Website > Header (LOGO_SRC, LOGO_PLACE); 3.2 Uploads (folder header); 7.1 conference.logo_url; 9.7 and 11.2 images and alt text; 13.1 file upload security',
    note: 'The file is read in the browser and shown from a temporary address, so the checks, preview, crop and the save/publish steps are real, but nothing is uploaded or stored: the logo disappears on reload. The checks (real file type, size, pixels, SVG safety) run in the browser and could be bypassed, so the real site must repeat them on the server. Each edition has its own logo; a new edition starts with none.',
    view: () => {
      const L = S.settings.logo, pend = S.settings.logoPending, st = stage(), err = P.logoErr, draftEd = S.conf.status === 'draft', place = S.settings.header.logoPlace;
      return html`<p class="lead">The logo of <strong>${P.tag()}</strong> belongs to this edition only. Changing it never changes another year. The title and theme are set separately (<a href="#/admin/settings">Site settings</a>, <a href="#/admin/edition">Edition details</a>).</p>
      ${!quick() ? html`<div class="alert alert-info"><span class="sym" aria-hidden="true">i</span><div><strong>Note.</strong> The header of this edition is not in “quick form” (see Site settings, Header), so the header does not show this logo. The home page and the menu bar still do.</div></div>` : ''}
      <section class="card" aria-labelledby="lg-cur"><h2 id="lg-cur">Current logo</h2>
        ${L ? html`<div class="logo-row">${P.logoHTML(L, 'lg')}<div><p><strong>${S.conf.status === 'published' ? 'Visitors see this logo.' : 'Not visible to visitors yet (the edition is a draft).'}</strong></p><p class="muted">${meta(L)}</p><p class="muted">Text for screen readers: “${L.alt}”</p>
          <div class="actions"><button type="button" class="btn btn-secondary" data-act="logorep">Replace the logo</button><button type="button" class="btn btn-secondary" data-act="logodel">Remove the logo</button></div></div></div>`
          : html`<p class="empty">${P.tag()} has no logo yet. Choose a file below.</p>`}</section>
      ${pend ? html`<section class="card" aria-labelledby="lg-pend"><h2 id="lg-pend">Draft logo waiting to be published</h2><div class="logo-row">${P.logoHTML(pend, 'lg')}<div><p>Visitors still see the current logo. The team sees this one when previewing the website.</p><p class="muted">${meta(pend)}</p>
        <div class="actions"><button type="button" class="btn btn-gold" data-act="logopub">Publish this logo now</button><a class="btn btn-secondary" href="#/site" data-act="logoprev">Preview on the website</a><button type="button" class="btn btn-secondary" data-act="logodisc">Discard this draft logo</button></div></div></div></section>` : ''}
      <section class="card" aria-labelledby="lg-up"><h2 id="lg-up">Choose a new logo</h2><p>Requirements, before you choose a file:</p>${specs()}
        <div class="field"><label for="logo-file">Logo file</label><p class="hint">PNG or SVG, ${MB(SPEC.maxBytes)} or less. Nothing is saved until you press Save below the preview.</p>
          <input id="logo-file" type="file" accept="${ACCEPT}" data-onchange="logopick" ${raw(err ? 'aria-invalid="true" aria-describedby="logo-err"' : '')}></div>
        ${err ? html`<div class="alert alert-error" role="alert" id="logo-err"><span class="sym" aria-hidden="true">✖</span><div><strong>Problem.</strong> “${err.name}” cannot be used:<ul>${err.errors.map(e => html`<li>${e}</li>`)}</ul><p>The logo has not been changed.</p></div></div>` : ''}</section>
      ${st ? html`<section class="card" aria-labelledby="lg-prev"><h2 id="lg-prev" tabindex="-1">Check and adjust the new logo</h2>
        <p>${meta(st)}. <strong>It is not saved yet.</strong></p>${st.warnings.map(w => note('warn', w))}
        <form id="logo-form" novalidate><div class="logo-edit"><div class="logo-live">${live(st)}</div>
          <div class="logo-controls"><fieldset class="field"><legend>How the logo fits the square</legend>
            <label class="choice"><input type="radio" name="fit" value="contain" data-logo="fit" ${raw(st.fit === 'contain' ? 'checked' : '')}> Whole logo (nothing is cut off)</label>
            <label class="choice"><input type="radio" name="fit" value="cover" data-logo="fit" ${raw(st.fit === 'cover' ? 'checked' : '')}> Fill the frame (edges may be cropped)</label></fieldset>
            <div class="field"><label for="lg-zoom">Zoom: <output id="lg-zoom-o">${Math.round(st.zoom * 100)}%</output></label><input id="lg-zoom" type="range" min="100" max="300" step="5" value="${Math.round(st.zoom * 100)}" data-logo="zoom"></div>
            <div class="field"><label for="lg-x">Left to right: <output id="lg-x-o">${st.x}%</output></label><input id="lg-x" type="range" min="0" max="100" step="1" value="${st.x}" data-logo="x"></div>
            <div class="field"><label for="lg-y">Up and down: <output id="lg-y-o">${st.y}%</output></label><input id="lg-y" type="range" min="0" max="100" step="1" value="${st.y}" data-logo="y"></div>
            <p class="hint">Zoom in, then move the logo until the part you want is in the square. The whole logo stays visible at 100% zoom unless you choose “Fill the frame”.</p>
            <button type="button" class="btn btn-secondary btn-small" data-act="logoreset">Reset fit and position</button>
            <div class="field${st.altErr ? ' has-error' : ''}"><label for="f-alt">Text for people who cannot see the picture <span class="req">(required)</span></label><p class="hint" id="f-alt-h">Say what the logo shows, for example “${P.tag()} logo”. Screen readers read this.</p>
              <input id="f-alt" name="alt" type="text" value="${st.alt}" maxlength="120" data-logo="alt" aria-describedby="f-alt-h${st.altErr ? ' f-alt-e' : ''}" ${raw(st.altErr ? 'aria-invalid="true"' : '')}>${st.altErr ? html`<p class="err" id="f-alt-e"><span aria-hidden="true">✖</span> <strong>Problem:</strong> ${st.altErr}</p>` : ''}</div></div></div>
          <div class="actions">${draftEd ? html`<button class="btn btn-primary" type="submit" value="save">Save this logo</button>`
            : html`<button class="btn btn-primary" type="submit" value="publish">Publish this logo now</button><button class="btn btn-secondary" type="submit" value="draft">Save as a draft (visitors keep the current logo)</button>`}
            <button type="button" class="btn btn-secondary" data-act="logocancel">Cancel</button></div></form></section>` : ''}
      <section class="card" aria-labelledby="lg-pl"><h2 id="lg-pl">Where the logo appears</h2>${P.formHTML('logo-place', { logoPlace: place })}</section>`;
    },
  });

  /* ---------- actions ---------- */
  const repaint = () => { const s = stage(), box = $('.logo-live'); if (s && box) box.innerHTML = live(s).s; };
  Object.assign(P.act, {
    async logopick(el) {
      const file = el.files[0]; if (!file) return;
      const r = await check(file);
      drop();
      if (r.errors.length) { P.logoErr = { name: file.name, errors: r.errors }; P.refresh(); return P.say('error', 'That file cannot be used, and the logo has not been changed. The reasons are listed under “Choose a new logo”.'); }
      P.logoStage = fresh(r.logo, { ed: ED.cur, warnings: r.warnings, alt: `${P.tag()} logo` });
      P.refresh(); $('#lg-prev')?.focus();
      P.say('info', `“${file.name}” meets the requirements. Check the preview, then save. Nothing is saved yet.`);
    },
    logorep() { $('#logo-file')?.focus(); $('#logo-file')?.scrollIntoView({ block: 'center' }); },
    logoreset() { const s = stage(); if (!s) return; Object.assign(s, { fit: 'contain', zoom: 1, x: 50, y: 50 }); P.refresh(); },
    logocancel() { drop(); P.refresh(); P.say('info', 'Cancelled. The current logo has not been changed.'); },
    async logodel() {
      if (!await P.confirm({ title: 'Remove the logo?', danger: true, ok: 'Yes, remove it', text: `${P.tag()} will have no logo until you upload another one. Other editions are not touched.` })) return;
      forget(S.settings.logo); S.settings.logo = null; P.refresh(); P.say('ok', 'The logo was removed.');
    },
    async logodisc() { forget(S.settings.logoPending); S.settings.logoPending = null; P.refresh(); P.say('ok', 'The draft logo was discarded. The current logo is unchanged.'); },
    async logopub() {
      if (!await P.confirm({ title: 'Publish this logo?', ok: 'Yes, publish it', text: 'Visitors will see it at once, in the header, the menu bar and on the home page.' })) return;
      forget(S.settings.logo); S.settings.logo = S.settings.logoPending; S.settings.logoPending = null; P.refresh(); P.say('ok', 'The logo was published. Open the public website to check it.');
    },
    logoprev() { if (!P.teamView()) P.ui['site.role'] = 'Webmaster'; },
  });
  const onTune = e => {
    const el = e.target, s = stage(); if (!el.dataset || !el.dataset.logo || !s) return;
    const k = el.dataset.logo;
    if (k === 'alt') { s.alt = el.value; return; }
    if (k === 'fit') s.fit = el.value; else if (k === 'zoom') s.zoom = el.value / 100; else s[k] = +el.value;
    const o = $(`#lg-${k}-o`); if (o) o.textContent = k === 'zoom' ? Math.round(s.zoom * 100) + '%' : s[k] + '%';
    repaint();
  };
  document.addEventListener('input', onTune);
  document.addEventListener('change', onTune);
  document.addEventListener('submit', e => {
    if (e.target.id !== 'logo-form') return;
    e.preventDefault();
    const s = stage(), mode = e.submitter ? e.submitter.value : 'save', alt = (s.alt || '').trim();
    if (!alt) { s.altErr = 'Please describe the logo in a few words.'; P.refresh(); return $('#f-alt')?.focus(); }
    const fileId = 'f' + Date.now(), logo = { name: s.name, kind: s.kind, mime: s.mime, bytes: s.bytes, w: s.w, h: s.h, url: s.url, alt, fit: s.fit, zoom: s.zoom, x: s.x, y: s.y, fileId };
    S.files.push({ id: fileId, title: s.name, folder: 'header', ext: s.name.split('.').pop().toLowerCase(), size: fmtSize(s.bytes), logo: true });   // listed in "Files and pictures", like every uploaded file
    P.logoStage = null; P.logoErr = null;                      // the picture now belongs to the edition: do not revoke its address
    if (mode === 'draft') { forget(S.settings.logoPending); S.settings.logoPending = logo; P.refresh(); P.say('ok', `The draft logo was saved for ${P.tag()}. Visitors keep seeing the current logo. Use “Preview on the website” to check it, then publish it.`); }
    else { forget(S.settings.logo); S.settings.logo = logo; P.refresh(); P.say('ok', `The logo of ${P.tag()} was saved.${S.conf.status === 'published' ? ' Visitors see it now.' : ' Visitors will see it when the edition is published.'} Open the public website to check the header.`); }
  });
})();

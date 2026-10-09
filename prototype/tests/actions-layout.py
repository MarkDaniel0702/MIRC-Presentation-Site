"""Checks the Actions column of every admin table at several screen widths, text sizes and table spacings.
For each table it checks: the table fits its box (no sideways scrolling in table layout), nothing sticks out of its cell or the screen,
all action buttons have the same height, labels do not wrap, the gap between buttons is the same everywhere, and buttons line up
the same way in every row.
Needs: python -m pip install playwright && python -m playwright install chromium
Run:   python tests/actions-layout.py   (exit code 1 = a check failed)
"""
import itertools, json, pathlib, sys
from playwright.sync_api import sync_playwright

base = (pathlib.Path(__file__).resolve().parent.parent / "index.html").as_uri()

# Pages with tables that have an Actions column. Some need a little setup so the table has rows.
PAGES = ["/admin/papers", "/admin/reviewers", "/admin/review-papers", "/admin/registrations", "/admin/schedule", "/admin/rooms",
         "/admin/mail/templates", "/admin/pages", "/admin/homepage", "/admin/files"]
SETUP = {"/admin/schedule": "P.ui['sched.day']='2026-09-29'"}

CHECK = r"""
(density) => {
  const bad = [], r2 = n => Math.round(n * 10) / 10, vw = document.documentElement.clientWidth;
  if (document.documentElement.scrollWidth > vw + 1) bad.push('page scrolls sideways by ' + (document.documentElement.scrollWidth - vw) + 'px');
  document.querySelectorAll('.table-wrap').forEach(w => {
    const t = w.querySelector('table'), card = getComputedStyle(t).display === 'block';
    if (!card && w.scrollWidth > w.clientWidth + 1) bad.push('table "' + w.getAttribute('aria-label').slice(0, 25) + '" scrolls sideways by ' + (w.scrollWidth - w.clientWidth) + 'px');
    const cells = [...t.querySelectorAll('td.col-actions')]; if (!cells.length) return;
    const all = cells.flatMap(td => [...td.querySelectorAll('.btn')].map(b => ({ b, td })));
    const hs = new Set(all.map(x => Math.round(x.b.getBoundingClientRect().height))); if (hs.size > 1) bad.push('button heights differ: ' + [...hs]);
    all.forEach(({ b, td }) => {
      const q = b.getBoundingClientRect(), c = td.getBoundingClientRect(), label = b.innerText.trim().slice(0, 20);
      if (b.scrollWidth > b.clientWidth + 1 || b.scrollHeight > b.clientHeight + 1) bad.push('label clipped: ' + label);
      if (q.height > 2.6 * parseFloat(getComputedStyle(document.documentElement).fontSize) * 1.5) bad.push('label wraps (tall button): ' + label);
      if (q.right > c.right + 1 || q.left < c.left - 1) bad.push('button sticks out of its cell: ' + label);
      if (q.right > vw + 1) bad.push('button beyond the screen: ' + label);
    });
    // uniform gap between neighbouring buttons (vertical stack, side-by-side, or grid) and same layout in each row
    if (density === 'compact' && !card) cells.forEach(td => { const bs = [...td.querySelectorAll('.btn')].map(b => b.getBoundingClientRect().top); if (bs.length > 1 && bs.length < 4 && Math.max(...bs) - Math.min(...bs) > 2) bad.push('compact: up to 3 buttons should sit side by side in one row'); });
    const gaps = new Set();
    cells.forEach(td => { const bs = [...td.querySelectorAll('.btn')].map(b => b.getBoundingClientRect());
      for (let i = 1; i < bs.length; i++) { const dy = bs[i].top - bs[i - 1].bottom, dx = bs[i].left - bs[i - 1].right;
        if (dy > 1) gaps.add(Math.round(dy)); else if (dx > 1 && Math.abs(bs[i].top - bs[i - 1].top) < 2) gaps.add(Math.round(dx)); } });
    if (gaps.size > 1) bad.push('gaps between buttons differ: ' + [...gaps]);
    const byCount = {};
    cells.forEach(td => { const bs = [...td.querySelectorAll('.btn')]; if (bs.length < 2) return; const o = td.getBoundingClientRect();
      const sig = bs.map(b => { const q = b.getBoundingClientRect(); return Math.round(q.left - o.left) + ',' + Math.round(q.width) + ',' + Math.round(q.height); }).join('|');
      (byCount[bs.length] ||= new Set()).add(sig); });
    Object.entries(byCount).forEach(([n, s]) => { if (s.size > 1 && !card) bad.push('rows with ' + n + ' buttons are laid out differently: ' + [...s].slice(0, 2).join(' vs ')); });
  });
  return bad;
}
"""

fails, checked = [], 0
with sync_playwright() as p:
    b = p.chromium.launch()
    for width, density, size in itertools.product((1440, 1280, 1024, 820, 390), ("comfortable", "compact"), ("2", "3")):
        pg = b.new_page(viewport={"width": width, "height": 900})
        errs = []
        pg.on("console", lambda m: errs.append(m.text) if m.type in ("error", "warning") else None)
        pg.on("pageerror", lambda e: errs.append(str(e)))
        pg.goto(base)
        pg.wait_for_selector("main h1")
        pg.evaluate(f"document.documentElement.dataset.size='{size}'; document.documentElement.dataset.density='{density}'")
        for path in PAGES:
            pg.evaluate(SETUP.get(path, "0"))
            pg.evaluate(f"location.hash='{path}'")
            pg.wait_for_selector("main table")
            checked += 1
            for msg in pg.evaluate(CHECK, density):
                fails.append((width, density, "text size " + size, path, msg))
        if errs:
            fails.append((width, density, size, "-", "console: " + str(errs)))
        pg.close()
    b.close()

print(f"{checked} page views checked (5 widths x 2 spacings x 2 text sizes x {len(PAGES)} pages)")
if fails:
    seen = set()
    for f in fails:
        key = (f[0], f[1], f[2], f[4])
        if key not in seen:
            seen.add(key)
            print("FAIL", f)
    print(len(fails), "problems")
else:
    print("no problems")
sys.exit(1 if fails else 0)

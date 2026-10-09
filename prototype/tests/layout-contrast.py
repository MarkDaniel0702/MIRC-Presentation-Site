"""Checks at desktop, tablet and phone widths: no sideways scrolling, rendered text contrast (4.5:1, 3:1 for large text), visible keyboard focus.
Needs: python -m pip install playwright && python -m playwright install chromium
Run:   python tests/layout-contrast.py   (exit code 1 = a check failed)
"""
import pathlib, sys, json
from playwright.sync_api import sync_playwright

base = (pathlib.Path(__file__).resolve().parent.parent / "index.html").as_uri()
import tempfile
shots = pathlib.Path(tempfile.gettempdir()) / "mirc-prototype-screenshots"
shots.mkdir(exist_ok=True)

CONTRAST_JS = r"""
() => {
  const parse = c => { const m = c.match(/rgba?\(([^)]+)\)/); if (!m) return null; const p = m[1].split(/[ ,\/]+/).filter(Boolean).map(Number); return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 }; };
  const lin = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
  const L = c => 0.2126 * lin(c.r) + 0.7152 * lin(c.g) + 0.0722 * lin(c.b);
  const bgOf = el => { for (let e = el; e; e = e.parentElement) { const c = parse(getComputedStyle(e).backgroundColor); if (c && c.a > 0.9) return c; } return { r: 255, g: 255, b: 255, a: 1 }; };
  const out = [];
  document.querySelectorAll('body *').forEach(el => {
    if (['SCRIPT', 'STYLE', 'OPTION', 'NOSCRIPT'].includes(el.tagName)) return;
    const own = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());
    if (!own || !el.getClientRects().length) return;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || el.closest('.sr-only') || el.disabled || el.closest('[disabled]')) return;
    if (cs.webkitTextFillColor === 'rgba(0, 0, 0, 0)') return;           // gradient display title (decorative)
    const fg = parse(cs.color), bg = bgOf(el); if (!fg) return;
    const hi = Math.max(L(fg), L(bg)), lo = Math.min(L(fg), L(bg)), ratio = (hi + 0.05) / (lo + 0.05);
    const px = parseFloat(cs.fontSize), bold = parseInt(cs.fontWeight) >= 700, large = px >= 24 || (px >= 18.66 && bold);
    if (ratio < (large ? 3 : 4.5)) out.push({ tag: el.tagName, cls: el.className, text: el.textContent.trim().slice(0, 40), ratio: +ratio.toFixed(2), fg: cs.color, bg: `rgb(${bg.r},${bg.g},${bg.b})` });
  });
  return out;
}
"""

problems = []
with sync_playwright() as p:
    b = p.chromium.launch()
    for width, height, name in ((1280, 900, "desktop"), (820, 1100, "tablet"), (390, 844, "phone")):
        ctx = b.new_context(viewport={"width": width, "height": height})
        pg = ctx.new_page()
        errs = []
        pg.on("console", lambda m: errs.append(m.text) if m.type in ("error", "warning") else None)
        pg.on("pageerror", lambda e: errs.append(str(e)))
        pg.goto(base)
        pg.wait_for_selector("main h1")
        routes = pg.evaluate("P.routes.map(r => r.path)")
        paths = [r.replace(":id", "700001") if "/admin/papers/" in r else r.replace(":id", "p2") for r in routes]
        contrast_seen = set()
        for role in ("Guest", "Participant"):
            pg.evaluate(f"P.ui['site.role']='{role}'")
            for path in paths:
                if role == "Participant" and path.startswith("/admin"):
                    continue
                pg.evaluate(f"location.hash='{path}'")
                pg.wait_for_selector("main h1")
                over = pg.evaluate("document.documentElement.scrollWidth - window.innerWidth")
                if over > 1:
                    wide = pg.evaluate("[...document.querySelectorAll('body *')].filter(e => e.getBoundingClientRect().right > window.innerWidth + 1).slice(0,3).map(e => e.tagName + '.' + e.className)")
                    problems.append((name, role, path, f"horizontal overflow by {over}px: {wide}"))
                if width == 1280:
                    for f in pg.evaluate(CONTRAST_JS):
                        key = (f["tag"], f["cls"], f["text"][:20], f["ratio"])
                        if key not in contrast_seen:
                            contrast_seen.add(key)
                            problems.append((name, role, path, "contrast " + json.dumps(f)))
        # screenshots of key pages
        pg.evaluate("P.ui['site.role']='Guest'")
        for path, tag in (("/admin", "dashboard"), ("/admin/papers", "papers"), ("/admin/papers/700001", "paper"), ("/admin/schedule", "schedule"), ("/site", "site-home"), ("/admin/registrations", "regs")):
            pg.evaluate(f"location.hash='{path}'")
            pg.wait_for_selector("main h1")
            pg.screenshot(path=str(shots / f"{name}-{tag}.png"), full_page=False)
        if name == "phone":
            pg.evaluate("location.hash='/admin/papers'")
            pg.wait_for_selector("main h1")
            pg.get_by_role("button", name="Open menu").click()
            pg.screenshot(path=str(shots / "phone-menu-open.png"))
            pg.evaluate("location.hash='/admin/rooms'")
            pg.wait_for_selector("main h1")
            pg.get_by_role("button", name="Add a room").click()
            pg.screenshot(path=str(shots / "phone-dialog.png"))
        if errs:
            problems.append((name, "-", "-", f"console: {errs}"))
        ctx.close()

    # keyboard focus visibility + target sizes (desktop)
    ctx = b.new_context(viewport={"width": 1280, "height": 900})
    pg = ctx.new_page()
    pg.goto(base + "#/admin/papers")
    pg.wait_for_selector("main h1")
    seen = []
    for i in range(30):
        pg.keyboard.press("Tab")
        info = pg.evaluate("""() => { const e = document.activeElement, cs = getComputedStyle(e); return { tag: e.tagName, txt: (e.innerText || e.getAttribute('aria-label') || e.value || '').slice(0, 30), ow: parseFloat(cs.outlineWidth), os: cs.outlineStyle } }""")
        seen.append(info)
        if not (info["os"] != "none" and info["ow"] >= 3):
            problems.append(("keyboard", "-", "/admin/papers", f"focus not clearly visible on {info}"))
    print("first tab stops:", [s["tag"] + ":" + s["txt"] for s in seen[:6]])
    small = pg.evaluate("""() => [...document.querySelectorAll('main a, main button, main input, main select, main summary')].filter(e => e.getClientRects().length && !e.closest('.sr-only')).map(e => { const r = e.getBoundingClientRect(); return { t: (e.innerText || e.getAttribute('aria-label') || e.type || '').slice(0, 25), w: Math.round(r.width), h: Math.round(r.height), inline: getComputedStyle(e).display === 'inline' } }).filter(x => !x.inline && (x.h < 44 || x.w < 44))""")
    print("controls under 44px (info):", small[:8], "count:", len(small))
    b.close()

print("Screenshots (for looking at):", shots)
print("PROBLEMS:", json.dumps(problems, indent=1) if problems else "none")
sys.exit(1 if problems else 0)

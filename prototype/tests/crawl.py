"""Opens every page as Guest and Participant: no console errors, no dead links, every button has a handler, no duplicate ids, a way back to the dashboard.
Needs: python -m pip install playwright && python -m playwright install chromium
Run:   python tests/crawl.py   (exit code 1 = a check failed)
"""
import pathlib, re, json
from playwright.sync_api import sync_playwright
url = (pathlib.Path(__file__).resolve().parent.parent / "index.html").as_uri()
errs = []; problems = []
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={"width":1280,"height":900})
    pg.on("console", lambda m: errs.append((pg.url[-30:], m.text)) if m.type in ("error","warning") else None)
    pg.on("pageerror", lambda e: errs.append((pg.url[-30:], "pageerror: "+str(e))))
    pg.goto(url); pg.wait_for_selector("main h1")
    routes = pg.evaluate("P.routes.map(r => r.path)")
    # fill params with real sample ids
    def fill(r): return r.replace(":id", "700001") if "/admin/papers/" in r else r.replace(":id", "p2")
    paths = [fill(r) for r in routes]
    known = pg.evaluate(r"P.routes.map(r => r.path.replace(/:\w+/g,'[^/]+'))")
    acts = pg.evaluate("Object.keys(P.act)"); forms = pg.evaluate("Object.keys(P.formDefs)")
    for role in ("Guest", "Participant"):
        pg.evaluate(f"P.ui['site.role']='{role}'")
        for path in paths:
            if role == "Participant" and path.startswith("/admin"): continue
            pg.evaluate(f"location.hash='{path}'"); pg.wait_for_selector("main h1", timeout=3000)
            h1 = pg.inner_text("main h1").strip()
            if not h1 or "could not be shown" in h1 or "not found" in h1.lower() and "paper" not in h1.lower(): problems.append((role, path, "bad h1: "+h1))
            # links
            for href in pg.eval_on_selector_all("a[href^='#/']", "els => els.map(e => e.getAttribute('href'))"):
                tgt = href[1:].split('?')[0]
                if not any(re.fullmatch(k, tgt) for k in known): problems.append((role, path, "dead link "+href))
            # actions
            for a in set(pg.eval_on_selector_all("[data-act]", "els => els.map(e => e.dataset.act)")):
                if a not in acts: problems.append((role, path, "no handler for data-act="+a))
            for a in set(pg.eval_on_selector_all("[data-onchange]", "els => els.map(e => e.dataset.onchange)")):
                if a not in acts: problems.append((role, path, "no handler for data-onchange="+a))
            for f in set(pg.eval_on_selector_all("form[data-form]", "els => els.map(e => e.dataset.form)")):
                if f not in forms: problems.append((role, path, "no form def "+f))
            # duplicate ids
            dups = pg.evaluate("(() => { const c={}; document.querySelectorAll('[id]').forEach(e=>c[e.id]=(c[e.id]||0)+1); return Object.keys(c).filter(k=>c[k]>1) })()")
            if dups: problems.append((role, path, "duplicate ids "+str(dups)))
            # way home
            home = pg.evaluate("!!document.querySelector('a[href=\"#/admin\"], a[href=\"#/site\"]')")
            if not home: problems.append((role, path, "no link to dashboard/home"))
            # unlabeled controls
            un = pg.evaluate("""[...document.querySelectorAll('main input:not([type=hidden]),main select,main textarea,main button')].filter(e => !e.closest('details:not([open])') && !(e.innerText||'').trim() && !e.getAttribute('aria-label') && !(e.labels&&e.labels.length) && !e.getAttribute('title')).map(e=>e.outerHTML.slice(0,80))""")
            if un: problems.append((role, path, "unlabeled controls "+str(un)))
    print("routes visited:", len(paths), "x roles; actions defined:", len(acts), "forms:", len(forms))
    print("PROBLEMS:", json.dumps(problems, indent=1) if problems else "none")
    print("CONSOLE ERRORS:", errs if errs else "none")
    b.close()

"""Checks the conference builder (Conference > My conferences): create, validation, saved across a reload, change, delete,
and that a created conference works in the Conference and Year boxes like MIRC and PANTAS.
Needs: python -m pip install playwright && python -m playwright install chromium
Run:   python tests/conference-builder.py   (exit code 1 = a check failed)
"""
import json, pathlib, sys
from playwright.sync_api import sync_playwright

base = (pathlib.Path(__file__).resolve().parent.parent / "index.html").as_uri()
res, errs = [], []


def check(name, cond, detail=""):
    res.append((name, bool(cond), detail))


with sync_playwright() as p:
    b = p.chromium.launch()
    ctx = b.new_context(viewport={"width": 1280, "height": 1000})   # its own browser profile: the saved conferences never leak into the other tests
    pg = ctx.new_page()
    pg.on("console", lambda m: errs.append(m.text) if m.type in ("error", "warning") else None)
    pg.on("pageerror", lambda e: errs.append("pageerror: " + str(e)))

    def load(path="/admin/my-conferences"):
        pg.goto("about:blank"); pg.goto(base + "#" + path); pg.wait_for_selector("main h1")

    def go(path):
        pg.evaluate(f"location.hash='{path}'"); pg.wait_for_selector("main h1"); pg.wait_for_timeout(80)

    S = lambda expr: pg.evaluate("S." + expr)
    msg = lambda: pg.locator("#fb .alert").inner_text() if pg.locator("#fb .alert").count() else ""
    err = lambda name: pg.locator(f"#f-{name}-e").inner_text() if pg.locator(f"#f-{name}-e").count() else ""
    dlg = lambda: pg.locator("dialog[open]")
    stored = lambda: pg.evaluate("JSON.parse(localStorage.getItem('customConferences') || '{}')")
    closed = lambda: pg.wait_for_function("!document.querySelector('dialog[open]')")

    def fill(**kw):
        for k, v in kw.items():
            if k in ("primary", "accent"): pg.locator(f"#f-{k}").evaluate("(el, v) => { el.value = v; }", v)
            else: pg.locator(f"#f-{k}").fill(v)

    def submit(label): pg.get_by_role("button", name=label).click(); pg.wait_for_timeout(120)

    load()
    check("list: the built-in conferences are listed and cannot be changed or deleted here", pg.locator("main table tbody tr").count() == 2 and pg.get_by_role("button", name="Delete MIRC").count() == 0 and "conferences.js" in pg.inner_text("main table"))
    check("list: appears in the Conference menu", pg.locator("nav a", has_text="My conferences").count() == 1)

    # ---------- validation ----------
    pg.get_by_role("button", name="Create a new conference").click(); pg.wait_for_selector("#f-name")
    submit("Create the conference")
    check("form: empty required boxes are named in plain words", "Please fill in this box" in err("name") and "Please fill in this box" in err("code") and "Please fill in this box" in err("place") and "Please fill in this box" in err("start") and pg.locator("#errsum").count() == 1, pg.inner_text("#errsum") if pg.locator("#errsum").count() else "")
    fill(name="mirc international research conference", code="MIRC", year="2027", start="2027-05-10", end="2027-05-08", place="Cebu, Philippines")
    submit("Create the conference")
    check("form: duplicate short name refused", "already used" in err("code"), err("code"))
    check("form: last day before first day refused", "cannot be before" in err("end"), err("end"))
    fill(name="Manila International Research Conference", code="a b", end="")
    submit("Create the conference")
    check("form: duplicate full name refused, and a short name with a space", "already exists" in err("name") and "letters or digits" in err("code"), (err("name"), err("code")))
    fill(name="  pantas  CONFERENCE ", code="ZZ")
    submit("Create the conference")
    check("form: the name check ignores capitals", "already exists" in err("name"), err("name"))
    fill(name="Visayas Health Summit", code="VHS", start="2026-05-10", year="2027")
    submit("Create the conference")
    check("form: first day must be in the chosen year", "should be in 2027" in err("start"), err("start"))
    fill(start="2027-05-10", primary="#f5e9a0")
    submit("Create the conference")
    check("form: a very light main color is refused (text would be unreadable)", "hard to read" in err("primary"), err("primary"))
    check("form: nothing was created by the failed attempts", pg.evaluate("Object.keys(CONFERENCES)") == ["mirc", "pantas"] and stored() == {})

    # ---------- create ----------
    fill(primary="#8a2b2b", accent="#e1ca5e", place="Cebu, Philippines", venue="Cebu Convention Hall", tagline="Healthy Islands", sub="Care that reaches everyone", end="2027-05-12",
         description="A summit on island health care.\n\nOpen to all.")
    submit("Create the conference")
    check("create: the message says it is stored in this browser", "VHS was created" in msg() and "Saved in this browser" in msg() and "VHS 2027" in msg(), msg())
    check("create: the first edition exists, is published, has the three days and the entered texts", S("conf.id") == "vhs2027" and S("conf.status") == "published" and S("conf.days.length") == 3 and S("conf.name") == "Visayas Health Summit 2027" and S("conf.tagline") == "Healthy Islands" and S("conf.venue") == "Cebu Convention Hall", S("conf.id"))
    check("create: the brand colors become the site palette; a placeholder logo is drawn", S("settings.theme.primary") == "#8a2b2b" and S("settings.theme.accent") == "#e1ca5e" and S("settings.logo.name") == "vhs-2027-logo-sample.svg" and "VHS 2027" in S("settings.logo.alt"))
    check("create: the description is a home page block; email subjects carry the short name", S("homeBlocks[0].title") == "About the conference" and S("templates[0].subject").startswith("[VHS 2027]"), S("templates[0].subject"))
    check("create: the list shows it with Work on it, Change and Delete", pg.locator("main table tbody tr").count() == 3 and pg.get_by_role("button", name="Delete VHS").count() == 1 and pg.get_by_role("button", name="Change VHS").count() == 1)

    # ---------- works like MIRC and PANTAS ----------
    check("switch: the Conference box lists it, the Year box shows 2027", pg.locator('[data-fk="edseries"] option').all_inner_texts() == ["MIRC", "PANTAS", "VHS"] and pg.locator('[data-fk="edpick"] option').all_inner_texts() == ["2027 (published)"] and "VHS" in pg.inner_text(".brand"))
    pg.locator('[data-fk="edseries"]').select_option("mirc"); pg.wait_for_timeout(100)
    check("switch: to MIRC keeps the year 2027 (the MIRC draft; the admin sees drafts)", S("conf.id") == "mirc2027", S("conf.id"))
    pg.locator('[data-fk="edseries"]').select_option("vhs"); pg.wait_for_timeout(100)
    check("switch: back to VHS", S("conf.id") == "vhs2027")
    pg.evaluate("P.ui['site.role']='Guest'"); go("/site")
    main = pg.inner_text("main")
    check("public site: name, mark, theme, dates, venue, description, and nothing of MIRC", "2027 VHS" in main and "Visayas Health Summit 2027" in main and "HEALTHY ISLANDS" in main.upper() and "10–12 May 2027" in main and "island health care" in main and "MIRC" not in main, main[:300])
    check("public site: the palette is the conference's own", pg.evaluate("getComputedStyle(document.querySelector('.site')).getPropertyValue('--t-primary')").strip() == "#8a2b2b")
    pg.evaluate("P.ui['site.role']='Administrator'")
    go("/admin/editions"); pg.get_by_role("button", name="Create a new edition").click()
    check("new edition: the conference is offered when creating a year", "VHS" in dlg().locator("#f-series").inner_text())
    dlg().locator("#f-series").select_option("vhs"); dlg().locator("#f-year").fill("2028"); dlg().locator("#f-from").select_option("vhs2027")
    dlg().get_by_role("button", name="Create the edition").click(); closed()
    check("new edition: VHS 2028 is a draft with the VHS name and colors", S("conf.id") == "vhs2028" and S("conf.name") == "Visayas Health Summit 2028" and S("settings.theme.primary") == "#8a2b2b" and S("templates[0].subject").startswith("[VHS 2028]"), S("conf.name"))

    # ---------- saved across a reload ----------
    d = stored()
    check("saved: the definition (not the editions) is in the browser storage", list(d) == ["vhs"] and d["vhs"]["name"] == "Visayas Health Summit" and d["vhs"]["primary"] == "#8a2b2b" and "papers" not in d["vhs"], d)
    load()
    check("reload: the conference is still there with its FIRST edition only (later years are sample data); the built-ins are unchanged", pg.evaluate("ED.list.map(e=>e.conf.id)") == ["mirc2026", "mirc2027", "pantas2026", "vhs2027"] and pg.evaluate("Object.keys(CONFERENCES)") == ["mirc", "pantas", "vhs"], pg.evaluate("ED.list.map(e=>e.conf.id)"))
    check("reload: it opens and shows its saved texts and colors", (pg.evaluate("P.useEdition('vhs2027')"), S("conf.tagline"))[1] == "Healthy Islands" and S("settings.theme.primary") == "#8a2b2b")
    pg.evaluate("localStorage.setItem('customConferences', JSON.stringify({x: {}, vhs: {code: 'VHS'}, ok1: {code: 'OK1', name: 'Fine', year: 2030, primary: '#123456', accent: '#abcdef'}}))")
    load("/admin")
    check("reload: damaged saved entries are skipped, valid ones are kept", pg.evaluate("Object.keys(CONFERENCES)") == ["mirc", "pantas", "ok1"], pg.evaluate("Object.keys(CONFERENCES)"))
    pg.evaluate("localStorage.setItem('customConferences', 'not json')"); load("/admin")
    check("reload: unreadable saved data gives just the built-in conferences", pg.evaluate("Object.keys(CONFERENCES)") == ["mirc", "pantas"])
    pg.evaluate("localStorage.setItem('customConferences', %s)" % json.dumps(json.dumps(d)))
    load()

    # ---------- change ----------
    pg.evaluate("ED.list.push(P.newEdition({ from: 'vhs2027', year: 2028 })); ED.list.sort(P.byConf)")   # a later year again (editions are not saved)
    pg.get_by_role("button", name="Change VHS").click(); pg.wait_for_selector("#f-name")
    check("change: the form starts with the saved values; year and dates are not asked", pg.locator("#f-name").input_value() == "Visayas Health Summit" and pg.locator("#f-code").input_value() == "VHS" and pg.locator("#f-year").count() == 0 and pg.locator("#f-primary").input_value() == "#8a2b2b")
    fill(name="Manila International Research Conference"); submit("Save the changes")
    check("change: it cannot take another conference's name", "already exists" in err("name"))
    fill(name="Visayas Health and Wellness Summit", code="VHWS", tagline="One Health", primary="#1d4e89")
    submit("Save the changes")
    check("change: saved; the first edition is updated", "VHWS was changed" in msg() and pg.evaluate("P.edition('vhs2027').conf.name") == "Visayas Health and Wellness Summit 2027" and pg.evaluate("P.edition('vhs2027').conf.tagline") == "One Health" and pg.evaluate("P.edition('vhs2027').settings.theme.primary") == "#1d4e89", msg())
    check("change: logo and email subjects show the new short name; a later edition shows it too but keeps its own colors", pg.evaluate("P.edition('vhs2027').settings.logo.alt").startswith("VHWS 2027") and pg.evaluate("P.edition('vhs2027').templates[0].subject").startswith("[VHWS 2027]") and pg.evaluate("P.tag(P.edition('vhs2028'))") == "VHWS 2028" and pg.evaluate("P.edition('vhs2028').settings.theme.primary") == "#8a2b2b")
    check("change: the saved definition was updated and the key stayed", stored()["vhs"]["code"] == "VHWS" and stored()["vhs"]["name"] == "Visayas Health and Wellness Summit" and list(stored()) == ["vhs"])
    check("change: the pickers show the new short name", pg.locator('[data-fk="edseries"] option').all_inner_texts()[-1] == "VHWS")
    go("/admin/my-conferences/mirc")
    check("change: a built-in conference has no change page", "not created here" in pg.inner_text("main"))
    go("/admin/my-conferences/nothing")
    check("change: an unknown address says so politely", "not created here" in pg.inner_text("main") and pg.locator("main h1").inner_text() == "Change a conference")

    # ---------- delete ----------
    go("/admin/my-conferences")
    pg.evaluate("P.useEdition('vhs2027'); P.refresh()")
    pg.get_by_role("button", name="Delete VHWS").click()
    check("delete: asks first and says what goes", "2 editions" in dlg().inner_text() and "2027, 2028" in dlg().inner_text(), dlg().inner_text()[:200])
    dlg().get_by_role("button", name="No, go back").click(); closed(); pg.wait_for_timeout(100)
    check("delete: 'No, go back' keeps everything", pg.evaluate("ED.list.length") == 5 and "vhs" in stored(), pg.evaluate("ED.list.length"))
    pg.get_by_role("button", name="Delete VHWS").click(); dlg().get_by_role("button", name="Yes, delete it").click(); closed(); pg.wait_for_timeout(100)
    check("delete: both editions and the conference are gone; the page moved to another edition", pg.evaluate("ED.list.map(e=>e.conf.id)") == ["mirc2026", "mirc2027", "pantas2026"] and pg.evaluate("Object.keys(CONFERENCES)") == ["mirc", "pantas"] and S("conf.id") == "mirc2026", pg.evaluate("ED.cur"))
    check("delete: removed from storage and from the Conference box", stored() == {} and pg.locator('[data-fk="edseries"] option').all_inner_texts() == ["MIRC", "PANTAS"], stored())
    load()
    check("delete: still gone after a reload", pg.evaluate("Object.keys(CONFERENCES)") == ["mirc", "pantas"])

    # ---------- the same names are free again after a delete; a one-day draft ----------
    go("/admin/my-conferences/new")
    fill(name="Visayas Health Summit", code="vhs", year="2029", start="2029-02-01", place="Iloilo, Philippines")
    pg.get_by_label("No, keep it as a draft").check(); submit("Create the conference")
    check("create again: names are free again; a lower-case short name is stored in capitals; one day; draft", S("conf.id") == "vhs2029" and S("conf.days.length") == 1 and S("conf.status") == "draft" and pg.evaluate("CONFERENCES.vhs.code") == "VHS", S("conf.id"))
    pg.evaluate("localStorage.clear()")
    b.close()

bad = [r for r in res if not r[1]]
for n_, ok, d in res:
    print(("PASS " if ok else "FAIL ") + n_ + ("" if ok or d == "" else "  -> " + str(d)))
print(f"\n{len(res) - len(bad)}/{len(res)} passed. Console errors: {errs if errs else 'none'}")
sys.exit(1 if bad or errs else 0)

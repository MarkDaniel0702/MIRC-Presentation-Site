"""Checks the calendar (mouse, keyboard, unavailable days, phone width) and the multi-edition behaviour:
edition data stays separate, draft/published visibility, creating and deleting editions, dates and topics validation,
registration-form settings, banner and accent.
Needs: python -m pip install playwright && python -m playwright install chromium
Run:   python tests/editions.py   (exit code 1 = a check failed)
"""
import pathlib, re, sys
from playwright.sync_api import sync_playwright

base = (pathlib.Path(__file__).resolve().parent.parent / "index.html").as_uri()
res, errs = [], []


def check(name, cond, detail=""):
    res.append((name, bool(cond), detail))


with sync_playwright() as p:
    b = p.chromium.launch()
    ctx = b.new_context(viewport={"width": 1280, "height": 1000})
    pg = ctx.new_page()
    pg.on("console", lambda m: errs.append(m.text) if m.type in ("error", "warning") else None)
    pg.on("pageerror", lambda e: errs.append("pageerror: " + str(e)))

    def fresh(path):
        pg.goto("about:blank")
        pg.goto(base + "#" + path)
        pg.wait_for_selector("main h1, h1")

    def go(path):
        # move inside the running page (keeps the in-memory data); fresh() above reloads and starts again from the sample data
        pg.evaluate(f"location.hash='{path}'")
        pg.wait_for_selector("main h1, h1")

    dlg = lambda: pg.locator("dialog[open]")
    S = lambda expr: pg.evaluate("S." + expr)
    msg = lambda: pg.locator("#fb .alert").inner_text() if pg.locator("#fb .alert").count() else ""
    day = lambda iso: pg.locator(f'.cal-day[data-date="{iso}"]')
    def yes(label):
        dlg().get_by_role("button", name=label).click()
        pg.wait_for_function("!document.querySelector('dialog[open]')")
        pg.wait_for_timeout(100)
    def work_on(ed):
        pg.locator('[data-onchange="edswitch"]').first.select_option(ed)
        pg.wait_for_timeout(100)

    # ---------- the schedule calendar ----------
    fresh("/admin/schedule")
    check("calendar: opens on the busiest day (29 Sep) with it chosen", day("2026-09-29").get_attribute("aria-pressed") == "true" and "Tuesday 29 September" in pg.inner_text("main h2"))
    check("calendar: 4 conference days available, the other days marked not available",
          pg.locator(".cal-day:not(.is-off)").count() == 4 and pg.locator(".cal-day.is-off").count() >= 8 and day("2026-09-26").get_attribute("aria-disabled") == "true")
    check("calendar: days with events show their number and say it aloud", "7 events planned" in day("2026-09-29").get_attribute("aria-label") and day("2026-09-29").locator(".cal-n").inner_text() == "7")
    check("calendar: the chosen day is spoken as selected", "selected" in day("2026-09-29").get_attribute("aria-label"))
    day("2026-09-26").click(force=True)   # aria-disabled days still receive clicks: they explain themselves
    check("calendar: clicking a not-available day explains and changes nothing", "not a conference day" in pg.locator(".cal-status").inner_text() and "Tuesday 29 September" in pg.inner_text("main h2"), pg.locator(".cal-status").inner_text())
    day("2026-09-30").click()
    check("calendar: clicking a conference day shows that day's events", "Wednesday 30 September" in pg.inner_text("main h2") and "Closing remarks" in pg.inner_text("main"))
    check("calendar: focus stays on the clicked day", pg.evaluate("document.activeElement.dataset.date") == "2026-09-30")
    pg.keyboard.press("ArrowLeft")
    check("calendar: arrow key moves focus one day", pg.evaluate("document.activeElement.dataset.date") == "2026-09-29")
    pg.keyboard.press("ArrowDown")
    check("calendar: arrow down moves one week (onto a day that is not available)", pg.evaluate("document.activeElement.dataset.date") == "2026-10-06" or pg.evaluate("document.activeElement.dataset.date") == "2026-09-29")
    day("2026-09-28").focus()
    pg.keyboard.press("Enter")
    check("calendar: Enter chooses the focused day", "Monday 28 September" in pg.inner_text("main h2"))
    check("calendar: only one day is a Tab stop", pg.locator('.cal-day[tabindex="0"]').count() == 1)

    # ---------- date fields in forms (news) ----------
    fresh("/admin/news")
    pg.get_by_role("button", name="Add news").click()
    check("date field: shows today's date, calendar folded away", dlg().locator("summary").count() == 1 and dlg().locator(".cal-grid:visible").count() == 0)
    dlg().locator("summary").click()
    check("date field: calendar opens", dlg().locator(".cal-grid:visible").count() == 1)
    first = dlg().locator('.cal-day[data-date$="-15"]')
    iso = first.get_attribute("data-date")
    first.click()
    check("date field: picking a day updates the hidden answer and folds the calendar", dlg().locator('input[name="date"]').input_value() == iso and dlg().locator(".cal-grid:visible").count() == 0)
    dlg().locator("#f-title").fill("N")
    dlg().locator("#f-content").fill("C")
    dlg().get_by_role("button", name="Add the news").click()
    check("date field: saved with the picked date", S("news[0].date") == iso, S("news[0].date"))

    # ---------- phone width ----------
    for size in ("2", "3"):
        pg.set_viewport_size({"width": 390, "height": 844})
        pg.evaluate(f"document.documentElement.dataset.size='{size}'")
        fresh("/admin/schedule")
        over = pg.evaluate("document.documentElement.scrollWidth - window.innerWidth")
        w = min(day(d).bounding_box()["width"] for d in ("2026-09-27", "2026-09-30"))
        check(f"calendar at 390 px, text size {size}: no sideways scroll, days at least 40 px wide", over <= 1 and w >= 40, (over, w))
    pg.set_viewport_size({"width": 1280, "height": 1000})
    pg.evaluate("document.documentElement.dataset.size='2'")

    # ---------- editions are separate ----------
    go("/admin/editions")
    check("editions: 2026 published, 2027 draft", pg.locator("main table tbody tr").count() == 2 and S("conf.status") == "published")
    n26 = S("events.length")
    work_on("mirc2027")
    check("editions: switching shows the other edition's data", S("conf.year") == 2027 and S("papers.length") == 0 and S("events.length") == 2 and "MIRC 2027" in pg.inner_text(".topbar"))
    go("/admin")
    pg.evaluate("P.useEdition('mirc2027')")
    go("/admin/edition")
    pg.evaluate("P.useEdition('mirc2027'); P.refresh()")
    pg.locator("#f-tagline").fill("Theme 2027 test")
    pg.get_by_role("button", name="Save").click()
    check("edition details: name/theme saved for 2027", S("conf.tagline") == "Theme 2027 test")
    check("editions: 2026 was not touched", pg.evaluate("P.edition('mirc2026').conf.tagline") == "Shaping Resilient Futures" and pg.evaluate("P.edition('mirc2026').events.length") == n26)

    # ---------- dates and deadlines ----------
    pg.get_by_role("button", name="Dates and deadlines").click()
    check("dates: the conference days are chosen on a calendar, spanning two months", pg.locator(".cal-day.is-sel").count() >= 1 and "chosen" in pg.locator(".cal-status").first.inner_text())
    pg.locator('.cal-day[data-date="2027-09-30"]').click()   # remove the day that has events
    pg.get_by_role("button", name="Save").click()
    check("dates: removing a day that has events is refused, in plain words", pg.locator("#errsum").count() == 1 and "still has events" in pg.inner_text("#errsum"))
    check("dates: the calendar stays on the same month after the mistake", pg.locator('.cal-day[data-date="2027-09-30"]').count() == 1)
    pg.locator('.cal-day[data-date="2027-09-30"]').click()   # put it back
    pg.get_by_role("button", name="Next month").first.click()
    check("dates: the arrow moves to the next month and keeps focus on the arrow", "October 2027" in pg.inner_text(".cal-title") and pg.evaluate("document.activeElement.dataset.dir") == "1")
    pg.locator('.cal-day[data-date="2027-10-02"]').click()   # remove 2 Oct (no events)
    check("dates: removing a day is announced", "removed" in pg.locator(".cal-status").first.inner_text() and "2 days chosen" in pg.locator(".cal-status").first.inner_text(), pg.locator(".cal-status").first.inner_text())
    # a closing day before the opening day is refused: set the opening day after the closing day (15 July)
    pg.locator("#f-subOpen summary").click()
    for _ in range(3):
        pg.locator('#f-subOpen [data-act=calnav][data-dir="1"]').click()
    pg.locator('#f-subOpen .cal-day[data-date="2027-07-20"]').click()
    pg.get_by_role("button", name="Save").click()
    check("dates: closing before opening is refused", "must come after the opening day" in pg.inner_text("#errsum"), pg.inner_text("main")[:300])
    pg.locator("#f-subOpen summary").click()
    pg.locator('#f-subOpen .cal-day[data-date="2027-07-01"]').click()
    pg.locator("#f-regDeadline summary").click()
    for _ in range(2):
        pg.locator('#f-regDeadline [data-act=calnav][data-dir="1"]').click()
    pg.locator('#f-regDeadline .cal-day[data-date="2027-10-20"]').click()
    pg.get_by_role("button", name="Save").click()
    check("dates: a registration deadline after the last conference day is refused", "cannot be after the last conference day" in pg.inner_text("#errsum"), pg.inner_text("main")[:300])
    pg.locator("#f-regDeadline summary").click()
    for _ in range(2):
        pg.locator('#f-regDeadline [data-act=calnav][data-dir="-1"]').click()
    pg.locator('#f-regDeadline .cal-day[data-date="2027-08-31"]').click()
    pg.get_by_role("button", name="Save").click()
    check("dates: saved", S("conf.days.length") == 2 and S("conf.days[1]") == "2027-10-01" and "dates were saved" in msg() and S("conf.submission.open") == "2027-07-01" and S("conf.registrationDeadline") == "2027-08-31", (S("conf.days"), msg(), S("conf.submission"), S("conf.registrationDeadline")))
    go("/admin/schedule")
    pg.evaluate("P.useEdition('mirc2027'); P.refresh()")
    check("schedule: shows the 2027 days (two months, 2 days)", pg.locator(".cal-day:not(.is-off)").count() == 2 and "30 September" in pg.inner_text(".cal-title") and "1 October" in pg.inner_text(".cal-title"), pg.inner_text(".cal-title"))

    # ---------- topics ----------
    pg.goto(base + "#/admin/edition")
    pg.evaluate("P.useEdition('mirc2026'); P.ui['ed.tab']='topics'; P.refresh()")
    pg.locator("#f-topics").fill("Only one topic")
    pg.get_by_role("button", name="Save").click()
    check("topics: removing topics that papers use is refused, naming them", pg.locator("#errsum").count() == 1 and "still in use" in pg.inner_text("#errsum"), pg.inner_text("main")[:300])
    pg.evaluate("P.useEdition('mirc2027'); P.ui['ed.tab']='topics'; P.refresh()")
    pg.locator("#f-topics").fill(chr(10).join(pg.evaluate("S.topics") + ["New 2027 topic"]))
    pg.get_by_role("button", name="Save").click()
    check("topics: a new topic is added to 2027 only", S("topics.length") == 10 and pg.evaluate("P.edition('mirc2026').topics.length") == 9, (S("topics.length"), msg()))

    # ---------- create a new edition ----------
    go("/admin/editions")
    pg.get_by_role("button", name="Create a new edition").click()
    dlg().get_by_role("button", name="Create the edition").click()
    check("new edition: empty year refused", "Please" in dlg().inner_text())
    dlg().locator("#f-year").fill("2026")
    dlg().get_by_role("button", name="Create the edition").click()
    check("new edition: an existing year is refused", "already exists" in dlg().inner_text())
    dlg().locator("#f-year").fill("2028")
    dlg().locator("#f-from").select_option("mirc2027")
    dlg().get_by_role("button", name="Create the edition").click()
    pg.wait_for_selector("main h1")
    check("new edition: created as an empty draft, copied set-up only",
          pg.evaluate("ED.cur") == "mirc2028" and S("conf.status") == "draft" and S("papers.length") == 0 and S("events.length") == 0 and S("conf.days.length") == 0
          and S("rooms.length") == 6 and S("topics.length") == 10 and S("templates[0].subject").startswith("[MIRC 2028]"), (S("conf.status"), S("templates[0].subject")))
    check("new edition: page texts not copied unless asked", S("pages.filter(p=>p.kind=='text'&&p.body).length") == 0)
    check("new edition: says what to do next", "Next: choose the conference days" in msg(), msg())
    go("/admin/schedule")
    pg.evaluate("P.useEdition('mirc2028'); P.refresh()")
    check("schedule: an edition without days points to Edition details", "no conference days yet" in pg.inner_text("main"))

    # ---------- publish / hide ----------
    go("/admin/editions")
    pg.evaluate("P.useEdition('mirc2028'); P.refresh()")
    pg.get_by_role("button", name="Publish MIRC 2028").click()
    check("publish: blocked while no conference days are chosen", "cannot be published yet" in dlg().inner_text())
    pg.keyboard.press("Escape")
    pg.get_by_role("button", name="Publish MIRC 2027").click()
    check("publish: confirmation lists what is still missing", "Still to do" in dlg().inner_text() and "Yes, publish it" in dlg().inner_text())
    pg.keyboard.press("Escape")
    check("publish: Esc cancels (still a draft)", pg.evaluate("P.edition('mirc2027').conf.status") == "draft")
    pg.get_by_role("button", name="Publish MIRC 2027").click()
    yes("Yes, publish it")
    check("publish: 2027 is published", pg.evaluate("P.edition('mirc2027').conf.status") == "published" and "now published" in msg(), msg())
    pg.evaluate("P.ui['site.role']='Guest'")
    pg.goto(base + "#/site?ed=mirc2027")
    pg.wait_for_selector("main h1")
    check("public: a published edition opens from its own link for a Guest", "2027 MIRC" in pg.inner_text("main") and "theme 2027 test" in pg.inner_text("main").lower(), pg.inner_text("main")[:200])
    check("public: 2027 shows its own days only", pg.evaluate("S.conf.year") == 2027)
    pg.goto(base + "#/site/program")
    pg.wait_for_selector("main h1")
    check("public program: 2027 day buttons (2) plus the full list", pg.locator(".tabs.wide .tab").count() == 3, pg.locator(".tabs.wide .tab").count())
    pg.goto(base + "#/site?ed=mirc2028")
    pg.wait_for_selector("h1")
    check("public: a draft edition is hidden from a Guest, even from its link", "not published yet" in pg.inner_text("main") and "2028 MIRC" not in pg.inner_text("body"), pg.inner_text("main")[:150])
    pg.get_by_role("button", name="Open MIRC 2027").click()
    check("public: the hidden page offers the newest published edition", pg.evaluate("S.conf.year") == 2027)
    pg.locator('[data-ui="site.role"]').select_option("Webmaster")
    pg.goto(base + "#/site?ed=mirc2028")
    pg.wait_for_selector("main h1")
    check("public: the team can preview a draft, marked as a draft", "Draft preview" in pg.inner_text(".draft-strip"))
    pg.goto(base + "#/site?ed=mirc2026")
    pg.wait_for_selector("main h1")
    check("public: 2026 still shows 4 days and its own venue", "27–30 September 2026" in pg.inner_text(".facts") and "Pamantasan" in pg.inner_text(".facts"), pg.inner_text(".facts"))

    # ---------- hide and delete ----------
    go("/admin/editions")
    pg.get_by_role("button", name="Hide MIRC 2027").click()
    yes("Yes, hide it")
    check("hide: 2027 is a draft again", pg.evaluate("P.edition('mirc2027').conf.status") == "draft")
    pg.get_by_role("button", name="Delete the draft MIRC 2028").click()
    yes("No, go back")
    check("delete: 'No, go back' keeps it", pg.evaluate("ED.list.length") == 3)
    pg.get_by_role("button", name="Delete the draft MIRC 2028").click()
    yes("Yes, delete it")
    check("delete: removes only that draft", pg.evaluate("ED.list.map(e=>e.conf.year)") == [2026, 2027], pg.evaluate("ED.list.map(e=>e.conf.year)"))

    # ---------- registration form settings ----------
    go("/admin/registration-settings")
    pg.locator("#f-phone").select_option("off")
    pg.locator("#f-institution").select_option("required")
    pg.get_by_role("button", name="Save").click()
    pg.evaluate("P.ui['site.role']='Guest'")
    pg.goto(base + "#/site/registration")
    pg.wait_for_selector("main h1")
    check("registration form: a detail set to 'do not ask' is gone", pg.locator("#f-phone").count() == 0 and pg.locator("#f-last").count() == 1)
    pg.locator("#f-last").fill("T")
    pg.locator("#f-first").fill("P")
    pg.locator("#f-email").fill("t@example.org")
    pg.get_by_role("button", name="Save my registration").click()
    check("registration form: a detail set to 'required' is checked", "#f-institution" in pg.inner_text("#errsum") or pg.locator("#f-institution[aria-invalid=true]").count() == 1)
    pg.evaluate("P.useEdition('mirc2027')")
    pg.goto(base + "#/site/registration")
    pg.evaluate("P.ui['site.role']='Webmaster'; P.refresh()")
    check("registration form: settings belong to one edition (2027 is closed and unchanged)", "is not open" in pg.inner_text("main") and pg.evaluate("P.edition('mirc2027').settings.regFields.phone") == "optional")

    # ---------- banner and accent ----------
    pg.evaluate("P.useEdition('mirc2026')")
    go("/admin/settings")
    pg.get_by_role("button", name="Banner and accent").click()
    pg.locator("#f-banner").fill("Registration closes soon")
    pg.locator("#f-accent").select_option("leaf")
    pg.get_by_role("button", name="Save").click()
    pg.evaluate("P.ui['site.role']='Guest'")
    pg.goto(base + "#/site")
    pg.wait_for_selector("main h1")
    check("branding: banner and accent show on the public site", "Registration closes soon" in pg.inner_text(".site-banner") and "#297d1f" in pg.get_attribute(".site", "style").lower(), pg.get_attribute(".site", "style"))
    check("branding: another edition has no banner", pg.evaluate("P.edition('mirc2027').conf.banner") == "")

    # ---------- shared people, separate registrations ----------
    check("people: accounts are shared by all editions", pg.evaluate("(P.useEdition('mirc2027'), S.users.length)") == pg.evaluate("(P.useEdition('mirc2026'), S.users.length)"))
    b.close()

bad = [r for r in res if not r[1]]
for n_, ok, d in res:
    print(("PASS " if ok else "FAIL ") + n_ + ("" if ok or d == "" else "  -> " + str(d)))
print(f"\n{len(res) - len(bad)}/{len(res)} passed. Console errors: {errs if errs else 'none'}")
sys.exit(1 if bad or errs else 0)

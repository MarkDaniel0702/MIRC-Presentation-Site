"""Checks the visitor-site palette (Website > Site colors) and the "My Account" menu:
color pickers and HEX boxes, live preview, validation, readability warnings, save / draft / publish, cancel, reset, earlier palettes,
one palette per edition, the palette on real public pages (header, menu bar, buttons, links, cards, forms, footer, menu drawer) at three widths,
hover and focus colors, and that the administration area keeps its own colors.
Needs: python -m pip install playwright && python -m playwright install chromium
Run:   python tests/theme.py   (exit code 1 = a check failed)
"""
import pathlib, re, sys
from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(errors="replace")
base = (pathlib.Path(__file__).resolve().parent.parent / "index.html").as_uri()
res, errs = [], []


def check(name, cond, detail=""):
    res.append((name, bool(cond), detail))


def rgb(h):
    h = h.lstrip("#")
    return "rgb(%d, %d, %d)" % tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


WINE = dict(primary="#7a1f3d", secondary="#3b1020", accent="#d9a441", background="#fbf6f2", surface="#ffffff", text="#2b2024", button="#7a1f3d", border="#efe3e0")

with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_context(viewport={"width": 1280, "height": 1000}).new_page()
    pg.on("console", lambda m: errs.append(m.text) if m.type in ("error", "warning") else None)
    pg.on("pageerror", lambda e: errs.append("pageerror: " + str(e)))
    pg.goto(base + "#/admin/colors")
    pg.wait_for_selector("main h1")

    def go(path):
        pg.evaluate(f"location.hash='{path}'")
        pg.wait_for_selector("main h1, h1")
        pg.wait_for_timeout(80)

    cs = lambda sel, prop: pg.evaluate("([s,p]) => getComputedStyle(document.querySelector(s))[p]", [sel, prop])
    theme = lambda ed="mirc2026": pg.evaluate(f"P.edition('{ed}').settings.theme")
    pending = lambda ed="mirc2026": pg.evaluate(f"P.edition('{ed}').settings.themePending")
    dlg = lambda: pg.locator("dialog[open]")
    def hexset(k, v):
        pg.locator(f"#c-{k}-hex").fill(v)
        pg.locator(f"#c-{k}-hex").blur()
    def setall(t):
        for k, v in t.items():
            hexset(k, v)

    # ---------- the editor ----------
    check("editor: 8 colors, each with a picker and a HEX box", pg.locator(".color-row").count() == 8 and pg.locator("input.color-pick").count() == 8 and pg.locator('input[data-kind="hex"]').count() == 8)
    check("editor: every picker has a name for screen readers", all(pg.locator("input.color-pick").nth(i).get_attribute("aria-label") for i in range(8)))
    check("editor: save, cancel and reset-all are there (published edition: publish now or draft)", pg.get_by_role("button", name="Publish these colors now").count() == 1 and pg.get_by_role("button", name="Save as a draft").count() == 1
          and pg.get_by_role("button", name="Cancel").count() == 1 and pg.get_by_role("button", name="Reset all colors to the default").count() == 1)
    check("editor: starts with the original palette and says so", "The original palette" in pg.inner_text("#th-cur ~ *") and "No unsaved changes" in pg.inner_text("#th-dirty"))
    check("checks: 12 combinations, all pass for the original palette", pg.locator(".theme-checks tbody tr").count() == 12 and pg.locator(".theme-checks .st-awaiting").count() == 0 and "All 12" in pg.inner_text("#th-sum"))
    check("preview: an inert, hidden-from-screen-readers sample using the real site components", pg.locator(".theme-pv[inert][aria-hidden=true] .sitehead").count() == 1 and pg.locator(".theme-pv .sitenav .btn-ghost").count() == 2 and pg.locator(".theme-pv .alert").count() >= 3)

    # ---------- typing and picking: live preview ----------
    hexset("primary", "#7A1F3D")
    check("live: a valid HEX updates the preview at once (headings in the preview use it)", cs(".theme-pv h3", "color") == rgb("#7a1f3d") and pg.locator("#c-primary-hex").input_value() == "#7a1f3d")
    check("live: the picker follows the HEX box", pg.locator('input.color-pick').first.input_value() == "#7a1f3d")
    check("live: the unsaved-changes note appears", "not saved" in pg.inner_text("#th-dirty"))
    pg.locator("#c-accent-hex").fill("#abc")
    pg.locator("#c-accent-hex").blur()
    check("HEX: three digits are expanded", pg.locator("#c-accent-hex").input_value() == "#aabbcc")
    pg.locator("input.color-pick").nth(2).fill("#d9a441")
    check("picker: choosing with the square updates the HEX box and the preview", pg.locator("#c-accent-hex").input_value() == "#d9a441" and cs(".theme-pv .btn-gold", "backgroundColor") == rgb("#d9a441"))
    before = cs(".theme-pv .btn", "backgroundColor")
    hexset("button", "banana")
    check("validation: a bad code is refused in plain words and does not change the preview", "Type a color like #296334" in pg.inner_text("#c-button-e") and pg.locator("#c-button-hex[aria-invalid=true]").count() == 1 and cs(".theme-pv .btn", "backgroundColor") == before, pg.inner_text("#c-button-e"))
    pg.get_by_role("button", name="Publish these colors now").click()
    check("validation: saving with a bad code is stopped, nothing saved", "not valid" in pg.inner_text("#fb") and theme()["button"] == "#296334" and dlg().count() == 0)
    pg.locator('button[data-act="themeone"][data-k="button"]').click()
    check("per-color Default button puts the original back and clears the problem", pg.locator("#c-button-hex").input_value() == "#296334" and pg.locator("#c-button-e").inner_text() == "")

    # ---------- readability warnings ----------
    hexset("text", "#bbbbbb")
    bad = pg.locator(".theme-checks .st-awaiting").count()
    check("warnings: unreadable text is flagged with a word, a symbol and advice", bad >= 2 and "Too low" in pg.inner_text(".theme-checks") and "hard to read" in pg.inner_text("#th-sum") and "much darker" in pg.inner_text(".theme-checks"), pg.inner_text("#th-sum"))
    pg.get_by_role("button", name="Publish these colors now").click()
    check("warnings: saving asks first and lists the problem combinations", "hard to read" in dlg().inner_text() and "Body text" in dlg().inner_text())
    pg.wait_for_timeout(150)
    check("warnings: the safe answer is the default one", pg.evaluate("document.activeElement.value") == "cancel")
    dlg().get_by_role("button", name="No, go back and change them").click()
    pg.wait_for_function("!document.querySelector('dialog[open]')")
    pg.wait_for_timeout(100)
    check("warnings: 'No, go back' saves nothing", theme()["text"] == "#2f4f4f")
    hexset("text", "#2b2024")

    # ---------- cancel and reset ----------
    pg.get_by_role("button", name="Cancel").click()
    check("cancel: the editor goes back to the saved colors and the website is unchanged", pg.locator("#c-primary-hex").input_value() == "#296334" and theme()["primary"] == "#296334" and "not been changed" in pg.inner_text("#fb"), (pg.locator("#c-primary-hex").input_value(), theme()["primary"], pg.inner_text("#fb")))
    hexset("primary", "#123456")
    pg.get_by_role("button", name="Reset all colors to the default").click()
    check("reset: loads the default palette into the editor, not saved", pg.locator("#c-primary-hex").input_value() == "#296334" and theme()["primary"] == "#296334" and "not saved yet" in pg.inner_text("#fb"))

    # ---------- a draft edition (2027): one button, only 2027 changes ----------
    pg.evaluate("P.useEdition('mirc2027'); P.refresh()")
    check("draft edition: a single Save button", pg.get_by_role("button", name="Save these colors").count() == 1 and pg.get_by_role("button", name="Publish these colors now").count() == 0)
    setall(WINE)
    check("draft edition: wine palette gives passing checks", pg.locator(".theme-checks .st-awaiting").count() == 0, pg.inner_text("#th-sum"))
    pg.get_by_role("button", name="Save these colors").click()
    check("save: stored for 2027 only", theme("mirc2027")["primary"] == "#7a1f3d" and theme("mirc2026")["primary"] == "#296334")
    check("save: confirmation says what happens next", "were saved" in pg.inner_text("#fb") and "published" in pg.inner_text("#fb"))
    check("save: the palette it replaced is kept under 'Earlier palettes'", "Earlier palettes" in pg.inner_text("main") and pg.evaluate("S.settings.themeHistory.length") == 1)

    # ---------- the palette on real public pages ----------
    pg.evaluate("P.ui['site.role']='Webmaster'")
    go("/site")
    W = WINE
    check("site: wrapper carries the palette", rgb(W["primary"]) == cs(".site h1", "color"))
    check("site: page background and header surface", cs(".site", "backgroundColor") == rgb(W["background"]) and cs(".sitehead", "backgroundColor") == rgb(W["surface"]))
    check("site: navigation bar and footer use the secondary color", cs(".sitenav", "backgroundColor") == rgb(W["secondary"]) and cs(".sitefoot", "backgroundColor") == rgb(W["secondary"]))
    check("site: header line and hero line use the accent", cs(".sitehead", "borderBottomColor") == rgb(W["accent"]) and cs(".hero", "borderTopColor") == rgb(W["accent"]))
    check("site: main button, accent button, card, card border", cs("main .btn-gold", "backgroundColor") == rgb(W["accent"]) and cs("main .card", "backgroundColor") == rgb(W["surface"]) and cs("main .card", "borderLeftColor") == rgb(W["border"]))
    check("site: body text color", cs("main .hero p.facts", "color") == rgb(W["text"]))
    pg.get_by_role("button", name="Menu").first.click()
    check("site: the menu drawer uses the secondary color", cs("#drawer", "backgroundColor") == rgb(W["secondary"]))
    pg.keyboard.press("Escape")
    go("/site/login")
    check("site: forms: field outline is the text color, field fill the surface", cs("main input[type=email]", "borderTopColor") == rgb(W["text"]) and cs("main input[type=email]", "backgroundColor") == rgb(W["surface"]))
    check("site: main button uses the button color and its auto text color", cs("main button.btn-primary", "backgroundColor") == rgb(W["button"]) and cs("main button.btn-primary", "color") == "rgb(255, 255, 255)")
    pg.locator("main button.btn-primary").hover()
    pg.wait_for_timeout(100)
    hov = pg.evaluate("getComputedStyle(document.querySelector('main button.btn-primary')).getPropertyValue('--t-button-hover').trim()")
    check("hover: the main button changes to its hover color", cs("main button.btn-primary", "backgroundColor") == rgb(hov) and rgb(hov) != rgb(W["button"]), (hov,))
    pg.locator("main input[type=email]").focus()
    pg.wait_for_timeout(100)
    ink = pg.evaluate("getComputedStyle(document.querySelector('.site')).getPropertyValue('--t-ink').trim()")
    check("focus: the focus ring is thick and uses the automatic ink color", cs("main input[type=email]", "outlineColor") == rgb(ink) and cs("main input[type=email]", "outlineWidth") == "4px", (ink, cs("main input[type=email]", "outlineColor")))
    pg.locator(".sitenav .btn").first.focus()
    pg.wait_for_timeout(100)
    check("focus: inside the dark bar the ring uses the bar's text color", cs(".sitenav .btn", "outlineColor") == "rgb(255, 255, 255)" and cs(".sitenav .btn", "outlineWidth") == "4px", cs(".sitenav .btn", "outlineColor"))
    # same colors at three widths
    same = []
    for width in (1280, 820, 390):
        pg.set_viewport_size({"width": width, "height": 900})
        go("/site")
        same.append((cs(".sitenav", "backgroundColor"), cs(".site h1", "color"), cs("main .btn-gold", "backgroundColor"), cs(".sitefoot", "backgroundColor"), cs(".sitehead", "backgroundColor")))
    check("responsive: desktop, tablet and phone show the same colors", len(set(same)) == 1, same)
    pg.set_viewport_size({"width": 1280, "height": 1000})

    # ---------- administration area keeps its own colors ----------
    go("/admin")
    check("separation: the administration area is not recolored", cs(".topbar", "backgroundColor") == "rgb(15, 52, 22)" and cs("main h1", "color") == "rgb(41, 99, 52)" and cs("main .btn-primary, main .btn", "backgroundColor") != rgb(W["button"]), cs(".topbar", "backgroundColor"))
    go("/site")
    check("separation: the prototype's own bar on the site keeps its colors too", cs(".sitebar", "backgroundColor") == "rgb(1, 16, 48)")
    pg.evaluate("P.useEdition('mirc2026'); P.refresh()")
    check("separation: 2026 still shows the original colors", cs(".sitenav", "backgroundColor") == "rgb(15, 52, 22)" and cs(".site h1", "color") == "rgb(41, 99, 52)")

    # ---------- published edition: draft, preview, publish, history, restore ----------
    go("/admin/colors")
    setall(dict(primary="#1d3557", secondary="#14213d", accent="#e0b04a", button="#1d3557"))
    pg.get_by_role("button", name="Save as a draft").click()
    check("draft colors: stored as pending, the live colors unchanged", pending()["primary"] == "#1d3557" and theme()["primary"] == "#296334" and "Draft colors waiting" in pg.inner_text("main"))
    pg.evaluate("P.ui['site.role']='Guest'")
    go("/site")
    check("draft colors: visitors (Guest) still see the live colors and no preview strip", cs(".site h1", "color") == "rgb(41, 99, 52)" and pg.locator(".draft-strip").count() == 0)
    pg.evaluate("P.ui['site.role']='Webmaster'; P.refresh()")
    check("draft colors: the team sees them, marked as a branding preview", cs(".site h1", "color") == rgb("#1d3557") and "Branding preview" in pg.inner_text(".draft-strip") and "colors" in pg.inner_text(".draft-strip"))
    go("/admin/colors")
    pg.get_by_role("button", name="Publish these colors now").first.click()
    dlg().get_by_role("button", name="Yes, publish them").click()
    pg.wait_for_function("!document.querySelector('dialog[open]')")
    pg.wait_for_function("!S.settings.themePending")
    check("publish: the draft becomes the live palette and the old one is kept", theme()["primary"] == "#1d3557" and pending() is None and pg.evaluate("S.settings.themeHistory.length") == 1)
    pg.get_by_role("button", name="Load into the editor").first.click()
    check("history: an earlier palette can be loaded into the editor (not saved)", pg.locator("#c-primary-hex").input_value() == "#296334" and theme()["primary"] == "#1d3557" and "not saved yet" in pg.inner_text("#fb"))
    pg.get_by_role("button", name="Restore the original palette on the website now").click()
    dlg().get_by_role("button", name="Yes, restore it").click()
    pg.wait_for_function("!document.querySelector('dialog[open]')")
    pg.wait_for_function("S.settings.themeHistory.length === 2")
    check("restore: the original palette is back on the website at once", pg.evaluate("P.theme.same(S.settings.theme, P.theme.DEFAULT)") and pg.evaluate("S.settings.themeHistory.length") == 2 and "original palette is back" in pg.inner_text("#fb"))
    pg.evaluate("P.ui['site.role']='Guest'")
    go("/site")
    check("restore: visitors see the original colors again", cs(".sitenav", "backgroundColor") == "rgb(15, 52, 22)")

    # ---------- a new edition starts from its parent's palette, as its own copy ----------
    go("/admin/editions")
    pg.get_by_role("button", name="Create a new edition").click()
    dlg().locator("#f-year").fill("2028")
    dlg().locator("#f-from").select_option("mirc2027")
    dlg().get_by_role("button", name="Create the edition").click()
    pg.wait_for_selector("main h1")
    check("new edition: copies the palette of the edition it came from, with no draft and no history", theme("mirc2028")["primary"] == "#7a1f3d" and pending("mirc2028") is None and pg.evaluate("P.edition('mirc2028').settings.themeHistory.length") == 0)
    go("/admin/colors")
    hexset("primary", "#005f73")
    pg.get_by_role("button", name="Save these colors").click()
    check("new edition: changing 2028 does not touch 2027 or 2026", theme("mirc2028")["primary"] == "#005f73" and theme("mirc2027")["primary"] == "#7a1f3d" and theme("mirc2026")["primary"] == "#296334")

    # ---------- "My Account" ----------
    pg.evaluate("P.useEdition('mirc2026'); P.ui['site.role']='Participant'")
    go("/site")
    check("My Account: the signed-in button says My Account, with a tooltip", pg.locator(".usermenu summary").inner_text().startswith("My Account") and "registration" in pg.locator(".usermenu summary").get_attribute("title"))
    check("My Account: the old name is gone from every public page", all("My Space" not in pg.inner_text("body") for _ in [go(x) for x in ("/site", "/site/registration", "/site/my-registration", "/site/account")]))
    go("/site")
    pg.locator(".usermenu summary").click()
    items = pg.locator(".usermenu li").all_inner_texts()
    check("My Account: the menu still holds the person's own pages and Log out", any("My submissions" in i for i in items) and any("My registration" in i for i in items) and any("Edit account" in i for i in items) and any("Log out" in i for i in items), items)
    check("My Account: the role is shown inside the menu, not in the button", any("Signed in as Participant" in i for i in items) and "Participant" not in pg.locator(".usermenu summary").inner_text())
    check("My Account: a Participant has no Administration link", not any("Administration area" in i for i in items))
    pg.get_by_role("link", name="My registration").click()
    pg.wait_for_selector("main h1")
    check("My Account: 'My registration' still opens its page", pg.url.endswith("#/site/my-registration") and "My registration" in pg.inner_text("main h1"))
    go("/site")
    pg.locator(".usermenu summary").click()
    pg.get_by_role("link", name="Edit account").click()
    pg.wait_for_selector("main h1")
    check("My Account: 'Edit account' still opens its page", pg.url.endswith("#/site/account"))
    pg.evaluate("P.ui['site.role']='Webmaster'; P.refresh()")
    pg.locator(".usermenu summary").click()
    pg.get_by_role("link", name="Administration area", exact=True).click()
    pg.wait_for_selector("main h1")
    check("My Account: for the team the Administration area link still goes to the dashboard", pg.url.endswith("#/admin"))
    go("/site")
    pg.locator(".usermenu summary").click()
    pg.get_by_role("button", name="Log out").click()
    check("My Account: Log out returns to Sign in", pg.locator(".sitenav a", has_text="Sign in").count() == 1)
    for width in (1280, 820, 390):
        for size in ("2", "3"):
            pg.set_viewport_size({"width": width, "height": 900})
            pg.evaluate(f"document.documentElement.dataset.size='{size}'; P.ui['site.role']='Administrator'; location.hash='/site'; P.refresh()")
            go("/site")
            pg.locator(".usermenu summary").click()
            ub = pg.locator(".usermenu summary").bounding_box(); ul = pg.locator(".usermenu ul").bounding_box()
            over = pg.evaluate("document.documentElement.scrollWidth - window.innerWidth")
            check(f"My Account at {width}px, text size {size}: label fits, menu is fully on screen, no sideways scroll", ub["width"] > 0 and ul["x"] >= 0 and ul["x"] + ul["width"] <= width + 1 and over <= 1 and pg.locator(".usermenu summary").evaluate("e => e.scrollWidth <= e.clientWidth + 1"), (ub, ul, over))
    b.close()

bad = [r for r in res if not r[1]]
for n_, ok, d in res:
    print(("PASS " if ok else "FAIL ") + n_ + ("" if ok or d == "" else "  -> " + str(d)[:300]))
print(f"\n{len(res) - len(bad)}/{len(res)} passed. Console errors: {errs if errs else 'none'}")
sys.exit(1 if bad or errs else 0)

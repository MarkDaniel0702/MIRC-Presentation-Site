"""Checks logo management: the specification is shown first, every validation message (real file type, extension mismatch, size, pixels, shape,
SVG safety, damaged file), preview and fit/zoom, cancel keeps the current logo, save and publish (draft first), one logo per edition,
the logo in the header / menu bar / home page, and layout at desktop and phone width.
Pictures are drawn in the browser itself, so no extra libraries are needed.
Needs: python -m pip install playwright && python -m playwright install chromium
Run:   python tests/logo.py   (exit code 1 = a check failed)
"""
import base64, pathlib, re, sys
from playwright.sync_api import sync_playwright

base = (pathlib.Path(__file__).resolve().parent.parent / "index.html").as_uri()
sys.stdout.reconfigure(errors="replace")
res, errs = [], []


def check(name, cond, detail=""):
    res.append((name, bool(cond), detail))


with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_context(viewport={"width": 1280, "height": 1000}).new_page()
    pg.on("console", lambda m: errs.append(m.text) if m.type in ("error", "warning") else None)
    pg.on("pageerror", lambda e: errs.append("pageerror: " + str(e)))
    pg.goto(base + "#/admin/logo")
    pg.wait_for_selector("main h1")

    def go(path):
        pg.evaluate(f"location.hash='{path}'")
        pg.wait_for_selector("main h1, h1")
        pg.wait_for_timeout(80)

    def img(w, h, kind="png"):
        """a real picture of the given size, drawn in the page"""
        mime = {"png": "image/png", "jpeg": "image/jpeg", "webp": "image/webp"}[kind]
        data = pg.evaluate("""([w,h,m]) => { const c=document.createElement('canvas'); c.width=w;c.height=h; const x=c.getContext('2d');
          x.fillStyle='#296334'; x.fillRect(0,0,w,h); x.fillStyle='#fce77a'; x.fillRect(w*.25,h*.25,w*.5,h*.5); return c.toDataURL(m).split(',')[1]; }""", [w, h, mime])
        return base64.b64decode(data)

    def pick(name, data, mime="application/octet-stream"):
        pg.locator("#logo-file").set_input_files({"name": name, "mimeType": mime, "buffer": data})
        pg.wait_for_timeout(250)

    err_text = lambda: pg.inner_text("#logo-err") if pg.locator("#logo-err").count() else ""
    live = lambda ed="mirc2026": pg.evaluate(f"P.edition('{ed}').settings.logo")
    pending = lambda ed="mirc2026": pg.evaluate(f"P.edition('{ed}').settings.logoPending")
    dlg = lambda: pg.locator("dialog[open]")

    # ---------- the specification comes first ----------
    txt = pg.inner_text("main")
    check("spec: formats, shape, pixels and file size are shown before any file is chosen",
          all(x in txt for x in ("PNG or SVG", "1:1", "600 × 600", "240 pixels", "2 MB")) and pg.locator("#logo-file").count() == 1)
    order = pg.evaluate("[...document.querySelectorAll('main h2, main label')].map(e => e.textContent.trim().slice(0,22))")
    check("spec: the requirements are above the file chooser", txt.index("Requirements") < txt.index("Logo file"))
    check("current logo: 2026 shows its (sample) logo with a text alternative", pg.locator("#lg-cur ~ .logo-row img, .logo-row .logo-frame img").first.get_attribute("alt") != "" and "sample" in pg.inner_text("#lg-cur ~ .logo-row, .logo-row"))

    # ---------- every refusal says what is wrong ----------
    cur = live()["url"]
    pick("notes.png", b"This is just text, not a picture.", "image/png")
    check("refuse: text renamed to .png (checked by contents, not by name)", "not a picture this site can use" in err_text(), err_text())
    pick("logo.png", img(400, 400, "jpeg"), "image/png")
    check("refuse: a JPEG named .png (name and contents disagree)", "contents are a JPEG" in err_text(), err_text())
    pick("anim.gif", b"GIF89a\x01\x00\x01\x00\x00\x00\x00;", "image/gif")
    check("refuse: GIF", "GIF pictures are not accepted" in err_text(), err_text())
    pick("evil.svg", b'<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><script>alert(1)</script></svg>', "image/svg+xml")
    check("refuse: SVG with a script", "active content" in err_text(), err_text())
    pick("evil2.svg", b'<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" onload="alert(1)"><rect width="9" height="9"/></svg>', "image/svg+xml")
    check("refuse: SVG with an event handler", "active content" in err_text())
    pick("nosize.svg", b'<svg xmlns="http://www.w3.org/2000/svg"><rect width="9" height="9"/></svg>', "image/svg+xml")
    check("refuse: SVG without a size", "no width and height or viewBox" in err_text(), err_text())
    pick("big.png", b"\x89PNG\r\n\x1a\n" + b"0" * (3 * 1048576), "image/png")
    check("refuse: over 2 MB, says the size and the limit", "3 MB" in err_text() and "2 MB" in err_text(), err_text())
    pick("empty.png", b"", "image/png")
    check("refuse: empty file", "empty" in err_text(), err_text())
    pick("small.png", img(100, 100), "image/png")
    check("refuse: too few pixels, says the pixels and the recommendation", "100 × 100" in err_text() and "240" in err_text() and "600" in err_text(), err_text())
    pick("strip.png", img(1200, 200), "image/png")
    check("refuse: shape beyond 4:1", "very wide" in err_text(), err_text())
    pick("broken.png", b"\x89PNG\r\n\x1a\n" + b"\x00" * 200, "image/png")
    check("refuse: damaged picture", "could not be opened" in err_text(), err_text())
    check("refuse: nothing was staged and the current logo is unchanged", pg.locator("#lg-prev").count() == 0 and live()["url"] == cur)
    check("refuse: the error is announced and the file box is marked invalid", pg.locator("#logo-err[role=alert]").count() == 1 and pg.locator("#logo-file[aria-invalid=true]").count() == 1)

    # ---------- a good square picture: preview, cancel ----------
    pick("square.png", img(600, 600), "image/png")
    check("accept: a 600 x 600 PNG gives a preview with no warnings", pg.locator("#lg-prev").count() == 1 and pg.locator("#lg-prev ~ * .logo-note, #lg-prev + p + .logo-note").count() == 0 and "not saved yet" in pg.inner_text("#lg-prev + p"))
    check("accept: focus moves to the preview heading", pg.evaluate("document.activeElement.id") == "lg-prev")
    check("preview: shows the unsaved logo in the real header, a phone header and the menu bar", pg.locator(".logo-live .mock .logo-frame").count() >= 2 and pg.locator(".logo-live .mock-phone .logo-frame").count() == 1)
    pg.get_by_role("button", name="Cancel").click()
    check("cancel: nothing staged, current logo not replaced, message says so", pg.locator("#lg-prev").count() == 0 and live()["url"] == cur and "has not been changed" in pg.inner_text("#fb"))
    go("/admin/editions")
    go("/admin/logo")
    check("leaving the page drops an unsaved choice", pg.locator("#lg-prev").count() == 0)

    # ---------- other shapes are kept in proportion; crop and zoom ----------
    pick("wide.png", img(1200, 400), "image/png")
    check("shape: a 3:1 logo is accepted with a plain explanation", "3.0:1" in pg.inner_text("#lg-prev ~ .logo-note, .logo-note") and "never stretched" in pg.inner_text("main"))
    box = pg.locator(".logo-pos .logo-frame").bounding_box()
    im = pg.locator(".logo-pos .logo-frame img").bounding_box()
    check("shape: the frame stays square and the picture is not stretched", abs(box["width"] - box["height"]) < 1 and pg.evaluate("getComputedStyle(document.querySelector('.logo-pos img')).objectFit") == "contain", (box, im))
    pg.locator("#lg-zoom").fill("200")
    check("zoom: the slider zooms the preview", "scale(2)" in pg.locator(".logo-pos img").get_attribute("style") and pg.inner_text("#lg-zoom-o") == "200%")
    check("zoom: a large picture zoomed in moderately gives no blur warning", "blurry" not in pg.inner_text(".logo-live") and "soft" not in pg.inner_text(".logo-live"))
    pg.get_by_label("Fill the frame").check()
    pg.locator("#lg-zoom").fill("300")
    check("zoom: a zoom that stretches a picture past its real size is warned about", "blurry" in pg.inner_text(".logo-live") or "soft" in pg.inner_text(".logo-live"), pg.inner_text(".logo-live")[-120:])
    pg.get_by_label("Whole logo").check()
    pg.locator("#lg-x").fill("0")
    check("position: left-right slider moves the focus point", "0% 50%" in pg.locator(".logo-pos img").get_attribute("style"))
    pg.get_by_label("Fill the frame").check()
    check("crop: 'Fill the frame' crops instead of leaving space", pg.evaluate("getComputedStyle(document.querySelector('.logo-pos img')).objectFit") == "cover")
    pg.get_by_role("button", name="Reset fit and position").click()
    check("reset: back to whole logo, 100%", pg.evaluate("document.querySelector('.logo-pos img').style.transform") == "scale(1)")

    # ---------- alt text, then save in a draft edition (2027): one logo only for that edition ----------
    pg.get_by_role("button", name="Cancel").click()
    pg.evaluate("P.useEdition('mirc2027'); P.refresh()")
    check("2027: has no logo yet and says so", live("mirc2027") is None and "has no logo yet" in pg.inner_text("main"))
    check("2027: the dashboard and readiness list mention the missing logo", "No logo" in pg.evaluate("(P.readiness(P.edition()).note).join(' ')"))
    pick("logo2027.png", img(600, 600), "image/png")
    pg.locator("#f-alt").fill("")
    pg.get_by_role("button", name="Save this logo").click()
    check("alt text: required, in plain words", "describe the logo" in pg.inner_text("#f-alt-e") and pg.locator("#f-alt[aria-invalid=true]").count() == 1 and live("mirc2027") is None)
    check("draft edition: only one save button (nothing to publish separately)", pg.get_by_role("button", name="Save this logo").count() == 1 and pg.get_by_role("button", name="Publish this logo now").count() == 0)
    pg.locator("#f-alt").fill("MIRC 2027 logo")
    pg.get_by_role("button", name="Save this logo").click()
    l27 = live("mirc2027")
    check("save: the logo is stored for 2027 only", l27 and l27["name"] == "logo2027.png" and l27["alt"] == "MIRC 2027 logo" and live()["name"] == "mirc-2026-logo-sample.svg", (l27 or {}).get("name"))
    check("save: confirmation says what happens next", "was saved" in pg.inner_text("#fb") and "published" in pg.inner_text("#fb"))
    check("save: the file is listed under Files and pictures of 2027 only", pg.evaluate("S.files.some(f => f.title=='logo2027.png' && f.folder=='header')") and not pg.evaluate("P.edition('mirc2026').files.some(f => f.title=='logo2027.png')"))
    # public header for the team (draft edition): the logo is there, in the standard frame
    pg.evaluate("P.ui['site.role']='Webmaster'")
    go("/site")
    f = pg.locator(".sitehead .logo-frame")
    fb = f.bounding_box()
    check("header: the 2027 logo shows in the header, inside the square frame", f.count() == 1 and f.locator("img").get_attribute("alt") == "MIRC 2027 logo" and abs(fb["width"] - fb["height"]) < 1 and abs(fb["width"] - 120) < 2, fb)
    check("home page: the logo also shows on the home page (decorative copy, no repeated alt text)", pg.locator(".hero .logo-frame img").get_attribute("alt") == "")
    # 2026 unaffected
    pg.evaluate("P.useEdition('mirc2026'); P.ui['site.role']='Guest'; P.refresh()")
    go("/site")
    check("separation: 2026 still shows its own logo", "2026" in pg.locator(".sitehead .logo-frame img").get_attribute("alt") and pg.locator(".sitehead .logo-frame img").get_attribute("src").startswith("data:image/svg"))

    # ---------- published edition: draft logo first, then publish ----------
    go("/admin/logo")
    pick("new2026.png", img(800, 800), "image/png")
    check("published edition: offers Publish now or Save as a draft", pg.get_by_role("button", name="Publish this logo now").count() == 1 and pg.get_by_role("button", name="Save as a draft").count() == 1)
    pg.get_by_role("button", name="Save as a draft").click()
    check("draft logo: saved as pending, the live logo is unchanged", pending()["name"] == "new2026.png" and live()["name"] == "mirc-2026-logo-sample.svg" and "Draft logo waiting" in pg.inner_text("main"))
    pg.evaluate("P.ui['site.role']='Guest'")
    go("/site")
    check("draft logo: visitors (Guest) still see the live logo and no preview strip", "sample" in pg.locator(".sitehead img").get_attribute("alt") and pg.locator(".draft-strip").count() == 0)
    pg.evaluate("P.ui['site.role']='Webmaster'; P.refresh()")
    check("draft logo: the team sees the draft logo, marked as a preview", "Branding preview" in pg.inner_text(".draft-strip") and pg.locator(".sitehead img").get_attribute("src").startswith("blob:"))
    go("/admin/logo")
    pg.get_by_role("button", name="Publish this logo now").click()
    dlg().get_by_role("button", name="Yes, publish it").click()
    pg.wait_for_function("!document.querySelector('dialog[open]')")
    pg.wait_for_function("!S.settings.logoPending")
    check("publish: the pending logo becomes the live logo; the old file entry is gone", live()["name"] == "new2026.png" and pending() is None and not pg.evaluate("S.files.some(f => f.title=='mirc-2026-logo-sample.svg')"))
    # discard
    pick("tmp.png", img(500, 500), "image/png")
    pg.get_by_role("button", name="Save as a draft").click()
    pg.get_by_role("button", name="Discard this draft logo").click()
    check("discard: the draft goes, the live logo stays", pending() is None and live()["name"] == "new2026.png")
    # replace keeps proportions, remove asks first
    pg.get_by_role("button", name="Remove the logo").click()
    pg.keyboard.press("Escape")
    check("remove: Esc cancels", live() is not None)
    pg.get_by_role("button", name="Remove the logo").click()
    dlg().get_by_role("button", name="Yes, remove it").click()
    pg.wait_for_function("!document.querySelector('dialog[open]')")
    pg.wait_for_function("S.settings.logo === null")
    check("remove: the logo is gone from this edition only", live() is None and live("mirc2027") is not None, (live(), live("mirc2027") and live("mirc2027")["name"], pg.evaluate("ED.cur")))

    # ---------- placement ----------
    pg.evaluate("P.useEdition('mirc2027'); P.ui['site.role']='Guest'; P.edition('mirc2027').conf.status='published'; P.refresh()")
    go("/admin/logo")
    pg.get_by_label("In the menu bar").check()
    pg.get_by_role("button", name="Save", exact=True).click()
    go("/site")
    check("placement: 'in the menu bar' moves the logo from the header to the menu bar", pg.locator(".sitehead .logo-frame").count() == 0 and pg.locator(".sitenav > .nav-left .logo-frame.sm").count() == 1)
    pg.get_by_role("button", name="Menu").first.click()
    check("placement: the menu drawer shows the small logo", pg.locator("#drawer .logo-frame").count() == 1)
    pg.keyboard.press("Escape")
    go("/admin/logo")
    pg.get_by_label("Nowhere").check()
    pg.get_by_role("button", name="Save", exact=True).click()
    go("/site")
    check("placement: 'nowhere' hides the logo everywhere", pg.locator(".logo-frame").count() == 0)
    go("/admin/logo")
    pg.get_by_label("In the header").check()
    pg.get_by_role("button", name="Save", exact=True).click()

    # ---------- a new edition starts without a logo ----------
    go("/admin/editions")
    pg.get_by_role("button", name="Create a new edition").click()
    dlg().locator("#f-year").fill("2029")
    dlg().locator("#f-from").select_option("mirc2027")
    dlg().get_by_role("button", name="Create the edition").click()
    pg.wait_for_selector("main h1")
    check("new edition: copies the set-up but not the logo, and not the logo file", pg.evaluate("S.conf.year") == 2029 and live("mirc2029") is None and not pg.evaluate("S.files.some(f => f.logo)"))
    check("new edition: 2027 kept its logo", live("mirc2027") is not None)

    # ---------- sizes at desktop and phone width, long title, extreme shapes ----------
    pg.evaluate("P.useEdition('mirc2027'); P.ui['site.role']='Webmaster'")
    go("/admin/logo")
    pick("tall.png", img(300, 900), "image/png")
    pg.get_by_role("button", name="Save this logo").click() if pg.get_by_role("button", name="Save this logo").count() else pg.get_by_role("button", name="Publish this logo now").click()
    pg.evaluate("P.edition('mirc2027').settings.header.title = 'A very long conference title that goes on and on to test that nothing runs over the edge of the screen at all'")
    for width, size in ((1280, "2"), (1280, "3"), (820, "2"), (390, "2"), (390, "3")):
        pg.set_viewport_size({"width": width, "height": 900})
        pg.evaluate(f"document.documentElement.dataset.size='{size}'")
        go("/site")
        over = pg.evaluate("document.documentElement.scrollWidth - window.innerWidth")
        fr = pg.locator(".sitehead .logo-frame").bounding_box()
        pic = pg.locator(".sitehead .logo-frame img").bounding_box()
        title = pg.locator(".sitehead .site-name").bounding_box()
        inside = pic["x"] >= fr["x"] - 1 and pic["x"] + pic["width"] <= fr["x"] + fr["width"] + 1
        gap_ok = title["x"] >= fr["x"] + fr["width"] + 8 or title["y"] >= fr["y"] + fr["height"] + 4
        check(f"layout {width}px, text size {size}: no sideways scroll, square frame, picture inside it, title not touching the logo",
              over <= 1 and abs(fr["width"] - fr["height"]) < 1 and inside and gap_ok and fr["width"] <= 150, (over, fr, pic, title))
    pg.set_viewport_size({"width": 1280, "height": 900})
    pg.evaluate("document.documentElement.dataset.size='2'")

    # ---------- the picture formats that must work ----------
    go("/admin/logo")
    for name, data, mime in (("a.webp", img(400, 400, "webp"), "image/webp"), ("a.jpeg", img(400, 400, "jpeg"), "image/jpeg"),
                             ("a.svg", b'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="#296334"/></svg>', "image/svg+xml")):
        pick(name, data, mime)
        check(f"accept: {name}", pg.locator("#lg-prev").count() == 1 and not err_text(), err_text())
        if name.endswith("jpeg"):
            check("accept: JPEG warns that it has no transparency", "transparent" in pg.inner_text("main"))
        pg.get_by_role("button", name="Cancel").click()
    b.close()

bad = [r for r in res if not r[1]]
for n_, ok, d in res:
    print(("PASS " if ok else "FAIL ") + n_ + ("" if ok or d == "" else "  -> " + str(d)[:300]))
print(f"\n{len(res) - len(bad)}/{len(res)} passed. Console errors: {errs if errs else 'none'}")
sys.exit(1 if bad or errs else 0)

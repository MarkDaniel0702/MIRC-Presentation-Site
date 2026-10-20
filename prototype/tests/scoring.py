"""Checks the abstract scoring sheet (Papers received > Open > Score this abstract): the six criteria with description, weight and 1-5 rating,
the weighted score worked out as ratings are entered, the recommended decision at every band edge, the "pending editorial approval" note, reset, and the links to the page.
Needs: python -m pip install playwright && python -m playwright install chromium
Run:   python tests/scoring.py   (exit code 1 = a check failed)
"""
import itertools, pathlib, sys
from playwright.sync_api import sync_playwright

base = (pathlib.Path(__file__).resolve().parent.parent / "index.html").as_uri()
res, errs = [], []
W = [25, 15, 15, 10, 10, 25]
NAMES = ["Relevance to Journal Scope", "Originality and Contribution", "Clarity and Readability", "Compliance with Abstract Guidelines", "Ethical Integrity", "Minimum Scholarly Merit"]
score_of = lambda r: sum(x * w / 5 for x, w in zip(r, W))                       # the formula from the brief, written out here independently of the page
band_of = lambda s: "Recommended for full manuscript review" if s >= 75 else "Borderline: revise or conduct further screening" if s >= 60 else "Not recommended for full manuscript review"
PENDING = "These thresholds are proposed editorial guidelines, not established PANTAS policies. The editorial team should approve them before implementation."


def check(name, cond, detail=""):
    res.append((name, bool(cond), detail))


with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_context(viewport={"width": 1280, "height": 1000}).new_page()
    pg.on("console", lambda m: errs.append(m.text) if m.type in ("error", "warning") else None)
    pg.on("pageerror", lambda e: errs.append("pageerror: " + str(e)))

    def go(path):
        pg.evaluate(f"location.hash='{path}'"); pg.wait_for_selector("main h1"); pg.wait_for_timeout(80)

    def rate(paper, ratings):
        for i, r in enumerate(ratings):
            if r: pg.locator(f'input[name="sc.{paper}.{i}"][value="{r}"]').check()

    def clear_all(paper):
        pg.get_by_role("button", name="Clear all ratings").click(); pg.wait_for_timeout(80)

    shown = lambda: pg.locator(".score-num").inner_text()
    card = lambda: pg.locator(".scorebar").inner_text()

    pg.goto(base + "#/admin/papers/700001"); pg.wait_for_selector("main h1")
    check("paper page: a 'Score this abstract' button leads to the scoring page", pg.get_by_role("link", name="Score this abstract").count() == 1)
    pg.get_by_role("link", name="Score this abstract").click(); pg.wait_for_selector("main h1"); pg.wait_for_timeout(80)
    check("score page: the title names the abstract and the breadcrumb leads back to Papers received", pg.locator("h1").inner_text().startswith("Score the abstract:") and pg.locator(".crumbs a", has_text="Papers received").count() == 1)
    check("score page: the abstract is shown so it can be read while scoring", pg.locator("#sa ~ *, #sa").first.count() == 1 and pg.locator("section[aria-labelledby=sa] p").count() >= 2)

    fs = pg.locator("fieldset.field")
    check("criteria: six, in the given order, each with its weight in the label", fs.count() == 6 and all(NAMES[i] in fs.nth(i).locator("legend").inner_text() and f"weight {W[i]}%" in fs.nth(i).locator("legend").inner_text() for i in range(6)))
    check("criteria: each has its description and a rating of 1 to 5 as five radio buttons",
          all(len(fs.nth(i).locator(".hint").first.inner_text()) > 60 and fs.nth(i).locator("input[type=radio]").count() == 5
              and fs.nth(i).locator("input[type=radio]").evaluate_all("els => els.map(e => e.value).join()") == "1,2,3,4,5" for i in range(6)))
    check("criteria: the weights add up to 100", pg.evaluate("C.CRITERIA.reduce((s, c) => s + c.weight, 0)") == 100)
    check("start: nothing rated, score 0.0, no decision yet", shown() == "0.0" and "0 of 6 criteria rated" in card() and "Rate every criterion" in card() and "Recommended decision" not in card())
    check("note: the thresholds are shown as pending editorial approval", PENDING in pg.locator("main").inner_text())

    # ---- live calculation: partial ratings ----
    rate("700001", [5, 3])
    check("partial: the score follows each click (25 + 9 = 34) and no decision is shown yet", shown() == "34.0" and "2 of 6 criteria rated" in card() and "Recommended decision" not in card(), card())
    check("partial: points per criterion are shown", "Points: 25 of 25" in fs.nth(0).inner_text() and "Points: 9 of 15" in fs.nth(1).inner_text())
    check("focus: the radio you clicked keeps keyboard focus after the page works out the score", pg.evaluate("document.activeElement.name + ':' + document.activeElement.value") == "sc.700001.1:3")
    rate("700001", [0, 4])                                                      # change one rating: the old one is replaced
    check("change: choosing another rating replaces the first one (25 + 12 = 37)", shown() == "37.0" and fs.nth(1).locator("input:checked").evaluate("e => e.value") == "4")

    # ---- every band, including the exact edges ----
    combos = {}
    for r in itertools.product(range(1, 6), repeat=6):
        combos.setdefault(score_of(r), r)
    wanted = [("lowest possible", min(combos)), ("exactly 60, the borderline edge", 60), ("just under 60", 59), ("just under 75", 74), ("exactly 75", 75), ("highest possible", 100)]
    for label, s in wanted:
        r = combos[s]
        clear_all("700001"); rate("700001", list(r))
        check(f"score {s} ({label}) {r}: shows {s:.1f} and '{band_of(s)}'", shown() == f"{s:.1f}" and band_of(s) in card() and "6 of 6 criteria rated" in card(), card())
    check("decision: says it is proposed and awaiting editorial approval", "proposed, awaiting editorial approval" in card())
    check("guide: three bands with the given score ranges, the current one marked", pg.locator("table tbody tr").count() == 3
          and [pg.locator("table tbody tr").nth(i).locator("td").first.inner_text().split(" ")[0] for i in range(3)] == ["75-100", "60-74.9", "Below"]
          and "(this abstract)" in pg.locator("table tbody tr").nth(0).inner_text() and pg.locator("table tbody tr", has_text="(this abstract)").count() == 1)

    # ---- reset, per-paper state, keeping ratings while away ----
    clear_all("700001")
    check("clear: 'Clear all ratings' empties every choice and the score", shown() == "0.0" and pg.locator("fieldset input:checked").count() == 0)
    rate("700001", [5, 5, 5, 5, 5, 5])
    go("/admin/papers/700001"); go("/admin/papers/700001/score")
    check("away and back: the ratings are still there (kept in this tab)", shown() == "100.0")
    go("/admin/papers/700002/score")
    check("another paper starts empty, ratings are not shared between papers", shown() == "0.0" and pg.locator("fieldset input:checked").count() == 0)
    go("/admin/papers/nope/score")
    check("unknown paper: a plain message and a way back, no error", "does not exist" in pg.locator("main").inner_text() and pg.get_by_role("link", name="Back to papers received").count() == 1)

    # ---- other ways in ----
    go("/admin/review-papers")
    check("'Who reviews which paper': every row has a Score link to its scoring page", pg.locator("main table tbody tr").count() >= 10 and pg.locator("main table tbody tr a", has_text="Score").count() == pg.locator("main table tbody tr").count())
    go("/admin/review-inbox")
    check("'Papers waiting for review': says the sheet can be tried from a paper", "Score this abstract" in pg.locator("main").inner_text())

    # ---- keyboard only: Tab to a rating, arrow to change it ----
    go("/admin/papers/700003/score")
    pg.locator('input[name="sc.700003.0"][value="1"]').focus(); pg.keyboard.press("ArrowRight"); pg.wait_for_timeout(80)
    check("keyboard: arrow keys move through the 1 to 5 choices and rate (1 -> 2 gives 10.0)", shown() == "10.0")
    b.close()

bad = [r for r in res if not r[1]]
for n_, ok, d in res:
    print(("PASS " if ok else "FAIL ") + n_ + ("" if ok or d == "" else "  -> " + str(d)))
print(f"\n{len(res) - len(bad)}/{len(res)} passed. Console errors: {errs if errs else 'none'}")
sys.exit(1 if bad or errs else 0)

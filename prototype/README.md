# MIRC 2026 conference website: interactive prototype

A clickable prototype of the administration area and the public website described in `../MIRC2026_Website_Blueprint.md` (v2). It is built to show the planned structure and the main workflows to the people who will administer the site, most of whom are older adults.

> **This is a prototype, not the production application.** All people, papers, numbers and dates are invented **sample data**. Nothing is saved on a server, no email is sent, nobody signs in, and no file is uploaded. Changes live in the browser tab and disappear when you reload.

## 1. Open it

1. Open the folder `prototype`.
2. Double-click **`index.html`**. It opens in your browser (use a current version of Chrome, Edge, Firefox or Safari; only Chromium was tested, see section 8). No install, no server, no internet connection needed.

Optional, if you prefer a local web address: in this folder run `python -m http.server 8000`, then open <http://localhost:8000>.

These are always on screen:
- **Start over (reset the sample data)** at the very top puts everything back as it was.
- **Text size: Normal / Large / Largest** in the dark top bar. “Large” (20 px) is the default; the choice is remembered in the browser.
- **Tables: Comfortable / Compact** in the dark top bar (hidden on phones and small tablets, where tables are shown as stacked cards). “Compact” tightens table cells and uses smaller buttons so more fits on screen. “Comfortable” is the default.

### A five-minute tour
1. **Dashboard** (opens first): see what needs attention, then use the cards or the left menu.
2. **Papers received** → filter by status → **Open** a paper → **Accept** (confirm) → look at the history table.
3. **Schedule** → pick a day → **Add an event on this day** → choose “Break” → try an end time earlier than the start time to see a plain-language error.
4. **Pages and menu** → open **Settings** on “List of Participants” → under “Who can read this page” tick “Guest” and save → click **See the public website** → with “Viewing as” set to Guest, the item now appears in the menu. Untick it again and it disappears.
5. **Send an email** → choose a group, choose a ready-made message (the subject and text fill in) → send → see the record under **Sent emails**.
6. **Registered people** → **Register someone** → search “kira” → choose → register.

## 2. Files

| File | What it does |
|---|---|
| `index.html` | The page that loads everything. Also holds the always-visible “prototype / sample data” notice |
| `styles.css` | All styling. The blueprint palette is defined once at the top as CSS variables |
| `data.js` | The lists from the blueprint (topics, types, statuses, roles, page types, palette) and all **sample data** |
| `core.js` | Shared parts: page routing, safe HTML templates, forms with validation, confirmation dialogs, tables, messages |
| `admin.js` | The administration area (blueprint section 3) |
| `site.js` | The public website preview (blueprint section 2) |
| `tests/` | Four automated checks you can re-run (see section 8) |

The scripts are plain classic scripts, not modules, on purpose: browsers block modules when a page is opened straight from a folder.

**Technology.** Plain HTML, CSS and JavaScript with no build step. The blueprint recommends Next.js, Tailwind CSS and Supabase for the real site (section 12). They were **not** used here because they need a build and a server, which would make the prototype harder to open and test. The design tokens in `styles.css` use the same names as the blueprint's Tailwind tokens (section 9.9), so they carry over.

## 3. Plain-language names used in the menu

The prototype groups the blueprint's seven modules by the task an administrator is doing. Where the blueprint's own words are technical, the prototype uses plainer ones. Every page has an “About this page (for the project team)” box at the bottom naming the blueprint section.

| Menu group and page in the prototype | Blueprint module and page |
|---|---|
| **Papers and decisions** › Papers received | Editorial Management › Submissions |
| › Book of abstracts | Editorial Management › Proceedings |
| **Reviewers** › Choose reviewers | Reviewing › Reviewers |
| › Who reviews which paper | Reviewing › Papers |
| › Papers waiting for review | Reviewing › New submissions |
| › Papers already reviewed | Reviewing › Submissions reviewed |
| **Attendees** › Registered people (and Register someone) | Registration management › Participants |
| › Add a user account | Administration › Create account |
| **Program** › Schedule | Program › Administration |
| › Rooms | Program › Rooms |
| › Program display | Program › Appearance |
| **Email** › Send an email | Mailing management › Mailing |
| › Ready-made messages | Mailing management › Templates |
| › Mailing lists | Mailing management › Mailing lists |
| › Email aliases | Mailing management › Alias |
| › Email look | Mailing management › Appearance |
| › Sent emails | Mailing management › History |
| **Website** › Pages and menu | Website › Pages |
| › Home page text | Website › Homepage |
| › News | Website › News |
| › Files and pictures | Website › Uploads |
| › Site settings (3 tabs) | Website › General, Header, Appearance |
| › Visitor statistics | Website › Statistics |
| **Help** › Help and prototype guide | Section 4 roles; sections 5, 16 and 17 |

## 4. Blueprint-to-prototype coverage

Status words: **Works** = works on the sample data in the browser. **Simulated** = the screen and checks work, but the real action needs a server or service. **Interface only** = layout is shown; behavior is not built. **Pending** = the blueprint itself leaves it undecided.

### Administration area (`#/admin/...`)

| Blueprint | Prototype page | Status |
|---|---|---|
| 3.1 Module overview | `#/admin` Dashboard, left menu, breadcrumbs | Works. Counts come from the sample data |
| 3.2 Website › General | `#/admin/settings` tab “Languages and contact” | Works (saves to the sample data). Switching the site language is not built |
| 3.2 Website › Header (3 types) | `#/admin/settings` tab “Header” | Works. Changes the public preview header. The HTML type shows in a safe frame; the picture type shows a placeholder |
| 3.2 Website › Appearance | `#/admin/settings` tab “Colors” | Interface only. Shows the palette. Preset themes were not described in the blueprint, so none are built |
| 3.2 Website › Pages (13 page types, folders, rights) | `#/admin/pages` | Works. Rights change the public menu. Only “Customizable page”, “Web link” and “News” have content; the other page types show a placeholder |
| 3.2 Website › Homepage | `#/admin/homepage` | Works. Shows on the public home page |
| 3.2 Website › News | `#/admin/news` | Works. Shows on the public home page. The RSS feed is not built |
| 3.2 Website › Uploads | `#/admin/files` | Simulated. Checks the 200 MB limit and lists name and size. Nothing is uploaded |
| 3.2 Website › Statistics | `#/admin/stats` | Interface only. The button is switched off with the reason (decision D10) |
| 3.3.1 Program › Appearance | `#/admin/program-display` | Works. Hides or shows papers on the public program |
| 3.3.2 Program › Rooms | `#/admin/rooms` | Works |
| 3.3.3 Program › Administration (5 event types, talks, CSV) | `#/admin/schedule` | Works. File attachments keep only the name. Break kinds are a guessed list |
| 3.4.1 Reviewing › Reviewers | `#/admin/reviewers` | Works (assign by topic or by paper, CSV) |
| 3.4.1 Reviewing › Papers | `#/admin/review-papers` | Works |
| 3.4.1 Reviewing › New submissions | `#/admin/review-inbox` | Interface only. Shows the “review period closed” state seen on the live site |
| 3.4.1 Reviewing › Submissions reviewed | `#/admin/review-done` | Interface only. Shows the empty state |
| (reviewer's scoring form) | not built | **Pending**: review rules are undecided (decision D12) |
| 3.4.2 Editorial › Submissions (filters, bulk actions) | `#/admin/papers` | Works |
| 3.4.2 Submission detail (accept, refuse, request changes, notes, history, delete) | `#/admin/papers/<number>` | Works. No email is sent to the author. Reviewer opinions are empty (D12) |
| 3.4.3 Editorial › Proceedings (3 steps) | `#/admin/book` | Works as a preview and a CSV list. Step 2 is only partly defined in the blueprint. The PDF book is a switched-off button (needs the server part) |
| 3.5 Mailing › Mailing | `#/admin/mail` | Simulated. Groups, template fill-in, counts and checks work. Sending only records a line. The three Yes/No options are kept but marked “meaning not confirmed” |
| 3.5 Mailing › Templates | `#/admin/mail/templates` | Works (change, restore original, delete, create) |
| 3.5 Mailing › Mailing lists | `#/admin/mail/lists` | Works |
| 3.5 Mailing › Alias | `#/admin/mail/aliases` | Interface only. What an alias contains is not described in the blueprint |
| 3.5 Mailing › Appearance | `#/admin/mail/look` | Works. Preview runs in a sandboxed frame. The option lists are guesses |
| 3.5 Mailing › History | `#/admin/mail/history` | Works. Only shows records made in the prototype, each marked as simulated |
| 3.6 Registration management › Participants | `#/admin/registrations` | Works (filters, details, payment, edit, CSV). “Send confirmation” only records a line |
| 3.6 Register someone | `#/admin/registrations/new` | Works on the sample accounts |
| 3.7 Administration › Create account | `#/admin/accounts/new` | Works. The password rule (7–20 letters or numbers) is checked. The password is never kept |
| 4 Roles and permissions, 4.3 matrix | `#/admin/help` (table) and “Viewing as” on the public site | Works. The table is calculated from the rights set under Pages and menu |
| 3.8 Admin workflows | Covered by the pages above | See the tour in section 1 |

### Public website preview (`#/site/...`)

| Blueprint | Prototype page | Status |
|---|---|---|
| 2.1 Page layout (bar, header, menu, breadcrumb, footer) | All public pages | Works. “Viewing as” stands in for signing in |
| 2.2 Home | `#/site` | Works. Text blocks and news come from the admin pages. Partner and sponsor logos are a placeholder (files and permission pending) |
| 2.2 Conference Programme, Guidelines, Organizing Committee, Invited Speakers, Important Dates, Conference Themes, Venue | `#/site/p/<page>` | Works. Text comes from the Pages module. Names are placeholders. Dates are copied from the live site, including its conflicting dates |
| 2.3 Detailed program (day tabs, full list, print) | `#/site/program` | Works. Built from Schedule and Rooms. Print opens the browser's print window |
| 2.2 List of Participants (A–Z, count; not for Guests or Members) | `#/site/participants` | Works. Only people with status “Registered” are listed, names only |
| 2.5 Registration | `#/site/registration` | Works on sample data. Adds a “Pre-registered” person to the admin list. The empty form on the live site was not seen, so the fields are those of its saved recap. Fees and payment are undecided (D5) |
| 2.2 Abstract Submission | `#/site/submit` | Interface only. Shows the closed message and period. A proposed form layout is under a fold-out and sends nothing |
| 2.6 Account / My Space | `#/site/login`, `#/site/account`, `#/site/my-registration`, `#/site/my-submissions` | Interface only. Real sign-in is not built. The fields of “Edit account” were not seen on the live site |
| 2.7 User flows | The pages above | Browse, read the program, register, see the participant list, try to submit |

### Not built, on purpose

| Item | Why |
|---|---|
| Real sign-in, accounts, roles stored in a database | Needs an authentication service (blueprint 12.2) |
| Sending email, email deliverability | Needs an email service and a sender domain (12.2, 15.4) |
| File upload and download of real files | Needs storage (12.2) |
| PDF book of abstracts, certificates | Needs a server-side PDF job (blueprint 6, 12.2). Certificates are also an open decision (D8) |
| Reviewer scoring form | Review rules undecided (D12) |
| Online payment, fee tiers | Undecided (D5) |
| Full text editor (bold, links, lists) | Text boxes are plain. A real editor needs sanitizing of the HTML it makes (13.1) |
| Interface languages (French, Spanish) | The blueprint assumes English to start (A3, D7) |
| Dark mode | The blueprint recommends light only (9.8) |
| Visitor statistics, RSS feed | Need external services (D10) |
| Import from Sciencesconf | Phase 7 of the roadmap (D14) |

## 5. How the design serves older administrators

- **Large, readable text.** 20 px base (“Large”), with a 18 px and a 24 px option, and a generous line height. Everything is sized in relative units, so it scales together.
- **Plain words, task-based menu.** Groups are named after jobs (“Papers and decisions”, “Attendees”), not module names. Every page starts with one sentence saying what it is for.
- **Always a way back.** A “Dashboard” link in the breadcrumb and the menu on every admin page. The public preview always has “Back to the administration area”.
- **Big targets.** Buttons are at least 2.6 rem (about 52 px) tall; table tick boxes are about 44 px. The automated size check was run on the Papers received page only, where it found no control smaller than 44 px. “Compact” tables use smaller buttons (about 2.2 rem, 44 px at “Large”) and 17 px text.
- **A tidy Actions column.** Every table's Actions column uses one shared layout: all buttons have the same height; they have the same width inside a cell (the widest label sets it); the gap between buttons is the same everywhere; labels never wrap; and the buttons start at the same left edge in every row. Up to three buttons stack in one column; four or more use two even columns. In “Compact” the buttons sit side by side. Long labels were shortened where the page already gives context (for example “Edit title and abstract” is now “Edit” on screen, and keeps its full name for screen readers).
- **Tables fit the space they are given.** A table switches to stacked cards when its own content area is narrower than 40 rem, which also reacts to the text-size buttons. If a table is ever still too wide it scrolls sideways inside its own box, which can be reached with the keyboard, and the page itself never scrolls sideways. The Registrations and Pages tables were reorganized (date and amount now sit under the person and the status; the page kind sits under the page title) so they fit without losing any information.
- **Words, not just colors or icons.** Every status has a word and a symbol (“✔ Accepted”, “✖ Refused”). Messages start with “Done.”, “Note.” or “Problem.”.
- **Confirmation before anything is removed or changed in bulk**, with the safe answer (“No, go back”) pre-selected.
- **Clear errors.** A summary at the top of the form lists each problem as a link that jumps to the field, and each field repeats its problem in plain words.
- **Messages stay** on screen until closed; they do not vanish after a few seconds.
- **Keyboard.** Every control can be reached by Tab. A “Skip to the main content” button comes first. A thick focus ring is always visible (navy on light areas, gold on dark bars). Dialogs close with Esc and return focus to the button that opened them.
- **Calm layout.** No animation, no auto-moving content, one task per page, long forms in a single column.
- **Phones and tablets.** The menu folds behind an “Open menu” button. Tables turn into stacked cards, each value labeled.

## 6. How the palette is used

Colors come from `styles.css` variables and match blueprint section 9.3. Five are **exact** (measured on flat areas of the images); the rest are **estimates** and are labeled as such on the “Colors” tab.

| Use | Color |
|---|---|
| Body text, labels, field borders | `slate-green` `#2F4F4F` (exact) |
| Headings, links, main buttons, active menu item | `forest` `#296334` (exact) |
| “Accepted” badge, success messages | `leaf` `#297D1F` (exact) |
| Top bar, hover state | `deep-green` `#0F3416` (exact) |
| Focus ring, public bar and footer, “danger” buttons, error border, text on gold | `navy` `#011030` (exact) |
| Accent buttons, prototype notice | `gold-500` / `gold-300` (estimates), always with navy text |
| Page background, card borders | `mist` `#F8FBF7`, `tint-green` `#E8F1E6` (estimates) |

**What was adjusted, and why.**
- **No palette color needed changing for contrast.** A script measured the rendered contrast of every text element on every page at desktop size and found none below 4.5:1 (3:1 for large text).
- **Gold is never used as small text on a light background.** The blueprint's check shows gold-500 on white is only 2.20:1. Gold appears as a button fill or notice background with navy text (8.53:1) and as a border. The gold gradient is used only for the large “2026 MIRC” mark, which is decorative and hidden from screen readers; the readable name is in forest green beside it.
- **Status colors are partly undecided.** The images contain no red or blue interface colors (blueprint decision D6). So errors use a thick navy border, a “✖”, and the word “Problem”, and information uses forest green with an “i”. These are placeholders until the organizers pick error and info colors.
- **Font.** The images' font was not identified, so a standard system font stack is used.

## 7. Simulated and real, in one table

| Real (works in the browser on the sample data) | Pretend |
|---|---|
| Searching, filtering, ticking, bulk status change, delete | Anything surviving a reload |
| All the forms, with their checks and messages | Sending any email; “Send confirmation” |
| Adding, changing, removing rooms, events, talks, pages, news, templates and more | Signing in, passwords, accounts for real people |
| Page rights changing the public menu; program display switch; header settings | Uploading or opening real files |
| CSV downloads of the sample data | The PDF book, certificates |
| Print window; text size (remembered in the browser) | Payments, fees |
| Safe previews of header and email HTML in a sandboxed frame | Statistics, RSS |

## 8. Testing

### By hand
1. Open `index.html`. The Dashboard shows, with no error message.
2. Click every item in the left menu. Each page has a title and a way back to the Dashboard.
3. On **Papers received**, change a filter, tick two papers, choose “Set status to Refused”, press Apply, then answer “No, go back”. Nothing should change.
4. Press **Esc** on an open dialog. It closes and focus returns to the button you used.
5. Use only the keyboard: Tab through the top of the page and a form; the focus ring must always be visible.
6. Click **Largest** under “Text size”. The page stays usable.
7. Make the browser window narrow (about 400 px wide). There is no sideways scrolling and “Open menu” appears.
8. Click **See the public website** and change “Viewing as” between Guest and Participant.

### Automated (optional)
These need Python with Playwright: `python -m pip install playwright` then `python -m playwright install chromium`. Run from the `prototype` folder. Each exits with code 1 if something fails.

| Command | What it checks |
|---|---|
| `python tests/crawl.py` | All 37 pages, as Guest and as Participant: no console errors, no dead links, every button has an action, no repeated ids, a way back to the Dashboard |
| `python tests/workflows.py` | 82 checks of the main workflows end to end |
| `python tests/layout-contrast.py` | No sideways scrolling at 1280, 820 and 390 px wide; rendered text contrast on every page; visible focus ring; control sizes. Saves screenshots to a temporary folder and prints where |
| `python tests/actions-layout.py` | The Actions column of 10 tables at 5 screen widths (1440, 1280, 1024, 820, 390 px), both table spacings and two text sizes (200 page views): the table fits, nothing is clipped or sticks out, all buttons share one height, labels do not wrap, gaps are equal, and rows line up the same way |

**What was actually run (2026-10-09):** all four, from the file system in headless Chromium on Windows. Results at the time of writing: crawl found no problems and no console errors; workflows 82 of 82 passed; layout/contrast found no problems; Actions layout found no problems in 200 page views. The Actions layout was measured before and after the change (for example at 1280 px the Papers buttons went from 81 and 167 px wide, 52 and 74 px tall, with no gap, to equal 85 × 52 px with a 9 px gap).

**Not tested:** other browsers (Firefox, Safari, Edge), real phones and tablets, any screen reader, and use by actual older adults. These matter for this audience and should be done before the design is signed off.

## 9. What remains before this becomes the real site

The plan is in the blueprint: technology in section 12, security in 13, testing in 14, deployment in 15, phases in 16, open decisions in 17. In short:

1. **Settle the open decisions** that block the build: which edition and purpose (D1), replace or complement Sciencesconf (D2), hosting plan terms (D4), fees (D5), brand details including error and info colors and a font (D6), review rules (D12).
2. **Build the server part**: accounts and roles, a database with per-role access rules, file storage, an email service with a verified sender domain, PDF generation, and the review form.
3. **Replace the stand-ins**: a real text editor with sanitized output, real partner logos (with permission), real content, real statistics.
4. **Harden and test**: security review, load test around deadlines, backup restore test, a full accessibility audit with a screen reader and **real older users**, and a trial run of the data import.
5. **Deploy** using the environments and secrets handling in blueprint section 15.

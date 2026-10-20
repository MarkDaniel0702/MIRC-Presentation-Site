# Conference website: interactive prototype (one site for MIRC, PANTAS and any other conference, in any year)

A clickable prototype of the administration area and the public website described in `../MIRC2026_Website_Blueprint.md` (v2; the blueprint describes MIRC 2026, the prototype generalizes it). It is built to show the planned structure and the main workflows to the people who will administer the site, most of whom are older adults.

**One site, many conferences, many years.** Every conference (MIRC, PANTAS ...) is one entry in `conferences.js`. Every year of a conference is an *edition* (blueprint 7.1 `conference.edition_year`, 15.5 yearly rollover). The sample data holds **MIRC 2026 (published)**, **MIRC 2027 (draft, mostly empty)** and **PANTAS 2026 (published, empty sample)**. An administrator can create any later year of any conference from the **Conference** menu without copying the website, and anyone can **create a conference of their own on screen** (Conference › My conferences, section 14), which is saved in the browser. A developer can also add a conference as one entry in `conferences.js` (section 13). See sections 10, 13 and 14.

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
7. **Schedule** → click days on the **calendar** (the four conference days have a solid border, the other days are hatched; the number is how many events are planned) → try the arrow keys, then click a hatched day to read the plain-language reason. Add an event and pick the time with the two time boxes (hour, minutes).
8. **Conference › Editions (years)** → **Create a new edition** → choose the conference (MIRC or PANTAS), year 2028, copy from 2027 → it opens as an empty draft with that conference's name, texts and colors. Then **Edition details** → **Dates and deadlines** → click the conference days → Save → open **Schedule** and see the new calendar.
9. **Conference › Logo** → choose a picture file (try a text file renamed “.png” to see the refusal) → check the preview in the header, phone header and menu bar → zoom and move it → **Save**. On a published edition choose **Save as a draft** first: visitors keep the old logo, and “Preview on the website” (Webmaster) shows the new one.
10. **Website › Site colors** → change the primary color with the square or by typing a HEX code → watch the preview and the readability list → try a pale text color to see the warnings → **Save** (or **Save as a draft** on a published edition, then “Preview on the website”) → **Reset all colors to the default** and **Earlier palettes** bring the old colors back.
11. On the public site, set “Viewing as” to Participant and open **My Account** in the bar: it holds My submissions, My registration, Edit account and Log out.
12. **Editions (years)** → **Preview** a draft → **Publish** (the confirmation lists what is still missing) → on the public site set “Viewing as” to Guest and use the **Conference** and **Year** boxes to see only published editions. **Hide** puts it back to draft.
13. In the dark top bar choose **Conference › PANTAS**: the name, short mark, logo, colors, email subjects and every page title change to PANTAS 2026. Choose **MIRC** again: you are back on MIRC 2026. Nothing else was touched.
14. **Conference › My conferences** → **Create a new conference** → type a name (“Visayas Health Summit”), a short name (“VHS”), a year, the first and last day, a place, two brand colors → **Create**. It is now in the Conference box, with its own colors and logo on the public site. **Reload the page**: it is still there. Use **Change** or **Delete** in the same list.

## 2. Files

| File | What it does |
|---|---|
| `index.html` | The page that loads everything. Also holds the always-visible “prototype / sample data” notice |
| `styles.css` | All styling. The blueprint palette is defined once at the top as CSS variables |
| `conferences.js` | **The list of conferences** (`CONFERENCES`): for each one its short name, full name, starting place/venue/theme text and optional palette. Built-in conferences are written here (section 13); at start-up the conferences created on screen are loaded from the browser and added to the same list (section 14) |
| `data.js` | The lists from the blueprint (topics, types, statuses, roles, page types, palette) and the MIRC 2026 **sample data**, built from the MIRC entry of `conferences.js` |
| `core.js` | Shared parts: page routing, safe HTML templates, forms with validation (including calendar and 24-hour time fields), confirmation dialogs, tables, messages, and the edition switch (`ED`, `S`, `P.tag`, `P.series`, the Conference and Year boxes) |
| `calendar.js` | The calendar picker (page calendar, form date field, multi-day field), date helpers, and the hour/minute time picker |
| `conference-builder.js` | **Conference › My conferences**: the screens and checks for creating, changing and deleting conferences on screen, and saving them in the browser (section 14) |
| `editions.js` | Making a new edition from an old one (of the same or another conference), the first edition of each extra conference, publish checks, and the pages Editions, Edition details and Registration form |
| `theme.js` | Visitor-site colors: the 8-color palette, the colors worked out from it, the WCAG checks, the editor with live preview, draft/publish and earlier palettes |
| `logo.js` | Logo management: the upload specification, the file checks, the preview/crop/zoom, draft and publish steps, and the one square frame every logo is shown in |
| `admin.js` | The administration area (blueprint section 3) |
| `site.js` | The public website preview (blueprint section 2) |
| `tests/` | Eight automated checks you can re-run (see section 8) |

The scripts are plain classic scripts, not modules, on purpose: browsers block modules when a page is opened straight from a folder.

**Technology.** Plain HTML, CSS and JavaScript with no build step. The blueprint recommends Next.js, Tailwind CSS and Supabase for the real site (section 12). They were **not** used here because they need a build and a server, which would make the prototype harder to open and test. The design tokens in `styles.css` use the same names as the blueprint's Tailwind tokens (section 9.9), so they carry over.

## 3. Plain-language names used in the menu

The prototype groups the blueprint's seven modules by the task an administrator is doing. Where the blueprint's own words are technical, the prototype uses plainer ones. Every page has an “About this page (for the project team)” box at the bottom naming the blueprint section.

| Menu group and page in the prototype | Blueprint module and page |
|---|---|
| **Conference** › Editions (years) | Conference record per year (7.1), yearly rollover (15.5) |
| › Edition details | Conference title, city, dates, submission period (7.1); topics (5, 7.1 `topic`) |
| › Logo | Website › Header (`LOGO_SRC`, `LOGO_PLACE`), Uploads folder `header`; 7.1 `conference.logo_url` |
| **Papers and decisions** › Papers received | Editorial Management › Submissions |
| › Book of abstracts | Editorial Management › Proceedings |
| **Reviewers** › Choose reviewers | Reviewing › Reviewers |
| › Who reviews which paper | Reviewing › Papers |
| › Papers waiting for review | Reviewing › New submissions |
| › Papers already reviewed | Reviewing › Submissions reviewed |
| **Attendees** › Registered people (and Register someone) | Registration management › Participants |
| › Registration form | Registration form fields (2.5, 7.1) |
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
| › Site colors | Website › Appearance (the live site has preset themes; free colors are the rebuild's own addition, 9.10) |
| › Site settings (4 tabs) | Website › General, Header, Appearance (original palette, read-only), banner |
| › Visitor statistics | Website › Statistics |
| **Help** › Help and prototype guide | Section 4 roles; sections 5, 16 and 17 |

## 4. Blueprint-to-prototype coverage

Status words: **Works** = works on the sample data in the browser. **Simulated** = the screen and checks work, but the real action needs a server or service. **Interface only** = layout is shown; behavior is not built. **Pending** = the blueprint itself leaves it undecided.

### Administration area (`#/admin/...`)

| Blueprint | Prototype page | Status |
|---|---|---|
| 3.1 Module overview | `#/admin` Dashboard, left menu, breadcrumbs | Works. Counts come from the sample data |
| 3.2 Website › General | `#/admin/settings` tab “Languages and contact” | Works (saves to the sample data). Switching the site language is not built |
| 3.2 Website › Header (3 types) | `#/admin/settings` tab “Header”, and `#/admin/logo` | Header title, subtitle, date and place work as before. **The logo moved to its own page** (Conference › Logo): upload, checks, preview, crop, save/publish, place (header, menu bar, nowhere). The HTML type shows in a safe frame; the picture type shows a placeholder |
| 3.2 Website › Appearance | `#/admin/colors` (editor) and `#/admin/settings` tabs “Colors” and “Banner” | **Site colors works**, per edition: 8 colors with pickers and HEX boxes, live preview, readability checks, save / draft / publish / cancel / reset / earlier palettes (section 12). The “Colors” tab keeps the original palette as a read-only reference. Banner: a line above the header. |
| 3.2 Website › Pages (13 page types, folders, rights) | `#/admin/pages` | Works. Rights change the public menu. Only “Customizable page”, “Web link” and “News” have content; the other page types show a placeholder |
| 3.2 Website › Homepage | `#/admin/homepage` | Works. Shows on the public home page |
| 3.2 Website › News | `#/admin/news` | Works. Shows on the public home page. The RSS feed is not built |
| 3.2 Website › Uploads | `#/admin/files` | Simulated. A saved logo is also listed here (folder “header”). Checks the 200 MB limit and lists name and size. Nothing is uploaded |
| 3.2 Website › Statistics | `#/admin/stats` | Interface only. The button is switched off with the reason (decision D10) |
| 3.3.1 Program › Appearance | `#/admin/program-display` | Works. Hides or shows papers on the public program |
| 3.3.2 Program › Rooms | `#/admin/rooms` | Works |
| 3.3.3 Program › Administration (5 event types, talks, CSV) | `#/admin/schedule` | Works. **Calendar** to choose the day, hour/minute time boxes, checks (end after start, a room cannot be double-booked, a talk fits inside its session and does not overlap another). File attachments keep only the name. Break kinds are a guessed list |
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
| 7.1 conference (edition_year, title, city, dates, submission window) | `#/admin/editions`, `#/admin/edition` | Works on sample data. Create (copy set-up), switch, preview, publish, hide, delete drafts. Dates by calendar with checks. Draft/published is simulated: it only changes what “Viewing as” sees |
| 15.5 Yearly edition rollover | Create a new edition | Works: copies pages, rooms, topics, email templates and settings; never papers, people, schedule or news; resets dates. “Archive read-only” is not built |
| 2.5 Registration form fields | `#/admin/registration-settings` | Works. Choose per detail: do not ask / optional / required. Fees and options are not built (D5) |
| 3.8 Admin workflows | Covered by the pages above | See the tour in section 1 |

### Public website preview (`#/site/...`)

| Blueprint | Prototype page | Status |
|---|---|---|
| 2.1 Page layout (bar, header, menu, breadcrumb, footer) | All public pages | Works. “Viewing as” stands in for signing in |
| 2.2 Home | `#/site` | Works. Text blocks and news come from the admin pages. Partner and sponsor logos are a placeholder (files and permission pending) |
| 2.2 Conference Programme, Guidelines, Organizing Committee, Invited Speakers, Important Dates, Conference Themes, Venue | `#/site/p/<page>` | Works. Text comes from the Pages module. Names are placeholders. Dates are copied from the live site, including its conflicting dates |
| 2.3 Detailed program (day tabs, full list, print) | `#/site/program` | Works. Built from Schedule and Rooms. The day buttons come from the edition's conference days (equal-width, “Sun 27 Sep”). Print opens the browser's print window |
| 2.2 List of Participants (A–Z, count; not for Guests or Members) | `#/site/participants` | Works. Only people with status “Registered” are listed, names only |
| 2.5 Registration | `#/site/registration` | Works on sample data. Adds a “Pre-registered” person to the admin list of that edition. Asks only for the details set under “Registration form”; shows a “not open” note when the edition's registration is closed. The empty form on the live site was not seen, so the fields are those of its saved recap. Fees and payment are undecided (D5) |
| 2.2 Abstract Submission | `#/site/submit` | Interface only. Open or closed and the period come from the edition. When open the proposed form is shown; it sends nothing |
| Edition selection | “Conference edition” in the bar, or a link like `#/site?ed=mirc2027` or `#/site?ed=pantas2026` (the id is the conference key plus the year) | Works. Visitors (Guest and other non-team roles) get only published editions; a draft opened by link shows “not published yet”. Webmaster and Administrator can preview drafts |
| 2.6 Account / My Space | `#/site/login`, `#/site/account`, `#/site/my-registration`, `#/site/my-submissions` | Interface only. Real sign-in is not built. The fields of “Edit account” were not seen on the live site. The signed-in button is now called **My Account** (section 12) |
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
| Storing the logo file | The prototype reads the file in the browser and shows it from a temporary address. Nothing is uploaded; the logo disappears on reload (section 11) |
| Real roles for publishing | The prototype has no sign-in: every button on “Editions (years)” works. In production only the Administrator role should publish or hide |
| Persistent palettes and logos | Colors and logos live in the browser tab only (sections 11 and 12) |
| Visitor statistics, RSS feed | Need external services (D10) |
| Import from Sciencesconf | Phase 7 of the roadmap (D14) |

## 5. How the design serves older administrators

- **Large, readable text.** 20 px base (“Large”), with a 18 px and a 24 px option, and a generous line height. Everything is sized in relative units, so it scales together.
- **Plain words, task-based menu.** Groups are named after jobs (“Papers and decisions”, “Attendees”), not module names. Every page starts with one sentence saying what it is for.
- **Always a way back.** A “Dashboard” link in the breadcrumb and the menu on every admin page. The public preview always has “Back to the administration area”.
- **Big targets.** Buttons are at least 2.6 rem (about 52 px) tall; table tick boxes are about 44 px. The automated size check was run on the Papers received page only, where it found no control smaller than 44 px. “Compact” tables use smaller buttons (about 2.2 rem, 44 px at “Large”) and 17 px text.
- **A tidy Actions column.** Every table's Actions column uses one shared layout: all buttons have the same height; they have the same width inside a cell (the widest label sets it); the gap between buttons is the same everywhere; labels never wrap; and the buttons start at the same left edge in every row. Up to three buttons stack in one column; four or more use two even columns. In “Compact” the buttons sit side by side. Long labels were shortened where the page already gives context (for example “Edit title and abstract” is now “Edit” on screen, and keeps its full name for screen readers).
- **Tables fit the space they are given.** A table switches to stacked cards when its own content area is narrower than 40 rem, which also reacts to the text-size buttons. If a table is ever still too wide it scrolls sideways inside its own box, which can be reached with the keyboard, and the page itself never scrolls sideways. The Registrations and Pages tables were reorganized (date and amount now sit under the person and the status; the page kind sits under the page title) so they fit without losing any information.
- **Custom colors cannot silently break readability.** Every combination that carries text or marks a control is measured (4.5 to 1 for text, 3 to 1 for outlines and the focus ring) and any that fails is shown with a word and a symbol, with advice; saving a failing palette needs a second confirmation whose safe answer is “No, go back”. Text on buttons and bars, hover and pressed colors and the focus ring are worked out automatically, so they cannot be set wrong.
- **Words, not just colors or icons.** Every status has a word and a symbol (“✔ Accepted”, “✖ Refused”). Messages start with “Done.”, “Note.” or “Problem.”.
- **Confirmation before anything is removed or changed in bulk**, with the safe answer (“No, go back”) pre-selected.
- **Clear errors.** A summary at the top of the form lists each problem as a link that jumps to the field, and each field repeats its problem in plain words.
- **Messages stay** on screen until closed; they do not vanish after a few seconds.
- **Keyboard.** Every control can be reached by Tab. A “Skip to the main content” button comes first. A thick focus ring is always visible (navy on light areas, gold on dark bars). Dialogs close with Esc and return focus to the button that opened them.
- **Calm layout.** No animation, no auto-moving content, one task per page, long forms in a single column.
- **Dates are clicked, not typed.** A calendar replaces the day buttons and the browser's date box. Every day is a real button with a full spoken name (“Tuesday 29 September 2026, 7 events planned, selected”). Arrow keys move by day and week, Page Up/Down by month. Chosen days are filled with a tick, days that are not available are hatched with a dashed border, days with events carry a number: no meaning depends on color alone. Times use two boxes (hour, minutes) on the 24-hour clock, so what you type looks like what the schedule shows.
- **Phones and tablets.** The menu folds behind an “Open menu” button. Tables turn into stacked cards, each value labeled.
- **Public website menu.** On every screen size the page links sit in a slide-out menu (the **Menu** button, top left) instead of a long bar that wraps over several lines. It closes with the **Close** button, the Esc key, or a click outside it, and the page you are on is marked with a gold edge and bold text. “Sign in” stays in the bar.

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
| `python tests/crawl.py` | All 45 pages, as Guest and Participant on MIRC 2026, as Administrator on the empty MIRC 2027 draft, and as Guest and Administrator on PANTAS 2026: no console errors, no dead links, every button has an action, no repeated ids, a way back to the Dashboard |
| `python tests/conference-builder.py` | 41 checks of the conference builder: every refusal message (empty boxes, duplicate name or short name with other capitals and extra spaces, last day before first, first day outside the year, unreadable colors), create, the new conference in the Conference and Year boxes, its public site and colors, creating another year for it, saved across a reload, damaged or unreadable saved data, change (including the short name following everywhere), delete (with “No, go back”), and reuse of the names afterwards. It uses its own browser profile and clears what it saved |
| `python tests/workflows.py` | 84 checks of the main workflows end to end |
| `python tests/layout-contrast.py` | No sideways scrolling at 1280, 820 and 390 px wide; rendered text contrast on every page; visible focus ring; control sizes. Saves screenshots to a temporary folder and prints where |
| `python tests/editions.py` | 79 checks, 21 of them about several conferences (the picker, switching, PANTAS name/mark/colors/logo/email subjects, nothing of MIRC left in a PANTAS copy, duplicate years per conference, order of the list): calendar by mouse and keyboard, not-available days, date fields in forms, phone width; editions stay separate, draft/published visibility, create/publish/hide/delete, dates and topics validation, registration-form settings, banner and accent |
| `python tests/logo.py` | 61 checks: the specification is shown before choosing a file; every refusal message (text renamed .png, a JPEG named .png, GIF, SVG with a script or event handler, SVG without size, over 2 MB, empty, too small, too extreme a shape, damaged file); preview, fit, zoom, position; cancel; alt text; save, draft and publish; one logo per edition; header, menu bar and home page; layout at 1280, 820 and 390 px at two text sizes with a very long title |
| `python tests/theme.py` | 65 checks: pickers and HEX boxes, live preview, bad codes, 3-digit codes, readability warnings and the confirmation before saving a hard-to-read palette, cancel, reset, one palette per edition (draft edition, published edition, new edition), draft and publish, earlier palettes, restore the original; the palette on real public pages (header, bar, buttons, cards, forms, footer, menu drawer) at 1280, 820 and 390 px; hover and focus colors; the administration area unchanged; the My Account menu at three widths and two text sizes |
| `python tests/actions-layout.py` | The Actions column of 11 tables at 5 screen widths (1440, 1280, 1024, 820, 390 px), both table spacings and two text sizes (220 page views): the table fits, nothing is clipped or sticks out, all buttons share one height, labels do not wrap, gaps are equal, and rows line up the same way |

**What was actually run (2026-10-09):** all five, from the file system in headless Chromium on Windows. Results (the crawl now visits 42 pages; logo checks 61 of 61; theme checks 65 of 65): crawl found no problems and no console errors; workflows 84 of 84 passed; layout/contrast found no problems; Actions layout found no problems in 220 page views; editions 58 of 58 passed. The crawl of the empty 2027 draft found one real bug (“My registration” failed when an edition had no registrations); it was fixed. The Actions layout was measured before and after an earlier change (for example at 1280 px the Papers buttons went from 81 and 167 px wide, 52 and 74 px tall, with no gap, to equal 85 × 52 px with a 9 px gap).

**Re-run on 2026-10-16 after the multi-conference change and again after the conference builder:** all eight, same method (the builder test passes 41 of 41). crawl: no problems, no console errors; workflows 84 of 84; editions 79 of 79; logo 61 of 61; theme 65 of 65; actions layout and layout/contrast: no problems. (The test files were updated for the new Conference box: editions now expects four editions, and the PANTAS checks are new.)

**Not tested:** other browsers (Firefox, Safari, Edge), real phones and tablets, any screen reader, and use by actual older adults. These matter for this audience and should be done before the design is signed off.

## 9. What remains before this becomes the real site

The plan is in the blueprint: technology in section 12, security in 13, testing in 14, deployment in 15, phases in 16, open decisions in 17. In short:

1. **Settle the open decisions** that block the build: which edition and purpose (D1), replace or complement Sciencesconf (D2), hosting plan terms (D4), fees (D5), brand details including error and info colors and a font (D6), review rules (D12).
2. **Build the server part**: accounts and roles, a database with per-role access rules, file storage, an email service with a verified sender domain, PDF generation, and the review form.
3. **Replace the stand-ins**: a real text editor with sanitized output, real partner logos (with permission), real content, real statistics.
4. **Harden and test**: security review, load test around deadlines, backup restore test, a full accessibility audit with a screen reader and **real older users**, and a trial run of the data import.
5. **Deploy** using the environments and secrets handling in blueprint section 15.

## 10. Reusable editions: how it is built, and what production needs

**Idea.** The site has no conference name or year written into its code. What is shared by every edition of a conference (its names, starting texts and palette) lives in `conferences.js`; everything that differs between editions lives in one *edition record*; the pages, menus and forms are shared. Screens never type “MIRC”: they ask `P.tag()` (“MIRC 2026”) or `P.series().code` (“MIRC”).

| Part | Where | What it does |
|---|---|---|
| Conference list | `conferences.js` (`CONFERENCES`) | One entry per conference: `code`, `name`, starting `place`, `venue`, `tagline`, `sub`, optional `theme`, optional `first` edition. Key order = order in the pickers |
| Edition record | `data.js` (`MIRC_2026`, `EDITIONS`) | `conf` (id = conference key + year, `series` = conference key, year, status draft/published, name, city, venue, theme, conference days, submission window, registration deadline, banner, accent), `topics`, `settings`, `pages`, `rooms`, `events`, `papers`, `registrations`, `news`, `templates`, `files` and more |
| Edition switch | `core.js` (`ED`, `P.useEdition`) | `S` is a window onto the current edition, so every page asks `S.events`, `S.topics` ... and gets that edition's data. People (`S.users`) are shared by all editions, as in blueprint 7.1 |
| New edition | `editions.js` (`P.newEdition`) | Copies the set-up (pages, rooms, topics, templates, settings), starts everything else empty, resets dates, sets status Draft. Given another conference, it takes that conference's names, texts and palette and rewrites the old code, key and year in the copied email subjects, aliases and header. The sample MIRC 2027 and PANTAS 2026 are made by this same function |
| Visibility | `editions.js`, `site.js` | Draft editions are visible only to Webmaster and Administrator (“Viewing as”). Everyone else gets “not published yet”, even from a direct link |
| Dates | `calendar.js` | One calendar widget; the conference days drive the Schedule calendar, the public program buttons, and the dates on the header and home page |

**Adding the next year:** Conference › Editions (years) › Create a new edition (choose the conference and the year) › Edition details (name, theme, place, dates, topics) › Schedule, Pages and menu, Registration form, Site settings › Preview › Publish. No code change.

**Changes since the first prototype (summary).**
- Done: calendar and clearer date selection (Schedule, date fields, conference days); aligned Start/End time boxes; schedule table with a Room column and times that no longer wrap; plain-language checks for time, room clashes, talks inside their session, deadlines and removed days; multi-edition data model with draft/published; Editions, Edition details and Registration form pages; banner and accent per edition; public edition choice; dashboard card with “still to do before publishing”.
- Kept as before: all earlier pages, palette, menus, text-size and table-spacing buttons, and the existing test checks (two were changed because the time boxes and the day buttons changed; two checks were added).

**Frontend only (simulated) and what production needs.**

| Shown in the prototype | Production needs |
|---|---|
| Editions, drafts and publishing live in the browser tab and vanish on reload | A database with a conference id on every table (blueprint 7.1) and row-level access rules; a published/draft flag checked on the server for every public request |
| “Viewing as” stands in for roles | Real sign-in; only the Administrator role may publish or hide an edition; audit log of who published what and when |
| Create edition copies in memory | A server job for the yearly rollover (15.5), run in one database transaction, with a way to archive an old edition read-only |
| Logos and files are names only | File storage and virus scanning; image size limits |
| Banner and accent are three fixed choices | A reviewed theme list (D6); a full theme editor would need contrast checks built in |
| Registration and abstract forms send nothing | Form handling, email service, spam protection, privacy notice (blueprint 13) |
| Fees, payment options, review rules | Still undecided (D5, D12) and not built |
| One topic list per edition, edited as text | A topics table with ids, so renaming a topic updates papers and sessions |

**Not tested:** other browsers, real phones and tablets, a screen reader (the calendar uses button, grid and live-region roles but was only checked by script), and use by actual older adults.

## 11. Logo management: specification, behavior, and what production needs

**Where.** Conference › **Logo** (`#/admin/logo`). The dashboard card and the Editions list show each edition's logo. Where the logo appears is chosen on the same page.

**How the sizes were chosen (not arbitrary).** The header logo frame was already 6 rem square: 120 px at the default text size, 144 px at “Largest”; the home page uses 7 rem (168 px); the menu bar 2.75 rem. A picture is sharp on high-resolution screens at twice its display size, so the **minimum is 240 px** (2 × 120) on the longest side. **600 × 600 px** is recommended: it stays sharp at 2× even at “Largest” on the home page (336 px) and leaves room to zoom in. The old placeholder was a circle; the frame is now a rounded square with a white background, because a square holds square, round and wide logos alike and shows a transparent logo on a plain ground.

| Requirement | Value | Where enforced |
|---|---|---|
| Formats | PNG or SVG recommended; JPEG and WebP accepted; GIF refused | By the file's first bytes, not its name |
| Name must match contents | “.png” must really be a PNG, and so on | Refused with the real format named |
| File size | at most 2 MB | Refused, says the size found |
| Pixels (PNG, JPEG, WebP) | longest side 240 to 4000; short side at least 48 | Refused, says the size found and the recommendation |
| Shape | square recommended; up to 4:1 or 1:4 accepted | Beyond that refused; a non-square picture is **shown whole, never stretched**, with a warning that explains it |
| SVG | must have a size or viewBox; no scripts, event handlers, embedded pages or links to other sites | Refused with a plain explanation. SVG is only ever shown through an image tag, so it cannot run code |
| Text alternative | required, up to 120 characters | Plain-language message |

**Fit, crop and position.** “Whole logo” (default) never cuts anything. “Fill the frame” crops the edges. Zoom (100–300 %) and two position sliders choose which part shows. These are saved as settings beside the original file (nothing is destroyed), and every place that shows the logo uses the same frame and settings. A warning appears if the zoom enlarges a picture past its real size.

**Preview, cancel, save, publish.** After choosing a file nothing is saved. The page shows the logo in the real header, a phone-width header and the menu bar, using the edition's real title and place. **Cancel**, or leaving the page, drops the choice and the current logo stays. In a **draft** edition one button saves. In a **published** edition there are two: **Publish this logo now**, or **Save as a draft**, which keeps the old logo for visitors, lets the team (Webmaster, Administrator) see the new one with a “Logo preview” notice, and can then be published or discarded.

**Separation between editions.** The logo, its draft and its file entry live inside the edition record. A new edition starts **without a logo** and without the previous year's logo file. Tests confirm that saving, publishing, removing or discarding a logo for one edition leaves the others unchanged.

**Frontend only, and what production needs.**

| In the prototype | In production |
|---|---|
| The chosen file is read in the browser and shown from a temporary (blob) address; lost on reload | File storage with a path that includes the conference id, for example `editions/<conference_id>/logo/<new id>.<ext>`; every upload gets a new name, so a logo can never overwrite another edition's file; keep old versions for rollback |
| File checks run in the visitor's browser and can be bypassed | **Repeat every check on the server**: sniff the real type, enforce size and pixel limits, and decode the picture. Prefer re-encoding rasters (this strips hidden data) and sanitizing SVG with a maintained library, or convert logos to PNG. Add virus scanning |
| Crop is saved as settings only | Either keep applying the same settings in the page (as here), or generate a cropped copy on the server |
| A logo is a field on the edition record | Columns or a table such as `conference_logo(conference_id, file_id, alt, fit, zoom, x, y, status draft/published)`; blueprint 7.1 has `conference.logo_url` only |
| Anyone can use the page | Only Administrator and Webmaster may change a logo; only Administrator may publish (same rule as publishing an edition); log who changed what and when |
| Draft logo is visible to “Webmaster” and “Administrator” in the preview | Serve the draft file only to signed-in team members, never from a public address |
| Served from the page | Serve through a CDN with long cache lifetimes and unique file names; send `Content-Type` from the server's own detection and `X-Content-Type-Options: nosniff`; set width and height to avoid layout shift |

**Not tested:** other browsers, real phones, screen readers, very large real-world files from real design programs, and use by real administrators. The checks were run on pictures drawn by the test script (PNG, JPEG, WebP, SVG) and on hand-made bad files.

## 12. Visitor-site colors and the “My Account” button

### 12.1 What was found, and the label chosen
**Before:** the signed-in button said “My Space (Participant)” (role in brackets). It is not a link to one page: it opens a small menu of the person's own pages, **My submissions, My registration, Edit account, Log out**, plus **Administration area** for the team roles (Webmaster, Administrator, Coordinator, Reviewer). That matches blueprint 2.1 and 2.6: on the live Sciencesconf site “My Space” is the organizer's back office, and its dropdown holds those same four items. Visitors who are not signed in see **Sign in** instead.

**Options weighed against that function:** “Participant Portal” and “Participant Dashboard” are wrong (reviewers and organizers use the same button; nothing here is a dashboard). “My Conference” misses Edit account and Log out. **“My Account”** covers all of it: the person's registration, their submissions, their details, and signing out.

**Final label: My Account.** The button keeps its place, size, style and ▾ marker. Its tooltip reads “Your registration, your submissions and your account details”. The role moved out of the label into the first line of the menu (“Signed in as Participant”), because the role is not part of the destination. All four destinations, the Administration link and Log out are unchanged. The old name appears nowhere on the public pages (tested). The blueprint keeps “My Space” only where it describes the live site.

### 12.2 Where the colors are, and how they reach the pages
Website › **Site colors** (`#/admin/colors`). Each edition has its own palette (`settings.theme`, a draft in `themePending`, and the last five replaced palettes in `themeHistory`), so changing one edition never changes another. A new edition starts with a **copy** of the palette of the edition it came from.

| Color | Used for |
|---|---|
| Primary | Headings, links, tabs, outline of secondary buttons |
| Secondary | Navigation bar, menu panel, footer |
| Accent | Line under the header and on the home card, accent button, highlights |
| Page background | Behind every page |
| Surface | Cards, header, forms, tables, fill of secondary buttons |
| Text | Body text and form field outlines |
| Main button | Fill of main buttons |
| Border and soft fill | Card outlines, table heading background |

Worked out automatically from these: text on buttons and bars (white or navy, whichever reads better), hover and pressed colors, link hover, the keyboard focus ring (navy or white, whichever stands out from both page and cards), and the gradient of the large home title.

**How it is applied (one configuration, no colors in components).** `theme.js` writes the palette and the worked-out colors as `--t-*` variables on the `.site` wrapper of the public pages. In `styles.css` one block (“Visitor-site theme”) re-points the existing palette variables to them inside `.site`, plus a few rules for buttons, bars and states. Every component (header, menu bar, menu panel, user menu, buttons, links, cards, forms, tables, alerts, badges, announcements banner, footer) therefore follows the palette. The administration area and the prototype's own “Public website preview” bar are outside `.site`, so they keep the original colors (tested). The live preview is the same components inside the same wrapper.

**Accessibility.** Twelve combinations are measured with the WCAG 2.1 formula: body text on page and on cards, headings and links on page and cards, text on main buttons (normal and hover), button shape against cards and page (3 to 1), text on the bar and footer, text on the accent button, table headings, secondary-button hover, and the focus ring. A failing row shows “! Too low” with advice. Saving a failing palette needs a second confirmation, whose safe answer is “No, go back and change them”. Status messages keep their word and symbol, so no meaning depends on color; the status colors themselves (green, gold, navy) are fixed and not part of the palette. Focus rings stay 4 px, and hover and pressed colors are always different from the resting color.

**Controls.** Picker and HEX box stay in step; a bad code is refused with a plain message and does not change the preview; three-digit codes expand; **Default** next to each color; **Cancel** returns to the saved colors; **Reset all colors to the default** loads the original palette into the editor (not yet saved); **Restore the original palette on the website now** applies it at once, with confirmation; **Earlier palettes** load a previous palette into the editor. On a published edition you choose **Publish now** or **Save as a draft**: visitors keep the old colors, the team (Webmaster, Administrator) sees the draft marked “Branding preview”, and it can then be published or discarded.

### 12.3 Frontend only, and what production needs
| In the prototype | In production |
|---|---|
| Palettes are held in the edition record in the browser tab and vanish on reload. Nothing is stored on a server | A table such as `conference_theme(conference_id, status draft/published, primary, secondary, accent, background, surface, text, button, border, updated_by, updated_at)` plus a history table; per-edition rows so editions stay separate |
| The editor trusts the browser to validate HEX codes | Validate on the server (`^#[0-9a-f]{6}$`) and never write a stored value into CSS unchecked. The prototype also re-validates every color before use and falls back to the default |
| Colors are written as an inline style on the page wrapper | Serve the published palette as a small CSS file or a `<style>` block per edition, cached and invalidated on publish; draft palettes only to signed-in team members |
| Contrast is measured in the browser | Run the same measurement on the server before publishing, and keep the confirmation step; log who confirmed a failing palette |
| Anyone can open the page; no roles | Only Administrator and Webmaster may edit; only Administrator may publish (same rule as editions and logos) |
| The 12 checks cover the components that exist today | Add a row whenever a new component or color pairing is added. Keep the checks in a test that fails the build when the default palette stops passing |
| No dark-theme work | A dark palette can be entered and is checked, but blueprint 9.8 recommends light only; dark mode would need its own review of images and the logo frame |

**Not tested:** other browsers, real phones and tablets, a screen reader (the preview is hidden from screen readers and replaced by the readability list), color-blind users, and real administrators. Contrast is calculated, not judged by eye.

## 13. Several conferences, and how to add a new one

**What changed.** Before, the site knew one conference (MIRC) and only the year could be switched. Now an edition belongs to a **conference** (`conf.series`, for example `mirc` or `pantas`) and a year. The dark top bar and the public site have a **Conference** box and a **Year** box; **Create a new edition** asks for the conference as well as the year. Editions of different conferences never share data (only user accounts are shared, as before).

**Where each thing comes from.**

| Shown on the site | Comes from |
|---|---|
| Short name in titles, menus, email subjects, the big “2026 MIRC” mark, the placeholder logo, the admin brand | `code` of the conference (`P.series().code`, `P.tag()`) |
| Full name of the edition, the public header title | `name` + year (a different title can still be typed under Site settings › Header) |
| Place, venue, theme, sub-line of a **new** edition | `place`, `venue`, `tagline`, `sub` of the conference |
| Colors of the visitor site, and what “Restore the original palette” goes back to | `theme` of the conference, else the original green palette |
| Edition id and link | conference key + year (`pantas2027`, `#/site?ed=pantas2027`) |

Everything else (pages, rooms, topics, email templates, settings) is copied from the edition you choose under “Copy the set-up from”. The year inside copied texts is replaced too, and so are the old conference code and key.

**Adding a new conference (one file, no other code).**

1. Open `prototype/conferences.js`.
2. Add an entry after the last one. The key is lower case, letters and digits only; it becomes part of every edition id:

```js
  asean: {
    code: 'ASEAN', name: 'ASEAN Education Forum',
    place: 'City to be announced (sample)', venue: 'Venue to be announced (sample)',
    tagline: 'Theme to be announced (sample)', sub: '',
    theme: { primary: '#7a1f1f', secondary: '#3d0f0f', accent: '#e1ca5e', background: '#fbf7f7', surface: '#ffffff', text: '#3a2b2b', button: '#7a1f1f', border: '#f1e6e6' },   // optional
    first: { year: 2026, status: 'draft', days: [] },                                                                                                     // optional
  },
```

3. Save and reload `index.html`. The conference appears in both pickers with a first edition (a draft of the current year unless `first` says otherwise). Fill in its dates, logo and pages under **Conference › Edition details**, **Logo** and **Pages and menu**, then **Publish**.
4. If you give a `theme`, check it under **Website › Site colors** (the readability list). The crawl test visits the editions it knows by name; to cover a new conference there, add its edition id to the list in `tests/crawl.py`.

`name`, `place`, `venue`, `tagline` and `sub` are only the **starting texts of a new edition**: after the edition exists they are edited under Edition details, and changing `conferences.js` later does not change editions that already exist.

**Assumptions made.**
- **PANTAS** is a second conference with the same structure as MIRC. Its real full name, place, theme and colors were not given, so `conferences.js` holds placeholders: the name “PANTAS Conference”, a navy-and-gold palette that passes the readability checks, two sample days (11–12 November 2026) and “to be announced (sample)” texts. Replace them with the real ones.
- PANTAS starts from the MIRC 2026 *set-up* (pages, rooms, topics, email templates, registration form), without the MIRC papers, people, schedule, news or page texts. Its topics are therefore MIRC's until they are changed under Edition details › Topics.
- Conferences can be added in two ways: in `conferences.js` (a developer, built in) or on screen under **My conferences** (section 14, saved in the browser). Both end up in the same `CONFERENCES` list and behave the same.
- The administration area keeps its own green design for every conference (the same rule as before, section 12); only the short name in its top bar follows the conference.
- Two conferences cannot have the same key. The same year may exist once per conference.
- Sample body texts of the MIRC 2026 edition (venue in Manila, the rules in “General information”) stay MIRC's: they are that edition's content, not site code.

**What production needs.** A `conference` table (key, code, name, defaults, theme) beside the existing edition table (blueprint 7.1), an Administrator-only screen to create a conference, and a conference id in every public address (for example `/pantas/2027/program`). The edition id and the Conference and Year boxes already follow that shape.

## 14. My conferences: creating your own conference on screen

**Where.** Conference › **My conferences** (`#/admin/my-conferences`). It lists every conference with its logo, its years and where it was made. The built-in ones (MIRC, PANTAS: written in `conferences.js`) can be opened but not changed or deleted here. The ones you create show **Work on it**, **Change** and **Delete**.

**Create one.** Press **Create a new conference** and fill in:

| Box | Rule |
|---|---|
| Full name | Required, 3 to 80 characters, not the same as another conference (capitals and extra spaces do not count). The year is added automatically: “Visayas Health Summit 2027” |
| Short name (acronym) | Required, 2 to 12 letters or digits, starting with a letter, no spaces, not used by another conference. Stored in capitals. Shown in menus, page titles, email subjects, the “2027 VHS” mark and the placeholder logo. It also becomes the conference's key (`vhs`), and so the edition id (`vhs2027`) and public link (`#/site?ed=vhs2027`) |
| Year of the first edition | Required, 2000 to 2100. Cannot be changed afterwards (more years are added under Editions (years)) |
| First day, Last day | First day required, in that year. Last day optional (one-day conference), not before the first day, at most 31 days. Every day in between becomes a conference day |
| City and country | Required |
| Venue, Theme, Sub-line | Optional, up to 120 characters each. Theme is the big line on the home page |
| Description | Optional, up to 2000 characters. Becomes the home page block “About the conference” |
| Main brand color, Accent color | Two color pickers. The other six colors of the website palette are worked out from the main color (darker shades for the bars and text, very light tints for the page and borders). The palette is checked with the same readability rules as Website › Site colors; a main color that would give unreadable text (for example a pale yellow) is refused with the reason |
| Show the first edition to visitors? | Yes publishes it at once (it has dates), No keeps it a draft that only Webmaster and Administrator can see |

When you press **Create the conference**, it is added to the Conference box, its first edition is made (a copy of the set-up of the first edition in the list: pages, rooms, topics, email templates, registration form; with your names, texts, dates, palette and a drawn placeholder logo built from the short name and colors), and you start working on it. Then use the normal Conference and Website menus: Edition details, Logo (upload a real logo here), Pages and menu, Schedule. Create further years under Editions (years).

**Change one.** **Change** opens the same form without the year and dates (those are edited under Edition details). Saving changes the saved definition and the **first** edition (name, place, venue, theme, sub-line, description, the colors, and the logo if it is still the drawn placeholder; an uploaded logo is never replaced). Other years of the conference keep their own texts and colors, but show the new short name everywhere, and the short name inside email subjects is updated in all years. The key stays the same.

**Delete one.** **Delete** asks first and lists the editions that will go (with their pages, schedule, papers and people lists). It cannot be undone. If you were working on one of them, you are moved to another edition.

**What is saved, and where.** Only the *definition* (the boxes above) is saved, in this browser's `localStorage` under the name `customConferences`. After a reload the conference is rebuilt from it, with its first edition as created. Everything you did afterwards *inside* an edition (page texts, schedule, papers, extra years, an uploaded logo) is sample data like the rest of the prototype and is lost on reload. “Start over (reset the sample data)” does not remove your conferences; **Delete** does. The yellow notice at the top of every page says so. If the browser blocks storage (private window, site data switched off), the screen says the conference cannot be saved and will be gone after a reload.

**Assumptions made.**
- “Without editing code” and “not lost when the site is reloaded” are met with browser storage, because the prototype has no server. The conference exists on **this computer and browser only**; another computer, another browser or cleared site data shows only the built-in ones. There is no export or import.
- Only the definition is saved, not the whole edition (see above). Saving the editions would mean saving the whole sample database, which is a server job in production.
- The logo is drawn from the short name and the two colors. Uploading a logo while creating was not built: the logo screen (Conference › Logo) already does that, with its checks, but the uploaded file is not saved across a reload.
- Dates are typed or picked with the browser's own date box, not the site's own calendar picker, to keep the form simple. The site's calendar is used for all later date changes (Edition details); a future version could use it here too.
- Any signed-in administrator can create, change and delete conferences; there are no roles in the prototype. In production only the Administrator role should.
- A conference created here and one in `conferences.js` with the same key cannot both exist: a saved entry whose key is already built in is ignored at start-up.
- Damaged saved data is skipped entry by entry (an entry that is not complete or has an invalid color is ignored), so a bad entry cannot stop the site from opening.

**What production needs.** A `conference` table (name, code, key, defaults, two brand colors) with an Administrator-only create/change/delete screen, row-level rules, and a conference id on every edition (blueprint 7.1). Logo upload during creation, a dated audit log of who changed a conference, and a rule for what happens to published editions when a conference is deleted (archive instead of remove, 15.5).

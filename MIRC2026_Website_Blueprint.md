# MIRC 2026 Conference Website — Documentation & Rebuild Blueprint

**Subject:** Manila International Research Conference 2026 (MIRC 2026), hosted on Sciencesconf.org
**Public site:** `https://mirc2026.sciencesconf.org/index`
**Back office:** `https://mirc2026.sciencesconf.org/myspace`
**Observed on:** 2026-10-08 / 2026-10-09, read-only, using an already signed-in organizer account.
**Revision:** v2, 2026-10-09. Adds the visual design system from the uploaded images (section 9), planning sections (1.4 and 10–17), a verified technology recommendation (section 12) and a change log (section 18). Sections 0–8 keep their v1 content except where marked "v2". The v1 file is preserved as `MIRC2026_Website_Blueprint.v1-backup.md`.
**Status of the work:** this is a **plan**. Nothing described here has been implemented, tested or deployed.

---

## 0. How to read this document

### Method and accuracy
- Only what was seen on the pages is documented. Nothing was saved, sent, deleted or submitted.
- Where a form or dialog was opened, it was cancelled without saving.
- **Observed** = seen directly on a page or in the page's form definition.
- **Not confirmed** = could not be seen in this session. This usually means a closed period, a feature behind a state the session was not in, or a part that is not visible to this account. Items marked this way are *not* claims that the feature exists.
- Personal data (registrant names, emails, phone numbers, submission authors) was deliberately **left out**. Only field names and structure are recorded.

### Limits of what was seen
| Limit | Effect |
|---|---|
| The session was signed in as an organizer who is also registered as a participant | The public site showed organizer controls ("Edit page" links, admin bar). The experience of an anonymous visitor is **not confirmed** except where noted. |
| Abstract submission and review periods are closed | The author submission form and the reviewer scoring form were **not seen** (not confirmed). |
| The account was already registered | The registration page showed a recap of the saved registration, not the empty form. The empty registration form, fee options and payment steps are **not confirmed**. |
| Platform internals (server code, database, hosting) are not visible | Section 7 (data model, tech stack) is a **suggested design inferred from the observed UI**, not a description of Sciencesconf's internals. |

### Sources and evidence labels (v2)
Sections 1.4 and 9–18 use these labels. Anything without a label in sections 1–8 follows the v1 convention (Observed / Not confirmed).

| Label | Meaning |
|---|---|
| **CONFIRMED** | Stated in the task brief, or visible in the uploaded images, or observed on the live site |
| **ASSUMPTION** | A working guess used so planning can continue. Replace it when the real answer is known |
| **RECOMMENDATION** | A proposed choice with reasons. Not a requirement |
| **UNRESOLVED** | A decision nobody has made yet. Listed again in section 17 |
| **EXACT** / **ESTIMATE** | For colors only. EXACT = flat fill whose identical value was found in many pixels. ESTIMATE = gradient, anti-aliased edge or photo overlay |

| Source | Used for |
|---|---|
| Live site `mirc2026.sciencesconf.org` (v1 observation) | Functional requirements, roles, data fields (sections 2–8) |
| Four uploaded images (a keynote certificate, two title slides, an "Opening Remarks" speaker card) | Visual palette and motifs (section 9), plus event copy and dates |
| Official vendor documentation, fetched 2026-10-09 | Hosting, database, email, framework and styling facts in section 12 (links in section 18) |

---

## 1. Overview

### 1.1 What the site is
- A **hybrid international academic conference** website, built on **Sciencesconf.org**, a hosted conference-management platform operated by CCSD (France). The footer credits CCSD-SciencesConf, supported by the French Ministry of Higher Education and Research, CNRS, INRIA and INRAE.
- Sciencesconf is a **single multi-tenant product** with two faces:
  1. A **public conference website** with a configurable menu of pages.
  2. A **back office ("My Space")** with modules for program, website, reviewing, editorial management, mailing, registration and account creation.
- The site's interface language options are French, English and Spanish. The public pages were viewed in English (`?lang=en`).

### 1.2 Conference facts shown on the site
| Item | Value (as shown) |
|---|---|
| Name | Manila International Research Conference 2026 (MIRC 2026) |
| Location line in header | Manila (Philippines) |
| Date range in header | 27–30 Sep 2026 |
| Main conference | 29–30 Sep 2026 at PLM Campus, Intramuros, Manila |
| Sub-conference | 27 Sep 2026, Hospitality and Tourism, at DLSU-CSB (with College of Saint Benilde and Sejong University) |
| 28 Sep 2026 | "Free day to visit Manila City" (program entry of type *Tour*) |
| Format | Hybrid (onsite + online via Zoom) |
| Host institution | Pamantasan ng Lungsod ng Maynila (PLM), University of the City of Manila |
| Partner institutions | De La Salle – College of Saint Benilde; Sejong University; NU Fairview; ICCCM (Malaysia); ITEA; CCSD-SciencesConf; DOST-PCIEERD Balik Scientist Program |
| Principal sponsor | C&E Group |
| Theme | Role of AI, sustainability and innovation in resilient, inclusive, future-ready communities |

### 1.3 Scale observed in the back office (counts at time of viewing)
| Metric | Value | Source screen |
|---|---|---|
| Total submissions | 214 (213 after the default filter) | Editorial Management > Submissions |
| Registrations | 253 | Registration management > Participants |
| Names on public "List of Participants" | 240 | Public list page ("Number of registers: 240") |
| Rooms defined | 6 | Program > Rooms |
| Reviewers listed | At least 2 (list not fully read; reviewer counts per topic all showed 0) | Reviewing > Reviewers |

The gap between 253 registrations and 240 listed names is **not explained** on the pages (not confirmed why).

### 1.4 Purpose, audience and scope (v2)

| Topic | Statement | Label |
|---|---|---|
| Purpose of this document | A blueprint a developer can use to build a conference website like the MIRC 2026 site. The live Sciencesconf site is the functional reference. The uploaded images are the visual reference | CONFIRMED (task brief) |
| Conference identity | Name "2026 MIRC — Manila International Research Conference"; tagline "Shaping Resilient Futures"; sub-line "AI, Sustainability, and Inclusive Innovation"; 29–30 Sep 2026 at Pamantasan ng Lungsod ng Maynila (PLM) | CONFIRMED (images and site text) |
| Host and partners | PLM hosts. Six circular partner logos sit in a row at the top of images #2–#4. A row of sponsor logos (roughly three to four marks) sits near the bottom of the two title slides, #3 and #4 | CONFIRMED (images). Which logo belongs to which organization is not written on the images, so it is not recorded here |
| Audience | Researchers, academicians, practitioners, policymakers and students; onsite and online participants; plus the organizer-side roles in section 4 | CONFIRMED (site overview text, v1 observation) |
| Event artifacts the organizers produce | A certificate of appreciation for a keynote speaker; a title slide in two colorways; an "Opening Remarks" speaker card | CONFIRMED (images) |
| Which edition the planned site is for | Not stated. All source material is dated 27–30 Sep 2026, which is **before** this revision (2026-10-09) | UNRESOLVED (D1). The plan therefore treats the edition year as data, not as hard-coded text |
| Replace Sciencesconf, or sit beside it | Not stated | UNRESOLVED (D2) |
| Expected traffic | Not given. The only scale data is 253 registrations and 214 submissions (section 1.3) | ASSUMPTION (A2): low volume, with spikes near deadlines and on event days |
| Language | The live site and all four images are in English. The platform offers French, English and Spanish | ASSUMPTION (A3): English only for the first release |
| Team, budget, timeline | Not given | UNRESOLVED (D3, D9) |

---

## 2. User-facing side

### 2.1 Global page layout (all public pages)
| Zone | Contents (observed) |
|---|---|
| **Admin bar** (top, thin) | Sciencesconf logo (links to `www.sciencesconf.org`); **My Space** link; user avatar/initials dropdown with: *My submissions*, *My registration*, *Edit account*, *Logout* |
| **Conference header** (banner) | Conference logo image (left), title, location line, date range. Header is configurable (see back office > Website > Header) |
| **Main menu** (horizontal, below banner) | 11 items, listed in 2.2 |
| **Breadcrumb** | Home icon > current page title |
| **Content area** | `<article>` holding the page's content; organizers also see an "Edit page" link under the content |
| **Footer** | Conference organizer mailto; Help mailto (platform support); Documentation; F.A.Q.; RSS Feed; Mentions légales; Privacy; General conditions of use; "Accessibility: non-compliant" (platform statement); credit to CCSD |

### 2.2 Navigation tabs / pages
| # | Menu label | URL | Page type (per back office) | Purpose | Content observed |
|---|---|---|---|---|---|
| 1 | Home | `/` | Home | Landing page | "Conference Overview" text block; conference details (dates, format, venues, host); list of partner institutions; sponsors; logo images |
| 2 | Conference Programme | `/page/boa` | page (custom, slug `boa`) | Download the programme and poster PDFs | Title "MIRC 2026 Book of Abstracts" and two PDF links: Final Conference Programme and Final Poster Presentations (both dated 10-09-2026 in filenames) |
| 3 | Detailed Conference Program (with Abstracts) | `/program` | Program module | Interactive schedule | Day tabs (27, 28, 29, 30 Sep) + a **List** tab; see 2.3 |
| 4 | General Information and Presentation Guidelines | `/page/geninfo` | page (slug `geninfo`) | Instructions to presenters | Two downloadable files plus long guidelines text; see 2.4 |
| 5 | Organizing Committee | `/page/organizing_committee` | page | List committee | Four roles: Conference Chair, Co-Chair, Vice-Chair, Secretary, each with name and affiliation |
| 6 | Invited Speakers | `/page/invited_speakers` | page | List speakers | Three groups: **Plenary Speakers**, **Keynote Speakers**, **Special Session Speakers**; each entry = name, affiliation, country, "Topic:" title (about 24 topics in total) |
| 7 | Important Dates | `/page/important_dates` | page | Deadlines | Call for abstracts 30 May 2026; abstract deadline shown as "30 June 2026" followed by "25 July 2026 CLOSED"; acceptance notification 15 Aug 2026; programme release shown as "25 August 2026" followed by "28 August 2026"; registration deadline 20 Aug 2026 11:59 p.m.; conference dates |
| 8 | Conference Themes | `/page/conference_themes` | page | Topics/tracks | Content is an **uploaded screenshot image** (no text) |
| 9 | List of Participants | `/resource/listeparticipants` | listeparticipants | Public attendee list | A–Z letter index, "Number of registers: 240", names grouped by first letter |
| 10 | Venue | `/page/venue` | page | Venue info | Venue name, address (Gen. Luna cor. Muralla Streets, Intramuros, Manila 1002), website link, "About the University" text |
| 11 | Registration | `/registration` | registration module | Register / view registration | See 2.5 |
| 12 | Abstract Submission | `/user/submit` | Submission | Submit abstracts | Currently shows "The abstract submission is closed — Period for abstract submission: 13 May–20 Sep 2026" |

**Discrepancies on the site itself (reported, not corrected):**
- *Important Dates* page text lists an abstract deadline of 30 June / 25 July 2026, while the Abstract Submission page says the period runs 13 May to 20 Sep 2026.
- Page-text formatting (e.g. strike-through on replaced dates) could not be confirmed from the extracted text.

### 2.3 Detailed program module (`/program`)
| Element | Behaviour (observed) |
|---|---|
| Day tabs | One tab per day. Sunday 27 is the default; others link to `/program/graphic/date/YYYY-MM-DD` |
| Graphical view | Time-grid for the selected day (route pattern above) |
| **List** tab | `/program/details` — all days in one scrolling list, with times, event titles, rooms, speakers, and abstracts inline |
| Print | A print route exists (`/program/liste/print/page`) |
| Talk links | Each communication links to its own page on the conference domain (`https://mirc2026.sciencesconf.org/<document id>`) |
| Tracks / sessions | Sessions are labelled by topic, e.g. "Hospitality and Tourism", "Plenary Session" |
| Visibility of papers | Controlled by back-office setting **Program > Appearance > "PROGRAM_SHOWPAPERS" (Yes/No)** |

Program entry **types** (the same five used in the admin event editor): *Session*, *Speech/Intervention*, *Logistics*, *Break*, *Tour*.

### 2.4 Presentation guidelines (content of `/page/geninfo`)
Observed rules, summarised:
- All presentations run on **Zoom**, for both on-site and virtual participants; session links are posted on a secure page.
- Presenting authors are expected on-site; virtual presenting needs **organizing committee approval**.
- Virtual presenters must submit a **recorded back-up presentation**.
- Time allocations: Plenary 45 min (35 + 10 Q&A); Special Workshop 60 min (45 + 15); Keynote 30 min (25 + 5); Oral 15 min (12 + 3); Poster 75 min per session.
- Zoom display name convention: Surname-Name-Affiliation Acronym.
- Posters: portrait layout, maximum 5 ft × 2 ft (1524 × 610 mm); on-site presenters also upload a **poster PDF (max 10 MB)** for virtual attendees.
- Internet speed recommendation (at least 2.5 Mbps).

### 2.5 Registration module (`/registration`)
Observed for an already-registered user: a green notice "Your registration has been saved" and a read-only recap.

| Field (recap labels) | Notes |
|---|---|
| Title | e.g. Ms., Dr. |
| Lastname, Firstname, Middlename | |
| Email | |
| Language | interface language code |
| Phone number | |
| Institution | |
| Mailing Address | |
| Country of your organization | ISO-style code |
| Complementary informations | free section; contents not confirmed |

**Not confirmed:** the empty registration form for a new registrant, registration fee tiers/options, payment method, and what "Preregister / Need a payment / Registered" mean to the end user (these labels exist in the back office; see 3.6).

### 2.6 Account / My Space (visible to any logged-in user)
| Item | Observed |
|---|---|
| My Space | `/myspace` — for this organizer account it is the full back office (section 3). What an ordinary participant sees at this URL is **not confirmed**. |
| My submissions | Link `/user/submissions` exists in the dropdown, but opening it returned "The page that you request does not exist" at the time. Reason **not confirmed** (possibly because the submission period is closed or the account has no submissions). |
| My registration | `/registration` (2.5) |
| Edit account | `/user/account` (form not opened; not confirmed) |
| Logout | `/user/logout` |
| Login / sign-up form for visitors | **Not confirmed** (session was already signed in) |

### 2.7 User flows (derived from the observed pages)
| Flow | Steps (observed or direct from page text) |
|---|---|
| **Browse conference info** | Home → Important Dates / Venue / Organizing Committee / Invited Speakers / Conference Themes |
| **Read the schedule** | Detailed Conference Program → pick a day tab or **List** → open a talk page for its abstract |
| **Download programme** | Conference Programme → PDF links |
| **Prepare to present** | General Information and Presentation Guidelines → download "Presentation Guidelines" and "General Information" files |
| **Register** | Registration → (form not seen) → confirmation notice "Your registration has been saved" → recap; confirmation email template exists (3.5) |
| **Submit an abstract** | Abstract Submission → currently shows a "closed" message with the open period. The form itself is **not confirmed**. |
| **See who is attending** | List of Participants → letter index (A–Z) → names. Access is limited by role (see section 4). |
| **Contact organizers** | Footer "Conference organizer" mailto; "Help" mailto for platform support |

---

## 3. Back office

Entry point: **My Space** (`/myspace`). The left sidebar and the dashboard cards list the same seven modules. A "Retour site" (return to site) button sits in the header band.

### 3.1 Module overview
| Module | Sidebar entry | Sub-pages | Dashboard description (verbatim style) |
|---|---|---|---|
| **Program** | Program ▼ | Appearance, Administration, Rooms | Personalization of the planning; Construction of program; List rooms available |
| **Website** | Website ▼ | General, Header, Appearance, Pages, Homepage, News, Uploads, Statistics | See 3.2 |
| **Reviewing** | Reviewing ▼ | New submissions, Submissions reviewed, Reviewers, Papers | New submissions for reviewing; List of evaluated submissions; Reviewers management; Papers management |
| **Editorial Management** | Editorial Management ▼ | Submissions, Proceedings | Controlboard of submission; Definition of proceedings content |
| **Mailing management** | Mailing management ▼ | Alias, Appearance, Templates, Mailing lists, Mailing, History | Manage email alias content; Personalization of the emails; Management of email models; Create new mailing lists; Sending of emails; Email logs |
| **Registration management** | (single link) | Participants | Dashboard on the subscribers |
| **Administration** | (single link) | Create account | Create a new account |

Admin URL map:

| Page | URL |
|---|---|
| Program > Appearance | `/administrate-website/program` |
| Program > Administration | `/administrate-program` |
| Program > Rooms | `/administrate-conference/room` |
| Website > General / Header / Appearance / Pages / Homepage | `/administrate-website/general`, `/header`, `/skin`, `/menu`, `/homepage` |
| Website > News / Uploads / Statistics | `/news`, `/administrate-website/resource`, `/administrate-website/stats` |
| Reviewing > New submissions / Submissions reviewed | `/review/papers`, `/review/papersreviewed` |
| Reviewing > Reviewers / Papers | `/administrate-review/reviewer`, `/administrate-review/paper` |
| Editorial > Submissions / Proceedings | `/review/controlboard`, `/book` |
| Mailing > Alias / Appearance / Templates / Mailing lists / Mailing / History | `/administrate-mail/alias`, `/skin`, `/administrate-mail`, `/mailinglist`, `/mail/send`, `/administrate-mail/log` |
| Registration management > Participants | `/administrate-user/register` |
| Administration > Create account | `/user/createaccount` |

### 3.2 Website module

| Sub-page | Purpose | Fields / controls observed |
|---|---|---|
| **General** | Interface languages and support block | `LANGUAGES[]` multi-select (French, English, Spanish); `DEFAULT_LANGUAGE`; `CONTACT_EMAIL` (feeds the "Support" block / footer contact) |
| **Header** | Customize the site banner. Three options: quick form, full HTML, or one image | `HEADER_TYPE` = *Header quick form configuration* / *Customize your header in HTML* / *Header picture*; `TITLE_EN`; `STITLE_EN` (subtitle); `LOGO_SRC`; `LOGO_PLACE` (in the header / in the menu / no); `VIEW_DATE` (yes/no); `VIEW_PLACE` (yes/no) |
| **Appearance** | Visual theme | `SKIN_TYPE` = *In one click* (preset themes, 3 radio presets) or *Advanced* (edit style sheet). A `css` upload named `program.css` exists in Uploads |
| **Pages** | Menu and content management | Table "pages / Actions"; buttons **Add page (+)** and **Add a folder (+)**; per page: expand, *Modify*, *Update page content*, *Drop*; each page shows slug, **Page type**, **Right to consult** (roles), **Right to edit** (roles) |
| **Homepage** | Home page blocks | "Add a block of text (+)"; one block present ("Main column (left)" → "Conference Overview") with actions |
| **News** | News feed (shown on a page and in the RSS feed) | "Add a news (+)"; table columns Title, Content, Date, Action |
| **Uploads** | File library | "Add a file (200 Mo max)"; table columns Title, Extension, Size, Actions (view in new tab, find URL, replace, delete); files grouped by folder: `css`, `header`, `pages` (e.g. sponsor logos, theme screenshot) |
| **Statistics** | Analytics | Button to open **Matomo** (installed by default) |

**Add page — available page types (observed in the dropdown):**
Web link · File · Customizable page · Browse by author · Browse by speaker · Browse by type of document · Browse by topic · Search · Gallery · Map · Sponsors · RSS Feed · News.
(Other types seen in the existing menu: *Home*, *page*, *listeparticipants*, *Submission*.)

**Add a folder:** one field, `libelle_en` (folder label in English), used to group pages in the menu.

**Current menu configuration (observed):**

| Menu label | Slug / type | Right to consult | Right to edit |
|---|---|---|---|
| Home | Home | Guest, Member, Webmaster, Reviewer, Coordinator, Participant | not shown |
| Conference Programme | `boa` / page | all 8 roles | Webmaster, Administrator |
| Detailed Conference Program (with Abstracts) | type label shown "Home" | all 8 roles | not shown |
| General Information and Presentation Guidelines | `geninfo` / page | all 8 roles | Webmaster, Administrator |
| Organizing Committee | `organizing_committee` / page | all 8 roles | Webmaster, Administrator |
| Invited Speakers | `invited_speakers` / page | all 8 roles *(partly cut off in capture; not fully confirmed)* | Webmaster, Administrator *(same caveat)* |
| Important Dates | `important_dates` / page | all 8 roles | Webmaster, Administrator |
| Conference Themes | `conference_themes` / page | all 8 roles | Webmaster, Administrator |
| List of Participants | `listeparticipants` | Webmaster, Reviewer, Redactor, Administrator, Coordinator, Participant (**no Guest / Member**) | Administrator |
| Venue | `venue` / page | all 8 roles | Webmaster, Administrator |
| Registration | type label shown "Home" | Guest, Member, Webmaster, Reviewer, Coordinator, Participant | not shown |
| Abstract Submission | Submission | all 8 roles | not shown |

The meaning of the "Home" type label on the Program and Registration entries is **not confirmed** (likely a built-in/preset page).

### 3.3 Program module

**3.3.1 Appearance** (`/administrate-website/program`)
- One setting: `PROGRAM_SHOWPAPERS` (No / Yes) — whether papers are shown in the public program. Save button.

**3.3.2 Rooms** (`/administrate-conference/room`)
- Table: Room's name · Capacity · Description · Actions.
- Add/edit form fields: `LIBELLE` (name), `CAPACITY`, `DESCRIPTION`.
- Record fields seen: `SALLE_ID`, `CONFID`, `LIBELLE`, `CAPACITY`, `DESCRIPTION`.
- Six rooms defined (names include a college campus entry and several auditoria/halls/lounges at the host campus).

**3.3.3 Administration** (`/administrate-program`) — "construct your program (sessions, pauses, etc.)"
- Top action: **CSV Export** (`/administrate-program/export`).
- Layout: one block per conference day (27, 28, 29, 30 Sep 2026), each with **Add an event (+)** and a table: **Time · Type · Event · Actions**.
- Nested rows: talks appear indented ("›") under their session with time slot, title, speaker and affiliation.
- Row actions: **Add a communication** (on sessions), **Edit**, **Delete**.
- **Event editor** (modal). Step 1 is a required select, `EVENT_TYPE_FK`, with: Session, Speech/Intervention, Logistics, Break, Tour. Once chosen it is fixed and the matching fields appear:

| Event type | Fields |
|---|---|
| **Session** | `DATE` (event dates dropdown), `TIME_START`, `TIME_END` (5-minute steps from 07:00), `session_session_fk` (**topic**, 9 values), `session_speaker` (chair/speaker text), `session_salle_fk` (room) |
| **Speech/Intervention** | `DATE`, `TIME_START`, `TIME_END`, `discours_chairman`, `discours_titre_tmx__en` (title, English), `discours_salle_fk` (room), `discours_file` (attachment) |
| **Logistics** | `DATE`, `TIME_START`, `TIME_END`, `logistique_titre_tmx__en`, `logistique_description_tmx__en` (textarea), `logistique_file` |
| **Break** | `DATE`, `TIME_START`, `TIME_END`, `pause_event_pause_type_fk` (break type), `pause_titre_tmx__en`, `pause_salle_fk`, `pause_file` |
| **Tour** | `DATE`, `TIME_START`, `TIME_END`, `sortie_titre_tmx__en`, `sortie_description_tmx__en` (textarea), `sortie_file` |

- Hidden fields: `EVENT_ID`, `EVENT_TYPE_FK`.
- **Topics available for sessions (9):** Science, Technology, Engineering, Architecture · Health Sciences · Education, Arts, Social Science, Social Work · Business, Governance, Law · Hospitality and Tourism · Plenary Session · Special Workshop · Poster Session 1 · Poster Session 2.
- **Add a communication** (modal, per session): shows the session's topic, then `DOCID` (select an existing submission/paper; option text shows title, authors and ID like `sciencesconf.org:mirc2026:<id>`), `TIME_START`, `TIME_END`, `SPEAKER` (text).

### 3.4 Reviewing and Editorial Management modules

**3.4.1 Reviewing**

| Sub-page | Observed behaviour |
|---|---|
| **New submissions** | Reviewer's inbox. Currently: "The review period is closed… No paper to review". The page also has an "Opening period for reviewing" field (value not shown). |
| **Submissions reviewed** | "You can access and modify your submission evaluation during the review period. Once the review period is over, you will no longer be able to modify your evaluation." Currently: "No paper reviewed". |
| **Reviewers** (`/administrate-review/reviewer`) | "Assign the papers to the various reviewers… A reviewer can evaluate all the papers of a topic or just some papers of this topic." Table: **Reviewers · Topics / Submission types · Actions**. Each reviewer row shows name, login and email, and per-topic counters in the form `[N paper(s) / total]`. Controls: **Add a new reviewer (+)** (`addnew` text box: add by typing), **Export CSV**, a note that a reviewer can be added "right t…" (text cut off; not confirmed). |
| **Papers** (`/administrate-review/paper`) | "Consult the papers distribution by reviewers." Filters: *View all papers* / *View papers without reviewers*; **Status** (Initial, Reviewed, Awaiting update); **Submission type** (Poster Presentation, Oral Presentation, Keynote Talk (Strictly for Invited Speakers), Plenary Talk (Strictly for Invited Speakers)); **Topic** (the 9 topics above). Table: paper(s) · Reviewers · Action. |

**Not confirmed:** the reviewer's own scoring/comment form (period closed, no papers).

**3.4.2 Editorial Management > Submissions** (`/review/controlboard`)
- Purpose: "manage submissions… access the paper evaluations, consult comments, request changes from contributors, accept or refuse submissions." A "Search in table" box searches authors, titles or assigned submission numbers.
- **Filters:**
  - Status: Initial · Accepted · Awaiting update · Refused · Reviewed · No review
  - Submission type: Poster Presentation · Oral Presentation · Keynote Talk · Plenary Talk
  - Topic: the 9 topics
- **Table columns:** (checkbox) · Status · Submission · Actions. The *Submission* cell holds: title, author(s), subject line ("abstract : <type>"), topic, and the platform ID (`sciencesconf.org:mirc2026:<id>`).
- **Row actions:** View · Edit submission.
- **Bulk actions** (checkbox rows + `adminAction` select): *initial*, *accepted*, *refused*, *awaiting update*, *Delete*.
- Paging: 100 rows per page ("Showing 1 to 100 of 213 results (filtered from 214 total)").
- **Submission detail view** (opened from *View*):
  - Header: platform ID, title, author list with numbered affiliations, corresponding-author marker, abstract text, **PDF version** link.
  - Editable on this screen: **Submission type** (`typdoc`) and **Topic/session** (`session`).
  - Collapsible sections: opinions of reviewers (e.g. "3/10 Opinions of reviewers" counter), history log (columns Date · Action · User · Comment), and three text areas:
    - `commentMail` — "Email content: content of email asking the contributor to change its submission" (button **Request changes to the contributor**)
    - `commentAnnotate` — "Annotation: only coordinators have access to this annotation in the historical part of the submission" (button **annotated**)
    - `comment` — "Comment, for the contributor, accessible in Mailing management > Templates > Email templates related to the submission by the tag %%PAPER…" (button **Save comment**)
  - Decision buttons: **Accept**, **Refuse**, **Delete**, **Back**.

**3.4.3 Editorial Management > Proceedings** (`/book`)
A 3-step form ("1 Date source · 2 Supplementary data · 3 Display") to build a book of abstracts or proceedings.

| Field | Options |
|---|---|
| `BOOK_EDIT` — Edition | Book of abstracts |
| Gather papers according to criteria? (`BOOK_SORT`) | No (only accepted papers) / Yes |
| Regrouping (`BOOK_SORT_TYPE`) | Group papers by sessions / Group papers per day (definition in the program) |
| `BOOK_THEMATIQUE[]` — Topics list | multi-select of the 9 topics ("only papers present in the selected sets of themes will be present") |
| `BOOK_STATUS[]` — Statuses | Initial · Accepted · Awaiting update · Refused · Reviewed · No review |
| Supplementary data / Display steps | Text mentions predefined pages (index of authors, sorting) and uploading external files; individual fields **not confirmed** |

### 3.5 Mailing management module

| Sub-page | Purpose | Observed |
|---|---|---|
| **Alias** | Manage email alias list for the conference | `aliasSelect` dropdown listing the existing alias (`mirc2026`) and "Create a new alias…" |
| **Appearance** | HTML email look | `MAILSKIN_HEADER` (textarea of HTML table markup), `MAILSKIN_TYPO` (select), `MAILSKIN_FOOTER` (select), **Preview** |
| **Templates** | Reusable email models | Button **Create a template (+)**; table Template · Actions (*Modify*, *Get the original template*, *Delete*). Groups: **Registration** — Registration confirmation, Payment request, Validating the registration. **Submission** — Submission accepted, New submissions, Submission refused, Confirmation of abstract submission to the author, Update needed on following submission. **Customized templates** — one custom template (for plenary speakers and the international advisory committee) |
| **Mailing lists** | Recipient lists | **New list (+)**; table Title · Actions; currently "No mailing list" |
| **Mailing** (`/mail/send`) | Compose and send | Fields: `recipients_list` (grouped), `input_new_recipients` ("Add recipients (+)"), `templates`, `subject`, `content` (rich-text editor), attachments (**Add a file, 200 Mo max**), `corresponding` (Yes/No), `ccadmin` (Yes/No), `notification` (Yes/No). The exact meaning of the three Yes/No options is **not confirmed**. |
| **History** | Log of sent emails | Filter by recipient; table Subject · Recipients · Date · Actions |

**Predefined recipient groups in Mailing (observed):**
- *Rights (users with rights):* Webmaster, Administrative, Reviewer, Redactor, Administrator, Coordinator, Reviewer with at least one non-reviewed paper.
- *Submission (users who submitted a contribution):* Submitted, Initial, Accepted, Awaiting update, Refused, Reviewed, No review — and each status again **per submission type** (Poster Presentation, Oral Presentation, and so on).
- *Register:* group present; its entries were cut off in capture (not confirmed).

Templates can contain tags (one such tag, `%%PAPER…`, was named on the submission screen; the full tag list is **not confirmed**).

### 3.6 Registration management module (`/administrate-user/register`)
- Text: "List of participants to the conference. You can consult the card of a participant, register a person, or export the data."
- Top actions: **Register someone** and **CSV Export**.
- **Register someone** goes to `/user/search?admin&to=registration`: type the first letters of an existing platform user's name, pick from the list, then register that account. ("The user must have an account on the platform Sciencesconf.org.")
- **Filters** (three checkboxes `amount_filter[]`, all ticked by default): the page labels the groups **Preregisters**, **Need a payment**, **Registers**; the mapping of each box to each group is not labelled on the checkboxes themselves.
- **Table columns:** Users (name + email) · Date of registration (timestamp) · Total (registration fees + options, in €) · Actions.
- **Row actions:** See information · Modify the payment information · Send registration confirmation · Edit information (behind a "More actions / Less actions" toggle).
- Count at time of viewing: 253.
- **Not confirmed:** where fee amounts and options are configured (no separate fee-setup page appeared in the menu), and whether any online payment gateway is connected.

### 3.7 Administration module (`/user/createaccount`)
- "The created accounts will be automatically validated. No email will be sent to the email address of the new account."
- Fields (all required): `MAIL` (email), `USERNAME` (login), `PWD` (7–20 alphanumeric characters), `PWD_VERIFY`, `LASTNAME`, `FIRSTNAME`.

### 3.8 Admin workflows (derived from observed controls)

| Workflow | Steps |
|---|---|
| **Change a public page** | Website > Pages → *Update page content* on the row (or *Edit page* link on the public page) → save |
| **Add a new public page** | Website > Pages → Add page (+) → choose page type → name, set Right to consult / Right to edit → place in menu or folder |
| **Build the schedule** | Program > Rooms (define rooms) → Program > Administration → Add an event (+) → pick type → fill date/time/topic/room → on sessions use **Add a communication** to attach accepted papers with time slots |
| **Publish papers in the schedule** | Program > Appearance → `PROGRAM_SHOWPAPERS` = Yes |
| **Process a submission** | Editorial > Submissions → filter by status/type/topic → View → (read reviewer opinions) → Accept / Refuse / Request changes (writes an email) / Annotate / Delete → author is notified via the matching template |
| **Bulk decision** | Editorial > Submissions → tick rows → choose `adminAction` → apply |
| **Assign reviewers** | Reviewing > Reviewers → Add a new reviewer → assign by topic or by individual paper → check coverage in Reviewing > Papers ("papers without reviewers") |
| **Register an attendee manually** | Registration management → Register someone → search account → complete registration → optionally *Send registration confirmation* |
| **Record a payment** | Registration management → row → *Modify the payment information* |
| **Email participants** | Mailing > Mailing → choose predefined group or add recipients → optional template → write subject/content → attach files → send → verify in Mailing > History |
| **Export data** | CSV export on Program, Registration management and Reviewers |
| **Produce book of abstracts** | Editorial > Proceedings → choose criteria, topics, statuses, grouping → generate (generation result not confirmed) |
| **Create a user account manually** | Administration > Create account |

---

## 4. User roles and permissions

### 4.1 Roles named in the platform (observed)
`Guest`, `Member`, `Webmaster`, `Reviewer`, `Redactor`, `Administrator`, `Coordinator`, `Participant`.
(`Administrative` also appears in the mailing recipient list.)

### 4.2 What the pages show about each
The plain-language definitions of Guest, Member and Participant below are **inferred from the role names** (not confirmed on the site). Everything else in the Evidence column is from the Pages module or other screens.

| Role | Evidence |
|---|---|
| **Guest** | Can read pages whose "Right to consult" lists Guest (most pages). Cannot read the Participants list. Probably an anonymous visitor (inferred). |
| **Member** | Same page access as Guest on this site. Probably a signed-in platform user with no conference role (inferred). |
| **Participant** | Can read the Participants list. Probably a registered attendee (inferred). |
| **Reviewer** | Has "New submissions" and "Submissions reviewed" screens. Can read the Participants list. Mailing group "Reviewer" and "Reviewer with at least one non-reviewed paper" exist. |
| **Redactor** | Page-level rights include Redactor on most pages (not on Home or Registration). Exact capabilities **not confirmed**. |
| **Webmaster** | Can edit most content pages (Right to edit: Webmaster, Administrator). |
| **Administrator** | Can edit all content pages including the Participants list page. |
| **Coordinator** | Can read the Participants list. Can see the private submission **annotation** ("only coordinators have access"). |

The sidebar showed all seven back-office modules to the signed-in account. Which single role that account holds is **not confirmed**.

### 4.3 Permission matrix (only what the Pages module shows)
| Capability | Guest | Member | Participant | Reviewer | Redactor | Webmaster | Administrator | Coordinator |
|---|---|---|---|---|---|---|---|---|
| View general content pages | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ |
| View Home, Registration | ✔ | ✔ | ✔ | ✔ | — | ✔ | — | ✔ |
| View Participants list | — | — | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ |
| Edit general content pages | — | — | — | — | — | ✔ | ✔ | — |
| Edit Participants list page | — | — | — | — | — | — | ✔ | — |

(`—` = not listed under that right. `Redactor` and `Administrator` are absent from the Home and Registration consult lists as displayed; this may reflect how the page was configured rather than a deliberate restriction. **Not confirmed.**)
Rights for back-office modules per role (who may see Program, Website, Mailing, etc.) are **not confirmed**; only one account was observed.

---

## 5. Submission types, statuses and topics (shared reference data)

| Reference list | Values observed |
|---|---|
| **Submission types** | Poster Presentation · Oral Presentation · Keynote Talk (Strictly for Invited Speakers) · Plenary Talk (Strictly for Invited Speakers) |
| **Submission statuses** | Initial · Reviewed · Awaiting update · Accepted · Refused · No review |
| **Topics** (also the session labels in the program) | Science, Technology, Engineering, Architecture · Health Sciences · Education, Arts, Social Science, Social Work · Business, Governance, Law · Hospitality and Tourism · Plenary Session · Special Workshop · Poster Session 1 · Poster Session 2 |
| **Program event types** | Session · Speech/Intervention · Logistics · Break · Tour |
| **Page types (menu builder)** | Web link · File · Customizable page · Browse by author · Browse by speaker · Browse by type of document · Browse by topic · Search · Gallery · Map · Sponsors · RSS Feed · News (+ built-in Home, Submission, Participants list, Program, Registration) |
| **Interface languages** | French · English · Spanish |
| **Email template groups** | Registration (3), Submission (5), Custom |

---

## 6. Features checklist (public + back office)

| Area | Feature | Status |
|---|---|---|
| Public | Configurable menu with folders and 13 page types | Observed (menu editor) |
| Public | Per-page read/write role control | Observed |
| Public | Day-by-day program, list view with abstracts, print view | Observed |
| Public | Registration with confirmation recap | Observed (empty form not seen) |
| Public | Abstract submission with open/close period message | Observed (closed; form not seen) |
| Public | Public participant list with A–Z index and count | Observed |
| Public | News + RSS feed | News admin observed; public news page not confirmed |
| Public | Multi-language interface (FR/EN/ES) | Observed (settings) |
| Public | Downloadable PDFs (programme, posters, guidelines) | Observed |
| Back office | Room, event and communication scheduler with CSV export | Observed |
| Back office | Reviewer assignment by topic or paper, coverage view | Observed |
| Back office | Decision workflow (accept / refuse / request changes / annotate) with history log | Observed |
| Back office | Book of abstracts builder | Observed (settings; output not seen) |
| Back office | Email templates, aliases, mailing lists, bulk mailing with attachments, sent-mail history | Observed |
| Back office | Participant dashboard, manual registration, payment info, resend confirmation, CSV export | Observed |
| Back office | File library (200 MB upload limit), Matomo analytics | Observed |
| Back office | Manual account creation (auto-validated, no email) | Observed |
| Back office | Online payment gateway | **Not confirmed** |
| Back office | Reviewer scoring form and criteria | **Not confirmed** |
| Back office | Fee tiers / registration options setup | **Not confirmed** |
| Back office | Badges, invoices, session-chair assignment beyond free text | **Not confirmed** (not seen anywhere) |
| Back office | Certificates (v2) | **Not seen** in the Sciencesconf back office. A "Certificate of Appreciation" design appears in the uploaded images (section 9.1), so the organizers do produce one. Whether the site must generate certificates is **UNRESOLVED** (D8) |

---

## 7. Suggested data model and tech stack for rebuilding

> This section is a **design proposal** built from the fields and flows above. It is not a description of how Sciencesconf is implemented.

### 7.1 Suggested data model

```
conference(id, slug, edition_year, title, subtitle, city, country, start_date, end_date,
           default_language, contact_email, logo_url, header_mode, show_date, show_place,
           submission_open_at, submission_close_at, review_open_at, review_close_at,
           program_show_papers bool)

language(code)                     -- fr, en, es
conference_language(conference_id, language_code)

user(id, email unique, login unique, password_hash, lastname, firstname, middlename,
     title, language, phone, institution, address, country, validated bool)

role(code)                         -- guest, member, participant, reviewer, redactor,
                                   -- webmaster, administrator, coordinator
user_role(user_id, conference_id, role_code)

page(id, conference_id, parent_id null, slug, type, position, is_folder bool,
     title_i18n jsonb, body_i18n jsonb, url null, file_id null)
page_right(page_id, role_code, can_read bool, can_edit bool)

home_block(id, conference_id, column, position, title, body)
news(id, conference_id, title, body, published_at)
resource(id, conference_id, folder, filename, ext, size, path)

topic(id, conference_id, label, position)
submission_type(id, conference_id, label, invite_only bool)
submission_status(code)            -- initial, reviewed, awaiting_update, accepted, refused, no_review

submission(id, public_id "conf:slug:123456", conference_id, title, abstract,
           type_id, topic_id, status, pdf_file_id null, created_at, updated_at,
           corresponding_author_id)
submission_author(submission_id, position, lastname, firstname, email, affiliation, is_corresponding)
submission_event(id, submission_id, at, actor_user_id, action, comment, is_private bool)
submission_message(id, submission_id, kind, body)   -- change-request email, annotation, comment

reviewer_assignment(id, conference_id, reviewer_user_id, topic_id null, submission_id null)
review(id, submission_id, reviewer_id, opinion, comments, submitted_at)  -- fields NOT confirmed

room(id, conference_id, name, capacity, description)

program_event(id, conference_id, type, date, time_start, time_end,
              title_i18n jsonb, description_i18n jsonb, room_id null,
              topic_id null, chair text null, break_type null, file_id null)
program_communication(id, event_id, submission_id, time_start, time_end, speaker text)

registration(id, conference_id, user_id, status, registered_at,
             total_amount_eur numeric, payment_info jsonb, extra jsonb)
registration_option(id, conference_id, label, price)           -- NOT confirmed in source
registration_option_choice(registration_id, option_id)

email_template(id, conference_id, group, name, subject, body, is_custom bool)
email_alias(id, conference_id, address)
mailing_list(id, conference_id, title)
mailing_list_member(list_id, email)
email_skin(conference_id, header_html, typography, footer)
email_log(id, conference_id, subject, recipients, sent_at, body)

certificate(id, conference_id, user_id, kind, recipient_name, issued_at, pdf_file_id null)
                                   -- v2 proposal. Only needed if D8 is answered "yes"
```

Design notes taken from the observed behaviour:
- Keep **topic**, **submission type**, **status**, **event type** as lookup tables or enums, because the back office uses them as filters, mailing groups and book-of-abstracts criteria.
- Give each submission a stable public ID like `conference-slug:<number>` (the original shows `sciencesconf.org:mirc2026:<number>`).
- Store page text per language (JSON column) because titles carry language suffixes (`_en`) in the observed forms.
- The status filter also acts as a **mailing recipient group** and **book criterion**, so one status query service should feed all three.
- Role rights belong on the **page**, not only on the user.

### 7.2 Suggested screens (back office parity)
1. Dashboard of module cards (7 modules).
2. Program builder: day blocks with an event table, a typed event modal, a communication modal, CSV export.
3. Rooms CRUD.
4. Website: settings, header, theme, page tree with rights, homepage blocks, news, uploads, analytics link.
5. Reviewing: reviewer assignment matrix (reviewer × topic/paper), paper coverage view, reviewer inbox.
6. Submission control board: filters, bulk actions, detail view with history and decision buttons.
7. Book of abstracts builder.
8. Mailing: templates, aliases, lists, compose, history.
9. Participants dashboard: filters by payment state, row actions, CSV export, manual registration.
10. Manual account creation.

### 7.3 Suggested tech stack (v1 options; the v2 recommendation in section 12 supersedes this table)

> v2 note: this table lists generic options written before the visual references, scale data and vendor limits were reviewed. It is kept for context. Section 12 gives the actual recommendation and the comparison.

| Layer | Option A (single framework, fastest to build) | Option B (split front/back) |
|---|---|---|
| Web app | Django or Rails (built-in admin, auth, i18n, forms) | Next.js (public site) + separate API |
| Database | PostgreSQL (JSONB for per-language text) | PostgreSQL |
| Auth / roles | Framework auth + role table above | NextAuth / Auth.js + same role table |
| File storage | S3-compatible bucket (200 MB upload limit like the original) | Same |
| Rich text | TinyMCE or Tiptap (the original uses a WYSIWYG for page text, email body and comments) | Same |
| Email | SMTP / transactional email provider, HTML template skin, delivery log | Same |
| Background jobs | Celery / Sidekiq (bulk mail, book-of-abstracts PDF, CSV exports) | BullMQ |
| PDF generation | WeasyPrint / headless Chromium for book of abstracts and print program | Same |
| Analytics | Matomo (as in the original) | Same |
| Payments | Stripe or a local gateway **only if required** (the original's payment mechanism is not confirmed) | Same |
| Hosting | Single VPS or PaaS plus managed Postgres | Vercel + managed DB |

Recommended order of work: (1) users, roles, pages with rights; (2) topics, submission types, submissions and the decision workflow; (3) rooms, program builder, public program with day tabs and list; (4) registration and participants dashboard; (5) mailing and templates; (6) reviewing assignments; (7) book of abstracts. (v2: the phased roadmap in section 16 refines this order and adds a public-information-site phase first.)

---

## 8. Open items (not confirmed — verify before relying on them)
1. Empty registration form, fee options, payment gateway and payment states.
2. Abstract submission form fields and file rules.
3. Reviewer scoring form and the "opinions" content structure.
4. Edit-account form fields (`/user/account`) and the sign-in/sign-up pages for visitors.
5. Roles → back-office module access mapping.
6. Meaning of the Mailing `corresponding`, `ccadmin`, `notification` options and the full list of email tags.
7. Why `/user/submissions` returned "page not found" for this account.
8. Reason for 240 public names vs 253 registrations.
9. Public News page and RSS output; Gallery, Map and Sponsors page types (listed as options, none currently in the menu).
10. Contents of the *Supplementary data* and *Display* steps in the Proceedings builder, and the generated output.

(v2: planning-level assumptions, decisions and risks are collected in section 17.)

---

## 9. Visual design system (v2)

Source: four uploaded images. Everything in this section is either read from those images or labeled as a recommendation. No color, font or visual rule has been added that the images do not support. Where the images give no evidence, the item is marked **UNRESOLVED**.

### 9.1 The reference images

| Image | Size (px) | What it shows | Used for |
|---|---|---|---|
| #2 | 685 × 481 | "Certificate of Appreciation" for a keynote speaker. Bright green upper area fading to white over a faded photo of the host building. Gold display type, a white name band, a six-logo row, a badge reading "2026 MIRC / Shaping Resilient Futures", one signatory line | Certificate layout, bright green, name-band pattern, badge |
| #3 | 886 × 499 | Title slide. Near-white background with hexagon outlines at the sides over a faded building photo. Gold title, green tagline, six-logo row, sponsor row, dark date line. A green stripe above a navy bar at the bottom | Hero layout, flat brand colors (green stripe, navy bar), text colors |
| #4 | 886 × 499 | The same title slide in a warm cream/gold colorway. Building photo more visible, no bottom bars | Warm background variant |
| #5 | 886 × 496 | "Opening Remarks" speaker card. A green banner with white host name at top left, circular photo with a thin gold ring, gold name, green role text, a cream line above a deep green bar at the bottom | Banner, photo frame, deep green bar, green role text |

### 9.2 How the colors were measured
- Pixels were read directly from the image files with Python and Pillow. Colors were not guessed by eye.
- **EXACT**: a flat fill (text or bar) whose identical RGB value appears in thousands of pixels, or across a full band of rows. The value is reliable. Checked against more than one image where the element repeats.
- **ESTIMATE**: gradients (the gold lettering), photo overlays, faint textures and thin anti-aliased lines. The value is a representative sample, not the designer's original.
- Partner and sponsor logos carry their own colors. They are **not** part of the palette and must be shown unaltered.

### 9.3 Color palette

| Token | HEX | Precision | Seen in | How it appears in the images |
|---|---|---|---|---|
| `slate-green` | `#2F4F4F` | EXACT | #2, #3, #4 | Recipient name, body paragraphs, signatory text, date and venue line |
| `forest` | `#296334` | EXACT | #2, #3, #4 | Tagline "Shaping Resilient Futures", its second line, the badge sub-line |
| `leaf` | `#297D1F` | EXACT | #3 | Thin stripe above the bottom bar |
| `navy` | `#011030` | EXACT | #3 | Bottom bar |
| `deep-green` | `#0F3416` | EXACT | #5 | Bottom bar |
| `white` | `#FFFFFF` | EXACT | #5 | Host name text on the green banner |
| `gold-100` | `#FCE77A` | ESTIMATE | #2–#5 | Highlight of the gold gradient (the brightest gold pixels of the lettering) |
| `gold-300` | `#E1CA5E` | ESTIMATE | #2–#5 | Light tone of the gold gradient |
| `gold-500` | `#C6AE43` | ESTIMATE | #2–#5 | Median tone of the gold gradient |
| `gold-700` | `#957A14` | ESTIMATE | #2–#5 | Darkest tone (shadow) of the gold gradient |
| `fresh-green` | `#4DAB3A` | ESTIMATE | #2 | Top of the certificate. A gradient over a photo (samples ran from `#4DAB3A` to `#8BC87E`) |
| `hex-line` | `#77AA6F` | ESTIMATE | #3 | Thin hexagon outlines at the edges (a darker sample was `#659A5C`) |
| `mist` | `#F8FBF7` | ESTIMATE | #3 | Near-white page area with a faint texture (samples ranged from about `#EFEFEE` to `#FCFBFA`) |
| `cream` | `#FCFBF7` | ESTIMATE | #4, #5 | Warm near-white page area |
| `tint-green` | `#E8F1E6` | ESTIMATE, low confidence | #2 | Very pale green at the certificate's left edge (a single sample over a photo) |

Not adopted as tokens: the pale cream line above the bottom bar in #5 (about `#F3EDBB`, one thin anti-aliased line) and the bright-to-lime gradient on the green role text in #5 (samples `#257F21` to `#77A025`). The darker end of that gradient is within a few units of `leaf`, so `leaf` covers it.

**Gold gradient (ESTIMATE).** Measured across the "2026 MIRC" title in #3, the gold is darker at the outer edges and lighter in the middle: column bands averaged `#B19730`, `#DCC55B`, `#E5CF65`, `#B29931` from left to right. Vertical variation was small. A starting point:

```css
background: linear-gradient(90deg, #b19730 0%, #dcc55b 33%, #e5cf65 66%, #b29931 100%);
```

**If the organizers hold an official brand guide, its values replace every ESTIMATE above.** (D6)

### 9.4 Recommended role of each color

The images show where colors are used. The role names below are a **RECOMMENDATION** that assigns those colors to website roles.

| Role | Color | Reasoning |
|---|---|---|
| Primary | `forest` | The strongest colored text in the images, and the color the images use for emphasis lines. Good contrast with white both ways |
| Secondary / neutral dark | `slate-green` | The images use it for all body-level text |
| Accent | `gold-*` family | The images use gold only for display titles, rules and the badge number |
| Brand stripe | `leaf` | Used once, as the thin stripe above the footer bar in #3 |
| Page background | `mist` (or `cream` for the warm variant) | Both images use near-white pages |
| Surface (cards, forms) | `white` | RECOMMENDATION only. The images contain no card surfaces |
| Deep surface (header, footer, hero overlay) | `navy` or `deep-green` | Both appear as bottom bars. Which one the site uses is UNRESOLVED (D6) |
| Text on light | `slate-green`, with `forest` for headings and links | Matches the images |
| Text on dark | `white`, `tint-green` | Contrast values in 9.5 |
| Border, essential (input fields, focus) | `slate-green` for fields, `navy` for focus rings | Needed so form controls meet the 3:1 non-text contrast rule. Both are palette colors |
| Border, decorative | `gold-300` rule, `hex-line` | The images use thin gold rules and thin green hexagon lines |
| Success | `leaf` | RECOMMENDATION. Green is in the images |
| Warning | `gold-700` | RECOMMENDATION. Gold is in the images |
| Error | **none in the images** | UNRESOLVED (D6). Must pass 4.5:1 on white |
| Info | **none in the images** | UNRESOLVED (D6). Must pass 4.5:1 on white |

Status colors must never be the only signal. Pair each with an icon and text.

### 9.5 Contrast checks

Computed on 2026-10-09 with the WCAG 2.x relative-luminance formula. Pass levels used: 4.5:1 for normal text; 3:1 for large text and for interface-component boundaries. ESTIMATE colors should be re-checked once the brand values are final.

| Foreground on background | Ratio | Result |
|---|---|---|
| `slate-green` on `white` | 8.93 | Pass, all text sizes |
| `slate-green` on `mist` | 8.56 | Pass |
| `slate-green` on `tint-green` | 7.72 | Pass |
| `forest` on `white` | 7.17 | Pass |
| `forest` on `mist` | 6.87 | Pass |
| `white` on `forest` | 7.17 | Pass |
| `white` on `leaf` | 5.19 | Pass |
| `leaf` on `white` | 5.19 | Pass |
| `white` on `deep-green` | 13.79 | Pass |
| `white` on `navy` | 18.78 | Pass |
| `white` on `slate-green` | 8.93 | Pass |
| `gold-500` on `white` | 2.20 | **Fail.** Do not use for text on light backgrounds |
| `gold-700` on `white` | 4.14 | Large text and components only |
| `gold-700` on `mist` | 3.97 | Large text and components only |
| `gold-500` on `navy` | 8.53 | Pass |
| `gold-300` on `navy` | 11.46 | Pass |
| `gold-100` on `navy` | 15.07 | Pass |
| `gold-500` on `deep-green` | 6.26 | Pass |
| `gold-300` on `deep-green` | 8.41 | Pass |
| `navy` on `gold-500` | 8.53 | Pass (dark text on a gold button) |
| `fresh-green` on `white`, or `white` on `fresh-green` | 2.92 | **Fail.** Decorative backgrounds only, no text |
| `hex-line` on `white` | 2.70 | **Fail** for essential UI. Decorative only |
| `tint-green` on `navy` | 16.24 | Pass |
| `mist` on `navy` | 18.01 | Pass |
| `forest` on `navy` | 2.62 | **Fail.** Never use as text on dark surfaces |
| `slate-green` on `navy` | 2.10 | **Fail.** Never use as text on dark surfaces |
| `leaf` on `navy` | 3.62 | Large text and components only |

What the images already do: key facts (tagline, dates, venue) are set in `forest` or `slate-green`, and gold carries only the large display title. The website should keep that split. Gold display type on a light background is acceptable for a large decorative headline when the same information also appears in dark text nearby.

### 9.6 Using the palette across components (RECOMMENDATION)

| Component | Guidance | Tokens |
|---|---|---|
| Page background | Light pages in `mist`. Optional `hex-line` hexagon motif and a faded host-building photo behind the hero only | `mist`, `hex-line` |
| Header / main navigation | Solid dark bar with white text, or white bar with `forest` text. The images show a green banner with white host name (#5), so a green bar is supported. Active item shown with a gold underline plus bold text, not color alone | `deep-green` or `forest`, `white`, `gold-300` |
| Hero | Display title in the gold gradient, tagline in `forest`, dates and venue in `slate-green`, partner logo row above, sponsor row below. Use real text, not the baked-in text of the slide images | gold gradient, `forest`, `slate-green` |
| Headings | `forest` for h1–h3. Gold gradient only for the single hero title | `forest` |
| Body text | `slate-green` on `mist` or `white` | `slate-green` |
| Links | `forest`, underlined. Hover and visited states darken to `deep-green`, still underlined | `forest`, `deep-green` |
| Primary button | Fill `forest`, text `white`. Hover fill `deep-green` | `forest`, `white`, `deep-green` |
| Secondary button | 2 px `forest` outline, `forest` text on `white` | `forest` |
| Accent button (for example "Register") | Fill `gold-500`, text `navy` | `gold-500`, `navy` |
| Cards | `white` surface on `mist` page, 1 px `tint-green` border, `slate-green` text | `white`, `tint-green` |
| Program table | Day tabs in `forest`; session rows on `white`; a thin `gold-300` rule between time blocks; room and time in `slate-green` | `forest`, `gold-300` |
| Forms | Labels `slate-green`; field border `slate-green` (passes 3:1); focus ring 3 px `navy` with 2 px offset; helper text `slate-green` | `slate-green`, `navy` |
| Status and alerts | Icon + text + left border. Success `leaf`, warning `gold-700`. Error and info pending D6 | `leaf`, `gold-700` |
| Badges / chips (status, submission type) | Pale `tint-green` fill with `forest` text; accepted = `leaf` fill with white text | `tint-green`, `forest`, `leaf` |
| Footer | Solid `navy` or `deep-green`, `white` text, `gold-300` links, `leaf` stripe above (as in #3) | `navy`, `leaf`, `gold-300` |
| Certificates (if built) | Follow image #2: green-to-white upper area, white name band with `slate-green` name, gold display lines, badge, signatory block | as image #2 |

### 9.7 Visual motifs and type traits seen in the images (CONFIRMED by the images)

- Hexagon outline pattern, strongest at the corners and side edges of #2 and #3, very faint in #4 and #5.
- A faded, desaturated photo of the host building as a background wash behind a near-white overlay.
- A row of six circular partner logos near the top of #2–#4. A row of sponsor logos (roughly three to four marks) near the bottom of #3 and #4. Image #5 instead shows a single host seal in its banner.
- Thin horizontal gold rules above and below name and title bands.
- A circular portrait frame with a thin gold ring (#5).
- A small badge "2026 MIRC / Shaping Resilient Futures" (#2, #5).
- Bottom bars: green stripe plus navy bar (#3); cream line plus deep green bar (#5).
- Type: heavy, uppercase, sans-serif display lettering for titles; semi-bold uppercase green lines for emphasis; lighter-weight uppercase for the sub-tagline. **The font family could not be identified from the images. UNRESOLVED (D6).**

### 9.8 Light and dark mode

- **Confirmed:** the images show light backgrounds only. Dark appears only as footer bars.
- **Recommendation:** ship **light mode only**. Dark mode is not a stated requirement, so building it now adds cost without a confirmed benefit.
- **If dark mode is added later:** page `navy`, cards `deep-green`, text `mist` or `tint-green`, links and accents `gold-300`, accent button `gold-500` with `navy` text. Do not use `forest` or `slate-green` as text on those surfaces (see 9.5).

### 9.9 Design tokens as code (RECOMMENDATION, for Tailwind CSS v4)

Tailwind v4 defines color tokens in CSS with an `@theme` block, which also generates the utility classes (verified against the Tailwind v4 docs, 2026-10-09).

```css
@import "tailwindcss";

@theme {
  /* EXACT: sampled flat fills */
  --color-slate-green: #2f4f4f;
  --color-forest: #296334;
  --color-leaf: #297d1f;
  --color-navy: #011030;
  --color-deep-green: #0f3416;

  /* ESTIMATE: replace with brand-guide values if they exist */
  --color-gold-100: #fce77a;
  --color-gold-300: #e1ca5e;
  --color-gold-500: #c6ae43;
  --color-gold-700: #957a14;
  --color-fresh-green: #4dab3a;
  --color-hex-line: #77aa6f;
  --color-mist: #f8fbf7;
  --color-cream: #fcfbf7;
  --color-tint-green: #e8f1e6;
}
```

---

## 10. Information architecture and page structure (v2)

### 10.1 Public sitemap

"Observed" pages come from the live site (section 2.2). Routes are a **RECOMMENDATION** for the rebuild. "Phase" refers to section 16.

| Page | Proposed route | Purpose | Who can open it | Basis | Phase |
|---|---|---|---|---|---|
| Home | `/` | Identity, dates, venue, overview, partners, sponsors, calls to action | Everyone | Observed | 2 |
| Conference programme (downloads) | `/programme` | Programme and poster PDFs | Everyone | Observed | 2 |
| Detailed program | `/program` and `/program/[date]` | Day tabs and a full list with abstracts, printable | Everyone | Observed | 2 (read-only), 6 (editable) |
| Talk detail | `/talks/[id]` | One communication with its abstract | Everyone | Observed (each talk links to its own page) | 4 |
| Guidelines | `/guidelines` | Presentation rules, time limits, poster size | Everyone | Observed | 2 |
| Organizing committee | `/committee` | Committee roles and names | Everyone | Observed | 2 |
| Invited speakers | `/speakers` | Plenary, keynote and special-session speakers with talk titles | Everyone | Observed | 2 |
| Important dates | `/dates` | Deadlines and event dates | Everyone | Observed | 2 |
| Conference themes | `/themes` | The topic list | Everyone | Observed (the v1 page was an image). Rebuild as real text | 2 |
| List of participants | `/participants` | A–Z list | Signed-in roles only (see 4.3) | Observed | 3 |
| Venue | `/venue` | Address, host description, website link | Everyone | Observed | 2 |
| Registration | `/register` | Register, or view the saved registration | Everyone sees it. Saving needs an account | Observed | 3 |
| Abstract submission | `/submit` | Open/closed state, then the form | Everyone sees the state. Submitting needs an account | Observed (closed at the time) | 4 |
| News | `/news` | News items and RSS | Everyone | Observed in the admin only. Public page not confirmed | 2 (optional) |
| Sign in / create account / reset password | `/login`, `/signup`, `/reset` | Accounts | Everyone | Needed by the account links seen in the admin bar. Form not seen | 3 |
| My registration, My submissions, Edit account | `/account/registration`, `/account/submissions`, `/account` | Personal pages | Signed-in users | Observed as links in the user menu | 3–4 |
| Legal, privacy, accessibility statement | `/legal`, `/privacy`, `/accessibility` | Required notices | Everyone | Observed as footer links on the live site | 2 |

### 10.2 Navigation

- The live site shows a flat menu of 12 items. That is long for a phone. **RECOMMENDATION:** group them as Programme (programme, detailed program, guidelines), About (committee, speakers, dates, themes, venue, participants), then Register and Submit as two always-visible buttons. UNRESOLVED if the organizers prefer the flat menu (D7).
- Always show state-aware buttons: "Submit abstract" shows the open period, or "Closed" with the close date. "Register" shows the deadline.
- A breadcrumb (home icon > current page) matches the live site.
- Footer: organizer contact, legal, privacy, accessibility statement, partner and sponsor logos, RSS if news is built.

### 10.3 Page structure (top to bottom)

| Page | Sections in order |
|---|---|
| Home | Hero (partner logo row, title, tagline, dates and venue, two buttons) → key dates strip → conference overview text → format and venues → partners → sponsors → latest news |
| Detailed program | Day tabs + "List" tab → per day: time-ordered events (session, speech, logistics, break, tour) → sessions expand to talks with speaker, room, abstract → print button |
| Invited speakers | Group headings (Plenary, Keynote, Special Session) → entries: name, affiliation, country, talk title |
| Registration | Status banner (saved or not) → personal data form → complementary information → confirmation recap |
| Abstract submission | Period banner → eligibility and file rules → form (title, authors with affiliations, abstract, type, topic, file) → confirmation |
| Participants | Letter index → names under each letter → total count |
| Guidelines | Downloads at top → numbered rules (format, time limits, recorded backup, poster specs, virtual presenting) |

### 10.4 Admin information architecture

The seven modules in section 3 become one admin area with a left sidebar, as on the live site. Proposed routes: `/admin/program`, `/admin/website`, `/admin/reviewing`, `/admin/editorial`, `/admin/mailing`, `/admin/registrations`, `/admin/accounts`. Each keeps the sub-pages listed in 3.1. Access follows section 4.

---

## 11. User interface, responsiveness and accessibility (v2)

### 11.1 Responsive design (RECOMMENDATION)

| Area | Rule |
|---|---|
| Approach | Mobile first. One layout that adapts, not separate sites |
| Test viewports | 360 × 640 and 390 × 844 (phones), 768 × 1024 (tablet portrait), 1024 × 768 (tablet landscape), 1440 × 900 (desktop) |
| Navigation | Collapses to a menu button below the tablet width. Register and Submit stay visible |
| Hero | Live text over a background image. The slide images have their text baked in as pixels, which cannot reflow, be read by screen readers or be indexed |
| Program | Day tabs scroll sideways on a phone. Event rows stack: time, title, room |
| Tables (participants, admin) | Stack into cards on a phone, or scroll sideways with a fixed first column. Never shrink the text below readable size |
| Forms | Single column on a phone. Inputs at least 44 px tall |
| Images | Responsive sizes. Hero photo compressed. Logos as SVG or small PNG with width/height set to avoid layout shift |
| Orientation and zoom | Works in both orientations and at 200% text zoom without horizontal scrolling |

### 11.2 Accessibility (RECOMMENDATION)

**Target: WCAG 2.2 level AA.** The live Sciencesconf footer states "Accessibility: non-compliant" (observed), so the rebuild has room to do better.

| Requirement | How |
|---|---|
| Color contrast (1.4.3, 1.4.11) | Use only the passing pairs in 9.5. Check with a script (section 14) |
| Not color alone (1.4.1) | Status, active tab and links carry an icon, underline or text label as well |
| Keyboard (2.1.1, 2.4.7) | Every control reachable and operable by keyboard. Visible 3 px `navy` focus ring |
| Focus not hidden (2.4.11) | Sticky header must not cover a focused element |
| Target size (2.5.8) | At least 24 × 24 px. Use 44 px for main buttons |
| Structure | One `h1` per page, ordered headings, landmarks (`header`, `nav`, `main`, `footer`), "skip to content" link |
| Program day tabs | Use the standard tab pattern with arrow-key support, or use plain links per day (simpler and works without scripts) |
| Forms | Visible labels, required fields marked in text, errors announced and linked to the field, no placeholder-only labels |
| Language | `lang` attribute on the page and on any text in another language |
| Images | Alt text for the building photo (decorative, empty alt), each partner logo (organization name), speaker photos (name) |
| Gold gradient text | Real text with a solid fallback color. Not an image |
| Motion | No auto-playing motion. Respect "reduce motion" |
| Files | PDF downloads state their size and format. Offer the same information as page text where practical |
| Time limits | Registration and submission forms do not time out silently |

---

## 12. Technology stack recommendation (v2)

All items are **RECOMMENDATION** unless marked otherwise. Vendor facts were read from official pages on 2026-10-09 (links in section 18). Prices and limits change, so re-check them before paying for anything.

### 12.1 Requirements that drive the choice

| Requirement | Source | What it means for the stack |
|---|---|---|
| Mostly content pages that should be found by search engines and load fast | Section 2 | Server-rendered or static pages |
| Accounts and eight roles with per-page rights | Sections 3.2, 4 | Real authentication, plus a role table and server-side permission checks |
| Related data: submissions, authors, reviews, events, rooms, registrations | Sections 3, 7.1 | A relational database |
| PDF uploads (posters up to 10 MB per the guidelines; an admin file library with a 200 MB limit on the live site) | Sections 2.4, 3.2 | Object storage, with uploads sent straight from the browser |
| Templated and bulk email, with a log | Section 3.5 | A transactional email service and a log table |
| CSV exports, book of abstracts, possibly certificates | Sections 3.3–3.6, 9.6 | Server-side file generation |
| Small scale: 253 registrations, 214 submissions | Section 1.3 | No need for clusters, queues or microservices |
| Zoom links on a secured page (no video hosting) | Section 2.4 | A role-protected page. No streaming infrastructure |
| Web statistics (Matomo on the live site) | Section 3.2 | Any analytics tool |

### 12.2 Recommended stack

| Layer | Choice | Why it fits | Role in the project |
|---|---|---|---|
| Language | TypeScript | One language for pages, server code and database types | Everywhere |
| Web framework | **Next.js** (App Router) | Server-rendered pages for search engines. Server actions and route handlers give a backend in the same repository, so there is one thing to deploy. The Next.js docs list Node.js server, Docker and static export as supported targets. A Node.js server or Docker deployment supports all features | Public site, account pages, admin UI, small API endpoints |
| Styling | **Tailwind CSS v4** with the tokens in 9.9 | CSS-first `@theme` tokens turn the palette into utilities, and the palette stays in one file | All UI |
| Accessible UI parts | Radix primitives (for example through shadcn/ui), only where needed | Tested dialog, menu and tab behavior. Optional | Dialogs, dropdowns, tab bars |
| Database | **PostgreSQL on Supabase** | Relational fit for section 7.1. Row Level Security enforces roles inside the database | All data |
| Authentication | **Supabase Auth** | Sign-up, sign-in, email verification, password reset, without writing them. Roles live in a `user_role` table (section 7.1) | Accounts, role checks |
| File storage | **Supabase Storage**, private bucket for submissions and posters, public bucket for page images | Same vendor and same access rules as the database. Browser uploads go straight to storage by signed URL | Abstract files, poster PDFs, uploads library |
| Validation | Zod | One schema checks form input in the browser and on the server | Every form |
| Email | **Resend** | Simple API. Templates are stored in the database so organizers can edit them, as on the live site | Confirmations, decisions, bulk mailing |
| PDF generation | `@react-pdf/renderer`, or HTML to PDF | Certificates and the book of abstracts. **Prototype first.** Host time and memory limits were not verified | Phase 6 |
| Hosting | **Vercel** (see 12.5 for the plan question) | Vercel is a verified Next.js adapter, so features work as documented | Production, preview deployments |
| Source and CI | GitHub, GitHub Actions | Pull requests, checks before merge | Version control and testing |
| Tests | Vitest, Playwright, `@axe-core/playwright`, Lighthouse CI | Unit, browser, accessibility and performance checks (section 14) | CI |
| Error tracking | Sentry | Free tier exists. Limits not verified | Production |
| Web analytics | Vercel Web Analytics, or Matomo as on the live site | Either works. Choice depends on cookie policy (D10) | Production |
| Database monitoring | Supabase logs and its security/performance advisors | Built into the same product | Production |
| Uptime | Any external ping monitor | Alerts when the site is down | Production |

### 12.3 Alternatives and trade-offs

**Hosting**

| Option | Strengths | Weaknesses or risks | Choose it when |
|---|---|---|---|
| **Vercel Pro** (recommended for production) | Verified Next.js adapter. Preview deployments. Runtime logs kept 1 day (Hobby: 1 hour) | $20 per developer seat per month. Viewer seats are free | The site takes registrations or sponsor-linked content, or Hobby's terms do not fit |
| Vercel Hobby | Free. 100 GB fast data transfer and 1,000,000 function invocations included | Vercel's docs say Hobby is restricted to **non-commercial, personal use only**. Whether a university conference with sponsors and possibly fees qualifies is **not decided here** | Development and demo only, unless Vercel confirms eligibility |
| Cloudflare Workers | Free plan: 100,000 requests per day. Good for a static phase 1 | Free plan CPU limit is 10 ms per request, which may be tight for server-rendered pages. Next.js runs through "vinext", which the docs mark as beta, with the OpenNext adapter as the alternative. Cloudflare's Next.js support is not one of the "verified adapters" | Phase 1 only (static pages), or after testing the full app there |
| Netlify | Offers its own Next.js integration | Not a "verified adapter" per the Next.js docs. Pricing not checked | You already use it |
| Self-hosted Node or Docker (VPS or a platform such as Railway, Fly.io, Render, DigitalOcean) | Supports all Next.js features per the docs. Cost can be low | You maintain updates, TLS, backups and monitoring. Prices not checked | Someone on the team will run servers |

**Data and authentication**

| Option | Strengths | Weaknesses or risks | Choose it when |
|---|---|---|---|
| **Supabase** (recommended) | Database, auth and storage in one place. Row Level Security | The Free plan pauses a project after 1 week of inactivity and has no backups (12.5). Production needs Pro | Default |
| Your own PostgreSQL plus Auth.js | Fewer vendor limits | You build email verification, password reset and file storage yourself. Prices not checked | The team insists on no vendor lock-in |
| Keep Sciencesconf for registration, submission and review; build only the public site | Least work. Sciencesconf is already running | Two systems, two logins, visuals only partly unified | D2 is answered "complement" |

**Framework**

| Option | Strengths | Weaknesses or risks | Choose it when |
|---|---|---|---|
| **Next.js** (recommended) | One codebase for public site and admin. Large ecosystem | You must write the admin screens yourself (about nine, section 3) | The team knows JavaScript or TypeScript |
| Astro (content-first) | Very light static pages | A second framework is needed once accounts and the admin are added | Phase 1 will stand alone for a long time |
| Django or Rails | Built-in admin, auth, forms and email speed up the admin screens | A different language and a separate front-end approach | The team knows Python or Ruby better than TypeScript |

### 12.4 How the pieces work together

```
Developer ──git push──► GitHub pull request
                          ├─► GitHub Actions: lint, type check, unit, browser, accessibility, Lighthouse
                          └─► Vercel preview deployment ──► Supabase staging project
merge to main ──► Vercel production deployment ──► Supabase production project

Visitor ──► Next.js pages (static or server-rendered)
            └─► server actions / route handlers ──► Supabase Postgres (RLS), Auth, Storage
                                                 ├─► Resend (email) ──► email_log table
                                                 └─► Sentry, analytics
```

1. **Develop:** run Next.js locally against a Supabase development project (or the Supabase local stack). Tokens from 9.9 live in one CSS file.
2. **Test:** every pull request runs the checks in section 14 and gets its own preview URL pointing at the staging database.
3. **Deploy:** merging to `main` deploys production. Database migrations (SQL files in the repo) are applied to staging first, then production.
4. **Maintain:** content changes go through the admin screens. Developers only handle code, dependency updates and the yearly edition rollover (section 15.5).

### 12.5 Verified cost and limit facts (read 2026-10-09)

| Service | Facts as shown on the vendor page | What it means here |
|---|---|---|
| **Vercel Hobby** | Free. "Non-commercial, personal use only". 100 GB Fast Data Transfer, 1,000,000 function invocations, 100 deployments per day, function maximum duration 300 s, runtime logs 1 hour, Web Analytics 50,000 events per month | Enough for development. The terms question (D4) decides whether it can host production |
| **Vercel Pro** | Developer seats $20 per user per month. 6,000 deployments per day. Runtime logs 1 day | Likely production plan |
| **Supabase Free** | 500 MB database, 1 GB file storage, 50,000 monthly active users, 5 GB egress, 50 MB max upload, **paused after 1 week of inactivity**, **no backups** | Fine for development and staging. Not for production registrations |
| **Supabase Pro** | From $25 per month. 8 GB disk, 100 GB storage, 100,000 monthly active users, 250 GB egress, never paused for inactivity, daily backups kept 7 days | Likely production plan |
| **Resend** | Free: 3,000 emails per month, 100 per day, 3 custom domains. Pro: $20 per month for 50,000 emails per month | 253 registrants is more than one day's free allowance of 100. Bulk mail must be spread over days or use the paid tier |
| **Cloudflare Workers Free** | 100,000 requests per day, 10 ms CPU per HTTP request, 50 subrequests per request | See hosting table |
| **Next.js docs** | Docs page shows version 16.4.0 (updated 2026-08-06). Node.js server and Docker support all features. Static export is limited. Verified adapters: Vercel and Bun | Pin the major version in `package.json` |
| **Tailwind CSS docs** | Documentation covers v4 (selector shows 4.3). Tokens go in `@theme` | Section 9.9 matches |

Arithmetic from the list prices above (not a quote):
- **Production run-rate while live:** Vercel Pro with one developer seat ($20) + Supabase Pro ($25) = **about $45 per month**, before tax and usage above the included amounts. Email stays at $0 if volume fits the free tier.
- **Storage headroom:** the Free storage of 1 GB divided by 214 submissions is about 4.8 MB per submission. Posters can be up to 10 MB each, so storage could be tight on Free. Pro's 100 GB is ample.
- **Idle months:** whether Pro can be downgraded between editions without losing data was **not verified**. Check before relying on it.

---

## 13. Security, privacy and performance (v2)

### 13.1 Security (RECOMMENDATION)

| Area | Control |
|---|---|
| Authorization | Check the user's role on the server for every action, and enforce it again in the database with Row Level Security. Hiding a button is not protection. The per-page read/edit rights in 3.2 become rows in a `page_right` table |
| Sign-in | Email verification and password reset through the auth provider. Rate-limit sign-in and sign-up |
| Admin-created accounts | The live site validates them automatically and sends no email (observed). In the rebuild, require a password reset on first sign-in |
| Secrets | Service keys stay on the server. Next.js exposes only variables prefixed `NEXT_PUBLIC_` to the browser, so never put a secret in one of those |
| File uploads | Accept only the allowed types (PDF at minimum). Enforce size limits (posters 10 MB per the guidelines; the abstract file limit is UNRESOLVED). Store in a private bucket. Hand out short-lived signed URLs. Upload straight from the browser to storage |
| Input and output | Validate every input with a schema. Sanitize any HTML an admin or author can write (page text, email bodies, abstracts) before showing it |
| Email | Set SPF, DKIM and DMARC on the sender domain. Log every message (as the live site's History page does) |
| Abuse control | Rate-limit registration, submission and mail-sending. Decide whether a bot check is needed (D10) |
| Audit trail | Keep a history of submission actions (the live site has one) and extend it to admin changes: who, what, when |
| Backups | Production on a plan with backups (Supabase Pro keeps daily backups for 7 days). Practice one restore before launch. Also export CSV snapshots of registrations and submissions |
| Dependencies | Commit the lockfile. Enable automated dependency-update pull requests. Run a dependency audit in CI |
| Transport and headers | HTTPS only. Set standard security headers and check them with a scanner before launch |

### 13.2 Privacy

- The live site shows the participant list only to signed-in roles (Participant, Reviewer, Redactor, Webmaster, Administrator, Coordinator), not to Guests or Members. **Keep that rule** (CONFIRMED on the live site).
- Show names only. Do not show emails or phone numbers publicly.
- Whether registrants consent to being listed is UNRESOLVED (D11).
- Philippine data protection law (the Data Privacy Act of 2012) may apply to registrant data. **Not verified here.** Confirm with the organizers' legal or data-protection contact before collecting data (D11).
- Retention period for registrations, submissions and reviews is UNRESOLVED (D11).
- Decide the analytics and cookie approach early, because it determines whether a consent banner is needed (D10).

### 13.3 Performance (RECOMMENDATION)

| Target | Value |
|---|---|
| Largest Contentful Paint | at most 2.5 s on a mid-range phone, 75th percentile |
| Interaction to Next Paint | at most 200 ms |
| Cumulative Layout Shift | at most 0.1 |

These are the published "good" thresholds for Core Web Vitals.

Tactics: statically generate public pages and refresh them when an admin saves; compress the hero photo and serve modern formats at the right size; set image dimensions; subset and self-host fonts; load only what each page needs; keep the program list server-rendered (the v1 observation found the full list view was only about 47,000 characters of text); cache read-heavy queries; add database indexes on the filter fields used by the admin tables (status, type, topic).

Load scenarios to test before launch: registration deadline day (many sign-ups and uploads in a short window); event day (many people opening the program at once); admin bulk actions across all 214 submissions.

---

## 14. Testing plan (v2)

Nothing below has been run. This is the plan.

| Type | Tool | What it checks | When |
|---|---|---|---|
| Static checks | ESLint, TypeScript compiler | Style and type errors | Every commit and pull request |
| Unit tests | Vitest | Role/permission rules, status transitions (initial → accepted/refused/awaiting update), date and period logic, email-template tags | Every pull request |
| Database tests | SQL tests against the staging schema | Row Level Security: a user cannot read or change another user's data; a reviewer cannot see unassigned papers | Every migration |
| Browser tests | Playwright | Main flows: browse program, register, submit, review, accept/refuse, send mail | Every pull request (smoke), nightly (full) |
| Responsive tests | Playwright projects at the viewports in 11.1, plus manual checks on a real phone and tablet | No horizontal scroll, readable text, usable menu, forms and tables | Every pull request and before launch |
| Accessibility, automated | `@axe-core/playwright` on every page template | Missing labels, landmarks, contrast, roles | Every pull request |
| Accessibility, manual | Keyboard-only run; a screen reader (for example NVDA on Windows); 200% zoom; reduced-motion setting | Things automation misses: focus order, announcements, tab behavior | Before each release |
| Color contrast | Script below, run in CI against the token file | Every palette pair stays above its threshold when someone edits a color | Every pull request |
| Performance | Lighthouse CI with budgets from 13.3, plus a simple load test of the scenarios in 13.3 | Regressions and capacity | Every pull request (Lighthouse), before launch (load) |
| Security | Dependency audit; header scan; manual attempts at forbidden access and oversized or wrong-type uploads; rate-limit checks | Section 13.1 controls work | Before launch and after major changes |
| Email | Send to test inboxes; check SPF, DKIM, DMARC results; check rendering in the main mail clients | Delivery and layout | Before launch |
| Data import | Dry-run import of Sciencesconf CSV exports into staging | No lost or mangled records (D14) | Before cutover |

**Contrast check script.** This script was run on 2026-10-09 and passes with the current tokens. `node contrast.mjs` exits with code 1 if any pair falls below its limit.

```js
// contrast.mjs: WCAG 2.x contrast check for the palette tokens in section 9.
const tokens = {
  "slate-green": "#2f4f4f", forest: "#296334", leaf: "#297d1f", navy: "#011030",
  "deep-green": "#0f3416", white: "#ffffff", "gold-300": "#e1ca5e", "gold-500": "#c6ae43",
  "gold-700": "#957a14", mist: "#f8fbf7", "tint-green": "#e8f1e6",
};
const lin = (v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
const lum = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => lin(parseInt(hex.slice(i, i + 2), 16) / 255));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};
// [foreground, background, minimum ratio]: 4.5 text, 3 large text / UI components
const required = [
  ["slate-green", "white", 4.5], ["slate-green", "mist", 4.5], ["forest", "white", 4.5],
  ["white", "forest", 4.5], ["white", "leaf", 4.5], ["white", "deep-green", 4.5],
  ["navy", "gold-500", 4.5], ["gold-300", "navy", 4.5], ["gold-300", "deep-green", 4.5],
  ["tint-green", "navy", 4.5], ["gold-700", "white", 3],
];
let failed = 0;
for (const [fg, bg, min] of required) {
  const r = ratio(tokens[fg], tokens[bg]);
  const ok = r >= min;
  if (!ok) failed++;
  console.log(`${ok ? "PASS" : "FAIL"} ${fg} on ${bg}: ${r.toFixed(2)} (need ${min})`);
}
process.exit(failed ? 1 : 0);
```

**Release gate (a release is blocked until all are true):** all automated checks green; manual keyboard and screen-reader pass on the changed pages; no horizontal scroll at 360 px; every contrast pair passes; a restore test has been done at least once; and no unresolved decision from section 17 that the release depends on.

---

## 15. Deployment and environment management (v2)

### 15.1 Environments

| Environment | Hosting | Database | Purpose |
|---|---|---|---|
| Local | Developer machine | Supabase development project or local stack | Daily work |
| Preview | One deployment per pull request | Staging project | Review and automated tests |
| Production | Main branch deployment | Production project (paid plan, backups on) | Live site |

### 15.2 Configuration and secrets

| Item | Rule |
|---|---|
| Where values live | Platform environment settings, one set per environment. A local `.env.local` that is **git-ignored**. A committed `.env.example` listing names with placeholder values only |
| Client-visible values | Only the project URL and the public (publishable) client key. Next.js variable names for these start with `NEXT_PUBLIC_` |
| Server-only values | Database service key, email API key, error-tracking token. Never in client code, never in the repository, never in logs |
| CI secrets | Stored in GitHub Actions secrets. Used only by the workflows that need them |
| Rotation | Rotate keys when a team member leaves and on a fixed schedule (D3 decides who owns this) |
| Separation | Staging and production never share keys or databases |

### 15.3 Build and release workflow

1. Work on a branch; open a pull request.
2. CI runs the checks from section 14. The preview deployment is created automatically.
3. A second person reviews. Merge only when checks pass.
4. Database changes are SQL migration files in the repository. Apply to staging, run the browser tests, then apply to production. Write migrations so the previous app version still works while they roll out.
5. Merging to `main` deploys production.
6. To roll back: redeploy the previous good deployment, and restore data only if a migration damaged it.

### 15.4 Domain and email DNS

- Choose and register the domain (D13).
- Point DNS at the host. HTTPS must be on.
- Add SPF, DKIM and DMARC records for the sender domain, then send test mail.

### 15.5 Post-deployment maintenance

| Task | How often |
|---|---|
| Review error tracking, uptime alerts and database advisors | Weekly while the site is active |
| Apply dependency updates and rebuild | Monthly, and immediately for security fixes |
| Verify backups exist; test a restore | Before launch, then every quarter |
| Re-run accessibility and contrast checks after any design change | Every release |
| Review user accounts and roles; remove stale admins | Each edition and each quarter |
| Rotate keys | On the schedule in 15.2 |
| Yearly edition rollover: clone the conference configuration (pages, topics, types, rooms, templates) with a new `edition_year`; archive the old edition read-only; reset dates | Once per edition |
| Archive or delete personal data on the retention schedule (D11) | Per schedule |

---

## 16. Implementation roadmap (v2)

**Status of every phase: not started.** Nothing in this blueprint has been built, tested or deployed. Effort sizes are rough ESTIMATES (S = days, M = 1–2 weeks, L = several weeks, for one experienced developer) and should be replaced once D3 and D9 are answered.

### 16.1 Phases

| Phase | Goal | Main deliverables | Exit check | Effort |
|---|---|---|---|---|
| 0. Decisions and prerequisites | Settle what blocks the build | Answers to D1, D2, D4, D6, D13 at minimum; accounts and domain; brand assets; repository | Section 17.6 checklist is complete | S |
| 1. Foundation and design system | A working skeleton with the look | Repo, CI, tokens from 9.9, layout (header, footer, nav), base components, contrast script, accessibility baseline | CI green; contrast script passes; layout passes the viewport tests | M |
| 2. Public information site | A launchable site with no accounts | Home, programme downloads, read-only program (day tabs, list, print), guidelines, committee, speakers, dates, themes, venue, legal pages; admin-editable pages | Section 14 checks pass for these pages; content signed off by organizers | M |
| 3. Accounts, registration, participants | People can sign up and register | Auth, role table, registration form and recap, confirmation email, participants dashboard with CSV export, gated participant list | RLS tests pass; end-to-end register flow passes; email authentication (SPF, DKIM, DMARC) verified | L |
| 4. Abstract submission and editorial | Authors submit; organizers decide | Submission form with file upload, open/closed periods, status workflow, submission control board with filters and bulk actions, decision emails, history log | Upload abuse tests pass; decision emails received; status transitions covered by tests | L |
| 5. Reviewing | Reviewers assess papers | Reviewer assignment by topic or paper, reviewer inbox, review form (fields per D12), coverage view | A reviewer sees only assigned papers; coverage matches assignments | M |
| 6. Program builder, mailing, outputs | Organizers run the event from the admin | Rooms, typed event editor, attach accepted papers to sessions, CSV export, templates and bulk mailing with log, book of abstracts, certificates if D8 is "yes" | Program matches a reference schedule; bulk mail respects provider limits; PDFs open correctly | L |
| 7. Hardening and launch | Safe to go live | Security review, performance and load tests, full accessibility audit, backup restore test, data import dry run and cutover plan, monitoring and alerts | Release gate in section 14 passes | M |
| 8. Operate and roll over | Keep it healthy | The tasks in 15.5; edition rollover | Maintenance calendar running | ongoing |

Phases 2 and 3 can ship separately. A public site can go live after Phase 2, while Sciencesconf (or another tool) still handles submission and review, if D2 is answered "complement".

### 16.2 Prerequisites

| Prerequisite | Why |
|---|---|
| Answers to the decisions marked "before Phase 0 ends" in 17.3 | They change scope and cost |
| Accounts: GitHub, hosting, Supabase, email provider, error tracking | Needed from Phase 1 |
| Domain name and DNS access | Phase 3 (email) at the latest |
| Brand assets: logo files for the host, partners and sponsors with permission to use them; the faded building photo; an official brand guide if one exists | Section 9 depends on them |
| Content: final text for each page; speaker and committee lists; PDFs | Phase 2 |
| Sample data: a CSV export of registrations, submissions and the program from the live site | Test data and the Phase 7 import |
| Legal and data-protection contact | Phase 3 (collecting personal data) |

---

## 17. Assumptions, unresolved decisions, risks and confirmations (v2)

### 17.1 Confirmed requirements

- The site is a conference website for MIRC, built like the observed Sciencesconf site (task brief).
- The visual identity follows the four uploaded images (task brief).
- The public pages, roles, admin modules, data fields and flows documented in sections 2–8 (observed on the live site).
- The event copy and dates shown on the images and the live site.
- The palette values marked EXACT in 9.3.

### 17.2 Assumptions

| ID | Assumption | If wrong |
|---|---|---|
| A1 | The observed Sciencesconf features are the functional baseline for the rebuild | Scope shrinks or grows. Revisit sections 3 and 16 |
| A2 | Traffic is low, with spikes near deadlines and event days | Choose a higher hosting tier and add load testing earlier |
| A3 | English is the only interface language | Add internationalization from Phase 1 instead of later (D7) |
| A4 | One conference per deployment, with an `edition_year` field for reuse | Multi-conference support would need a larger data model |
| A5 | Reviewers are assigned manually by topic or paper, as on the live site | Add automatic assignment |
| A6 | Registration has no online payment in the first release (a sample row on the live site showed 0 €) | Add a payment provider before Phase 3 ends (D5) |
| A7 | Light mode only | Add the dark tokens from 9.8 |
| A8 | Non-developers edit content through the admin | Add a content workflow or hand edits to developers |
| A9 | The admin team is small | Add finer-grained admin roles and an activity feed |

### 17.3 Unresolved decisions

| ID | Decision | Options | Why it matters | Needed by |
|---|---|---|---|---|
| D1 | Which edition and purpose: next edition, archive of 2026, or a reusable template | Per-edition site, archive, template | Dates in all sources have passed. Content, timeline and the rollover design depend on it | Before Phase 0 ends |
| D2 | Replace Sciencesconf, or complement it | Replace everything; replace only the public site; replace in stages | Decides whether Phases 3–6 are built at all | Before Phase 0 ends |
| D3 | Team, skills and owners (code, content, keys) | Name the people | Framework choice (12.3), maintenance and key rotation | Phase 0 |
| D4 | Hosting plan and terms | Hobby (non-commercial only) or Pro; or self-host | Hobby's terms may not cover a conference with sponsors or fees | Before Phase 1 |
| D5 | Registration fees and payments | No fees; manual payment recording; online gateway | Adds a provider, fees and legal steps | Before Phase 3 |
| D6 | Brand details the images do not give | Official brand guide; error and info colors (must reach 4.5:1 on white); which footer bar (`navy` or `deep-green`); font family; logo files; photo rights | Section 9 contains ESTIMATES and gaps | Before Phase 1 |
| D7 | Navigation style and interface languages | Flat menu or grouped menu; English only or add French and Spanish | Layout and data model | Before Phase 2 |
| D8 | Generate certificates in the site | Yes (add `certificate` table and PDF job) or No | Adds a PDF feature and an admin screen | Before Phase 6 |
| D9 | Budget and deadline | Numbers and a date | Sets phases and tiers | Phase 0 |
| D10 | Analytics, cookies and bot protection | Vercel Analytics, Matomo, none; CAPTCHA or not | Cookie banner and abuse control | Before Phase 2 |
| D11 | Privacy rules | Consent for the public participant list; retention period; applicable law | Legal exposure and data model | Before Phase 3 |
| D12 | Review process | Review form fields, scoring scale, single or double blind, number of reviewers per paper | Defines the review form and permissions | Before Phase 5 |
| D13 | Domain and sender email address | Names | Needed for deliverability | Before Phase 3 |
| D14 | Data migration from Sciencesconf | Import registrations, submissions and the program, or start clean | Test data and cutover plan. Submissions export was not confirmed on the live site | Before Phase 7 |
| D15 | Accessibility target | WCAG 2.2 AA (recommended) or lower | Cost and test depth | Before Phase 1 |

### 17.4 Technical risks

| ID | Risk | Impact | Mitigation |
|---|---|---|---|
| R1 | Vercel Hobby used for production against its non-commercial terms | Account could be restricted | Use Pro, or settle D4 in writing first |
| R2 | Supabase Free project paused after a week of inactivity, and no backups | Site down or data lost | Production on Pro. Keep Free only for development and staging |
| R3 | Resend free tier allows 100 emails per day | Bulk mail to 250+ people stalls | Paid tier, or batch over several days |
| R4 | PDF generation (certificates, book of abstracts) exceeds hosting time or memory | Failed exports | Prototype in Phase 6 on the real host. Move the job elsewhere if needed |
| R5 | Cloudflare path chosen: 10 ms CPU limit on Free and Next.js adapter marked beta | Dynamic pages fail | Use Cloudflare only for a static phase 1, or test the full app first |
| R6 | Estimated colors differ from the official brand | Visible inconsistency with printed materials | Obtain the brand guide (D6) before Phase 1 sign-off |
| R7 | Gold gradient text has low contrast on light backgrounds | Hard to read for some users | Follow 9.5: gold only for large decorative display lines, facts in dark text |
| R8 | Spam and bot sign-ups, fake submissions | Dirty data, mail abuse | Rate limits, email verification, optional bot check (D10) |
| R9 | Upload abuse (oversized or wrong files) | Storage cost, security issues | Type and size limits, private bucket, signed URLs |
| R10 | Cutover from Sciencesconf loses data | Missing registrations or submissions | Dry-run import (section 14), keep Sciencesconf read-only until verified |
| R11 | Second system confuses users if Sciencesconf is kept | Two logins, support burden | Make the split clear in the navigation (D2) |
| R12 | Vendor prices or limits change | Budget surprise | Re-verify before purchase. Record the date of each check (section 18) |

### 17.5 Items to confirm with third parties

- Permission to use the host, partner and sponsor logos and to reproduce the building photo.
- Consent to show speaker names and photos (the images show named speakers; the site shows speaker and committee names).
- Whether the six partner logos and the sponsor logos should appear in the same order and grouping as on the images.
- The final text of all dates. The v1 observation found conflicting deadline dates on the live site (section 2.2).

### 17.6 Phase 0 checklist

- [ ] D1, D2, D4, D6, D13 answered
- [ ] Accounts and repository created
- [ ] Brand assets and logo permissions received
- [ ] Domain bought and DNS access confirmed
- [ ] Content owner named for each page
- [ ] Data-protection contact named (D11)
- [ ] Sample CSV exports obtained from Sciencesconf

---

## 18. Change log and sources (v2)

### 18.1 Files

| File | Change |
|---|---|
| `MIRC2026_Website_Blueprint.md` | Updated in place (this file) |
| `MIRC2026_Website_Blueprint.v1-backup.md` | New. An unmodified copy of v1 made before any edit |

No other project file was created or changed. No code was written, and nothing was built, tested or deployed.

### 18.2 What changed in v2

| Where | Change |
|---|---|
| Header, section 0 | Revision note, status line, evidence labels, source table |
| 1.4 (new) | Purpose, audience and scope with labels |
| 6 | Certificates row split out and updated, because a certificate appears in the images |
| 7.1 | Added `edition_year` to `conference` and a proposed `certificate` table |
| 7.3 | Marked as v1 options, superseded by section 12. Content kept |
| 8 | Pointer to section 17 |
| 9 (new) | Visual design system: palette, roles, contrast, components, motifs, dark mode, tokens |
| 10 (new) | Sitemap, navigation, page structure, admin IA |
| 11 (new) | Responsive design and accessibility |
| 12 (new) | Technology stack, alternatives, verified limits and costs |
| 13–15 (new) | Security, privacy, performance; testing; deployment and environments |
| 16–17 (new) | Roadmap, assumptions, decisions, risks, confirmations |
| 18 (new) | This section |

Sections 2–5 and 7.2 are unchanged from v1. Sections 1, 6, 7.1, 7.3 and 8 changed only as listed above (the one-line `edition_year` addition in 7.1 is not marked inline). A line-by-line comparison against the backup found exactly four v1 lines altered, all in that list: the certificates row in section 6, the `conference(...)` line and the 7.3 heading in section 7, and the "Recommended order of work" line.

### 18.3 Sources checked on 2026-10-09

| Topic | Page |
|---|---|
| Vercel Hobby plan, limits, non-commercial restriction, Pro seat price | https://vercel.com/docs/plans/hobby |
| Supabase Free and Pro limits and prices | https://supabase.com/pricing |
| Resend Free and Pro email limits | https://resend.com/pricing |
| Cloudflare Workers Free limits | https://developers.cloudflare.com/workers/platform/limits/ |
| Next.js on Cloudflare Workers (vinext beta, OpenNext) | https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/ |
| Next.js deployment targets, verified adapters, docs version | https://nextjs.org/docs/app/getting-started/deploying |
| Tailwind CSS v4 `@theme` color tokens | https://tailwindcss.com/docs/theme |

How they were read: each page was fetched and summarized by a tool, and the figures above were copied from those summaries. They were not cross-checked a second time. Recheck any figure before spending money on it.

### 18.4 How the palette was extracted
Pixel sampling of the four uploaded image files with Python (Pillow, NumPy). Flat text and bar fills were identified by exact-value counts. Gold values are percentile samples from gold-colored pixels. Contrast ratios use the WCAG 2.x formula and were also reproduced by the script in section 14.


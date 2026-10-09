# MIRC 2026 Conference Website — Documentation & Rebuild Blueprint

**Subject:** Manila International Research Conference 2026 (MIRC 2026), hosted on Sciencesconf.org
**Public site:** `https://mirc2026.sciencesconf.org/index`
**Back office:** `https://mirc2026.sciencesconf.org/myspace`
**Observed on:** 2026-10-08 / 2026-10-09, read-only, using an already signed-in organizer account.

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
| Back office | Certificates, badges, invoices, sessions chair assignment beyond free-text | **Not confirmed** (not seen anywhere) |

---

## 7. Suggested data model and tech stack for rebuilding

> This section is a **design proposal** built from the fields and flows above. It is not a description of how Sciencesconf is implemented.

### 7.1 Suggested data model

```
conference(id, slug, title, subtitle, city, country, start_date, end_date,
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

### 7.3 Suggested tech stack

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

Recommended order of work: (1) users, roles, pages with rights; (2) topics, submission types, submissions and the decision workflow; (3) rooms, program builder, public program with day tabs and list; (4) registration and participants dashboard; (5) mailing and templates; (6) reviewing assignments; (7) book of abstracts.

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

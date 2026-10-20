# Graph Report - MIRC Presentation Site  (2026-10-20)

## Corpus Check
- 24 files · ~82,655 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 3 file(s) not represented in the graph (top: (none) 2, .css 1)

## Summary
- 403 nodes · 611 edges · 23 communities (22 shown, 1 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 21 edges (avg confidence: 0.84)
- Token cost: 233,772 input · 0 output

## Community Hubs (Navigation)
- Playwright Test Suite
- Admin Back Office
- Blueprint Decisions & Scope
- Core UI Helpers
- Conferences & Editions Data
- Public Site & Roles
- Sciencesconf Module Mapping
- Calendar, Theme & Accessibility
- Stack & Design Tokens
- Logo Draft/Publish
- Program Days & Events
- Pages & Folders Admin
- Paper Review Actions
- Event Clash Checks
- Registration Admin
- Mailing Lists Admin
- Alias Admin
- Paper List Selection
- Header Blocks Admin
- News Admin
- Rooms Admin
- Email Templates Admin
- Real vs Simulated Data

## God Nodes (most connected - your core abstractions)
1. `MIRC 2026 Website Blueprint (v2)` - 18 edges
2. `index.html (prototype entry page)` - 15 edges
3. `My Space Back Office` - 10 edges
4. `Submission Control Board (/review/controlboard)` - 8 edges
5. `Suggested Data Model (v2, with edition_year and certificate)` - 8 edges
6. `MIRC Color Palette Tokens (slate-green, forest, leaf, navy, deep-green, gold-*)` - 8 edges
7. `Unresolved Decisions D1-D15` - 8 edges
8. `Automated Playwright test suite` - 8 edges
9. `html()` - 7 edges
10. `Recommended Technology Stack (section 12.2)` - 7 edges

## Surprising Connections (you probably didn't know these)
- `Creating and publishing an edition (yearly flow)` --semantically_similar_to--> `Yearly edition rollover (P.newEdition)`  [INFERRED] [semantically similar]
  graphify-out/converted/MIRC_Prototype_Flow_Guide_aecdca47.md → prototype/README.md
- `Real versus pretend` --semantically_similar_to--> `Simulated and real table`  [INFERRED] [semantically similar]
  graphify-out/converted/MIRC_Prototype_Flow_Guide_aecdca47.md → prototype/README.md
- `Built-in help for older users` --semantically_similar_to--> `Design for older administrators`  [INFERRED] [semantically similar]
  graphify-out/converted/MIRC_Prototype_Flow_Guide_aecdca47.md → prototype/README.md
- `Production requirements (database, auth, storage, email)` --references--> `MIRC 2026 Website Blueprint (v2)`  [EXTRACTED]
  prototype/README.md → MIRC2026_Website_Blueprint.md
- `MIRC 2026 Website Blueprint (v2)` --references--> `Sciencesconf.org platform (CCSD)`  [EXTRACTED]
  MIRC2026_Website_Blueprint.md → graphify-out/converted/MIRC_Prototype_Flow_Guide_aecdca47.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Submission Status Drives Filters, Mailing Groups and Book Criteria** — mirc2026_website_blueprint_submission_statuses, mirc2026_website_blueprint_submission_control_board, mirc2026_website_blueprint_mailing_management_module, mirc2026_website_blueprint_proceedings_builder, mirc2026_website_blueprint_status_query_service [EXTRACTED 1.00]
- **Recommended Production Stack (Next.js, Tailwind, Supabase, Resend, Vercel)** — mirc2026_website_blueprint_nextjs, mirc2026_website_blueprint_tailwind_css_v4, mirc2026_website_blueprint_supabase, mirc2026_website_blueprint_resend, mirc2026_website_blueprint_vercel [EXTRACTED 1.00]
- **Palette Definition and WCAG Contrast Validation** — mirc2026_website_blueprint_color_palette, mirc2026_website_blueprint_contrast_checks, mirc2026_website_blueprint_contrast_script, mirc2026_website_blueprint_site_colors_settings, mirc2026_website_blueprint_tailwind_theme_tokens, mirc2026_website_blueprint_wcag_2_2_aa [INFERRED 0.85]
- **Edition data model and lifecycle** — prototype_readme_edition, prototype_readme_edition_record, prototype_readme_edition_switch, prototype_readme_yearly_rollover, prototype_readme_draft_published_visibility [EXTRACTED 1.00]
- **Per-edition branding with draft/publish and admin-only publishing** — prototype_readme_draft_publish_pattern, prototype_readme_logo_management, prototype_readme_site_colors, prototype_readme_draft_published_visibility, prototype_readme_administrator_only_publishing [INFERRED 0.85]
- **On-screen conference creation flow** — prototype_readme_my_conferences, prototype_readme_customconferences_storage, prototype_conferences, prototype_conference_builder, prototype_editions [EXTRACTED 1.00]

## Communities (23 total, 1 thin omitted)

### Community 0 - "Playwright Test Suite"
Cohesion: 0.06
Nodes (4): Automated Playwright test suite, img(), hexset(), setall()

### Community 1 - "Admin Back Office"
Cohesion: 0.04
Nodes (11): BULK, EVLBL, GINFO, groupLabel(), HTYPES, mailGroups(), regcsv(), regRows() (+3 more)

### Community 2 - "Blueprint Decisions & Scope"
Cohesion: 0.07
Nodes (38): MIRC Prototype Flow Guide, Mark Daniel Apelledo, Sciencesconf.org platform (CCSD), MIRC 2026 Website Blueprint (v2), Assumptions A1-A9, CCSD (Sciencesconf operator, France), Core Web Vitals Performance Targets, D1: Which Edition and Purpose (+30 more)

### Community 3 - "Core UI Helpers"
Cohesion: 0.07
Nodes (28): colCls(), crumbs(), DENSITY, dlg(), dlgclose(), draw(), edseries(), edswitch() (+20 more)

### Community 4 - "Conferences & Editions Data"
Cohesion: 0.07
Nodes (20): Manila International Research Conference (MIRC), Pamantasan ng Lungsod ng Maynila (PLM), Creating and publishing an edition (yearly flow), brandTheme(), CONFERENCES, customEntry(), mixHex(), C (+12 more)

### Community 5 - "Public Site & Roles"
Cohesion: 0.10
Nodes (22): Items for confirmation, Blueprint roles (Guest to Administrator), Draft vs published visibility, My Account button, Public website preview (#/site), Viewing as (role simulation), account(), canSee() (+14 more)

### Community 6 - "Sciencesconf Module Mapping"
Cohesion: 0.11
Nodes (27): Abstract Submission (/user/submit), Admin Information Architecture (/admin/*), Administration Module (Create account), Detailed Program (/program day tabs, list, print), Editorial Management Module, Email Templates (Registration, Submission, Custom), Typed Event Editor (EVENT_TYPE_FK modal), Mailing Management Module (+19 more)

### Community 7 - "Calendar, Theme & Accessibility"
Cohesion: 0.10
Nodes (10): calday(), calDraw(), calGrid(), calnav(), calRoot(), calSummary(), Calendar date picker and 24-hour time boxes, Visitor-site colors (8-color palette) (+2 more)

### Community 8 - "Stack & Design Tokens"
Cohesion: 0.15
Nodes (20): Cloudflare Workers (hosting alternative), MIRC Color Palette Tokens (slate-green, forest, leaf, navy, deep-green, gold-*), WCAG Contrast Checks (section 9.5), contrast.mjs Palette Contrast Script, D6: Brand Details Not in Images, Environments (Local, Preview, Production), Gold Gradient Display Type, Next.js (App Router) (+12 more)

### Community 9 - "Logo Draft/Publish"
Cohesion: 0.14
Nodes (5): check(), logopick(), Administrator-only publishing (production rule), Logo management, Production requirements (database, auth, storage, email)

### Community 10 - "Program Days & Events"
Cohesion: 0.18
Nodes (13): bookGroups(), bookList(), busyDay(), curDay(), dayLabel(), dayOfPaper(), dayOpts(), DAYS() (+5 more)

### Community 11 - "Pages & Folders Admin"
Cohesion: 0.25
Nodes (8): flren(), folders(), pageById(), pageFields(), pgadd(), pgdel(), pgset(), pgtext()

### Community 12 - "Paper Review Actions"
Cohesion: 0.33
Nodes (7): addrev(), curPaper(), decide(), delpaper(), editpaper(), logP(), paperById()

### Community 13 - "Event Clash Checks"
Cohesion: 0.33
Nodes (6): clash(), evdel(), eventCheck(), eventTitle(), roomName(), talkCheck()

### Community 14 - "Registration Admin"
Cohesion: 0.33
Nodes (6): regById(), regedit(), REGFIELDS(), regmail(), regpay(), regsee()

### Community 15 - "Mailing Lists Admin"
Cohesion: 0.50
Nodes (5): listadd(), listedit(), listFields(), listVals(), parseMembers()

### Community 16 - "Alias Admin"
Cohesion: 0.67
Nodes (3): aliasadd(), aliasedit(), aliasFields()

### Community 17 - "Paper List Selection"
Cohesion: 0.67
Nodes (3): authorsOf(), paperList(), selall()

### Community 18 - "Header Blocks Admin"
Cohesion: 0.67
Nodes (3): blockFields(), hbadd(), hbedit()

### Community 19 - "News Admin"
Cohesion: 0.67
Nodes (3): newsadd(), newsedit(), newsFields()

### Community 20 - "Rooms Admin"
Cohesion: 0.67
Nodes (3): roomadd(), roomedit(), roomFields()

### Community 21 - "Email Templates Admin"
Cohesion: 0.67
Nodes (3): tpladd(), tpledit(), tplFields()

## Knowledge Gaps
- **28 isolated node(s):** `BULK`, `CCSD (Sciencesconf operator, France)`, `Pamantasan ng Lungsod ng Maynila (PLM) - Host Institution`, `Public Conference Website`, `Administration Module (Create account)` (+23 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 159 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `index.html (prototype entry page)` connect `Blueprint Decisions & Scope` to `Admin Back Office`, `Core UI Helpers`, `Conferences & Editions Data`, `Public Site & Roles`, `Calendar, Theme & Accessibility`, `Logo Draft/Publish`?**
  _High betweenness centrality (0.570) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `Submission Control Board (/review/controlboard)` (e.g. with `Abstract Submission (/user/submit)` and `Typed Event Editor (EVENT_TYPE_FK modal)`) actually correct?**
  _`Submission Control Board (/review/controlboard)` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `BULK`, `CCSD (Sciencesconf operator, France)`, `Pamantasan ng Lungsod ng Maynila (PLM) - Host Institution` to the rest of the system?**
  _28 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Playwright Test Suite` be split into smaller, more focused modules?**
  _Cohesion score 0.0636734693877551 - nodes in this community are weakly interconnected._
- **Why does `Conference website prototype README` connect `Blueprint Decisions & Scope` to `Stack & Design Tokens`?**
  _High betweenness centrality (0.162) - this node is a cross-community bridge._
- **Should `Admin Back Office` be split into smaller, more focused modules?**
  _Cohesion score 0.04343971631205674 - nodes in this community are weakly interconnected._
- **Why does `MIRC 2026 Website Blueprint (v2)` connect `Blueprint Decisions & Scope` to `Stack & Design Tokens`, `Logo Draft/Publish`, `Conferences & Editions Data`?**
  _High betweenness centrality (0.161) - this node is a cross-community bridge._
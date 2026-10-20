<!-- converted from MIRC_Prototype_Flow_Guide.docx -->

MIRC Conference Website Prototype
How the prototype works, from start to finish
A plain-language guide for panelists, advisers, event organizers and new team members.
Conference: Manila International Research Conference (MIRC), 2026 edition, with a draft 2027 edition
Document date: 14 October 2026
Based on: the prototype folder in the project repository (latest change recorded: “Color Control”) and the project blueprint, MIRC2026_Website_Blueprint.md (v2).
Please read first. This guide describes a prototype: a clickable model. All people, papers, numbers and dates inside it are invented sample data. Nothing is saved, sent or signed in. Section 7 lists exactly what is real and what is pretend.
Contents


If the list above is empty, right-click it in Word and choose “Update Field”.
# 1. Overview and purpose
The MIRC prototype is a working model of two things described in the project blueprint:
- The administration area: where the conference team manages papers, reviewers, registrations, the program, emails and the website itself.
- The public website preview: what visitors see, including the home page, program, list of participants, registration and abstract submission pages.
Its purpose is to show the planned structure and the main workflows to the people who will run the site, many of whom are older adults. It is therefore built with large text, plain words and confirmation before anything is removed. It is a model for discussion and feedback, not the real conference site.
## 1.1 One site, many years
Every conference year is an “edition”. The sample data holds MIRC 2026 (published) and MIRC 2027 (a draft, mostly empty). An administrator can create 2028 and later editions from the Conference menu, so the site does not have to be rebuilt each year.
## 1.2 How to open it
- Open the project’s prototype folder.
- Double-click index.html. It opens in a web browser. No installation, server or internet connection is needed. (Only Google Chrome–type browsers were tested.)
- Use Start over (reset the sample data) at the very top of the page whenever you want to return to the original sample data.
## 1.3 Controls that are always on screen
| Control | What it does |
| --- | --- |
| Start over (reset the sample data) | Puts everything back as it was. Any change you made is lost, and changes are also lost when the page is reloaded. |
| Text size: Normal / Large / Largest | Changes the size of all text. “Large” is the default. The choice is remembered in the browser. |
| Tables: Comfortable / Compact | Tightens table spacing so more fits on screen. Not shown on phones and small tablets, where tables appear as stacked cards. |
| “PROTOTYPE” notice | A reminder at the top that everything is sample data. |
# 2. Who uses the prototype: roles
The blueprint names eight roles. The prototype has no real sign-in. Instead, on the public website preview, a drop-down called “Viewing as” lets you pretend to be any role. The administration area is open to everyone in the prototype; in the real site, access would depend on the role.
| Role | What the prototype shows for it | Status of the description |
| --- | --- | --- |
| Guest | An anonymous visitor. Sees the public pages open to Guests. Does not see the List of Participants. Sees only published editions. | Working. Meaning of the name is inferred in the blueprint. |
| Member | Same page access as Guest in the sample setup. | Working. Meaning of the name is inferred. |
| Participant | A registered attendee. Can see the List of Participants and the “My Account” menu (My submissions, My registration, Edit account, Log out). | Working. Meaning of the name is inferred. |
| Reviewer | Sees the “My Account” menu with a link to the Administration area. Can see the List of Participants. | Partly working. The reviewer’s scoring form is not built (review rules undecided). |
| Coordinator | Sees the Administration link. Can see the List of Participants. | Partly working. Exact duties to be confirmed. |
| Redactor | Can be given reading rights on pages like any role. | Exact capabilities to be confirmed (not confirmed in the blueprint). |
| Webmaster | Sees the Administration link. Can preview draft editions that visitors cannot see. | Working in the preview. Real editing rights to be confirmed. |
| Administrator | Sees the Administration link. Can preview draft editions. In the real site, only this role should publish or hide an edition. | Working in the preview. The publishing restriction is planned, not built. |
Which pages each role can read is not fixed: it is set per page under Website › Pages and menu (the “Who can read this page” option). Changing it changes what each “Viewing as” role sees in the public menu. The Help page in the prototype shows a table calculated from those settings.
# 3. Main flows for visitors
These are the steps a visitor takes on the public website preview. To reach it from the administration area, click See the public website. To go back, click Back to the administration area in the bar at the top.
## 3.1 Browsing the website
- Open the public website preview. The home page shows the conference name, dates and venue, a Register button, an Abstract submission button (showing open or closed), text blocks, a placeholder for partners and sponsors, and the latest news.
- Click Menu (top left). The page links open in a slide-out panel. Click a link to open that page. Close the panel with Close, the Esc key, or by clicking outside it.
- Use the breadcrumb (“Home › page name”) at the top of any page to go back to Home.
- At the bottom, the footer shows a sample contact email. The legal notice, privacy and accessibility pages are not yet written.
## 3.2 Choosing the conference edition
- In the bar at the top, open Conference edition.
- Pick MIRC 2026 or MIRC 2027. Visitors (Guest and other non-team roles) see only published editions.
- If a visitor opens a draft edition by its link, the page says it is not published yet. Webmaster and Administrator can still preview it.
## 3.3 Reading the program
- Open the program page from the Menu.
- Choose a conference day with the day buttons (for example, “Sun 27 Sep”) or choose Full list with abstracts.
- Each entry shows its time, title, type, room and chair. If the organizers allow it, the papers presented are listed under the session.
- In the full list, click Abstract under a paper to read it, or Print this list to open the browser’s print window.
The program is built from what the team enters under Program › Schedule and Rooms. The setting Program display hides or shows papers on this public page.
## 3.4 Seeing the list of participants
- Set “Viewing as” to Participant (a Guest is told the page is not open to that role).
- Open List of Participants from the Menu.
- Read the count of registered people, then click a letter to see names under it. Only people with the status “Registered” are listed, as last name and first name only.
## 3.5 Registering for the conference
- Open the Registration page. If registration is closed for that edition, a note explains this.
- Fill in the form. First name, last name and email are always asked. The team chooses whether other details (title, phone, institution, address, country and so on) are not asked, optional or required.
- Press Save my registration. Mistakes are listed at the top of the form as links that jump to the field.
- A summary of the registration appears. The new person is added to the administration list with the status Pre-registered.
No fees, payment or confirmation email exist in the prototype. These decisions are still open.
## 3.6 Trying to submit an abstract
- Open Abstract Submission. A note says whether the submission period is open or closed and shows its dates.
- The proposed form asks for title, authors, abstract, type of presentation, topic and an optional PDF.
- Pressing Send (preview only) sends nothing. It only shows a message.
## 3.7 Signing in and “My Account”
- Click Sign in in the bar. The sign-in page is a layout only: nothing is checked or stored. Use “Viewing as” instead.
- Once “Viewing as” is any role other than Guest, the button becomes My Account. Its menu shows “Signed in as (role)”, then My submissions, My registration, Edit account, and Log out.
- Team roles (Webmaster, Administrator, Coordinator, Reviewer) also see Administration area.
- These account pages are layouts with sample content only.
# 4. Role-specific flows: the administration area
The administration area opens first. Its left menu groups pages by task. Every page starts with one sentence saying what it is for, ends with an “About this page (for the project team)” box, and has a way back to the Dashboard.
## 4.1 Dashboard
The Dashboard is the first page. It shows what needs attention, with cards that lead to the relevant pages, including a card for each edition and what is still to do before publishing.
## 4.2 Handling papers (Papers and decisions)
- Open Papers received. Filter by status, type or topic, or search by title, author or number.
- Click Open on a paper to see its details, abstract, notes and history.
- Choose Accept, Refuse or Request changes. A confirmation window appears; the safe answer, “No, go back”, is pre-selected.
- The decision is added to the paper’s history table.
- To change many papers at once, tick them, choose a bulk action such as “Set status to Refused”, press Apply, then confirm.
- Open Book of abstracts to preview the book and download a CSV list.
No email is sent to the author after a decision. Reviewer opinions are empty because the review rules are not decided. The PDF book is a switched-off button.
## 4.3 Reviewers
- Open Choose reviewers to assign reviewers by topic or by paper (a CSV can also be used).
- Open Who reviews which paper to check that each paper has a reviewer.
- Papers waiting for review and Papers already reviewed show only their empty or “review period closed” states.
## 4.4 Planning the program
- Open Rooms to add, change or remove rooms.
- Open Schedule and click a day on the calendar. Conference days have a solid border, other days are hatched, and a number shows how many events are planned.
- Click Add an event on this day. Choose a type (Session, Speech/Intervention, Logistics, Break or Tour) and set times with the hour and minute boxes (24-hour clock).
- The prototype checks the entry and explains problems in plain words: the end must be after the start, a room cannot be double-booked, and a talk must fit inside its session without overlapping another talk.
- Add papers to a session as talks, then check the result on the public program page.
## 4.5 Registrations and accounts (Attendees)
- Open Registered people to filter, view details, record payment status, edit a person, or download a CSV.
- Click Register someone, search the sample accounts (for example, “kira”), choose a person and register them.
- Open Registration form to decide, for each detail, whether the public form does not ask, asks optionally, or requires it.
- Open Add a user account to create an account. The password rule (7–20 letters or numbers) is checked, but the password is never kept.
“Send confirmation” only records a line. No email goes out.
## 4.6 Email
- Open Send an email and choose a group of recipients.
- Choose a ready-made message. The subject and text fill in automatically.
- Send. The prototype shows the counts and checks, then records a line under Sent emails.
- Other pages in this group manage ready-made messages, mailing lists, aliases and the email look.
Nothing is actually sent. The three Yes/No options on the send page are marked “meaning not confirmed”.
## 4.7 Website content
- Open Pages and menu. Each page has a title, a type and rights. Use Settings to choose who may read it (for example, tick “Guest”).
- Click See the public website with “Viewing as” set to Guest to see the menu change. Untick it and the item disappears.
- Edit Home page text and News; both appear on the public home page.
- Open Files and pictures to see uploaded-file names and sizes (nothing is really uploaded).
- Open Site settings to change the header title, subtitle, date and place, and the banner line above the header.
## 4.8 Logo and site colors
- Open Conference › Logo and choose a picture file. The page shows the rules first (PNG or SVG recommended; at most 2 MB; at least 240 pixels on the longest side). Wrong files are refused with a plain explanation.
- Check the preview in the header, phone header and menu bar. Optionally zoom and move the logo. Choose where it appears (header, menu bar, or nowhere) and write a text description for screen readers.
- Press Save. On a published edition choose Publish this logo now or Save as a draft; a draft keeps the old logo for visitors while the team previews the new one.
- Open Website › Site colors. Change any of the 8 colors with the square picker or by typing a HEX code. A live preview and a readability list react at once; colors that are hard to read are flagged and saving needs a second confirmation.
- Use Reset all colors to the default or Earlier palettes to go back. As with the logo, a published edition can take the new colors immediately or as a draft.
Logos and colors belong to one edition only. A new edition starts without a logo and with a copy of the colors of the edition it came from.
## 4.9 Creating and publishing an edition (yearly flow)
- Open Conference › Editions (years) and click Create a new edition. Enter the year (for example, 2028) and choose which edition to copy the set-up from.
- The new edition opens as an empty draft. The copy includes pages, rooms, topics, email templates and settings. It never includes papers, people, schedule or news, and the dates are reset.
- Open Edition details. Fill in the name, place, topics, and, under Dates and deadlines, click the conference days on the calendar. Save.
- Set up Schedule, Pages and menu, Registration form and Site settings for the new year.
- Click Preview to see the draft as the team. Then click Publish. The confirmation lists anything still missing. Hide returns an edition to draft; empty drafts can be deleted.
Draft versus published is simulated: it only changes what “Viewing as” can see. In production, only the Administrator role should publish or hide.
# 5. Features and modules summary
Status words used in this table:
- Works: works on the sample data in the browser.
- Simulated: the screen and checks work, but the real action needs a server or service.
- Interface only: the layout is shown; the behavior is not built.
| Menu group | Page | What it does | Status |
| --- | --- | --- | --- |
| Conference | Editions (years) | Create, preview, publish, hide and delete editions | Works (publishing simulated) |
| Conference | Edition details | Title, city, dates, submission period, topics | Works |
| Conference | Logo | Upload checks, preview, crop, save or publish | Works (no real storage) |
| Papers and decisions | Papers received | Filter, view, accept, refuse, request changes, notes, history, bulk actions | Works |
| Papers and decisions | Book of abstracts | Preview and CSV list | Works (PDF not built) |
| Reviewers | Choose reviewers; Who reviews which paper | Assign reviewers by topic or paper | Works |
| Reviewers | Waiting / already reviewed | Empty-state screens | Interface only |
| Attendees | Registered people; Register someone | List, filter, details, payment status, CSV, add a person | Works |
| Attendees | Registration form | Choose which details the form asks | Works |
| Attendees | Add a user account | Create an account with password rule check | Works (nothing kept) |
| Program | Schedule | Calendar, events, talks, time and room checks, CSV | Works |
| Program | Rooms; Program display | Manage rooms; show or hide papers publicly | Works |
| Email | Send an email | Groups, ready-made messages, counts and checks | Simulated |
| Email | Ready-made messages; Mailing lists; Email look; Sent emails | Create and change messages and lists; preview; history of simulated sends | Works |
| Email | Email aliases | Placeholder screen | Interface only |
| Website | Pages and menu | Page list, types, folders, who can read each page | Works (only some page types have content) |
| Website | Home page text; News | Text blocks and news on the home page | Works (RSS feed not built) |
| Website | Files and pictures | Lists names and sizes; 200 MB limit check | Simulated |
| Website | Site colors | 8-color palette, live preview, readability checks, drafts, history | Works |
| Website | Site settings | Languages and contact, header, colors reference, banner | Works (language switching not built) |
| Website | Visitor statistics | Switched-off button with the reason given | Interface only |
| Help | Help and prototype guide | Explanations and a table of who can do what | Works |
| Public site | Home, text pages, News | Content from the admin pages | Works |
| Public site | Detailed program | Day tabs, full list with abstracts, print | Works |
| Public site | List of Participants | A–Z list of registered people | Works |
| Public site | Registration | Form adds a pre-registered person | Works on sample data |
| Public site | Abstract Submission | Proposed form; sends nothing | Interface only |
| Public site | Sign in; My Account pages | Layouts; roles chosen with “Viewing as” | Interface only |
| Public site | Edition choice | Visitors see only published editions | Works (simulated) |
## 5.1 Built-in help for older users
- Large text with three sizes; relative sizing so everything scales together.
- Plain words and a task-based menu.
- Large buttons and tick boxes; a visible keyboard focus ring; a “Skip to the main content” button; every control reachable by Tab.
- Every status has a word and a symbol (for example, “✔ Accepted”), never color alone.
- Confirmation before removing or bulk-changing anything, with the safe answer pre-selected.
- Messages stay on screen until closed and start with “Done.”, “Note.” or “Problem.”.
- Dates are clicked on a calendar, not typed. On phones, the menu folds and tables become cards.
# 6. Credits
| Role | Name |
| --- | --- |
| Creator of the prototype | Mark Daniel Apelledo (named as copyright holder in the project license and as the Git author) |
| Advisers | To be confirmed. No adviser names are recorded in the project files. |
| Panelists / reviewers of this presentation | To be confirmed. |
| Organization / institution | To be confirmed. |
| Conference and host (from the blueprint) | Manila International Research Conference (MIRC) 2026, hosted by Pamantasan ng Lungsod ng Maynila (PLM). The blueprint is based on the live site built on the Sciencesconf.org platform operated by CCSD (France). |
The planning document used for this prototype is the project blueprint, MIRC2026_Website_Blueprint.md (v2).
# 7. Known limitations and demo-only parts
Plain statement. This is a prototype. Nothing here is a working conference system yet.
## 7.1 Real versus pretend
| Real (works in the browser on the sample data) | Pretend (not real) |
| --- | --- |
| Searching, filtering, ticking, bulk status change, deleting | Anything surviving a reload: all changes vanish |
| All forms, with their checks and messages | Sending any email, including “Send confirmation” |
| Adding, changing and removing rooms, events, talks, pages, news, templates | Signing in, passwords, accounts for real people |
| Page rights changing the public menu; program display switch; header settings | Uploading or opening real files; the logo is lost on reload |
| CSV downloads of the sample data | The PDF book of abstracts and certificates |
| Print window; text size (remembered in the browser) | Payments and fees |
| Safe previews of header and email HTML | Visitor statistics and RSS feed |
## 7.2 Not built, on purpose
- Real sign-in, accounts and roles stored in a database (needs an authentication service).
- Real email sending and delivery.
- Real file upload and download (needs storage).
- PDF book of abstracts and certificates (needs a server job; certificates are also an open decision).
- Reviewer scoring form (review rules are undecided).
- Online payment and fee tiers (undecided).
- A full text editor with bold, links and lists (text boxes are plain).
- French and Spanish interface languages, and dark mode.
- Restrictions on who may publish: in the prototype every button works for everyone.
- Importing data from Sciencesconf, and making an old edition read-only (archive).
## 7.3 Content that is placeholder or unconfirmed
- All names, papers, numbers and dates are invented sample data. Dates on the text pages were copied from the live site, including its conflicting dates.
- Partner and sponsor logos are a placeholder; the files and permission are still to come.
- The logo shown by default is a drawn placeholder.
- The empty registration form and the “Edit account” fields on the live site were not seen, so the prototype’s fields are assumed.
- Break kinds, some email option lists and the three email Yes/No options are guesses and marked as such.
- Error and information colors and the font are not decided; stand-ins are used.
## 7.4 Testing status
Automated checks of the pages, workflows, layout, contrast, editions, logo and colors were run in headless Chromium on Windows on 9 October 2026 and reported no problems. Not tested: other browsers (Firefox, Safari, Edge), real phones and tablets, any screen reader, and use by actual older adults. These should be done before the design is signed off.
## 7.5 What comes next
The blueprint lists the steps before this becomes the real site: settle the open decisions (for example fees, review rules, hosting, brand details), build the server part (accounts, database, file storage, email, PDF), replace the stand-ins, harden and test, then deploy.
# 8. Items for your confirmation
These points are not stated anywhere in the project files, so they are marked “to be confirmed” rather than guessed.
| # | Item |
| --- | --- |
| 1 | Names and titles of the adviser(s), and of the panelists, to appear in the Credits. |
| 2 | How the creator should be credited (full name, course or program, school or organization). |
| 3 | Exact duties of the Coordinator and Redactor roles; the plain-language meanings of Guest, Member and Participant (inferred from their names). |
| 4 | Whether the final file should be Word (.docx) or PDF. This version is Word so it can be edited. |
| 5 | Whether the guide should also describe topics that appear in your brief but not in this prototype (see the note that accompanies this document). |
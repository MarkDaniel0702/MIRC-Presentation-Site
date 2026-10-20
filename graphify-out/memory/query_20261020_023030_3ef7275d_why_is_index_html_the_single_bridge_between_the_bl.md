---
type: "query"
date: "2026-10-20T02:30:30.317031+00:00"
question: "Why is index.html the single bridge between the blueprint's decisions and six separate parts of the prototype code?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["index.html (prototype entry page)", "Classic scripts, not ES modules", "Plain HTML/CSS/JS with no build step", "core.js"]
---

# Q: Why is index.html the single bridge between the blueprint's decisions and six separate parts of the prototype code?

## Answer

Expanded from original query via vocab: [index, html, prototype, entry, page, blueprint, script, classic, modules, build, core, site]. Then explained prototype_index and BFS-traversed. index.html bridges communities because its script tags (L20-29) and stylesheet link (L8) are the ONLY edges between the prototype JS files: the graph has 0 JS-to-JS cross-file edges. The files are classic scripts (rationale: browsers block ES modules on file://; blueprint stack Next.js/Tailwind/Supabase needs a build and server) that share globals P, S, ED defined in core.js:7-16 and extend P / P.act, which AST extraction cannot see. So betweenness 0.570 is partly an artifact of missing global-namespace edges. Its placement in Blueprint Decisions & Scope comes from doc references (README, prototype README, flow guide) plus the 'Classic scripts, not ES modules' rationale edge. Real hidden coupling: script load order (core.js:8 reads EDITIONS from data.js at load time).

## Outcome

- Signal: useful

## Source Nodes

- index.html (prototype entry page)
- Classic scripts, not ES modules
- Plain HTML/CSS/JS with no build step
- core.js
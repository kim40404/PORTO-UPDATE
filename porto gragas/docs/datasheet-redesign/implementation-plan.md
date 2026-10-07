# Implementation plan: Datasheet portfolio (porto gragas)

Project root: C:/Users/TUF/Downloads/Porto/porto gragas. Direction contract: `.impeccable/surfaces/src-app-tsx.md` (read it first). Product truth: `PRODUCT.md`. Figure semantics: `FIGURES.md` (honesty table at lines 298-312). Quality floor: `C:/Users/TUF/.claude/plugins/cache/impeccable/impeccable/4.5.0/skills/impeccable/reference/craft-floor.md`. Codebase map: `scratchpad/understanding.md` (same folder as this file).

The page is the front pages of a component datasheet for KIMSANG SILALAHI. One document, one world: datasheet paper on a desk, cobalt manufacturer band, ruled Min/Typ/Max tables, graticule figure frames, numbered notes. Nothing from the old site's chrome survives (no preloader, cursor, grain, marquee, pills, eyebrows, section numbers, italic flourish, mono labels as costume, count-ups, word scrub, side rail, footer clock, glyph arrows).

## 1. Tokens (defined in src/index.css by the foundation; everyone else only consumes them)

```
--desk:        oklch(0.88 0.01 262)   /* behind the page, desktop only */
--paper:       oklch(0.99 0.002 90)   /* page ground, never cream */
--ink:         oklch(0.18 0.01 260)   /* text, rules, curves */
--ink-2:       oklch(0.40 0.01 260)   /* secondary text (body on paper) */
--band:        oklch(0.44 0.17 262)   /* cobalt: header band, section bars, table heads, typical curve */
--band-ink:    oklch(0.99 0.002 90)   /* text on band */
--band-tint:   oklch(0.95 0.02 262)   /* table header fill, highlighted row */
--grid:        oklch(0.93 0.02 262)   /* graticule minor lines */
--grid-major:  oklch(0.86 0.03 262)   /* graticule major lines */
--limit:       oklch(0.62 0 0)        /* limit curves, struck values, "-" cells */
--watermark:   oklch(0.82 0 0)        /* NOT TESTED watermark */
--rule:        oklch(0.18 0.01 260)   /* table rules use --ink at 0.75px */
--ff-sans:  "Libre Franklin Variable", "Franklin Gothic Medium", Arial, sans-serif;
--ff-mono:  "Share Tech Mono", ui-monospace, monospace;   /* ONLY pin numbers, axis ticks, revision code, figure readouts */
--sheet-w: 1180px; --gutter: clamp(16px, 4vw, 48px);
--t-part: clamp(32px, 4.2vw, 56px);  /* part title, Bold caps */
--t-bar: 13px (Bold caps, letter-spacing .06em)  --t-h: clamp(22px, 2.2vw, 30px)  --t-body: 16px/1.55  --t-cell: 14px  --t-note: 12.5px
--rule-w: 0.75px (tables), --band-rule: 2px
--ease-out: cubic-bezier(0.16, 1, 0.3, 1); --draw: 800ms
```
Figure plates are ink on paper: `.frame` sets `color: var(--ink); --accent: var(--band); background: var(--paper)`. The old dark plate is gone.

## 2. Primitives (src/index.css, foundation) and shared components

- `.sheet`: the page column, max-width var(--sheet-w), paper background, centred on the desk at >=1024px with a 1px ink edge; full-bleed paper below 1024px (no desk).
- `.band`: cobalt header band (page 1 only): grid: title block left, ordering row right; 128px tall desktop, auto on phone.
- `.bar`: section bar: cobalt fill, Bold caps 13px band-ink, 2px band rule under it; `data-print` wipes in once (the single authored entrance): `clip-path: inset(0 100% 0 0)` -> `inset(0)` over 600ms ease-out when `.is-printed` is added by `usePrint()`.
- `.ds-table`: datasheet table: 0.75px ink rules, band-tint header row, tabular numerals, `.typ` cell bold, `.dash` cell in --limit, superscript `<sup class="note-ref">(1)</sup>`; `tr[data-figure]` links to a frame; `.is-linked` row gets band-tint fill.
- `.frame`: graticule figure frame. Children: `.frame-head` (Figure N. Title, right: year or ref), `.frame-body` (the figure; graticule drawn by CSS background: 10x8 minor grid in --grid with major lines every 5 in --grid-major), `.frame-foot` (conditions line, 12.5px, --ink-2). Modifier `.is-illustrative` adds the rotated "NOT TESTED" watermark (CSS pseudo-element, --watermark, Bold caps, 45deg) and a hatch pattern on the frame edge. `.is-live` for Figure 1.
- Buttons/links: `.plate` (white filled control on the band: paper fill, ink text, 2px band rule, 44px tall min), `.link` (text link, underline 1px ink, offset 3px; on band: band-ink). No pills, no 999px radius anywhere; radius 0 everywhere.
- `.note-list`: numbered notes "(1)" with limitation text.
- `.sheet-foot`: "Rev. 2026-10 | Page n of N | kimsilalahi.vercel.app" between pages; the ordering row repeats here on phones.
- Figures' own motion hooks keep their class names: `.draw` paths use `pathLength=1` and `stroke-dashoffset`; a frame entering view (IntersectionObserver via `useDraw`) gets `.is-drawn`, which transitions dashoffset 1 -> 0 over var(--draw). No `.spin`, `.ping`, breathing, cycling: delete those keyframes.
- Reduced motion block: every curve final, bars printed, Figure 1 solved; no transitions.
- Mobile: `(hover: hover) and (pointer: fine)` gates hover links and row<->curve highlight; no Lenis on touch (existing); no scroll-snap; `content-visibility: auto` on `.frame` below the fold; every `<img>` has width/height from `assetMeta` and `srcSet()`; safe-area padding on the fixed contents strip.

## 3. Component map (src/components) and who owns what

| File | Owner | Replaces | Contract |
|---|---|---|---|
| App.tsx | foundation | old App | order: Contents, HeaderBand, page sections, SheetFooters, Ordering. No Lenis stop/ready gating; `initLenis()` on desktop only. |
| Contents.tsx | chrome agent | Nav + SectionRail | fixed slim strip over the desk/page: "KIMSANG SILALAHI" + section text links from `SECTIONS` export `{id,label}` + "CV (PDF)". Phone: "Contents" button opens a plain list (dialog with focus trap, Escape). Exports `SECTIONS`. Uses `scrollTo` from lib/motion. |
| HeaderBand.tsx | chrome agent | Hero copy | the cobalt band: part title, three lines (role / scope / location WIB), ordering row (CV plate + Email, WhatsApp, GitHub, Hugging Face, LinkedIn links, "Rev. 2026-10"). Data from `profile`. |
| FeaturesApplications.tsx | page-1 agent | Manifesto + stats | FEATURES bar + bullet list from `features` (content.ts), APPLICATIONS bar + text from `applications`, GENERAL DESCRIPTION bar + the manifesto sentence in plain type (no serif word) + two sentences from profile. Two-column with TypicalApplication at >=1024 (5/7). |
| TypicalApplication.tsx | page-1 agent | Hero figure | TYPICAL APPLICATION bar + Figure 1 `.frame.is-live` holding `<ClusterField>`; readouts (iteration, inertia, state) in mono inside the frame foot; controls: "Re-test" (reseed) and "Step" (advance one iteration, keyboard operable) with a visually-hidden live region describing the step; conditions line text from the contract. Plotter pen head on fine pointers (a small crosshair following the newest centroid move) is optional polish. |
| Characteristics.tsx | evidence agent | (new) | ELECTRICAL CHARACTERISTICS bar + `.ds-table` from `characteristics` (content.ts) + NOTES `.note-list` from `notes`. Row hover/focus (fine pointer) or tap toggles `.is-linked` on the row and dispatches `window` custom event `ds:link` `{figureId}`; Curves listens and highlights the matching frame (and vice versa). |
| Curves.tsx + FigurePlate.tsx + Drawer.tsx | evidence agent | Work + Drawer | CHARACTERISTIC CURVES bar + figure frames for the 10 projects (Figure 2..11, one frame per project showing its first figure, caption "Figure N. Title: caption"; conditions line = project.conditions or metric+label; `.is-illustrative` when `figures[0].illustrative`). Clicking a frame opens Drawer = "Figure N detail sheet": all figures of the project in frames, screenshots (`<img>` with srcSet/width/height, lazy), facts as a two-column `.ds-table`, stack as pin list, links as plates. No filter chips. Keep Drawer focus/Escape/scroll-lock mechanics; restyle to paper. FigurePlate keeps the IntersectionObserver activation that adds `.is-active` so `.draw` runs; remove ambient cycles. |
| PinConfiguration.tsx | pins agent | Capabilities | PIN CONFIGURATION bar + an SVG package outline (drawn in code, 400x? viewBox) with numbered pins grouped RETRIEVE / EVALUATE / SHIP from `pins` (content.ts), plus a PIN FUNCTIONS `.ds-table` (Pin / Name / Function / Used in project). Pin numbers in mono. No three cards. |
| Package.tsx | pins agent | AboutStage + SearchDiscovery | PACKAGE bar: one portrait (`portraits[0]` formal by default; a plain segmented switch for the three, no pills) at a reserved box with width/height; a `.ds-table` of `aboutFacts` (Education, Mobility, Certified, Languages, Availability); then Figure 12 `.frame` with the ChatGPT screenshot (`assets.chatgptDiscovery`, srcSet, lazy) captioned "Figure 12. Search observation" with the disclaimer as its conditions line; "Enlarge" opens the image in the Drawer. |
| ApplicationNotes.tsx | notes agent | WritingSection | APPLICATION NOTES bar + list rows AN-1..AN-5 from `articles` (title, abstract, date, read time, link) with "Open" as a text link opening the existing article Drawer content (keep the article rendering from WritingSection). |
| RevisionHistory.tsx | notes agent | Experience | REVISION HISTORY bar + `.ds-table` Rev / Date / Description from `experience` (oldest first, Rev A, B, C...), each row expandable (button in the row, aria-expanded) to show its bullets; then QUALIFICATIONS small table from `certifications`. |
| Ordering.tsx | chrome agent | Contact | ORDERING INFORMATION bar + `.ds-table` Part / Description / Contact: CV (PDF) plate, Email, WhatsApp, LinkedIn, GitHub, Hugging Face; availability line "Open to AI engineering roles, remote-first"; final `.sheet-foot` "Rev. 2026-10 | Page 6 of 6 | kimsilalahi.vercel.app". No clock, no back-to-top. |
| Frame.tsx, SectionBar.tsx | foundation | FigurePlate chrome | shared: `<SectionBar id label />` renders `<h2 class="bar" data-print>`; `<Frame n title ref conditions illustrative live>` renders the graticule frame. |
| hooks/useDraw.ts, hooks/usePrint.ts | foundation | useReveal | IntersectionObserver hooks adding `.is-drawn` / `.is-printed` once; reduced motion adds them immediately. |
| lib/motion.ts | foundation | old | keep `reduceMotion`, `finePointer`, `touchDevice`, Lenis singleton, `scrollTo`; delete scramble, tokenize. |
| data/content.ts | content agent | old | ADD (never remove or rename existing exports): `features: {text, conditions}[]`, `applications: string[]`, `characteristics: Row[]`, `notes: {n, text}[]`, `pins: {n, name, group: "RETRIEVE"|"EVALUATE"|"SHIP", fn, projects: string[]}[]`, `Figure.illustrative?: boolean`, `Project.conditions?: string`. Fix the manifesto string to plain text (no `*` markers). |
| ProjectVisual.tsx, ClusterField.tsx | figures agent | old | theme for ink-on-paper, honesty fixes (below). |

Deleted by the foundation: Preloader.tsx, Cursor.tsx, Ticker.tsx, SectionRail.tsx, Manifesto.tsx, Capabilities.tsx, AboutStage.tsx, SearchDiscovery.tsx, Hero.tsx, Nav.tsx, Work.tsx, WritingSection.tsx, Experience.tsx, Contact.tsx (replaced by the files above), hooks/useMagnetic.ts, hooks/useReveal.ts, utils/cn.ts (use template strings). The foundation leaves a compiling stub for every new component so `npx tsc --noEmit` and `npx vite build` pass before section agents start.

## 4. Data: characteristics rows (content agent authors from README facts already in content.ts; "-" where nothing is stated; never invent)

Columns: parameter, conditions, min, typ, max, unit, note (number), figure (figure id like "flyrank"), project (id).
Rows (typ values): Precision@50 lift (FlyRank, client-holdout split, bundled sample; typ 0.74; min 0.24 baseline; note: directional); Rows validated (ID-EN, Polars pipeline, hard asserts; 944 of 945; unit rows); Customer profiles (Telco churn, IBM dataset; 7,043; churn rate ~26%); Classification accuracy (Honey, k-NN, five-sensor ESP32, test batch; 88.25 %); Players surveyed (thesis, K-Means vs DBSCAN; 245 real + 1,000 simulated); Research validity (thesis, 8 validation metrics; 92 %); LLM inference cost (CiteReady, Llama 3.1 via Ollama; 0 USD); Document size handled (PDF Summarizer, 15-page chunks, two-pass; 384 pages, offline); AI subsystems (LolosPCPM; 4); Match radius (GrowMate; 1 to 100 km); Rows queried (FlyRank release via DuckDB; ~79,000,000); Courses completed (Anthropic Academy; 18 of 18). Notes: 1 directional decision support, not a claim about Google's algorithm; 2 synthetic hero data, thesis measured 245 players; 3 illustrative figures carry NOT TESTED; 4 LolosPCPM not affiliated with Bank Indonesia; 5 ChatGPT listing is a prompt-specific observation.

## 5. Figures honesty (figures agent)

From FIGURES.md 298-312 and the slop audit: mark `illustrative: true` on auditor, pillars, heatmap (CiteReady), mlops drift + shap (churn), histogram + rag (LolosPCPM), matchgraph (GrowMate), dream (Decodream), embedding (ID-EN: also change the "1,182 pairs" text to "944 rows"). Real: precision (FlyRank), funnel + dataset (ID-EN), validation + clusters + dendrogram + radar (thesis), sensor (Honey), chunks (PDF). Remove contradicting reuse: drop `growth` from honey and growmate, drop `rag` from flyrank, drop `layers` from pdf-summary; for churn's `layers`, relabel the layer texts to the churn stack (Client: Streamlit dashboard, API: FastAPI, Model: XGBoost + SHAP, Store: MLflow, Observe: Prometheus + Grafana). Replace the gauge in `auditor` with a ruled score table or keep it but it is illustrative (watermark will show). Re-theme every renderer for ink on paper: raise opacity ladders so the faintest mark is >= 0.28 on white, replace the two hard-coded #121110 fills with var(--paper), keep `currentColor`/`--accent` usage. ClusterField: read colours from CSS variables (paper, ink, band, limit) instead of the hard-coded dark palette; points ink at 0.55 alpha, target cluster in band, centroids band crosses, ellipses limit dashed; keep PRNG, Lloyd's, probe, reduced-motion static; expose `reseed()` and `step()` via a ref so TypicalApplication can wire the controls; keep N/DPR gating.

## 6. Order of work

1. Foundation (tokens, primitives, shell, stubs, fonts, index.html) and, in parallel, content agent and figures agent.
2. Section agents in parallel on disjoint files (chrome, page-1, evidence, pins, notes). Each: implement, `npx tsc --noEmit`, `npx vite build`, no edits outside its files.
3. Integration: screenshots at 1440 and 390, fix overflow and gaps, `impeccable detect --json`, Lighthouse mobile, OG image.
4. Finish review (impeccable-finish-reviewer), fix batch, verdict, documenter writes DESIGN.md.

Rules for every agent: read the direction contract and craft-floor first; no new dependencies; no emoji or unicode glyphs as icons (draw a 16px SVG stroke icon when an icon is truly needed); copy is plain and specific; every number keeps its condition; nothing animates on phones except curve draw-in; keep export names and section ids the Contents strip uses: `features`, `typical`, `characteristics`, `curves`, `pins`, `package`, `notes`, `revisions`, `ordering`.

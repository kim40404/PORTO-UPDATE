# Portfolio codebase understanding (for redesign)

Root `C:/Users/TUF/Downloads/Porto/porto gragas`. Vite 7.3.7, React 19.2.6, Tailwind 4.1.17, GSAP 3.15, Lenis 1.3.26, TS 5.9.3. Single page, pure CSR. From nine `wf_0a972f4e-7e3-*` JSONs. ST = ScrollTrigger, RM = prefers-reduced-motion.

## 1. Architecture map

- **Entry**: `index.html` (data-theme=dark, theme-color #121110, canonical https://kimsilalahi.vercel.app/, no og:image) → `src/main.tsx` → `src/App.tsx`: Preloader → Cursor → Nav → SectionRail → `<main>` [Hero #top, Ticker, Manifesto #manifesto, Work #work, Capabilities #method, AboutStage #about, SearchDiscovery #discovery, WritingSection #writing, Experience #experience] → `<footer id=contact>` → `div.grain`. One ST per `[data-bg]` (10) flips `html[data-theme]` + theme-color (App.tsx:19-26, 36-43): 4 full-page flips (Work, Writing+Experience light).
- **Data**: `src/data/content.ts` (691 lines; types 3-76, profile 78-95, manifesto 97-98, stats 100-105, projects 109-402, method 404-426, searchDiscovery 428-432, portraits 434-438, aboutFacts 440-445, experience 447-490, certifications 492-496, articles 498-682, tickerItems 684-691). `src/data/assets.ts` imports `asset-manifest.json`, exports `assets`, `assetMeta {width,height,variants}`, `srcSet(key)`; cvPdf `/Kimsang_Silalahi_CV.pdf`. No component uses `srcSet`/`assetMeta` yet.
- **Figures**: `src/components/ProjectVisual.tsx` (1162 lines, 21 `VisualKind` renderers, FIGURES map 1119-1141, viewBox 0 0 400 500) ← sole caller `FigurePlate.tsx` ← Work, Capabilities. `ClusterField.tsx` (446 lines, canvas K-Means) ← sole caller Hero.
- **Motion**: `src/lib/motion.ts` (EASE=expo.out, reduceMotion/finePointer gates, Lenis singleton desktop-only, scrollTo, scramble, tokenize); `src/hooks/useReveal.ts`; `src/hooks/useMagnetic.ts` (Hero:17, Contact:28).
- **Styles**: `src/index.css` (1215 lines: tokens 8-69, chrome, figure keyframes 899-1159, RM block 1165-1215); `src/fonts.css` (4 @font-face); `src/utils/cn.ts` = clsx+tailwind-merge (~24 KB raw).
- **Build**: `vite.config.ts` = react + tailwindcss, target es2022, manualChunks gsap/lenis, unused `@` alias. singlefile/three removed. No tsc gate; tsconfig `types:["node"]`.

## 2. Per-component table

| File (src/components/) | Purpose | Motion | Mobile | Perf | Verdict |
|---|---|---|---|---|---|
| ../App.tsx | Chrome, sections, theme flip, Lenis gate | 10 theme STs; body 600ms tween | Tween off ≤760 | 4 flips repaint tokens | Keep flip; drop grain/preloader gate |
| Nav.tsx | Fixed bar, KS. swap, scramble, overlay 01-07 | 2 STs; entrance 1.3s | Brand tight at 320px; no focus trap | low | Replace surface; keep ids + scrollTo |
| SectionRail.tsx | ≥1280 tick rail, 8 ids (no #discovery) | 8 STs | Hidden, STs run | low | Remove |
| Preloader.tsx | 000→100 curtain, sessionStorage `ks:intro` | ~3.2s; scrollTo(0,0) kills deep links | Runs; page scrollable beneath | Delays first paint ~2-3s | Remove; set `ready` immediately; keep copy |
| Cursor.tsx | difference-blend dot | quickTo .32s | Off on touch | Full-viewport blend layer | Remove |
| Ticker.tsx | 48s marquee | CSS infinite | Runs; clone not aria-hidden | Permanent layer | Remove |
| Drawer.tsx | Portal panel max-w 54rem | shade .5s + slide .9s; Lenis stop; focus restore; Esc | iOS lock weak; no inert | ≤618 SVG nodes + 6 imgs | Keep mechanism, restyle |
| ../hooks/useReveal.ts | Once reveals: lines 2s, fade 1.75s, rule 2.2s | 52 STs | CSS hides until JS | will-change per .line | One authored moment; keep RM fallback |
| Hero.tsx | Copy, 2 CTAs, Fig. 01 plate + live readouts via onStep | Timeline on `ready`: lines 1.6s, clip-path 1.8s | Plate (340px) below fold; "INERTIA 0.0123" wraps ≤360 | clip-path over canvas | Keep plate/readouts/copy; recompose |
| ClusterField.tsx | Canvas Lloyd's K-Means k=4, mulberry32, ellipses, probe, reseed | rAF; step 1.15s; hold 4.5s; RM static | N 300/DPR 1.5 on coarse or <760 (else 560/2) | 560 rgba strings/frame | Keep verbatim; palette hard-coded |
| Work.tsx | Header, 5 chips, 10-card grid, Drawer → ProjectDetail | useReveal 4; hover svg scale 1.7s | tablist ARIA half-done; imgs no width/height | 660 SVG nodes; content-visibility | Keep data flow + drawer; restyle |
| FigurePlate.tsx | "Fig. n.x" chrome, IO activate 0.12, ambient cycle 6.2-11s | is-active/is-cycling | Ambient on phones (RM-gated only) | Paint-time SVG, contain:paint | Keep IO + hygiene; gate ambient (hover:hover) |
| ProjectVisual.tsx | 21 deterministic SVGs, currentColor/--accent, hooks .draw/.grow*/.spin/.ping | none | Text ≈5-8px in cards | 1,728 nodes; dataset 362, embedding 229, heatmap 182 | Keep; fix/label invented numbers |
| Manifesto.tsx | Word-scrub sentence + 4 count-ups | scrub 25 spans; counters 2s | 8-9 lines at 360 | cheapest | Keep text+numbers; drop effects |
| Capabilities.tsx | 3 method plates (rag, heatmap, layers) | useReveal | ≈1,600px stacked | heatmap 182 | Replace triad |
| AboutStage.tsx | 3 portraits + chips, quote, bio, facts | CSS crossfade + grayscale | 3 portraits fetched; chips 27px | 3 filtered layers | Keep facts/portraits; rewrite copy |
| SearchDiscovery.tsx | "#1 of 20" screenshot + disclaimer | useReveal 3 | No reserved box → CLS; orphan | image ×3 | Keep evidence; give identity |
| WritingSection.tsx | 5 article rows + Drawer; first light section | useReveal | Thumbs hidden ≤760 | 5 thumbs | Keep articles; restyle |
| Experience.tsx | Accordion 4 roles + certs | grid-rows .6s + refresh 650ms | Period col hidden <640 | layout anim/tap | Keep data; simplify |
| Contact.tsx | 100svh footer, magnetic mailto, socials, clock (Asia/Jakarta, 15s) | useReveal 9; .pulse | Email pill ~300px | lightest | Keep clock/links; rewrite headline |

## 3. Content inventory

GitHub links are `github.com/kim40404/<repo>`.

| id | title | group | year | metric | figs | shots | links |
|---|---|---|---|---|---|---|---|
| citeready | CiteReady | AI & LLM | 2026 | $0 — LLM inference cost | 3 auditor, pillars, heatmap | 1 | CiteReady |
| lolospcpm | LolosPCPM | AI & LLM | 2026 | 4 — AI subsystems | 2 histogram, rag | 1 | lolos-pcpm-ai; BI disclaimer 165-166 |
| pdf-summary | PDF Summarizer | AI & LLM | 2025 | 384 pp — Handled offline | 2 chunks, layers | 0 | PDF-SUMMARY |
| mlops-churn | Telco Churn MLOps | MLOps | 2025 | 7,043 — Customer profiles | 3 mlops, shap, layers | 6 | mlops-churn-dicoding |
| flyrank | Search Intelligence Pipeline | MLOps | 2026 | 3× — Precision@50 lift | 2 precision, rag | 0 | flyrank-ml-internship-starter; note 259-260 |
| id-en-pipeline | ID–EN Data Pipeline | Data | 2025 | 944 — Validated rows | 3 funnel, embedding, dataset | 1 | id-en-data-pipeline; huggingface.co/datasets/Kimsang766/agentic-ai-instructions-id-en-cleaned |
| mobile-legends | Mobile Legends Player Analytics | Data | 2024 | 245 — Players surveyed | 4 clusters, dendrogram, radar, validation | 0 | MobileLegendsUnique; mobilelegendsunique.up.railway.app |
| growmate | GrowMate | Product | 2025 | 1–100 km — Search radius | 2 matchgraph, growth | 1 | growmate-app; growmate-app.vercel.app |
| honey | Honey Quality Classifier | IoT | 2023 | 88.25% — Classification accuracy | 2 sensor, growth | 1 | none |
| decodream | Decodream | AI & LLM | 2024 | Lead — Team of four | 1 dream | 0 | none |

Totals: 24 project + 3 method = 27 placements from 21 kinds; 11 shots.

Other blocks: **profile** Kimsang Silalahi, KS, AI Engineer, Medan, Asia/Jakarta WIB, kimsilalahi@gmail.com, +62 812-4689-4985, wa.me/6281246894985, github.com/kim40404, huggingface.co/kimsangsilalahi, linkedin.com/in/kimsang-silalahi, "Open to AI engineering roles". **manifesto** "I build AI products that move beyond *demos* — LLMs, retrieval and automation, shipped with the observability to prove they still work on Monday morning." **stats** 10 / 7,043 / 245 / 18 (+"/18"). **method** Retrieve (rag), Evaluate (heatmap), Ship (layers). **searchDiscovery** "A prompt-specific observation (GEO/AEO), not a ranking guarantee…". **aboutFacts** USU GPA 3.78 Cum Laude; INTI 2023–24; Anthropic 18/18 · Dicoding · AWS. **experience** FlyRank AI internship Jul–Aug 2026 (P@50 0.24→0.74, ~79M rows DuckDB); Independent Aug 2024–Jun 2026; INTI; USU 2021–2025. **certifications** 3. **articles** 5 (Apr 2025 – 29 Sep 2026), 3 metrics each. **tickerItems** 6. **portraits** 3. Unused asset keys: cutout, cutoutAlt, mlopsDashboard, churn, chatgptDiscoveryAlt, projectDiscovery, halfDayHero, contactCta, displacement.

## 4. Performance baseline

Perf JSON predates the image change (build A = singlefile + remote images; build B = current config). Now: `public/images` self-hosted WebP, 17 images, 1.28 MB total (on disk 34 files = 17 full-size ≤1600px 896,658 B + 17 `-800` variants 416,782 B = 1,313,440 B) + `public/Kimsang_Silalahi_CV.pdf` 184,952 B.

- **Build A** (historic): one `dist/index.html` 628,769 B (gz 260.97 kB), base64 fonts 38% of gz.
- **Build B** (current): `index.html` 1,697 B; `index-*.js` 327,319 B (gz 103.05 kB); `gsap-*.js` 114,013 B (gz 45.16 kB); `lenis-*.js` 18,708 B (gz 5.44 kB) → JS 460,040 B / ~153.6 KB gz; `index-*.css` 40,504 B (gz 9.40 kB).
- **JS** (raw/gz): react+react-dom 193,224/60,187 (41%); gsap+ScrollTrigger 115,214/45,275; lenis 18,618/5,399; clsx+tailwind-merge 25,345/8,115; content.ts 29,993/11,007; ProjectVisual.tsx 25,637/7,991; ClusterField.tsx 6,701/3,086.
- **Fonts** (latin, swap, no preload): Geist Variable 29,400 B; Geist Mono Variable 23,128; Instrument Serif upright 21,032 (never used); italic 22,128. 95,688 B total, 74,656 needed. FOUT/CLS on hero headline.
- **Images**: remote state 8.39 MB per desktop scroll (workflow.png 4,475,167 B for a 300px thumb); local WebP 342,708 B desktop (-96%), 183,536 B mobile. Still no width/height/srcset (SearchDiscovery.tsx:51-56 worst CLS); 3 portraits decoded at once; drawer images not lazy.
- **Runtime**: ~77 STs (10 theme, 2 Nav, 8 Rail, 5 Manifesto, 52 useReveal), all refreshed on every filter change and accordion toggle. Initial DOM 1,685 elements / 151 KB, 929 SVG nodes in 13 svgs (Work 660 + Capabilities 269). Canvas rAF while visible. Paint-time infinite loops `.spin` 130s (clusters 3, dream 1, embedding 4), `.ping` 3.6s (mlops 1, matchgraph 4); ambient cycles 6.2-11s. Desktop: 2 blend layers (grain, cursor); will-change permanent on 14 `.mask > .line`, marquee, cursor, preloader, drawer. Preloader ~3.2s + CSR = no hero paint before JS + ~3.3s.
- **Mobile gating present**: Lenis off on (hover:none) and (pointer:coarse)/RM; cursor/magnetic fine-pointer only; grain (pointer:fine) and ≥900px; body tween off ≤760; canvas N 300/DPR 1.5, no probe; writing thumbs hidden ≤760; content-visibility on card plates; full RM block. **Not gated**: 77 STs, scrub, counters, preloader, ambient cycles, spin/ping, marquee, pulse, hero intro, 929 SVG nodes. No gsap.matchMedia, saveData, `(hover: hover)` guard, or safe-area insets despite viewport-fit=cover.

## 5. AI-template tells (severity file: tell)

- H fonts.css:3-37: Geist + Geist Mono + Instrument Serif trio
- H index.css:217-222 (`.serif`, 7 headings): italic serif flourish word
- H index.css:157-170: 11px tracked uppercase mono `.label` costume
- H index.css:42-47, ClusterField.tsx:11-12: near-black + one orange
- H index.css:49-54, App.tsx:36-43: cream + terracotta scroll flip
- H index.css:313-334: feTurbulence grain
- H Cursor.tsx: difference-blend dot cursor
- H Preloader.tsx:48-72: 000→100 counter curtain
- H Ticker.tsx: marquee of category nouns
- H useMagnetic.ts, index.css:385-428: magnetic liquid-fill pill; 999px pills everywhere
- H every eyebrow, Nav.tsx:7-13: "01 Approach … 07 Contact" kickers
- H Manifesto.tsx:6-39, 94-108 (Work:26-29, Writing:73-80): stat rows with count-up
- H Manifesto.tsx:46-65: word-by-word scroll scrub
- H useReveal.ts:21-56: identical entrance everywhere
- H Contact.tsx:44-53: "Let's build something that thinks."
- H Hero.tsx:57-94: pulsing-dot eyebrow, accent period, flourish lead, two pills
- H index.css:19-20: 14%-alpha hairlines on everything
- H Capabilities.tsx:30-42: three identical cards, "Retrieve. Evaluate. Ship."
- M Work.tsx:205-238: uniform card grid, mono meta, ↗, hover lift
- H ProjectVisual.tsx:226-230, 202-204, 315-320, 59-64: invented readings (p95 42 ms, 1,182 pairs, 120+ candidates, 82); disclaimer only in FIGURES.md:298-311
- H ProjectVisual.tsx:325-370, 596-651, 711-747, 161-166: growth/rag/layers/embedding reused under contradicting captions (soil moisture for honey; "Claude · OpenAI" under Llama)
- M FigurePlate.tsx:39-86, index.css:1054-1159: perpetual breathe/spin/ping
- M ProjectVisual.tsx:67-102: gauge ring with invented 82
- H index.css:488-500, 1007-1017: ↗ ✕ ↑ glyph icons with hover nudge
- M AboutStage.tsx:66-69: Wittgenstein pull-quote
- H AboutStage.tsx:71-74, content.ts:368, 409, 423: LLM-register bio/blurbs
- M AboutStage:55-64 (and 4 other h2s): interchangeable clever headlines
- M index.css:714-716: accent period on name/monogram
- M Nav.tsx:85-92: wordmark morph on scroll
- M motion.ts:102-133: scramble hover
- M index.css:296-307: pulsing status dot
- M Contact.tsx:14-24, 86-95: clock + back-to-top + handle grid
- M index.css:259-279, 763-783, 479-487: three grow-from-left underlines
- M SectionRail.tsx: right-edge tick rail
- M Nav.tsx:121-151: numbered big-link overlay
- M AboutStage.tsx:15-46: grayscale portrait as "Fig. 4.1" with chip tabs
- M index.css:432-440: forced-dark plate on cream, white borders
- M Work.tsx:182-202: pill filter chips with counts
- M index.css:178-192, SearchDiscovery:23: -0.045/-0.06em tracking, lh .86, thin giant numbers
- M SearchDiscovery.tsx:22-25, 45-48, 63-65: "Signal" + 11rem "#1" + "Evidence — screenshot"
- M Writing.tsx:35-64, 104-109, Experience.tsx:62-69: numbered-everything rows
- L Experience.tsx:78-85: gap-px cert grid
- L index.css:615-636: plus-to-minus accordion
- L Drawer.tsx:46-63: stock shade + slide surface
- L motion.ts:10-11: expo.out on everything
- L index.html:6,9,19: em-dash triad copy
- L index.css:98: ss01/cv11 reflex
- L Hero.tsx:50, Contact.tsx:35: 100svh hero and footer
- L package.json:2: name "react-vite-tailwind"; cn() reflex

Verdict: ~85-90% template by surface, ~30% by content.

**Preserve**: ClusterField.tsx whole (PRNG 22-31, Lloyd's 103-158, ellipse eigen 137-153, probe 289-324, RM 416-426, axes "KDA →"/"WIN RATE →"); Hero readouts via onStep, "Fig. 01 — Player segmentation / K-Means · k = 4", hint "Move the cursor over the plot to probe a point."; Fig. {project}.{letter} numbering; all 21 renderers, Axes 34-51, currentColor/--accent theming, `.draw`+pathLength=1, `.grow*`; README-backed figures precision, funnel, validation, sensor, shap, chunks, pillars, radar, dendrogram, clusters, matchgraph; content.ts entirely incl. disclaimers 165-166/259-260/431; SearchDiscovery screenshot + framing; portraits, screenshots, CV; copy "Fitting k = 4 — loading figures", "prove they still work on Monday morning"; Drawer focus/Escape/Lenis behaviour; the perf gating and a11y plumbing listed in §4 and §8; oklch + color-mix tokens + fluid scale (index.css:17-69); mask descender fix 233-238; FIGURES.md honesty table (surface on plates).

## 6. Product truth and contradictions

Kimsang Silalahi, AI Engineer, Medan; B.Sc. CS USU 2021–2025 GPA 3.78 Cum Laude; INTI Malaysia 2023–24; thesis K-Means vs DBSCAN, 245 players. Roadmap (28 Sep 2026): junior–mid Applied AI/LLM Engineer; one headline "Applied AI Engineer | LLM/RAG, Python, FastAPI & MLOps"; flagship trio CiteReady / MLOps Churn / IoT Honey; rule claim → measurement → evidence → limitation; recruiter test: role, two proofs, stack, results, contact within 20–30 s. Audience: recruiters, consultancy clients. FIGURES.md: code-drawn only, "orange = look here first", seeded PRNG, hero data synthetic, one figure = one context. Stance: Ollama for building/privacy, hosted provider via LiteLLM for production.

Contradictions (site vs CV/arsip): GPA 3.78 vs 3.77; consultancy end Jun 2026 vs Feb 2026; headline "AI Engineer" vs CV long form vs old "Full Stack Engineer | AI & Web3"; CiteReady Llama/Ollama $0 vs CV "OpenAI API", repo/URL differ; dataset 1,182 items (CV) vs 945→944 rows, HF namespace Kimsang766 vs kimsangsilalahi; FlyRank ranking pipeline vs CV "LLM content-generation SEO"; "4 end-to-end AI applications" + 60% (CV) vs 3 named apps; CV lists Exstore.id Roblox (Nov 2025–Jan 2026) and Ministry of Law internship (Jul–Aug 2024), site omits; "10 projects documented on GitHub" but 8 cards link; certs 3 vs 7, "AWS Cloud foundations" vs "AWS AI Academy"; LolosPCPM "120+ users in 3 days" draft-only; Honey no repo; "92% research validity" undefined. Planned-not-built: LLM Gateway & Evaluation Workbench.

## 7. Graphify

`graphify-out/` (untracked): 238 nodes / 569 edges / 3 hyperedges, 31 files, 87% extracted, no import cycle. God nodes: `reduceMotion()` 25 edges (11 files), `FIGURES.md` 22, `react` 20, `App()` 20, tsconfig `compilerOptions` 19, `useReveal()` 18, `cn()` 14, `scrollTo()` 13, `projects` 12, `FigurePlate()` 11. Communities (9): Figure System 45 nodes (cohesion 0.089, loosest); App Shell & Sections 27; Motion Runtime & Hero Canvas 30; Package/Vite 28; Content Data 19; TS Config 20; Runtime deps 12; Dev deps 10; Theme & Accent Tokens 6. Key dependencies: content.ts consumed by 15 components via named exports (profile alone feeds Nav, Hero, Preloader, Contact, Experience); `VisualKind` is the only data↔renderer coupling; FigurePlate sole ProjectVisual caller; Hero sole ClusterField consumer (className, onStep); motion.ts centralises Lenis/RM/touch gates; section ids are the scrollTo contract; FIGURES.md binds frame, timing, honesty.

## 8. Redesign constraints

- `src/data/content.ts`: export names/shapes unchanged (components are pure views); stats stay numeric if a counter survives.
- `ProjectVisual.tsx` renderers + `FIGURES` map by `VisualKind`, `ClusterField.tsx` + Hero mount contract: untouched. Redesign cards via FigurePlate shell + index.css 899-1159; figure motion is bound to class names `.draw .grow .grow-r .grow-y .spin .ping .is-active .is-cycling .cycle-forward .cycle-reverse` and `--dash/--off`.
- Determinism: mulberry32 seeds (ClusterField.tsx:22-31, ProjectVisual.tsx:4-13) stay.
- Palette lives in six places: ClusterField 11-19 + 317, `.plate` 432-440, `.preloader` 376-377, THEME_COLOR App.tsx:19, favicon index.html:24, ::selection index.css:131; figure opacity ladders and `#121110` texts (ProjectVisual 634, 829) are tuned for the dark plate.
- RM: every GSAP path checks `reduceMotion()`; extend index.css:1165-1215 for new motion; initial-hidden CSS states ([data-reveal], .word, [data-reveal-line], Hero pre-hide 25-31 vs `ready` 33-44) need visible defaults or the RM fallback.
- Accessibility: keep skip link, focus-visible 134-138, dialog roles + Escape + focus restore, aria-current, role=img; fix Nav overlay focus trap, Drawer inert, Ticker clone, Work tablist ARIA, 27px chips, 11px labels.
- Navigation: `NAV_LINKS` (Nav.tsx:7-13), `SECTIONS` (SectionRail.tsx:5-14), "Project N / 10" (Work.tsx:240), eyebrow numbers change together; `#discovery` orphaned.
- Mobile: add `(hover: hover)` guards, safe-area insets, fixed-position scroll lock; new motion on HTML wrappers only; wire `assetMeta`/`srcSet` into every `<img>`.
- Build: keep multi-file; preload fonts or add metric overrides; drop upright Instrument Serif, tailwind-merge, `@` alias; add og:image.

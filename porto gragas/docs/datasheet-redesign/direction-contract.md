---
version: 1
slug: "src-app-tsx"
primary_target: "src/App.tsx"
related_targets: ["src/index.css","src/components"]
---

# Surface brief: src/App.tsx (the whole single page)

Scope: the entire portfolio page, Experience mode (the work leads from the first viewport). Audience: recruiters and hiring engineers on laptop or phone with two minutes; Indonesian freelance clients on a phone from WhatsApp. Job: see role, two strongest proofs, stack, a measured result, and a contact action within 20-30 seconds, then verify through figures, repos, screenshots, and the CV. Constraints: data layer src/data/content.ts and the figure renderers (ProjectVisual.tsx, ClusterField.tsx) keep working; every illustrative figure is marked on the page; rich motion on desktop, light on a mid-range phone; no horizontal overflow; zero AI-template tells (the 48 listed in the slop audit).

## Direction contract

THESIS: An engineer is specified, not described. The page is the front pages of a component datasheet for KIMSANG SILALAHI: every claim is a row in an Electrical Characteristics table (Parameter / Test conditions / Min / Typ / Max / Unit / Note), every figure is a characteristic curve on a graticule, and a curve that was not measured carries a NOT TESTED watermark. It refuses the hero stack (name, tagline, two pills, equal card grid), refuses limitations as footnotes (they are columns), and refuses every tell of the near-black-plus-orange and cream-editorial clusters.

OWN-WORLD: Committed colour strategy. Datasheet white ground oklch(0.99 0.002 90), never cream; ink oklch(0.18 0.01 260); one manufacturer band, cobalt oklch(0.44 0.17 262), on about 30% of the surface: the page-1 header band, every section bar, table header rows, the heavy typical curve in each figure, the tinted graticule minor grid oklch(0.93 0.02 262); limit curves and struck values grey oklch(0.62 0 0); watermark grey oklch(0.82 0 0); desk behind the page oklch(0.88 0.01 262). Materials: datasheet paper, 2px band rules, 0.75px ink table rules, 10x8 graticule frames, pin-number boxes, page footer "Rev. 2026-10 | Page n of N | kimsilalahi.vercel.app". Component language recognisable empty: cobalt page band, bold-caps section bars (FEATURES, APPLICATIONS, TYPICAL APPLICATION, ELECTRICAL CHARACTERISTICS, CHARACTERISTIC CURVES, PIN CONFIGURATION, PACKAGE, ORDERING INFORMATION, REVISION HISTORY), ruled Min/Typ/Max tables with tabular numerals, graticule frames with "Figure N." captions and a conditions line, superscript notes "(1)". Faces: Libre Franklin (variable, self-hosted) Bold caps for the part title and section bars, Semibold for parameter names, Regular for body and cells; Share Tech Mono only for pin numbers, axis ticks and the revision code. No italic flourish, no eyebrow labels, no section numbers except datasheet page and figure numbers, which carry information.

STORY: The visitor understands this is a spec sheet for an AI engineer: what he is for (APPLICATIONS), what he has proven (FEATURES are the real numbers), under which conditions (the Conditions column), and where the limits are (Max, notes). They believe it because every value has a conditions cell and every illustrative curve is watermarked. They read FEATURES in ten seconds, glance at the typical-application figure fitting live, and take ORDERING INFORMATION: CV (PDF) first, then WhatsApp or email; a hiring engineer continues into CHARACTERISTIC CURVES and the repo link in each row.

FIRST VIEWPORT: Desktop 1440: page 1 at 100% zoom, an 1180px page centred on the flat desk so the page edge reads. Top: a 128px cobalt band; left, "KIMSANG SILALAHI" 56px Libre Franklin Bold caps, beneath it "AI ENGINEER / LLM APPLICATIONS, RETRIEVAL SYSTEMS, PRODUCTION MLOPS / MEDAN, INDONESIA (WIB)"; right inside the band, the ordering row: "CV (PDF)" as a white filled plate (primary action, plainly a control), then Email / WhatsApp / GitHub / Hugging Face / LinkedIn as white text links, and "Rev. 2026-10". Below the band, two columns 5/7. Left: FEATURES bar and bullets, each a real number with its condition ("Precision@50 0.24 to 0.74 on the FlyRank bundled sample, about 3x, directional"; "944 of 945 rows validated and published to Hugging Face"; "7,043-profile churn pipeline: XGBoost, MLflow, Prometheus/Grafana"; "Local inference, Llama 3.1 8B via Ollama: $0 API spend"; "Anthropic Academy 18/18"), then APPLICATIONS ("Junior-to-mid Applied AI / LLM Engineer roles; freelance AI builds in Indonesia"). Right: TYPICAL APPLICATION bar and Figure 1, a 760x480 graticule frame holding the live K-Means fit (axes KDA / WIN RATE, k = 4, centroids as cobalt crosses) with its conditions line in the frame's lower margin: "Conditions: synthetic points, seed 1234, k = 4. The thesis measured 245 surveyed players (Figure 7.1)." The fold cuts into the ELECTRICAL CHARACTERISTICS bar with its first rows visible. Phone 390: band 96px, name 28px, CV plate full width under the role line; Figure 1 at 358x260 with its conditions line; FEATURES; the characteristics table as stacked parameter rows (Parameter / Conditions / Typ) that stay a table semantically; the ordering row repeats in every page footer so CV is never more than a page away.

SIGNATURE INTERACTION: "Test conditions": hovering or tapping any value in the Electrical Characteristics table lights its characteristic curve and prints that row's conditions line in the figure's lower margin; hovering a curve highlights its row. Pressing a note superscript scrolls the Notes block beside the row. Figure 1 carries a "re-test" control that re-seeds the fit and rewrites the conditions line, deterministic PRNG preserved.

MOTION GRAMMAR: Datasheets do not move; curves draw once. Each characteristic curve draws along its path (stroke-dashoffset, 600 to 900ms, ease-out) when its frame enters view; graticules are already printed; tables never animate. Figure 1 iterates like a plotter: points placed, centroids stepping per iteration, with a pen head on fine pointers. Gated to pointer:fine: table-to-curve highlight, hover conditions line, page-boundary scroll-snap. Reduced motion: every curve final, Figure 1 solved. No count-ups, no breathing, no perpetual loops, no word scrubs, no identical entrance per section.

Raises from the declined challengers (seed 75a8bbeb):
- Night six-pack, discipline "trend as well as value": every characteristics row carries a comparison (baseline, Min/Max or "-" with the reason), never a lone number; the reading sweep FEATURES, Figure 1, table is fixed.
- Shader portal, discipline "one continuous scene": the page is one document; scroll is the page feed, no section re-entrances, figures persist once drawn.
- Saturday title card, discipline "every transition announced": section bars print across once as the single authored moment; nothing else enters.
- Greiman collage, discipline "scale courage": part title at billboard scale against notes at footnote scale; one dominant scale move per page.
- Paper automata, discipline "a shared, accessible crank": Figure 1 has keyboard-operable step and re-test controls with a text step description (iteration, inertia) for screen readers.
- Silk canopy, discipline "states labelled beyond colour": measured vs illustrative is carried by watermark, hatch and note text, never by colour alone.

FORM: Component datasheet (paper/print: technical document), rank 1 of my ordered list, chosen by the owner over the dealt candidate 6 (ISOTYPE count boards); seed key 75a8bbeb.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.

## Open decisions

- Which values fill Min/Max: only what a README or FIGURES.md states; otherwise "-" with a note, never invented.
- Whether to show the two CV-only roles (Exstore.id, Ministry of Law) in REVISION HISTORY: keep content.ts as truth until the owner decides.

---
name: Kimsang Silalahi, component datasheet
description: A single-page portfolio typeset as the front pages of a component datasheet; every claim is a row with its test conditions, every figure a curve on a graticule.
colors:
  desk: "oklch(0.88 0.01 262)"
  paper: "oklch(0.99 0.002 90)"
  ink: "oklch(0.18 0.01 260)"
  ink-2: "oklch(0.4 0.01 260)"
  band: "oklch(0.44 0.17 262)"
  band-deep: "oklch(0.36 0.15 262)"
  band-ink: "oklch(0.99 0.002 90)"
  band-tint: "oklch(0.95 0.02 262)"
  grid: "oklch(0.93 0.02 262)"
  grid-major: "oklch(0.86 0.03 262)"
  limit: "oklch(0.62 0 0)"
  watermark: "oklch(0.82 0 0)"
  rule: "oklch(0.18 0.01 260 / 0.55)"
typography:
  display:
    fontFamily: "Libre Franklin Variable, Franklin Gothic Medium, Arial, sans-serif"
    fontSize: "clamp(2rem, 4.2vw, 3.25rem)"
    fontWeight: 700
    lineHeight: 0.98
    letterSpacing: "-0.015em"
  headline:
    fontFamily: "Libre Franklin Variable, Franklin Gothic Medium, Arial, sans-serif"
    fontSize: "clamp(1.375rem, 2.2vw, 1.875rem)"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Libre Franklin Variable, Franklin Gothic Medium, Arial, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "0.06em"
  lead:
    fontFamily: "Libre Franklin Variable, Franklin Gothic Medium, Arial, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.5
  body:
    fontFamily: "Libre Franklin Variable, Franklin Gothic Medium, Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.55
    fontFeature: "kern, liga, tnum"
  cell:
    fontFamily: "Libre Franklin Variable, Franklin Gothic Medium, Arial, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.4
    fontVariation: "tabular-nums"
  label:
    fontFamily: "Libre Franklin Variable, Franklin Gothic Medium, Arial, sans-serif"
    fontSize: "0.78125rem"
    fontWeight: 400
    lineHeight: 1.5
  mono:
    fontFamily: "Share Tech Mono, ui-monospace, Menlo, monospace"
    fontSize: "0.8125rem"
    fontWeight: 400
    fontVariation: "tabular-nums"
rounded:
  none: "0px"
spacing:
  gutter: "clamp(16px, 4vw, 48px)"
  strip: "44px"
  cell: "8px 10px"
  bar-below: "16px"
  column: "40px"
  section: "48px"
  foot-above: "56px"
  sheet-width: "1180px"
components:
  plate-btn:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.title}"
    rounded: "{rounded.none}"
    padding: "0 18px"
    height: "44px"
  plate-btn-hover:
    backgroundColor: "{colors.band-tint}"
    textColor: "{colors.ink}"
  plate-btn-on-band:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "0 18px"
    height: "44px"
  plate-btn-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "0 18px"
    height: "44px"
  link:
    textColor: "{colors.ink}"
    typography: "{typography.body}"
  seg:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "0 12px"
    height: "36px"
  seg-selected:
    backgroundColor: "{colors.band}"
    textColor: "{colors.band-ink}"
  band:
    backgroundColor: "{colors.band}"
    textColor: "{colors.band-ink}"
    typography: "{typography.display}"
    padding: "24px {spacing.gutter} 20px"
  bar:
    backgroundColor: "{colors.band}"
    textColor: "{colors.band-ink}"
    typography: "{typography.title}"
    rounded: "{rounded.none}"
    padding: "7px 12px 6px"
  table-head:
    backgroundColor: "{colors.band-tint}"
    textColor: "{colors.ink}"
    typography: "{typography.cell}"
    padding: "7px 10px"
  table-cell:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.cell}"
    padding: "{spacing.cell}"
  frame:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "12px"
  strip:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.title}"
    height: "{spacing.strip}"
  drawer-head:
    backgroundColor: "{colors.band}"
    textColor: "{colors.band-ink}"
    typography: "{typography.title}"
    padding: "10px {spacing.gutter}"
---

# Design System: Kimsang Silalahi, component datasheet

## Overview

**Creative North Star: "The Component Datasheet"**

The system describes an engineer the way a datasheet describes a part. Every claim is a row with its test conditions and limits (Parameter / Conditions / Min / Typ / Max / Unit / Note); every figure is a characteristic curve on a graticule with a "Figure N." head and a conditions line in its lower margin; an illustrative figure carries a NOT TESTED watermark, a dashed edge and a head tag, never colour alone. The page is one 1180px sheet lying flat on a grey desk, divided into pages by its footers ("Rev. 2026-10 | Page n of N | kimsilalahi.vercel.app").

The mood is exact, calm, cobalt-and-paper, with no decoration. One manufacturer cobalt carries all emphasis: the page-1 band, the section bars, the drawer head, table header tint, the heavy typical curve, the selected segment, selection and focus. Everything else is ink on paper, with grey reserved for limits and watermarks. Density is high, print-like and tabular; the single scale move per page is the part title at billboard size against notes at footnote size.

Confirmed rejections: no italic serif accent, no kickers or eyebrow labels, no section numbers beyond datasheet page and figure numbers, no pills, no glyph icons, no grain, custom cursor, preloader counter, marquee, count-ups or word scrubs.

**Key Characteristics:**
- One cobalt, one paper, one ink; grey only for limits, dashes and watermarks.
- Radius 0 everywhere; 0.75px ink rules and 2px cobalt or deep-cobalt band rules.
- Libre Franklin Bold caps for titles and bars, Semibold for parameters, Regular for cells; Share Tech Mono only for pin numbers, axis ticks, readouts, dimensions and the revision code.
- Flat sheet on a desk; the only shadow is the sheet's own at 1024px and up.
- Curves draw once, bars print once, nothing loops; reduced motion renders the printed sheet.

## Colors

A paper-white sheet, near-black ink, one cobalt band, and three greys for limits, watermarks and the desk.

### Primary
- **Manufacturer Cobalt** (`{colors.band}`): the page-1 header band, every section bar, the drawer head, the selected segment, the typical curve in each figure, note superscripts, the active contents link, text selection and the focus ring.
- **Deep Cobalt** (`{colors.band-deep}`): the 2px bottom rule under every cobalt band, bar and drawer head, and under the on-band plate.
- **Band Tint** (`{colors.band-tint}`): table header rows, linked or hovered table rows, plate hover, image placeholders and the scrollbar track.

### Neutral
- **Datasheet Paper** (`{colors.paper}`): the sheet, the contents strip, the plate face, every frame body. Never cream.
- **Band Ink** (`{colors.band-ink}`): text on cobalt; numerically the paper value, kept as its own token so on-band type never drifts.
- **Ink** (`{colors.ink}`): all text, all 0.75px rules, square feature bullets, the skip link ground.
- **Ink 2** (`{colors.ink-2}`): conditions, notes, units, captions, frame references, footers.
- **Rule** (`{colors.rule}`): 55% ink for table body row rules, so the header and outer rules read heavier.
- **Limit Grey** (`{colors.limit}`): limit curves, dashed values ("-"), the illustrative head tag border.
- **Watermark Grey** (`{colors.watermark}`): the NOT TESTED watermark only.
- **Graticule Minor / Major** (`{colors.grid}` / `{colors.grid-major}`): the 10x8 minor grid and its 2x2 major divisions inside every frame body.
- **Desk** (`{colors.desk}`): the body ground behind the sheet at 1024px and up; below that the body is paper.

### Named Rules
**The One Band Rule.** Cobalt is the only hue. It appears as fill on bands, bars and selected segments, as a 2px bottom rule on plates, and as the typical curve; it is never a body text colour, and no second accent is ever added.
**The Grey Means Limit Rule.** Limit grey and watermark grey carry information (a limit curve, an untested figure, a value not stated). They are never used decoratively or as a disabled look.

## Typography

**Display Font:** Libre Franklin Variable (self-hosted, 100-900; fallback Franklin Gothic Medium, Arial)
**Body Font:** Libre Franklin Variable
**Label/Mono Font:** Share Tech Mono (self-hosted, 400; fallback ui-monospace, Menlo)

**Character:** one grotesk at three weights does all the talking; the mono face is a measuring instrument reserved for numbers read off a scale.

### Hierarchy
- **Display** (700, `clamp(2rem, 4.2vw, 3.25rem)`, 0.98, -0.015em, uppercase): the part title only, white on the cobalt band. Phones drop to `clamp(1.75rem, 7.4vw, 2.25rem)`.
- **Headline** (700, `clamp(1.375rem, 2.2vw, 1.875rem)`, 1.15, -0.01em): the degree line in PACKAGE and drawer titles.
- **Title** (700, 0.8125rem, 1.3, 0.06em, uppercase): section bars and the drawer head. The same size at 600 / 0.03em is the contents strip and segment labels; at 700 / 0.04em and 0.875rem it is the plate label.
- **Lead** (400, 1.125rem, 1.5, max 62ch): the general description paragraph under the band.
- **Body** (400, 1rem, 1.55, max 68ch on `.measure`): paragraphs and feature bullets; kerning, ligatures and tabular numerals on by default.
- **Cell** (400, 0.875rem, 1.4, tabular): table cells; Semibold for parameter names and headers, Bold for the Typ value.
- **Label / Note** (400, 0.78125rem, 1.5, Ink 2): conditions, numbered notes, captions, frame feet, page footers. Stacked-table labels are 0.6875rem Semibold uppercase 0.04em.
- **Mono** (400, 0.8125rem, tabular): pin numbers, axis ticks, readouts, revision code; 0.6875rem for package dimensions.

### Named Rules
**The Mono Is A Readout Rule.** Share Tech Mono appears only where a number is read off an instrument: pin numbers, axis ticks, live readouts, dimensions, the revision code. Never in headings, body or table prose.
**The Caps Carry Structure Rule.** Uppercase is reserved for the part title, its three role lines, section bars, the strip, plates and segments. No kickers or eyebrows; the only numbers that precede a title are page and figure numbers.

## Layout

One sheet, `max-width: 1180px`, centred, with a horizontal gutter of `clamp(16px, 4vw, 48px)`. At 1024px and up the sheet sits on the desk with `margin: 68px auto 48px` (strip height plus 24px); below that it fills the viewport and takes `padding-top: 44px` under the fixed strip. A fixed 44px contents strip runs across the top: paper, 0.75px ink bottom rule, uppercase 0.8125rem Semibold; its links show from 1024px, a ruled toggle below.

Page 1 is a two-column grid of 5fr / 7fr with a 40px gap (32px stacked below 1024px); on phones the figure column is ordered first. The general description is two 1fr columns with `16px 40px` gaps and a full-width lead at 70ch. PIN CONFIGURATION repeats the 5fr / 7fr split with 24px gaps. Section bars carry `margin: 48px 0 16px`; a lead under a bar gets 20px below. Page footers sit 56px below their last block with `padding: 10px 0 14px`, and the block after a footer starts 24px down. Table cells are `8px 10px`; headers `7px 10px`. Tables with `.stack` collapse at 640px and below into two-column (or three-column numeric) grid rows, each cell labelled from `data-label`, and stay tables to assistive technology. Figure frames keep a 4:5 body (19:12 for the live figure, 16:9 for wide), 12px inner padding, and a 10x8 graticule with 2x2 major divisions. Anchors scroll to strip height plus 12px.

## Elevation & Depth

Flat. The sheet is a single sheet of paper on a desk; depth is conveyed by the desk ground, the sheet's 1px 35%-ink outline and one soft offset shadow at 1024px and up. Nothing on the sheet casts a shadow: bands, bars, frames, plates and tables are ink rules on paper. The drawer is a second sheet sliding over a 55% dark-cobalt shade with a 0.75px ink left rule and no shadow.

### Shadow Vocabulary
- **Sheet on desk** (`box-shadow: 0 2px 10px oklch(0.2 0.02 262 / 0.14)`, with `outline: 1px solid oklch(0.18 0.01 260 / 0.35)`): the `.sheet` at 1024px and up only.

### Named Rules
**The One Sheet Rule.** The only shadow in the system is the sheet's own. No control, card, frame or band may carry one.

## Shapes

Ruled and square. `border-radius` is 0 on every element. Three rule weights do all the structure: a 0.75px ink rule for table edges, frames, plates, segments, pin boxes, the strip, the footer top and the drawer edge; a 55%-ink 0.75px rule between table body rows; a 2px band rule in cobalt under plates and page footers, and in deep cobalt under the band, bars and the drawer head. Illustrative frames switch their 0.75px border to dashed. Feature bullets are 7px ink squares. Graticules are drawn with 1px gradient lines. Package dimension lines are 1px ink with 8px end ticks. The linked frame and all focus rings are a 2px cobalt outline offset 2px.

## Components

### Buttons (plates)
A plate is a white filled control with a cobalt bottom rule; plainly a control without being a pill.
- **Shape:** square (0px); 0.75px ink border, 2px cobalt bottom rule.
- **Primary (`.plate-btn`):** paper face, ink label, 0.875rem Bold uppercase 0.04em, `min-height: 44px`, `padding: 0 18px`, 8px gap.
- **On band (`.plate-btn.on-band`):** the same plate with a paper border and a deep-cobalt bottom rule, for use inside the cobalt band or drawer head.
- **Ghost (`.plate-btn.ghost`):** transparent face, 0.75px ink rule all round, no cobalt rule; secondary actions beside a plate.
- **Hover / Focus / Active:** hover (fine pointers only) fills with band tint; focus is the global 2px cobalt outline; active shifts 1px down. No transition.

### Links
- **Style:** inherit colour, 1px underline offset 3px in the current colour; on cobalt they are band ink. Hover thickens the underline to 2px. In the ordering rows and band they are wrapped to a 44px tap height.
- **Note reference (`.note-ref`):** a cobalt Semibold superscript with no underline and a 24px hit area padded around an 11px mark.

### Segmented switch
- **Style:** inline ruled group, 0.75px ink border, 0.75px ink rules between buttons, 0.8125rem Semibold uppercase 0.03em, `min-height: 36px`, `padding: 0 12px`.
- **State:** the pressed or selected segment fills cobalt with band ink; nothing else changes. Used for package views and the Figure 1 step / re-test controls.

### Tables (`.ds-table`)
- **Corner Style:** square.
- **Background:** paper body; band-tint header row with Semibold ink labels and a 0.75px ink rule beneath; 0.75px ink rules top and bottom of the table.
- **Rows:** 55%-ink rules between body rows, none after the last; linked, focused or hovered figure rows tint band-tint. Typ is Bold, units Ink 2, "-" limit grey centred, numeric columns right-aligned with tabular figures.
- **Caption:** 0.78125rem Ink 2 above the table, left-aligned.

### Figure frame (`.frame`)
- **Head:** "Figure N." Bold, title Regular, optional right-aligned reference in Ink 2; 0.8125rem, `7px 10px`, 0.75px ink rule below.
- **Body:** 4:5 graticule on paper, 12px padding, contained paint; the live figure is 19:12, wide figures 16:9.
- **Foot:** "Conditions:" in Semibold ink followed by the conditions line in Ink 2 at 0.78125rem, plus optional readouts (mono 0.8125rem) or controls; 0.75px ink rule above.
- **Illustrative:** dashed border, an "illustrative" head tag (0.6875rem uppercase 0.06em, limit-grey ruled) replacing the reference, and a rotated -22deg NOT TESTED watermark at weight 800, 0.14em tracking, `clamp(1.5rem, 9cqi, 3.25rem)`, watermark grey.
- **Linked:** 2px cobalt outline offset 2px when its table row is hovered or focused.
- **Motion:** `.draw` strokes run `stroke-dashoffset` to 0 over 800ms ease-out after a 120ms delay once the frame enters view; `.grow` bars scale from 0 the same way. Once drawn, a figure stays drawn.

### Header band and section bars
- **Band (`.band`):** cobalt, band-ink text, 2px deep-cobalt bottom rule, `padding: 24px gutter 20px` (28px top and 128px min-height from 1024px), two columns 1.2fr / 1fr aligned to the bottom; holds the part title, three uppercase Semibold role lines, and the ordering row (CV plate, five links, mono revision code).
- **Bar (`.bar`):** cobalt, band-ink, 2px deep-cobalt rule, `padding: 7px 12px 6px`, Title type; an optional right aside at weight 500 / 0.03em / 90% opacity. A paper cover over the bar retracts to the right once over 600ms ease-out when the bar enters view (the single authored entrance); reduced motion removes the cover.

### Navigation (contents strip)
- **Style:** fixed 44px paper strip with a 0.75px ink bottom rule; uppercase 0.8125rem Semibold 0.03em; links in an 18px-gapped row from 1024px, the current one cobalt with a 2px underline offset 6px; below 1024px a ruled toggle (36px, `0 10px`) opens the contents.

### Drawer
- **Style:** a detail sheet `min(100%, 56rem)` wide sliding in from the right over a 55% dark-cobalt shade; paper, 0.75px ink left rule, sticky cobalt head in Title type with an on-band close plate, body `padding: 24px gutter 48px`. Shade fades 240ms, sheet slides 420ms ease-out; reduced motion removes both.

### Pin box and package dimensions
- **Pin number (`.pin-n`):** mono 0.8125rem in a 0.75px ink box, `min-width: 2ch`, `padding: 0 4px`, centred.
- **Dimension (`.dim`):** mono 0.6875rem label on a paper patch over a 1px ink line with 8px end ticks, horizontal above the package photo and vertical (rotated) to its right.

### Images (`.shot`, `.pkg img`)
- **Style:** full width, 0.75px ink border, band-tint placeholder, dimensions reserved from the asset manifest.

## Do's and Don'ts

### Do:
- **Do** give every value a conditions cell and a comparison (baseline, Min/Max, or "-" with a note); never a lone number.
- **Do** mark an illustrative figure three ways: dashed frame, "illustrative" head tag, NOT TESTED watermark; never by colour alone.
- **Do** keep cobalt to bands, bars, selected segments, plate rules, the typical curve, note marks and focus; keep body text ink.
- **Do** use 0.75px ink rules for structure and 2px band rules for emphasis; radius 0 everywhere.
- **Do** set every number in tabular figures; use Share Tech Mono only for pin numbers, ticks, readouts, dimensions and the revision code.
- **Do** draw each curve once on entry (800ms ease-out) and print each bar once (600ms); render everything final under reduced motion.
- **Do** keep the CV plate within one page of any scroll position by repeating the ordering row in every page footer.

### Don't:
- **Don't** add a second accent, a cream or warm paper, or a tinted ground behind any block other than table headers and linked rows.
- **Don't** use kickers, eyebrows, section numbers (page and figure numbers excepted), pills, glyph icons or an italic serif accent.
- **Don't** add shadows, grain, blur, gradients or borders heavier than 2px; the only shadow is the sheet's own at 1024px and up.
- **Don't** loop, breathe, count up, scrub words, cycle, or re-enter a section on scroll; figures persist once drawn.
- **Don't** invent Min or Max values; state "-" with a note when a source does not give one.
- **Don't** use a system display face or a decorative font; the two self-hosted faces are the whole set.

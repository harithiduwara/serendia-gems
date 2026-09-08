# Design System — "Royal Blue Sapphire"

Version 1.0 · 2026-09-08

---

## 1. Design principle

**The stone is the hero. Everything else recedes.**

The single most important visual decision in this build is what colour the page is
behind a photograph of a gem.

The supplied photography is shot on pale grey and beige backgrounds. Placing those
images on a dark navy page would surround each stone with a glowing pale rectangle —
the frame would compete with the gem, and colour perception would shift. Gemmological
practice is to grade colour against neutral light-to-mid backgrounds for exactly this
reason.

So the catalogue canvas is **warm ivory**, and the royal blue sapphire identity is
carried by structure rather than by flooding the background: the masthead, the hero
band, the footer, the CTA bands, every heading, link, focus ring, and rule. The result
reads unmistakably as a sapphire house, while every stone still reads true.

## 2. Colour tokens

Defined once in `globals.css` as CSS custom properties. Never hard-code a hex value in a
component.

### Brand — the sapphire scale
| Token | Value | Use |
|---|---|---|
| `--royal-abyss` | `#060C1F` | Deepest ground; footer, hero overlay base |
| `--royal-deep` | `#0B1838` | Masthead, dark bands |
| `--royal` | `#16327E` | Primary brand blue; buttons, headings |
| `--royal-bright` | `#2B57C4` | Links, active states |
| `--cornflower` | `#5B87E8` | Accent on dark grounds, focus ring |
| `--sapphire-mist` | `#DCE5FA` | Tinted surfaces, chips |

### Metal — the setting
| Token | Value | Use |
|---|---|---|
| `--gold` | `#A8863A` | Hairlines, small-caps eyebrows, on-dark accents |
| `--gold-bright` | `#D4B968` | On-dark text accents only |

### Neutral — the canvas
| Token | Value | Use |
|---|---|---|
| `--canvas` | `#FBFAF7` | Page ground (warm ivory) |
| `--surface` | `#FFFFFF` | Cards, panels |
| `--surface-sunken` | `#F2F0EA` | Wells, image mats |
| `--ink` | `#0F1729` | Body text |
| `--ink-muted` | `#5A6178` | Secondary text |
| `--ink-subtle` | `#8A90A3` | Tertiary, metadata |
| `--line` | `#E4E1D8` | Borders, rules |

### Semantic
| Token | Value | Use |
|---|---|---|
| `--positive` | `#1F6D4A` | Available |
| `--warning` | `#8A6212` | Reserved |
| `--critical` | `#9B2C2C` | Sold, errors |

### Contrast verification (WCAG 2.1)
| Pair | Ratio | Verdict |
|---|---|---|
| `--ink` on `--canvas` | 15.8 : 1 | AAA |
| `--ink-muted` on `--canvas` | 6.4 : 1 | AA (all sizes) |
| `--ink-subtle` on `--canvas` | 3.5 : 1 | AA large / non-text only |
| `--royal` on `--canvas` | 10.9 : 1 | AAA |
| `--canvas` on `--royal` | 10.9 : 1 | AAA |
| `--gold-bright` on `--royal-abyss` | 8.9 : 1 | AAA |
| `--gold` on `--canvas` | 3.6 : 1 | Non-text / large only — never body copy |

`--ink-subtle` and `--gold` are restricted by rule, not by convention: they appear only
on rules, icons, and text at 18 px+ semibold or larger.

## 3. Typography

| Role | Family | Notes |
|---|---|---|
| Display | Cormorant Garamond, 300/400/500/600 | Headings, prices, gem names. High-contrast old-style serif — reads as jewellery-trade, not tech. |
| Body / UI | Inter, 400/500/600 | Copy, labels, controls, tables. |
| Numeric | Inter with `tabular-nums` | Specification tables and prices, so digits align in columns. |

**Scale** (fluid, `clamp()`-driven):

| Step | Size | Use |
|---|---|---|
| `display-1` | 2.75 → 5rem | Hero |
| `display-2` | 2.25 → 3.5rem | Page titles |
| `display-3` | 1.75 → 2.5rem | Section headings |
| `title` | 1.25 → 1.5rem | Card and block headings |
| `body-lg` | 1.0625 → 1.125rem | Lead paragraphs |
| `body` | 1rem | Default |
| `small` | 0.875rem | Metadata |
| `eyebrow` | 0.75rem, `0.18em` tracking, uppercase | Section labels |

**Rules.** Measure capped at 68ch. Display serif never below 1.25rem. Eyebrows always
paired with a heading, never used alone as a heading.

## 4. Spacing, radius, elevation

Spacing is an 8 px scale (`4 8 12 16 24 32 48 64 96 128`). Section rhythm is `96px`
desktop / `64px` mobile.

Radius: `--r-sm 4px`, `--r-md 8px`, `--r-lg 14px`, `--r-full 999px`. Images and cards use
`--r-md`; pills use `--r-full`.

Elevation is deliberately restrained — this is a print-derived aesthetic, not a
material one. Three levels only:
- `--shadow-1` hairline card lift
- `--shadow-2` hover lift on interactive cards
- `--shadow-3` lightbox / overlay

## 5. Motion

| Token | Value |
|---|---|
| `--ease` | `cubic-bezier(0.22, 0.61, 0.36, 1)` |
| `--dur-fast` | `140ms` |
| `--dur` | `240ms` |
| `--dur-slow` | `420ms` |

Motion is limited to opacity, transform, and colour. **All motion is disabled under
`prefers-reduced-motion: reduce`**, implemented as a global rule rather than per
component so it cannot be forgotten.

## 6. Components

| Component | Rules |
|---|---|
| `Button` | Variants `primary` (royal fill), `secondary` (royal outline), `ghost`, `gold` (dark grounds only). Minimum target 44×44 px. |
| `GemCard` | Square image well on `--surface-sunken`, gem centred. Below: lot code + variety, caption, carat/shape/treatment row, price. Whole card is one link; wishlist button is a sibling control, never nested inside the link. |
| `Badge` | `natural` (gold outline), `heated` (royal tint), `pair`, `status`. Always paired with text — never colour alone (NFR-13). |
| `GemGallery` | Thumbnail rail + main image; click opens a lightbox with Escape-to-close and a focus trap. |
| `SpecTable` | Two-column definition list, `tabular-nums`, hairline rules. |
| `FilterPanel` | Desktop sidebar, mobile drawer. Every control is a real, labelled `input`. |

## 7. Accessibility commitments

- Single visible focus style everywhere: `2px` `--cornflower` ring, `2px` offset. Never removed.
- "Skip to content" as the first focusable element.
- One `<h1>` per page; heading levels never skipped.
- Landmarks: `header`, `nav`, `main`, `footer`.
- Alt text names the actual stone — `"HR16 — 5.35 ct royal blue cushion-cut Ceylon sapphire, held in tweezers"` — never `"gem"` or `""`.
- Filter results announced via a polite live region.
- Lightbox: focus trapped, restored on close, Escape closes.
- Full keyboard operability; no hover-only affordances.

## 8. Dark mode

Supported. The canvas becomes `--royal-abyss` and ink inverts, **but gem image wells stay
on a light neutral mat** — preserving the §1 principle in both themes. Implemented with
`prefers-color-scheme` over the same token names, so no component changes.

---

## 9. Interaction & HCI patterns

Added in the usability pass. Each entry names the problem observed, the
principle it violated, and what was done — so a future change can tell whether
it is safe to remove.

### 9.1 Visibility of system status (Nielsen #1)

| Problem | Response |
|---|---|
| Clicking a stone produced no feedback until the next page painted. | A top progress bar, deliberately delayed by **250 ms** — static routes are usually faster than that, and showing it immediately would *add* perceived latency rather than remove it. It creeps toward 88% and never reaches 100 until arrival, because a full bar implies completion. |
| Saving a stone changed only the bookmark's fill — easy to miss, and silent to a screen-reader user who had not moved focus. | A toast that both shows and announces (`role="status"`), carrying **Undo** wherever the action is reversible. Announcements live in a separate `sr-only` node so dismissing the visual toast never removes them from the accessibility tree. |

### 9.2 Recognition over recall (Nielsen #6)

Active filters previously existed only inside the panel — collapsed behind a
button on mobile. The buyer had to remember what they had set and reopen a
drawer to change any of it.

**Removable chips** now sit directly above the results: current state is
continuously visible, and each constraint is independently reversible in one
tap. Each chip's accessible name states the outcome (`Remove filter: Unheated`),
not just the label, so it is unambiguous out of visual context.

### 9.3 User control and freedom (Nielsen #3)

Losing a carefully narrowed result set is among the most common frustrations in
catalogue browsing. The filtered view is now recorded in `sessionStorage`, and a
stone page offers **"Back to your filtered results"** — shown only when there is
a filtered view worth returning to, so it never duplicates the breadcrumb
immediately above it.

### 9.4 Error prevention (Nielsen #5)

The enquiry form validated only on submit. It now validates **on blur**, and
only for fields the user has actually visited — warning about an empty field
they have not reached yet is noise, not help. Once a field is flagged it
re-validates as they type, so the error clears the moment it is fixed.

The 4,000-character cap was invisible; a counter now appears at 75% and turns
amber at 90%. Shown from character one it would be a distraction.

### 9.5 Fitts's law

The stone page is long — gallery, price, description, an eleven-row
specification table, related stones — so on mobile the single conversion action
scrolled out of reach almost immediately. A **sticky action bar** keeps price and
Enquire within thumb reach, appearing only once the real button has scrolled
past the upper 60% of the viewport so the two never compete for the same tap.

It is `aria-hidden`: it duplicates controls already in the document, and
announcing them twice would be noise.

### 9.6 Decision support

The copy told buyers that two lots were "worth comparing side by side" with no
way to do it. **`/compare`** puts saved stones in a fixed-layout table:

- **Equal columns** via `table-fixed` + `colgroup`. Under auto layout the longest
  caption stretched one column, images rendered at different sizes, and the
  comparison stopped being a comparison.
- **Price per carat is computed**, because it is the figure that makes stones of
  different weights genuinely comparable and almost nobody works it out.
- **Rows that differ are ruled and bolded; rows that agree are dimmed, not
  hidden** — hiding them would break the row alignment that makes the table
  scannable, and "these are all the same" is itself useful.
- Header cells are **top-aligned** so every image starts at the same y, whether
  or not a stone carries a badge.

A persistent **selection bar** appears at two or more saved stones, keeping the
selection visible and putting the next action next to the thing it acts on.

### 9.7 Target size (WCAG 2.2 SC 2.5.8)

An audit found 15 interactive targets under 24×24 px, mostly footer links at
17 px tall. They are now `inline-flex` with `min-h-6`, meeting the criterion
without changing the visual rhythm (list spacing was reduced to compensate).

### 9.8 What could not be verified here

The sticky bar's reveal depends on scroll events and `requestAnimationFrame`,
both of which the browser **pauses whenever `document.hidden` is true** — correct
behaviour for a backgrounded page, and the state of the automated harness. The
end-to-end reveal was therefore not exercised.

The *decision* was extracted to `shouldRevealStickyBar()` in `src/lib/ui.ts` and
is pinned by six unit tests. The remaining unverified surface is the listener
plumbing, which is standard browser API. **This should be checked by hand on a
real phone before launch.**

# Design System — "Royal Blue Sapphire"

Version 1.0 · 2026-09-08

---

## 1. Design principle

**The stone is the hero. Everything else recedes.**

**White theme, always.** Every surface is white or a near-white neutral, on every
device, including ones set to dark mode (§8). The royal blue sapphire identity is
carried by type and accents rather than by coloured backgrounds: the logo, headings,
buttons, links, prices, active states and the focus ring are royal blue; section
labels, rules and small details are gold.

The deciding constraint is what sits behind a photograph of a gem. The photography is
shot on pale grey backgrounds; gemmological practice is to judge colour against a
neutral light ground. So every stone photograph sits on a light neutral **mat**
(`--color-sunken`), which separates the photo from the white page without changing
how the stone's colour reads.

*History:* 1.0 used a warm ivory canvas with navy hero, footer and call-to-action
bands, plus an automatic dark mode. Replaced 2026-09-17 with this white theme at the
owner's request.

## 2. Colour tokens

Defined once in `src/app/globals.css` as Tailwind `@theme` tokens. Never hard-code a
hex value in a component.

### Brand — the sapphire scale
| Token | Value | Use |
|---|---|---|
| `--color-royal-deep` | `#0B1838` | Display headings, logotype |
| `--color-royal` | `#16327E` | Primary brand blue: buttons, prices, links, active states |
| `--color-royal-bright` | `#2B57C4` | Hover states, focus ring |
| `--color-mist` | `#DCE5FA` | Tinted panels and chips, always at reduced opacity |

### Metal — the setting
| Token | Value | Use |
|---|---|---|
| `--color-gold` | `#826424` | Section labels (eyebrows), check icons, saved state. **Text-safe.** |
| `--color-gold-bright` | `#C9A961` | Hairlines and the logo outline only. **Never text** (2.3 : 1). |

### Neutral — the canvas
| Token | Value | Use |
|---|---|---|
| `--color-canvas` | `#FFFFFF` | Page ground |
| `--color-surface` | `#FFFFFF` | Cards, panels |
| `--color-sunken` | `#F5F5F3` | Image mats, footer, wells |
| `--color-ink` | `#0F1729` | Body text |
| `--color-ink-muted` | `#5A6178` | Secondary text |
| `--color-ink-subtle` | `#687084` | Metadata, lot codes, footnotes |
| `--color-line` | `#E6E6E2` | Borders, rules |

### Semantic
| Token | Value | Use |
|---|---|---|
| `--color-positive` | `#1F6D4A` | Available |
| `--color-warning` | `#8A6212` | Reserved |
| `--color-critical` | `#9B2C2C` | Sold, errors |

### Contrast verification (WCAG 2.1 AA)

Measured, not estimated. Text needs 4.5 : 1; focus rings and icons need 3 : 1.
Every text colour is checked against **both** grounds it can sit on.

| Colour | On white | On `sunken` | Verdict |
|---|---|---|---|
| `ink` `#0F1729` | 17.9 : 1 | 16.4 : 1 | AAA |
| `ink-muted` `#5A6178` | 6.2 : 1 | 5.6 : 1 | AA |
| `ink-subtle` `#687084` | 5.0 : 1 | 4.5 : 1 | AA |
| `royal` `#16327E` | 11.7 : 1 | 10.7 : 1 | AAA |
| `royal-bright` `#2B57C4` (focus ring) | 6.4 : 1 | 5.9 : 1 | AA |
| `gold` `#826424` | 5.5 : 1 | 5.1 : 1 | AA |
| `positive` / `warning` / `critical` | 6.3 / 5.5 / 7.5 : 1 | 5.8 / 5.0 / 6.9 : 1 | AA |
| White on `royal` (buttons) | 11.7 : 1 | — | AAA |
| White on `gold` (saved-count badge) | 5.5 : 1 | — | AA |

**Two 1.0 failures fixed in the process.** The 1.0 table limited `ink-subtle`
(`#8A90A3`, 3.2 : 1 on white) and `gold` (`#A8863A`, 3.4 : 1) to large text, but the
code used both for 12–13 px text: lot codes, footnotes and every section label. The
rule was documented and not followed. Instead of relying on that rule, both tokens
were darkened until any size of text passes.

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

- Single visible focus style everywhere: `2px` `--color-royal-bright` ring, `2px` offset (6.4 : 1 on white). Never removed.
- "Skip to content" as the first focusable element.
- One `<h1>` per page; heading levels never skipped.
- Landmarks: `header`, `nav`, `main`, `footer`.
- Alt text names the actual stone — `"HR16 — 5.35 ct royal blue cushion-cut Ceylon sapphire, held in tweezers"` — never `"gem"` or `""`.
- Filter results announced via a polite live region.
- Lightbox: focus trapped, restored on close, Escape closes. Rendered into `<body>` through a portal. The desktop gallery column is `position: sticky`, which creates its own stacking context, so rendered in place the site header covered the lightbox's close button.
- Full keyboard operability; no hover-only affordances.

## 8. No dark mode

The site stays white regardless of the visitor's device setting. Three measures keep
it that way:

1. No `prefers-color-scheme: dark` rules exist in the stylesheet.
2. Tailwind's `dark:` variant is rebound to a `.dark` class that is never set
   (`@custom-variant dark` in `globals.css`). A `dark:` utility added later does
   nothing, instead of silently repainting the site navy on dark-mode devices.
3. `color-scheme: light` is declared, so native controls (selects, inputs,
   scrollbars) also stay light, and the browser theme colour is white.

Verified by emulating a dark-mode device: page, header, footer, lightbox and form
controls all render white.

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

### 9.9 Sharing a stone

Buyers rarely decide alone — a stone is forwarded to a partner, a jeweller or a
family member before anyone enquires. Previously that meant copying the address
out of the browser bar, which on a phone is awkward enough that people screenshot
the page instead, losing the price, the specification and the link back.

Each stone page offers **WhatsApp**, **Copy link**, and the system share sheet
where the browser provides one. WhatsApp is named explicitly rather than hidden
behind the share sheet because it is how this market actually forwards things.

The WhatsApp link is built from the canonical URL **on the server**, so it is a
real link in the HTML that works before JavaScript loads. Copy and native share
use the address actually being viewed, so a filtered or tracked URL is preserved.

Copying tries the modern clipboard API, then falls back to a selected off-screen
field. The modern API is refused more often than expected — it requires a secure
context and a focused document — and it was in fact refused during verification.
If both fail, the toast shows the address itself rather than telling the visitor
to go and find it.

### 9.10 Recently viewed

The wishlist holds what someone deliberately saved. With 24 individual stones,
people also compare by opening several and going back, so the collection page
ends with the last three stones this browser opened. Stored locally, rendered
only after mount, and never shown on a stone's own page for the stone itself.

## 10. Print

Trade buyers print a stone, or save it as a PDF, to take to a client or a setter.
Default browser printing wastes the first page on navigation and drops the
photograph, so a stone page is reshaped for paper rather than merely tolerated:

- Header, footer, sticky bars, toasts and every control are removed (`.no-print`).
- The canonical URL is printed under the title (`.print-only`). A sheet read away
  from the browser otherwise has no way back to the stone.
- Photographs and specification rows never split across a page.
- The stone's mat and the gold rules are preserved with `print-color-adjust`,
  because the mat is the neutral ground the colour is judged against.
- The sticky gallery column is reset to static, which otherwise confuses
  pagination.

**Verified structurally, not visually.** The rules were evaluated against a live
stone page: 10 elements drop out (header, footer, all controls) while the
heading, price, specification table, photograph and printed address survive. The
actual printed output has not been inspected — worth one Cmd-P before relying on
it for a client.

## 11. The article section

Eight articles live under `/guide`, indexed at `/guide` with six quick tips in
front of them. Four were added 2026-10-04: reading colour, inclusions and
clarity, cut and shape, matched pairs.

**Every article is illustrated with a stone in the collection**, never stock
photography, and each figure links to the lot it shows (`ArticleFigure`,
`ArticleCompare`). This is a constraint, not a flourish: a claim about
saturation has to be true of a stone that is on sale one click away, and a
reader learning what to look for can go straight to the example. It also means
the library updates itself as the catalogue does — a sold stone's article
figure still teaches, and still leads somewhere useful.

Article metadata (image, alt text, reading time, blurb) lives in `GUIDE_PAGES`
in `src/lib/site.ts`, which drives the index, the footer column, the "keep
reading" rail and the sitemap. Adding an article is a page file plus an entry
there.

**Typography defect fixed in the process.** Article body styles were written as
Tailwind arbitrary variants referencing the custom type classes
(`[&>h2]:t-display-3`). Tailwind can only generate real utilities that way, so
none of it applied; combined with Preflight resetting heading sizes to inherit,
every heading in every article rendered at 16 px against 17 px body text — i.e.
smaller than the paragraphs around it, since the first four articles shipped.
Now plain CSS in `.article-prose` (globals.css): headings measure 33.6 px
against 17 px body.

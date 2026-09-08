# Test Plan & Results — SerendiaGems.com

Version 1.0 · Executed 2026-09-08 · Build `next 15.5.25`, Node 21.1.0

---

## 1. Strategy

Three layers, each chosen for what it can prove that the others cannot.

| Layer | Tool | Proves | Count |
|---|---|---|---|
| Unit / data integrity | Vitest | Pure logic is correct; the catalogue is internally consistent and its copy obeys the provenance rule | 79 |
| Integration (HTTP) | Node smoke harness | The **built artefact** serves correct status codes, content, structured data, and headers over the wire | 52 |
| Manual / exploratory | Browser, DOM inspection | Rendering, responsive behaviour, real interaction, accessibility semantics | 14 |

**Deliberately not used:** Playwright. At 1.0 there is no multi-step transactional flow to drive; the smoke harness covers real HTTP and the DOM checks cover interaction. Playwright earns its cost at 2.0 when checkout exists.

## 2. Automated results

### 2.1 Unit — 79 passed, 0 failed

```
✓ tests/format.test.ts     (5)
✓ tests/ui.test.ts         (6)
✓ tests/seo.test.ts        (7)
✓ tests/validation.test.ts (13)
✓ tests/inventory.test.ts  (17)
✓ tests/catalog.test.ts    (31)
```

Coverage of note:

- **Data integrity** — 24 lots present, codes unique and URL-safe, weights and prices positive, LKR/USD ratio consistent (catches transcription slips), every referenced image resolves on disk, every image has a blur placeholder.
- **Copy provenance (SRS §6)** — the trust guarantee is enforced *mechanically*: lots marked `pending` must carry no images, must state colour as "awaiting photography", and their prose is regex-scanned for observational vocabulary (`vivid`, `saturated`, `cornflower`, `magenta`, …). A future edit that adds invented colour detail to an unphotographed lot fails the build.
- **Filtering** — OR within a facet, AND across facets, inclusive bounds, empty-result safety, no mutation of the source array.
- **Sorting** — every key ordered correctly; stability verified by sorting a reversed input and asserting identical output (prevents flicker).
- **URL round-trip** — full state survives serialise → parse unchanged; unknown/garbage values are dropped rather than thrown on.
- **Enquiry schema** — length caps, email format, honeypot contract, whitespace trimming.
- **Rate limiter** — allows to the limit, blocks past it, isolates callers.

### 2.2 HTTP smoke — 52 passed, 0 failed

Run against `next start` on the production build.

| Group | Verified |
|---|---|
| Primary routes (10) | 200 + expected copy on home, collection, about, contact, terms, wishlist, all four guides |
| Lot pages | All 24 render with valid `Product` JSON-LD carrying the correct `sku` |
| SEO | `sitemap.xml` lists all 24 lots and the guides; `robots.txt` disallows `/api/` and points at the sitemap; canonical, OG, `Organization`, `Offer` (price 11700), `BreadcrumbList` present |
| Accessibility | Skip link, `main` landmark, exactly one `h1`, `lang` attribute, descriptive alt naming the lot |
| Crawlability | The collection HTML links all 24 lots **with JavaScript disabled** |
| Security headers | `nosniff`, `DENY`, `strict-origin-when-cross-origin`, `Permissions-Policy` present, `x-powered-by` suppressed |
| Enquiry API | 400 + field errors on bad input; 200 on valid; honeypot answered 200 silently; flood from one IP rate-limited; `GET` → 405 |
| Errors | Unknown lot → 404 with the branded page, not a stack trace |

## 3. Manual verification

| # | Check | Result |
|---|---|---|
| M-01 | Home hero renders; flagship stone reads true against the light mat | Pass |
| M-02 | Collection grid renders 24 cards, images load | Pass |
| M-03 | PDP (HR16, HR19) — gallery, price, CTAs, highlights, spec table | Pass |
| M-04 | Light theme (primary) | Pass |
| M-05 | Dark theme — image mats stay light per design principle §1 | Pass |
| M-06 | Mobile 375 px — single column, gallery, thumbnail rail, scaled type | Pass |
| M-07 | Filter click → URL `?treatment=natural`, 9 results, correct lots | Pass |
| M-08 | Live region announces "9 stones matching 1 filter" | Pass |
| M-09 | Checkbox labels correctly associated (`labels.length === 1`) | Pass |
| M-10 | Number-input labels resolve to the right input | Pass |
| M-11 | No duplicate DOM ids with the mobile drawer open | Pass *(after fix — see §4)* |
| M-12 | Images delivered as AVIF with responsive `srcset` | Pass |
| M-13 | Image cold-encode 0.10–0.18 s, warm 1.4 ms | Pass |
| M-14 | Blur placeholders visible during load | Pass |

## 4. Defects found and fixed

All found during this cycle; all fixed and re-verified.

| ID | Severity | Defect | Root cause | Fix | Verified by |
|---|---|---|---|---|---|
| D-01 | **High** | Opening the mobile filter drawer duplicated four DOM ids (`minUsd`, `maxUsd`, `minCt`, `maxCt`). Tapping a label in the drawer focused the *hidden desktop* input — broken for keyboard and screen-reader users, and invalid HTML (WCAG 4.1.1). | The same panel JSX was mounted twice: in the visually-hidden desktop sidebar and in the drawer. | Panel became a function of a `scope` prefix; ids are now `minUsd-sidebar` / `minUsd-drawer`. | DOM assertion: `duplicateIds: []`, drawer label resolves to the drawer input |
| D-02 | Medium | Home page emitted no canonical URL and no Open Graph tags (NFR-06). Every other route had them. | The root layout supplies title/description defaults, but canonical and OG are per-route; `app/page.tsx` had no `metadata` export. | Added `buildMetadata` to the home page. | Smoke: "home sets a canonical URL", "home sets Open Graph tags" |
| D-03 | Medium | Honeypot logic in the API route was unreachable dead code — the Zod schema rejected a filled honeypot with 400, revealing to an attacker exactly which field is the trap. | Schema used `z.string().max(0)`, so validation failed before the route's silent-accept branch ran. | Schema now accepts the field; the route detects it and answers 200. | Smoke: "honeypot accepted silently"; unit test updated to assert the new contract |
| D-04 | Low | Facet counts read as "Blue Sapphire9" to a screen reader. | Count text sat inside the label with no separator. | Count is now `aria-hidden`, with a visually-hidden ", 9 stones" for assistive tech. | DOM inspection |
| D-05 | Trivial | Invalid Tailwind arbitrary value in the home page colour band (`to-[#E playing]`). | Typo. | Corrected to `to-[#E86AAE]`. | Build + visual |

### Non-defects investigated

Recorded so they are not re-investigated later:

- **Gem images appeared blank in screenshots.** Not a defect. The Browser pane was hidden, and a hidden pane does not composite images into captures. DOM inspection confirmed `complete: true`, correct `naturalWidth`, `opacity: 1`, `object-fit: cover`. Images render correctly when the pane is visible.
- **Price appeared as `$$11,700`.** Not a defect. `$` is escaped as `$$` in the React Server Component flight payload. Rendered HTML is `$11,700`.

## 5. Performance measurements

| Metric | Budget | Measured | Verdict |
|---|---|---|---|
| Shared first-load JS | < 120 KB | **103 KB** | Pass |
| Largest route JS (`/collection`) | — | 129 KB total | Pass |
| Hero image, mobile variant (640 w) | < 90 KB | **47 KB** AVIF | Pass |
| 1080 w variant | — | 98 KB AVIF | Pass |
| Image cold encode | — | 0.10–0.18 s | Pass |
| Image warm serve | — | 1.4 ms | Pass |
| Static routes generated | all catalogue routes | **39 of 40** (only `/api/enquiry` dynamic) | Pass |
| Source photography | — | 31 MB → 7.8 MB masters → AVIF at request | Pass |

## 6. Requirements coverage

Every **Must** requirement is demonstrated:

| Req | Evidence |
|---|---|
| FR-01 | Smoke: all 24 lots reachable; unit: inventory length |
| FR-02, FR-03 | Unit: 9 filter tests; manual M-07 |
| FR-04 | Unit: URL round-trip; manual M-07 (`?treatment=natural`) |
| FR-05 | Unit: 6 sort tests incl. stability |
| FR-06 | Build output: `● /gem/[code]` with 24 paths |
| FR-07 | Manual M-03 |
| FR-08 | Unit: caption/description/colourNote present and weight-referencing |
| FR-09 | Manual M-03 ($11,700 / LKR 3,510,000); unit: format tests |
| FR-10 | Smoke: 4 enquiry API checks |
| FR-11 | Manual: wishlist provider, header count |
| FR-12 | Smoke: all four guide routes |
| FR-13, FR-14 | Smoke: 8 SEO checks |
| NFR-04, NFR-05 | Smoke: 5 a11y checks; manual M-08…M-11 |
| NFR-06 | Smoke: canonical + OG (after D-02) |
| NFR-09 | `tsc --noEmit` exit 0 |
| NFR-11 | Smoke: 5 header checks |
| NFR-12 | Unit: 17 inventory tests |

## 7. Known limitations

Honest statement of what 1.0 does **not** prove:

1. **Rate limiting is per-instance.** In-memory; on a multi-instance deployment it degrades to per-instance. Acceptable at expected volume; interface is a drop-in for a shared store.
2. **Enquiry delivery is not wired.** Validated, rate-limited and logged server-side; the transport needs the merchant's provider credentials. One-function integration point, marked in the route.
3. **No automated colour-contrast tooling ran.** Ratios were computed and documented in the design system, but an automated axe/Lighthouse pass should run against the deployed URL.
4. **No cross-browser matrix executed.** Verified in the Chromium-based Browser pane only. Safari and Firefox verification is a go-live task.
5. **Contact details are placeholders.** Must be replaced before go-live — see the deployment runbook §1.

## 8. Regression command

```bash
npm run verify      # typecheck + 66 unit tests + production build
npm start &         # then
npm run smoke       # 52 HTTP checks against the built artefact
```

---

## 9. Usability pass — findings and results

An HCI audit against Nielsen's heuristics, Fitts's law and WCAG 2.2, followed by
remediation. Patterns and rationale are in `docs/03-design-system.md` §9.

### 9.1 Findings

| # | Finding | Principle | Status |
|---|---|---|---|
| U-01 | Active filters invisible unless the panel was open; no way to remove one individually | Nielsen #6, #3 | Fixed — removable chips |
| U-02 | No feedback between clicking a stone and the page arriving | Nielsen #1, Doherty | Fixed — delayed progress bar |
| U-03 | No way to compare stones, though the copy told buyers to | Decision support | Fixed — `/compare` + selection bar |
| U-04 | No visible route back to a filtered result set | Nielsen #3 | Fixed — "Back to your filtered results" |
| U-05 | Form validated only on submit; 4,000-char cap invisible | Nielsen #5 | Fixed — blur validation + counter |
| U-06 | Mobile: the single conversion action scrolled out of reach | Fitts's law | Fixed — sticky action bar *(see §9.3)* |
| U-07 | Saving a stone gave no confirmation | Nielsen #1 | Fixed — toast with Undo |
| U-08 | 15 interactive targets under 24×24 px | WCAG 2.2 SC 2.5.8 | Fixed — `min-h-6` on link targets |

### 9.2 Defects found while building the fixes

| ID | Severity | Defect | Fix |
|---|---|---|---|
| D-06 | Medium | Compare table used auto layout, so the longest caption stretched one column: stone images rendered at different sizes and rows did not align — defeating the purpose of a comparison. | `table-fixed` + `colgroup` for equal columns; header cells top-aligned so images start at the same y regardless of badges. |
| D-07 | Medium | The Pages deploy workflow ran its smoke suite through `serve -s`, which is SPA mode and rewrites every path to `index.html` — turning each route check into a false pass. It also swallowed the result with `\|\| true`. | Replaced with a plain static file server matching how Pages resolves directory URLs, and removed `\|\| true` so a failing check fails the deploy. |

### 9.3 Verification

| Check | Result |
|---|---|
| Filter chips render for each active filter | Pass |
| Removing a chip updates the URL and results (`?variety=Blue+Sapphire&treatment=natural` → `?variety=Blue+Sapphire`, 2 → 9 stones) | Pass |
| Live region announces "9 stones matching 1 filter" | Pass |
| Filtered view recorded for the back-link | Pass |
| Selection bar appears at 2+ stones with thumbnails and remove controls | Pass |
| Compare table: equal columns, aligned images, price/ct computed, lowest-per-carat badged | Pass |
| Compare table: differing rows ruled and bolded, identical rows dimmed | Pass |
| Unit + smoke suites after changes (79 / 59 full / 50 static) | Pass |
| **Sticky bar reveal on scroll** | **Not verified — see below** |

**Not verified.** The sticky bar depends on scroll events and
`requestAnimationFrame`. Both were confirmed to be paused in the harness
(`document.hidden === true`, `visibilityState: "hidden"`) — correct browser
behaviour for a backgrounded page, and not an application fault. Two
implementations (IntersectionObserver, then a scroll listener) were both
unexercisable for this reason.

The decision was extracted to `shouldRevealStickyBar()` and pinned by six unit
tests covering the threshold, viewport scaling, and the top-of-page case. The
unverified remainder is the listener plumbing. **Check by hand on a real phone
before launch** — it is the only part of this pass without end-to-end evidence.

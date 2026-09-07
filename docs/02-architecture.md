# Architecture & Design — SerendiaGems.com

Version 1.0 · 2026-09-08 · Companion to `01-requirements-srs.md`

---

## 1. Architectural drivers

Ranked. Where drivers conflict, the higher one wins.

1. **Trust.** A stranger is being asked to consider a USD 11,700 stone. Every choice — typography, image fidelity, honesty of copy, absence of dark patterns — serves credibility.
2. **Discoverability.** Organic search is the primary acquisition channel for "unheated Ceylon blue sapphire 5ct". This forces server-rendered HTML with complete structured data.
3. **Speed on a phone on mobile data.** The buyer is often browsing on a phone. Images are the payload; everything else must be small.
4. **Low operating cost and low operational risk.** A 24-lot inventory should not require a database, a server, or a night pager.

## 2. Style: static-first, progressively enhanced

```
                Build time                          Request time
┌──────────────────────────┐              ┌────────────────────────────┐
│ src/data/inventory.ts    │              │ CDN edge                   │
│  (typed, version-        │──generates──▶│  · pre-rendered HTML       │
│   controlled catalogue)  │              │  · immutable JS/CSS        │
└──────────────────────────┘              │  · on-demand image variants│
             │                            └──────────────┬─────────────┘
             ▼                                           │
   next build ── 30+ static routes                       ▼
     · /                                       ┌────────────────────┐
     · /collection                             │ Client islands     │
     · /gem/[code]  × 24                       │  · filter panel    │
     · /guide/*  · /about · /contact           │  · gallery/lightbox│
     · /sitemap.xml · /robots.txt              │  · wishlist store  │
                                               └─────────┬──────────┘
                                                         │ POST
                                               ┌─────────▼──────────┐
                                               │ /api/enquiry       │
                                               │ Zod validation,    │
                                               │ rate limit, then   │
                                               │ pluggable delivery │
                                               └────────────────────┘
```

**Consequence:** the site has no database, no session store, and no stateful server.
Everything a search engine or a buyer needs is in the initial HTML. Interactivity is
added by small client components that hydrate independently.

## 3. Technology decisions

| Decision | Choice | Why | Alternative rejected |
|---|---|---|---|
| Framework | Next.js 15.5 (App Router) | Static generation with per-route control, first-class image optimisation, file-based routing, mature. Pinned to the 15.5 line — actively backported, and the largest body of stable ecosystem support. | Next 16 (newer, thinner ecosystem support at time of build); Astro (weaker interactive story); plain Vite SPA (fails driver #2 outright) |
| Language | TypeScript, `strict` | The catalogue is the product. A typo in a lot code must fail the build, not a sale. | JavaScript |
| Styling | Tailwind CSS v4 with a design-token layer | Tokens defined once as CSS custom properties; utilities compose against them. No runtime cost, no naming debates. | CSS-in-JS (runtime cost); vanilla CSS (drift across 30 routes) |
| Data | Typed module compiled into the bundle | 24 lots, changing weekly at most. A build-time module gives full type safety, atomic reviewable diffs, zero query latency, zero infrastructure. | Headless CMS (cost + latency + a second system to secure); SQLite (needs a server) |
| Validation | Zod | One schema, shared between client hints and server enforcement. | Hand-rolled validators (drift) |
| Testing | Vitest + a Node smoke harness | Fast unit and data-integrity coverage plus real HTTP verification of the built artefact, without a 300 MB browser download in CI. | Playwright (justified at 2.0 when checkout exists) |
| State | URL for filters, `localStorage` for wishlist, React state locally | Filter state belongs in the URL because it must be shareable. Nothing else is global. | Redux/Zustand — no problem here needs them |

### 3.1 Why the catalogue is code, not a CMS

This is the decision most likely to be questioned, so it is recorded explicitly.

At 24 lots with low turnover, a CMS adds an API call on every render, a second access
control surface, a monthly bill, and an outage mode — in exchange for letting a
non-engineer edit copy. The trade is not worth it yet. The data module is deliberately
shaped like a CMS response (`Gem[]` behind a repository module in `src/lib/catalog.ts`),
so when turnover justifies a CMS the swap touches one file and no components.

**Migration trigger:** more than ~150 lots, or inventory edits more than weekly.

## 4. Module structure

```
src/
├── app/                        Routing layer only — thin, mostly server components
│   ├── layout.tsx              Shell: fonts, header, footer, skip-link, JSON-LD
│   ├── page.tsx                Home
│   ├── collection/page.tsx     Catalogue (server) + filter island (client)
│   ├── gem/[code]/page.tsx     PDP, generateStaticParams over all lots
│   ├── guide/                  Editorial: ceylon-sapphires, heat-treatment,
│   │                           buying-guide, gemstone-care
│   ├── about/ contact/ wishlist/ terms/
│   ├── api/enquiry/route.ts    The only dynamic endpoint
│   ├── sitemap.ts robots.ts    SEO surface
│   ├── not-found.tsx error.tsx Failure states
│   └── globals.css             Design tokens + base layer
├── components/
│   ├── primitives/             Button, Badge, Container, SectionHeading, Field
│   ├── gem/                    GemCard, GemGallery, SpecTable, RelatedGems
│   ├── collection/             FilterPanel, SortSelect, ResultGrid  (client)
│   ├── layout/                 SiteHeader, SiteFooter, MobileNav
│   └── wishlist/               WishlistProvider, WishlistButton         (client)
├── lib/
│   ├── types.ts                Domain types — single source of truth
│   ├── catalog.ts              Repository: query, filter, sort, relate
│   ├── format.ts               Currency, carat, and label formatting
│   ├── seo.ts                  Metadata + JSON-LD builders
│   ├── site.ts                 Brand constants, contact details, nav
│   └── validation.ts           Zod schemas shared by form and API
└── data/
    ├── inventory.ts            The 24 lots, fully specified
    └── placeholders.ts         Generated blur data URIs
```

**Dependency rule:** `app/` → `components/` → `lib/` → `data/`. Never the reverse.
`lib/` and `data/` are framework-free and unit-testable in isolation.

## 5. Rendering strategy per route

| Route | Strategy | Rationale |
|---|---|---|
| `/` | Static | Content changes only when inventory does. |
| `/collection` | Static shell + client filter island | The full lot list ships in the HTML so crawlers and no-JS users see all 24; filtering is client-side over an in-memory array — instant, no round trip. |
| `/gem/[code]` | Static, `generateStaticParams` | 24 pages pre-built. Best possible LCP and crawlability. |
| `/guide/*`, `/about`, `/contact`, `/terms` | Static | Editorial. |
| `/wishlist` | Static shell, client-hydrated | Contents live in `localStorage`. |
| `/api/enquiry` | Node runtime, dynamic | The only route that must run per request. |

## 6. Data flow: filtering

Filtering is pure and total, which makes it trivially testable:

```
URL query  ──parse──▶  FilterState  ──┐
                                      ├──▶ applyFilters(gems, state) ──▶ Gem[]
data/inventory.ts ──▶ Gem[]  ─────────┘         (pure function)
                                                        │
                                      applySort(gems, sortKey) ──▶ Gem[]
                                                        │
                                                        ▼
                                                    ResultGrid
```

`applyFilters` and `applySort` live in `lib/catalog.ts`, take no dependencies, and are
covered by unit tests. The React layer only marshals state in and renders output.

## 7. Security posture

| Surface | Control |
|---|---|
| Enquiry endpoint | Zod schema; per-field length caps; honeypot field; in-memory per-IP rate limit (5 / 10 min); no reflection of user input into HTML. |
| Headers | HSTS, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, restrictive `Permissions-Policy`. Set in `next.config.ts`. |
| Secrets | None in the client bundle. Delivery credentials read from environment at request time only. |
| Dependencies | Four runtime dependencies. Small attack surface by design. |
| PII | Enquiry payloads are not persisted by the application. |

**Known limitation (documented, not hidden):** the rate limiter is per-instance and
in-memory. On a multi-instance or serverless deployment it degrades to per-instance
limiting. For 1.0 enquiry volumes this is acceptable; the interface in
`lib/rate-limit.ts` is a drop-in for a shared store (Upstash/Redis) when it is not.

## 8. Performance budget

| Metric | Budget |
|---|---|
| HTML per route | < 50 KB |
| First-load JS (shared) | < 120 KB |
| Hero image (mobile) | < 90 KB |
| LCP (4G, mid mobile) | < 2.5 s |
| CLS | < 0.05 |

Enforcement: no client component above the fold except the header; all imagery through
`next/image` with explicit dimensions and blur placeholders; fonts subset to `latin` with
`display: swap`.

## 9. Traceability

| Requirement | Realised by |
|---|---|
| FR-01 | `src/data/inventory.ts`, `src/lib/catalog.ts` |
| FR-02, FR-03 | `applyFilters` + `components/collection/FilterPanel` |
| FR-04 | `useSearchParams` sync in `CollectionClient` |
| FR-05 | `applySort` + `SortSelect` |
| FR-06 | `app/gem/[code]/page.tsx` `generateStaticParams` |
| FR-07 | `components/gem/GemGallery` |
| FR-08 | `caption` / `description` fields; `components/gem/SpecTable` |
| FR-09 | `lib/format.ts` |
| FR-10 | `app/api/enquiry/route.ts` + `lib/validation.ts` |
| FR-11 | `components/wishlist/WishlistProvider` |
| FR-12 | `app/guide/*` |
| FR-13, FR-14 | `lib/seo.ts`, `app/sitemap.ts`, `app/robots.ts` |
| FR-15 | `status` field, guarded CTA in PDP |
| FR-16 | `getRelatedGems` |
| FR-17 | `photography: 'pending'` state on `GemCard` |
| NFR-09 | `tsconfig.json` strict, `npm run typecheck` |
| NFR-11 | `next.config.ts` headers |
| NFR-12 | `tests/inventory.test.ts` |

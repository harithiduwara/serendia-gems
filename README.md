# Serendia Gems — SerendiaGems.com

[![CI](https://github.com/harithiduwara/serendia-gems/actions/workflows/ci.yml/badge.svg)](https://github.com/harithiduwara/serendia-gems/actions/workflows/ci.yml)

An enterprise storefront for a Ceylon (Sri Lankan) sapphire house. 24 individually
photographed and specified loose sapphires, faceted discovery, per-stone detail pages,
and an enquiry-to-purchase funnel.

**Theme:** Royal Blue Sapphire.

---

## Quick start

```bash
npm ci
npm run dev          # http://localhost:3000
```

```bash
npm run verify       # typecheck + 66 unit tests + production build
```

```bash
npm run build && npm start &
npm run smoke        # 52 HTTP checks against the built artefact
```

## Scripts

| Script | Does |
|---|---|
| `dev` | Development server on :3000 |
| `build` | Production build (39 static routes) |
| `start` | Serve the production build |
| `typecheck` | `tsc --noEmit`, strict |
| `test` | Vitest unit + data-integrity suite |
| `smoke` | HTTP suite against a running build (`SMOKE_BASE_URL` to target a deploy) |
| `verify` | typecheck → test → build |

## Documentation

Written before the code, in SDLC order. Read `01` and `02` before making changes.

| Doc | Contents |
|---|---|
| [`docs/01-requirements-srs.md`](docs/01-requirements-srs.md) | Scope, user stories, 17 functional and 13 non-functional requirements, data model, explicit out-of-scope with rationale |
| [`docs/02-architecture.md`](docs/02-architecture.md) | Architectural drivers, technology decisions and rejected alternatives, module structure, rendering strategy, security posture, traceability matrix |
| [`docs/03-design-system.md`](docs/03-design-system.md) | The "Royal Blue Sapphire" system — colour tokens with verified contrast ratios, type scale, components, accessibility commitments |
| [`docs/04-test-plan.md`](docs/04-test-plan.md) | Strategy, full results, **5 defects found and fixed**, performance measurements, requirements coverage, known limitations |
| [`docs/05-deployment-runbook.md`](docs/05-deployment-runbook.md) | **Go-live blockers**, environment, hosting, DNS/TLS, routine operations, rollback |

## Architecture in one paragraph

Static-first. The catalogue is a typed TypeScript module compiled into the bundle, so
there is no database, no API latency, and a broken lot fails the build rather than a
sale. `next build` pre-renders 39 routes including a page per stone; the only dynamic
route is the enquiry endpoint. Interactivity is added by small client islands — the
filter panel, the gallery lightbox, the wishlist store. Filter state lives in the URL so
it is shareable; the wishlist lives in `localStorage`. Full reasoning, including why
there is deliberately no CMS and no checkout, is in `docs/02-architecture.md`.

## Structure

```
src/
├── app/          Routes (mostly server components) + /api/enquiry
├── components/   primitives · gem · collection · layout · wishlist · enquiry · editorial
├── lib/          types · catalog · format · seo · site · validation · rate-limit
└── data/         inventory.ts (the 24 lots) · placeholders.ts (generated)
docs/             SDLC documentation
scripts/          smoke.mjs · generate-placeholders.sh
public/gems/      Web-optimised photography (31 MB → 7.8 MB)
```

**Dependency rule:** `app/` → `components/` → `lib/` → `data/`, never the reverse.
`lib/` and `data/` are framework-free and unit-testable in isolation.

## Two rules worth knowing before you edit

**1. Copy provenance.** Lots marked `photography: 'pending'` have never been seen by
anyone writing copy for them. Their descriptions may state only what the specification
records — never colour, clarity, or cut quality. This is enforced by a test that
regex-scans for observational vocabulary, so adding invented detail will fail the build.
It is a trust guarantee, not a style preference.

**2. Design principle.** The catalogue canvas is warm ivory, not dark navy, because the
photography is shot on pale backgrounds and a dark page would frame each stone in a
glowing rectangle and shift its perceived colour. The Royal Blue Sapphire identity is
carried by structure — masthead, hero, footer, headings, links, focus rings. Image mats
stay light **in both themes**. See `docs/03-design-system.md` §1.

## Before you deploy

`docs/05-deployment-runbook.md` §1 lists six go-live blockers. The most important:
**contact details in `src/lib/site.ts` are placeholders** and would send real customers
to a number that does not exist.

## Deploying

The app needs a Node runtime — `/api/enquiry` and `next/image` optimisation are
server-side. **GitHub Pages will not work**: static export disables the enquiry endpoint
and forces unoptimised images (500 KB JPEGs instead of 47 KB AVIF).

Vercel is the natural target. Import this repository at
[vercel.com/new](https://vercel.com/new) — the framework, build command and output
directory are all detected automatically. Set one environment variable:

```
NEXT_PUBLIC_SITE_URL = https://serendiagems.com     # no trailing slash
```

It drives canonical URLs, the sitemap and Open Graph tags, so a wrong value causes real
SEO damage. Every push to `main` then redeploys automatically.

After the first deploy, verify against the live origin:

```bash
SMOKE_BASE_URL=https://your-deployment-url npm run smoke
```

All 52 checks must pass before pointing the domain at it. Full DNS, TLS and post-launch
steps are in [`docs/05-deployment-runbook.md`](docs/05-deployment-runbook.md).

## Continuous integration

`.github/workflows/ci.yml` runs on every push and pull request to `main`: lint,
typecheck, the 66 unit tests, a production build, and the 52-check smoke suite against
the built artefact.

## Stack

Next.js 15.5 (App Router) · React 19 · TypeScript (strict) · Tailwind CSS v4 · Zod ·
Vitest. Four runtime dependencies, by design.

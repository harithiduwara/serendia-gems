# GitHub Pages Hosting — Trade-offs and Mitigations

Version 1.0 · 2026-09-08 · Supplement to `05-deployment-runbook.md`

---

## 1. Decision

The site is hosted on GitHub Pages as an interim measure. GitHub Pages is a
**static file host** — it runs no server code. This document records exactly what
that costs, what was done to mitigate it, and what remains genuinely degraded.

The static build is an **opt-in mode** (`STATIC_EXPORT=1`), not a rewrite. The
default build still produces the full Node application. Moving to Vercel or any
Node host later is a change of build command, not a migration.

| Build | Command | Target |
|---|---|---|
| Full | `npm run build` | Vercel / any Node host |
| Static | `npm run build:static` | GitHub Pages |

## 2. What breaks, and what was done about it

### 2.1 The enquiry API — mitigated

`/api/enquiry` cannot exist. `output: 'export'` refuses to build a POST route
handler at all, so `scripts/prepare-static.mjs` removes it explicitly rather than
leaving a route that would 404 at runtime.

**Mitigation.** The form detects static mode and, instead of POSTing, validates
against the *same Zod schema* and hands off to the visitor's mail client with
every field pre-filled — name, email, phone, country, lot codes, message. The
button reads "Compose enquiry email" so the behaviour is not a surprise, and the
success panel explains that they still need to press send. The contact page also
carries plain `mailto:` and WhatsApp anchors that work with JavaScript disabled.

**Residual risk.** A visitor with no configured mail client gets nothing from the
button. The direct mailto and WhatsApp links on the same page are the fallback.
This is strictly worse than a server endpoint, which posts silently and reliably.

**What is lost outright:** server-side rate limiting, the honeypot's silent
accept, and any prospect of logging enquiries centrally.

### 2.2 Image optimisation — mitigated

`next/image` optimises on demand, which needs a server. Setting
`unoptimized: true` alone would ship the full 1600 px master (~420 KB) to a
360 px phone — roughly 5 MB for one collection page.

**Mitigation.** `scripts/generate-static-variants.sh` pre-generates committed
JPEG variants at 96 / 256 / 480 / 768 / 1200 px, with quality tapering from 82 to
68 as size increases. `src/lib/image-loader.ts` is registered as a custom loader
and maps each requested width to the smallest variant that covers it, falling
back to the 1600 px master above 1200 px so the lightbox keeps full quality.
`next/image` still handles srcset, `sizes`, lazy loading and blur placeholders.

| Width | Full build (AVIF) | Static build (JPEG) | Penalty |
|---|---|---|---|
| 480 | ~36 KB | 54 KB | +18 KB |
| 768 | ~65 KB | 126 KB | +61 KB |
| 1200 | ~105 KB | 190 KB | +85 KB |

**Residual cost.** JPEG rather than AVIF/WebP, because `sips` cannot write WebP
and serving AVIF-only would exclude older browsers. Roughly 40–80 % larger per
image. This is the real, unavoidable price of static hosting here — but it is a
fraction of the ~10× regression that `unoptimized: true` would have caused.

Repository grew from 8.3 MB to ~16 MB to carry the variants. Well inside GitHub's
1 GB soft limit.

### 2.3 Security headers — NOT mitigated

`next.config.ts` `headers()` does not apply to a static export, and GitHub Pages
does not allow custom response headers. **NFR-11 is not met on this host.**

Lost: `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`,
`Referrer-Policy`, `Permissions-Policy`, and our own `Strict-Transport-Security`.

GitHub Pages does serve HTTPS with its own HSTS on `*.github.io`, so transport
security is intact. The gap is clickjacking and MIME-sniffing protection. For a
brochure site with no authentication, no cookies and no user data, the practical
risk is low — but it is a real regression and it returns the moment the site
moves to a Node host. The header definitions remain in `next.config.ts`,
unchanged, for exactly that reason.

### 2.4 Other consequences

| Item | Effect |
|---|---|
| `basePath` | Served from `/serendia-gems`, so `NEXT_PUBLIC_BASE_PATH=/serendia-gems` is set at build. With a custom domain, set it to `''`. |
| `trailingSlash` | Enabled — Pages resolves `/gem/HR16/index.html` reliably. |
| `.nojekyll` | Required. Without it Jekyll silently discards every path beginning with `_`, which would delete `/_next` and break the entire site. |
| Canonical URLs | Point at the Pages URL, so the deployed site is self-consistent. **Must be updated when the real domain launches.** |
| Redirects | Impossible. There is no way to 301 from the Pages URL to `serendiagems.com` later. |

## 3. Verification

The static export has its own smoke mode:

```bash
npm run build:static
npx serve -s out -l 4321
SMOKE_BASE_URL=http://127.0.0.1:4321 node scripts/smoke.mjs --static
```

**43 checks pass.** The suite drops the security-header and enquiry-API families
because a static host genuinely cannot satisfy them — and in their place asserts
that the mail-client fallback actually shipped in the route chunk, that the
contact page carries working `mailto:` and WhatsApp anchors, and that `404.html`
is the branded page.

The deploy workflow runs the unit tests before building and verifies the export
(24 lot pages, `404.html`, `.nojekyll`) before publishing.

## 4. SEO note

Canonical URLs currently point at `https://harithiduwara.github.io/serendia-gems`.

That is correct while this is the live site. But be aware: if search engines index
the Pages URL and `serendiagems.com` launches later, you get two indexed copies
and **no way to redirect from Pages to the real domain**. Two options:

1. **Accept it.** Update `NEXT_PUBLIC_SITE_URL` at launch; the old URL decays.
2. **Keep it out of the index while temporary.** Add `noindex` to the robots
   route for the static build. Costs nothing now, avoids the duplicate entirely.

Option 2 is the safer choice if `serendiagems.com` is going live reasonably soon.

## 5. Moving to a Node host

1. Set `NEXT_PUBLIC_SITE_URL` to the real origin; unset `NEXT_PUBLIC_BASE_PATH`,
   `NEXT_PUBLIC_STATIC_EXPORT` and `STATIC_EXPORT`.
2. Deploy with `npm run build` (not `build:static`).
3. `src/app/api/enquiry/route.ts` is still in the repository — the API, its
   validation, rate limiting and honeypot all come back with no code changes.
4. Security headers reapply automatically.
5. AVIF/WebP optimisation resumes; the committed variants become dead weight and
   `public/gems/r/` can be deleted.

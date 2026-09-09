# Deployment Runbook — SerendiaGems.com

Version 1.0 · 2026-09-08

---

## 1. Go-live blockers

**The site must not be published until these are done.** Each is a placeholder that would mislead a real customer.

| # | Item | Where | Why it blocks |
|---|---|---|---|
| ~~B-01a~~ | ~~Replace phone and WhatsApp number~~ | `src/lib/site.ts` | **Done 2026-09-09** — real number `+94 77 880 0467` in all three forms, guarded by `tests/site.test.ts`. |
| B-01b | Replace `email` and `address.street` | `src/lib/site.ts`, both marked with a warning comment | Still illustrative. `enquiries@serendiagems.com` does not resolve until the domain's mail is configured, so enquiry replies would bounce. |
| B-02 | Point `NEXT_PUBLIC_SITE_URL` at the real origin | Hosting environment variables | Canonical URLs, the sitemap and OG tags all derive from it. Wrong value = wrong canonicals = SEO damage. |
| B-03 | Confirm the return window and shipping terms are the merchant's actual policy | `src/app/terms/page.tsx` | The site currently promises a seven-day return. If that is not the policy, it is a false statement of terms. |
| B-04 | Wire enquiry delivery, or confirm console logging is acceptable | `src/app/api/enquiry/route.ts` §6 | Otherwise enquiries land only in server logs and will be missed. |
| B-05 | Add `/public/og-default.png` (1200×630) | `public/` | Social shares of the home page currently reference a missing image. |
| B-06 | Verify prices are current | `src/data/inventory.ts` | Transcribed from the January 2026 sheet. |

Recommended but not blocking: a favicon set, and replacing the founding year in `SITE.founded` if 1998 is not accurate.

## 2. Environment variables

| Variable | Scope | Required | Purpose |
|---|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Public | **Yes** | Canonical/sitemap/OG origin. No trailing slash. |
| `ENQUIRY_TO_EMAIL` | Server | No | Destination for enquiries once delivery is wired. |
| `RESEND_API_KEY` | Server | No | Provider credential, if Resend is chosen. |

Template in `.env.example`. Nothing secret is referenced from client code.

## 3. Recommended hosting

**Vercel** is the natural fit: it is the reference platform for Next.js, serves the `next/image` optimiser at the edge, and gives immutable atomic deploys with instant rollback. Netlify or Cloudflare Pages with the Next adapter both work. A self-hosted Node server also works (`npm run build && npm start`) but you then own the image cache and the CDN.

### First deploy

```bash
npm ci
npm run verify          # typecheck + tests + build — must be clean
```

Then connect the repository, set `NEXT_PUBLIC_SITE_URL`, and deploy. Build command `npm run build`, output directory `.next`, Node 20.9+.

### Post-deploy verification

```bash
SMOKE_BASE_URL=https://serendiagems.com npm run smoke
```

All 52 checks must pass against the live origin before the domain is announced.

## 4. DNS and TLS

1. Point the apex `serendiagems.com` and `www` at the host.
2. Choose one canonical host and 301 the other. `SITE.url` must match the canonical choice exactly.
3. Confirm the certificate covers both names.
4. HSTS is already sent with `preload`. **Do not submit to the preload list until you are certain every subdomain will be HTTPS forever** — it is difficult to reverse.

## 5. Post-launch tasks

Ordered by value.

1. **Submit the sitemap** to Google Search Console and Bing Webmaster Tools: `https://serendiagems.com/sitemap.xml`.
2. **Validate structured data** with Google's Rich Results Test on `/` and on two lot pages. `Product` + `Offer` make lots eligible for rich results, which matters a great deal for this catalogue.
3. **Run Lighthouse** on mobile against the live URL. Targets: Performance ≥ 90, Accessibility ≥ 95, SEO 100.
4. **Run an automated accessibility scan** (axe DevTools or Pa11y). The contrast ratios are documented but were not machine-verified.
5. **Cross-browser check** — Safari (macOS and iOS) and Firefox. Only Chromium was verified in build.
6. **Photograph the 12 remaining lots.** This is the single highest-value commercial action available. Half the catalogue currently cannot be evaluated by a buyer, and photographed lots rank ahead of pending ones in the featured order for exactly that reason. Drop new files into `Gem Lot Pics/`, run `./scripts/generate-placeholders.sh`, add the filenames to the lot and flip `photography` to `'shot'` — then replace the pending copy with real observation.
7. **Add analytics** — privacy-respecting (Plausible or Fathom) rather than Google Analytics, given the site's stated data-minimisation promise in `/terms`. Instrument enquiry submissions as the primary conversion.

## 6. Routine operations

### Adding or updating a lot

1. Edit `src/data/inventory.ts`.
2. If photographed, place images in `public/gems/` and regenerate placeholders.
3. `npm test` — the integrity suite will reject a missing image, a duplicate code, an inconsistent price ratio, or copy that breaks the provenance rule.
4. Commit and deploy. The sitemap and all static pages regenerate automatically.

### Marking a stone sold

Set `status: 'sold'` (or `'reserved'`). The card shows the state, the enquiry CTA is replaced with a "find me something similar" path, and the JSON-LD `availability` updates to `SoldOut`. **Do not delete the lot** — a sold page that 404s loses accumulated search equity; leaving it up captures buyers looking for something similar.

### Changing prices

Edit both `priceLKR` and `priceUSD`. The test suite asserts the ratio stays near 300:1 and will fail if only one is changed — this is intentional.

## 7. Rollback

Vercel and Netlify both keep immutable deploys: promote the previous one. Self-hosted, redeploy the previous commit. There is no database and no migration state, so rollback is always safe and always instant.

## 8. Monitoring

Minimum viable set for a static site with one dynamic endpoint:

- Uptime check on `/` and on `/gem/HR16` (proves static generation is serving).
- Alert on non-2xx rate for `POST /api/enquiry`.
- Watch the enquiry log for delivery failures until B-04 is closed.

## 9. Security maintenance

- Four runtime dependencies. Run `npm audit` monthly.
- Keep Next.js current within the 15.5 line; it receives backported security fixes.
- Review the rate limit if enquiry spam appears; if the site scales beyond one instance, move `lib/rate-limit.ts` to a shared store.

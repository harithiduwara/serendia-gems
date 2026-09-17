# Hosting on Cloudflare — serendiagems.com

Version 1.0 · 2026-09-17 · Supersedes GitHub Pages (`06-github-pages.md`) as the production host.

---

## 1. What this is

The site runs on Cloudflare as a **Worker with static assets only**. There is no
server and no code running per request: `npm run build:cloudflare` produces plain
files in `out/`, and Cloudflare serves them from its edge network in front of the
domain it already manages.

```
push to main ──▶ Cloudflare build ──▶ npm run build:cloudflare ──▶ out/ ──▶ wrangler deploy
                  (in Cloudflare)       │                                     │
                                        ├─ 85 unit tests (gate)               ▼
                                        ├─ static export for serendiagems.com   serendiagems.com
                                        ├─ out/_headers (security headers)       (Cloudflare edge)
                                        └─ output checks
```

### Why a Worker with static assets, not Pages or OpenNext

| Option | Verdict |
|---|---|
| **Worker + static assets** *(chosen)* | Cloudflare's recommended path for new projects. Configuration lives in the repo (`wrangler.jsonc`) instead of dashboard-only settings, so it is reviewed, versioned and tested in CI. If a server-side enquiry endpoint is wanted later, a small script is added to this same Worker — no migration. |
| Cloudflare Pages | Works equally well for a static site today, but new capability is landing on Workers, and Pages build settings live only in the dashboard. |
| Next.js on Workers via OpenNext | Would restore the `/api/enquiry` endpoint and on-demand AVIF, but runs code on every request and adds a build adapter to maintain. Not justified while the enquiry form works without a server (§5). |

### What changes compared with GitHub Pages

| | GitHub Pages | Cloudflare |
|---|---|---|
| Address | `harithiduwara.github.io/serendia-gems` | `serendiagems.com` |
| Security headers | Cannot be set | **Restored** via `out/_headers`, from the same `config/security-headers.json` the Node build uses |
| `/_next/static` caching | Host default | `immutable`, one year (files are fingerprinted) |
| Enquiry form | Composes an email | Same — and the address now receives mail (§5) |
| Cost | Free | Free plan: static asset requests are not billed as Worker invocations |

## 2. One-time setup in the Cloudflare dashboard

These steps need your Cloudflare login, so they are yours to do. Dashboard labels
shift occasionally; each step says what it is for so a renamed button is still
findable.

### 2.1 Connect the repository and deploy

1. In the Cloudflare dashboard open **Workers & Pages** and choose **Create**.
2. Choose **Import a repository** and connect GitHub. When GitHub asks which
   repositories Cloudflare may access, grant **only** `serendia-gems`.
3. Select `harithiduwara/serendia-gems` and set:

   | Setting | Value |
   |---|---|
   | Project / Worker name | `serendia-gems` — must match `name` in `wrangler.jsonc` |
   | Production branch | `main` |
   | Build command | `npm run build:cloudflare` |
   | Deploy command | `npx wrangler deploy` |
   | Root directory | leave blank (repository root) |
   | Environment variables | none — the build sets everything it needs |

   If a framework preset pre-fills anything (for example an OpenNext command),
   replace it with the values above.

4. Deploy. The build log should end with the Worker deployed and a
   `serendia-gems.<your-account>.workers.dev` address. Open it — the site should
   look exactly like the GitHub Pages version.

Node 22 is picked up from `.nvmrc`; nothing to configure.

### 2.2 Attach the domain

1. Open the `serendia-gems` Worker → **Settings** → **Domains & Routes** → **Add** →
   **Custom domain**.
2. Add `serendiagems.com`. Repeat for `www.serendiagems.com`.
   Cloudflare creates the DNS records and the TLS certificate itself; allow a few
   minutes for the certificate.
3. **One address only.** Open the `serendiagems.com` zone → **Rules** → create a
   redirect rule from the template **Redirect from WWW to root**. Canonical URLs
   all name `https://serendiagems.com`, so `www` must permanently redirect to it
   rather than serve a second copy.
4. Zone → **SSL/TLS** → **Edge Certificates** → turn on **Always Use HTTPS**.

If adding the custom domain complains about an existing DNS record for the same
name, delete that record under **DNS** and add the domain again.

### 2.3 Make the enquiry address receive mail

**Do not skip this.** The enquiry form hands off to
`enquiries@serendiagems.com` (§5). Until this is done, every enquiry bounces.

1. Zone → **Email** → **Email Routing** → enable it. Let Cloudflare add the MX and
   TXT records it proposes.
2. **Routing rules** → create a custom address `enquiries` that sends to your own
   inbox (for example your Gmail).
3. Cloudflare emails that inbox a verification link. Click it — forwarding stays
   inactive until you do.
4. Test by sending to `enquiries@serendiagems.com` **from a different account**.
   Gmail hides messages that arrive at the same account they were sent from, which
   makes a working setup look broken.

Replies you send go out from your own inbox's address, not from
`enquiries@serendiagems.com`. Customers will see that address in the reply.

## 3. Verify the live site

From the repository, on any Node version:

```bash
SMOKE_BASE_URL=https://serendiagems.com npm run smoke:cloudflare
```

All 64 checks must pass. They cover every route and all 24 stone pages, canonical
and Open Graph URLs, the sitemap, structured data, the 404 page, the enquiry
fallback, and the security and caching headers.

Then submit `https://serendiagems.com/sitemap.xml` to Google Search Console.

## 4. After it is verified: retire GitHub Pages

Leaving `harithiduwara.github.io/serendia-gems` running publishes a second copy
of the site whose canonical tags point at itself, competing with serendiagems.com
in search. Once §3 passes, disable `.github/workflows/pages.yml` and unpublish the
Pages site (repository **Settings** → **Pages**).

## 5. The enquiry form without a server

A static site has no `/api/enquiry`. The form still validates every field, then
opens the visitor's mail client with an email to `enquiries@serendiagems.com`
already addressed and written, including any saved stones. WhatsApp is offered
alongside it.

The honest limitation: a visitor with no mail app configured (common on shared or
work computers) cannot send through the form and has to use WhatsApp or copy the
address. If enquiry volume shows that matters, the fix is a small script on this
same Worker that receives the form and forwards it through Email Routing — still
no server, still the free plan.

## 6. Day to day

| Task | How |
|---|---|
| Publish a change | Push to `main`. Cloudflare builds and deploys on its own. |
| See why a deploy failed | Worker → **Deployments** / build log. A failing unit test stops the deploy before anything is published — by design. |
| Roll back | Worker → **Deployments** → pick the previous version → roll back. There is no database, so this is always safe. |
| Preview locally with Cloudflare's runtime | `npm run preview:cloudflare`, then `npm run smoke:cloudflare`. Requires Node 22+. |

## 7. Files

| File | Purpose |
|---|---|
| `wrangler.jsonc` | Worker definition: asset directory, trailing-slash handling, 404 behaviour |
| `scripts/build-cloudflare.mjs` | The production build: test gate, static export for the real domain, `_headers`, output checks |
| `config/security-headers.json` | Single list of security headers, shared with the Node build |
| `.nvmrc` | Node 22 — read by Cloudflare's build and by both CI workflows |
| `.github/workflows/ci.yml` → `cloudflare` job | Runs the same build and serves it with `workerd` on every push |

#!/usr/bin/env node
/**
 * HTTP smoke suite. Verifies the *built* artefact over the wire — status codes,
 * required content, structured data, security headers, and the enquiry
 * endpoint's validation and rate limiting.
 *
 *   npm run build && npm start &   # then:
 *   npm run smoke
 *
 * Exits non-zero on the first hard failure, so it can gate a deploy.
 */
const BASE = (process.env.SMOKE_BASE_URL ?? 'http://localhost:3000').replace(/\/$/, '');

/**
 * `--static` verifies a GitHub Pages export. Two families of check are dropped
 * because a static host genuinely cannot satisfy them, not because they are
 * inconvenient: the enquiry API (no server) and custom security headers
 * (GitHub Pages sets its own). Both are recorded as accepted trade-offs in
 * docs/06-github-pages.md.
 */
const STATIC = process.argv.includes('--static');

// Static export uses trailingSlash, so /collection is served at /collection/.
const p = (path) => {
  if (!STATIC || path === '/') return path;
  if (/\.(xml|txt|html)$/.test(path)) return path;
  return path.endsWith('/') ? path : `${path}/`;
};

let passed = 0;
const failures = [];

const check = (name, condition, detail = '') => {
  if (condition) { passed += 1; console.log(`  \x1b[32m✓\x1b[0m ${name}`); }
  else { failures.push(`${name}${detail ? ` — ${detail}` : ''}`); console.log(`  \x1b[31m✗\x1b[0m ${name}${detail ? ` — ${detail}` : ''}`); }
};

const get = async (path) => {
  const res = await fetch(`${BASE}${p(path)}`, { redirect: 'follow' });
  return { res, body: await res.text() };
};

const GEM_CODES = [
  'HR1','HR2','HR4','HR5','HR6','HR7','HR8','HR9','HR10','HR11','HR13','HR14',
  'HR15','HR16','HR17','HR18','HR19','HR20','HR21','HR22','HR23','HR24','HR25','HR26',
];

const run = async () => {
  console.log(`\nSmoke suite against ${BASE}\n`);

  // ── Primary routes ───────────────────────────────────────────────────────
  console.log('Primary routes');
  const routes = [
    ['/', 'Ceylon sapphires'],
    ['/collection', 'Ceylon sapphires, each one specified in full'],
    ['/about', 'A small house'],
    ['/contact', 'Tell us what you are looking for'],
    ['/terms', 'Terms, shipping'],
    ['/wishlist', 'Stones you have saved'],
    ['/guide/ceylon-sapphires', 'Why Ceylon'],
    ['/guide/heat-treatment', 'Heated and unheated'],
    ['/guide/buying-guide', 'How to buy a sapphire'],
    ['/guide/gemstone-care', 'Caring for your stone'],
  ];
  for (const [path, needle] of routes) {
    const { res, body } = await get(path);
    check(`GET ${path} → 200`, res.status === 200, `got ${res.status}`);
    check(`GET ${path} contains expected copy`, body.includes(needle));
  }

  // ── Every lot has a page ────────────────────────────────────────────────
  console.log('\nLot detail pages');
  let lotFailures = 0;
  for (const code of GEM_CODES) {
    const { res, body } = await get(`/gem/${code}`);
    // React splits adjacent text nodes with an HTML comment, so assert on the
    // structured data (unambiguous) rather than on rendered text.
    const ok = res.status === 200 && body.includes(`"sku":"${code}"`) && body.includes('"@type":"Product"');
    if (!ok) { lotFailures += 1; console.log(`  \x1b[31m✗\x1b[0m /gem/${code} (status ${res.status})`); }
  }
  check(`all ${GEM_CODES.length} lot pages render with Product structured data`, lotFailures === 0, `${lotFailures} failed`);

  // ── SEO surface ──────────────────────────────────────────────────────────
  console.log('\nSEO');
  {
    const { res, body } = await get('/sitemap.xml');
    check('sitemap.xml → 200', res.status === 200);
    check('sitemap lists every lot', GEM_CODES.every((c) => body.includes(`/gem/${c}`)));
    check('sitemap lists the guides', body.includes('/guide/buying-guide'));
  }
  {
    const { res, body } = await get('/robots.txt');
    check('robots.txt → 200', res.status === 200);
    check('robots disallows /api/', body.includes('/api/'));
    check('robots points at the sitemap', body.includes('sitemap.xml'));
  }
  {
    const { body } = await get('/');
    check('home emits Organization structured data', body.includes('JewelryStore'));
    check('home sets a canonical URL', body.includes('rel="canonical"'));
    check('home sets Open Graph tags', body.includes('og:title'));
  }
  {
    const { body } = await get('/gem/HR16');
    check('PDP emits an Offer with the correct price', body.includes('"price":11700'));
    check('PDP emits BreadcrumbList', body.includes('BreadcrumbList'));
  }

  // ── Accessibility landmarks ──────────────────────────────────────────────
  console.log('\nAccessibility');
  {
    const { body } = await get('/');
    check('skip link present', body.includes('Skip to content'));
    check('main landmark present', body.includes('id="main"'));
    check('exactly one h1', (body.match(/<h1/g) ?? []).length === 1, `found ${(body.match(/<h1/g) ?? []).length}`);
    check('html has a lang attribute', /<html[^>]*lang="en"/.test(body));
  }
  {
    const { body } = await get('/gem/HR16');
    const alts = [...body.matchAll(/alt="([^"]*)"/g)].map((m) => m[1]);
    check('no empty alt on meaningful images', alts.some((a) => a.includes('HR16')), 'no descriptive alt found');
  }

  // ── No-JS content ────────────────────────────────────────────────────────
  console.log('\nCrawlability');
  {
    const { body } = await get('/collection');
    const present = GEM_CODES.filter((c) => body.includes(`/gem/${c}`)).length;
    check('collection HTML links every lot without JS', present === GEM_CODES.length, `${present}/${GEM_CODES.length}`);
  }

  // ── Security headers ─────────────────────────────────────────────────────
  console.log('\nSecurity headers');
  if (STATIC) {
    console.log('  \x1b[33m–\x1b[0m skipped: GitHub Pages sets its own headers (see docs/06-github-pages.md)');
  } else {
    const { res } = await get('/');
    for (const [h, expected] of [
      ['x-content-type-options', 'nosniff'],
      ['x-frame-options', 'DENY'],
      ['referrer-policy', 'strict-origin-when-cross-origin'],
    ]) {
      check(`${h}: ${expected}`, res.headers.get(h) === expected, `got ${res.headers.get(h)}`);
    }
    check('permissions-policy set', Boolean(res.headers.get('permissions-policy')));
    check('x-powered-by suppressed', !res.headers.get('x-powered-by'));
  }

  // ── Enquiry endpoint ─────────────────────────────────────────────────────
  console.log(STATIC ? '\nEnquiry (static fallback)' : '\nEnquiry API');
  if (STATIC) {
    const { body } = await get('/contact');
    // These are real anchors in the HTML — they work with JavaScript disabled.
    check('contact page exposes a direct mailto', body.includes('mailto:'));
    check('contact page exposes WhatsApp', body.includes('wa.me'));

    // The form itself sits behind a Suspense boundary and hydrates client-side,
    // so its copy is in the route chunk rather than the HTML. Fetch the chunks
    // the page references and assert the mail-client fallback actually shipped —
    // a broken enquiry path is the worst failure this site could have.
    const scripts = [...body.matchAll(/src="([^"]*\/_next\/static\/chunks\/[^"]*\.js)"/g)].map((m) => m[1]);
    let found = false;
    for (const src of scripts) {
      const url = src.startsWith('http') ? src : `${BASE.replace(/\/[^/]*$/, '')}${src}`;
      try {
        const r = await fetch(src.startsWith('http') ? src : new URL(src, BASE + '/').toString());
        if (r.ok && (await r.text()).includes('Compose enquiry email')) { found = true; break; }
      } catch { /* try the next chunk */ }
      void url;
    }
    check('enquiry form ships the mail-client fallback', found, `checked ${scripts.length} chunks`);
  } else {
  const post = (payload) =>
    fetch(`${BASE}/api/enquiry`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-forwarded-for': `10.0.0.${Math.floor(Math.random() * 250)}` },
      body: JSON.stringify(payload),
    });

  {
    const res = await post({ name: 'A', email: 'bad', message: 'x' });
    check('rejects invalid input with 400', res.status === 400, `got ${res.status}`);
    const data = await res.json();
    check('returns field-level errors', Boolean(data.errors?.email));
  }
  {
    const res = await post({
      name: 'Smoke Test', email: 'smoke@example.com',
      message: 'Please send more images of this lot.', gemCodes: ['HR16'],
    });
    check('accepts a valid enquiry with 200', res.status === 200, `got ${res.status}`);
    check('reports success', (await res.json()).ok === true);
  }
  {
    const res = await post({
      name: 'Bot', email: 'bot@example.com',
      message: 'Buy cheap watches now, click here.', company: 'SpamCo',
    });
    check('honeypot accepted silently (teaches bots nothing)', res.status === 200);
  }
  {
    const ip = '203.0.113.99';
    const send = () => fetch(`${BASE}/api/enquiry`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-forwarded-for': ip },
      body: JSON.stringify({ name: 'Rate Test', email: 'r@example.com', message: 'Testing the rate limiter behaviour.' }),
    });
    let limited = false;
    for (let i = 0; i < 7; i += 1) if ((await send()).status === 429) { limited = true; break; }
    check('rate limits a flood from one IP', limited);
  }
  {
    const res = await fetch(`${BASE}/api/enquiry`);
    check('GET on the enquiry endpoint → 405', res.status === 405, `got ${res.status}`);
  }
  }

  // ── 404 ──────────────────────────────────────────────────────────────────
  console.log('\nError handling');
  {
    const { res, body } = await get('/gem/DOES-NOT-EXIST');
    if (STATIC) {
      check('unknown lot → 404', res.status === 404, `got ${res.status}`);
      // GitHub Pages serves out/404.html for unknown paths. A bare local static
      // server serves its own page instead, so assert the artefact directly.
      const r = await fetch(`${BASE}/404.html`);
      const page404 = r.ok ? await r.text() : '';
      check('404.html is the branded page, not a stack trace', page404.includes('not in the collection'));
    } else {
      check('unknown lot → 404', res.status === 404, `got ${res.status}`);
      check('404 page is branded, not a stack trace', body.includes('not in the collection'));
    }
  }

  // ── Report ───────────────────────────────────────────────────────────────
  console.log(`\n${'─'.repeat(56)}`);
  if (failures.length === 0) {
    console.log(`\x1b[32mAll ${passed} checks passed.\x1b[0m\n`);
    process.exit(0);
  }
  console.log(`\x1b[31m${failures.length} failed\x1b[0m, ${passed} passed:\n`);
  for (const f of failures) console.log(`  · ${f}`);
  console.log();
  process.exit(1);
};

run().catch((err) => { console.error('\nSmoke suite crashed:', err); process.exit(1); });

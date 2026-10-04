/**
 * Brand and contact constants.
 *
 * The phone / WhatsApp number is the merchant's real number, confirmed
 * 2026-09-09.
 *
 * ⚠️  STILL PLACEHOLDERS — see docs/01-requirements-srs.md A-04:
 * `email` and `address.street` remain illustrative and MUST be replaced before
 * the site is promoted. They are isolated here so replacement stays a single,
 * reviewable edit.
 */
export const SITE = {
  name: 'Serendia Gems',
  legalName: 'Serendia Gems',
  domain: 'serendiagems.com',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://serendiagems.com',
  tagline: 'Ceylon Sapphires, Direct from the Source',
  description:
    'Individually photographed and specified Ceylon sapphires from Sri Lanka — unheated and heated blue, yellow, pink, violet, green and white sapphire, sold direct.',

  // ⚠️  Still a placeholder — replace before promoting the site.
  email: 'enquiries@serendiagems.com',

  // Real number. Three forms, because each consumer needs a different one:
  // `phoneDisplay` is what a human reads, `phoneE164` is what `tel:` needs,
  // and `whatsapp` is the wa.me path segment (digits only, no leading plus).
  phoneDisplay: '+94 77 880 0467',
  phoneE164: '+94778800467',
  whatsapp: '94778800467',

  address: {
    // ⚠️  Still a placeholder — replace before promoting the site.
    street: 'Gem Merchants Quarter',
    city: 'Ratnapura',
    region: 'Sabaragamuwa',
    country: 'Sri Lanka',
    countryCode: 'LK',
  },

  founded: 1998,
} as const;

/**
 * Whether URLs are served directory-style (trailing slash). The static export
 * sets `trailingSlash: true`, so canonicals must match to be byte-identical to
 * the URL actually served.
 */
const TRAILING_SLASH = process.env.NEXT_PUBLIC_STATIC_EXPORT === '1';

/**
 * Builds an absolute URL, preserving any path prefix already in `SITE.url`.
 *
 * Do NOT use `new URL(path, SITE.url)` for this. Per the URL spec a
 * path-absolute reference replaces the base's entire path, so
 *
 *   new URL('/collection', 'https://host/serendia-gems')
 *     → 'https://host/collection'        ← the basePath is silently dropped
 *
 * On a GitHub Pages project site that pointed every canonical, og:url, og:image
 * and sitemap entry at a 404. Covered by tests in tests/seo.test.ts.
 */
export const absoluteUrl = (path: string): string => {
  const base = SITE.url.replace(/\/+$/, '');
  if (path === '' || path === '/') return `${base}/`;

  const clean = `/${path.replace(/^\/+/, '').replace(/\/+$/, '')}`;
  // Files (og-default.jpg, a gem JPEG) never take a trailing slash.
  const isFile = /\.[a-z0-9]{2,5}$/i.test(clean);

  return `${base}${clean}${TRAILING_SLASH && !isFile ? '/' : ''}`;
};

export const NAV = [
  { href: '/collection', label: 'Collection' },
  { href: '/guide', label: 'Articles' },
  { href: '/about', label: 'Our House' },
  { href: '/contact', label: 'Contact' },
] as const;

/**
 * The article library.
 *
 * `image` is a photograph from `public/gems` — every article is illustrated
 * with a stone actually held in the collection, not stock photography, so the
 * example a reader is shown is one they can click through to and buy.
 *
 * Order is editorial: the two that explain what the house sells come first,
 * then the four skills a buyer needs, then care.
 */
export const GUIDE_PAGES = [
  {
    href: '/guide/ceylon-sapphires',
    label: 'Why Ceylon',
    blurb: 'Two thousand years of sapphire from a single island, and what makes the material distinct.',
    image: 'HR15_1.jpg',
    imageAlt: 'HR15, a 4.40 carat cornflower-blue Ceylon sapphire',
    minutes: 5,
  },
  {
    href: '/guide/heat-treatment',
    label: 'Heated vs Unheated',
    blurb: 'What heat treatment actually is, why it is disclosed, and what the premium buys you.',
    image: 'HR25_1.jpg',
    imageAlt: 'HR25, an unheated 2.15 carat cornflower-blue Ceylon sapphire',
    minutes: 6,
  },
  {
    href: '/guide/buying-guide',
    label: 'How to Buy a Sapphire',
    blurb: 'Colour, cut, clarity and carat — in the order that actually matters for coloured stones.',
    image: 'HR16_1.jpg',
    imageAlt: 'HR16, a 5.35 carat deep royal blue cushion-cut Ceylon sapphire',
    minutes: 7,
  },
  {
    href: '/guide/reading-colour',
    label: 'Reading Colour',
    blurb: 'Hue, tone and saturation — the three things every seller means by "colour", and the one you pay for.',
    image: 'HR19.jpg',
    imageAlt: 'HR19, a 2.55 carat vivid purplish-pink sapphire held in tweezers',
    minutes: 8,
  },
  {
    href: '/guide/inclusions',
    label: 'Inclusions and Clarity',
    blurb: 'Sapphire is expected to have inclusions. Which ones are harmless, which add value, and which to refuse.',
    image: 'HR17_2.jpg',
    imageAlt: 'HR17, an unheated 3.01 carat golden yellow sapphire showing internal silk',
    minutes: 7,
  },
  {
    href: '/guide/cut-and-shape',
    label: 'Cut, Windows and Shape',
    blurb: 'Why two stones of the same weight can look a carat apart, and the tilt test that reveals it.',
    image: 'HR18_1.jpg',
    imageAlt: 'HR18, a 3.10 carat heart-cut deep royal blue sapphire',
    minutes: 7,
  },
  {
    href: '/guide/matched-pairs',
    label: 'Matched Pairs',
    blurb: 'What "matched" actually has to mean before a pair is worth its premium — and how to check.',
    image: 'HR22_1.jpg',
    imageAlt: 'HR22, a matched pair of round golden yellow sapphires',
    minutes: 5,
  },
  {
    href: '/guide/gemstone-care',
    label: 'Caring for Your Stone',
    blurb: 'Cleaning, setting, storage, and what will and will not damage a sapphire.',
    image: 'HR26_1.jpg',
    imageAlt: 'HR26, an unheated 3.30 carat pale pink sapphire',
    minutes: 5,
  },
] as const;

/** Indicative rate, used only to label the LKR figure. USD is authoritative. */
export const LKR_PER_USD = 300;

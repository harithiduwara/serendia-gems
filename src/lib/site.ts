/**
 * Brand and contact constants.
 *
 * ⚠️  PLACEHOLDERS — see docs/01-requirements-srs.md A-04.
 * The phone, email and address below are illustrative and MUST be replaced with
 * the merchant's real details before go-live. They are isolated in this one
 * module so that replacement is a single, reviewable edit.
 */
export const SITE = {
  name: 'Serendia Gems',
  legalName: 'Serendia Gems',
  domain: 'serendiagems.com',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://serendiagems.com',
  tagline: 'Ceylon Sapphires, Direct from the Source',
  description:
    'Individually photographed and specified Ceylon sapphires from Sri Lanka — unheated and heated blue, yellow, pink, violet, green and white sapphire, sold direct.',

  // ── Replace before go-live ───────────────────────────────
  email: 'enquiries@serendiagems.com',
  phoneDisplay: '+94 77 000 0000',
  phoneE164: '+94770000000',
  whatsapp: '94770000000',
  address: {
    street: 'Gem Merchants Quarter',
    city: 'Ratnapura',
    region: 'Sabaragamuwa',
    country: 'Sri Lanka',
    countryCode: 'LK',
  },
  // ─────────────────────────────────────────────────────────

  founded: 1998,
} as const;

export const NAV = [
  { href: '/collection', label: 'Collection' },
  { href: '/guide/ceylon-sapphires', label: 'Ceylon Sapphires' },
  { href: '/guide/buying-guide', label: 'Buying Guide' },
  { href: '/about', label: 'Our House' },
  { href: '/contact', label: 'Contact' },
] as const;

export const GUIDE_PAGES = [
  {
    href: '/guide/ceylon-sapphires',
    label: 'Why Ceylon',
    blurb: 'Two thousand years of sapphire from a single island, and what makes the material distinct.',
  },
  {
    href: '/guide/heat-treatment',
    label: 'Heated vs Unheated',
    blurb: 'What heat treatment actually is, why it is disclosed, and what the premium buys you.',
  },
  {
    href: '/guide/buying-guide',
    label: 'How to Buy a Sapphire',
    blurb: 'Colour, cut, clarity and carat — in the order that actually matters for coloured stones.',
  },
  {
    href: '/guide/gemstone-care',
    label: 'Caring for Your Stone',
    blurb: 'Cleaning, setting, storage, and what will and will not damage a sapphire.',
  },
] as const;

/** Indicative rate, used only to label the LKR figure. USD is authoritative. */
export const LKR_PER_USD = 300;

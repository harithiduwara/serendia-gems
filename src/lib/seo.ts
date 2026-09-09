import type { Metadata } from 'next';
import { SITE, absoluteUrl } from './site';
import { formatCarats, formatTreatment } from './format';
import { altFor, imagePath } from './catalog';
import type { Gem } from './types';

const abs = absoluteUrl;

export const buildMetadata = ({
  title,
  description,
  path,
  image,
  type = 'website',
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: 'website' | 'article';
}): Metadata => {
  const url = abs(path);
  const og = image ? abs(image) : abs('/og-default.png');
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE.name,
      type,
      images: [{ url: og, width: 1200, height: 630, alt: title }],
      locale: 'en_US',
    },
    twitter: { card: 'summary_large_image', title, description, images: [og] },
  };
};

/** Product structured data for a single lot (FR-13). */
export const gemJsonLd = (gem: Gem): Record<string, unknown> => {
  const hero = gem.images[0];
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${gem.code} — ${formatCarats(gem.carats)} ${formatTreatment(gem.treatment)} ${gem.variety}`,
    sku: gem.code,
    productID: gem.code,
    description: gem.caption,
    category: 'Loose Gemstone > Sapphire',
    material: 'Corundum (Sapphire)',
    weight: { '@type': 'QuantitativeValue', value: gem.carats, unitText: 'carat' },
    image: hero ? [abs(imagePath(hero))] : undefined,
    brand: { '@type': 'Brand', name: SITE.name },
    additionalProperty: [
      { '@type': 'PropertyValue', name: 'Variety', value: gem.variety },
      { '@type': 'PropertyValue', name: 'Treatment', value: formatTreatment(gem.treatment) },
      { '@type': 'PropertyValue', name: 'Shape', value: gem.shape },
      { '@type': 'PropertyValue', name: 'Carat Weight', value: `${gem.carats}` },
      { '@type': 'PropertyValue', name: 'Origin', value: 'Sri Lanka (Ceylon)' },
      ...(gem.isPair
        ? [{ '@type': 'PropertyValue', name: 'Lot Type', value: 'Matched pair' }]
        : []),
    ],
    offers: {
      '@type': 'Offer',
      url: abs(`/gem/${gem.code}`),
      priceCurrency: 'USD',
      price: gem.priceUSD,
      itemCondition: 'https://schema.org/NewCondition',
      availability:
        gem.status === 'available'
          ? 'https://schema.org/InStock'
          : gem.status === 'reserved'
            ? 'https://schema.org/PreOrder'
            : 'https://schema.org/SoldOut',
      seller: { '@type': 'Organization', name: SITE.name },
    },
  };
};

export const organizationJsonLd = (): Record<string, unknown> => ({
  '@context': 'https://schema.org',
  '@type': 'JewelryStore',
  '@id': `${SITE.url}/#organization`,
  name: SITE.name,
  description: SITE.description,
  url: SITE.url,
  email: SITE.email,
  // E.164 rather than the display string: this is machine-read.
  telephone: SITE.phoneE164,
  address: {
    '@type': 'PostalAddress',
    streetAddress: SITE.address.street,
    addressLocality: SITE.address.city,
    addressRegion: SITE.address.region,
    addressCountry: SITE.address.countryCode,
  },
  areaServed: 'Worldwide',
  knowsAbout: ['Ceylon sapphire', 'Unheated sapphire', 'Loose gemstones', 'Sri Lankan gemstones'],
});

export const breadcrumbJsonLd = (
  trail: { name: string; path: string }[],
): Record<string, unknown> => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: trail.map((t, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: t.name,
    item: abs(t.path),
  })),
});

export const gemImageAlt = altFor;

import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { GemGallery } from '@/components/gem/GemGallery';
import { GemCard } from '@/components/gem/GemCard';
import { SpecTable } from '@/components/gem/SpecTable';
import { Badge, ButtonLink, Container, SectionHeading } from '@/components/primitives';
import { WishlistButton } from '@/components/wishlist/WishlistButton';
import { getAllCodes, getGemByCode, getRelatedGems, imagePath } from '@/lib/catalog';
import { formatCarats, formatLKR, formatTreatment, formatUSD } from '@/lib/format';
import { breadcrumbJsonLd, buildMetadata, gemJsonLd } from '@/lib/seo';
import { SITE } from '@/lib/site';

/** All 24 lots are pre-rendered at build time (FR-06). */
export function generateStaticParams() {
  return getAllCodes().map((code) => ({ code }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ code: string }>;
}): Promise<Metadata> {
  const { code } = await params;
  const gem = getGemByCode(code);
  if (!gem) return { title: 'Stone not found' };

  const title = `${gem.code} — ${formatCarats(gem.carats)} ${formatTreatment(gem.treatment)} ${gem.variety}`;
  const hero = gem.images[0];

  return buildMetadata({
    title,
    description: gem.caption,
    path: `/gem/${gem.code}`,
    image: hero ? imagePath(hero) : undefined,
    type: 'article',
  });
}

export default async function GemPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const gem = getGemByCode(code);
  if (!gem) notFound();

  const related = getRelatedGems(gem, 3);
  const enquiryHref = `/contact?gem=${gem.code}`;
  const whatsappHref = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(
    `Hello Serendia Gems — I would like to know more about lot ${gem.code} (${formatCarats(gem.carats)} ${gem.variety}).`,
  )}`;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(gemJsonLd(gem)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: 'Home', path: '/' },
              { name: 'Collection', path: '/collection' },
              { name: gem.code, path: `/gem/${gem.code}` },
            ]),
          ),
        }}
      />

      <Container>
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="py-6">
          <ol className="flex flex-wrap items-center gap-2 text-[0.8125rem] text-[color:var(--muted-fg)]">
            <li><Link href="/" className="hover:text-royal dark:hover:text-cornflower">Home</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link href="/collection" className="hover:text-royal dark:hover:text-cornflower">Collection</Link></li>
            <li aria-hidden="true">/</li>
            <li>
              <Link
                href={`/collection?variety=${encodeURIComponent(gem.variety)}`}
                className="hover:text-royal dark:hover:text-cornflower"
              >
                {gem.variety}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="t-num text-[color:var(--page-fg)]" aria-current="page">{gem.code}</li>
          </ol>
        </nav>

        <div className="grid gap-10 pb-16 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <GemGallery gem={gem} />
          </div>

          <div>
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <Badge tone={gem.treatment === 'natural' ? 'natural' : 'heated'}>
                {formatTreatment(gem.treatment)}
              </Badge>
              {gem.isPair ? <Badge tone="pair">Matched pair</Badge> : null}
              <Badge
                tone={gem.status === 'available' ? 'positive' : gem.status === 'reserved' ? 'warning' : 'critical'}
              >
                {gem.status === 'available' ? 'Available' : gem.status === 'reserved' ? 'Reserved' : 'Sold'}
              </Badge>
              {gem.photography === 'pending' ? <Badge tone="neutral">Photos on request</Badge> : null}
            </div>

            <p className="t-num mb-1.5 text-sm tracking-[0.1em] text-[color:var(--subtle-fg)]">
              LOT {gem.code}
            </p>
            <h1 className="t-display-2">
              {formatCarats(gem.carats)} {gem.variety}
            </h1>
            <p className="t-lead mt-4 measure">{gem.caption}</p>

            {/* Price */}
            <div className="mt-8 border-y border-[color:var(--panel-line)] py-6">
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <p className="t-num font-display text-[2.5rem] leading-none font-medium text-royal dark:text-cornflower">
                  {formatUSD(gem.priceUSD)}
                </p>
                <p className="t-num text-sm text-[color:var(--muted-fg)]">
                  {formatLKR(gem.priceLKR)}
                </p>
              </div>
              <p className="mt-2.5 text-[0.8125rem] text-[color:var(--subtle-fg)]">
                Price is for the {gem.isPair ? 'pair as a lot' : 'loose stone'}. Insured worldwide
                shipping included. Setting and certification quoted separately.
              </p>
            </div>

            {/* Actions — suppressed once a stone is no longer available (FR-15) */}
            <div className="mt-7">
              {gem.status === 'available' ? (
                <>
                  <div className="flex flex-wrap gap-3">
                    <ButtonLink href={enquiryHref} size="lg" className="flex-1 min-w-[13rem]">
                      Enquire about {gem.code}
                    </ButtonLink>
                    <WishlistButton code={gem.code} withLabel />
                  </div>
                  <div className="mt-3 flex flex-wrap gap-3">
                    <ButtonLink href={whatsappHref} variant="secondary" className="flex-1 min-w-[13rem]">
                      Ask on WhatsApp
                    </ButtonLink>
                    <ButtonLink href={`mailto:${SITE.email}?subject=${encodeURIComponent(`Lot ${gem.code}`)}`} variant="ghost">
                      Email us
                    </ButtonLink>
                  </div>
                  <p className="mt-4 text-[0.8125rem] leading-relaxed text-[color:var(--subtle-fg)]">
                    No payment is taken online. We reply with any further images, video and
                    certification you need, and only then discuss terms.
                  </p>
                </>
              ) : (
                <div className="rounded-[var(--r-md)] border border-[color:var(--panel-line)] bg-[color:var(--color-sunken)] p-5">
                  <p className="font-medium">
                    This stone is {gem.status === 'reserved' ? 'currently reserved' : 'no longer available'}.
                  </p>
                  <p className="mt-1.5 text-sm text-[color:var(--muted-fg)]">
                    Tell us what drew you to it and we will show you the closest equivalents we hold.
                  </p>
                  <ButtonLink href="/contact" variant="secondary" size="sm" className="mt-4">
                    Find me something similar
                  </ButtonLink>
                </div>
              )}
            </div>

            {/* Highlights */}
            <ul className="mt-9 space-y-2.5">
              {gem.highlights.map((h) => (
                <li key={h} className="flex gap-3 text-[0.9375rem]">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="mt-1 shrink-0 text-gold" aria-hidden="true">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Description + specification */}
        <div className="grid gap-12 border-t border-[color:var(--panel-line)] py-16 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="t-display-3 mb-5">About this stone</h2>
            <div className="measure space-y-4 text-[1.0625rem] leading-[1.75] text-[color:var(--muted-fg)]">
              {gem.description.split('\n\n').map((para) => (
                <p key={para.slice(0, 40)}>{para}</p>
              ))}
            </div>

            {gem.treatment === 'natural' ? (
              <aside className="mt-8 rounded-[var(--r-md)] border-l-2 border-gold bg-gold/[0.04] p-5">
                <h3 className="t-title mb-2 !text-[1.0625rem]">Why unheated costs more</h3>
                <p className="text-[0.9375rem] leading-relaxed text-[color:var(--muted-fg)]">
                  The overwhelming majority of sapphire on the market has been heated. A stone that
                  reached good colour without any human intervention is simply rarer, and the trade
                  prices that rarity. It is not a quality judgement — many heated stones are more
                  beautiful. It is a scarcity one.{' '}
                  <Link href="/guide/heat-treatment" className="link-underline font-medium text-royal dark:text-cornflower">
                    Read the full explanation
                  </Link>
                  .
                </p>
              </aside>
            ) : (
              <aside className="mt-8 rounded-[var(--r-md)] border-l-2 border-royal/40 bg-royal/[0.03] p-5">
                <h3 className="t-title mb-2 !text-[1.0625rem]">About the heat treatment</h3>
                <p className="text-[0.9375rem] leading-relaxed text-[color:var(--muted-fg)]">
                  This stone has been heated — the standard, permanent and universally disclosed
                  process applied to most sapphire in circulation. It is stable, requires no special
                  care, and is what makes a stone of this size and colour attainable.{' '}
                  <Link href="/guide/heat-treatment" className="link-underline font-medium text-royal dark:text-cornflower">
                    What heating actually does
                  </Link>
                  .
                </p>
              </aside>
            )}
          </div>

          <div>
            <h2 className="t-display-3 mb-5">Specification</h2>
            <SpecTable gem={gem} />
            <p className="mt-4 text-[0.8125rem] leading-relaxed text-[color:var(--subtle-fg)]">
              Weight and measurements are taken in-house. An independent laboratory report from a
              recognised gemmological institute can be arranged for this lot before purchase — ask
              for it in your enquiry.
            </p>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 ? (
          <div className="border-t border-[color:var(--panel-line)] py-16">
            <SectionHeading
              eyebrow="Also consider"
              title={`Other stones near ${gem.code}`}
              lead="Closest in variety and price from the rest of the collection."
              className="mb-10"
            />
            <div className="grid grid-cols-1 gap-x-6 gap-y-11 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((g) => (
                <GemCard key={g.code} gem={g} />
              ))}
            </div>
          </div>
        ) : null}
      </Container>
    </>
  );
}

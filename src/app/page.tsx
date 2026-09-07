import Image from 'next/image';
import Link from 'next/link';
import { GemCard } from '@/components/gem/GemCard';
import { ButtonLink, Container, SectionHeading } from '@/components/primitives';
import { altFor, blurFor, getAllGems, getFeaturedGems, getGemByCode, imagePath } from '@/lib/catalog';
import { formatCarats, formatUSD } from '@/lib/format';
import { buildMetadata } from '@/lib/seo';
import { GUIDE_PAGES, SITE } from '@/lib/site';

/**
 * The root layout supplies the default title/description, but canonical and
 * Open Graph tags are per-route and must be declared here too (NFR-06).
 */
export const metadata = buildMetadata({
  title: `${SITE.name} — ${SITE.tagline}`,
  description: SITE.description,
  path: '/',
});

export default function HomePage() {
  const all = getAllGems();
  const featured = getFeaturedGems(6);
  const hero = getGemByCode('HR16');
  const unheatedCount = all.filter((g) => g.treatment === 'natural').length;
  const heroImg = hero?.images[0];

  return (
    <>
      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section className="sapphire-ground on-dark relative -mt-[4.5rem] overflow-hidden pt-[4.5rem]">
        <Container>
          <div className="grid items-center gap-12 py-20 sm:py-28 lg:grid-cols-[1.05fr_0.95fr] lg:py-32">
            <div>
              <p className="t-eyebrow mb-5 text-gold-bright">Est. Ratnapura, Sri Lanka</p>
              <h1 className="t-display-1 text-white">
                Ceylon sapphires,
                <br />
                <em className="font-normal not-italic text-transparent bg-clip-text bg-gradient-to-r from-cornflower via-mist to-gold-bright">
                  one stone at a time
                </em>
              </h1>
              <p className="t-lead mt-7 max-w-lg !text-[1.0625rem]">
                Every lot in this collection is an individual stone with its own weight, colour and
                character — photographed as it is, specified in full, and priced without a
                showroom&nbsp;markup between you and the island it came from.
              </p>

              <div className="mt-9 flex flex-wrap gap-3">
                <ButtonLink href="/collection" variant="gold" size="lg">
                  View the collection
                </ButtonLink>
                <ButtonLink
                  href="/guide/buying-guide"
                  size="lg"
                  className="border border-white/25 bg-transparent text-white hover:bg-white/10"
                >
                  How to buy a sapphire
                </ButtonLink>
              </div>

              <dl className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-white/12 pt-7">
                <Stat value={String(all.length)} label="Stones in stock" />
                <Stat value={String(unheatedCount)} label="Never heated" />
                <Stat value="100%" label="Treatment disclosed" />
              </dl>
            </div>

            {hero && heroImg ? (
              <div className="relative">
                <Link
                  href={`/gem/${hero.code}`}
                  className="group block"
                  aria-label={`View lot ${hero.code}, the ${formatCarats(hero.carats)} royal blue cushion`}
                >
                  <div className="gem-mat relative aspect-[4/5] overflow-hidden rounded-[var(--r-lg)] shadow-[var(--shadow-3)]">
                    <Image
                      src={imagePath(heroImg)}
                      alt={altFor(hero, 0)}
                      fill
                      sizes="(max-width: 1024px) 90vw, 44vw"
                      placeholder="blur"
                      blurDataURL={blurFor(heroImg)}
                      priority
                      className="object-cover transition-transform duration-[800ms] ease-[var(--ease-brand)] motion-safe:group-hover:scale-[1.04]"
                    />
                  </div>
                  <div className="mt-5 flex items-end justify-between gap-4">
                    <div>
                      <p className="t-eyebrow mb-1.5 text-gold-bright">The house stone</p>
                      <p className="t-title text-white">
                        {hero.code} — {formatCarats(hero.carats)} {hero.shape}
                      </p>
                      <p className="mt-1 text-sm text-[color:var(--muted-fg)]">
                        Deepest, most saturated blue in the collection
                      </p>
                    </div>
                    <p className="t-num shrink-0 font-display text-2xl text-gold-bright">
                      {formatUSD(hero.priceUSD)}
                    </p>
                  </div>
                </Link>
              </div>
            ) : null}
          </div>
        </Container>
      </section>

      {/* ── Trust strip ────────────────────────────────────────────────── */}
      <section className="border-b border-[color:var(--panel-line)] bg-[color:var(--panel-bg)]">
        <Container>
          <ul className="grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { t: 'Direct from Ratnapura', d: 'Bought at the source in Sri Lanka’s gem capital, sold to you with no intermediary.' },
              { t: 'Every treatment disclosed', d: 'Heated or unheated is stated on every lot, in writing, without exception.' },
              { t: 'Certification on request', d: 'Independent laboratory reports arranged for any stone before you commit.' },
              { t: 'Insured worldwide delivery', d: 'Fully insured and tracked, with a seven-day inspection period on arrival.' },
            ].map((f) => (
              <li key={f.t} className="flex gap-3.5">
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0 text-gold" aria-hidden="true">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                <div>
                  <p className="text-[0.9375rem] font-semibold">{f.t}</p>
                  <p className="mt-1 text-[0.8125rem] leading-relaxed text-[color:var(--muted-fg)]">{f.d}</p>
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* ── Featured ───────────────────────────────────────────────────── */}
      <section className="py-20 sm:py-28">
        <Container>
          <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              eyebrow="Selected lots"
              title="Stones worth your attention"
              lead="Photographed in daylight and under the loupe, described as they actually are — including where the colour is soft rather than strong."
            />
            <Link href="/collection" className="link-underline shrink-0 text-sm font-medium text-royal dark:text-cornflower">
              All {all.length} stones →
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-x-6 gap-y-11 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((gem, i) => (
              <GemCard key={gem.code} gem={gem} priority={i < 3} />
            ))}
          </div>
        </Container>
      </section>

      {/* ── Colour bands ───────────────────────────────────────────────── */}
      <section className="border-y border-[color:var(--panel-line)] bg-[color:var(--panel-bg)] py-20 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="Browse by colour"
            title="Sapphire is not only blue"
            lead="Corundum takes almost every colour in the spectrum. The island produces all of them, and this collection holds six."
            align="center"
            className="mb-12"
          />
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {[
              { v: 'Blue Sapphire', label: 'Blue', c: 'from-[#16327E] to-[#2B57C4]' },
              { v: 'Yellow Sapphire', label: 'Yellow', c: 'from-[#B8860B] to-[#F0C24B]' },
              { v: 'Pink Sapphire', label: 'Pink', c: 'from-[#A81E68] to-[#E86AAE]' },
              { v: 'Violet Sapphire', label: 'Violet', c: 'from-[#5B3E8E] to-[#A98BD8]' },
              { v: 'Green Sapphire', label: 'Green', c: 'from-[#2A6349] to-[#6FAE8C]' },
              { v: 'White Sapphire', label: 'White', c: 'from-[#9BA3B4] to-[#E8ECF3]' },
            ].map((band) => {
              const count = all.filter((g) => g.variety === band.v).length;
              return (
                <li key={band.v}>
                  <Link
                    href={`/collection?variety=${encodeURIComponent(band.v)}`}
                    className="card-lift group block overflow-hidden rounded-[var(--r-md)] border border-[color:var(--panel-line)]"
                  >
                    <span className={`block h-20 bg-gradient-to-br ${band.c}`} aria-hidden="true" />
                    <span className="block px-3.5 py-3">
                      <span className="block text-[0.9375rem] font-medium">{band.label}</span>
                      <span className="t-num block text-xs text-[color:var(--subtle-fg)]">
                        {count} {count === 1 ? 'stone' : 'stones'}
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </Container>
      </section>

      {/* ── Editorial ──────────────────────────────────────────────────── */}
      <section className="py-20 sm:py-28">
        <Container>
          <SectionHeading
            eyebrow="Before you buy"
            title="Know what you are looking at"
            lead="Coloured stones are not graded like diamonds, and most of what people believe about sapphire pricing is wrong. Four short pieces that will save you money."
            className="mb-12"
          />
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {GUIDE_PAGES.map((g) => (
              <li key={g.href}>
                <Link
                  href={g.href}
                  className="card-lift flex h-full flex-col rounded-[var(--r-md)] border border-[color:var(--panel-line)] bg-[color:var(--panel-bg)] p-6"
                >
                  <h3 className="t-title mb-2.5">{g.label}</h3>
                  <p className="flex-1 text-[0.875rem] leading-relaxed text-[color:var(--muted-fg)]">{g.blurb}</p>
                  <span className="mt-5 text-sm font-medium text-royal dark:text-cornflower">Read →</span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* ── CTA ────────────────────────────────────────────────────────── */}
      <section className="sapphire-ground on-dark">
        <Container width="prose">
          <div className="py-20 text-center sm:py-24">
            <p className="t-eyebrow mb-4 text-gold-bright">Not sure where to start?</p>
            <h2 className="t-display-2 text-white">Tell us what you are looking for</h2>
            <p className="t-lead mx-auto mt-5 max-w-xl">
              Describe the colour, the size and the budget you have in mind. If the right stone is
              in this collection we will point you to it. If it is not, we will say so — and look
              for it on the island.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <ButtonLink href="/contact" variant="gold" size="lg">Start an enquiry</ButtonLink>
              <ButtonLink href="/collection" size="lg" className="border border-white/25 bg-transparent text-white hover:bg-white/10">
                Browse everything
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <dt className="sr-only">{label}</dt>
      <dd>
        <span className="t-num block font-display text-3xl font-medium text-gold-bright">{value}</span>
        <span className="mt-1 block text-xs text-[color:var(--muted-fg)]">{label}</span>
      </dd>
    </div>
  );
}

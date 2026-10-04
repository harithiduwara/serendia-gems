import Image from 'next/image';
import Link from 'next/link';
import { Container, SectionHeading } from '@/components/primitives';
import { blurFor, imagePath } from '@/lib/catalog';
import { breadcrumbJsonLd, buildMetadata } from '@/lib/seo';
import { GUIDE_PAGES } from '@/lib/site';

export const metadata = buildMetadata({
  title: 'Articles — Sapphire Tips and Gemmology',
  description:
    'Practical gemmology for anyone buying a sapphire: how to read colour, what inclusions mean, how to spot a badly cut stone, heat treatment explained, and how to care for what you buy.',
  path: '/guide',
});

/** Things a buyer can act on in one sentence. The articles do the explaining. */
const QUICK_TIPS = [
  {
    tip: 'Judge colour in two lights.',
    why: 'Daylight by a window and ordinary indoor light. Many sapphires shift, and you will wear it in both.',
    href: '/guide/reading-colour',
  },
  {
    tip: 'Tilt the stone before you buy it.',
    why: 'A pale patch opening up through the middle means the stone is cut too shallow.',
    href: '/guide/cut-and-shape',
  },
  {
    tip: 'Ask for millimetres, not just carats.',
    why: 'Carat is weight. Two stones of the same weight can differ visibly in face-up size.',
    href: '/guide/cut-and-shape',
  },
  {
    tip: 'Eye-clean is the standard, not flawless.',
    why: 'Sapphire is expected to have inclusions. Chasing a loupe-clean stone is how people overpay.',
    href: '/guide/inclusions',
  },
  {
    tip: 'Ask which treatment, specifically.',
    why: '“Treated” means nothing. Heat is accepted and permanent; diffusion and fracture filling are not.',
    href: '/guide/heat-treatment',
  },
  {
    tip: 'Buy just under a round weight.',
    why: 'Price steps at 1, 2, 3 and 5 carats. A 2.95 ct stone costs less per carat than a 3.01 ct one, and nobody can tell.',
    href: '/guide/buying-guide',
  },
];

export default function GuideIndexPage() {
  const [lead, ...rest] = GUIDE_PAGES;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: 'Home', path: '/' },
              { name: 'Articles', path: '/guide' },
            ]),
          ),
        }}
      />

      <section className="border-b border-[color:var(--panel-line)]">
        <Container>
          <div className="py-14 sm:py-20">
            <p className="t-eyebrow mb-4 text-gold">Articles</p>
            <h1 className="t-display-2 max-w-3xl">
              What we would want to know before buying a sapphire
            </h1>
            <p className="t-lead measure mt-5">
              Coloured stones are not graded like diamonds, and most of what people
              believe about sapphire pricing is wrong. These are the things that
              actually decide what a stone is worth — written plainly, and illustrated
              with stones from this collection rather than stock photographs.
            </p>
          </div>
        </Container>
      </section>

      <Container>
        {/* ── Quick tips ───────────────────────────────────────────────── */}
        <section className="py-14 sm:py-16">
          <SectionHeading
            eyebrow="Start here"
            title="Six tips worth the two minutes"
            lead="Each one links to the article that explains it properly."
            className="mb-10"
          />
          <ol className="grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
            {QUICK_TIPS.map((t, i) => (
              <li key={t.tip} className="border-t border-[color:var(--panel-line)] pt-4">
                <p className="t-num mb-2 text-[0.75rem] font-semibold text-gold">
                  {String(i + 1).padStart(2, '0')}
                </p>
                <h3 className="t-title mb-1.5 !text-[1.0625rem]">{t.tip}</h3>
                <p className="text-[0.875rem] leading-relaxed text-[color:var(--muted-fg)]">
                  {t.why}{' '}
                  <Link href={t.href} className="link-underline font-medium text-royal">
                    More
                  </Link>
                </p>
              </li>
            ))}
          </ol>
        </section>

        {/* ── Lead article ─────────────────────────────────────────────── */}
        {lead ? (
          <section className="border-t border-[color:var(--panel-line)] py-14 sm:py-16">
            <Link href={lead.href} className="card-lift group grid gap-8 lg:grid-cols-2 lg:items-center">
              <div className="gem-mat relative aspect-[4/3] overflow-hidden rounded-[var(--r-md)] border border-[color:var(--panel-line)]">
                <Image
                  src={imagePath(lead.image)}
                  alt={lead.imageAlt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  placeholder="blur"
                  blurDataURL={blurFor(lead.image)}
                  priority
                  className="object-cover transition-transform duration-[600ms] ease-[var(--ease-brand)] motion-safe:group-hover:scale-[1.03]"
                />
              </div>
              <div>
                <p className="t-eyebrow mb-3 text-gold">Start with this one · {lead.minutes} min</p>
                <h2 className="t-display-3 mb-4">{lead.label}</h2>
                <p className="t-lead !text-[1rem]">{lead.blurb}</p>
                <span className="mt-5 inline-block text-sm font-medium text-royal">Read →</span>
              </div>
            </Link>
          </section>
        ) : null}

        {/* ── Everything else ──────────────────────────────────────────── */}
        <section className="border-t border-[color:var(--panel-line)] py-14 sm:py-16">
          <SectionHeading eyebrow="The library" title="All articles" className="mb-10" />
          <ul className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((article) => (
              <li key={article.href}>
                <Link href={article.href} className="card-lift group block">
                  <div className="gem-mat relative aspect-[4/3] overflow-hidden rounded-[var(--r-md)] border border-[color:var(--panel-line)]">
                    <Image
                      src={imagePath(article.image)}
                      alt={article.imageAlt}
                      fill
                      sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
                      placeholder="blur"
                      blurDataURL={blurFor(article.image)}
                      className="object-cover transition-transform duration-[600ms] ease-[var(--ease-brand)] motion-safe:group-hover:scale-[1.04]"
                    />
                  </div>
                  <p className="t-eyebrow mt-4 mb-2 text-[color:var(--subtle-fg)]">
                    {article.minutes} min read
                  </p>
                  <h3 className="t-title mb-2">{article.label}</h3>
                  <p className="text-[0.875rem] leading-relaxed text-[color:var(--muted-fg)]">
                    {article.blurb}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* ── Closing ──────────────────────────────────────────────────── */}
        <section className="border-t border-[color:var(--panel-line)] py-14 sm:py-16">
          <div className="rounded-[var(--r-lg)] border border-royal/10 bg-mist/35 px-6 py-12 text-center sm:py-16">
            <p className="t-eyebrow mb-4 text-gold">Still deciding?</p>
            <h2 className="t-display-3 mb-4">Ask us anything about a stone</h2>
            <p className="t-lead mx-auto mb-8 max-w-xl !text-[0.9375rem]">
              Every article here describes a stone we actually hold. If you want to put
              what you have read to use, tell us what you are looking for and we will
              say plainly which of ours fits — and which does not.
            </p>
            <Link
              href="/contact"
              className="inline-flex min-h-12 items-center rounded-[var(--r-sm)] bg-royal px-8 text-[0.9375rem] font-medium text-white transition-colors hover:bg-royal-bright"
            >
              Start an enquiry
            </Link>
          </div>
        </section>
      </Container>
    </>
  );
}

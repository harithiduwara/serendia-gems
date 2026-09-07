import { Suspense } from 'react';
import { CollectionBrowser } from '@/components/collection/CollectionBrowser';
import { GemCard } from '@/components/gem/GemCard';
import { Container } from '@/components/primitives';
import { getAllGems } from '@/lib/catalog';
import { breadcrumbJsonLd, buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'The Collection — Ceylon Sapphires',
  description:
    'Browse every sapphire currently held: blue, yellow, pink, violet, green and white, heated and unheated, from 1.25 to 5.35 carats. Filter by variety, treatment, shape, weight and price.',
  path: '/collection',
});

export default function CollectionPage() {
  const gems = getAllGems();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: 'Home', path: '/' },
              { name: 'Collection', path: '/collection' },
            ]),
          ),
        }}
      />

      <section className="border-b border-[color:var(--panel-line)] bg-[color:var(--panel-bg)]">
        <Container>
          <div className="py-14 sm:py-20">
            <p className="t-eyebrow mb-4 text-gold">The collection</p>
            <h1 className="t-display-2 max-w-3xl">
              {gems.length} Ceylon sapphires, each one specified in full
            </h1>
            <p className="t-lead measure mt-5">
              These are individual stones, not a product line — no two are alike, and when one
              sells it is gone. Weight, shape and treatment are recorded exactly as they are;
              colour descriptions are written from the photographs, never from a catalogue.
            </p>
          </div>
        </Container>
      </section>

      <Container>
        <div className="py-12 sm:py-16">
          {/*
            Suspense boundary is required because CollectionBrowser reads
            useSearchParams. The fallback is the complete unfiltered grid, so
            crawlers and no-JS visitors still see every stone (FR-01).
          */}
          <Suspense fallback={<StaticGrid />}>
            <CollectionBrowser gems={gems} />
          </Suspense>
        </div>
      </Container>
    </>
  );
}

function StaticGrid() {
  const gems = getAllGems();
  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-11 sm:grid-cols-2 lg:grid-cols-3">
      {gems.map((gem, i) => (
        <GemCard key={gem.code} gem={gem} priority={i < 3} />
      ))}
    </div>
  );
}

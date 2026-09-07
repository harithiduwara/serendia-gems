import { ButtonLink, Container } from '@/components/primitives';
import { getFeaturedGems } from '@/lib/catalog';
import { GemCard } from '@/components/gem/GemCard';

export default function NotFound() {
  return (
    <Container>
      <div className="py-24 text-center sm:py-32">
        <p className="t-eyebrow mb-4 text-gold">Error 404</p>
        <h1 className="t-display-2">This page is not in the collection</h1>
        <p className="t-lead mx-auto mt-5 max-w-lg">
          The stone you were looking for may have sold, or the address may be mistyped. Here is
          what we currently hold.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/collection">Browse the collection</ButtonLink>
          <ButtonLink href="/contact" variant="secondary">Ask us to find something</ButtonLink>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-x-6 gap-y-11 pb-20 sm:grid-cols-2 lg:grid-cols-3">
        {getFeaturedGems(3).map((gem) => (
          <GemCard key={gem.code} gem={gem} />
        ))}
      </div>
    </Container>
  );
}

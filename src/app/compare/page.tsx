import { CompareView } from '@/components/compare/CompareView';
import { Container } from '@/components/primitives';
import { getAllGems } from '@/lib/catalog';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Compare Stones',
  description:
    'Put the sapphires you are considering side by side — price per carat, weight, treatment, colour and cut, aligned attribute by attribute.',
  path: '/compare',
});

export default function ComparePage() {
  return (
    <Container>
      <div className="py-14 sm:py-20">
        <p className="t-eyebrow mb-4 text-gold">Compare</p>
        <h1 className="t-display-2">Side by side</h1>
        <div className="mt-10">
          <CompareView gems={getAllGems()} />
        </div>
      </div>
    </Container>
  );
}

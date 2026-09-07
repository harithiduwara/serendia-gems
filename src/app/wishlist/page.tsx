import { Container } from '@/components/primitives';
import { WishlistView } from '@/components/wishlist/WishlistView';
import { getAllGems } from '@/lib/catalog';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Your Selection',
  description: 'The stones you have saved while browsing the collection.',
  path: '/wishlist',
});

export default function WishlistPage() {
  return (
    <Container>
      <div className="py-14 sm:py-20">
        <p className="t-eyebrow mb-4 text-gold">Your selection</p>
        <h1 className="t-display-2">Stones you have saved</h1>
        <p className="t-lead measure mt-5">
          Kept in this browser only — nothing is sent to us until you enquire. Send the whole
          selection in one message and we will reply about each stone.
        </p>
        <div className="mt-12">
          <WishlistView gems={getAllGems()} />
        </div>
      </div>
    </Container>
  );
}

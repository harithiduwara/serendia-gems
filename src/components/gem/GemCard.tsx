import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/primitives';
import { WishlistButton } from '@/components/wishlist/WishlistButton';
import { altFor, blurFor, imagePath } from '@/lib/catalog';
import { formatCarats, formatTreatment, formatUSD } from '@/lib/format';
import type { Gem } from '@/lib/types';

export function GemCard({ gem, priority = false }: { gem: Gem; priority?: boolean }) {
  const hero = gem.images[0];

  return (
    <article className="group relative flex flex-col">
      <div className="relative">
        <div className="gem-mat relative aspect-square overflow-hidden rounded-[var(--r-md)]">
          {hero ? (
            <Image
              src={imagePath(hero)}
              alt={altFor(gem, 0)}
              fill
              sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
              placeholder="blur"
              blurDataURL={blurFor(hero)}
              priority={priority}
              className="object-cover transition-transform duration-[600ms] ease-[var(--ease-brand)] motion-safe:group-hover:scale-[1.04]"
            />
          ) : (
            <PendingPhotography code={gem.code} />
          )}

          {gem.status !== 'available' ? (
            <div className="absolute inset-x-0 bottom-0 bg-abyss/85 px-3 py-2 text-center text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-white">
              {gem.status === 'reserved' ? 'Reserved' : 'Sold'}
            </div>
          ) : null}
        </div>

        {/* Sibling of the card link, never nested inside it (design-system.md §6). */}
        <div className="absolute right-2.5 top-2.5 z-20">
          <WishlistButton code={gem.code} />
        </div>
      </div>

      <div className="flex flex-1 flex-col pt-4">
        <div className="mb-2 flex flex-wrap items-center gap-1.5">
          <Badge tone={gem.treatment === 'natural' ? 'natural' : 'heated'}>
            {formatTreatment(gem.treatment)}
          </Badge>
          {gem.isPair ? <Badge tone="pair">Matched pair</Badge> : null}
          {gem.photography === 'pending' ? <Badge tone="neutral">Photos soon</Badge> : null}
        </div>

        <h3 className="t-title">
          {/* Stretched link: the whole card is clickable, but only this is the link. */}
          <Link href={`/gem/${gem.code}`} className="after:absolute after:inset-0 after:z-10">
            <span className="t-num text-[color:var(--subtle-fg)]">{gem.code}</span>
            <span className="sr-only">, </span>{' '}
            <span>{gem.variety}</span>
          </Link>
        </h3>

        <p className="mt-1.5 text-[0.875rem] leading-relaxed text-[color:var(--muted-fg)] line-clamp-2">
          {gem.caption}
        </p>

        <div className="mt-auto pt-4">
          <div className="flex items-baseline justify-between gap-3 border-t border-[color:var(--panel-line)] pt-3">
            <p className="t-num text-[0.8125rem] text-[color:var(--muted-fg)]">
              {formatCarats(gem.carats)} · {gem.shape}
            </p>
            <p className="t-num font-display text-[1.25rem] font-medium text-royal dark:text-cornflower">
              {formatUSD(gem.priceUSD)}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}

function PendingPhotography({ code }: { code: string }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 text-center px-6">
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#8A90A3" strokeWidth="1.2" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 2 22 8.5 12 22 2 8.5Z" />
        <path d="M2 8.5h20M12 2v20M7 8.5 12 22l5-13.5" />
      </svg>
      <p className="text-[0.75rem] font-medium uppercase tracking-[0.12em] text-[#8A90A3]">
        Photography in preparation
      </p>
      <p className="text-[0.75rem] text-[#8A90A3]">Images and video for {code} on request</p>
    </div>
  );
}

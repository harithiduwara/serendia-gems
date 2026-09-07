'use client';

import Link from 'next/link';
import { GemCard } from '@/components/gem/GemCard';
import { Button, ButtonLink } from '@/components/primitives';
import { formatUSD } from '@/lib/format';
import type { Gem } from '@/lib/types';
import { useWishlist } from './WishlistProvider';

export function WishlistView({ gems }: { gems: Gem[] }) {
  const { codes, clear, ready } = useWishlist();

  if (!ready) {
    return (
      <div className="grid grid-cols-1 gap-x-6 gap-y-11 sm:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <div key={i} className="aspect-square animate-pulse rounded-[var(--r-md)] bg-[color:var(--color-sunken)]" />
        ))}
      </div>
    );
  }

  const saved = gems.filter((g) => codes.includes(g.code));

  if (saved.length === 0) {
    return (
      <div className="rounded-[var(--r-md)] border border-dashed border-[color:var(--panel-line)] px-8 py-20 text-center">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-5 text-[color:var(--subtle-fg)]" aria-hidden="true">
          <path d="M19 21l-7-4.5L5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
        </svg>
        <p className="t-title mb-2">Nothing saved yet</p>
        <p className="t-lead mx-auto mb-7 max-w-md !text-[0.9375rem]">
          Tap the bookmark on any stone to keep it here while you compare.
        </p>
        <ButtonLink href="/collection">Browse the collection</ButtonLink>
      </div>
    );
  }

  const total = saved.reduce((sum, g) => sum + g.priceUSD, 0);

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-[color:var(--panel-line)] pb-5">
        <p className="t-num text-sm text-[color:var(--muted-fg)]">
          {saved.length} {saved.length === 1 ? 'stone' : 'stones'} · {formatUSD(total)} combined
        </p>
        <div className="flex flex-wrap gap-3">
          <Button variant="ghost" size="sm" onClick={clear}>Clear selection</Button>
          <ButtonLink href="/contact" size="sm">Enquire about all {saved.length}</ButtonLink>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-x-6 gap-y-11 sm:grid-cols-2 lg:grid-cols-3">
        {saved.map((gem) => (
          <GemCard key={gem.code} gem={gem} />
        ))}
      </div>

      <p className="mt-10 text-[0.8125rem] text-[color:var(--subtle-fg)]">
        Saved in this browser only.{' '}
        <Link href="/collection" className="link-underline">Keep browsing</Link> — your selection
        will still be here.
      </p>
    </div>
  );
}

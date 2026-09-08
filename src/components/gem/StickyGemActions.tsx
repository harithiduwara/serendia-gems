'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { WishlistButton } from '@/components/wishlist/WishlistButton';
import { formatCarats, formatUSD } from '@/lib/format';
import { shouldRevealStickyBar } from '@/lib/ui';
import type { Gem } from '@/lib/types';

/**
 * Mobile action bar for a stone page.
 *
 * The page is long — gallery, price, description, an eleven-row specification
 * table, then related stones — so the single conversion action scrolled out of
 * reach almost immediately. Keeping it within thumb reach at the bottom of the
 * viewport is a direct application of Fitts's law, and it keeps the price
 * visible while the buyer reads the specification.
 *
 * It appears only once the real button has scrolled away, so the two are never
 * on screen together competing for the same tap.
 */
export function StickyGemActions({ gem }: { gem: Gem }) {
  const [shown, setShown] = useState(false);
  const sentinel = useRef<HTMLDivElement>(null);

  /**
   * A scroll check rather than an IntersectionObserver: the logic is a single
   * comparison, it needs no observer lifecycle, and — unlike IO — it can be
   * verified directly by setting scrollTop in a test. Throttled to one
   * measurement per animation frame and registered passively, so it never
   * blocks scrolling.
   */
  useEffect(() => {
    if (gem.status !== 'available') return;

    let frame = 0;
    const measure = () => {
      frame = 0;
      const el = sentinel.current;
      if (!el) return;
      setShown(shouldRevealStickyBar(el.getBoundingClientRect().top, window.innerHeight));
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [gem.status]);

  if (gem.status !== 'available') return null;

  return (
    <>
      {/* Marks where the in-page actions live, so the bar only appears
          once they have scrolled out of comfortable reach. */}
      <div ref={sentinel} aria-hidden="true" className="h-px w-full" />

      <div
        // Hidden from assistive tech: it duplicates controls already in the
        // document, and announcing them twice would be noise.
        aria-hidden="true"
        className={`fixed inset-x-0 bottom-0 z-[110] border-t border-[color:var(--panel-line)] bg-[color:var(--panel-bg)]/95 px-4 py-3 shadow-[0_-4px_20px_rgb(15_23_41/0.08)] backdrop-blur-md transition-transform duration-300 ease-[var(--ease-brand)] lg:hidden ${
          shown ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
      >
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="t-num truncate text-[0.6875rem] text-[color:var(--subtle-fg)]">
              {gem.code} · {formatCarats(gem.carats)} {gem.shape}
            </p>
            <p className="t-num font-display text-[1.25rem] font-medium leading-tight text-royal dark:text-cornflower">
              {formatUSD(gem.priceUSD)}
            </p>
          </div>
          <WishlistButton code={gem.code} />
          <Link
            href={`/contact?gem=${gem.code}`}
            tabIndex={-1}
            className="inline-flex min-h-12 items-center rounded-[var(--r-sm)] bg-royal px-6 text-[0.9375rem] font-medium text-white"
          >
            Enquire
          </Link>
        </div>
      </div>
    </>
  );
}

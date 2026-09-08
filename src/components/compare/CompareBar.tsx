'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useWishlist } from '@/components/wishlist/WishlistProvider';
import { blurFor, imagePath } from '@/lib/catalog';
import type { Gem } from '@/lib/types';

/**
 * Persistent selection bar.
 *
 * Two HCI jobs. It keeps the current selection continuously visible instead of
 * hidden behind a header count (Nielsen #6, recognition over recall), and it
 * puts the next useful action — comparing — directly next to the thing it acts
 * on (Fitts's law) rather than on another page the buyer has to find.
 *
 * Appears only at two or more stones, because "compare" is meaningless with one.
 */
export function CompareBar({ gems }: { gems: Gem[] }) {
  const { codes, remove, clear, ready } = useWishlist();
  const pathname = usePathname();

  // Would duplicate the page's own controls.
  if (!ready || pathname === '/compare' || pathname === '/wishlist') return null;

  const selected = gems.filter((g) => codes.includes(g.code));
  if (selected.length < 2) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[120] px-3 pb-3 sm:px-5 sm:pb-5">
      <div className="pointer-events-auto mx-auto flex max-w-[1200px] flex-wrap items-center gap-3 rounded-[var(--r-lg)] border border-[color:var(--panel-line)] bg-[color:var(--panel-bg)]/95 p-3 shadow-[var(--shadow-2)] backdrop-blur-md sm:gap-4 sm:p-3.5">
        <p className="t-num shrink-0 pl-1 text-[0.8125rem] font-medium">
          {selected.length} selected
        </p>

        <ul className="flex min-w-0 flex-1 items-center gap-2 overflow-x-auto" role="list">
          {selected.map((g) => {
            const hero = g.images[0];
            return (
              <li key={g.code} className="shrink-0">
                <div className="group relative">
                  <div className="gem-mat h-12 w-12 overflow-hidden rounded-[var(--r-sm)] border border-[color:var(--panel-line)]">
                    {hero ? (
                      <Image
                        src={imagePath(hero)}
                        alt=""
                        width={48}
                        height={48}
                        placeholder="blur"
                        blurDataURL={blurFor(hero)}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="t-num flex h-full items-center justify-center text-[0.5625rem] text-[color:var(--subtle-fg)]">
                        {g.code}
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(g.code)}
                    aria-label={`Remove ${g.code} from your selection`}
                    className="absolute -right-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full border border-[color:var(--panel-line)] bg-[color:var(--panel-bg)] text-[color:var(--muted-fg)] shadow-sm transition-colors hover:border-critical hover:text-critical"
                  >
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true">
                      <path d="M18 6 6 18" /><path d="m6 6 12 12" />
                    </svg>
                  </button>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={clear}
            className="min-h-11 rounded-[var(--r-sm)] px-3 text-[0.8125rem] font-medium text-[color:var(--muted-fg)] hover:text-[color:var(--page-fg)]"
          >
            Clear
          </button>
          <Link
            href="/compare"
            className="inline-flex min-h-11 items-center rounded-[var(--r-sm)] bg-royal px-5 text-[0.875rem] font-medium text-white transition-colors hover:bg-royal-bright"
          >
            Compare {selected.length}
          </Link>
        </div>
      </div>
    </div>
  );
}

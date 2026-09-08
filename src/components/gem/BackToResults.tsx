'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

/**
 * "Back to your results", preserving the filters the buyer had applied.
 *
 * Browser Back already works, but there was no visible affordance saying so —
 * and nothing telling the buyer their filtered set still exists. Losing a
 * carefully narrowed result set is one of the most common frustrations in
 * catalogue browsing (Nielsen #3, user control and freedom).
 *
 * Renders only when there is a filtered view worth returning to; a plain
 * /collection link would duplicate the breadcrumb directly above it.
 */
export function BackToResults() {
  const [href, setHref] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = window.sessionStorage.getItem('serendia.lastCollectionView');
      if (stored && stored.includes('?')) setHref(stored);
    } catch {
      /* storage unavailable — the breadcrumb still gets them back */
    }
  }, []);

  if (!href) return null;

  return (
    <Link
      href={href}
      className="inline-flex min-h-11 items-center gap-2 text-[0.8125rem] font-medium text-royal transition-colors hover:text-royal-bright dark:text-cornflower"
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="m15 18-6-6 6-6" />
      </svg>
      Back to your filtered results
    </Link>
  );
}

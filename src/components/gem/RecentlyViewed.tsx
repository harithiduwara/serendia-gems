'use client';

import { useEffect, useState } from 'react';
import { GemCard } from '@/components/gem/GemCard';
import { SectionHeading } from '@/components/primitives';
import type { Gem } from '@/lib/types';

const KEY = 'serendia.recentlyViewed.v1';
const LIMIT = 6;

const read = (): string[] => {
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === 'string') : [];
  } catch {
    return [];
  }
};

/**
 * Records a visit. Mounted on the stone page; renders nothing.
 *
 * Kept separate from the display component so the stone page carries no extra
 * markup, and so the two can live on different routes.
 */
export function RecordStoneView({ code }: { code: string }) {
  useEffect(() => {
    try {
      const next = [code, ...read().filter((c) => c !== code)].slice(0, LIMIT);
      window.localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* storage unavailable — the rail simply stays empty */
    }
  }, [code]);

  return null;
}

/**
 * The stones this visitor looked at, most recent first.
 *
 * With 24 individual stones, people compare by going back and forth, and the
 * ones they already opened are exactly the ones they want again. The wishlist
 * only holds what they deliberately saved; this holds what they actually looked
 * at, which is a different and usually longer list.
 *
 * Rendered only after mount: the server cannot know this, and rendering it
 * earlier would cause a hydration mismatch.
 */
export function RecentlyViewed({ gems, excludeCode }: { gems: Gem[]; excludeCode?: string }) {
  const [codes, setCodes] = useState<string[] | null>(null);

  useEffect(() => setCodes(read()), []);

  if (codes === null) return null;

  const seen = codes
    .filter((c) => c !== excludeCode)
    .map((c) => gems.find((g) => g.code === c))
    .filter((g): g is Gem => Boolean(g))
    .slice(0, 3);

  if (seen.length === 0) return null;

  return (
    <section className="no-print border-t border-[color:var(--panel-line)] py-14">
      <SectionHeading
        eyebrow="Recently viewed"
        title="Stones you looked at"
        lead="Kept in this browser only, so you can pick up where you left off."
        className="mb-10"
      />
      <div className="grid grid-cols-1 gap-x-6 gap-y-11 sm:grid-cols-2 lg:grid-cols-3">
        {seen.map((gem) => (
          <GemCard key={gem.code} gem={gem} />
        ))}
      </div>
    </section>
  );
}

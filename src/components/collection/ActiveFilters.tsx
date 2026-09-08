'use client';

import { formatTreatment, formatUSD } from '@/lib/format';
import { EMPTY_FILTERS, type FilterState } from '@/lib/types';

/**
 * Removable chips for every active filter.
 *
 * Previously the only record of what was filtering the results lived inside the
 * panel — collapsed behind a button on mobile. That forces the buyer to recall
 * what they set and to reopen a drawer to undo any of it. Chips make the current
 * state continuously visible (Nielsen #6, recognition over recall) and make each
 * constraint independently reversible in one tap (Nielsen #3, user control).
 */
interface Chip {
  key: string;
  label: string;
  clear: Partial<FilterState>;
}

export function ActiveFilters({
  filters,
  onChange,
  resultCount,
}: {
  filters: FilterState;
  onChange: (patch: Partial<FilterState>) => void;
  resultCount: number;
}) {
  const chips: Chip[] = [
    ...filters.varieties.map((v) => ({
      key: `variety:${v}`,
      label: v,
      clear: { varieties: filters.varieties.filter((x) => x !== v) },
    })),
    ...filters.treatments.map((t) => ({
      key: `treatment:${t}`,
      label: formatTreatment(t),
      clear: { treatments: filters.treatments.filter((x) => x !== t) },
    })),
    ...filters.shapes.map((s) => ({
      key: `shape:${s}`,
      label: s,
      clear: { shapes: filters.shapes.filter((x) => x !== s) },
    })),
  ];

  if (filters.minPrice !== null) {
    chips.push({ key: 'minPrice', label: `From ${formatUSD(filters.minPrice)}`, clear: { minPrice: null } });
  }
  if (filters.maxPrice !== null) {
    chips.push({ key: 'maxPrice', label: `Up to ${formatUSD(filters.maxPrice)}`, clear: { maxPrice: null } });
  }
  if (filters.minCarat !== null) {
    chips.push({ key: 'minCarat', label: `From ${filters.minCarat.toFixed(2)} ct`, clear: { minCarat: null } });
  }
  if (filters.maxCarat !== null) {
    chips.push({ key: 'maxCarat', label: `Up to ${filters.maxCarat.toFixed(2)} ct`, clear: { maxCarat: null } });
  }
  if (filters.pairsOnly) {
    chips.push({ key: 'pairs', label: 'Matched pairs', clear: { pairsOnly: false } });
  }
  if (filters.photographedOnly) {
    chips.push({ key: 'photo', label: 'Photographed', clear: { photographedOnly: false } });
  }

  if (chips.length === 0) return null;

  return (
    <div className="mb-6 flex flex-wrap items-center gap-2">
      <h2 className="sr-only">Active filters</h2>

      {chips.map((chip) => (
        <button
          key={chip.key}
          type="button"
          onClick={() => onChange(chip.clear)}
          // The accessible name states the outcome, not just the label, so it is
          // unambiguous out of visual context.
          aria-label={`Remove filter: ${chip.label}`}
          className="group inline-flex min-h-9 items-center gap-1.5 rounded-full border border-royal/25 bg-mist/60 py-1 pl-3 pr-2 text-[0.8125rem] font-medium text-royal transition-colors hover:border-royal hover:bg-royal hover:text-white dark:bg-royal/20 dark:text-cornflower dark:hover:bg-cornflower dark:hover:text-abyss"
        >
          {chip.label}
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
            <path d="M18 6 6 18" /><path d="m6 6 12 12" />
          </svg>
        </button>
      ))}

      {chips.length > 1 ? (
        <button
          type="button"
          onClick={() => onChange(EMPTY_FILTERS)}
          className="min-h-9 rounded-full px-3 text-[0.8125rem] font-medium text-[color:var(--muted-fg)] underline underline-offset-2 hover:text-[color:var(--page-fg)]"
        >
          Clear all
        </button>
      ) : null}

      {resultCount === 0 ? (
        <span className="text-[0.8125rem] text-critical">No stone matches all of these</span>
      ) : null}
    </div>
  );
}

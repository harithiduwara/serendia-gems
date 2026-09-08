'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { GemCard } from '@/components/gem/GemCard';
import { ActiveFilters } from './ActiveFilters';
import { Button } from '@/components/primitives';
import {
  applyFilters,
  applySort,
  caratBounds,
  countActiveFilters,
  filtersFromParams,
  paramsFromFilters,
  priceBounds,
  shapeFacets,
  treatmentFacets,
  varietyFacets,
} from '@/lib/catalog';
import { formatTreatment, formatUSD } from '@/lib/format';
import { EMPTY_FILTERS, type FilterState, type Gem, type SortKey } from '@/lib/types';

const SORT_LABELS: Record<SortKey, string> = {
  featured: 'Featured',
  'price-desc': 'Price — high to low',
  'price-asc': 'Price — low to high',
  'carat-desc': 'Carat — heaviest first',
  'carat-asc': 'Carat — lightest first',
};

export function CollectionBrowser({ gems }: { gems: Gem[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const filters = useMemo(
    () => filtersFromParams(new URLSearchParams(searchParams.toString())),
    [searchParams],
  );

  // URL is the single source of truth for filter state (FR-04), so every
  // change is a shallow navigation rather than local state.
  const update = useCallback(
    (patch: Partial<FilterState>) => {
      const next = { ...filters, ...patch };
      const qs = paramsFromFilters(next);
      const href = qs ? `/collection?${qs}` : '/collection';
      try {
        // Read back by the stone page to offer "back to your results" with the
        // filters intact (Nielsen #3, user control and freedom).
        window.sessionStorage.setItem('serendia.lastCollectionView', href);
      } catch {
        /* storage unavailable — the link simply falls back to /collection */
      }
      router.replace(href, { scroll: false });
    },
    [filters, router],
  );

  const toggleIn = useCallback(
    <K extends 'varieties' | 'treatments' | 'shapes'>(key: K, value: FilterState[K][number]) => {
      const current = filters[key] as FilterState[K][number][];
      const nextList = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      update({ [key]: nextList } as unknown as Partial<FilterState>);
    },
    [filters, update],
  );

  const results = useMemo(
    () => applySort(applyFilters(gems, filters), filters.sort),
    [gems, filters],
  );

  const activeCount = countActiveFilters(filters);
  const varieties = useMemo(() => varietyFacets(gems), [gems]);
  const shapes = useMemo(() => shapeFacets(gems), [gems]);
  const treatments = useMemo(() => treatmentFacets(gems), [gems]);
  const price = useMemo(() => priceBounds(gems), [gems]);
  const carat = useMemo(() => caratBounds(gems), [gems]);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  useEffect(() => {
    const qs = searchParams.toString();
    try {
      window.sessionStorage.setItem(
        'serendia.lastCollectionView',
        qs ? `/collection?${qs}` : '/collection',
      );
    } catch {
      /* storage unavailable */
    }
  }, [searchParams]);

  /**
   * The same panel is mounted twice on small screens — once in the (visually
   * hidden but still present) desktop sidebar and once in the drawer. Ids must
   * therefore be scoped per instance, or `label[for]` resolves to the hidden
   * copy and tapping a label in the drawer focuses the wrong input.
   */
  const panel = (scope: string) => (
    <div className="space-y-7">
      <FacetGroup title="Variety">
        {varieties.map((o) => (
          <CheckRow
            key={o.value}
            label={o.value}
            count={o.count}
            checked={filters.varieties.includes(o.value)}
            onChange={() => toggleIn('varieties', o.value)}
          />
        ))}
      </FacetGroup>

      <FacetGroup title="Treatment">
        {treatments.map((o) => (
          <CheckRow
            key={o.value}
            label={formatTreatment(o.value)}
            count={o.count}
            checked={filters.treatments.includes(o.value)}
            onChange={() => toggleIn('treatments', o.value)}
          />
        ))}
      </FacetGroup>

      <FacetGroup title="Shape">
        {shapes.map((o) => (
          <CheckRow
            key={o.value}
            label={o.value}
            count={o.count}
            checked={filters.shapes.includes(o.value)}
            onChange={() => toggleIn('shapes', o.value)}
          />
        ))}
      </FacetGroup>

      <FacetGroup title={`Price (USD ${formatUSD(price.min)} – ${formatUSD(price.max)})`}>
        <div className="flex items-center gap-2.5">
          <NumberInput
            id={`minUsd-${scope}`}
            label="Minimum price in US dollars"
            placeholder={String(price.min)}
            value={filters.minPrice}
            onCommit={(v) => update({ minPrice: v })}
          />
          <span className="text-[color:var(--subtle-fg)]" aria-hidden="true">—</span>
          <NumberInput
            id={`maxUsd-${scope}`}
            label="Maximum price in US dollars"
            placeholder={String(price.max)}
            value={filters.maxPrice}
            onCommit={(v) => update({ maxPrice: v })}
          />
        </div>
      </FacetGroup>

      <FacetGroup title={`Carat weight (${carat.min.toFixed(2)} – ${carat.max.toFixed(2)} ct)`}>
        <div className="flex items-center gap-2.5">
          <NumberInput
            id={`minCt-${scope}`}
            label="Minimum carat weight"
            placeholder={carat.min.toFixed(2)}
            step={0.05}
            value={filters.minCarat}
            onCommit={(v) => update({ minCarat: v })}
          />
          <span className="text-[color:var(--subtle-fg)]" aria-hidden="true">—</span>
          <NumberInput
            id={`maxCt-${scope}`}
            label="Maximum carat weight"
            placeholder={carat.max.toFixed(2)}
            step={0.05}
            value={filters.maxCarat}
            onCommit={(v) => update({ maxCarat: v })}
          />
        </div>
      </FacetGroup>

      <FacetGroup title="Show only">
        <CheckRow
          label="Matched pairs"
          count={gems.filter((g) => g.isPair).length}
          checked={filters.pairsOnly}
          onChange={() => update({ pairsOnly: !filters.pairsOnly })}
        />
        <CheckRow
          label="Photographed stones"
          count={gems.filter((g) => g.photography === 'shot').length}
          checked={filters.photographedOnly}
          onChange={() => update({ photographedOnly: !filters.photographedOnly })}
        />
      </FacetGroup>

      {activeCount > 0 ? (
        <Button variant="secondary" size="sm" className="w-full" onClick={() => update(EMPTY_FILTERS)}>
          Clear {activeCount} {activeCount === 1 ? 'filter' : 'filters'}
        </Button>
      ) : null}
    </div>
  );

  return (
    <div className="grid gap-10 lg:grid-cols-[16rem_1fr] lg:gap-14">
      <aside className="hidden lg:block">
        <div className="sticky top-28">
          <h2 className="t-eyebrow mb-5 text-[color:var(--subtle-fg)]">Refine</h2>
          {panel('sidebar')}
        </div>
      </aside>

      <div>
        <div className="mb-7 flex flex-wrap items-center justify-between gap-4 border-b border-[color:var(--panel-line)] pb-5">
          <p aria-live="polite" className="t-num text-sm text-[color:var(--muted-fg)]">
            {results.length} {results.length === 1 ? 'stone' : 'stones'}
            {activeCount > 0 ? ` matching ${activeCount} ${activeCount === 1 ? 'filter' : 'filters'}` : ' in the collection'}
          </p>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="lg:hidden inline-flex min-h-11 items-center gap-2 rounded-[var(--r-sm)] border border-[color:var(--panel-line)] px-4 text-sm font-medium"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                <path d="M3 6h18M6 12h12M10 18h4" />
              </svg>
              Filter{activeCount > 0 ? ` (${activeCount})` : ''}
            </button>

            <label htmlFor="sort" className="sr-only">Sort stones by</label>
            <select
              id="sort"
              value={filters.sort}
              onChange={(e) => update({ sort: e.target.value as SortKey })}
              className="min-h-11 rounded-[var(--r-sm)] border border-[color:var(--panel-line)] bg-[color:var(--panel-bg)] px-3.5 pr-9 text-sm"
            >
              {(Object.keys(SORT_LABELS) as SortKey[]).map((k) => (
                <option key={k} value={k}>{SORT_LABELS[k]}</option>
              ))}
            </select>
          </div>
        </div>

        <ActiveFilters filters={filters} onChange={update} resultCount={results.length} />

        {results.length === 0 ? (
          <div className="rounded-[var(--r-md)] border border-dashed border-[color:var(--panel-line)] px-8 py-20 text-center">
            <p className="t-title mb-2">No stone matches those filters</p>
            <p className="t-lead mx-auto mb-7 max-w-md !text-[0.9375rem]">
              The collection holds {gems.length} lots. Widen the price or carat range, or clear
              the filters to see everything.
            </p>
            <Button variant="secondary" onClick={() => update(EMPTY_FILTERS)}>
              Clear all filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-x-6 gap-y-11 sm:grid-cols-2 xl:grid-cols-3">
            {results.map((gem, i) => (
              <GemCard key={gem.code} gem={gem} priority={i < 3} />
            ))}
          </div>
        )}
      </div>

      {/* Mobile filter drawer */}
      {drawerOpen ? (
        <div className="fixed inset-0 z-[90] lg:hidden" role="dialog" aria-modal="true" aria-label="Filter the collection">
          <button className="absolute inset-0 bg-abyss/60" onClick={() => setDrawerOpen(false)} aria-label="Close filters" tabIndex={-1} />
          <div className="absolute inset-y-0 right-0 flex w-[min(22rem,90vw)] flex-col bg-[color:var(--page-bg)] shadow-[var(--shadow-3)]">
            <div className="flex items-center justify-between border-b border-[color:var(--panel-line)] px-5 py-4">
              <h2 className="t-title">Refine</h2>
              <button type="button" onClick={() => setDrawerOpen(false)} className="inline-flex h-11 w-11 items-center justify-center rounded-full" aria-label="Close filters">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-6">{panel('drawer')}</div>
            <div className="border-t border-[color:var(--panel-line)] p-5">
              <Button className="w-full" onClick={() => setDrawerOpen(false)}>
                Show {results.length} {results.length === 1 ? 'stone' : 'stones'}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

/* ── Sub-components ─────────────────────────────────────────────────────── */

function FacetGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset>
      <legend className="mb-2.5 text-[0.8125rem] font-semibold">{title}</legend>
      <div className="space-y-0.5">{children}</div>
    </fieldset>
  );
}

function CheckRow({
  label,
  count,
  checked,
  onChange,
}: {
  label: string;
  count?: number;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 py-1.5 text-sm">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 shrink-0 rounded-[2px] accent-[color:var(--color-royal)]"
      />
      <span className="flex-1">{label}</span>
      {count !== undefined ? (
        <>
          {/* Screen readers get "Blue Sapphire, 9 stones"; sighted users see "9". */}
          <span className="sr-only">, {count} {count === 1 ? 'stone' : 'stones'}</span>
          <span aria-hidden="true" className="t-num text-xs text-[color:var(--subtle-fg)]">
            {count}
          </span>
        </>
      ) : null}
    </label>
  );
}

/**
 * Number input that commits on blur or Enter rather than on every keystroke,
 * so typing "1200" does not fire four navigations.
 */
function NumberInput({
  id,
  label,
  placeholder,
  value,
  step,
  onCommit,
}: {
  id: string;
  label: string;
  placeholder: string;
  value: number | null;
  step?: number;
  onCommit: (v: number | null) => void;
}) {
  const [draft, setDraft] = useState(value === null ? '' : String(value));

  useEffect(() => { setDraft(value === null ? '' : String(value)); }, [value]);

  const commit = () => {
    const trimmed = draft.trim();
    if (trimmed === '') { onCommit(null); return; }
    const n = Number(trimmed);
    onCommit(Number.isFinite(n) ? n : null);
  };

  return (
    <>
      <label htmlFor={id} className="sr-only">{label}</label>
      <input
        id={id}
        type="number"
        inputMode="decimal"
        step={step}
        min={0}
        value={draft}
        placeholder={placeholder}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); commit(); } }}
        className="t-num w-full min-h-11 rounded-[var(--r-sm)] border border-[color:var(--panel-line)] bg-[color:var(--panel-bg)] px-3 text-sm"
      />
    </>
  );
}

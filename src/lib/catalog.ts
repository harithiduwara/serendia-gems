import { INVENTORY } from '@/data/inventory';
import { BLUR_PLACEHOLDERS, NEUTRAL_BLUR } from '@/data/placeholders';
import {
  EMPTY_FILTERS,
  SORT_KEYS,
  SHAPES,
  VARIETIES,
  type FilterState,
  type Gem,
  type Shape,
  type SortKey,
  type Treatment,
  type Variety,
} from './types';

/**
 * Repository over the catalogue.
 *
 * Everything here is a pure function of `INVENTORY`. If the data source is ever
 * replaced by a CMS or database (see docs/02-architecture.md §3.1), only the
 * accessors at the top of this file change — filtering, sorting and relation
 * logic operate on `Gem[]` and are unaffected.
 */

export const getAllGems = (): Gem[] => INVENTORY;

export const getGemByCode = (code: string): Gem | undefined =>
  INVENTORY.find((g) => g.code.toLowerCase() === code.toLowerCase());

export const getAllCodes = (): string[] => INVENTORY.map((g) => g.code);

// ── Image helpers ────────────────────────────────────────────────────────────

export const imagePath = (file: string): string => `/gems/${file}`;

export const blurFor = (file: string | undefined): string =>
  (file && BLUR_PLACEHOLDERS[file]) || NEUTRAL_BLUR;

export const heroImage = (gem: Gem): string | undefined => gem.images[0];

/**
 * Alt text that names the actual stone rather than describing it as "a gem"
 * (NFR-05). The second and later frames are the tweezer-held views.
 */
export const altFor = (gem: Gem, index = 0): string => {
  const base = `${gem.code} — ${gem.carats.toFixed(2)} carat ${gem.shape.toLowerCase()}-cut ${gem.variety.toLowerCase()} from Sri Lanka`;
  return index === 0 ? base : `${base}, held in tweezers`;
};

// ── Derived facets ───────────────────────────────────────────────────────────

/** Facet options, each with the number of lots that carry it. */
export interface FacetOption<T> {
  value: T;
  count: number;
}

const countBy = <T>(gems: Gem[], pick: (g: Gem) => T, values: readonly T[]): FacetOption<T>[] =>
  values
    .map((value) => ({ value, count: gems.filter((g) => pick(g) === value).length }))
    .filter((o) => o.count > 0);

export const varietyFacets = (gems: Gem[] = INVENTORY): FacetOption<Variety>[] =>
  countBy(gems, (g) => g.variety, VARIETIES);

export const shapeFacets = (gems: Gem[] = INVENTORY): FacetOption<Shape>[] =>
  countBy(gems, (g) => g.shape, SHAPES);

export const treatmentFacets = (gems: Gem[] = INVENTORY): FacetOption<Treatment>[] =>
  countBy(gems, (g) => g.treatment, ['natural', 'heated'] as const);

export const priceBounds = (gems: Gem[] = INVENTORY): { min: number; max: number } => ({
  min: Math.min(...gems.map((g) => g.priceUSD)),
  max: Math.max(...gems.map((g) => g.priceUSD)),
});

export const caratBounds = (gems: Gem[] = INVENTORY): { min: number; max: number } => ({
  min: Math.min(...gems.map((g) => g.carats)),
  max: Math.max(...gems.map((g) => g.carats)),
});

// ── Filtering ────────────────────────────────────────────────────────────────

/**
 * Filters combine as AND across facets and OR within a facet (FR-03).
 * An empty array for a facet means "no constraint", not "match nothing".
 */
export const applyFilters = (gems: Gem[], f: FilterState): Gem[] =>
  gems.filter((g) => {
    if (f.varieties.length && !f.varieties.includes(g.variety)) return false;
    if (f.treatments.length && !f.treatments.includes(g.treatment)) return false;
    if (f.shapes.length && !f.shapes.includes(g.shape)) return false;
    if (f.minCarat !== null && g.carats < f.minCarat) return false;
    if (f.maxCarat !== null && g.carats > f.maxCarat) return false;
    if (f.minPrice !== null && g.priceUSD < f.minPrice) return false;
    if (f.maxPrice !== null && g.priceUSD > f.maxPrice) return false;
    if (f.pairsOnly && !g.isPair) return false;
    if (f.photographedOnly && g.photography !== 'shot') return false;
    return true;
  });

// ── Sorting ──────────────────────────────────────────────────────────────────

/**
 * "Featured" is a deliberate merchandising order, not an arbitrary one:
 * photographed lots first (a buyer can only evaluate what they can see), then
 * by price descending, then by code for a stable tiebreak.
 */
const featuredRank = (a: Gem, b: Gem): number => {
  if (a.photography !== b.photography) return a.photography === 'shot' ? -1 : 1;
  if (a.priceUSD !== b.priceUSD) return b.priceUSD - a.priceUSD;
  return a.code.localeCompare(b.code);
};

export const applySort = (gems: Gem[], sort: SortKey): Gem[] => {
  const out = [...gems];
  switch (sort) {
    case 'price-asc':
      return out.sort((a, b) => a.priceUSD - b.priceUSD || a.code.localeCompare(b.code));
    case 'price-desc':
      return out.sort((a, b) => b.priceUSD - a.priceUSD || a.code.localeCompare(b.code));
    case 'carat-asc':
      return out.sort((a, b) => a.carats - b.carats || a.code.localeCompare(b.code));
    case 'carat-desc':
      return out.sort((a, b) => b.carats - a.carats || a.code.localeCompare(b.code));
    case 'featured':
    default:
      return out.sort(featuredRank);
  }
};

export const queryGems = (f: FilterState, gems: Gem[] = INVENTORY): Gem[] =>
  applySort(applyFilters(gems, f), f.sort);

/** The curated front-page selection. */
export const getFeaturedGems = (limit = 6): Gem[] =>
  applySort(INVENTORY.filter((g) => g.photography === 'shot'), 'featured').slice(0, limit);

/**
 * Related stones for a detail page (FR-16): same variety first, ranked by how
 * close they are in price, then filled out with other photographed lots so the
 * rail is never sparse.
 */
export const getRelatedGems = (gem: Gem, limit = 4): Gem[] => {
  const others = INVENTORY.filter((g) => g.code !== gem.code);
  const sameVariety = others
    .filter((g) => g.variety === gem.variety)
    .sort((a, b) => Math.abs(a.priceUSD - gem.priceUSD) - Math.abs(b.priceUSD - gem.priceUSD));
  const rest = others
    .filter((g) => g.variety !== gem.variety)
    .sort(
      (a, b) =>
        Number(b.photography === 'shot') - Number(a.photography === 'shot') ||
        Math.abs(a.priceUSD - gem.priceUSD) - Math.abs(b.priceUSD - gem.priceUSD),
    );
  return [...sameVariety, ...rest].slice(0, limit);
};

// ── URL ⇄ FilterState ────────────────────────────────────────────────────────

const isVariety = (v: string): v is Variety => (VARIETIES as readonly string[]).includes(v);
const isShape = (v: string): v is Shape => (SHAPES as readonly string[]).includes(v);
const isTreatment = (v: string): v is Treatment => v === 'natural' || v === 'heated';
const isSort = (v: string): v is SortKey => (SORT_KEYS as readonly string[]).includes(v);

const splitList = (raw: string | null): string[] =>
  raw ? raw.split(',').map((s) => s.trim()).filter(Boolean) : [];

const num = (raw: string | null): number | null => {
  if (raw === null || raw.trim() === '') return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
};

/** Parses filter state out of a query string. Unknown values are dropped, never thrown on. */
export const filtersFromParams = (params: URLSearchParams): FilterState => {
  const sortRaw = params.get('sort');
  return {
    varieties: splitList(params.get('variety')).filter(isVariety),
    treatments: splitList(params.get('treatment')).filter(isTreatment),
    shapes: splitList(params.get('shape')).filter(isShape),
    minCarat: num(params.get('minCt')),
    maxCarat: num(params.get('maxCt')),
    minPrice: num(params.get('minUsd')),
    maxPrice: num(params.get('maxUsd')),
    pairsOnly: params.get('pairs') === '1',
    photographedOnly: params.get('photo') === '1',
    sort: sortRaw && isSort(sortRaw) ? sortRaw : 'featured',
  };
};

/** Serialises filter state to a query string, omitting anything at its default (FR-04). */
export const paramsFromFilters = (f: FilterState): string => {
  const p = new URLSearchParams();
  if (f.varieties.length) p.set('variety', f.varieties.join(','));
  if (f.treatments.length) p.set('treatment', f.treatments.join(','));
  if (f.shapes.length) p.set('shape', f.shapes.join(','));
  if (f.minCarat !== null) p.set('minCt', String(f.minCarat));
  if (f.maxCarat !== null) p.set('maxCt', String(f.maxCarat));
  if (f.minPrice !== null) p.set('minUsd', String(f.minPrice));
  if (f.maxPrice !== null) p.set('maxUsd', String(f.maxPrice));
  if (f.pairsOnly) p.set('pairs', '1');
  if (f.photographedOnly) p.set('photo', '1');
  if (f.sort !== 'featured') p.set('sort', f.sort);
  return p.toString();
};

export const countActiveFilters = (f: FilterState): number =>
  f.varieties.length +
  f.treatments.length +
  f.shapes.length +
  (f.minCarat !== null ? 1 : 0) +
  (f.maxCarat !== null ? 1 : 0) +
  (f.minPrice !== null ? 1 : 0) +
  (f.maxPrice !== null ? 1 : 0) +
  (f.pairsOnly ? 1 : 0) +
  (f.photographedOnly ? 1 : 0);

export { EMPTY_FILTERS };

import { describe, expect, it } from 'vitest';
import {
  applyFilters,
  applySort,
  countActiveFilters,
  filtersFromParams,
  getFeaturedGems,
  getGemByCode,
  getRelatedGems,
  paramsFromFilters,
  varietyFacets,
} from '@/lib/catalog';
import { INVENTORY } from '@/data/inventory';
import { EMPTY_FILTERS, type FilterState } from '@/lib/types';

const f = (patch: Partial<FilterState> = {}): FilterState => ({ ...EMPTY_FILTERS, ...patch });

describe('lookup', () => {
  it('finds a lot by code', () => {
    expect(getGemByCode('HR16')?.carats).toBe(5.35);
  });

  it('is case-insensitive, so /gem/hr16 works', () => {
    expect(getGemByCode('hr16')?.code).toBe('HR16');
  });

  it('returns undefined for an unknown code', () => {
    expect(getGemByCode('NOPE')).toBeUndefined();
  });
});

describe('applyFilters', () => {
  it('returns everything when no filter is set', () => {
    expect(applyFilters(INVENTORY, f())).toHaveLength(INVENTORY.length);
  });

  it('ORs within a facet', () => {
    const res = applyFilters(INVENTORY, f({ varieties: ['Blue Sapphire', 'Pink Sapphire'] }));
    expect(res.length).toBeGreaterThan(0);
    for (const g of res) expect(['Blue Sapphire', 'Pink Sapphire']).toContain(g.variety);
  });

  it('ANDs across facets', () => {
    const res = applyFilters(INVENTORY, f({ varieties: ['Blue Sapphire'], treatments: ['natural'] }));
    for (const g of res) {
      expect(g.variety).toBe('Blue Sapphire');
      expect(g.treatment).toBe('natural');
    }
  });

  it('treats carat bounds as inclusive', () => {
    const exact = INVENTORY.find((g) => g.carats === 5.35);
    expect(exact).toBeDefined();
    const res = applyFilters(INVENTORY, f({ minCarat: 5.35, maxCarat: 5.35 }));
    expect(res.map((g) => g.code)).toContain(exact?.code);
  });

  it('treats price bounds as inclusive', () => {
    const res = applyFilters(INVENTORY, f({ minPrice: 340, maxPrice: 340 }));
    expect(res.length).toBeGreaterThan(0);
    for (const g of res) expect(g.priceUSD).toBe(340);
  });

  it('isolates matched pairs', () => {
    const res = applyFilters(INVENTORY, f({ pairsOnly: true }));
    expect(res).toHaveLength(4);
    for (const g of res) expect(g.isPair).toBe(true);
  });

  it('isolates photographed lots', () => {
    const res = applyFilters(INVENTORY, f({ photographedOnly: true }));
    expect(res).toHaveLength(12);
  });

  it('returns an empty array rather than throwing when nothing matches', () => {
    expect(applyFilters(INVENTORY, f({ minPrice: 999_999 }))).toEqual([]);
  });

  it('does not mutate the source array', () => {
    const before = [...INVENTORY];
    applyFilters(INVENTORY, f({ varieties: ['Blue Sapphire'] }));
    expect(INVENTORY).toEqual(before);
  });
});

describe('applySort', () => {
  it('sorts by price ascending', () => {
    const res = applySort(INVENTORY, 'price-asc');
    for (let i = 1; i < res.length; i += 1) {
      expect(res[i]!.priceUSD).toBeGreaterThanOrEqual(res[i - 1]!.priceUSD);
    }
  });

  it('sorts by price descending', () => {
    const res = applySort(INVENTORY, 'price-desc');
    expect(res[0]!.priceUSD).toBe(11_700);
  });

  it('sorts by carat descending', () => {
    expect(applySort(INVENTORY, 'carat-desc')[0]!.carats).toBe(5.35);
  });

  it('puts photographed lots before pending ones under "featured"', () => {
    const res = applySort(INVENTORY, 'featured');
    const lastShot = res.map((g) => g.photography).lastIndexOf('shot');
    const firstPending = res.map((g) => g.photography).indexOf('pending');
    expect(lastShot).toBeLessThan(firstPending);
  });

  it('leads with the most expensive photographed stone under "featured"', () => {
    expect(applySort(INVENTORY, 'featured')[0]!.code).toBe('HR16');
  });

  it('is stable for equal values, so the order never flickers', () => {
    const a = applySort(INVENTORY, 'price-desc').map((g) => g.code);
    const b = applySort([...INVENTORY].reverse(), 'price-desc').map((g) => g.code);
    expect(a).toEqual(b);
  });

  it('does not mutate its input', () => {
    const before = [...INVENTORY];
    applySort(INVENTORY, 'price-asc');
    expect(INVENTORY).toEqual(before);
  });
});

describe('URL round-trip', () => {
  it('survives a full round-trip unchanged', () => {
    const original = f({
      varieties: ['Blue Sapphire'],
      treatments: ['natural'],
      shapes: ['Oval'],
      minCarat: 2,
      maxCarat: 4,
      minPrice: 1000,
      maxPrice: 6000,
      pairsOnly: true,
      photographedOnly: true,
      sort: 'price-asc',
    });
    expect(filtersFromParams(new URLSearchParams(paramsFromFilters(original)))).toEqual(original);
  });

  it('emits an empty query string for default state', () => {
    expect(paramsFromFilters(EMPTY_FILTERS)).toBe('');
  });

  it('drops unknown values instead of throwing', () => {
    const parsed = filtersFromParams(
      new URLSearchParams('variety=Fictional+Sapphire&shape=Trapezoid&sort=chaos'),
    );
    expect(parsed.varieties).toEqual([]);
    expect(parsed.shapes).toEqual([]);
    expect(parsed.sort).toBe('featured');
  });

  it('ignores non-numeric bounds', () => {
    const parsed = filtersFromParams(new URLSearchParams('minCt=abc&maxUsd='));
    expect(parsed.minCarat).toBeNull();
    expect(parsed.maxPrice).toBeNull();
  });

  it('parses a footer link such as ?variety=Blue+Sapphire', () => {
    const parsed = filtersFromParams(new URLSearchParams('variety=Blue+Sapphire'));
    expect(parsed.varieties).toEqual(['Blue Sapphire']);
  });
});

describe('counts and facets', () => {
  it('counts active filters', () => {
    expect(countActiveFilters(EMPTY_FILTERS)).toBe(0);
    expect(countActiveFilters(f({ varieties: ['Blue Sapphire'], pairsOnly: true }))).toBe(2);
  });

  it('reports facet counts that sum to the catalogue size', () => {
    const total = varietyFacets(INVENTORY).reduce((s, o) => s + o.count, 0);
    expect(total).toBe(INVENTORY.length);
  });

  it('omits facets with no stones', () => {
    for (const o of varietyFacets(INVENTORY)) expect(o.count).toBeGreaterThan(0);
  });
});

describe('merchandising', () => {
  it('features only photographed stones', () => {
    for (const g of getFeaturedGems(6)) expect(g.photography).toBe('shot');
  });

  it('never relates a stone to itself', () => {
    for (const g of INVENTORY) {
      expect(getRelatedGems(g, 4).map((r) => r.code)).not.toContain(g.code);
    }
  });

  it('always fills the related rail', () => {
    for (const g of INVENTORY) expect(getRelatedGems(g, 3)).toHaveLength(3);
  });

  it('prefers the same variety when related stones exist', () => {
    const blue = getGemByCode('HR16')!;
    expect(getRelatedGems(blue, 3)[0]!.variety).toBe('Blue Sapphire');
  });
});

import { describe, expect, it } from 'vitest';
import { formatCarats, formatTreatment, formatTreatmentLong, formatUSD, slugify } from '@/lib/format';

describe('formatting', () => {
  it('formats USD without decimals', () => {
    expect(formatUSD(11700)).toBe('$11,700');
  });

  it('always shows two decimals for carats, per trade convention', () => {
    expect(formatCarats(2)).toBe('2.00 ct');
    expect(formatCarats(5.35)).toBe('5.35 ct');
    expect(formatCarats(3.1)).toBe('3.10 ct');
  });

  it('uses the trade word "Unheated" rather than "Natural"', () => {
    expect(formatTreatment('natural')).toBe('Unheated');
    expect(formatTreatment('heated')).toBe('Heated');
  });

  it('spells out treatment unambiguously in long form', () => {
    expect(formatTreatmentLong('natural')).toContain('no thermal enhancement');
    expect(formatTreatmentLong('heated')).toContain('disclosed');
  });

  it('slugifies', () => {
    expect(slugify('Blue Sapphire')).toBe('blue-sapphire');
    expect(slugify('  Yellow — Pair (Round) ')).toBe('yellow-pair-round');
  });
});

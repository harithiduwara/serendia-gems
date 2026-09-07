/** Presentation helpers. Pure, framework-free, unit-tested. */

const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

const lkr = new Intl.NumberFormat('en-LK', {
  style: 'currency',
  currency: 'LKR',
  maximumFractionDigits: 0,
});

export const formatUSD = (value: number): string => usd.format(value);
export const formatLKR = (value: number): string => lkr.format(value);

/** Carat weights are always shown to two decimals — trade convention. */
export const formatCarats = (value: number): string => `${value.toFixed(2)} ct`;

export const formatTreatment = (t: 'natural' | 'heated'): string =>
  t === 'natural' ? 'Unheated' : 'Heated';

/**
 * The long-form treatment label. Used where there is room to be unambiguous,
 * because "natural" is easy to misread as "not synthetic".
 */
export const formatTreatmentLong = (t: 'natural' | 'heated'): string =>
  t === 'natural'
    ? 'Unheated — no thermal enhancement'
    : 'Heated — standard, permanent, disclosed';

export const slugify = (value: string): string =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

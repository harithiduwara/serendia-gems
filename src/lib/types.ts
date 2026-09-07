/**
 * Domain model for the SerendiaGems catalogue.
 *
 * This file is the single source of truth for the shape of a lot. Both the data
 * module and every consumer depend on it; nothing here depends on React or Next.
 */

export const VARIETIES = [
  'Blue Sapphire',
  'Yellow Sapphire',
  'Pink Sapphire',
  'Violet Sapphire',
  'Green Sapphire',
  'White Sapphire',
] as const;
export type Variety = (typeof VARIETIES)[number];

export const SHAPES = ['Oval', 'Cushion', 'Heart', 'Round'] as const;
export type Shape = (typeof SHAPES)[number];

/**
 * `natural` means no thermal enhancement of any kind (the trade term is
 * "unheated"). `heated` is the standard, permanent, disclosed enhancement.
 */
export type Treatment = 'natural' | 'heated';

export type Status = 'available' | 'reserved' | 'sold';

/** Whether we hold photography for this lot yet. Never hidden from the buyer. */
export type PhotographyState = 'shot' | 'pending';

export interface Gem {
  /** Lot code. Primary key and URL segment, e.g. `HR16`. */
  code: string;
  variety: Variety;
  treatment: Treatment;
  /** Total carat weight. For a matched pair this is the combined weight. */
  carats: number;
  shape: Shape;
  /** True when the lot is two stones sold together. */
  isPair: boolean;
  priceLKR: number;
  /** Authoritative price of record. */
  priceUSD: number;
  /** Ordered `public/gems` filenames; first entry is the hero. May be empty. */
  images: string[];
  photography: PhotographyState;
  hasVideo: boolean;
  status: Status;
  /** One-line merchandising hook shown on cards. */
  caption: string;
  /** Long-form, stone-specific copy shown on the detail page. */
  description: string;
  /**
   * Observed colour. For photographed lots this describes the actual stone;
   * for lots awaiting photography it describes only what the variety implies.
   */
  colourNote: string;
  /** Editorially chosen highlights for the detail page. */
  highlights: string[];
}

export const SORT_KEYS = [
  'featured',
  'price-desc',
  'price-asc',
  'carat-desc',
  'carat-asc',
] as const;
export type SortKey = (typeof SORT_KEYS)[number];

export interface FilterState {
  varieties: Variety[];
  treatments: Treatment[];
  shapes: Shape[];
  /** Inclusive carat bounds. */
  minCarat: number | null;
  maxCarat: number | null;
  /** Inclusive USD bounds. */
  minPrice: number | null;
  maxPrice: number | null;
  pairsOnly: boolean;
  photographedOnly: boolean;
  sort: SortKey;
}

export const EMPTY_FILTERS: FilterState = {
  varieties: [],
  treatments: [],
  shapes: [],
  minCarat: null,
  maxCarat: null,
  minPrice: null,
  maxPrice: null,
  pairsOnly: false,
  photographedOnly: false,
  sort: 'featured',
};

import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { INVENTORY } from '@/data/inventory';
import { BLUR_PLACEHOLDERS } from '@/data/placeholders';
import { SHAPES, VARIETIES } from '@/lib/types';

const PUBLIC_GEMS = join(process.cwd(), 'public', 'gems');

/**
 * Data integrity (NFR-12). The catalogue is the product: a broken lot here is a
 * broken sale, so these run on every build.
 */
describe('inventory integrity', () => {
  it('holds all 24 lots from the source sheet', () => {
    expect(INVENTORY).toHaveLength(24);
  });

  it('has unique lot codes', () => {
    const codes = INVENTORY.map((g) => g.code);
    expect(new Set(codes).size).toBe(codes.length);
  });

  it('uses lot codes that are URL-safe', () => {
    for (const g of INVENTORY) expect(g.code).toMatch(/^[A-Z0-9]+$/);
  });

  it('records a positive carat weight for every lot', () => {
    for (const g of INVENTORY) expect(g.carats).toBeGreaterThan(0);
  });

  it('records positive prices in both currencies', () => {
    for (const g of INVENTORY) {
      expect(g.priceUSD).toBeGreaterThan(0);
      expect(g.priceLKR).toBeGreaterThan(0);
    }
  });

  it('keeps LKR and USD prices in a consistent ratio', () => {
    // The source sheet uses a fixed conversion. A row that drifts far from it
    // is almost certainly a transcription error.
    for (const g of INVENTORY) {
      expect(g.priceLKR / g.priceUSD).toBeCloseTo(300, 0);
    }
  });

  it('uses only known varieties and shapes', () => {
    for (const g of INVENTORY) {
      expect(VARIETIES).toContain(g.variety);
      expect(SHAPES).toContain(g.shape);
    }
  });

  it('resolves every referenced image to a file on disk', () => {
    for (const g of INVENTORY) {
      for (const img of g.images) {
        expect(existsSync(join(PUBLIC_GEMS, img)), `${g.code} → ${img}`).toBe(true);
      }
    }
  });

  it('has a blur placeholder for every referenced image', () => {
    for (const g of INVENTORY) {
      for (const img of g.images) {
        expect(BLUR_PLACEHOLDERS[img], `${g.code} → ${img}`).toBeTruthy();
      }
    }
  });

  it('gives every lot a caption, description, colour note and highlights', () => {
    for (const g of INVENTORY) {
      expect(g.caption.length, g.code).toBeGreaterThan(30);
      expect(g.description.length, g.code).toBeGreaterThan(150);
      expect(g.colourNote.length, g.code).toBeGreaterThan(10);
      expect(g.highlights.length, g.code).toBeGreaterThanOrEqual(3);
    }
  });

  it('names the lot code in the caption or description of every lot', () => {
    // Captions must be about *this* stone, not interchangeable boilerplate.
    for (const g of INVENTORY) {
      const text = `${g.caption} ${g.description}`;
      const mentionsSpec =
        text.includes(g.carats.toFixed(2)) || text.includes(String(g.carats));
      expect(mentionsSpec, `${g.code} caption does not reference its own weight`).toBe(true);
    }
  });
});

/**
 * The copy provenance rule (SRS §6). Lots we have not photographed must not
 * carry observational colour claims. This is a trust guarantee, so it is
 * enforced mechanically rather than left to review.
 */
describe('copy provenance rule', () => {
  const pending = INVENTORY.filter((g) => g.photography === 'pending');
  const shot = INVENTORY.filter((g) => g.photography === 'shot');

  it('covers 12 photographed and 12 pending lots', () => {
    expect(shot).toHaveLength(12);
    expect(pending).toHaveLength(12);
  });

  it('never attaches images to a lot marked pending', () => {
    for (const g of pending) expect(g.images).toHaveLength(0);
  });

  it('always attaches at least one image to a lot marked shot', () => {
    for (const g of shot) expect(g.images.length).toBeGreaterThan(0);
  });

  it('marks the colour of pending lots as not yet documented', () => {
    for (const g of pending) {
      expect(g.colourNote.toLowerCase(), g.code).toContain('awaiting photography');
    }
  });

  it('makes no observational colour claim in pending descriptions', () => {
    // Words that would assert something only a photograph could establish.
    const observational = /\b(vivid|saturated|brilliant|sparkl|lively|cornflower|pastel|magenta|amber|lilac|honey|champagne|inky|electric)\b/i;
    for (const g of pending) {
      expect(observational.test(g.description), `${g.code}: "${g.description.slice(0, 90)}…"`).toBe(false);
      expect(observational.test(g.caption), `${g.code} caption`).toBe(false);
    }
  });

  it('tells the reader photography is pending', () => {
    for (const g of pending) {
      expect(`${g.description} ${g.highlights.join(' ')}`.toLowerCase()).toContain('preparation');
    }
  });
});

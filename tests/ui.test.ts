import { describe, expect, it } from 'vitest';
import { shouldRevealStickyBar } from '@/lib/ui';

/**
 * The sticky bar's plumbing (scroll + rAF) is paused by the browser whenever the
 * document is hidden, so it cannot be exercised end-to-end in a headless
 * harness. The decision it makes is pure, so it is pinned here instead.
 */
describe('shouldRevealStickyBar', () => {
  const VH = 800; // threshold sits at 480

  it('stays hidden while the in-page actions are still in reach', () => {
    expect(shouldRevealStickyBar(700, VH)).toBe(false);
    expect(shouldRevealStickyBar(481, VH)).toBe(false);
  });

  it('reveals once the actions have scrolled past the threshold', () => {
    expect(shouldRevealStickyBar(479, VH)).toBe(true);
    expect(shouldRevealStickyBar(0, VH)).toBe(true);
  });

  it('stays revealed once the actions are above the viewport', () => {
    expect(shouldRevealStickyBar(-1200, VH)).toBe(true);
  });

  it('is hidden at the top of the page, where the real button is visible', () => {
    // A tall page: the action block sits well below the fold on first paint.
    expect(shouldRevealStickyBar(1050, VH)).toBe(false);
  });

  it('scales with viewport height rather than assuming a fixed offset', () => {
    expect(shouldRevealStickyBar(400, 1200)).toBe(true);  // threshold 720
    expect(shouldRevealStickyBar(400, 600)).toBe(false);  // threshold 360
  });

  it('honours an explicit threshold', () => {
    expect(shouldRevealStickyBar(300, 1000, 0.2)).toBe(false); // threshold 200
    expect(shouldRevealStickyBar(300, 1000, 0.5)).toBe(true);  // threshold 500
  });
});

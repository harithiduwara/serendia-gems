/**
 * Framework-free UI decisions.
 *
 * These are pulled out of components specifically so they can be unit-tested.
 * The surrounding plumbing (scroll listeners, rAF) is paused by the browser
 * whenever a document is hidden, which makes it awkward to exercise in an
 * automated harness — but the decision itself is pure arithmetic and can be
 * pinned exactly.
 */

/**
 * Whether the mobile sticky action bar should be revealed.
 *
 * `sentinelTop` is the in-page action block's position relative to the viewport
 * (as returned by getBoundingClientRect().top). The bar appears once those
 * actions have risen past the upper 60% of the viewport — i.e. once they are no
 * longer in comfortable thumb reach — and hides again when they return.
 *
 * The two must never be on screen together competing for the same tap.
 */
export const shouldRevealStickyBar = (
  sentinelTop: number,
  viewportHeight: number,
  threshold = 0.6,
): boolean => sentinelTop < viewportHeight * threshold;

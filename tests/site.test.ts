import { describe, expect, it } from 'vitest';
import { SITE } from '@/lib/site';

/**
 * Contact-detail integrity.
 *
 * The phone number is stored in three forms because three consumers need
 * different shapes: a human-readable string, an E.164 `tel:` target, and the
 * digits-only wa.me path segment. Nothing enforces that they describe the same
 * number, and a mismatch fails silently — the page looks correct while the
 * WhatsApp link quietly reaches the wrong number. That is a lost sale with no
 * error anywhere, so it is pinned here.
 */
describe('contact details', () => {
  const digitsOf = (v: string) => v.replace(/\D/g, '');

  it('expresses one number in all three forms', () => {
    expect(digitsOf(SITE.phoneDisplay)).toBe(digitsOf(SITE.phoneE164));
    expect(SITE.whatsapp).toBe(digitsOf(SITE.phoneE164));
  });

  it('stores phoneE164 in valid E.164 form', () => {
    expect(SITE.phoneE164).toMatch(/^\+\d{8,15}$/);
  });

  it('uses the wa.me format for the WhatsApp handle: digits only, no plus', () => {
    expect(SITE.whatsapp).toMatch(/^\d{8,15}$/);
  });

  it('is a Sri Lankan number, consistent with the brand premise', () => {
    expect(SITE.phoneE164.startsWith('+94')).toBe(true);
    // +94 followed by a 9-digit national number.
    expect(SITE.phoneE164).toHaveLength(12);
  });

  it('is not a placeholder', () => {
    // Guards against a run of repeated digits sneaking back in, which is what
    // every placeholder in this project has looked like.
    expect(SITE.phoneE164).not.toMatch(/(\d)\1{5,}/);
  });

  it('keeps the site URL free of a trailing slash, since paths are appended to it', () => {
    expect(SITE.url.endsWith('/')).toBe(false);
  });
});

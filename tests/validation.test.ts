import { beforeEach, describe, expect, it } from 'vitest';
import { enquirySchema } from '@/lib/validation';
import { __resetRateLimits, rateLimit } from '@/lib/rate-limit';

const valid = {
  name: 'Ayesha Perera',
  email: 'ayesha@example.com',
  message: 'I would like more images of lot HR16, please.',
  gemCodes: ['HR16'],
};

describe('enquiry schema', () => {
  it('accepts a well-formed enquiry', () => {
    expect(enquirySchema.safeParse(valid).success).toBe(true);
  });

  it('rejects a malformed email', () => {
    expect(enquirySchema.safeParse({ ...valid, email: 'not-an-email' }).success).toBe(false);
  });

  it('rejects a name that is too short', () => {
    expect(enquirySchema.safeParse({ ...valid, name: 'A' }).success).toBe(false);
  });

  it('rejects a message that is too short to act on', () => {
    expect(enquirySchema.safeParse({ ...valid, message: 'hi' }).success).toBe(false);
  });

  it('caps message length so the endpoint cannot be used as a dump', () => {
    expect(enquirySchema.safeParse({ ...valid, message: 'x'.repeat(4001) }).success).toBe(false);
  });

  it('caps the number of lot codes', () => {
    const many = Array.from({ length: 31 }, (_, i) => `HR${i}`);
    expect(enquirySchema.safeParse({ ...valid, gemCodes: many }).success).toBe(false);
  });

  it('defaults gemCodes to an empty array for a general enquiry', () => {
    const parsed = enquirySchema.safeParse({ ...valid, gemCodes: undefined });
    expect(parsed.success && parsed.data.gemCodes).toEqual([]);
  });

  it('accepts a filled honeypot at the schema layer', () => {
    // Deliberate: the route detects it and answers 200 so a bot learns nothing.
    // Rejecting here would reveal which field is the trap.
    const parsed = enquirySchema.safeParse({ ...valid, company: 'Acme' });
    expect(parsed.success).toBe(true);
    expect(parsed.success && parsed.data.company).toBe('Acme');
  });

  it('trims surrounding whitespace', () => {
    const parsed = enquirySchema.safeParse({ ...valid, name: '  Ayesha Perera  ' });
    expect(parsed.success && parsed.data.name).toBe('Ayesha Perera');
  });
});

describe('rate limit', () => {
  beforeEach(() => __resetRateLimits());

  it('allows requests up to the limit', () => {
    for (let i = 0; i < 5; i += 1) expect(rateLimit('ip-a').allowed).toBe(true);
  });

  it('blocks the request after the limit', () => {
    for (let i = 0; i < 5; i += 1) rateLimit('ip-b');
    expect(rateLimit('ip-b').allowed).toBe(false);
  });

  it('tracks callers independently', () => {
    for (let i = 0; i < 5; i += 1) rateLimit('ip-c');
    expect(rateLimit('ip-c').allowed).toBe(false);
    expect(rateLimit('ip-d').allowed).toBe(true);
  });

  it('reports remaining allowance', () => {
    expect(rateLimit('ip-e').remaining).toBe(4);
    expect(rateLimit('ip-e').remaining).toBe(3);
  });
});

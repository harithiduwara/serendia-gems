import { NextResponse } from 'next/server';
import { getGemByCode } from '@/lib/catalog';
import { rateLimit } from '@/lib/rate-limit';
import { enquirySchema, type EnquiryResponse } from '@/lib/validation';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Best-effort client IP for rate limiting behind a proxy/CDN. */
const clientIp = (req: Request): string => {
  const fwd = req.headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0]?.trim() ?? 'unknown';
  return req.headers.get('x-real-ip') ?? 'unknown';
};

const json = (body: EnquiryResponse, status: number) =>
  NextResponse.json(body, { status });

export async function POST(req: Request): Promise<NextResponse> {
  // 1. Rate limit before doing any work.
  const limit = rateLimit(`enquiry:${clientIp(req)}`);
  if (!limit.allowed) {
    return json(
      { ok: false, message: 'Too many enquiries from this connection. Please try again shortly, or email us directly.' },
      429,
    );
  }

  // 2. Parse.
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return json({ ok: false, message: 'We could not read that request.' }, 400);
  }

  // 3. Validate. The client's own checks are never trusted.
  const parsed = enquirySchema.safeParse(raw);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === 'string' && !errors[key]) errors[key] = issue.message;
    }
    return json({ ok: false, message: 'Please check the highlighted fields.', errors }, 400);
  }

  const data = parsed.data;

  // 4. Honeypot: accept silently so a bot learns nothing from the response.
  if (data.company) {
    return json({ ok: true, message: 'Thank you — your enquiry has been received.' }, 200);
  }

  // 5. Resolve lot codes against real inventory; drop anything unrecognised so
  //    arbitrary strings can never reach the delivery layer.
  const lots = data.gemCodes
    .map((c) => getGemByCode(c))
    .filter((g): g is NonNullable<typeof g> => Boolean(g))
    .map((g) => `${g.code} (${g.carats.toFixed(2)} ct ${g.variety}, US$${g.priceUSD})`);

  // 6. Deliver.
  //
  //    INTEGRATION POINT — see docs/01-requirements-srs.md §7. Transactional
  //    email needs the merchant's provider credentials and verified domain, so
  //    1.0 ships the validated, rate-limited contract and logs server-side.
  //    Replacing this block with a provider call is a single-function change.
  const enquiry = {
    receivedAt: new Date().toISOString(),
    name: data.name,
    email: data.email,
    phone: data.phone || null,
    country: data.country || null,
    lots,
    message: data.message,
  };

  if (process.env.ENQUIRY_TO_EMAIL) {
    // Deliberately not implemented against an unconfigured provider.
    console.info('[enquiry] delivery configured; payload ready', { to: process.env.ENQUIRY_TO_EMAIL });
  }
  console.info('[enquiry] received', enquiry);

  return json(
    { ok: true, message: 'Thank you — your enquiry has been received. We reply personally, usually within one working day.' },
    200,
  );
}

/** Anything other than POST is not a thing this endpoint does. */
export function GET(): NextResponse {
  return NextResponse.json({ ok: false, message: 'Method not allowed.' }, { status: 405 });
}

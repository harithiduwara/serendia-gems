'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Button, Field, inputClass } from '@/components/primitives';
import { useWishlist } from '@/components/wishlist/WishlistProvider';
import { SITE } from '@/lib/site';
import { enquirySchema, staticEnquirySchema, type EnquiryResponse } from '@/lib/validation';

/**
 * The static export has no server, so there is no /api/enquiry to POST to.
 * Instead the form validates locally and hands the enquiry to a channel that
 * does have a delivery path.
 *
 * WhatsApp is the primary one. It goes to a number that demonstrably works,
 * it is how this market actually talks to a seller, and the reply arrives
 * where the buyer already is. Email is kept as the alternative, because not
 * everyone uses WhatsApp — but it is second, not first.
 */
const IS_STATIC = process.env.NEXT_PUBLIC_STATIC_EXPORT === '1';

/** WhatsApp carries the enquiry in a URL, and very long URLs fail to open. */
const WHATSAPP_TEXT_MAX = 1500;

type Status = 'idle' | 'sending' | 'sent' | 'error';
type Channel = 'whatsapp' | 'email';

export function EnquiryForm() {
  const searchParams = useSearchParams();
  const { codes, ready } = useWishlist();

  const [status, setStatus] = useState<Status>('idle');
  const [sentVia, setSentVia] = useState<Channel>('whatsapp');

  /**
   * Fallback for which channel was meant. The submit event's `submitter` is the
   * authority (see onSubmit) because it is set by the browser however the form
   * was submitted — mouse, keyboard, or programmatically. This ref only covers
   * the case where a browser reports no submitter at all.
   */
  const channelRef = useRef<Channel>('whatsapp');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState('');
  const [message, setMessage] = useState('');
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const MESSAGE_MAX = 4000;

  // Static builds do not need a typed email address — see lib/validation.ts.
  const activeSchema = IS_STATIC ? staticEnquirySchema : enquirySchema;

  /**
   * Nielsen #5, error prevention: catch a mistyped email at the moment the
   * field is left rather than after the whole form is submitted and rejected.
   * Only fields the user has actually visited are validated, so the form never
   * scolds them about work they have not done yet.
   */
  const validateField = (name: string, value: string) => {
    if (!touched[name]) return;
    const single = activeSchema.shape[name as 'name' | 'email' | 'message'];
    if (!single) return;
    const result = single.safeParse(value);
    setErrors((prev) => {
      const next = { ...prev };
      if (result.success) delete next[name];
      else next[name] = result.error.issues[0]?.message ?? 'Please check this field.';
      return next;
    });
  };

  const onBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTouched((t) => ({ ...t, [name]: true }));
    // Read through the updated flag directly; state has not committed yet.
    const single = activeSchema.shape[name as 'name' | 'email' | 'message'];
    if (!single) return;
    const result = single.safeParse(value);
    setErrors((prev) => {
      const next = { ...prev };
      if (result.success) delete next[name];
      else next[name] = result.error.issues[0]?.message ?? 'Please check this field.';
      return next;
    });
  };

  // A stone code arriving as ?gem=HR16 pre-fills the message so the buyer
  // never has to retype what they were looking at.
  const gemParam = searchParams.get('gem');
  const subjectCodes = gemParam ? [gemParam] : ready ? codes : [];

  useEffect(() => {
    if (gemParam && !message) {
      setMessage(`I am interested in lot ${gemParam}. Could you send further images, video and certification details?`);
    }
  }, [gemParam, message]);

  /** Builds the enquiry body shared by both channels. */
  const composeLines = (payload: Record<string, string | string[]>): string[] =>
    [
      `Name: ${payload.name}`,
      payload.email ? `Email: ${payload.email}` : null,
      payload.phone ? `Phone: ${payload.phone}` : null,
      payload.country ? `Country: ${payload.country}` : null,
      subjectCodes.length ? `Lots: ${subjectCodes.join(', ')}` : null,
      '',
      String(payload.message),
    ].filter((l): l is string => l !== null);

  const handOff = (channel: Channel, payload: Record<string, string | string[]>) => {
    const lines = composeLines(payload);
    const subject = subjectCodes.length
      ? `Enquiry — lot ${subjectCodes.join(', ')}`
      : 'Enquiry from serendiagems.com';

    if (channel === 'email') {
      window.location.href =
        `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}` +
        `&body=${encodeURIComponent(lines.join('\n'))}`;
      return;
    }

    let text = [subject, '', ...lines].join('\n');
    if (text.length > WHATSAPP_TEXT_MAX) {
      // Trim the free-text tail rather than the details above it, and say so,
      // so nothing is lost silently.
      text = `${text.slice(0, WHATSAPP_TEXT_MAX - 40).trimEnd()}…\n(message continues — I will send the rest)`;
    }
    // A new tab, so the stone they were reading is still there behind it.
    window.open(`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Which button submitted the form. Reading the submitter rather than a
    // click handler keeps this correct for keyboard submits too.
    const submitter = (e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
    const channel: Channel =
      submitter?.value === 'email' || submitter?.value === 'whatsapp'
        ? (submitter.value as Channel)
        : channelRef.current;
    setStatus('sending');
    setErrors({});
    setFormError('');

    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get('name') ?? ''),
      email: String(fd.get('email') ?? ''),
      phone: String(fd.get('phone') ?? ''),
      country: String(fd.get('country') ?? ''),
      message: String(fd.get('message') ?? ''),
      company: String(fd.get('company') ?? ''),
      gemCodes: subjectCodes,
    };

    // Static build: validate locally, then hand the enquiry to a real channel.
    if (IS_STATIC) {
      const parsed = activeSchema.safeParse(payload);
      if (!parsed.success) {
        const fieldErrors: Record<string, string> = {};
        for (const issue of parsed.error.issues) {
          const key = issue.path[0];
          if (typeof key === 'string' && !fieldErrors[key]) fieldErrors[key] = issue.message;
        }
        setErrors(fieldErrors);
        setFormError('Please check the highlighted fields.');
        setStatus('error');
        return;
      }

      handOff(channel, payload);
      setSentVia(channel);
      setStatus('sent');
      return;
    }

    try {
      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data: EnquiryResponse = await res.json();

      if (!res.ok || !data.ok) {
        setErrors(data.errors ?? {});
        setFormError(data.message || 'Something went wrong. Please try again.');
        setStatus('error');
        return;
      }
      setStatus('sent');
    } catch {
      setFormError('We could not reach the server. Please check your connection, or email us directly.');
      setStatus('error');
    }
  };

  if (status === 'sent') {
    return (
      <div
        role="status"
        className="rounded-[var(--r-md)] border border-positive/30 bg-positive/5 p-8 text-center"
      >
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4 text-positive" aria-hidden="true">
          <circle cx="12" cy="12" r="10" /><path d="m8.5 12.5 2.5 2.5 4.5-5" />
        </svg>
        <h2 className="t-title mb-2">
          {!IS_STATIC
            ? 'Your enquiry is with us'
            : sentVia === 'whatsapp'
              ? 'WhatsApp is open with your enquiry'
              : 'Your email is ready to send'}
        </h2>
        <p className="measure mx-auto text-[0.9375rem] leading-relaxed text-[color:var(--muted-fg)]">
          {!IS_STATIC
            ? 'We reply to every enquiry personally, usually within one working day. If you asked about a specific lot we will send further images and video with the reply.'
            : sentVia === 'whatsapp'
              ? 'Your enquiry is written out in WhatsApp — press send there and it reaches us. We reply personally, usually within one working day.'
              : 'We have opened your mail application with the details filled in. Press send there and it reaches us — we reply personally, usually within one working day.'}
        </p>
        {IS_STATIC ? (
          <p className="mt-4 text-[0.8125rem] text-[color:var(--subtle-fg)]">
            Nothing happened?{' '}
            <a
              href={`https://wa.me/${SITE.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="link-underline font-medium"
            >
              Open WhatsApp directly
            </a>{' '}
            on {SITE.phoneDisplay}, or write to{' '}
            <a href={`mailto:${SITE.email}`} className="link-underline font-medium">
              {SITE.email}
            </a>
            .
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <form onSubmit={(e) => void onSubmit(e)} noValidate className="space-y-5">
      {subjectCodes.length > 0 ? (
        <div className="rounded-[var(--r-md)] border border-royal/20 bg-mist/50 p-4">
          <p className="text-[0.8125rem] font-medium">
            {subjectCodes.length === 1 ? 'Enquiring about lot' : 'Enquiring about lots'}
          </p>
          <p className="t-num mt-1 text-sm text-royal">
            {subjectCodes.join(', ')}
          </p>
        </div>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Your name" htmlFor="name" required error={errors.name}>
          <input
            id="name" name="name" type="text" required autoComplete="name"
            onBlur={onBlur}
            onChange={(e) => validateField('name', e.target.value)}
            className={inputClass}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'name-error' : undefined}
          />
        </Field>
        <Field
          label="Email"
          htmlFor="email"
          required={!IS_STATIC}
          hint={IS_STATIC ? 'Optional — we can reply on WhatsApp.' : undefined}
          error={errors.email}
        >
          <input
            id="email" name="email" type="email" required={!IS_STATIC} autoComplete="email"
            onBlur={onBlur}
            onChange={(e) => validateField('email', e.target.value)}
            className={inputClass}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
        </Field>
        <Field label="Phone or WhatsApp" htmlFor="phone" hint="Optional — often the fastest way to reach you." error={errors.phone}>
          <input id="phone" name="phone" type="tel" autoComplete="tel" className={inputClass} />
        </Field>
        <Field label="Country" htmlFor="country" hint="Optional — helps us quote shipping and duty." error={errors.country}>
          <input id="country" name="country" type="text" autoComplete="country-name" className={inputClass} />
        </Field>
      </div>

      <Field
        label="What are you looking for?"
        htmlFor="message"
        required
        error={errors.message}
        hint="Colour, size, budget, and what the stone is for. The more you tell us, the better we can help."
      >
        <textarea
          id="message" name="message" required rows={6}
          value={message}
          maxLength={MESSAGE_MAX}
          onBlur={onBlur}
          onChange={(e) => { setMessage(e.target.value); validateField('message', e.target.value); }}
          className={`${inputClass} resize-y`}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={`message-count${errors.message ? ' message-error' : ''}`}
        />
        {/* Only surfaces near the limit — a counter shown from character one is
            a distraction, and at 90% it becomes genuinely useful. */}
        <p
          id="message-count"
          className={`mt-1.5 text-right text-xs tabular-nums ${
            message.length > MESSAGE_MAX * 0.9 ? 'text-warning' : 'text-[color:var(--subtle-fg)]'
          }`}
        >
          {message.length > MESSAGE_MAX * 0.75
            ? `${MESSAGE_MAX - message.length} characters left`
            : '\u00A0'}
        </p>
      </Field>

      {/* Honeypot — hidden from people, irresistible to bots. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="company">Company (leave blank)</label>
        <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {formError ? (
        <p role="alert" className="rounded-[var(--r-sm)] border border-critical/30 bg-critical/5 px-4 py-3 text-sm text-critical">
          {formError}
        </p>
      ) : null}

      <div className="space-y-3 pt-1">
        <div className="flex flex-wrap items-center gap-3">
          <Button
            type="submit"
            size="lg"
            disabled={status === 'sending'}
            name="channel"
            value="whatsapp"
            onClick={() => { channelRef.current = 'whatsapp'; }}
          >
            {status === 'sending' ? 'Sending…' : IS_STATIC ? 'Send on WhatsApp' : 'Send enquiry'}
          </Button>

          {IS_STATIC ? (
            <Button
              type="submit"
              variant="secondary"
              size="lg"
              disabled={status === 'sending'}
              name="channel"
              value="email"
              onClick={() => { channelRef.current = 'email'; }}
            >
              Send as email instead
            </Button>
          ) : null}
        </div>

        <p className="text-xs text-[color:var(--subtle-fg)]">
          {IS_STATIC
            ? 'WhatsApp opens with your enquiry written out — check it and press send there. We use your details only to answer it. No mailing list, no third parties.'
            : 'We use your details only to answer this enquiry. No mailing list, no third parties.'}
        </p>
      </div>
    </form>
  );
}

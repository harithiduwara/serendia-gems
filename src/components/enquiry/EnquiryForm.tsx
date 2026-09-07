'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button, Field, inputClass } from '@/components/primitives';
import { useWishlist } from '@/components/wishlist/WishlistProvider';
import type { EnquiryResponse } from '@/lib/validation';

type Status = 'idle' | 'sending' | 'sent' | 'error';

export function EnquiryForm() {
  const searchParams = useSearchParams();
  const { codes, ready } = useWishlist();

  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState('');
  const [message, setMessage] = useState('');

  // A stone code arriving as ?gem=HR16 pre-fills the message so the buyer
  // never has to retype what they were looking at.
  const gemParam = searchParams.get('gem');
  const subjectCodes = gemParam ? [gemParam] : ready ? codes : [];

  useEffect(() => {
    if (gemParam && !message) {
      setMessage(`I am interested in lot ${gemParam}. Could you send further images, video and certification details?`);
    }
  }, [gemParam, message]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
        <h2 className="t-title mb-2">Your enquiry is with us</h2>
        <p className="measure mx-auto text-[0.9375rem] leading-relaxed text-[color:var(--muted-fg)]">
          We reply to every enquiry personally, usually within one working day. If you asked about
          a specific lot we will send further images and video with the reply.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      {subjectCodes.length > 0 ? (
        <div className="rounded-[var(--r-md)] border border-royal/20 bg-mist/50 p-4 dark:bg-royal/15">
          <p className="text-[0.8125rem] font-medium">
            {subjectCodes.length === 1 ? 'Enquiring about lot' : 'Enquiring about lots'}
          </p>
          <p className="t-num mt-1 text-sm text-royal dark:text-cornflower">
            {subjectCodes.join(', ')}
          </p>
        </div>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Your name" htmlFor="name" required error={errors.name}>
          <input
            id="name" name="name" type="text" required autoComplete="name"
            className={inputClass}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'name-error' : undefined}
          />
        </Field>
        <Field label="Email" htmlFor="email" required error={errors.email}>
          <input
            id="email" name="email" type="email" required autoComplete="email"
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
          onChange={(e) => setMessage(e.target.value)}
          className={`${inputClass} resize-y`}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? 'message-error' : undefined}
        />
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

      <div className="flex flex-wrap items-center gap-4 pt-1">
        <Button type="submit" size="lg" disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending…' : 'Send enquiry'}
        </Button>
        <p className="text-xs text-[color:var(--subtle-fg)]">
          We use your details only to answer this enquiry. No mailing list, no third parties.
        </p>
      </div>
    </form>
  );
}

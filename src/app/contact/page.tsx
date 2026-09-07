import { Suspense } from 'react';
import { EnquiryForm } from '@/components/enquiry/EnquiryForm';
import { Container } from '@/components/primitives';
import { buildMetadata } from '@/lib/seo';
import { SITE } from '@/lib/site';

export const metadata = buildMetadata({
  title: 'Enquire',
  description:
    'Ask about a specific stone or tell us what you are looking for. We reply personally, usually within one working day, with further images, video and certification.',
  path: '/contact',
});

export default function ContactPage() {
  return (
    <>
      <section className="border-b border-[color:var(--panel-line)] bg-[color:var(--panel-bg)]">
        <Container>
          <div className="py-14 sm:py-20">
            <p className="t-eyebrow mb-4 text-gold">Enquire</p>
            <h1 className="t-display-2 max-w-3xl">Tell us what you are looking for</h1>
            <p className="t-lead measure mt-5">
              Nothing is bought online here. You ask, we send everything you need to judge the
              stone — more photographs, video, laboratory certification — and only then do we talk
              about terms.
            </p>
          </div>
        </Container>
      </section>

      <Container>
        <div className="grid gap-14 py-14 lg:grid-cols-[1.35fr_0.65fr] lg:gap-20 sm:py-20">
          <div>
            <Suspense fallback={<div className="h-96 animate-pulse rounded-[var(--r-md)] bg-[color:var(--color-sunken)]" />}>
              <EnquiryForm />
            </Suspense>
          </div>

          <aside className="space-y-9">
            <div>
              <h2 className="t-title mb-3">Reach us directly</h2>
              <ul className="space-y-2.5 text-[0.9375rem]">
                <li>
                  <a href={`mailto:${SITE.email}`} className="link-underline text-royal dark:text-cornflower">
                    {SITE.email}
                  </a>
                </li>
                <li>
                  <a href={`tel:${SITE.phoneE164}`} className="link-underline text-royal dark:text-cornflower">
                    {SITE.phoneDisplay}
                  </a>
                </li>
                <li>
                  <a
                    href={`https://wa.me/${SITE.whatsapp}`}
                    rel="noopener noreferrer"
                    className="link-underline text-royal dark:text-cornflower"
                  >
                    WhatsApp
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="t-title mb-3">Where we are</h2>
              <address className="not-italic text-[0.9375rem] leading-relaxed text-[color:var(--muted-fg)]">
                {SITE.address.street}
                <br />
                {SITE.address.city}, {SITE.address.region}
                <br />
                {SITE.address.country}
              </address>
              <p className="mt-3 text-[0.8125rem] leading-relaxed text-[color:var(--subtle-fg)]">
                Ratnapura — literally &ldquo;city of gems&rdquo; — is where most of Sri Lanka&rsquo;s
                sapphire is traded. Visits by appointment.
              </p>
            </div>

            <div className="rounded-[var(--r-md)] border border-[color:var(--panel-line)] bg-[color:var(--color-sunken)] p-5">
              <h2 className="t-title mb-2.5 !text-[1.0625rem]">What happens next</h2>
              <ol className="space-y-2.5 text-[0.875rem] leading-relaxed text-[color:var(--muted-fg)]">
                {[
                  'We reply personally — no automated sequence.',
                  'You get further images and video of the stone under different lighting.',
                  'Independent certification is arranged if you want it, before any commitment.',
                  'Payment and insured shipping are agreed only once you are satisfied.',
                ].map((step, i) => (
                  <li key={step} className="flex gap-3">
                    <span className="t-num mt-px shrink-0 font-semibold text-gold">{i + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </aside>
        </div>
      </Container>
    </>
  );
}

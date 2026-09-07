import { ButtonLink, Container, SectionHeading } from '@/components/primitives';
import { getAllGems } from '@/lib/catalog';
import { buildMetadata } from '@/lib/seo';
import { SITE } from '@/lib/site';

export const metadata = buildMetadata({
  title: 'Our House',
  description:
    'Who we are, how we source, and the terms we hold ourselves to. Ceylon sapphires bought at the source in Ratnapura and sold direct.',
  path: '/about',
});

export default function AboutPage() {
  const gems = getAllGems();
  const unheated = gems.filter((g) => g.treatment === 'natural').length;
  const photographed = gems.filter((g) => g.photography === 'shot').length;

  return (
    <>
      <section className="sapphire-ground on-dark">
        <Container width="prose">
          <div className="py-20 sm:py-28">
            <p className="t-eyebrow mb-4 text-gold-bright">Our house</p>
            <h1 className="t-display-2 text-white">
              A small house, in the city the gems come from
            </h1>
            <p className="t-lead mt-6 !text-[1.0625rem]">
              We are based in Ratnapura, in Sri Lanka&rsquo;s Sabaragamuwa province — the centre of
              the island&rsquo;s gem trade for as long as there has been one. We buy from the
              miners and cutters we know, and we sell to the people who will actually wear and set
              the stones.
            </p>
          </div>
        </Container>
      </section>

      <Container width="prose">
        <div className="py-16 sm:py-20">
          <SectionHeading title="How we work" className="mb-8" />
          <div className="space-y-5 text-[1.0625rem] leading-[1.78] text-[color:var(--muted-fg)]">
            <p>
              There are usually four or five parties between a Sri Lankan mine and a retail
              display case, and each one takes a margin. We have removed most of them. What that
              buys you is not just a lower price — it is a straight answer, from someone who
              handled the stone.
            </p>
            <p>
              Every lot on this site is an individual stone. We photograph each one ourselves, in
              daylight and under tweezers, and we describe what we see rather than what would sell
              best. When a stone&rsquo;s colour is soft, we say soft. When a stone has visible
              inclusions, we say so and explain what they mean. We would rather lose a sale than
              have a stone come back.
            </p>
          </div>

          <div className="my-14 grid gap-6 sm:grid-cols-3">
            {[
              { v: String(gems.length), l: 'Stones currently held' },
              { v: String(unheated), l: 'Never heated' },
              { v: `${photographed}/${gems.length}`, l: 'Photographed in studio' },
            ].map((s) => (
              <div key={s.l} className="rounded-[var(--r-md)] border border-[color:var(--panel-line)] p-6 text-center">
                <p className="t-num font-display text-4xl font-medium text-royal dark:text-cornflower">{s.v}</p>
                <p className="mt-1.5 text-[0.8125rem] text-[color:var(--muted-fg)]">{s.l}</p>
              </div>
            ))}
          </div>

          <SectionHeading title="What we commit to" className="mb-8" />
          <ul className="space-y-6">
            {[
              {
                t: 'Full treatment disclosure, always',
                d: 'Heated or unheated is stated on every lot, in three places, in writing. We will never describe a heated stone as natural, and we will never let the word "natural" do ambiguous work.',
              },
              {
                t: 'Independent certification before you pay',
                d: 'For any stone, we will arrange a report from a recognised laboratory — including one you choose — before money changes hands. If a report contradicts what we told you, the sale is off and you owe us nothing.',
              },
              {
                t: 'We describe stones honestly',
                d: 'Including their weaknesses. Several descriptions on this site tell you plainly that another lot would suit you better. That is deliberate.',
              },
              {
                t: 'Seven days to change your mind',
                d: 'From the day a stone reaches you. Returned in the condition it was sent, we refund in full — the stone, not the shipping.',
              },
              {
                t: 'Insured, tracked, worldwide',
                d: 'Every stone ships fully insured for its full value, with tracking, and is signed for on arrival.',
              },
            ].map((c) => (
              <li key={c.t} className="border-l-2 border-gold pl-5">
                <h3 className="t-title mb-1.5 !text-[1.125rem]">{c.t}</h3>
                <p className="text-[0.9375rem] leading-[1.7] text-[color:var(--muted-fg)]">{c.d}</p>
              </li>
            ))}
          </ul>

          <div className="mt-14 rounded-[var(--r-md)] border border-[color:var(--panel-line)] bg-[color:var(--color-sunken)] p-7">
            <h2 className="t-title mb-3">Come and see</h2>
            <p className="mb-5 text-[0.9375rem] leading-relaxed text-[color:var(--muted-fg)]">
              If you are in Sri Lanka, you are welcome to see any of these stones in person, by
              appointment. Daylight in Ratnapura is the light they were judged in.
            </p>
            <div className="flex flex-wrap gap-3">
              <ButtonLink href="/contact">Arrange a visit</ButtonLink>
              <ButtonLink href={`mailto:${SITE.email}`} variant="secondary">{SITE.email}</ButtonLink>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}

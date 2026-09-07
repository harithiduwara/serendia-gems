import { ArticleHeader, GuideFooter, KeyTakeaway, Prose } from '@/components/editorial/Prose';
import { ButtonLink, Container } from '@/components/primitives';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Caring for Your Sapphire',
  description:
    'Cleaning, setting, storage and travel. What will and will not damage a sapphire, and the one thing that genuinely can.',
  path: '/guide/gemstone-care',
  type: 'article',
});

export default function Page() {
  return (
    <>
      <ArticleHeader
        eyebrow="Care"
        title="Caring for your stone"
        lead="Sapphire is the second hardest natural substance there is. It still needs a little thought."
      />
      <Container width="prose">
        <Prose>
          <p>
            At 9 on the Mohs scale, sapphire is harder than everything you are likely to encounter
            day to day — steel, glass, quartz, sand. Only diamond and other corundum will scratch
            it. This is why sapphire has always been a sensible choice for a ring worn every day,
            and why it survives generations.
          </p>

          <h2>Cleaning</h2>
          <p>
            Warm water, a drop of ordinary washing-up liquid, and a soft toothbrush. Work behind the
            stone as well as across the top — the film that dulls a sapphire almost always collects
            underneath, where light enters. Rinse and dry with a lint-free cloth.
          </p>
          <p>Every few weeks is plenty. Skin oils and hand cream are the usual culprits.</p>

          <h3>Ultrasonic and steam cleaners</h3>
          <p>
            Generally safe for an untreated or conventionally heated sapphire in a sound setting.
            <strong> Do not use them</strong> if the stone has significant fractures reaching the
            surface, if it has been fracture-filled, or if you are not certain which. When in doubt,
            wash it by hand — you lose nothing.
          </p>

          <KeyTakeaway>
            <p>
              The stone is nearly indestructible. <strong>The setting is not.</strong> Almost every
              lost gemstone was lost because a prong wore through, not because the stone failed.
              Have the setting checked once a year.
            </p>
          </KeyTakeaway>

          <h2>Storage</h2>
          <p>
            Store separately, in a soft pouch or a lined compartment. A sapphire tossed into a
            jewellery box with other pieces will scratch every softer stone it touches — emerald,
            opal, tanzanite, pearl — and will be scratched in turn by anything harder.
          </p>

          <h2>What to keep it away from</h2>
          <ul>
            <li><strong>Chlorinated water.</strong> Harmless to the sapphire, damaging to gold and platinum alloys over time. Take rings off before a pool or hot tub.</li>
            <li><strong>Household bleach and strong solvents.</strong> Same reason — the metal, not the stone.</li>
            <li><strong>Sudden extreme heat.</strong> Never take a set stone near a jeweller&rsquo;s torch without a professional handling it. Thermal shock can crack even corundum.</li>
            <li><strong>Impact on the girdle.</strong> Hardness is not toughness. A hard knock on the thin edge of a stone can chip it. Take rings off for the gym and for heavy work.</li>
          </ul>

          <h2>Setting advice</h2>
          <p>
            For a stone you intend to wear daily, a bezel or a half-bezel protects the girdle far
            better than prongs. If you prefer prongs, six holds more securely than four, and
            platinum wears more slowly than gold.
          </p>
          <p>
            For the matched pairs in this collection, tell your jeweller they are a matched pair
            before work starts — they should be set as a set, with orientation chosen so the colour
            reads consistently between the two.
          </p>

          <h2>Travel and insurance</h2>
          <p>
            Carry fine jewellery in hand luggage, never checked. Have any significant stone
            valued for insurance after purchase — a laboratory report and a purchase invoice
            together are what an insurer will ask for. Keep both somewhere other than the box the
            stone lives in.
          </p>
        </Prose>

        <div className="flex flex-wrap gap-3 pb-14">
          <ButtonLink href="/contact" variant="secondary">Ask us about setting a stone</ButtonLink>
        </div>
        <GuideFooter current="/guide/gemstone-care" />
      </Container>
    </>
  );
}

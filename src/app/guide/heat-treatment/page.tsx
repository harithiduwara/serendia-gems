import { ArticleHeader, GuideFooter, KeyTakeaway, Prose } from '@/components/editorial/Prose';
import { ButtonLink, Container } from '@/components/primitives';
import { getAllGems } from '@/lib/catalog';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Heated vs Unheated Sapphire',
  description:
    'What heat treatment actually does to a sapphire, why it is disclosed, what the unheated premium buys you — and when it is not worth paying.',
  path: '/guide/heat-treatment',
  type: 'article',
});

export default function Page() {
  const gems = getAllGems();
  const unheated = gems.filter((g) => g.treatment === 'natural').length;

  return (
    <>
      <ArticleHeader
        eyebrow="Treatment"
        title="Heated and unheated"
        lead="The single most misunderstood thing in coloured stones, and the one most likely to cost you money if you get it wrong."
      />
      <Container width="prose">
        <Prose>
          <p>
            Somewhere between 90 and 95 per cent of the sapphire sold in the world has been heated.
            This is not a scandal and it is not a secret — it is the standard practice of the trade,
            it has been for centuries, and it is disclosed at every reputable step of the chain.
            What matters is understanding what it is, so you know what you are paying for.
          </p>

          <h2>What heating actually does</h2>
          <p>
            Rough corundum is heated in a furnace — typically somewhere between 800 °C and 1,800 °C,
            for hours or days. Two things happen. Dissolved trace elements redistribute through the
            crystal, which deepens and evens out the colour. And microscopic rutile inclusions
            (&ldquo;silk&rdquo;) dissolve, which improves transparency.
          </p>
          <p>
            The result is <strong>permanent and stable</strong>. A heated sapphire will not fade,
            revert, or need special handling. You can wear it daily, clean it normally, and reset it
            without concern. It is not a coating or a filling; nothing has been added. The stone is
            the same mineral it was before, rearranged.
          </p>

          <h3>What heating is not</h3>
          <ul>
            <li><strong>Not synthetic.</strong> A heated sapphire is mined. Lab-grown is an entirely different thing, and a different price bracket.</li>
            <li><strong>Not diffusion.</strong> Beryllium or titanium diffusion drives colour in from outside and is a substantially inferior treatment. It must be disclosed separately and is not applied to anything here.</li>
            <li><strong>Not fracture filling.</strong> Glass or resin filling of cavities is a different, much more serious treatment.</li>
          </ul>

          <KeyTakeaway>
            <p>
              Heat is accepted. Diffusion and filling are not — or at least, are worth dramatically
              less. Any seller who says &ldquo;treated&rdquo; without specifying which treatment is
              telling you nothing. Ask the specific question.
            </p>
          </KeyTakeaway>

          <h2>So why does unheated cost more?</h2>
          <p>
            Scarcity, and nothing else. A stone that came out of the ground already showing good
            colour and clarity, needing no intervention at all, is simply much rarer than one that
            needed help. Rarity sets the price.
          </p>
          <p>
            The premium is real and it is large: unheated stones commonly carry two to four times
            the price of a comparable heated stone, and considerably more at the top of the market.
            It is worth being clear-eyed about what that money buys.
          </p>

          <h3>It does not buy a more beautiful stone</h3>
          <p>
            This is the part sellers rarely say plainly. A fine heated sapphire is frequently
            <em> better looking</em> than a mediocre unheated one — better colour, better clarity,
            more life. If you are buying with your eyes, an unheated certificate adds nothing you
            can see.
          </p>

          <h2>When to pay the premium</h2>
          <ul>
            <li><strong>You are buying as a store of value.</strong> Unheated stones hold and appreciate value more reliably at auction.</li>
            <li><strong>The stone is required to be untreated.</strong> Astrological settings, particularly for yellow sapphire (Pukhraj) and blue (Neelam), usually specify unheated.</li>
            <li><strong>Provenance matters to you personally.</strong> A perfectly good reason on its own.</li>
          </ul>

          <h2>When not to</h2>
          <ul>
            <li><strong>You want the best-looking stone for your budget.</strong> Buy heated. You will get materially more colour and size for the money.</li>
            <li><strong>It is an everyday ring.</strong> Heat treatment has no bearing on durability or wear.</li>
            <li><strong>The premium takes you below the size or colour you actually wanted.</strong> A pale unheated stone you settled for will disappoint longer than a heated one you loved.</li>
          </ul>

          <h2>How to verify</h2>
          <p>
            Treatment is determined in a laboratory, not by eye — though undisturbed silk under the
            table, as visible in lot HR17 here, is one of the indicators a gemmologist looks for.
            For any significant purchase, ask for a report from a recognised institute (GIA, SSEF,
            Gübelin, GRS, or in Sri Lanka the GIC and CGL). We arrange this for any stone in the
            collection, before you commit.
          </p>
          <p>
            Of the {gems.length} lots here, {unheated} are unheated and the rest are heated. Every
            one is labelled on its own page, on its card in the collection, and in the
            specification table. We do not bury it.
          </p>
        </Prose>

        <div className="flex flex-wrap gap-3 pb-14">
          <ButtonLink href="/collection?treatment=natural">See the {unheated} unheated stones</ButtonLink>
          <ButtonLink href="/collection" variant="secondary">See everything</ButtonLink>
        </div>
        <GuideFooter current="/guide/heat-treatment" />
      </Container>
    </>
  );
}

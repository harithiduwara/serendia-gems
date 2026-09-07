import { ArticleHeader, GuideFooter, KeyTakeaway, Prose } from '@/components/editorial/Prose';
import { ButtonLink, Container } from '@/components/primitives';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Why Ceylon Sapphires',
  description:
    'Sri Lanka has produced sapphire for over two thousand years. What makes the material distinct, why the island dominates the trade, and what "Ceylon" actually tells you about a stone.',
  path: '/guide/ceylon-sapphires',
  type: 'article',
});

export default function Page() {
  return (
    <>
      <ArticleHeader
        eyebrow="Origin"
        title="Why Ceylon"
        lead="An island the size of Ireland has supplied the world's finest sapphire for two millennia. Here is what that actually means for the stone in front of you."
      />
      <Container width="prose">
        <Prose>
          <p>
            Sri Lanka — Ceylon under British rule, and still the trade name for its gemstones — has
            been exporting sapphire since at least the second century, when Roman writers described
            gems arriving from the island of Taprobane. Marco Polo reached it in 1292 and reported
            rubies and sapphires of a size he had not seen elsewhere. The trade has run without a
            serious interruption ever since, which makes it one of the longest continuously worked
            gem sources on earth.
          </p>

          <h2>What the island actually produces</h2>
          <p>
            Roughly a quarter of Sri Lanka&rsquo;s land surface is gem-bearing, concentrated in the
            alluvial gravels around Ratnapura in the south-west. The corundum found there occurs in
            a wider colour range than any other single deposit: blue in every tone from pale
            periwinkle to near-inky, plus yellow, pink, orange, violet, green and colourless — and
            padparadscha, the pink-orange variety that takes its name from a lotus blossom and is
            found in commercial quantity almost nowhere else.
          </p>
          <p>
            That range is why a collection drawn from one island can hold six distinct colours.
            It is not a merchandising choice; it is what the ground gives up.
          </p>

          <h2>The characteristic look</h2>
          <p>
            Ceylon blue sapphire is typically <strong>lighter and brighter</strong> than Burmese or
            Kashmir material, with a slight violet secondary hue and unusually good transparency.
            The trade calls the most desirable version <em>cornflower</em>. Lighter tone means more
            light returns through the pavilion, so Ceylon stones tend to look livelier and more
            brilliant than darker material of the same weight — they sparkle where a Burmese stone
            broods.
          </p>
          <p>
            Neither is better. They are different aesthetics, and which one is right depends
            entirely on the person wearing it and the metal it is set in.
          </p>

          <KeyTakeaway>
            <p>
              &ldquo;Ceylon&rdquo; is a statement of geographic origin, not a grade. It tells you
              where a stone came from and roughly what to expect of its character — it does not
              tell you whether that particular stone is good. Only the stone can tell you that.
            </p>
          </KeyTakeaway>

          <h2>Why origin carries a premium</h2>
          <p>
            Three reasons, in descending order of how much they should matter to you:
          </p>
          <ol>
            <li>
              <strong>Consistency.</strong> Ceylon material reliably shows the bright, transparent,
              slightly violet blue described above. Buyers pay for the predictability.
            </li>
            <li>
              <strong>Artisanal extraction.</strong> Most Sri Lankan mining is small-scale pit and
              tunnel work, often by hand, under a licensing regime that restricts mechanised
              extraction. Supply is limited by method as much as by geology.
            </li>
            <li>
              <strong>Provenance.</strong> Sri Lanka has a long-standing and well-documented trade,
              which makes the chain of custody easier to establish than for material from several
              other sources.
            </li>
          </ol>

          <h2>What origin does not tell you</h2>
          <p>
            A stone is not good because it is Ceylon. Colour, cut and clarity decide that, and a
            well-cut sapphire from Madagascar will beat a poorly cut Ceylon stone every time.
            Origin is one input among several — treat any seller who leads with it, and only it,
            with caution.
          </p>
          <p>
            It is also worth knowing that Madagascar now produces a great deal of material that is
            gemmologically very similar to Sri Lankan. Distinguishing the two reliably requires a
            laboratory. If origin genuinely matters to you, ask for an origin report rather than
            taking anyone&rsquo;s word — ours included.
          </p>
        </Prose>

        <div className="pb-14">
          <ButtonLink href="/collection">See the collection</ButtonLink>
        </div>
        <GuideFooter current="/guide/ceylon-sapphires" />
      </Container>
    </>
  );
}

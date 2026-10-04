import {
  ArticleCompare,
  ArticleFigure,
  ArticleHeader,
  GuideFooter,
  KeyTakeaway,
  Prose,
} from '@/components/editorial/Prose';
import { ButtonLink, Container } from '@/components/primitives';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Matched Pairs of Sapphires',
  description:
    'What "matched" has to mean before a pair is worth its premium, why pairs cost more than two single stones, and how to check a pair before you set it.',
  path: '/guide/matched-pairs',
  type: 'article',
});

export default function Page() {
  return (
    <>
      <ArticleHeader
        eyebrow="Gemmology · 5 min"
        title="Matched pairs"
        lead="A pair is not two stones that happen to be the same colour. It is a deliberate assembly, it costs more than the sum of its parts, and the reason is worth understanding before you pay for one."
      />
      <Container width="prose">
        <Prose>
          <h2>Why a pair costs more than two singles</h2>
          <p>
            Sapphire comes out of the ground one stone at a time. Two stones that agree
            closely in colour, tone, saturation, size, outline and cut did not arrive
            together — someone searched for the second one, often through a great many
            stones, and held the first while looking.
          </p>
          <p>
            That search is the cost. A pair typically carries a premium over two
            unrelated stones of the same total weight, and the premium rises steeply with
            size, because the pool to search shrinks as stones get larger.
          </p>

          <KeyTakeaway>
            <p>
              You are not paying for two stones. You are paying for the agreement between
              them — and that agreement is the thing to inspect.
            </p>
          </KeyTakeaway>

          <h2>The six things that have to agree</h2>
          <ol>
            <li>
              <strong>Hue</strong> — including any secondary lean. One stone leaning
              violet next to one leaning pure blue will read as a mismatch even if both
              are lovely.
            </li>
            <li>
              <strong>Tone</strong> — one visibly lighter than the other is the most
              common failure, and the most obvious once set.
            </li>
            <li>
              <strong>Saturation</strong> — a greyer stone beside a cleaner one shows
              immediately.
            </li>
            <li>
              <strong>Size</strong> — face-up millimetres, not carat weight. Two stones
              of equal weight can differ visibly across the face.
            </li>
            <li>
              <strong>Outline</strong> — length-to-width ratio especially. Two ovals of
              different proportions never settle.
            </li>
            <li>
              <strong>Cut and facet style</strong> — they should return light the same
              way, or one will look livelier than the other under the same lamp.
            </li>
          </ol>

          <ArticleCompare
            left={{
              image: 'HR21_1.jpg',
              alt: 'HR21, a matched pair of round sapphires in a bright lemon gold',
              code: 'HR21',
              caption:
                'A matched pair of rounds in a bright, cooler lemon gold. Rounds are the easiest shape to match and the most forgiving to set — which is why studs are usually round.',
            }}
            right={{
              image: 'HR23_1.jpg',
              alt: 'HR23, a matched pair of oval sapphires in a warm amber gold',
              code: 'HR23',
              caption:
                'The same total weight and the same price, in a far warmer amber. Side by side the difference is obvious; described in words — “yellow sapphire pair, 1.75 ct” — it is invisible.',
            }}
          />

          <h2>Orientation: the one nobody mentions</h2>
          <p>
            Sapphire is pleochroic, which means it shows slightly different colour from
            different crystal directions. A well-assembled pair is oriented so that both
            stones present the <em>same</em> direction face-up.
          </p>
          <p>
            This matters at setting time. Tell your jeweller the stones are a matched
            pair before any work starts, so they are set as a set and oriented
            consistently rather than dropped into whichever seat they fit. It is a
            thirty-second conversation that protects the premium you paid.
          </p>

          <h2>How to check a pair</h2>
          <ol>
            <li>
              <strong>See them together, in one light, in one photograph.</strong> Two
              separate images taken minutes apart prove nothing — exposure drifts. Every
              pair here is photographed as a pair for that reason.
            </li>
            <li>
              <strong>Look face-up and in profile.</strong> Depth differences do not show
              from above, but they decide how the stones sit in a mounting.
            </li>
            <li>
              <strong>Swap their positions and look again.</strong> If one suddenly looks
              better than the other, they are not as matched as they appeared.
            </li>
            <li>
              <strong>Ask for the millimetre dimensions of each stone separately.</strong>
            </li>
          </ol>

          <h2>What pairs are for</h2>
          <ul>
            <li>
              <strong>Earrings</strong> — the obvious use, and the one where mismatches
              are least forgiving: the two stones are seen together but never adjacent,
              so the eye compares from memory.
            </li>
            <li>
              <strong>Three-stone rings</strong> — a centre stone flanked by a pair. Here
              the match is under maximum scrutiny, since all three sit side by side.
            </li>
            <li>
              <strong>Cufflinks and symmetrical settings</strong> — anything where two
              stones appear in mirrored positions.
            </li>
          </ul>
          <p>
            For a three-stone ring, choose the pair <em>after</em> the centre stone, and
            take the centre stone to the pair rather than the other way round. Flanking
            stones are easier to find than centres.
          </p>

          <ArticleFigure
            image="HR24_1.jpg"
            alt="HR24, a matched pair of oval sapphires in a pale champagne yellow, the largest pair in the collection"
            code="HR24"
          >
            A pale champagne pair at 2.70 ct for the two. Gentle tone makes a pair easier
            to match convincingly — small differences that would be glaring in a
            saturated colour stay quiet in a soft one.
          </ArticleFigure>
        </Prose>

        <div className="flex flex-wrap gap-3 pb-14">
          <ButtonLink href="/collection?pairs=1">See the matched pairs</ButtonLink>
          <ButtonLink href="/contact" variant="secondary">Ask us to find a pair</ButtonLink>
        </div>
        <GuideFooter current="/guide/matched-pairs" />
      </Container>
    </>
  );
}

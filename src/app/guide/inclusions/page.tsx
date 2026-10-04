import {
  ArticleFigure,
  ArticleHeader,
  GuideFooter,
  KeyTakeaway,
  Prose,
} from '@/components/editorial/Prose';
import { ButtonLink, Container } from '@/components/primitives';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Inclusions and Clarity in Sapphire',
  description:
    'Sapphire is expected to contain inclusions. Which ones are harmless, which actually add value, and the two that should make you walk away.',
  path: '/guide/inclusions',
  type: 'article',
});

export default function Page() {
  return (
    <>
      <ArticleHeader
        eyebrow="Gemmology · 7 min"
        title="Inclusions and clarity"
        lead="Chasing a flawless sapphire is the most reliable way to overpay for one. Inclusions are normal in this species, some of them are evidence you want, and only two kinds genuinely matter."
      />
      <Container width="prose">
        <Prose>
          <h2>Sapphire is not a diamond, and is not graded like one</h2>
          <p>
            Gemstones are sorted into three clarity types by how included they usually
            are. Aquamarine and topaz are Type I — routinely clean. Emerald is Type III
            — essentially always included. <strong>Sapphire is Type II:</strong>
            inclusions are expected and normal, and a genuinely clean one is the
            exception rather than the standard.
          </p>
          <p>
            This is why the diamond habit of grading under a loupe does not transfer. A
            dealer who shows you a 10× magnified photograph of a sapphire is showing you
            something that is true of almost every sapphire in the world.
          </p>

          <h2>The only two questions that matter</h2>
          <ol>
            <li>
              <strong>Can you see anything with the unaided eye</strong> at normal
              viewing distance? If not, the stone is &ldquo;eye-clean&rdquo;, and that is
              the standard the trade actually prices on.
            </li>
            <li>
              <strong>Does anything threaten the stone&rsquo;s durability?</strong> That
              means a fracture reaching the surface, or a large inclusion sitting near
              the girdle where a knock would find it.
            </li>
          </ol>
          <p>Everything else is a fingerprint — the record of how the crystal grew.</p>

          <h2>What you are likely to see</h2>
          <ul>
            <li>
              <strong>Silk</strong> — fine needles of rutile, often in three directions.
              Usually a positive (see below), and in enough quantity it produces a star.
            </li>
            <li>
              <strong>Fingerprints</strong> — healed fractures that look like a wisp or a
              thumbprint. Structurally sound; the fracture closed up long ago.
            </li>
            <li>
              <strong>Crystals</strong> — small minerals trapped during growth. Harmless
              unless large and face-up.
            </li>
            <li>
              <strong>Colour zoning</strong> — bands of stronger and weaker colour. Very
              common in sapphire. Matters only if it is visible face-up once set, which
              a good cutter will orient to avoid.
            </li>
            <li>
              <strong>Feathers and fractures</strong> — the one group to examine
              properly. Internal and small is fine. Reaching the surface is not.
            </li>
          </ul>

          <h2>The inclusion you should want</h2>
          <p>
            Heat treatment dissolves silk. So undisturbed silk is one of the things a
            laboratory looks for when it certifies that a stone has <em>never been
            heated</em> — and unheated commands a large premium.
          </p>

          <ArticleFigure
            image="HR17_2.jpg"
            alt="HR17, an unheated 3.01 carat golden yellow sapphire held in tweezers, with faint internal silk visible under the table"
            code="HR17"
          >
            Look into the table of this unheated 3.01 ct yellow and you can see faint
            internal silk. It is not a defect to apologise for: it is part of the
            evidence that the stone has never seen a furnace, and part of what the price
            reflects.
          </ArticleFigure>

          <KeyTakeaway>
            <p>
              A perfectly clean, perfectly coloured, large sapphire at a comfortable
              price is not a bargain — it is a reason to ask harder questions. In this
              species, that combination is rare enough to need a laboratory report
              rather than a seller&rsquo;s word.
            </p>
          </KeyTakeaway>

          <h2>The two that should make you walk away</h2>
          <p>
            <strong>Surface-reaching fractures.</strong> These are a durability problem,
            not a beauty one. A stone with a fracture breaking the surface can chip
            while being set, and ultrasonic cleaning is out of the question. If you see a
            line that appears to meet the surface, ask directly and get the answer in
            writing.
          </p>
          <p>
            <strong>Undisclosed fracture filling.</strong> Cavities and fractures can be
            filled with glass or resin to make them disappear. This is a different
            universe from heat treatment: it is not stable, it can be damaged by normal
            jewellery repair, and it should move the price dramatically. Heat is
            accepted trade practice;{' '}
            <a href="/guide/heat-treatment">filling is not</a>. Any seller describing a
            stone only as &ldquo;treated&rdquo; is telling you nothing — ask which
            treatment, specifically.
          </p>

          <h2>How to inspect a stone you cannot hold</h2>
          <ol>
            <li>
              Ask for photographs <strong>against a plain light background</strong>, which
              is what we shoot on — a dark background hides exactly what you are looking
              for.
            </li>
            <li>
              Ask for <strong>video while the stone is tilted</strong>. Inclusions and
              zoning reveal themselves in movement far more than in a still.
            </li>
            <li>
              Ask explicitly: <em>are there any surface-reaching fractures, and has the
              stone been filled or diffused?</em> Get it in writing.
            </li>
            <li>
              For anything significant, have it certified by a recognised laboratory —
              and remember you may nominate the laboratory. We arrange this before
              payment for any stone here.
            </li>
          </ol>

          <h2>A word on size</h2>
          <p>
            Inclusions become easier to see as stones get larger, simply because there is
            more stone to look through. An eye-clean 5 ct sapphire is meaningfully rarer
            than an eye-clean 1 ct one, and priced accordingly. When comparing two large
            stones, compare their clarity at the same distance, in the same light — not
            one in a photograph and one in the hand.
          </p>
        </Prose>

        <div className="flex flex-wrap gap-3 pb-14">
          <ButtonLink href="/collection?treatment=natural">See the unheated stones</ButtonLink>
          <ButtonLink href="/guide/heat-treatment" variant="secondary">
            Heated vs unheated, explained
          </ButtonLink>
        </div>
        <GuideFooter current="/guide/inclusions" />
      </Container>
    </>
  );
}

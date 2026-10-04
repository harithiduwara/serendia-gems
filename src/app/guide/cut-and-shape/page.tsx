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
  title: 'Cut, Windows and Shape in Sapphire',
  description:
    'Why two sapphires of identical weight can look a carat apart, the tilt test that exposes a badly cut stone, and what each shape is actually good for.',
  path: '/guide/cut-and-shape',
  type: 'article',
});

export default function Page() {
  return (
    <>
      <ArticleHeader
        eyebrow="Gemmology · 7 min"
        title="Cut, windows and shape"
        lead="Cut is the most under-rated factor in coloured stones and the easiest to check yourself. It costs nothing to learn and it is where quiet money is lost."
      />
      <Container width="prose">
        <Prose>
          <h2>Why coloured stones are so often cut badly</h2>
          <p>
            Gemstones are sold by weight. A cutter who keeps an extra 10% of the rough
            earns more, even if the stone performs worse — so coloured stones are
            routinely cut for <strong>weight retention</strong> rather than beauty.
            Diamond cutting has standardised proportions and grading to push against
            this. Sapphire has neither.
          </p>
          <p>
            The result: two 3-carat sapphires of the same colour can look like different
            purchases entirely. One reads large, bright and even; the other reads small,
            dark in the middle and pale at the edges.
          </p>

          <h2>The tilt test — twenty seconds, no equipment</h2>
          <p>
            Hold the stone face-up under ordinary light and tilt it slowly. You are
            looking for two faults.
          </p>
          <p>
            <strong>Windowing.</strong> A pale, washed-out patch through the centre where
            you can effectively see straight through the stone — light enters the top and
            leaves out of the bottom instead of bouncing back to your eye. If a
            see-through area opens up as you tilt, the pavilion is too shallow. The
            cutter kept weight in the girdle at the cost of the stone&rsquo;s life.
          </p>
          <p>
            <strong>Extinction.</strong> Dead black zones that never light up. Some
            extinction is normal and even useful — it is part of what gives a deep stone
            its drama. A lot of it means the stone is cut too deep, or is simply too dark
            in tone.
          </p>

          <KeyTakeaway>
            <p>
              A well-cut stone of modest colour will usually outperform a
              better-coloured stone that has been cut badly. Colour sets the price; cut
              decides whether you can see it.
            </p>
          </KeyTakeaway>

          <h2>Face-up size: the number nobody quotes</h2>
          <p>
            Carat is weight, not size. Where the weight sits decides how large a stone
            looks on a hand, and two stones of equal weight can differ by a visible
            amount:
          </p>
          <ul>
            <li>
              <strong>Deep stones</strong> hide weight below the girdle. They weigh more
              than they look.
            </li>
            <li>
              <strong>Spread stones</strong> carry their weight across the face. They
              look larger — but go too far and you get a window.
            </li>
            <li>
              <strong>Elongated outlines</strong> (oval, elongated cushion, emerald) read
              larger than round or square ones of the same weight, because the eye reads
              length.
            </li>
          </ul>

          <ArticleFigure
            image="HR16_1.jpg"
            alt="HR16, a 5.35 carat elongated cushion-cut deep royal blue Ceylon sapphire"
            code="HR16"
          >
            An elongated cushion at 5.35 ct. The outline is doing real work here: it
            presents a broad face and the length carries the eye, so the stone looks
            every bit of its weight rather than hiding it underneath.
          </ArticleFigure>

          <p>
            This is why asking for <strong>millimetre dimensions</strong>, not just
            carats, is the single most useful question when comparing two stones at the
            same price. Two 3 ct ovals can differ by more than a millimetre across the
            face, which is clearly visible once set.
          </p>

          <h2>Shapes, and what each is actually for</h2>
          <ul>
            <li>
              <strong>Oval</strong> — the default for a reason. Elongates the finger,
              reads large for its weight, and sets easily in almost any mounting.
            </li>
            <li>
              <strong>Cushion</strong> — the traditional sapphire shape. Retains weight
              from the rough and presents a broad, soft-cornered face. Corners are
              protected by the outline, which helps durability.
            </li>
            <li>
              <strong>Round</strong> — the most forgiving to set well and the easiest to
              match in pairs, which is why studs are usually round.
            </li>
            <li>
              <strong>Heart</strong> — the hardest to cut properly and the easiest to get
              wrong.
            </li>
          </ul>

          <ArticleFigure
            image="HR18_1.jpg"
            alt="HR18, a 3.10 carat heart-cut deep royal blue sapphire with defined lobes and a crisp cleft"
            code="HR18"
          >
            Most heart cuts disappoint: the lobes go soft, the cleft fills in, and what
            you get is a lumpy pear. Judge a heart on symmetry first — two clearly
            defined lobes, a crisp cleft, and an outline that stays symmetrical when you
            turn it over.
          </ArticleFigure>

          <h2>Facet style changes the character</h2>
          <p>
            Beyond proportions, the facet pattern on the crown decides <em>how</em> a
            stone returns light. Fine, dense faceting produces many small bright flashes;
            broad, flat facets produce fewer and wider reflections. Neither is better —
            but they suit different colours, and it is worth knowing which you are
            looking at.
          </p>

          <ArticleCompare
            left={{
              image: 'HR22_1.jpg',
              alt: 'HR22, a matched pair of round golden yellow sapphires with fine, dense faceting',
              code: 'HR22',
              caption:
                'Fine, dense pavilion work: short, bright bursts of light rather than broad flashes. It gives small stones more life than their weight suggests.',
            }}
            right={{
              image: 'HR23_1.jpg',
              alt: 'HR23, a matched pair of oval amber-gold sapphires with broad, flat crown facets',
              code: 'HR23',
              caption:
                'Broad, flat crown facets behaving almost like a checkerboard: wide, mirror-like reflections instead of fine sparkle. It suits a heavier, warmer colour.',
            }}
          />

          <h2>Polish, symmetry and the girdle</h2>
          <p>
            Three smaller things worth a glance before you commit:
          </p>
          <ul>
            <li>
              <strong>Polish</strong> — facet surfaces should be mirror-flat. Visible
              polish lines dull the stone.
            </li>
            <li>
              <strong>Symmetry</strong> — the outline should be even and the table
              centred. Asymmetry is hard to un-see once pointed out, and a jeweller will
              struggle to set it squarely.
            </li>
            <li>
              <strong>Girdle thickness</strong> — an extremely thin girdle chips during
              setting; an extremely thick one is hidden weight you paid for.
            </li>
          </ul>

          <h2>Questions worth asking</h2>
          <ol>
            <li>What are the millimetre dimensions, face-up and in depth?</li>
            <li>Can you send a video of the stone tilting under ordinary light?</li>
            <li>Is there a window when it is tilted?</li>
            <li>Is the girdle thin anywhere I should tell my setter about?</li>
          </ol>
          <p>
            Every stone here is photographed face-up and in the hand for exactly this
            reason, and we will film any of them tilting on request.
          </p>
        </Prose>

        <div className="flex flex-wrap gap-3 pb-14">
          <ButtonLink href="/collection">Look at the cuts in the collection</ButtonLink>
          <ButtonLink href="/guide/reading-colour" variant="secondary">
            Back to reading colour
          </ButtonLink>
        </div>
        <GuideFooter current="/guide/cut-and-shape" />
      </Container>
    </>
  );
}

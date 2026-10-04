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
  title: 'Reading Colour: Hue, Tone and Saturation',
  description:
    'Every seller says "good colour". It means three separate things — hue, tone and saturation — and only one of them really sets the price. Illustrated with stones from the collection.',
  path: '/guide/reading-colour',
  type: 'article',
});

export default function Page() {
  return (
    <>
      <ArticleHeader
        eyebrow="Gemmology · 8 min"
        title="Reading colour"
        lead="Everyone selling a coloured stone will tell you it has good colour. The word covers three separate properties, they are priced very differently, and once you can name them you can argue about price from the same footing as the dealer."
      />
      <Container width="prose">
        <Prose>
          <p>
            Diamonds are graded on the <em>absence</em> of colour against a fixed
            alphabet. Sapphire has no equivalent — no universal scale, no agreed
            vocabulary between houses, and no substitute for looking. What experienced
            buyers do instead is split colour into three parts and judge each one
            separately.
          </p>

          <h2>1. Hue — which colour it actually is</h2>
          <p>
            Hue is the colour itself, including any <strong>secondary hue</strong>
            leaning in from a neighbour. Ceylon blue is rarely pure blue; it usually
            carries a little violet. A pink may lean purple or orange. A yellow may
            lean green or orange.
          </p>
          <p>
            Secondary hues are not faults. They are the stone&rsquo;s character, and
            some are prized — the faint violet in cornflower Ceylon blue is part of
            what people are buying. What matters is that you can see it and decide
            whether you like it, rather than discovering it in daylight a month later.
          </p>

          <ArticleCompare
            left={{
              image: 'HR15_1.jpg',
              alt: 'HR15, a 4.40 carat cornflower blue Ceylon sapphire, light to medium tone with a violet secondary hue',
              code: 'HR15',
              caption:
                'Blue with a clear violet lean, in a lighter tone — the “cornflower” that Ceylon is known for. More light returns through a lighter stone, so it sparkles across the whole face.',
            }}
            right={{
              image: 'HR16_1.jpg',
              alt: 'HR16, a 5.35 carat deep royal blue cushion-cut Ceylon sapphire, medium-dark tone and high saturation',
              code: 'HR16',
              caption:
                'The same hue family, far deeper. Medium-dark tone, high saturation: it broods rather than sparkles, and holds its colour right to the edges.',
            }}
          />

          <h2>2. Tone — how light or dark</h2>
          <p>
            Tone runs from very light to very dark, and it is the easiest of the three
            to judge once you look for it. Both extremes cost you:
          </p>
          <ul>
            <li>
              <strong>Too dark</strong> and the stone reads as near-black in anything
              but direct sunlight. It will look wonderful in a jeweller&rsquo;s
              spotlights and disappointing at dinner.
            </li>
            <li>
              <strong>Too light</strong> and the colour washes out, especially in a
              larger stone where you would expect presence.
            </li>
          </ul>
          <p>
            The money sits in the middle — medium to medium-dark — because that is
            where a stone keeps its colour across the lighting a person actually lives
            in.
          </p>

          <h2>3. Saturation — how pure the colour is</h2>
          <p>
            Saturation is how intense and clean the colour is, as opposed to greyed or
            browned. <strong>This is what you are paying for.</strong> It outweighs
            hue and tone, and it outweighs weight more often than people expect.
          </p>

          <ArticleFigure
            image="HR19.jpg"
            alt="HR19, a 2.55 carat vivid purplish pink sapphire held in tweezers, showing very high saturation"
            code="HR19"
          >
            Saturation at the top of the range: a vivid purplish pink with no grey in
            it and no fading toward the girdle. This stone is 2.55 ct and carries the
            same price as a blue nearly twice its weight — that difference is almost
            entirely saturation.
          </ArticleFigure>

          <ArticleFigure
            image="HR26_1.jpg"
            alt="HR26, an unheated 3.30 carat pale rosé pink sapphire, low saturation"
            code="HR26"
          >
            The same hue family at the other end. A larger stone — 3.30 ct, and
            unheated — but the colour is delicate to the point of being barely tinted
            in cool light. Bigger, rarer in origin, and far less expensive, because
            saturation is low. Neither stone is “better”; they are different purchases.
          </ArticleFigure>

          <KeyTakeaway>
            <p>
              If you remember one thing: <strong>weight is the number people quote,
              saturation is the number they pay for.</strong> A smaller, more saturated
              stone will outprice a larger, washed-out one of the same variety, and it
              will also look better on a hand.
            </p>
          </KeyTakeaway>

          <h2>The quiet colours are worth knowing too</h2>
          <p>
            Strong saturation is not the only thing worth owning. Some of the most
            interesting sapphires are deliberately soft — and because the market prices
            saturation so heavily, soft colours are where the value often hides.
          </p>

          <ArticleFigure
            image="HR20_1.jpg"
            alt="HR20, an unheated 3.02 carat violet sapphire in a soft lilac tone"
            code="HR20"
          >
            Violet is far less common in sapphire than blue, pink or yellow, and this
            one is unheated at 3.02 ct. The tone is light and the saturation moderate —
            a quiet stone, and a colour most people cannot immediately name.
          </ArticleFigure>

          <h2>How to actually judge it</h2>
          <p>Four habits that will save you money:</p>
          <ol>
            <li>
              <strong>Look in two lights.</strong> Daylight near a window, then ordinary
              indoor light. Many sapphires shift noticeably, and you will wear the stone
              in both. Ask for video in both if you are buying remotely.
            </li>
            <li>
              <strong>Compare, never judge alone.</strong> Colour is almost impossible to
              assess in isolation and easy to assess side by side. Two photographs next
              to each other will tell you more than ten minutes staring at one.
            </li>
            <li>
              <strong>Tilt the stone.</strong> Colour should hold as it moves. A stone
              that pales dramatically off-axis is cut too shallow — see{' '}
              <a href="/guide/cut-and-shape">cut, windows and shape</a>.
            </li>
            <li>
              <strong>Distrust a single photograph.</strong> Saturated stones in
              particular photograph inconsistently. A seller who sends several frames
              and a video in different light is telling you something about themselves.
            </li>
          </ol>

          <h2>Words sellers use, and what they mean</h2>
          <ul>
            <li>
              <strong>Cornflower</strong> — a trade term for light-to-medium Ceylon blue
              with a violet lean. Descriptive, not a grade; nobody polices it.
            </li>
            <li>
              <strong>Royal blue</strong> — deeper, more saturated, medium-dark. Also a
              trade term, also unpoliced.
            </li>
            <li>
              <strong>Vivid</strong> — should mean top saturation. Often means the seller
              likes the stone.
            </li>
            <li>
              <strong>Padparadscha</strong> — the pink-orange variety, and the one term
              here with real laboratory meaning. If a stone is sold as padparadscha, ask
              for a report from a recognised laboratory; the premium is large enough to
              attract optimistic naming.
            </li>
          </ul>
          <p>
            None of these are grades. They are a shared shorthand, which is exactly why
            your own eyes, in two lights, next to another stone, are worth more than any
            of them.
          </p>
        </Prose>

        <div className="flex flex-wrap gap-3 pb-14">
          <ButtonLink href="/collection">Compare colours in the collection</ButtonLink>
          <ButtonLink href="/guide/cut-and-shape" variant="secondary">
            Next: cut, windows and shape
          </ButtonLink>
        </div>
        <GuideFooter current="/guide/reading-colour" />
      </Container>
    </>
  );
}

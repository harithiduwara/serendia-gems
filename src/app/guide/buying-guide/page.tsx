import { ArticleHeader, GuideFooter, KeyTakeaway, Prose } from '@/components/editorial/Prose';
import { ButtonLink, Container } from '@/components/primitives';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'How to Buy a Sapphire',
  description:
    'Colour, cut, clarity and carat — ranked in the order that actually matters for coloured stones, which is not the order you were taught for diamonds.',
  path: '/guide/buying-guide',
  type: 'article',
});

export default function Page() {
  return (
    <>
      <ArticleHeader
        eyebrow="Buying"
        title="How to buy a sapphire"
        lead="Everything you know about the four Cs comes from diamonds. For coloured stones, the ranking is different — and getting it wrong is expensive."
      />
      <Container width="prose">
        <Prose>
          <p>
            Diamond grading is a rigorous, standardised system built around the absence of colour.
            Sapphire has no equivalent. There is no universal grading scale, no agreed vocabulary,
            and no substitute for looking at the stone. What follows is the order of priority that
            experienced buyers actually use.
          </p>

          <h2>1. Colour — this is 60–70% of the price</h2>
          <p>Colour breaks into three separate things, and people routinely confuse them:</p>
          <ul>
            <li><strong>Hue</strong> — the colour itself, including any secondary. &ldquo;Violetish blue&rdquo; is a hue.</li>
            <li><strong>Tone</strong> — how light or dark, from pale to nearly black.</li>
            <li><strong>Saturation</strong> — how pure and intense, versus greyed out or brownish.</li>
          </ul>
          <p>
            <strong>Saturation is what you pay for.</strong> A vividly saturated stone in a medium
            tone will always outprice a darker stone of the same hue. A stone that is very dark
            reads as black in anything but direct light; a stone that is very pale reads as washed
            out. The money sits in the middle, with as much saturation as possible.
          </p>
          <p>
            This is why lot HR19 — a 2.55 ct pink — carries the same price as a blue nearly twice
            its weight. It is not weight. It is saturation.
          </p>

          <KeyTakeaway>
            <p>
              Judge colour in at least two lights: daylight near a window, and ordinary indoor
              light. Many sapphires shift noticeably, and you will be wearing the stone in both.
            </p>
          </KeyTakeaway>

          <h2>2. Cut — worth more than people think</h2>
          <p>
            Coloured stones are cut to retain weight, because they are sold by weight. That means
            the cutting is frequently compromised, and it shows in two ways worth checking:
          </p>
          <ul>
            <li><strong>Windowing</strong> — a pale, washed-out patch through the centre where light passes straight through instead of reflecting back. Tilt the stone: if a see-through area opens up, the pavilion is too shallow.</li>
            <li><strong>Extinction</strong> — dead black zones that never light up. Some is normal; a lot means the stone is cut too deep or is too dark.</li>
          </ul>
          <p>
            A well-cut stone of modest colour will often outperform a better-coloured stone that has
            been cut badly. Cut is the most under-rated factor in coloured stones.
          </p>

          <h2>3. Clarity — relax</h2>
          <p>
            Sapphire is a Type II gemstone: inclusions are expected and normal. The diamond standard
            of flawlessness does not apply and chasing it is a good way to overpay.
          </p>
          <p>The only questions that matter:</p>
          <ul>
            <li>Can you see anything <strong>with the unaided eye</strong> at normal distance? If not, it is eye-clean, and that is the standard that counts.</li>
            <li>Is there anything that threatens <strong>durability</strong> — a fracture reaching the surface, a large inclusion near the girdle where it could be knocked?</li>
          </ul>
          <p>
            Everything else is a fingerprint. Some inclusions are actively good news: undisturbed
            silk is evidence a stone has never been heated.
          </p>

          <h2>4. Carat — last, and here is why</h2>
          <p>
            Price per carat rises in steps, not smoothly, and the steps land at round numbers:
            1.00, 2.00, 3.00, 5.00. A 2.95 carat stone can cost meaningfully less per carat than a
            3.01, and nobody will ever know the difference on your hand.
          </p>
          <p>
            <strong>Buying just under a threshold is the single easiest saving available to you.</strong>{' '}
            Lot HR4 at 2.95 ct sits deliberately on the right side of that line.
          </p>

          <h2>A practical order of operations</h2>
          <ol>
            <li>Set a budget, and decide whether unheated matters to you. That decision alone moves the budget two to four times.</li>
            <li>Pick your colour and your minimum size.</li>
            <li>Ask for photographs <em>and video</em> in more than one light. Video is far more honest than a still.</li>
            <li>Ask directly: heated or unheated, and any other treatment? Get it in writing.</li>
            <li>For anything significant, get an independent laboratory report before you commit.</li>
            <li>Check the return terms before paying, not after.</li>
          </ol>

          <h2>Questions worth asking any seller</h2>
          <ul>
            <li>What treatments has this stone had, specifically?</li>
            <li>Where is it from, and can that be certified?</li>
            <li>Can I see it in daylight and in indoor light, on video?</li>
            <li>What are your return terms, and how long do I have?</li>
            <li>Will you send it to a laboratory of my choosing before I pay?</li>
          </ul>
          <p>
            A seller who is comfortable with all five is a seller worth buying from. Ask us these.
          </p>
        </Prose>

        <div className="flex flex-wrap gap-3 pb-14">
          <ButtonLink href="/collection">Apply this to the collection</ButtonLink>
          <ButtonLink href="/contact" variant="secondary">Ask us a question</ButtonLink>
        </div>
        <GuideFooter current="/guide/buying-guide" />
      </Container>
    </>
  );
}

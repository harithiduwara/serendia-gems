import { ArticleHeader, Prose } from '@/components/editorial/Prose';
import { Container } from '@/components/primitives';
import { buildMetadata } from '@/lib/seo';
import { SITE } from '@/lib/site';

export const metadata = buildMetadata({
  title: 'Terms, Shipping & Returns',
  description:
    'How we ship, what we guarantee, how returns work, and what we do with your data.',
  path: '/terms',
});

export default function TermsPage() {
  return (
    <>
      <ArticleHeader
        eyebrow="The small print"
        title="Terms, shipping & returns"
        lead="Written to be read. If anything here is unclear, ask before you buy — that is what it is for."
      />
      <Container width="prose">
        <Prose>
          <h2>Buying</h2>
          <p>
            No payment is taken through this website. Every purchase begins as an enquiry and is
            agreed in conversation. Prices shown are in US dollars for the loose stone — the pair as
            a lot, where a lot is a pair — and exclude setting, and exclude any import duty or tax
            payable in your country. The LKR figure is shown for reference; USD is the price of
            record.
          </p>
          <p>
            Availability is live but stones do sell. A stone is only reserved for you once we have
            confirmed it in writing.
          </p>

          <h2>Certification</h2>
          <p>
            Independent laboratory certification is available for any stone in the collection and
            is arranged before payment. You may nominate the laboratory. Where we have quoted a
            weight, colour or treatment that a report contradicts, the sale does not proceed and you
            owe nothing.
          </p>
          <p>
            Weights and measurements given on this site are taken in-house and are accurate to
            ±0.02 ct. Colour descriptions are our own written observations, not laboratory grades.
          </p>

          <h2>Shipping</h2>
          <ul>
            <li>Worldwide, fully insured for the full value, tracked and signed for.</li>
            <li>Dispatched within two working days of cleared payment.</li>
            <li>Typical transit is three to seven working days depending on destination and customs.</li>
            <li>Shipping is included in the quoted price. Import duty and local taxes are the buyer&rsquo;s responsibility.</li>
            <li>Export of gemstones from Sri Lanka is documented in accordance with the National Gem and Jewellery Authority&rsquo;s requirements.</li>
          </ul>

          <h2>Returns</h2>
          <p>
            You have <strong>seven days from delivery</strong> to return any stone for a full refund
            of the stone&rsquo;s price. Conditions:
          </p>
          <ul>
            <li>Tell us within the seven days, in writing, before returning anything.</li>
            <li>The stone must come back in the condition it was sent — unset, unaltered, uncut.</li>
            <li>Return shipping and insurance are the buyer&rsquo;s cost, unless the stone was misdescribed by us, in which case we cover them.</li>
            <li>Refunds are issued within five working days of the stone arriving back and being verified.</li>
          </ul>
          <p>
            A stone that has been set, recut or altered cannot be returned. Have it certified before
            you set it, not after.
          </p>

          <h2>Your data</h2>
          <p>
            When you send an enquiry we receive your name, email, and anything else you choose to
            tell us. We use it to answer you and for nothing else. We do not sell it, we do not add
            you to a mailing list, and we do not pass it to third parties.
          </p>
          <p>
            Your saved selection is stored in your own browser and is never transmitted to us until
            you send an enquiry that includes it. Clearing your browser data clears it.
          </p>
          <p>
            To ask what we hold about you, or to have it deleted, write to{' '}
            <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
          </p>

          <h2>Governing law</h2>
          <p>
            These terms are governed by the laws of Sri Lanka. Nothing here limits any statutory
            right you have in your own country of residence.
          </p>
        </Prose>
      </Container>
    </>
  );
}

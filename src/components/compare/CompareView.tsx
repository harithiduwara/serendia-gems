'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ButtonLink, Badge } from '@/components/primitives';
import { useWishlist } from '@/components/wishlist/WishlistProvider';
import { altFor, blurFor, imagePath } from '@/lib/catalog';
import { formatCarats, formatLKR, formatTreatment, formatUSD } from '@/lib/format';
import type { Gem } from '@/lib/types';

/**
 * Side-by-side comparison.
 *
 * Chosen over a stacked layout because comparison is a scanning task: aligning
 * the same attribute on one row lets the eye travel horizontally and spot the
 * difference, which is the whole point (Gestalt — common region and proximity).
 *
 * Values that differ across the selection are marked, so the buyer is not left
 * to diff eleven rows by eye. Rows where every stone agrees are dimmed rather
 * than hidden — hiding them would break the alignment that makes the table
 * readable, and "these are all the same" is itself useful information.
 */
interface Row {
  label: string;
  value: (g: Gem) => string;
  emphasis?: boolean;
}

const ROWS: Row[] = [
  { label: 'Price (USD)', value: (g) => formatUSD(g.priceUSD), emphasis: true },
  { label: 'Price (LKR)', value: (g) => formatLKR(g.priceLKR) },
  { label: 'Carat weight', value: (g) => formatCarats(g.carats), emphasis: true },
  { label: 'Price per carat', value: (g) => `${formatUSD(Math.round(g.priceUSD / g.carats))}/ct`, emphasis: true },
  { label: 'Variety', value: (g) => g.variety },
  { label: 'Treatment', value: (g) => formatTreatment(g.treatment), emphasis: true },
  { label: 'Shape', value: (g) => g.shape },
  { label: 'Lot type', value: (g) => (g.isPair ? 'Matched pair' : 'Single stone') },
  { label: 'Colour', value: (g) => g.colourNote },
  { label: 'Origin', value: () => 'Sri Lanka (Ceylon)' },
  { label: 'Photography', value: (g) => (g.photography === 'shot' ? 'In studio' : 'On request') },
  { label: 'Video', value: (g) => (g.hasVideo ? 'On request' : 'Can be arranged') },
];

export function CompareView({ gems }: { gems: Gem[] }) {
  const { codes, remove, ready } = useWishlist();

  if (!ready) {
    return <div className="h-96 animate-pulse rounded-[var(--r-md)] bg-[color:var(--color-sunken)]" aria-hidden="true" />;
  }

  const selected = gems.filter((g) => codes.includes(g.code));

  if (selected.length === 0) {
    return <EmptyState title="Nothing selected yet" body="Save two or more stones from the collection and they will line up here, attribute by attribute." />;
  }

  if (selected.length === 1) {
    const only = selected[0];
    return (
      <EmptyState
        title="Comparison needs at least two stones"
        body={`You have saved ${only?.code} so far. Add another and this becomes a side-by-side table.`}
      />
    );
  }

  // Price-per-carat is the number buyers actually reason with but rarely compute.
  const bestValue = [...selected].sort((a, b) => a.priceUSD / a.carats - b.priceUSD / b.carats)[0];

  return (
    <div>
      <p className="t-lead measure mb-8 !text-[0.9375rem]">
        Rows where the stones differ are marked with a rule. Price per carat is
        calculated for you — it is the figure that makes stones of different
        weights genuinely comparable.
      </p>

      {/* Horizontal scroll is confined to this container so the page itself
          never scrolls sideways (NFR-07). */}
      <div className="-mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0">
        {/* table-fixed with an explicit colgroup: every stone gets an identical
            column, so images render at the same size and rows line up exactly.
            Under auto layout the longest caption stretched one column and the
            comparison stopped being a comparison. */}
        <table
          className="w-full table-fixed border-collapse text-left"
          style={{ minWidth: `${10 + selected.length * 13}rem` }}
        >
          <caption className="sr-only">
            Side-by-side comparison of {selected.length} sapphires
          </caption>
          <colgroup>
            <col style={{ width: '10rem' }} />
            {selected.map((g) => (
              <col key={g.code} style={{ width: `${90 / selected.length}%` }} />
            ))}
          </colgroup>
          <thead>
            <tr>
              <th scope="col" className="sticky left-0 z-10 bg-[color:var(--page-bg)] pb-4 pr-4 align-top">
                <span className="sr-only">Attribute</span>
              </th>
              {selected.map((g) => {
                const hero = g.images[0];
                return (
                  <th key={g.code} scope="col" className="px-2 pb-4 align-top font-normal">
                    <div className="gem-mat relative mb-3 aspect-square overflow-hidden rounded-[var(--r-md)]">
                      {hero ? (
                        <Image
                          src={imagePath(hero)}
                          alt={altFor(g, 0)}
                          fill
                          sizes="(max-width: 640px) 50vw, 240px"
                          placeholder="blur"
                          blurDataURL={blurFor(hero)}
                          className="object-cover"
                        />
                      ) : (
                        <span className="flex h-full items-center justify-center px-3 text-center text-[0.6875rem] text-[#8A90A3]">
                          Photography in preparation
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => remove(g.code)}
                        aria-label={`Remove ${g.code} from the comparison`}
                        className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-[color:var(--panel-bg)]/90 text-[color:var(--muted-fg)] shadow-sm transition-colors hover:text-critical"
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                          <path d="M18 6 6 18" /><path d="m6 6 12 12" />
                        </svg>
                      </button>
                    </div>
                    <Link href={`/gem/${g.code}`} className="t-title block hover:text-royal dark:hover:text-cornflower">
                      <span className="t-num text-[color:var(--subtle-fg)]">{g.code}</span>{' '}
                      {g.variety}
                    </Link>
                    {bestValue?.code === g.code && selected.length > 1 ? (
                      <span className="mt-2 inline-block">
                        <Badge tone="positive">Lowest per carat</Badge>
                      </span>
                    ) : null}
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>
            {ROWS.map((row) => {
              const values = selected.map(row.value);
              const differs = new Set(values).size > 1;
              return (
                <tr
                  key={row.label}
                  className={`border-t ${differs ? 'border-[color:var(--panel-line)]' : 'border-transparent'}`}
                >
                  <th
                    scope="row"
                    className="sticky left-0 z-10 bg-[color:var(--page-bg)] py-3 pr-4 align-top text-[0.75rem] font-medium uppercase tracking-[0.06em] text-[color:var(--subtle-fg)]"
                  >
                    {row.label}
                    {differs ? <span className="sr-only"> (differs between stones)</span> : null}
                  </th>
                  {selected.map((g, i) => (
                    <td
                      key={g.code}
                      className={`px-2 py-3 align-top text-[0.875rem] leading-relaxed ${
                        row.emphasis && differs ? 'font-semibold' : ''
                      } ${differs ? '' : 'text-[color:var(--muted-fg)]'}`}
                    >
                      <span className="t-num">{values[i]}</span>
                    </td>
                  ))}
                </tr>
              );
            })}

            <tr className="border-t border-[color:var(--panel-line)]">
              <th scope="row" className="sticky left-0 z-10 bg-[color:var(--page-bg)] py-4 pr-4 align-top text-[0.75rem] font-medium uppercase tracking-[0.06em] text-[color:var(--subtle-fg)]">
                Our note
              </th>
              {selected.map((g) => (
                <td key={g.code} className="px-2 py-4 align-top text-[0.8125rem] leading-relaxed text-[color:var(--muted-fg)]">
                  {g.caption}
                </td>
              ))}
            </tr>

            <tr>
              <td className="sticky left-0 z-10 bg-[color:var(--page-bg)]" />
              {selected.map((g) => (
                <td key={g.code} className="px-2 pt-5 align-top">
                  <ButtonLink href={`/contact?gem=${g.code}`} size="sm" className="w-full">
                    Enquire
                  </ButtonLink>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-10 flex flex-wrap gap-3 border-t border-[color:var(--panel-line)] pt-8">
        <ButtonLink href="/collection" variant="secondary">Add another stone</ButtonLink>
        <ButtonLink href="/contact">Enquire about all {selected.length}</ButtonLink>
      </div>
    </div>
  );
}

function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-[var(--r-md)] border border-dashed border-[color:var(--panel-line)] px-8 py-20 text-center">
      <p className="t-title mb-2">{title}</p>
      <p className="t-lead mx-auto mb-7 max-w-md !text-[0.9375rem]">{body}</p>
      <ButtonLink href="/collection">Browse the collection</ButtonLink>
    </div>
  );
}

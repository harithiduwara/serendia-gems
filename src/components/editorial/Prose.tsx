import type { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { blurFor, imagePath } from '@/lib/catalog';
import { Container } from '@/components/primitives';
import { GUIDE_PAGES } from '@/lib/site';

export function ArticleHeader({
  eyebrow,
  title,
  lead,
}: {
  eyebrow: string;
  title: string;
  lead: string;
}) {
  return (
    <section className="border-b border-[color:var(--panel-line)] bg-[color:var(--panel-bg)]">
      <Container width="prose">
        <div className="py-14 sm:py-20">
          <p className="t-eyebrow mb-4 text-gold">{eyebrow}</p>
          <h1 className="t-display-2">{title}</h1>
          <p className="t-lead mt-5">{lead}</p>
        </div>
      </Container>
    </section>
  );
}

/**
 * Editorial body styling. Applied once here rather than repeated per article,
 * so all four guides stay typographically identical.
 */
export function Prose({ children }: { children: ReactNode }) {
  return (
    <div className="article-prose py-14 sm:py-20">
      {children}
    </div>
  );
}

export function KeyTakeaway({ children }: { children: ReactNode }) {
  return (
    <aside className="my-9 rounded-[var(--r-md)] border-l-2 border-gold bg-gold/[0.05] p-6">
      <p className="t-eyebrow mb-2.5 text-gold">In short</p>
      <div className="text-[1rem] leading-[1.7]">{children}</div>
    </aside>
  );
}

export function GuideFooter({ current }: { current: string }) {
  // Three, not all of them: a wall of eight at the end of an article is a
  // choice nobody makes. The index page is for browsing the rest.
  const others = GUIDE_PAGES.filter((g) => g.href !== current).slice(0, 3);
  return (
    <div className="border-t border-[color:var(--panel-line)] py-12">
      <p className="t-eyebrow mb-6 text-[color:var(--subtle-fg)]">Keep reading</p>
      <ul className="grid gap-5 sm:grid-cols-3">
        {others.map((g) => (
          <li key={g.href}>
            <Link
              href={g.href}
              className="card-lift block h-full rounded-[var(--r-md)] border border-[color:var(--panel-line)] p-5"
            >
              <h2 className="t-title mb-2 !text-[1.0625rem]">{g.label}</h2>
              <p className="text-[0.8125rem] leading-relaxed text-[color:var(--muted-fg)]">{g.blurb}</p>
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-6 text-sm">
        <Link href="/guide" className="link-underline font-medium text-royal">
          All articles →
        </Link>
      </p>
    </div>
  );
}

/**
 * A photograph inside an article, captioned and credited to the lot it shows.
 *
 * Every example is a stone actually in the collection rather than stock
 * photography, so the caption links to it: a reader learning what saturation
 * looks like can click straight through to the stone demonstrating it. It also
 * keeps the teaching honest — the claim in the text has to be true of a stone
 * that is on sale a click away.
 */
export function ArticleFigure({
  image,
  alt,
  code,
  children,
}: {
  image: string;
  alt: string;
  /** Lot code shown, when it is one of ours. */
  code?: string;
  children: ReactNode;
}) {
  return (
    <figure className="my-9">
      <div className="gem-mat relative aspect-[4/3] overflow-hidden rounded-[var(--r-md)] border border-[color:var(--panel-line)]">
        <Image
          src={imagePath(image)}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, 46rem"
          placeholder="blur"
          blurDataURL={blurFor(image)}
          className="object-cover"
        />
      </div>
      <figcaption className="mt-3 text-[0.8125rem] leading-relaxed text-[color:var(--muted-fg)]">
        {children}
        {code ? (
          <>
            {' '}
            <Link href={`/gem/${code}`} className="link-underline font-medium text-royal">
              See {code}
            </Link>
          </>
        ) : null}
      </figcaption>
    </figure>
  );
}

/** Two photographs side by side, for comparisons the text asks the reader to make. */
export function ArticleCompare({
  left,
  right,
}: {
  left: { image: string; alt: string; code?: string; caption: ReactNode };
  right: { image: string; alt: string; code?: string; caption: ReactNode };
}) {
  return (
    <div className="my-9 grid gap-5 sm:grid-cols-2">
      {[left, right].map((side) => (
        <figure key={side.image}>
          <div className="gem-mat relative aspect-square overflow-hidden rounded-[var(--r-md)] border border-[color:var(--panel-line)]">
            <Image
              src={imagePath(side.image)}
              alt={side.alt}
              fill
              sizes="(max-width: 640px) 100vw, 22rem"
              placeholder="blur"
              blurDataURL={blurFor(side.image)}
              className="object-cover"
            />
          </div>
          <figcaption className="mt-3 text-[0.8125rem] leading-relaxed text-[color:var(--muted-fg)]">
            {side.caption}
            {side.code ? (
              <>
                {' '}
                <Link href={`/gem/${side.code}`} className="link-underline font-medium text-royal">
                  See {side.code}
                </Link>
              </>
            ) : null}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

import type { ReactNode } from 'react';
import Link from 'next/link';
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
    <div
      className="
        py-14 sm:py-20
        [&>h2]:t-display-3 [&>h2]:mt-14 [&>h2]:mb-4 [&>h2]:first:mt-0
        [&>h3]:t-title [&>h3]:mt-9 [&>h3]:mb-3
        [&>p]:mb-5 [&>p]:text-[1.0625rem] [&>p]:leading-[1.78] [&>p]:text-[color:var(--muted-fg)]
        [&>ul]:mb-6 [&>ul]:space-y-2.5 [&>ul]:pl-5 [&>ul]:list-disc [&>ul]:marker:text-gold
        [&>ol]:mb-6 [&>ol]:space-y-2.5 [&>ol]:pl-5 [&>ol]:list-decimal [&>ol]:marker:text-gold
        [&_li]:text-[1.0625rem] [&_li]:leading-[1.72] [&_li]:text-[color:var(--muted-fg)]
        [&_strong]:font-semibold [&_strong]:text-[color:var(--page-fg)]
        [&_a]:text-royal [&_a]:underline [&_a]:underline-offset-[0.22em] dark:[&_a]:text-cornflower
      "
    >
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
  const others = GUIDE_PAGES.filter((g) => g.href !== current);
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
    </div>
  );
}

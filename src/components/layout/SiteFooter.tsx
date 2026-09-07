import Link from 'next/link';
import { Container } from '@/components/primitives';
import { GUIDE_PAGES, SITE } from '@/lib/site';
import { Logo } from './Logo';

const SHOP_LINKS = [
  { href: '/collection', label: 'The full collection' },
  { href: '/collection?variety=Blue+Sapphire', label: 'Blue sapphire' },
  { href: '/collection?variety=Yellow+Sapphire', label: 'Yellow sapphire' },
  { href: '/collection?treatment=natural', label: 'Unheated stones' },
  { href: '/collection?pairs=1', label: 'Matched pairs' },
];

const HOUSE_LINKS = [
  { href: '/about', label: 'Our house' },
  { href: '/contact', label: 'Contact' },
  { href: '/wishlist', label: 'Your selection' },
  { href: '/terms', label: 'Terms, shipping & returns' },
];

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="sapphire-ground on-dark mt-24 sm:mt-32">
      <Container>
        <div className="grid gap-12 py-16 sm:py-20 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo onDark />
            <p className="t-lead mt-5 max-w-sm !text-[0.9375rem]">
              Ceylon sapphires from Sri Lanka, photographed and specified one stone at a time,
              sold direct to the people who will wear and set them.
            </p>
            <div className="hairline-gold my-7 max-w-sm" />
            <address className="not-italic text-sm space-y-1.5 text-[color:var(--muted-fg)]">
              <p>
                <a href={`mailto:${SITE.email}`} className="link-underline hover:text-white">
                  {SITE.email}
                </a>
              </p>
              <p>
                <a href={`tel:${SITE.phoneE164}`} className="link-underline hover:text-white">
                  {SITE.phoneDisplay}
                </a>
              </p>
              <p>
                {SITE.address.city}, {SITE.address.country}
              </p>
            </address>
          </div>

          <FooterColumn title="The Collection" links={SHOP_LINKS} />
          <FooterColumn title="Learn" links={GUIDE_PAGES.map((g) => ({ href: g.href, label: g.label }))} />
          <FooterColumn title="The House" links={HOUSE_LINKS} />
        </div>

        <div className="flex flex-col gap-4 border-t border-white/10 py-7 text-xs text-[color:var(--subtle-fg)] sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {SITE.legalName}. All rights reserved.
          </p>
          <p className="max-w-xl sm:text-right">
            Every stone is sold with full disclosure of treatment. Independent laboratory
            certification is available on request for any lot.
          </p>
        </div>
      </Container>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: readonly { href: string; label: string }[];
}) {
  return (
    <div>
      <h2 className="t-eyebrow text-gold-bright mb-4">{title}</h2>
      <ul className="space-y-2.5">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="text-sm text-[color:var(--muted-fg)] transition-colors duration-200 hover:text-white"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

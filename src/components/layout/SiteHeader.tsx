'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { NAV } from '@/lib/site';
import { Container } from '@/components/primitives';
import { WishlistCount } from '@/components/wishlist/WishlistCount';
import { Logo } from './Logo';

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // The header sits on the dark hero at the top of the home page and turns
  // solid once scrolled. Elsewhere it is solid from the start.
  const overHero = pathname === '/' && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  // Lock scroll behind the mobile drawer.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ease-[var(--ease-brand)] ${
        overHero
          ? 'bg-transparent'
          : 'bg-[color:var(--panel-bg)]/90 backdrop-blur-md border-b border-[color:var(--panel-line)]'
      }`}
    >
      <Container>
        <div className="flex h-[4.5rem] items-center justify-between gap-6">
          <Link href="/" aria-label={`Serendia Gems — home`} className="shrink-0">
            <Logo onDark={overHero} />
          </Link>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {NAV.map((item) => {
                const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? 'page' : undefined}
                      className={`relative inline-flex items-center px-3.5 py-2 text-[0.875rem] font-medium transition-colors duration-200 ${
                        overHero
                          ? 'text-white/80 hover:text-white'
                          : active
                            ? 'text-royal dark:text-cornflower'
                            : 'text-[color:var(--muted-fg)] hover:text-royal dark:hover:text-cornflower'
                      }`}
                    >
                      {item.label}
                      {active ? (
                        <span
                          className={`absolute inset-x-3.5 -bottom-0.5 h-px ${overHero ? 'bg-gold-bright' : 'bg-gold'}`}
                          aria-hidden="true"
                        />
                      ) : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-1">
            <WishlistCount onDark={overHero} />
            <Link
              href="/contact"
              className={`hidden sm:inline-flex items-center min-h-11 px-5 text-[0.875rem] font-medium rounded-[var(--r-sm)] transition-colors duration-200 ${
                overHero
                  ? 'bg-gold-bright text-abyss hover:bg-white'
                  : 'bg-royal text-white hover:bg-royal-bright'
              }`}
            >
              Enquire
            </Link>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? 'Close menu' : 'Open menu'}
              className={`lg:hidden inline-flex h-11 w-11 items-center justify-center rounded-full ${
                overHero ? 'text-white' : 'text-[color:var(--page-fg)]'
              }`}
            >
              <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                {open ? <><path d="M18 6 6 18" /><path d="m6 6 12 12" /></> : <><path d="M3 7h18" /><path d="M3 12h18" /><path d="M3 17h18" /></>}
              </svg>
            </button>
          </div>
        </div>
      </Container>

      {/* Mobile drawer */}
      <div
        id="mobile-nav"
        hidden={!open}
        className="lg:hidden border-t border-[color:var(--panel-line)] bg-[color:var(--panel-bg)]"
      >
        <Container>
          <nav aria-label="Mobile" className="py-4">
            <ul className="flex flex-col">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="block py-3.5 text-[1.0625rem] border-b border-[color:var(--panel-line)] last:border-0"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li className="pt-4">
                <Link
                  href="/contact"
                  className="flex items-center justify-center min-h-12 rounded-[var(--r-sm)] bg-royal px-6 font-medium text-white"
                >
                  Enquire about a stone
                </Link>
              </li>
            </ul>
          </nav>
        </Container>
      </div>
    </header>
  );
}

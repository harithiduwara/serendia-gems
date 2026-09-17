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

  useEffect(() => setOpen(false), [pathname]);

  // Lock scroll behind the mobile drawer.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-[color:var(--panel-line)] bg-white/90 backdrop-blur-md">
      <Container>
        <div className="flex h-[4.5rem] items-center justify-between gap-6">
          <Link href="/" aria-label={`Serendia Gems — home`} className="shrink-0">
            <Logo />
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
                        active ? 'text-royal' : 'text-[color:var(--muted-fg)] hover:text-royal'
                      }`}
                    >
                      {item.label}
                      {active ? (
                        <span
                          className="absolute inset-x-3.5 -bottom-0.5 h-px bg-gold"
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
            <WishlistCount />
            <Link
              href="/contact"
              className="hidden sm:inline-flex items-center min-h-11 px-5 text-[0.875rem] font-medium rounded-[var(--r-sm)] bg-royal text-white transition-colors duration-200 hover:bg-royal-bright"
            >
              Enquire
            </Link>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? 'Close menu' : 'Open menu'}
              className="lg:hidden inline-flex h-11 w-11 items-center justify-center rounded-full text-[color:var(--page-fg)]"
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
        className="lg:hidden border-t border-[color:var(--panel-line)] bg-white"
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

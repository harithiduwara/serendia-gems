'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

/**
 * Navigation progress bar.
 *
 * Nielsen #1 (visibility of system status) and the Doherty threshold: a click
 * that produces no response within ~400 ms reads as broken. Static pages are
 * usually faster than that, so the bar deliberately does not appear until
 * 250 ms have passed — showing it sooner would add perceived latency rather
 * than remove it.
 */
export function RouteProgress() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const firstRender = useRef(true);

  // Any click on an internal link starts the indicator.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const anchor = (e.target as HTMLElement | null)?.closest?.('a');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href || href.startsWith('#') || anchor.target === '_blank') return;
      if (!href.startsWith('/') && !href.startsWith(window.location.origin)) return;

      const dest = new URL(anchor.href, window.location.href);
      if (dest.pathname === window.location.pathname) return; // same page

      window.setTimeout(() => setVisible(true), 250);
    };

    document.addEventListener('click', onClick, { capture: true });
    return () => document.removeEventListener('click', onClick, { capture: true } as EventListenerOptions);
  }, []);

  // Creep forward while pending — never reaching 100, which would imply done.
  useEffect(() => {
    if (!visible) { setProgress(0); return; }
    setProgress(12);
    const id = window.setInterval(() => {
      setProgress((p) => (p >= 88 ? p : p + (88 - p) * 0.16));
    }, 180);
    return () => window.clearInterval(id);
  }, [visible]);

  // Arrival: finish, then clear.
  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return; }
    setProgress(100);
    const id = window.setTimeout(() => setVisible(false), 240);
    return () => window.clearTimeout(id);
  }, [pathname]);

  if (!visible) return null;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[200] h-0.5"
      role="progressbar"
      aria-label="Loading page"
      aria-busy="true"
    >
      <div
        className="h-full bg-gold-bright transition-[width] duration-200 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

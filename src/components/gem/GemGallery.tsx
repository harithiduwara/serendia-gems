'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { altFor, blurFor, imagePath } from '@/lib/catalog';
import type { Gem } from '@/lib/types';

/**
 * Gallery with a lightbox.
 *
 * Accessibility contract (design-system.md §7): focus is trapped inside the
 * lightbox while open, Escape closes it, and focus returns to the trigger.
 */
export function GemGallery({ gem }: { gem: Gem }) {
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const count = gem.images.length;
  const activeSrc = gem.images[active];

  const next = useCallback(() => setActive((i) => (i + 1) % Math.max(count, 1)), [count]);
  const prev = useCallback(() => setActive((i) => (i - 1 + Math.max(count, 1)) % Math.max(count, 1)), [count]);

  const close = useCallback(() => {
    setZoomed(false);
    triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!zoomed) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { close(); return; }
      if (e.key === 'ArrowRight') { next(); return; }
      if (e.key === 'ArrowLeft') { prev(); return; }
      if (e.key !== 'Tab') return;

      // Focus trap.
      const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], [tabindex]:not([tabindex="-1"])',
      );
      if (!focusables?.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (!first || !last) return;
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };

    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialogRef.current?.querySelector<HTMLElement>('button')?.focus();

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [zoomed, close, next, prev]);

  if (!activeSrc) {
    return (
      <div className="gem-mat flex aspect-square flex-col items-center justify-center gap-4 rounded-[var(--r-md)] px-8 text-center">
        <svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="#8A90A3" strokeWidth="1" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 2 22 8.5 12 22 2 8.5Z" /><path d="M2 8.5h20M12 2v20M7 8.5 12 22l5-13.5" />
        </svg>
        <p className="text-sm font-medium uppercase tracking-[0.12em] text-[#8A90A3]">
          Photography in preparation
        </p>
        <p className="max-w-xs text-sm text-[#8A90A3]">
          We have not yet shot {gem.code} in the studio. Images and video can be sent to you
          directly — ask for them in your enquiry and we will reply with the full set.
        </p>
      </div>
    );
  }

  return (
    <div>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setZoomed(true)}
        className="gem-mat group relative block aspect-square w-full cursor-zoom-in overflow-hidden rounded-[var(--r-md)]"
        aria-label={`Enlarge photograph ${active + 1} of ${count} of ${gem.code}`}
      >
        <Image
          src={imagePath(activeSrc)}
          alt={altFor(gem, active)}
          fill
          sizes="(max-width: 1024px) 100vw, 55vw"
          placeholder="blur"
          blurDataURL={blurFor(activeSrc)}
          priority
          className="object-cover transition-transform duration-[600ms] ease-[var(--ease-brand)] motion-safe:group-hover:scale-[1.03]"
        />
        <span className="pointer-events-none absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-abyss/70 px-3 py-1.5 text-[0.6875rem] font-medium uppercase tracking-[0.1em] text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <circle cx="11" cy="11" r="7" /><path d="m20 20-3.2-3.2M11 8v6M8 11h6" />
          </svg>
          Zoom
        </span>
      </button>

      {count > 1 ? (
        <ul className="mt-3 flex gap-3" role="list">
          {gem.images.map((img, i) => (
            <li key={img}>
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-label={`View photograph ${i + 1} of ${gem.code}`}
                aria-current={i === active ? 'true' : undefined}
                className={`gem-mat relative block h-20 w-20 overflow-hidden rounded-[var(--r-sm)] ring-offset-2 ring-offset-[color:var(--page-bg)] transition-shadow duration-200 sm:h-24 sm:w-24 ${
                  i === active ? 'ring-2 ring-royal dark:ring-cornflower' : 'ring-1 ring-[color:var(--panel-line)] hover:ring-royal/50'
                }`}
              >
                <Image
                  src={imagePath(img)}
                  alt=""
                  fill
                  sizes="96px"
                  placeholder="blur"
                  blurDataURL={blurFor(img)}
                  className="object-cover"
                />
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      {zoomed ? (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={`Photographs of ${gem.code}`}
          className="fixed inset-0 z-[100] flex flex-col bg-abyss/96 backdrop-blur-sm"
        >
          <div className="flex items-center justify-between px-5 py-4 text-white sm:px-8">
            <p className="t-num text-sm tracking-wide">
              {gem.code} — {active + 1} / {count}
            </p>
            <button
              type="button"
              onClick={close}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full text-white/80 hover:bg-white/10 hover:text-white"
              aria-label="Close enlarged view"
            >
              <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                <path d="M18 6 6 18" /><path d="m6 6 12 12" />
              </svg>
            </button>
          </div>

          <div className="relative flex-1 px-4 pb-6 sm:px-10">
            <Image
              src={imagePath(activeSrc)}
              alt={altFor(gem, active)}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>

          {count > 1 ? (
            <div className="flex items-center justify-center gap-3 pb-8">
              <button type="button" onClick={prev} aria-label="Previous photograph" className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/25 text-white hover:bg-white/10">
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg>
              </button>
              <button type="button" onClick={next} aria-label="Next photograph" className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/25 text-white hover:bg-white/10">
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

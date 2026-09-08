'use client';

import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react';

/**
 * Transient confirmation of an action, shown visually and announced to
 * assistive technology.
 *
 * Nielsen #1 (visibility of system status): saving a stone previously changed
 * only the bookmark icon's fill, which is easy to miss and invisible to a
 * screen-reader user who did not move focus. Every message carries an Undo
 * where the action is reversible (Nielsen #3, user control and freedom).
 */
interface Toast {
  id: number;
  message: string;
  undo?: () => void;
}

interface AnnouncerValue {
  announce: (message: string, undo?: () => void) => void;
}

const AnnouncerContext = createContext<AnnouncerValue | null>(null);

export function AnnouncerProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(0);

  const announce = useCallback((message: string, undo?: () => void) => {
    const id = nextId.current++;
    setToasts((prev) => [...prev.slice(-2), { id, message, undo }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, undo ? 6000 : 3500);
  }, []);

  const value = useMemo(() => ({ announce }), [announce]);

  return (
    <AnnouncerContext.Provider value={value}>
      {children}
      <div
        // Bottom-centre on mobile so it does not sit under the thumb; bottom-left
        // on desktop so it never covers the sticky action bar.
        className="pointer-events-none fixed inset-x-0 bottom-4 z-[150] flex flex-col items-center gap-2 px-4 sm:bottom-6 sm:left-6 sm:right-auto sm:items-start"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto flex items-center gap-3 rounded-full border border-[color:var(--panel-line)] bg-[color:var(--panel-bg)] py-2 pl-4 pr-2 shadow-[var(--shadow-2)] motion-safe:animate-[toast-in_200ms_var(--ease-brand)]"
          >
            <span className="text-[0.8125rem] font-medium">{t.message}</span>
            {t.undo ? (
              <button
                type="button"
                onClick={() => {
                  t.undo?.();
                  setToasts((prev) => prev.filter((x) => x.id !== t.id));
                }}
                className="min-h-9 rounded-full px-3 text-[0.8125rem] font-semibold text-royal underline underline-offset-2 hover:bg-mist/60 dark:text-cornflower"
              >
                Undo
              </button>
            ) : null}
          </div>
        ))}
      </div>

      {/* Announcements are separated from the visual toast so that dismissing
          one never removes the other from the accessibility tree. */}
      <div role="status" aria-live="polite" className="sr-only">
        {toasts.map((t) => (
          <p key={t.id}>{t.message}</p>
        ))}
      </div>
    </AnnouncerContext.Provider>
  );
}

export function useAnnouncer(): AnnouncerValue {
  const ctx = useContext(AnnouncerContext);
  // Deliberately forgiving: a component outside the provider should not crash
  // the page over a confirmation message.
  return ctx ?? { announce: () => {} };
}

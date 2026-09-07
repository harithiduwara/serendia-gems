'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

const STORAGE_KEY = 'serendia.wishlist.v1';

interface WishlistValue {
  codes: string[];
  has: (code: string) => boolean;
  toggle: (code: string) => void;
  remove: (code: string) => void;
  clear: () => void;
  /** False until localStorage has been read, so SSR and first paint agree. */
  ready: boolean;
}

const WishlistContext = createContext<WishlistValue | null>(null);

const read = (): string[] => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === 'string') : [];
  } catch {
    // Private mode, disabled storage, or corrupt payload — degrade silently.
    return [];
  }
};

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [codes, setCodes] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  // Hydrate after mount: the server cannot know the wishlist, so rendering it
  // before this runs would cause a hydration mismatch.
  useEffect(() => {
    setCodes(read());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(codes));
    } catch {
      /* storage unavailable — the wishlist simply does not persist */
    }
  }, [codes, ready]);

  // Keep other tabs in step.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setCodes(read());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const toggle = useCallback((code: string) => {
    setCodes((prev) => (prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]));
  }, []);

  const remove = useCallback((code: string) => {
    setCodes((prev) => prev.filter((c) => c !== code));
  }, []);

  const clear = useCallback(() => setCodes([]), []);

  const value = useMemo<WishlistValue>(
    () => ({ codes, has: (c) => codes.includes(c), toggle, remove, clear, ready }),
    [codes, toggle, remove, clear, ready],
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist(): WishlistValue {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within <WishlistProvider>');
  return ctx;
}

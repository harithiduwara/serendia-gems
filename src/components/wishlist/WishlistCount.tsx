'use client';

import Link from 'next/link';
import { useWishlist } from './WishlistProvider';

export function WishlistCount({ onDark = false }: { onDark?: boolean }) {
  const { codes, ready } = useWishlist();
  const n = ready ? codes.length : 0;

  return (
    <Link
      href="/wishlist"
      className={`relative inline-flex h-11 w-11 items-center justify-center rounded-full transition-colors duration-200 ${
        onDark ? 'text-white/80 hover:text-white' : 'text-[color:var(--muted-fg)] hover:text-royal'
      }`}
      aria-label={n > 0 ? `Your selection, ${n} ${n === 1 ? 'stone' : 'stones'}` : 'Your selection, empty'}
    >
      <svg
        width="19"
        height="19"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M19 21l-7-4.5L5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      </svg>
      {n > 0 ? (
        <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1 text-[0.625rem] font-bold text-abyss t-num">
          {n}
        </span>
      ) : null}
    </Link>
  );
}

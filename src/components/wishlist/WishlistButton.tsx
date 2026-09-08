'use client';

import { useAnnouncer } from '@/components/feedback/Announcer';
import { useWishlist } from './WishlistProvider';

export function WishlistButton({
  code,
  className = '',
  withLabel = false,
}: {
  code: string;
  className?: string;
  withLabel?: boolean;
}) {
  const { has, toggle, ready } = useWishlist();
  const { announce } = useAnnouncer();
  const saved = ready && has(code);

  // Nielsen #1: the icon fill alone is easy to miss and silent to a screen
  // reader that has not moved focus. Confirm, and make it reversible.
  const onToggle = () => {
    toggle(code);
    announce(
      saved ? `${code} removed from your selection` : `${code} saved to your selection`,
      () => toggle(code),
    );
  };

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${code} from your selection` : `Save ${code} to your selection`}
      className={
        `inline-flex items-center justify-center gap-2 rounded-full border transition-colors duration-200 ` +
        (withLabel ? 'px-4 min-h-12 text-sm font-medium ' : 'h-11 w-11 ') +
        (saved
          ? 'border-gold bg-gold/10 text-gold '
          : 'border-[color:var(--panel-line)] bg-[color:var(--panel-bg)]/90 text-[color:var(--muted-fg)] hover:border-gold hover:text-gold ') +
        className
      }
    >
      <svg
        width="17"
        height="17"
        viewBox="0 0 24 24"
        fill={saved ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M19 21l-7-4.5L5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      </svg>
      {withLabel ? <span>{saved ? 'Saved' : 'Save this stone'}</span> : null}
    </button>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useAnnouncer } from '@/components/feedback/Announcer';
import { formatCarats, formatTreatment, formatUSD } from '@/lib/format';
import type { Gem } from '@/lib/types';

/**
 * Share one stone.
 *
 * Buyers rarely decide alone — a stone gets forwarded to a partner, a jeweller
 * or a family member before anyone enquires. Before this, forwarding meant
 * copying the address out of the browser bar, which on a phone is awkward
 * enough that people simply screenshot the page instead. A screenshot loses the
 * price, the specification and the link back.
 *
 * WhatsApp is listed explicitly rather than hidden behind the system share
 * sheet because it is how this market actually forwards things.
 */
export function ShareStone({ gem, url }: { gem: Gem; url: string }) {
  const { announce } = useAnnouncer();
  const [canNativeShare, setCanNativeShare] = useState(false);

  // navigator.share only exists on some browsers, and only over HTTPS. Checked
  // after mount so the server and first client render agree.
  useEffect(() => {
    setCanNativeShare(typeof navigator !== 'undefined' && typeof navigator.share === 'function');
  }, []);

  const summary =
    `${gem.code} — ${formatCarats(gem.carats)} ${formatTreatment(gem.treatment).toLowerCase()} ` +
    `${gem.variety.toLowerCase()}, ${formatUSD(gem.priceUSD)}`;

  /**
   * The canonical URL is passed in from the server, so the WhatsApp link is a
   * real link in the HTML — it works before JavaScript loads, and the markup
   * matches on hydration. Interactive paths prefer the address actually being
   * viewed, which keeps any query string the visitor arrived with.
   */
  const currentUrl = () => (typeof window === 'undefined' ? url : window.location.href);

  const onNativeShare = async () => {
    try {
      await navigator.share({ title: `${gem.code} · Serendia Gems`, text: summary, url: currentUrl() });
    } catch {
      // Dismissing the share sheet rejects. Nothing to report.
    }
  };

  /**
   * Two ways to copy, because the modern one is refused more often than you
   * would expect: it needs a secure context, and browsers reject it when the
   * document is not focused. The execCommand path is deprecated but still
   * universally supported and has neither requirement.
   */
  const copyText = async (text: string): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      /* fall through */
    }
    try {
      const field = document.createElement('textarea');
      field.value = text;
      field.setAttribute('readonly', '');
      // Off-screen rather than hidden: a display:none field cannot be selected.
      field.style.cssText = 'position:fixed;top:0;left:-9999px;opacity:0';
      document.body.appendChild(field);
      field.select();
      field.setSelectionRange(0, text.length);
      const ok = document.execCommand('copy');
      document.body.removeChild(field);
      return ok;
    } catch {
      return false;
    }
  };

  const onCopy = async () => {
    const url = currentUrl();
    // Last resort: show the address so it can at least be read or selected,
    // rather than telling the visitor to go and find it themselves.
    announce((await copyText(url)) ? 'Link copied' : url);
  };

  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(`${summary}\n${url}`)}`;

  const base =
    'inline-flex min-h-11 items-center gap-2 rounded-[var(--r-sm)] border border-[color:var(--panel-line)] ' +
    'px-4 text-[0.8125rem] font-medium text-[color:var(--muted-fg)] transition-colors ' +
    'hover:border-royal hover:text-royal';

  return (
    <div className="no-print mt-5 flex flex-wrap items-center gap-2">
      <span className="text-[0.8125rem] text-[color:var(--subtle-fg)]">Share this stone</span>

      {canNativeShare ? (
        <button type="button" onClick={onNativeShare} className={base}>
          <Icon d="M12 15V3m0 0L8 7m4-4 4 4M4 13v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6" />
          Share
        </button>
      ) : null}

      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        className={base}
      >
        <Icon d="M20.5 3.5A10 10 0 0 0 3.8 16.3L3 21l4.8-.8A10 10 0 1 0 20.5 3.5Z" />
        WhatsApp
      </a>

      <button type="button" onClick={onCopy} className={base}>
        <Icon d="M9 9h10v10H9zM5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1" />
        Copy link
      </button>
    </div>
  );
}

function Icon({ d }: { d: string }) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

export function Logo({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg width="26" height="30" viewBox="0 0 26 30" fill="none" aria-hidden="true">
        {/* Stylised brilliant-cut sapphire: table, crown facets, pavilion. */}
        <path d="M13 1.4 24.6 9.1 13 28.6 1.4 9.1Z" fill="var(--color-royal)" />
        <path d="M13 1.4 24.6 9.1 13 12.4 1.4 9.1Z" fill="var(--color-royal-bright)" />
        <path d="M13 12.4 24.6 9.1 13 28.6Z" fill="var(--color-royal-deep)" fillOpacity="0.75" />
        <path d="M13 1.4 24.6 9.1 13 28.6 1.4 9.1Z" stroke="var(--color-gold-bright)" strokeWidth="0.9" strokeLinejoin="round" />
      </svg>
      <span className="flex flex-col leading-none">
        <span className="t-display-3 !text-[1.32rem] font-medium tracking-tight text-royal-deep">
          Serendia
        </span>
        {/* Text-safe gold: at 9px this needs the darker token to stay legible. */}
        <span className="t-eyebrow !text-[0.5625rem] mt-0.5 text-gold">Ceylon Gems</span>
      </span>
    </span>
  );
}

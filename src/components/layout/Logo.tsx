export function Logo({ onDark = false, className = '' }: { onDark?: boolean; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg width="26" height="30" viewBox="0 0 26 30" fill="none" aria-hidden="true">
        {/* Stylised brilliant-cut sapphire: table, crown facets, pavilion. */}
        <path d="M13 1.4 24.6 9.1 13 28.6 1.4 9.1Z" fill={onDark ? '#5B87E8' : '#16327E'} />
        <path d="M13 1.4 24.6 9.1 13 12.4 1.4 9.1Z" fill={onDark ? '#DCE5FA' : '#2B57C4'} />
        <path d="M13 12.4 24.6 9.1 13 28.6Z" fill={onDark ? '#2B57C4' : '#0B1838'} fillOpacity="0.75" />
        <path d="M13 1.4 24.6 9.1 13 28.6 1.4 9.1Z" stroke={onDark ? '#D4B968' : '#A8863A'} strokeWidth="0.9" strokeLinejoin="round" />
      </svg>
      <span className="flex flex-col leading-none">
        <span
          className="t-display-3 !text-[1.32rem] font-medium tracking-tight"
          style={{ color: onDark ? '#fff' : 'var(--color-royal-deep)' }}
        >
          Serendia
        </span>
        <span
          className="t-eyebrow !text-[0.5625rem] mt-0.5"
          style={{ color: onDark ? '#D4B968' : '#A8863A' }}
        >
          Ceylon Gems
        </span>
      </span>
    </span>
  );
}

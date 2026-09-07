import Link from 'next/link';
import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';

/* ── Container ──────────────────────────────────────────────────────────── */

export function Container({
  children,
  className = '',
  width = 'default',
}: {
  children: ReactNode;
  className?: string;
  width?: 'default' | 'wide' | 'prose';
}) {
  const w =
    width === 'wide' ? 'max-w-[1440px]' : width === 'prose' ? 'max-w-[46rem]' : 'max-w-[1200px]';
  return <div className={`mx-auto w-full ${w} px-5 sm:px-8 ${className}`}>{children}</div>;
}

/* ── Button ─────────────────────────────────────────────────────────────── */

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'gold';
type ButtonSize = 'sm' | 'md' | 'lg';

const BUTTON_BASE =
  'inline-flex items-center justify-center gap-2 font-medium rounded-[var(--r-sm)] ' +
  'transition-[background-color,color,border-color,box-shadow,transform] duration-200 ' +
  'ease-[var(--ease-brand)] disabled:opacity-50 disabled:pointer-events-none ' +
  'active:translate-y-px select-none text-center';

const BUTTON_VARIANTS: Record<ButtonVariant, string> = {
  primary: 'bg-royal text-white hover:bg-royal-bright shadow-[var(--shadow-1)]',
  secondary:
    'border border-royal/35 text-royal hover:bg-royal hover:text-white hover:border-royal ' +
    'dark:text-cornflower dark:border-cornflower/40 dark:hover:bg-cornflower dark:hover:text-abyss',
  ghost: 'text-[color:var(--page-fg)] hover:bg-[color:var(--color-mist)]/60',
  gold: 'bg-gold-bright text-abyss hover:bg-white',
};

const BUTTON_SIZES: Record<ButtonSize, string> = {
  // Minimum 44px target height (design-system.md §6).
  sm: 'text-sm px-4 min-h-11',
  md: 'text-[0.9375rem] px-6 min-h-12',
  lg: 'text-base px-8 min-h-14',
};

interface ButtonOwnProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...rest
}: ButtonOwnProps & ComponentPropsWithoutRef<'button'>) {
  return (
    <button
      className={`${BUTTON_BASE} ${BUTTON_VARIANTS[variant]} ${BUTTON_SIZES[size]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

export function ButtonLink({
  href,
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...rest
}: ButtonOwnProps & { href: string } & Omit<ComponentPropsWithoutRef<typeof Link>, 'href'>) {
  const external = href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:');
  const cls = `${BUTTON_BASE} ${BUTTON_VARIANTS[variant]} ${BUTTON_SIZES[size]} ${className}`;
  if (external) {
    return (
      <a href={href} className={cls} rel="noopener noreferrer">
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls} {...rest}>
      {children}
    </Link>
  );
}

/* ── Badge ──────────────────────────────────────────────────────────────── */

type BadgeTone = 'natural' | 'heated' | 'pair' | 'neutral' | 'positive' | 'warning' | 'critical';

const BADGE_TONES: Record<BadgeTone, string> = {
  natural: 'border-gold/60 text-gold bg-gold/5',
  heated: 'border-royal/25 text-royal bg-royal/5 dark:text-cornflower dark:border-cornflower/30',
  pair: 'border-royal/25 text-royal bg-mist/70 dark:text-cornflower dark:bg-royal/20',
  neutral: 'border-[color:var(--panel-line)] text-[color:var(--muted-fg)]',
  positive: 'border-positive/30 text-positive bg-positive/5',
  warning: 'border-warning/35 text-warning bg-warning/5',
  critical: 'border-critical/30 text-critical bg-critical/5',
};

export function Badge({
  tone = 'neutral',
  children,
  className = '',
}: {
  tone?: BadgeTone;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.6875rem] font-semibold uppercase tracking-[0.09em] leading-none ${BADGE_TONES[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

/* ── Section heading ────────────────────────────────────────────────────── */

export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = 'left',
  as: As = 'h2',
  className = '',
}: {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  align?: 'left' | 'center';
  as?: ElementType;
  className?: string;
}) {
  const centred = align === 'center';
  return (
    <div className={`${centred ? 'text-center mx-auto' : ''} ${className}`}>
      {eyebrow ? (
        <p className="t-eyebrow text-gold mb-3">
          {eyebrow}
        </p>
      ) : null}
      <As className="t-display-3">{title}</As>
      {lead ? (
        <p className={`t-lead mt-4 measure ${centred ? 'mx-auto' : ''}`}>{lead}</p>
      ) : null}
    </div>
  );
}

/* ── Field ──────────────────────────────────────────────────────────────── */

export function Field({
  label,
  htmlFor,
  error,
  hint,
  required,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block text-sm font-medium mb-1.5">
        {label}
        {required ? (
          <span className="text-critical ml-0.5" aria-hidden="true">
            *
          </span>
        ) : null}
      </label>
      {children}
      {hint && !error ? (
        <p className="mt-1.5 text-xs text-[color:var(--subtle-fg)]">{hint}</p>
      ) : null}
      {error ? (
        <p id={`${htmlFor}-error`} className="mt-1.5 text-xs text-critical font-medium">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export const inputClass =
  'w-full rounded-[var(--r-sm)] border border-[color:var(--panel-line)] bg-[color:var(--panel-bg)] ' +
  'px-3.5 py-3 text-[0.9375rem] text-[color:var(--page-fg)] placeholder:text-[color:var(--subtle-fg)] ' +
  'transition-colors duration-200 hover:border-royal/40 focus:border-royal';

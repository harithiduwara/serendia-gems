import { formatCarats, formatTreatmentLong } from '@/lib/format';
import type { Gem } from '@/lib/types';

export function SpecTable({ gem }: { gem: Gem }) {
  const rows: { label: string; value: string }[] = [
    { label: 'Lot reference', value: gem.code },
    { label: 'Variety', value: gem.variety },
    { label: 'Carat weight', value: gem.isPair ? `${formatCarats(gem.carats)} (pair, total)` : formatCarats(gem.carats) },
    { label: 'Shape & cut', value: gem.isPair ? `${gem.shape} — matched pair` : gem.shape },
    { label: 'Treatment', value: formatTreatmentLong(gem.treatment) },
    { label: 'Origin', value: 'Sri Lanka (Ceylon)' },
    { label: 'Species', value: 'Natural corundum' },
    { label: 'Hardness', value: 'Mohs 9' },
    { label: 'Colour', value: gem.colourNote },
    { label: 'Certification', value: 'Independent laboratory report available on request' },
    { label: 'Video', value: gem.hasVideo ? 'Available on request' : 'Not yet filmed — can be arranged' },
  ];

  return (
    <dl className="divide-y divide-[color:var(--panel-line)] border-y border-[color:var(--panel-line)]">
      {rows.map((r) => (
        <div key={r.label} className="grid grid-cols-[minmax(7.5rem,0.8fr)_1.6fr] gap-4 py-3.5">
          <dt className="text-[0.8125rem] font-medium uppercase tracking-[0.06em] text-[color:var(--subtle-fg)]">
            {r.label}
          </dt>
          <dd className="t-num text-[0.9375rem] leading-relaxed">{r.value}</dd>
        </div>
      ))}
    </dl>
  );
}

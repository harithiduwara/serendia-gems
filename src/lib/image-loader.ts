/**
 * Image loader for the STATIC EXPORT build (GitHub Pages).
 *
 * GitHub Pages has no server, so next/image's on-demand optimiser cannot run.
 * `unoptimized: true` alone would ship the full 1600px master (~420 KB) to a
 * 360px phone — roughly 5 MB for one collection page.
 *
 * Instead, `scripts/generate-static-variants.sh` pre-generates committed
 * variants at fixed widths, and this loader maps each requested width to the
 * smallest variant that still covers it. next/image keeps doing everything else
 * it normally does: srcset, sizes, lazy loading, blur placeholders.
 *
 * Requests above the largest variant fall back to the original master, which is
 * already 1600px — so the lightbox still gets full quality.
 *
 * NOTE: a custom loader's return value is used verbatim, so basePath must be
 * applied here. It is not added automatically.
 */
const VARIANT_WIDTHS = [96, 256, 480, 768, 1200] as const;

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

interface LoaderArgs {
  src: string;
  width: number;
  quality?: number;
}

export default function staticImageLoader({ src, width }: LoaderArgs): string {
  // Leave anything that is not one of our catalogue images alone.
  if (!src.startsWith('/gems/')) return `${BASE_PATH}${src}`;

  const file = src.slice('/gems/'.length);
  if (!file.endsWith('.jpg')) return `${BASE_PATH}${src}`;

  const name = file.slice(0, -'.jpg'.length);

  // Smallest variant that still covers the requested width.
  const chosen = VARIANT_WIDTHS.find((w) => w >= width);

  // Above the largest variant, serve the 1600px master.
  if (!chosen) return `${BASE_PATH}/gems/${name}.jpg`;

  return `${BASE_PATH}/gems/r/${name}-${chosen}.jpg`;
}

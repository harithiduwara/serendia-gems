import type { MetadataRoute } from 'next';
import { getAllGems } from '@/lib/catalog';
import { GUIDE_PAGES, SITE } from '@/lib/site';

/**
 * Content depends only on the compiled catalogue, never on the request, so this
 * is safe to emit at build time. Required explicitly for `output: 'export'`.
 */
export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const url = (p: string) => new URL(p, SITE.url).toString();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: url('/'), lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: url('/collection'), lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: url('/about'), lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: url('/contact'), lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: url('/terms'), lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ];

  const guides: MetadataRoute.Sitemap = GUIDE_PAGES.map((g) => ({
    url: url(g.href),
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const gems: MetadataRoute.Sitemap = getAllGems().map((g) => ({
    url: url(`/gem/${g.code}`),
    lastModified: now,
    changeFrequency: 'weekly' as const,
    // Photographed lots are the ones a visitor can actually evaluate.
    priority: g.photography === 'shot' ? 0.8 : 0.6,
  }));

  return [...staticRoutes, ...guides, ...gems];
}

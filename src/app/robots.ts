import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/site';

/**
 * Content depends only on the compiled catalogue, never on the request, so this
 * is safe to emit at build time. Required explicitly for `output: 'export'`.
 */
export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/api/'] }],
    sitemap: new URL('/sitemap.xml', SITE.url).toString(),
    host: SITE.url,
  };
}

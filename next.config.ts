import type { NextConfig } from 'next';

/**
 * Two build modes.
 *
 *   default            Full-featured. /api/enquiry runs, next/image optimises
 *                      on demand (AVIF/WebP), security headers are sent.
 *                      This is what Vercel or any Node host should run.
 *
 *   STATIC_EXPORT=1    Fully static export for GitHub Pages. No server, so the
 *                      enquiry API is dropped and image optimisation is replaced
 *                      by pre-generated variants (see src/lib/image-loader.ts).
 *
 * The static mode is deliberately an opt-in flag rather than a rewrite, so
 * moving to a Node host later is a change of build command, not a migration.
 * Trade-offs are documented in docs/06-github-pages.md.
 */
const isStaticExport = process.env.STATIC_EXPORT === '1';

/**
 * GitHub Pages serves a project site under /<repo>. Set to '' when a custom
 * domain (serendiagems.com) is attached, since that serves from the root.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  ...(isStaticExport
    ? {
        output: 'export' as const,
        // Directory-style URLs (/gem/HR16/index.html) — the shape GitHub Pages
        // resolves reliably without server rewrites.
        trailingSlash: true,
        basePath: basePath || undefined,
        assetPrefix: basePath || undefined,
        images: {
          loader: 'custom' as const,
          loaderFile: './src/lib/image-loader.ts',
          // Must match VARIANT_WIDTHS in the loader, or next/image will request
          // widths that have no pre-generated file.
          deviceSizes: [256, 480, 768, 1200],
          imageSizes: [96],
        },
      }
    : {
        images: {
          deviceSizes: [360, 480, 640, 828, 1080, 1280, 1600],
          imageSizes: [64, 96, 128, 200, 320, 420],
          formats: ['image/avif' as const, 'image/webp' as const],
          minimumCacheTTL: 60 * 60 * 24 * 365,
        },
        async headers() {
          return [{ source: '/:path*', headers: securityHeaders }];
        },
      }),
};

export default nextConfig;

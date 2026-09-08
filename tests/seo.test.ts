import { describe, expect, it } from 'vitest';
import { absoluteUrl, SITE } from '@/lib/site';

/**
 * Regression cover for the basePath URL bug.
 *
 * `new URL('/collection', 'https://host/serendia-gems')` returns
 * 'https://host/collection' — a path-absolute reference replaces the base's
 * whole path. That silently dropped the basePath from every canonical, og:url,
 * og:image and sitemap entry on the GitHub Pages deployment, pointing all of
 * them at 404s. These tests pin the correct behaviour.
 */
describe('absoluteUrl', () => {
  it('never drops a path prefix present in the site URL', () => {
    // The exact shape that broke: a project-site base plus an absolute path.
    const base = 'https://harithiduwara.github.io/serendia-gems';
    const naive = new URL('/gem/HR16', base).toString();
    expect(naive).toBe('https://harithiduwara.github.io/gem/HR16'); // the bug
    // absoluteUrl must not behave that way against its own configured base.
    expect(absoluteUrl('/gem/HR16')).toContain(new URL(SITE.url).pathname.replace(/\/$/, ''));
  });

  it('is always absolute', () => {
    for (const p of ['/', '/collection', '/gem/HR16', '/guide/buying-guide']) {
      expect(absoluteUrl(p).startsWith('http')).toBe(true);
    }
  });

  it('starts every URL with the configured site URL', () => {
    const base = SITE.url.replace(/\/+$/, '');
    for (const p of ['/', '/collection', '/gem/HR16', '/sitemap.xml']) {
      expect(absoluteUrl(p).startsWith(base)).toBe(true);
    }
  });

  it('never emits a doubled slash in the path', () => {
    for (const p of ['/', '/collection', '//collection', '/gem/HR16/']) {
      const path = absoluteUrl(p).replace(/^https?:\/\/[^/]+/, '');
      expect(path).not.toMatch(/\/\//);
    }
  });

  it('maps the root to a single trailing slash', () => {
    expect(absoluteUrl('/')).toBe(`${SITE.url.replace(/\/+$/, '')}/`);
    expect(absoluteUrl('')).toBe(absoluteUrl('/'));
  });

  it('does not put a trailing slash on a file path', () => {
    expect(absoluteUrl('/sitemap.xml').endsWith('/')).toBe(false);
    expect(absoluteUrl('/gems/HR16_1.jpg').endsWith('/')).toBe(false);
    expect(absoluteUrl('/og-default.png').endsWith('/')).toBe(false);
  });

  it('is idempotent about redundant slashes in the input', () => {
    expect(absoluteUrl('/collection')).toBe(absoluteUrl('collection'));
  });
});

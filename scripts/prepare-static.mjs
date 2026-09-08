#!/usr/bin/env node
/**
 * Prepares the tree for a static export (GitHub Pages).
 *
 * A static site has no server, so `/api/enquiry` cannot exist — `output: 'export'`
 * refuses to build a POST route handler at all. Rather than hide that with a
 * bare `rm` buried in CI YAML, this script makes the transformation explicit,
 * reviewable, and identical whether it runs locally or in Actions.
 *
 * The enquiry form already detects static mode and falls back to composing a
 * mailto (see src/components/enquiry/EnquiryForm.tsx), so removing the route
 * does not leave a dead form.
 *
 *   node scripts/prepare-static.mjs
 */
import { existsSync, rmSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

// 1. Drop the dynamic API route.
const apiDir = join(root, 'src', 'app', 'api');
if (existsSync(apiDir)) {
  rmSync(apiDir, { recursive: true, force: true });
  console.log('· removed src/app/api (no server in a static export)');
} else {
  console.log('· src/app/api already absent');
}

// 2. .nojekyll — without it GitHub Pages runs Jekyll, which silently discards
//    any path starting with an underscore. That would delete /_next entirely.
const publicDir = join(root, 'public');
mkdirSync(publicDir, { recursive: true });
writeFileSync(join(publicDir, '.nojekyll'), '');
console.log('· wrote public/.nojekyll (stops Jekyll eating /_next)');

console.log('\nReady for: STATIC_EXPORT=1 next build');

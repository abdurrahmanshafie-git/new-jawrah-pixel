import { build } from 'esbuild';
import fs from 'node:fs/promises';

// Compile the shared TypeScript SEO definitions for the Node build process.
await build({ entryPoints: ['scripts/render-public-pages.tsx'], bundle: true,
  platform: 'node', format: 'esm', packages: 'external',
  define: { 'import.meta.env': '{}' }, outfile: 'node_modules/.cache/render-public-pages.mjs' });
await import('../node_modules/.cache/render-public-pages.mjs');

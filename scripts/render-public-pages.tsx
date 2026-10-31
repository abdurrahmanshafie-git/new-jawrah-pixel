import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import fs from 'node:fs/promises';
import path from 'node:path';
import { REGION_SEO } from '../src/lib/seo/regionMeta';
import { buildOrganizationSchema, buildWebsiteSchema } from '../src/lib/seo/schema';

const origin = 'https://www.jawrahpixel.com';
const title = REGION_SEO.lk.home.title;
const regions = ['lk', 'pk', 'int', 'uk'] as const;
const template = await fs.readFile('dist/index.html', 'utf8');
// Routes outside the generated set get their canonical from React only.
await fs.writeFile('dist/spa.html', template.replace(/<link\b[^>]*rel="canonical"[^>]*>/g, ''));
const pages = [{ route: '/', title, description: REGION_SEO.lk.home.description, kind: 'home' },
  ...regions.flatMap(region => ['home', 'about', 'leadership', 'about-founder'].map(kind => {
    const meta = REGION_SEO[region][kind === 'about-founder' ? 'leadership' : kind as 'home' | 'about' | 'leadership'];
    return { route: `/${region}${kind === 'home' ? '' : `/${kind}`}`, title: meta.title, description: meta.description, kind };
  }))];
for (const page of pages) {
  const canonical = origin + page.route;
  const head = renderToStaticMarkup(<>
    <title data-rh="true">{page.title}</title>
    <meta data-rh="true" name="description" content={page.description} />
    <link data-rh="true" rel="canonical" href={canonical} />
    <meta data-rh="true" property="og:title" content={page.title} />
    <meta data-rh="true" property="og:description" content={page.description} />
    <meta data-rh="true" property="og:url" content={canonical} />
    <meta data-rh="true" property="og:site_name" content="Jawrah Pixel" />
  </>);
  const graph = { '@context': 'https://schema.org', '@graph': [buildOrganizationSchema(), buildWebsiteSchema()] };
  const schema = `<script id="seo-structured-schema" type="application/ld+json">${JSON.stringify(graph).replace(/</g, '\\u003c')}</script>`;
  // A visible, semantic first response; React replaces it with the interactive UI.
  const content = renderToStaticMarkup(<main className="container mx-auto px-6 py-24" aria-label="Jawrah Pixel">
    <h1 className="text-4xl font-bold">{page.kind === 'leadership' || page.kind === 'about-founder' ? 'Leadership Behind Jawrah Pixel' : 'Jawrah Pixel'}</h1>
    <p className="mt-6">{page.description}</p>
    {(page.kind === 'leadership' || page.kind === 'about-founder' || page.kind === 'about') && <p className="mt-6">Founded by <a href="https://www.linkedin.com/in/abdurrahman-shafie-5a16923a3/">Abdurrahman Shafie</a>, Founder &amp; Creative Director, with Jaweria Hafeez, Co-Founder &amp; Technical Lead.</p>}
    <p className="mt-6">Custom websites, ecommerce development, web applications, UI/UX design and technical SEO for businesses in Sri Lanka and international markets.</p>
    <nav className="mt-6" aria-label="Choose your region">{regions.map(region => <a key={region} className="mr-6" href={`/${region}`}>{({ lk: 'Sri Lanka', pk: 'Pakistan', int: 'International', uk: 'UK & EU' })[region]}</a>)}</nav>
    <p className="mt-6"><a href={`${origin}/lk/about`}>About Jawrah Pixel</a> · <a href={`${origin}/lk/leadership`}>Leadership</a> · <a href={`${origin}/lk/contact`}>Contact</a></p>
  </main>);
  const htmlHead = template.replace(/<(title|meta|link)\b[^>]*data-rh="true"[^>]*>(?:[^<]*<\/title>)?/g, '').replace('</head>', `${head}${schema}</head>`);
  const html = htmlHead.slice(0, htmlHead.indexOf('<div id="root">')) + `<div id="root">${content}</div>\n</body></html>\n`;
  if ((html.match(/rel="canonical"/g) || []).length !== 1 || !html.includes(canonical)) throw new Error(`Invalid canonical at ${page.route}`);
  const target = page.route === '/' ? 'dist/index.html' : path.join('dist', page.route, 'index.html');
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.writeFile(target, html);
  console.log(`Rendered public identity HTML: ${page.route}`);
}

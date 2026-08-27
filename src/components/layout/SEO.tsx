import { useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { appEnv, toAbsoluteUrl } from '@/lib/env';
import type { RegionCode } from '@/types';
import {
  buildLocalBusinessSchema,
  buildOrganizationSchema,
  buildWebsiteSchema,
  getRegionLanguage,
  type JsonLdNode,
} from '@/lib/seo/schema';

type OgType = 'website' | 'article' | 'profile';

export interface SeoAlternate {
  hrefLang: string;
  href: string;
}

interface SEOProps {
  title: string;
  description: string;
  canonicalUrl?: string;
  canonical?: string;
  ogType?: OgType;
  ogImage?: string;
  ogTitle?: string;
  ogDescription?: string;
  keywords?: string | string[];
  schemaData?: JsonLdNode | JsonLdNode[];
  schemaType?: string;
  noIndex?: boolean;
  alternates?: SeoAlternate[];
  region?: RegionCode;
  disableAutoHreflang?: boolean;
}

const regionLocales: Record<RegionCode, string> = {
  lk: 'en_LK',
  pk: 'en_PK',
  int: 'en',
};

function getExplicitRegion(pathname: string): RegionCode | null {
  const segment = pathname.split('/').filter(Boolean)[0];
  if (segment === 'lk' || segment === 'pk' || segment === 'int') return segment;
  return null;
}

function stripRegionPrefix(pathname: string) {
  return pathname.replace(/^\/(lk|pk|int)(?=\/|$)/, '') || '/';
}

function normalizeUrl(pathOrUrl: string) {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return toAbsoluteUrl(pathOrUrl);
}

function formatTitle(title: string) {
  return title.includes('Jawrah Pixel') ? title : `${title} — Jawrah Pixel`;
}

function buildAutoAlternates(pathname: string): SeoAlternate[] {
  const basePath = stripRegionPrefix(pathname);
  const suffix = basePath === '/' ? '' : basePath;

  return [
    { hrefLang: 'en-LK', href: `${appEnv.siteUrl}/lk${suffix}` },
    { hrefLang: 'en-PK', href: `${appEnv.siteUrl}/pk${suffix}` },
    { hrefLang: 'en', href: `${appEnv.siteUrl}/int${suffix}` },
    { hrefLang: 'x-default', href: suffix ? `${appEnv.siteUrl}/int${suffix}` : `${appEnv.siteUrl}/` },
  ];
}

function normalizeSchemaData(schemaType?: string, schemaData?: JsonLdNode | JsonLdNode[]) {
  if (!schemaData) return [];
  const items = Array.isArray(schemaData) ? schemaData : [schemaData];

  return items.map((item) => {
    if (!schemaType || item['@type']) return item;
    return {
      '@type': schemaType,
      ...item,
    };
  });
}

export function SEO({
  title,
  description,
  canonicalUrl,
  canonical,
  ogType = 'website',
  ogImage = '/assets/logo.png',
  ogTitle,
  ogDescription,
  keywords,
  schemaType,
  schemaData,
  noIndex = false,
  alternates,
  region,
  disableAutoHreflang = false,
}: SEOProps) {
  const location = useLocation();
  const pathname = location.pathname || '/';
  const activeRegion = region ?? getExplicitRegion(pathname) ?? undefined;
  const resolvedCanonical = normalizeUrl(canonicalUrl ?? canonical ?? pathname);
  const resolvedOgImage = normalizeUrl(ogImage);
  const formattedTitle = formatTitle(title);
  const keywordContent = Array.isArray(keywords) ? keywords.join(', ') : keywords;
  const resolvedAlternates = alternates ?? (disableAutoHreflang ? [] : buildAutoAlternates(pathname));

  const structuredData = useMemo(() => {
    const graph: JsonLdNode[] = [
      buildOrganizationSchema(),
      buildWebsiteSchema(),
    ];

    if (activeRegion) {
      graph.push(buildLocalBusinessSchema(activeRegion));
    }

    graph.push(...normalizeSchemaData(schemaType, schemaData));

    return {
      '@context': 'https://schema.org',
      '@graph': graph,
    };
  }, [activeRegion, schemaData, schemaType]);
  const structuredDataJson = useMemo(() => JSON.stringify(structuredData), [structuredData]);

  useEffect(() => {
    const id = 'seo-structured-schema';
    document.getElementById(id)?.remove();

    const script = document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    script.textContent = structuredDataJson;
    document.head.appendChild(script);

    return () => {
      document.getElementById(id)?.remove();
    };
  }, [structuredDataJson]);

  return (
    <Helmet prioritizeSeoTags>
      <html lang={getRegionLanguage(activeRegion)} />
      <title>{formattedTitle}</title>
      <meta name="description" content={description} />
      {keywordContent && <meta name="keywords" content={keywordContent} />}
      <meta name="robots" content={noIndex ? 'noindex,nofollow' : 'index,follow,max-image-preview:large'} />
      <link rel="canonical" href={resolvedCanonical} />
      {resolvedAlternates.map((alternate) => (
        <link key={alternate.hrefLang} rel="alternate" hrefLang={alternate.hrefLang} href={alternate.href} />
      ))}

      <meta property="og:title" content={ogTitle ?? formattedTitle} />
      <meta property="og:description" content={ogDescription ?? description} />
      <meta property="og:url" content={resolvedCanonical} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={resolvedOgImage} />
      <meta property="og:site_name" content="Jawrah Pixel" />
      <meta property="og:locale" content={activeRegion ? regionLocales[activeRegion] : 'en'} />
      {activeRegion !== 'lk' && <meta property="og:locale:alternate" content="en_LK" />}
      {activeRegion !== 'pk' && <meta property="og:locale:alternate" content="en_PK" />}
      {activeRegion !== 'int' && <meta property="og:locale:alternate" content="en" />}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={ogTitle ?? formattedTitle} />
      <meta name="twitter:description" content={ogDescription ?? description} />
      <meta name="twitter:image" content={resolvedOgImage} />
      <meta name="theme-color" content="#000000" />

    </Helmet>
  );
}

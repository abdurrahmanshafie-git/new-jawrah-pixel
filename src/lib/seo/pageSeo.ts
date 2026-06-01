import { REGION_SEO, type RegionSeoKey } from './regionMeta';
import { appEnv } from '@/lib/env';

export interface PageSeoConfig {
  title: string;
  description: string;
  path: string;
  schemaType?: string;
  schemaData?: Record<string, unknown>;
  keywords?: string[];
}

export function getRegionalPageSeo(region: RegionSeoKey, page: keyof typeof REGION_SEO.lk): PageSeoConfig {
  const meta = REGION_SEO[region][page];
  const prefix = region === 'int' ? '/int' : `/${region}`;
  return {
    title: meta.title,
    description: meta.description,
    path: `${prefix}${meta.path}`,
    schemaType: meta.schemaType,
    schemaData: meta.schemaData,
    keywords: meta.keywords,
  };
}

export function getCanonicalUrl(path: string): string {
  if (path.startsWith('http')) return path;
  return `${appEnv.siteUrl}${path.startsWith('/') ? path : `/${path}`}`;
}

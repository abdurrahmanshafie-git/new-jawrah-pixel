import { REGION_SEO, type RegionSeoKey } from './regionMeta';

export interface PageSeoConfig {
  title: string;
  description: string;
  path: string;
  schemaType?: 'Organization' | 'Service' | 'Project' | 'BlogPosting';
  schemaData?: Record<string, unknown>;
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
  };
}

export function getCanonicalUrl(path: string): string {
  if (path.startsWith('http')) return path;
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://jawrahpixel.com';
  return `${origin}${path.startsWith('/') ? path : `/${path}`}`;
}

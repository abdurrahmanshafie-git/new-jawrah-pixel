import { useMemo } from 'react';
import { useRegion } from '@/hooks/useRegion';
import { getRegionalPageSeo, type PageSeoConfig } from '@/lib/seo/pageSeo';

type RegionalPage = Parameters<typeof getRegionalPageSeo>[1];

export function useRegionalSeo(page: RegionalPage): PageSeoConfig {
  const { currentRegion } = useRegion();

  return useMemo(() => {
    const meta = getRegionalPageSeo(currentRegion, page);
    return meta;
  }, [currentRegion, page]);
}

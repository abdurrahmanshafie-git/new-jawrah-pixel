/**
 * Jawrah Bot Region Engine
 * Detects the current region and returns localized formatting/currency data.
 */

export type Region = 'lk' | 'pk' | 'int';

export interface RegionConfig {
  code: Region;
  currency: string;
  currencySymbol: string;
  locale: string;
}

const REGION_CONFIGS: Record<Region, RegionConfig> = {
  lk: {
    code: 'lk',
    currency: 'LKR',
    currencySymbol: 'Rs.',
    locale: 'en-LK'
  },
  pk: {
    code: 'pk',
    currency: 'PKR',
    currencySymbol: 'Rs.',
    locale: 'en-PK'
  },
  int: {
    code: 'int',
    currency: 'USD',
    currencySymbol: '$',
    locale: 'en-US'
  }
};

export function detectRegion(): RegionConfig {
  const path = window.location.pathname;
  
  if (path.startsWith('/lk')) return REGION_CONFIGS.lk;
  if (path.startsWith('/pk')) return REGION_CONFIGS.pk;
  
  // Default to international
  return REGION_CONFIGS.int;
}

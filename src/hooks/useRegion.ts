import { useLocation } from 'react-router-dom';
import { regions, getRegionFromPathname, RegionConfig } from '../data/regions';
import { getServicesForRegion } from '../data/services';
import { getCaseStudiesForRegion } from '../data/caseStudies';
import { getMaintenancePlans } from '../data/pricing';
import { getFaqsForRegion } from '../data/faqs';

export function useRegion() {
  const location = useLocation();
  const currentRegion = getRegionFromPathname(location.pathname);
  const config: RegionConfig = regions[currentRegion];

  return {
    currentRegion,
    config,
    services: getServicesForRegion(currentRegion),
    cases: getCaseStudiesForRegion(currentRegion),
    pricingPlans: getMaintenancePlans(currentRegion),
    faqs: getFaqsForRegion(currentRegion),
    // Helper to format url paths with the active country prefix
    p: (path: string) => {
      const cleanPath = path.startsWith('/') ? path : `/${path}`;
      return `/${currentRegion}${cleanPath === '/' ? '' : cleanPath}`;
    },
    // Helper to switch the active pathname to the alternative country path
    getSwitchUrl: () => {
      const otherRegion = currentRegion === 'lk' ? 'pk' : 'lk';
      const pathname = location.pathname;
      
      // If we are at /lk, return /pk
      if (pathname === '/lk' || pathname === '/lk/') return '/pk';
      if (pathname === '/pk' || pathname === '/pk/') return '/lk';
      
      // If we are at /lk/services, replace /lk/ with /pk/
      if (pathname.startsWith('/lk/')) {
        return pathname.replace('/lk/', '/pk/');
      }
      if (pathname.startsWith('/pk/')) {
        return pathname.replace('/pk/', '/lk/');
      }
      
      return `/${otherRegion}`;
    }
  };
}

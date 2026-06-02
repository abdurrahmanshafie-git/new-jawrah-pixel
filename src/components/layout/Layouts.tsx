import { lazy, Suspense, useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { Logo } from './Logo';
import { RegionRouteGuard } from './RegionRouteGuard';
import { useAuth } from '@/contexts/AuthContext';
import { getSavedRegion, regionPath } from '@/lib/region';
import { useRegion } from '@/hooks/useRegion';
import { AdminRegionPreviewSwitcher } from './AdminRegionPreviewSwitcher';
import { ReferralCapture } from '@/components/referral/ReferralCapture';
import { Cursor } from '../ui/Cursor';
import { CinematicLoader } from '../ui/CinematicLoader';

const JawrahBot = lazy(() => import('../JawrahBot').then((module) => ({ default: module.JawrahBot })));

function DeferredJawrahBot() {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const load = () => setShouldLoad(true);
    const idleId = 'requestIdleCallback' in window
      ? window.requestIdleCallback(load, { timeout: 1800 })
      : globalThis.setTimeout(load, 900);

    return () => {
      if ('cancelIdleCallback' in window && typeof idleId === 'number') {
        window.cancelIdleCallback(idleId);
      } else {
        globalThis.clearTimeout(idleId as number);
      }
    };
  }, []);

  if (!shouldLoad) return null;

  return (
    <Suspense fallback={null}>
      <JawrahBot />
    </Suspense>
  );
}

export function RootLayout() {
  const location = useLocation();
  const isCountrySelection = location.pathname === '/';
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    // Hide initial loader after 3.5s (match CinematicLoader timeline)
    const timer = setTimeout(() => {
      setInitialLoad(false);
    }, 3500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <RegionRouteGuard>
      <AnimatePresence mode="wait">
        {initialLoad && <CinematicLoader key="loader" />}
      </AnimatePresence>
      
      <ReferralCapture />
      <Cursor />
      <div className="noise-overlay" />
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: initialLoad ? 0 : 1 }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        className="bg-brand-black min-h-screen"
      >
        {!isCountrySelection && <Navbar />}
        <main className="w-full">
          <Outlet />
        </main>
        {!isCountrySelection && <Footer />}
        {!isCountrySelection && <DeferredJawrahBot />}
      </motion.div>
    </RegionRouteGuard>
  );
}

export function AdminLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-brand-black overflow-x-hidden">
      {/* Admin header */}
      <header className="bg-brand-navy border-b border-white/5 py-3 sm:py-4 px-4 sm:px-6 flex flex-wrap justify-between items-center gap-3 z-10 relative min-w-0">
        <div className="flex items-center gap-2">
           <Logo variant="icon" size="sm" className="w-7 h-7" />
           <span className="text-white font-display font-medium text-sm">Admin Portal</span>
        </div>
        <div className="flex items-center gap-4">
          <AdminRegionPreviewSwitcher compact />
          <div className="text-brand-gray text-sm">
            System v1.0
          </div>
        </div>
      </header>
      <main className="flex-1 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
}

export function ClientLayout() {
  const { profile } = useAuth();
  const { currentRegion } = useRegion();
  const siteRegion = profile?.role === 'admin' || profile?.role === 'superadmin' ? currentRegion : profile?.region ?? getSavedRegion() ?? 'lk';

   return (
    <div className="flex flex-col min-h-screen bg-brand-black overflow-x-hidden">
      {/* Client header */}
      <header className="bg-brand-navy border-b border-white/5 py-3 sm:py-4 px-4 sm:px-6 flex flex-wrap justify-between items-center gap-3 z-10 relative min-w-0">
        <div className="flex items-center gap-2">
           <Logo variant="icon" size="sm" className="w-7 h-7" />
           <span className="text-white font-display font-medium text-sm">Client Portal</span>
        </div>
        <div className="flex items-center gap-4">
           <AdminRegionPreviewSwitcher compact />
           {/* Back to main site link? */}
           <Link to={regionPath(siteRegion)} className="text-brand-gray text-sm hover:text-white transition-colors">Back to Site</Link>
        </div>
      </header>
      <main className="flex-1 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
}

export function AgentLayout() {
  const { profile } = useAuth();
  const { currentRegion } = useRegion();
  const siteRegion = profile?.role === 'admin' || profile?.role === 'superadmin' ? currentRegion : profile?.region ?? getSavedRegion() ?? 'lk';

   return (
    <div className="flex flex-col min-h-screen bg-brand-black overflow-x-hidden">
      {/* Agent header */}
      <header className="bg-brand-navy border-b border-white/5 py-3 sm:py-4 px-4 sm:px-6 flex flex-wrap justify-between items-center gap-3 z-10 relative min-w-0">
        <div className="flex items-center gap-2">
           <Logo variant="icon" size="sm" className="w-7 h-7" />
           <span className="text-white font-display font-medium text-sm">Partner Dashboard</span>
        </div>
        <div className="flex items-center gap-4">
           <AdminRegionPreviewSwitcher compact />
           <Link to={regionPath(siteRegion)} className="text-brand-gray text-sm hover:text-white transition-colors">Back to Site</Link>
        </div>
      </header>
      <main className="flex-1 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
}

import { Link, Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { JawrahBot } from '../JawrahBot';
import { Logo } from './Logo';
import { RegionRouteGuard } from './RegionRouteGuard';
import { useAuth } from '@/contexts/AuthContext';
import { getSavedRegion, regionPath } from '@/lib/region';
import { useRegion } from '@/hooks/useRegion';
import { AdminRegionPreviewSwitcher } from './AdminRegionPreviewSwitcher';
import { ReferralCapture } from '@/components/referral/ReferralCapture';

export function RootLayout() {
  const location = useLocation();
  const isCountrySelection = location.pathname === '/';

  return (
    <RegionRouteGuard>
      <ReferralCapture />
      <div className="flex flex-col min-h-screen bg-brand-black">
        {!isCountrySelection && <Navbar />}
        <main className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
        {!isCountrySelection && <Footer />}
        {!isCountrySelection && <JawrahBot />}
      </div>
    </RegionRouteGuard>
  );
}

export function AdminLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-brand-black">
      {/* Admin header */}
      <header className="bg-brand-navy border-b border-white/5 py-4 px-6 flex justify-between items-center z-10 relative">
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
  const siteRegion = profile?.role === 'admin' ? currentRegion : profile?.region ?? getSavedRegion() ?? 'lk';

   return (
    <div className="flex flex-col min-h-screen bg-brand-black">
      {/* Client header */}
      <header className="bg-brand-navy border-b border-white/5 py-4 px-6 flex justify-between items-center z-10 relative">
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
  const siteRegion = profile?.role === 'admin' ? currentRegion : profile?.region ?? getSavedRegion() ?? 'lk';

   return (
    <div className="flex flex-col min-h-screen bg-brand-black">
      {/* Agent header */}
      <header className="bg-brand-navy border-b border-white/5 py-4 px-6 flex justify-between items-center z-10 relative">
        <div className="flex items-center gap-2">
           <Logo variant="icon" size="sm" className="w-7 h-7" />
           <span className="text-white font-display font-medium text-sm">Agent Workspace</span>
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

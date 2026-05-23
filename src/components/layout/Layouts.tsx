import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { JawrahBot } from '../JawrahBot';
import { Logo } from './Logo';

export function RootLayout() {
  const location = useLocation();
  const isCountrySelection = location.pathname === '/';

  return (
    <div className="flex flex-col min-h-screen bg-brand-black">
      {!isCountrySelection && <Navbar />}
      <main className="flex-1">
        <Outlet />
      </main>
      {!isCountrySelection && <Footer />}
      {!isCountrySelection && <JawrahBot />}
    </div>
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
        <div className="text-brand-gray text-sm">
          System v1.0
        </div>
      </header>
      <main className="flex-1 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
}

export function ClientLayout() {
   return (
    <div className="flex flex-col min-h-screen bg-brand-black">
      {/* Client header */}
      <header className="bg-brand-navy border-b border-white/5 py-4 px-6 flex justify-between items-center z-10 relative">
        <div className="flex items-center gap-2">
           <Logo variant="icon" size="sm" className="w-7 h-7" />
           <span className="text-white font-display font-medium text-sm">Client Portal</span>
        </div>
        <div>
           {/* Back to main site link? */}
           <a href="/" className="text-brand-gray text-sm hover:text-white transition-colors">Back to Site</a>
        </div>
      </header>
      <main className="flex-1 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
}

export function AgentLayout() {
   return (
    <div className="flex flex-col min-h-screen bg-brand-black">
      {/* Agent header */}
      <header className="bg-brand-navy border-b border-white/5 py-4 px-6 flex justify-between items-center z-10 relative">
        <div className="flex items-center gap-2">
           <Logo variant="icon" size="sm" className="w-7 h-7" />
           <span className="text-white font-display font-medium text-sm">Agent Workspace</span>
        </div>
        <div>
           <a href="/" className="text-brand-gray text-sm hover:text-white transition-colors">Back to Site</a>
        </div>
      </header>
      <main className="flex-1 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
}

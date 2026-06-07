import { Link, useLocation } from 'react-router-dom';
import { Globe, User, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll } from 'motion/react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { Logo } from './Logo';
import { useRegion } from '@/hooks/useRegion';
import { REGION_OPTIONS } from '@/data/regions';
import { persistRegion } from '@/lib/region';
import { AdminRegionPreviewSwitcher } from './AdminRegionPreviewSwitcher';
import { trackEvent, ANALYTICS_EVENTS } from '@/lib/analytics';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const location = useLocation();
  const { user, profile } = useAuth();
  const { currentRegion, p, getSwitchUrl } = useRegion();
  const { scrollYProgress } = useScroll();
  const isAdmin = user && (profile?.role === 'admin' || profile?.role === 'superadmin');

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Update scrolled state for styling
      setScrolled(currentScrollY > 20);

      // Smart navbar visibility logic
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down - hide navbar
        setVisible(false);
      } else {
        // Scrolling up - show navbar
        setVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Services', path: p('/services') },
    { name: 'Case Studies', path: p('/case-studies') },
    { name: 'Leadership', path: p('/leadership') },
    { name: 'Process', path: p('/process') },
    { name: 'Pricing', path: p('/pricing') },
    { name: 'About', path: p('/about') },
  ];

  const dashboardPath = user ? (isAdmin ? '/admin' : profile?.role === 'agent' ? '/partner/dashboard' : '/dashboard') : '/login';

  const getRegionShellClass = (isMobile = false) => cn(
    'flex items-center border border-white/10 shadow-[0_0_12px_rgba(34,211,238,0.06)]',
    isMobile
      ? 'h-9 flex-nowrap rounded-full bg-white/[0.055] px-1 py-1 backdrop-blur-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_8px_24px_rgba(0,0,0,0.24)]'
      : 'flex-wrap rounded-xl bg-slate-950/35 p-2',
  );

  const renderRegionSwitcher = (isMobile = false) => {
    if (isAdmin) {
      return <AdminRegionPreviewSwitcher compact={isMobile} />;
    }

    return (
      <div
        className={cn(getRegionShellClass(isMobile), isMobile ? 'gap-0.5' : 'gap-2')}
        role="group"
        aria-label="Region switcher"
      >
        <Globe className={cn('hidden h-3.5 w-3.5 text-zinc-500 sm:block', isMobile && 'sr-only')} />
        {REGION_OPTIONS.map((region) => {
          const isActive = currentRegion === region.id;

          return (
            <Link
              key={region.id}
              to={getSwitchUrl(region.id)}
              onClick={() => persistRegion(region.id)}
              className={cn(
                'rounded-full text-center font-mono font-bold uppercase transition-all duration-300',
                isMobile
                  ? 'grid h-7 min-w-7 place-items-center px-2 text-[10px] tracking-[0.08em] active:scale-95'
                  : 'min-w-[44px] px-3 py-2 text-[10px] tracking-[0.14em] sm:px-3 sm:py-2',
                isActive
                  ? cn(
                      'text-white',
                      isMobile
                        ? 'bg-white/[0.14] shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_0_18px_rgba(6,182,212,0.14)] ring-1 ring-white/[0.15]'
                        : 'bg-white/10 text-brand-cyan ring-1 ring-brand-cyan/20',
                    )
                  : 'text-zinc-400 hover:bg-white/10 hover:text-white',
              )}
              title={region.label}
              aria-label={`Switch to ${region.label}`}
            >
              {region.shortLabel}
            </Link>
          );
        })}
      </div>
    );
  };

  return (
    <>
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-[100] transition-all duration-1000',
        scrolled
          ? 'bg-brand-black/80 backdrop-blur-[48px] py-3 h-16 md:py-4 md:h-20 border-b border-white/[0.04] shadow-[0_15px_50px_rgba(0,0,0,0.9),0_0_60px_rgba(0,149,255,0.08)]'
          : 'bg-transparent py-5 h-20 md:py-8 md:h-28 border-b border-transparent',
        !visible && !isOpen && '-translate-y-full'
      )}
    >
      {/* Premium Ambient Lighting System */}
      <div className={cn(
        "absolute inset-0 z-0 transition-opacity duration-1000 pointer-events-none overflow-hidden",
        scrolled ? "opacity-100" : "opacity-0"
      )}>
        {/* Subtle Center Glow - Behind Nav Area */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[150%] bg-brand-blue/[0.06] blur-[100px] rounded-[100%]" />
        
        {/* Soft Bottom Edge Light Leak / Premium Divider */}
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-brand-blue/20 to-transparent opacity-60" />
      </div>

      <div className="container relative z-10 mx-auto px-6 h-full flex flex-col justify-center">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-12">
            <Link to={`/${currentRegion}`} className="flex items-center group shrink-0">
              <Logo size="sm" className="md:hidden transition-transform duration-500 group-hover:scale-105" />
              <Logo size="md" className="hidden md:flex transition-transform duration-500 group-hover:scale-105" />
            </Link>
            
            <nav className="hidden md:flex items-center gap-10">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={cn(
                    'text-[9px] font-bold uppercase tracking-[0.3em] transition-all duration-500 hover:text-white relative group py-2',
                    location.pathname === link.path ? 'text-white' : 'text-zinc-500'
                  )}
                >
                  {link.name}
                  <span className={cn(
                    "absolute -bottom-0.5 left-0 w-full h-[2px] bg-brand-blue origin-left transition-transform duration-500",
                    location.pathname === link.path 
                      ? "scale-x-100 shadow-[0_0_10px_rgba(6,182,212,0.5)]" 
                      : "scale-x-0 group-hover:scale-x-100"
                  )} />
                </Link>
              ))}
            </nav>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {renderRegionSwitcher()}

            {user ? (
              <Link to={isAdmin ? '/admin' : profile?.role === 'agent' ? '/partner/dashboard' : '/dashboard'}>
                <Button variant="outline" size="sm" className="h-9 px-5 rounded-none text-[9px] tracking-[0.2em] border-white/5 bg-white/[0.02] hover:bg-white/[0.05]">
                  Workspace
                </Button>
              </Link>
            ) : (
              <div className="flex items-center gap-6">
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="text-[9px] tracking-[0.2em] font-bold">
                    Login
                  </Button>
                </Link>
                <Link to={p('/agents')} className="hidden lg:block">
                  <Button variant="ghost" size="sm" className="text-[9px] tracking-[0.2em] font-bold text-zinc-500 hover:text-white transition-colors">
                    Apply as Agent
                  </Button>
                </Link>
                <Link to={p('/contact')}>
                  <Button size="sm" className="h-9 px-5 rounded-none text-[9px] tracking-[0.2em] font-bold shadow-none">
                    Start Project
                  </Button>
                </Link>
              </div>
            )}
          </div>

          <div className="md:hidden ml-auto flex items-center gap-2.5">
            <Link 
              to={dashboardPath}
              className="w-11 h-11 rounded-full border border-white/5 bg-white/[0.03] flex items-center justify-center text-zinc-500 hover:text-white transition-all active:scale-95 shrink-0"
              aria-label={user ? "Go to Dashboard" : "Login"}
            >
              <User size={18} />
            </Link>

            {!user && (
              <Link
                to={p('/agents')}
                className="h-11 px-3 rounded-lg border border-white/5 bg-white/[0.02] flex items-center justify-center hover:border-brand-blue/20 transition-all active:scale-95 shrink-0"
              >
                <span className="text-[9px] font-mono font-bold uppercase tracking-[0.1em] text-zinc-500 hover:text-white transition-colors">Agent</span>
              </Link>
            )}
            
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="relative z-50 w-11 h-11 flex flex-col items-center justify-center gap-2 shrink-0"
            >
              <span className={cn("w-6 h-px bg-white transition-all duration-500", isOpen && "rotate-45 translate-y-2.5")} />
              <span className={cn("w-4 h-px bg-white transition-all duration-500 ml-auto", isOpen && "opacity-0")} />
              <span className={cn("w-6 h-px bg-white transition-all duration-500", isOpen && "-rotate-45 -translate-y-2.5")} />
            </button>
          </div>
        </div>
      </div>
    </header>

    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="fixed top-0 left-0 right-0 z-[90] h-auto max-h-[52vh] bg-brand-black/95 backdrop-blur-[64px] border-b border-white/[0.04] flex flex-col p-6 pt-24 pb-10 md:hidden shadow-[0_30px_60px_rgba(0,0,0,1),0_0_50px_rgba(0,149,255,0.06)]"
        >
          <div className="absolute inset-0 z-0 opacity-15">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-brand-blue/[0.08] blur-[100px]" />
          </div>
          <div className="absolute inset-0 premium-grid-overlay opacity-5 pointer-events-none" />
          
          <div className="flex flex-col gap-5 relative z-10">
            {/* Mobile Account Shortcut */}
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="pb-5 border-b border-white/5"
            >
              <Link 
                to={dashboardPath}
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between group"
              >
                <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-full bg-brand-blue/5 border border-brand-blue/20 flex items-center justify-center text-brand-blue">
                    <User size={18} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-display font-medium text-white group-hover:text-brand-blue transition-colors">
                      {user ? (profile?.full_name || 'My Workspace') : 'Client Login'}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">
                      {user ? (profile?.role || 'User Account') : 'Access Dashboard'}
                    </span>
                  </div>
                </div>
                <ArrowRight size={14} className="text-zinc-800 group-hover:text-brand-blue group-hover:translate-x-1 transition-all" />
              </Link>
            </motion.div>

            <div className="flex flex-col gap-3.5">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.04, duration: 0.3 }}
                >
                  <Link
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center min-h-[44px] text-[18px] font-display font-medium text-white/80 uppercase tracking-tight hover:text-brand-blue transition-colors"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
              
              {!user && (
                <motion.div
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + navLinks.length * 0.04, duration: 0.3 }}
                >
                  <Link
                    to={p('/agents')}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center min-h-[44px] text-[18px] font-display font-medium text-white/80 uppercase tracking-tight hover:text-brand-blue transition-colors"
                  >
                    Apply as Agent
                  </Link>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
}

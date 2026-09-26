import { Link, useLocation } from 'react-router-dom';
import { Globe, User, ArrowRight, Menu, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { Logo } from './Logo';
import { useRegion } from '@/hooks/useRegion';
import { REGION_OPTIONS } from '@/data/regions';
import { persistRegion } from '@/lib/region';
import { AdminRegionPreviewSwitcher } from './AdminRegionPreviewSwitcher';
import { trackEvent, ANALYTICS_EVENTS } from '@/lib/analytics';
import { useTheme } from '@/contexts/ThemeContext';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const location = useLocation();
  const { user, profile } = useAuth();
  const { currentRegion, p, getSwitchUrl } = useRegion();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const isAdmin = user && (profile?.role === 'admin' || profile?.role === 'superadmin');

  const lastScrollYRef = useRef(0);
  const tickingRef = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (!tickingRef.current) {
        tickingRef.current = true;
        window.requestAnimationFrame(() => {
          const isScrolled = currentScrollY > 20;
          const shouldHide = currentScrollY > lastScrollYRef.current && currentScrollY > 100;
          const shouldShow = !shouldHide;

          if (isScrolled !== scrolled) {
            setScrolled(isScrolled);
          }

          if (shouldShow !== visible) {
            setVisible(shouldShow);
          }

          lastScrollYRef.current = currentScrollY;
          tickingRef.current = false;
        });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled, visible]);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) {
        setIsOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navLinks = [
    { name: 'Services', path: p('/services') },
    { name: 'Case Studies', path: p('/case-studies') },
    { name: 'Process', path: p('/process') },
    { name: 'Pricing', path: p('/pricing') },
    { name: 'About', path: p('/about') },
    { name: 'Leadership', path: p('/leadership') },
  ];

  const dashboardPath = user ? (isAdmin ? '/admin' : profile?.role === 'agent' ? '/partner/dashboard' : '/dashboard') : '/login';

  const getRegionShellClass = (isMobile = false) => cn(
    'flex items-center',
    isMobile
      ? 'h-9 flex-nowrap rounded-full backdrop-blur-2xl'
      : 'flex-wrap rounded-xl p-2',
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
        style={{
          border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(15,23,42,0.08)'}`,
          boxShadow: isDark 
            ? '0 0 12px rgba(34,211,238,0.06)' 
            : '0 20px 60px rgba(15,23,42,0.06)',
          background: isDark 
            ? (isMobile ? 'rgba(255,255,255,0.055)' : 'rgba(2,6,23,0.35)') 
            : 'rgba(255,255,255,0.72)',
        }}
      >
        <Globe 
          className={cn('hidden h-3.5 w-3.5 sm:block', isMobile && 'sr-only')} 
          style={{ color: isDark ? 'rgb(161, 161, 170)' : 'rgb(100, 116, 139)' }}
        />
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
              )}
              style={{
                color: isActive 
                  ? (isDark ? 'white' : 'rgb(15, 23, 42)') 
                  : (isDark ? 'rgb(161,161,170)' : 'rgb(100,116,139)'),
                background: isActive 
                  ? (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(16,185,129,0.1)') 
                  : 'transparent',
                boxShadow: isActive 
                  ? (isDark 
                      ? 'inset 0 1px 0 rgba(255,255,255,0.08), 0 0 18px rgba(6,182,212,0.14)' 
                      : '0 0 18px rgba(16,185,129,0.14)') 
                  : 'none',
                border: isActive 
                  ? (isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(16,185,129,0.2)') 
                  : 'none',
              }}
              title={region.label}
              aria-label={`Switch to ${region.label}`}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = isDark 
                    ? 'rgba(255,255,255,0.05)' 
                    : 'rgba(15,23,42,0.03)';
                  e.currentTarget.style.color = isDark 
                    ? 'white' 
                    : 'rgb(15,23,42)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = isDark 
                    ? 'rgb(161,161,170)' 
                    : 'rgb(100,116,139)';
                }
              }}
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
        'fixed top-0 left-0 right-0 z-[100] transition-all duration-300',
        scrolled
          ? cn(
              'h-16 md:h-18 border-b',
              isDark 
                ? 'bg-brand-black/90 backdrop-blur-2xl border-white/[0.08] shadow-[0_10px_30px_rgba(0,0,0,0.5),0_0_40px_rgba(59,130,246,0.05)]'
                : 'bg-white/95 backdrop-blur-2xl border-slate-900/[0.08] shadow-[0_8px_30px_rgba(15,23,42,0.04)]'
            )
          : cn(
              'h-16 sm:h-20 border-b',
              isDark
                ? 'bg-brand-black/85 xl:bg-transparent backdrop-blur-xl xl:backdrop-blur-none border-white/[0.06] xl:border-transparent'
                : 'bg-white/95 xl:bg-transparent backdrop-blur-xl xl:backdrop-blur-none border-slate-900/[0.06] xl:border-transparent'
            ),
        // Keep navbar visible on mobile screens; only hide on desktop on downward scroll
        !visible && !isOpen && 'xl:-translate-y-full'
      )}
    >
      {/* Premium Ambient Lighting System */}
      <div className={cn(
        "absolute inset-0 z-0 transition-opacity duration-700 pointer-events-none overflow-hidden",
        scrolled ? "opacity-100" : "opacity-0"
      )}>
        {/* Subtle Center Glow - Behind Nav Area */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[150%] bg-brand-blue/[0.05] blur-[100px] rounded-[100%]" />
        
        {/* Soft Bottom Edge Light Leak / Premium Divider */}
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-brand-blue/25 to-transparent opacity-70" />
      </div>

      <div className="container relative z-10 mx-auto h-full flex items-center justify-between px-4 sm:px-6">
        {/* Left: Brand Logo */}
        <div className="flex items-center shrink-0">
          <Link to={`/${currentRegion}`} className="flex items-center group shrink-0" aria-label="Jawrah Pixel">
            <Logo asset="logo-navbar" size="xl" className="xl:hidden transition-transform duration-500 group-hover:scale-105" />
            <Logo asset="logo-navbar" size="2xl" className="hidden xl:flex 2xl:hidden transition-transform duration-500 group-hover:scale-105" />
            <Logo asset="logo-navbar" size="3xl" className="hidden 2xl:flex transition-transform duration-500 group-hover:scale-105" />
          </Link>
        </div>

        {/* Center: Centered Navigation Island */}
        <nav className="hidden xl:flex items-center absolute left-1/2 -translate-x-1/2 gap-1 2xl:gap-1.5 px-2 py-1.5 rounded-full border border-black/[0.06] dark:border-white/[0.08] bg-black/[0.02] dark:bg-white/[0.03] backdrop-blur-md shadow-[0_2px_10px_rgba(0,0,0,0.02)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={cn(
                  'text-[13px] font-medium tracking-normal transition-all duration-200 relative px-3.5 py-1.5 rounded-full whitespace-nowrap shrink-0',
                  isActive 
                    ? (isDark 
                        ? 'text-white bg-white/[0.1] font-semibold shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]' 
                        : 'text-slate-950 bg-black/[0.06] font-semibold') 
                    : (isDark 
                        ? 'text-zinc-400 hover:text-white hover:bg-white/[0.05]' 
                        : 'text-slate-600 hover:text-slate-950 hover:bg-black/[0.03]')
                )}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Right: Actions */}
        <div className="hidden xl:flex items-center gap-3.5 2xl:gap-5 shrink-0">
          <ThemeToggle />
          {isAdmin && renderRegionSwitcher()}

          {user ? (
            <Link to={isAdmin ? '/admin' : profile?.role === 'agent' ? '/partner/dashboard' : '/dashboard'} className="shrink-0 group">
              <div className={cn(
                "h-9 px-4 rounded-full text-[12px] font-medium tracking-normal whitespace-nowrap inline-flex items-center gap-2 transition-all duration-300 active:scale-[0.98]",
                isDark
                  ? "border border-white/10 bg-white/[0.04] text-zinc-200 hover:bg-white/[0.08] hover:border-white/20"
                  : "border border-slate-200 bg-white text-slate-800 hover:bg-slate-50 shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
              )}>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Workspace</span>
              </div>
            </Link>
          ) : (
            <div className="flex items-center gap-3 2xl:gap-5 shrink-0">
              <Link to="/login" className="shrink-0">
                <span className={cn(
                  "text-[13px] font-medium tracking-normal px-3 py-1.5 rounded-full transition-all duration-200 inline-block",
                  isDark 
                    ? "text-zinc-300 hover:text-white hover:bg-white/[0.06]" 
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                )}>
                  Login
                </span>
              </Link>
              <Link to={p('/agents')} className="hidden 2xl:inline-flex shrink-0">
                <span className={cn(
                  "text-[13px] font-medium tracking-normal px-3 py-1.5 rounded-full transition-all duration-200 inline-block",
                  isDark 
                    ? "text-zinc-400 hover:text-white hover:bg-white/[0.06]" 
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                )}>
                  Apply as Agent
                </span>
              </Link>
              <Link to={p('/contact')} className="shrink-0 group">
                <div className={cn(
                  "h-9 px-5 rounded-full text-[12px] font-semibold tracking-normal whitespace-nowrap inline-flex items-center gap-2 transition-all duration-300 active:scale-[0.98]",
                  isDark
                    ? "bg-white text-zinc-950 hover:bg-zinc-100 shadow-[0_2px_14px_rgba(255,255,255,0.18)] hover:shadow-[0_4px_22px_rgba(255,255,255,0.28)] border border-white/30"
                    : "bg-brand-blue text-white hover:bg-blue-600 shadow-[0_3px_14px_rgba(59,130,246,0.35)] hover:shadow-[0_6px_22px_rgba(59,130,246,0.45)] border border-blue-400/30"
                )}>
                  <span className={isDark ? "text-zinc-950" : "!text-white text-white"}>Start Project</span>
                  <ArrowRight size={12} className={cn("transition-transform duration-300 group-hover:translate-x-0.5", isDark ? "text-zinc-950" : "!text-white text-white")} />
                </div>
              </Link>
            </div>
          )}
        </div>

          <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3 xl:hidden">
            <Link to={p('/contact')} className="hidden sm:inline-flex shrink-0 group">
              <div className={cn(
                "h-8.5 px-3.5 sm:px-4 rounded-full text-[10px] sm:text-[11px] font-semibold tracking-[0.12em] uppercase whitespace-nowrap inline-flex items-center gap-1.5 transition-all duration-300 active:scale-[0.98]",
                isDark
                  ? "bg-white text-zinc-950 hover:bg-zinc-100 shadow-[0_2px_10px_rgba(255,255,255,0.15)] border border-white/30"
                  : "bg-brand-blue text-white hover:bg-blue-600 shadow-[0_3px_12px_rgba(59,130,246,0.35)] border border-blue-400/30"
              )}>
                <span className={isDark ? "text-zinc-950" : "!text-white text-white"}>Start Project</span>
                <ArrowRight size={11} className={cn("transition-transform duration-300 group-hover:translate-x-0.5", isDark ? "text-zinc-950" : "!text-white text-white")} />
              </div>
            </Link>

            <ThemeToggle />
            <Link 
              to={dashboardPath}
              className={cn(
                "w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 active:scale-95 shrink-0",
                isDark
                  ? "border border-white/15 bg-white/[0.06] text-zinc-200 hover:text-white hover:bg-white/[0.12]"
                  : "border border-slate-300 bg-slate-100 text-slate-800 hover:text-slate-950 hover:bg-slate-200"
              )}
              aria-label={user ? "Go to Dashboard" : "Login"}
            >
              <User size={16} />
            </Link>
            
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={cn(
                "relative z-50 w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue/50 active:scale-95",
                isDark
                  ? "border border-white/20 bg-white/10 text-white hover:bg-white/15 shadow-[0_2px_8px_rgba(0,0,0,0.4)]"
                  : "border border-slate-300 bg-slate-100 text-slate-900 hover:bg-slate-200 shadow-[0_1px_3px_rgba(15,23,42,0.06)]"
              )}
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
            >
              {isOpen ? (
                <X size={18} className="transition-transform duration-200" />
              ) : (
                <Menu size={18} className="transition-transform duration-200" />
              )}
            </button>
          </div>
        </div>
      </header>

    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="fixed top-0 left-0 right-0 z-[95] h-auto max-h-[92vh] overflow-auto backdrop-blur-[64px] border-b flex flex-col p-6 pt-20 sm:pt-24 pb-10 xl:hidden"
          style={{
            // Ensure the mobile menu always shows an opaque backdrop so items at the bottom
            // never reveal the underlying page background in light or dark mode.
            background: isDark ? 'rgba(5, 5, 15, 0.98)' : 'rgba(255, 255, 255, 0.98)',
            borderBottomColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.08)',
            boxShadow: isDark 
              ? '0 30px 60px rgba(0,0,0,1), 0 0 50px rgba(0,149,255,0.06)' 
              : '0 30px 60px rgba(15,23,42,0.06)'
          }}
        >
          <div className="absolute inset-0 z-0 opacity-15">
            <div 
              className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full blur-[100px]"
              style={{
                background: isDark ? 'rgba(59,130,246,0.08)' : 'rgba(16,185,129,0.08)'
              }} 
            />
          </div>
          <div className="absolute inset-0 premium-grid-overlay opacity-5 pointer-events-none" />
          
          <div className="flex flex-col gap-5 relative z-10">
            {/* Mobile Account Shortcut */}
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="pb-5 border-b"
              style={{
                borderBottomColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(15,23,42,0.08)'
              }}
            >
              <Link 
                to={dashboardPath}
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between group"
              >
                <div className="flex items-center gap-4">
                    <div 
                      className="w-11 h-11 rounded-full flex items-center justify-center"
                      style={{
                        background: isDark ? 'rgba(59,130,246,0.05)' : 'rgba(16,185,129,0.05)',
                        border: `1px solid ${isDark ? 'rgba(59,130,246,0.2)' : 'rgba(16,185,129,0.2)'}`,
                        color: isDark ? 'rgb(59,130,246)' : 'rgb(16,185,129)'
                      }}
                    >
                    <User size={18} />
                  </div>
                  <div className="flex flex-col">
                    <span 
                      className="text-sm font-display font-medium transition-colors"
                      style={{
                        color: isDark ? 'white' : 'rgb(15,23,42)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = isDark ? 'rgb(59,130,246)' : 'rgb(16,185,129)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = isDark ? 'white' : 'rgb(15,23,42)';
                      }}
                    >
                      {user ? (profile?.full_name || 'My Workspace') : 'Client Login'}
                    </span>
                    <span 
                      className="text-[10px] font-mono uppercase tracking-widest"
                      style={{
                        color: isDark ? 'rgb(82,82,91)' : 'rgb(100,116,139)'
                      }}
                    >
                      {user ? (profile?.role || 'User Account') : 'Access Dashboard'}
                    </span>
                  </div>
                </div>
                <ArrowRight 
                  size={14} 
                  className="group-hover:translate-x-1 transition-all"
                  style={{
                    color: isDark ? 'rgb(39,39,42)' : 'rgb(156,163,175)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = isDark ? 'rgb(59,130,246)' : 'rgb(16,185,129)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = isDark ? 'rgb(39,39,42)' : 'rgb(156,163,175)';
                  }}
                />
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
                    className="flex items-center min-h-[44px] text-[17px] font-medium tracking-[-0.01em] transition-colors"
                    style={{
                      color: isDark ? 'rgba(255,255,255,0.85)' : 'rgb(30,41,59)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = isDark ? 'rgb(6,182,212)' : 'rgb(16,185,129)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = isDark ? 'rgba(255,255,255,0.85)' : 'rgb(30,41,59)';
                    }}
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
                    className="flex items-center min-h-[44px] text-[17px] font-medium tracking-[-0.01em] transition-colors"
                    style={{
                      color: isDark ? 'rgba(255,255,255,0.85)' : 'rgb(30,41,59)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = isDark ? 'rgb(6,182,212)' : 'rgb(16,185,129)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = isDark ? 'rgba(255,255,255,0.85)' : 'rgb(30,41,59)';
                    }}
                  >
                    Apply as Agent
                  </Link>
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + (navLinks.length + 1) * 0.04, duration: 0.3 }}
                className="pt-4 mt-2 border-t border-white/[0.06] flex flex-col gap-3"
              >
                <Link
                  to={p('/contact')}
                  onClick={() => setIsOpen(false)}
                  className="block w-full group"
                >
                  <div className={cn(
                    "w-full h-11 rounded-full text-[11px] uppercase tracking-[0.16em] font-semibold flex items-center justify-center gap-2 transition-all duration-300 active:scale-[0.98]",
                    isDark
                      ? "bg-white text-zinc-950 shadow-[0_2px_14px_rgba(255,255,255,0.18)] border border-white/30"
                      : "bg-brand-blue text-white hover:bg-blue-600 shadow-[0_3px_14px_rgba(59,130,246,0.35)] border border-blue-400/30"
                  )}>
                    <span className={isDark ? "text-zinc-950" : "!text-white text-white"}>Start Project</span>
                    <ArrowRight size={13} className={cn("transition-transform duration-300 group-hover:translate-x-0.5", isDark ? "text-zinc-950" : "!text-white text-white")} />
                  </div>
                </Link>

                {isAdmin && (
                  <div className="pt-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 block mb-2">Region Preview</span>
                    {renderRegionSwitcher(true)}
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
}

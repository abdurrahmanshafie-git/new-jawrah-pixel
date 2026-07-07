import { Link, useLocation } from 'react-router-dom';
import { Globe, User, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll } from 'motion/react';
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
  const { scrollYProgress } = useScroll();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
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
        'fixed top-0 left-0 right-0 z-[100] transition-all duration-1000',
        scrolled
          ? cn(
              'py-3 h-16 md:py-4 md:h-20 border-b',
              isDark 
                ? 'bg-brand-black/80 backdrop-blur-[48px] border-white/[0.04] shadow-[0_15px_50px_rgba(0,0,0,0.9),0_0_60px_rgba(0,149,255,0.08)]'
                : 'bg-white/80 backdrop-blur-[22px] border-[rgba(15,23,42,0.08)] shadow-[0_20px_60px_rgba(15,23,42,0.06)]'
            )
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
              <Logo asset="logo-navbar" size="xl" className="md:hidden transition-transform duration-500 group-hover:scale-105" />
              <Logo asset="logo-navbar" size="3xl" className="hidden md:flex transition-transform duration-500 group-hover:scale-105" />
            </Link>
            
            <nav className="hidden md:flex items-center gap-10">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={cn(
                    'text-[9px] font-bold uppercase tracking-[0.3em] transition-all duration-500 relative group py-2',
                    location.pathname === link.path 
                      ? (isDark ? 'text-white' : 'text-[#0F172A]') 
                      : (isDark ? 'text-zinc-500' : 'text-[#64748B]')
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
            <ThemeToggle />
            {isAdmin && renderRegionSwitcher()}

            {user ? (
              <Link to={isAdmin ? '/admin' : profile?.role === 'agent' ? '/partner/dashboard' : '/dashboard'}>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-9 px-5 rounded-none text-[9px] tracking-[0.2em]"
                  style={{
                    borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(15,23,42,0.08)',
                    background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.72)',
                    color: isDark ? 'rgb(161,161,170)' : 'rgb(30,41,59)'
                  }}
                >
                  Workspace
                </Button>
              </Link>
            ) : (
              <div className="flex items-center gap-6">
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="text-[9px] tracking-[0.2em] font-bold" style={{ color: isDark ? 'rgb(161,161,170)' : 'rgb(30,41,59)' }}>
                    Login
                  </Button>
                </Link>
                <Link to={p('/agents')} className="hidden lg:block">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-[9px] tracking-[0.2em] font-bold transition-colors"
                    style={{ color: isDark ? 'rgb(161,161,170)' : 'rgb(100,116,139)' }}
                  >
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
            <ThemeToggle />
            <Link 
              to={dashboardPath}
              className="w-11 h-11 rounded-full flex items-center justify-center transition-all active:scale-95 shrink-0"
              style={{
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(15,23,42,0.08)'}`,
                background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.72)',
                color: isDark ? 'rgb(161,161,170)' : 'rgb(100,116,139)'
              }}
              aria-label={user ? "Go to Dashboard" : "Login"}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = isDark ? 'white' : 'rgb(15,23,42)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = isDark ? 'rgb(161,161,170)' : 'rgb(100,116,139)';
              }}
            >
              <User size={18} />
            </Link>

            {!user && (
              <Link
                to={p('/agents')}
                className="h-11 px-3 rounded-lg flex items-center justify-center transition-all active:scale-95 shrink-0"
                style={{
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(15,23,42,0.08)'}`,
                  background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.72)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = isDark ? 'rgba(59,130,246,0.2)' : 'rgba(16,185,129,0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(15,23,42,0.08)';
                }}
              >
                <span 
                  className="text-[9px] font-mono font-bold uppercase tracking-[0.1em] transition-colors"
                  style={{
                    color: isDark ? 'rgb(161,161,170)' : 'rgb(100,116,139)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = isDark ? 'white' : 'rgb(15,23,42)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = isDark ? 'rgb(161,161,170)' : 'rgb(100,116,139)';
                  }}
                >
                  Agent
                </span>
              </Link>
            )}
            
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="relative z-50 w-11 h-11 flex flex-col items-center justify-center gap-2 shrink-0"
            >
              <span 
                className={cn("w-6 h-px transition-all duration-500", isOpen && "rotate-45 translate-y-2.5")} 
                style={{
                  backgroundColor: isDark ? 'white' : 'rgb(15,23,42)'
                }} 
              />
              <span 
                className={cn("w-4 h-px transition-all duration-500 ml-auto", isOpen && "opacity-0")} 
                style={{
                  backgroundColor: isDark ? 'white' : 'rgb(15,23,42)'
                }} 
              />
              <span 
                className={cn("w-6 h-px transition-all duration-500", isOpen && "-rotate-45 -translate-y-2.5")} 
                style={{
                  backgroundColor: isDark ? 'white' : 'rgb(15,23,42)'
                }} 
              />
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
          className="fixed top-0 left-0 right-0 z-[90] h-auto max-h-[92vh] overflow-auto backdrop-blur-[64px] border-b flex flex-col p-6 pt-24 pb-10 md:hidden"
          style={{
            // Ensure the mobile menu always shows an opaque backdrop so items at the bottom
            // never reveal the underlying page background in light or dark mode.
            background: isDark ? 'rgba(0,0,0,0.95)' : 'rgba(255,255,255,0.98)',
            borderBottomColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(15,23,42,0.08)',
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
                    className="flex items-center min-h-[44px] text-[18px] font-display font-medium uppercase tracking-tight transition-colors"
                    style={{
                      color: isDark ? 'rgba(255,255,255,0.8)' : 'rgb(30,41,59)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = isDark ? 'rgb(6,182,212)' : 'rgb(16,185,129)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = isDark ? 'rgba(255,255,255,0.8)' : 'rgb(30,41,59)';
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
                    className="flex items-center min-h-[44px] text-[18px] font-display font-medium uppercase tracking-tight transition-colors"
                    style={{
                      color: isDark ? 'rgba(255,255,255,0.8)' : 'rgb(30,41,59)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = isDark ? 'rgb(6,182,212)' : 'rgb(16,185,129)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = isDark ? 'rgba(255,255,255,0.8)' : 'rgb(30,41,59)';
                    }}
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

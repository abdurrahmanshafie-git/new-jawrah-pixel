import { Link, useLocation } from 'react-router-dom';
import { Globe, User, ArrowRight, Lock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll } from 'motion/react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { Logo } from './Logo';
import { useRegion } from '@/hooks/useRegion';
import { REGION_OPTIONS } from '@/data/regions';
import { persistRegion } from '@/lib/region';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { user, profile } = useAuth();
  const { currentRegion, p, getSwitchUrl } = useRegion();
  const { scrollYProgress } = useScroll();
  const lockedClientRegion = user && profile?.role === 'client' ? profile.region : null;
  const lockedRegionOption = lockedClientRegion
    ? REGION_OPTIONS.find((region) => region.id === lockedClientRegion)
    : null;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Services', path: p('/services') },
    { name: 'Case Studies', path: p('/case-studies') },
    { name: 'Process', path: p('/process') },
    { name: 'Agents', path: p('/agents') },
    { name: 'Pricing', path: p('/pricing') },
    { name: 'About', path: p('/about') },
  ];

  const getRegionShellClass = (isMobile = false) => cn(
    'flex items-center border border-white/10 shadow-[0_0_12px_rgba(34,211,238,0.06)]',
    isMobile
      ? 'h-9 flex-nowrap rounded-full bg-white/[0.055] px-1 py-1 backdrop-blur-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_8px_24px_rgba(0,0,0,0.24)]'
      : 'flex-wrap rounded-xl bg-slate-950/35 p-2',
  );

  const renderRegionSwitcher = (isMobile = false) => {
    if (lockedRegionOption) {
      return (
        <div
          className={cn(
            getRegionShellClass(isMobile),
            isMobile ? 'gap-1.5 px-2.5' : 'gap-2 px-3',
          )}
          role="status"
          title={`${lockedRegionOption.label} region locked to your account`}
          aria-label={`${lockedRegionOption.label} region locked to your account`}
        >
          <Globe className={cn('h-3.5 w-3.5 text-zinc-500', isMobile && 'sr-only')} />
          <span className={cn(
            'font-mono font-bold uppercase text-white',
            isMobile ? 'text-[10px] tracking-[0.08em]' : 'text-[10px] tracking-[0.14em]',
          )}>
            {lockedRegionOption.shortLabel}
          </span>
          <Lock className="h-3 w-3 text-brand-cyan/80" />
        </div>
      );
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
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b',
        scrolled
          ? 'bg-brand-black/82 backdrop-blur-xl border-white/10 py-2 md:py-4 h-16 md:h-20 shadow-[0_20px_50px_rgba(0,0,0,0.35)]'
          : 'bg-brand-black/28 backdrop-blur-md border-white/10 py-2 md:py-6 h-16 md:h-24'
      )}
    >
      <motion.div
        className="absolute bottom-0 left-0 h-px w-full origin-left bg-gradient-to-r from-brand-cyan via-brand-blue to-transparent"
        style={{ scaleX: scrollYProgress }}
      />
      <div className="container mx-auto px-4 md:px-6 h-full flex flex-col justify-center">
        <div className="flex items-center justify-between gap-3">
          <Link to={`/${currentRegion}`} className="flex items-center group shrink-0">
            <Logo variant="full" size="sm" className="md:hidden" />
            <Logo variant="full" size="md" className="hidden md:flex" />
          </Link>
          
          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={cn(
                  'text-xs font-medium uppercase tracking-[0.2em] transition-colors hover:text-white',
                  location.pathname === link.path ? 'text-brand-cyan drop-shadow-[0_0_8px_rgba(56,189,248,0.4)]' : 'text-brand-gray'
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            {/* Region Switcher */}
            {renderRegionSwitcher()}

            {user ? (
              <Link to={profile?.role === 'admin' ? '/admin' : profile?.role === 'agent' ? '/agent' : '/dashboard'}>
                <Button variant="outline" size="sm" className="uppercase tracking-tighter text-xs">Dashboard</Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button variant="ghost" size="sm" className="uppercase tracking-tighter text-xs">Client Login</Button>
              </Link>
            )}
            <Link to={p('/contact')}>
              <Button size="sm" className="uppercase tracking-tighter text-xs luxury-glow">Start Project</Button>
            </Link>
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden ml-auto flex min-w-0 items-center justify-end gap-2">
            {renderRegionSwitcher(true)}
            <motion.button
              type="button"
              whileTap={{ scale: 0.94 }}
              className="group relative z-[60] grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/[0.045] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_8px_24px_rgba(0,0,0,0.22)] transition-all duration-300 hover:border-white/20 hover:bg-white/[0.075] focus:outline-none focus:ring-2 focus:ring-brand-cyan/40"
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
            >
              <span
                className={cn(
                  'absolute h-px w-4 rounded-full bg-white/85 transition-all duration-300 ease-out',
                  isOpen ? 'translate-y-0 rotate-45' : '-translate-y-1.5',
                )}
              />
              <span
                className={cn(
                  'absolute h-px w-4 rounded-full bg-white/70 transition-all duration-200 ease-out',
                  isOpen ? 'opacity-0 scale-x-0' : 'opacity-100 scale-x-100',
                )}
              />
              <span
                className={cn(
                  'absolute h-px w-4 rounded-full bg-white/85 transition-all duration-300 ease-out',
                  isOpen ? 'translate-y-0 -rotate-45' : 'translate-y-1.5',
                )}
              />
            </motion.button>
          </div>
        </div>
      </div>
      </header>

      {/* Premium Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close menu"
              className="fixed inset-0 z-40 cursor-default bg-transparent backdrop-blur-[2px] md:hidden"
              initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
              animate={{ opacity: 1, backdropFilter: 'blur(2px)' }}
              exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              id="mobile-menu"
              role="dialog"
              aria-modal="false"
              initial={{ opacity: 0, y: -14, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.985 }}
              transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
              className="fixed left-3 right-3 top-[72px] z-[45] mx-auto max-h-[calc(100dvh-88px)] max-w-[430px] overflow-hidden rounded-[22px] border border-white/[0.12] bg-zinc-950/[0.68] shadow-[0_24px_80px_rgba(0,0,0,0.42),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-2xl md:hidden"
            >
              <div className="flex max-h-[calc(100dvh-88px)] flex-col overflow-y-auto px-2.5 py-3">
                <nav className="flex flex-col" aria-label="Mobile navigation">
                  {navLinks.map((link, i) => (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.24, delay: 0.04 + i * 0.025, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <Link
                        to={link.path}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          'group flex min-h-[46px] items-center justify-between rounded-2xl px-4 text-[19px] font-display font-medium text-zinc-200 transition-all duration-300 active:scale-[0.985]',
                          location.pathname === link.path
                            ? 'bg-white/[0.075] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]'
                            : 'hover:bg-white/[0.055] hover:text-white',
                        )}
                      >
                        <span>{link.name}</span>
                        <span className="h-px w-5 origin-right scale-x-0 bg-brand-cyan/70 transition-transform duration-300 group-hover:scale-x-100" />
                      </Link>
                    </motion.div>
                  ))}
                </nav>

                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.28, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
                  className="mt-3 grid gap-2 border-t border-white/10 px-1 pt-3"
                >
                  <Link onClick={() => setIsOpen(false)} to={user ? (profile?.role === 'admin' ? '/admin' : profile?.role === 'agent' ? '/agent' : '/dashboard') : '/login'} className="w-full">
                    <Button variant="outline" size="sm" className="h-10 w-full gap-2 rounded-full border-white/[0.12] bg-white/[0.045] text-[11px] font-mono font-bold uppercase tracking-[0.16em] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl">
                      <User className="h-3.5 w-3.5" />
                      Dashboard
                    </Button>
                  </Link>
                  <Link onClick={() => setIsOpen(false)} to={p('/contact')} className="w-full">
                    <Button size="sm" className="h-10 w-full gap-2 rounded-full border-white/[0.15] bg-white text-[11px] font-mono font-bold uppercase tracking-[0.16em] text-brand-black shadow-[0_12px_30px_rgba(255,255,255,0.12)] hover:bg-zinc-100">
                      Start Project
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

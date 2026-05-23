import { Link, useLocation } from 'react-router-dom';
import { Globe, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { Logo } from './Logo';
import { useRegion } from '@/hooks/useRegion';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { user, profile } = useAuth();
  const { currentRegion, p, getSwitchUrl } = useRegion();

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

  const nextRegion = currentRegion === 'lk' ? 'pk' : 'lk';
  const switchUrl = getSwitchUrl();

  const handleSwitchRegion = () => {
    localStorage.setItem('jawrah_region', nextRegion);
  };

  const renderRegionSwitcher = () => (
    <Link
      to={switchUrl}
      onClick={handleSwitchRegion}
      className="flex items-center gap-1.5 px-3 py-1 rounded-md border border-white/10 bg-slate-950/40 hover:bg-white/5 hover:border-white/25 transition-all duration-300 shadow-[0_0_10px_rgba(34,211,238,0.03)] cursor-pointer group"
      title={`Switch to ${nextRegion === 'lk' ? 'Sri Lanka' : 'Pakistan'}`}
    >
      <Globe className="w-3.5 h-3.5 text-zinc-500 group-hover:text-brand-cyan transition-colors" />
      <span className={cn(
         "text-[10px] font-mono font-bold uppercase tracking-[0.15em]",
         currentRegion === 'lk' ? "text-brand-blue" : "text-brand-cyan"
      )}>
         {currentRegion.toUpperCase()}
      </span>
    </Link>
  );

  return (
    <>
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b',
        scrolled
          ? 'bg-brand-black/80 backdrop-blur-md border-white/10 py-3 md:py-4 h-16 md:h-20'
          : 'bg-brand-black/40 backdrop-blur-md border-white/10 py-4 md:py-6 h-16 md:h-24'
      )}
    >
      <div className="container mx-auto px-4 md:px-6 h-full flex flex-col justify-center">
        <div className="flex items-center justify-between">
          <Link to={`/${currentRegion}`} className="flex items-center group">
            <Logo variant="full" size="md" />
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
          <div className="md:hidden flex items-center gap-4">
            {renderRegionSwitcher()}
            <Link 
              to={user ? (profile?.role === 'admin' ? '/admin' : profile?.role === 'agent' ? '/agent' : '/dashboard') : "/login"} 
              className="text-brand-gray hover:text-white p-1 transition-colors"
            >
              <User size={20} />
            </Link>
            <button
              className="relative w-8 h-8 flex flex-col items-end justify-center gap-[5px] focus:outline-none z-[60] group"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle Menu"
            >
              <span className={cn("h-[1px] bg-white transition-all duration-300 ease-in-out transform origin-right", isOpen ? "w-6 -rotate-45 -translate-x-[2px] -translate-y-[2px]" : "w-6 group-hover:w-5")} />
              <span className={cn("h-[1px] bg-white transition-all duration-300 ease-in-out", isOpen ? "w-0 opacity-0" : "w-5 group-hover:w-6")} />
              <span className={cn("h-[1px] bg-white transition-all duration-300 ease-in-out transform origin-right", isOpen ? "w-6 rotate-45 -translate-x-[2px] translate-y-[2px]" : "w-4 group-hover:w-6")} />
            </button>
          </div>
        </div>
      </div>
      </header>

      {/* Premium Full-Screen Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(24px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden fixed inset-0 top-[64px] bg-transparent border-t border-white/5 z-40 overflow-y-auto flex flex-col"
          >
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-brand-blue/10 blur-[100px] rounded-full pointer-events-none translate-x-1/2 -translate-y-1/2"></div>
            
            <div className="flex flex-col p-6 min-h-full relative z-10 w-full max-w-sm mx-auto">
              <div className="text-[9px] font-mono text-brand-gray uppercase tracking-[0.3em] mb-4 relative pb-2 border-b border-white/5">
                <span className="relative z-10 pr-4">Navigation</span>
              </div>

              <div className="flex flex-col w-full">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                    className="border-b border-white/5 last:border-0"
                  >
                    <Link
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className="group flex items-center justify-between py-3.5 w-full"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-[8px] font-mono text-brand-gray/50 group-hover:text-brand-cyan transition-colors duration-300">
                          0{i + 1}
                        </span>
                        <span className="text-sm font-display font-medium uppercase tracking-[0.15em] text-zinc-300 group-hover:text-white group-hover:tracking-[0.2em] transition-all duration-500">
                          {link.name}
                        </span>
                      </div>
                      <span className="w-6 h-px bg-brand-cyan/0 group-hover:bg-brand-cyan transition-all duration-300 origin-right transform scale-x-0 group-hover:scale-x-100"></span>
                    </Link>
                  </motion.div>
                ))}
              </div>
              
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mt-auto pt-8 flex flex-col gap-3 pb-4"
              >
                {user ? (
                  <Link onClick={() => setIsOpen(false)} to={profile?.role === 'admin' ? '/admin' : profile?.role === 'agent' ? '/agent' : '/dashboard'} className="w-full">
                    <Button variant="outline" size="lg" className="w-full h-12 text-[10px] font-mono uppercase tracking-[0.2em] font-bold">Client Dashboard</Button>
                  </Link>
                ) : (
                  <Link onClick={() => setIsOpen(false)} to="/login" className="w-full">
                    <Button variant="ghost" size="lg" className="w-full h-12 text-[10px] font-mono uppercase tracking-[0.2em] font-bold border border-white/10 hover:bg-white/5">Access Portal</Button>
                  </Link>
                )}
                <Link onClick={() => setIsOpen(false)} to={p('/contact')} className="w-full">
                  <Button size="lg" className="w-full h-12 text-[10px] font-mono uppercase tracking-[0.2em] font-bold luxury-glow shadow-[0_0_30px_rgba(34,211,238,0.2)]">Initiate Project</Button>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

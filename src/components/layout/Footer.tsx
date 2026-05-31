import { Link } from 'react-router-dom';
import { Instagram, MessageCircle, Mail, Lock } from 'lucide-react';
import { Logo } from './Logo';
import { useRegion } from '@/hooks/useRegion';
import { Reveal } from '@/components/ui/Reveal';
import { persistRegion, isRegionCode } from '@/lib/region';
import { cn } from '@/lib/utils';
import { REGION_OPTIONS } from '@/data/regions';
import { useAuth } from '@/contexts/AuthContext';
import { AdminRegionPreviewSwitcher } from './AdminRegionPreviewSwitcher';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { config, p, currentRegion } = useRegion();
  const { user, profile } = useAuth();
  const isAdmin = user && (profile?.role === 'admin' || profile?.role === 'superadmin');
  const lockedRegion = user && !isAdmin && isRegionCode(profile?.region) ? profile.region : null;
  const isInternational = currentRegion === 'int';
  const serviceLinks = isInternational
    ? ['Premium Website Design', 'Ecommerce Development', 'AI Integrations', 'Branding & Identity', 'SEO Optimization', 'UI/UX Systems', 'Conversion Optimization', 'Frontend Development']
    : ['Web Design', 'Ecommerce Development', 'UI/UX Design', 'Branding', 'SEO Optimization', 'Admin Dashboards', 'Maintenance Plans'];

  return (
    <footer className="bg-brand-navy border-t border-white/5 pt-12 sm:pt-16 md:pt-24 pb-8 sm:pb-10 overflow-hidden">
      <Reveal className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-12 md:gap-12 lg:gap-8 mb-12 sm:mb-16">
          <div className="sm:col-span-2 lg:col-span-1 flex flex-col items-center sm:items-start text-center sm:text-left">
            <Link to={p('/')} className="flex items-center mb-6 group inline-flex">
              <Logo variant="full" size="md" />
            </Link>
            <p className="text-brand-gray text-[13px] md:text-sm leading-relaxed mb-8 max-w-sm">
              Architecting digital monopolies for ambitious brands. We craft premium websites, enterprise commerce platforms, and intelligent systems that establish market authority.
            </p>
            <div className="flex items-center gap-5">
              <a href={`mailto:${config.contactEmail}`} className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-brand-gray hover:text-brand-cyan hover:border-brand-cyan hover:bg-brand-cyan/10 transition-all duration-300 shadow-sm" title="Email Us">
                <Mail size={20} />
              </a>
              <a href={config.whatsappLink} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-brand-gray hover:text-brand-cyan hover:border-brand-cyan hover:bg-brand-cyan/10 transition-all duration-300 shadow-sm" title="WhatsApp">
                <MessageCircle size={20} />
              </a>
              <a href={config.instagramLink} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-brand-gray hover:text-brand-cyan hover:border-brand-cyan hover:bg-brand-cyan/10 transition-all duration-300 shadow-sm" title="Instagram">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
            <h4 className="text-white font-display font-medium tracking-[0.1em] uppercase text-xs mb-8 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-1/2 sm:after:left-0 after:-translate-x-1/2 sm:after:translate-x-0 after:w-8 after:h-px after:bg-brand-cyan/50">
              {isInternational ? 'Core Services' : 'Local Services'}
            </h4>
            <ul className="space-y-4">
              {serviceLinks.map((item) => (
                <li key={item} className="text-brand-gray text-[13px] hover:text-white transition-colors cursor-default">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
            <h4 className="text-white font-display font-medium tracking-[0.1em] uppercase text-xs mb-8 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-1/2 sm:after:left-0 after:-translate-x-1/2 sm:after:translate-x-0 after:w-8 after:h-px after:bg-brand-cyan/50">Company</h4>
            <ul className="space-y-4">
              {[
                { name: 'About Us', path: '/about' },
                { name: 'Case Studies', path: '/case-studies' },
                { name: 'Process', path: '/process' },
                { name: 'Partner Program', path: '/partner' },
                { name: 'Pricing', path: '/pricing' },
                { name: 'Blog', path: '/blog' },
                { name: 'Contact', path: '/contact' }
              ].map((link) => (
                <li key={link.name}>
                  <Link to={p(link.path)} className="text-brand-gray hover:text-brand-cyan text-[13px] transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
            <h4 className="text-white font-display font-medium tracking-[0.1em] uppercase text-xs mb-8 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-1/2 sm:after:left-0 after:-translate-x-1/2 sm:after:translate-x-0 after:w-8 after:h-px after:bg-brand-cyan/50">Global Network</h4>
            <ul className="space-y-6 text-sm text-brand-gray w-full">
              <li className="flex flex-col items-center sm:items-start">
                <span className="block text-brand-cyan/60 mb-2 text-[10px] font-mono uppercase tracking-[0.2em]">Primary Inquiries</span>
                <a href={`mailto:${config.contactEmail}`} className="text-[13px] hover:text-white transition-colors break-all border-b border-white/5 pb-1">{config.contactEmail}</a>
              </li>
              <li className="flex flex-col items-center sm:items-start">
                <span className="block text-brand-cyan/60 mb-2 text-[10px] font-mono uppercase tracking-[0.2em]">Secure WhatsApp</span>
                <a href={config.whatsappLink} className="text-[13px] hover:text-white transition-colors break-words border-b border-white/5 pb-1" target="_blank" rel="noreferrer">{config.whatsappNumber}</a>
              </li>
              <li className="flex flex-col items-center sm:items-start">
                <span className="block text-brand-cyan/60 mb-2 text-[10px] font-mono uppercase tracking-[0.2em]">Region Selection</span>
                {isAdmin ? (
                  <AdminRegionPreviewSwitcher compact />
                ) : lockedRegion ? (
                  <div
                    className="inline-flex items-center gap-2 rounded-lg border border-brand-cyan/30 bg-brand-cyan/5 px-4 py-2 text-[10px] font-mono font-bold uppercase tracking-widest text-brand-cyan"
                    title="Region locked to your account"
                  >
                    {REGION_OPTIONS.find((region) => region.id === lockedRegion)?.shortLabel ?? lockedRegion.toUpperCase()}
                    <Lock className="h-3 w-3 text-brand-cyan/80" />
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-2 w-full max-w-[280px]">
                    {REGION_OPTIONS.map((region) => (
                      <Link
                        key={region.id}
                        to={region.path}
                        onClick={() => persistRegion(region.id)}
                        className={cn(
                          "rounded-lg border py-2 text-center text-[9px] font-mono font-bold uppercase tracking-widest transition-all duration-300",
                          currentRegion === region.id 
                            ? "border-brand-cyan/40 bg-brand-cyan/5 text-brand-cyan" 
                            : "border-white/5 text-brand-gray hover:border-white/20 hover:text-white hover:bg-white/5"
                        )}
                      >
                        {region.shortLabel}
                      </Link>
                    ))}
                  </div>
                )}
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <p className="text-brand-gray/40 text-[11px] font-mono uppercase tracking-wider">
            &copy; {currentYear} Jawrah Pixel OS. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-[11px] font-mono uppercase tracking-wider text-brand-gray/40">
            <Link to={p("/privacy")} className="hover:text-brand-cyan transition-colors">Privacy</Link>
            <Link to={p("/terms")} className="hover:text-white transition-colors">Terms</Link>
            <Link to={p("/about")} className="hover:text-white transition-colors">About</Link>
          </div>
        </div>
      </Reveal>
    </footer>

  );
}

import { Link } from 'react-router-dom';
import { Instagram, MessageCircle, Mail, Lock } from 'lucide-react';
import { Logo } from './Logo';
import { useRegion } from '@/hooks/useRegion';
import { Reveal } from '@/components/ui/Reveal';
import { persistRegion } from '@/lib/region';
import { cn } from '@/lib/utils';
import { REGION_OPTIONS } from '@/data/regions';
import { useAuth } from '@/contexts/AuthContext';
import { AdminRegionPreviewSwitcher } from './AdminRegionPreviewSwitcher';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { config, p, currentRegion } = useRegion();
  const { user, profile } = useAuth();
  const isAdmin = user && (profile?.role === 'admin' || profile?.role === 'superadmin');
  
  const serviceLinks = [
    { label: 'Web Development Sri Lanka', path: '/lk/web-development-sri-lanka' },
    { label: 'Ecommerce Development Sri Lanka', path: '/lk/ecommerce-development-sri-lanka' },
    { label: 'Web Development Pakistan', path: '/pk/web-development-pakistan' },
    { label: 'Ecommerce Development Pakistan', path: '/pk/ecommerce-development-pakistan' },
    { label: 'Web Development Agency', path: '/int/web-development-agency' },
    { label: 'Custom Software Development', path: '/int/custom-software-development' },
  ];

  const resolveFooterPath = (path: string) => (/^\/(?:lk|pk|int)\//.test(path) ? path : p(path));

  return (
    <footer className="relative bg-brand-black pt-20 md:pt-32 pb-12 md:pb-16 overflow-hidden">
      {/* Premium Glass Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand-blue/5 blur-[160px] rounded-full pointer-events-none opacity-40" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 md:gap-16 lg:gap-24 mb-16 md:mb-24">
            {/* Brand Section */}
            <div className="lg:col-span-5 flex flex-col items-start">
              <Link to={p('/')} className="mb-8 md:mb-10 group inline-flex transition-transform hover:scale-[1.01] duration-700">
                <Logo variant="full" size="md" />
              </Link>
              <p className="text-zinc-500 text-base md:text-lg leading-relaxed mb-8 md:mb-10 max-w-md font-light">
                Architecting digital monopolies for ambitious brands. We engineer world-class experiences that establish unshakeable market authority.
              </p>
              
              <div className="flex flex-col gap-6 mb-10 md:mb-12">
                <div className="flex flex-col gap-2">
                  <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-[0.4em] font-bold">The Standard</p>
                  <p className="text-xs text-zinc-500 font-light">Serving Sri Lanka, Pakistan & International brands.</p>
                </div>
              </div>

              <div className="flex items-center gap-5">
                {[
                  { icon: <Mail size={16} />, href: `mailto:${config.contactEmail}`, label: 'Email' },
                  { icon: <MessageCircle size={16} />, href: config.whatsappLink, label: 'WhatsApp' },
                  { icon: <Instagram size={16} />, href: config.instagramLink, label: 'Instagram' }
                ].map((social) => (
                  <a 
                    key={social.label}
                    href={social.href}
                    target="_blank" 
                    rel="noreferrer"
                    className="w-11 h-11 rounded-none border border-white/5 bg-white/[0.01] flex items-center justify-center text-zinc-600 hover:text-brand-blue hover:border-brand-blue/30 hover:bg-brand-blue/5 transition-all duration-700 group"
                    title={social.label}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Links Sections */}
            <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8 sm:gap-10 md:gap-16">
              <div className="flex flex-col items-start">
                <h4 className="text-[9px] text-brand-blue font-bold uppercase tracking-[0.4em] mb-10">
                  Services
                </h4>
                <ul className="space-y-5">
                  {serviceLinks.slice(0, 6).map((item) => (
                    <li key={item.label}>
                      <Link to={resolveFooterPath(item.path)} className="text-zinc-500 text-[13px] font-light hover:text-white transition-colors duration-500">
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col items-start">
                <h4 className="text-[9px] text-brand-blue font-bold uppercase tracking-[0.4em] mb-10">
                  Agency
                </h4>
                <ul className="space-y-5">
                  {[
                    { label: 'About', path: '/about' },
                    { label: 'Case Studies', path: '/case-studies' },
                    { label: 'Leadership', path: '/leadership' },
                    { label: 'Process', path: '/process' },
                    { label: 'Blog', path: '/blog' },
                    { label: 'Pricing', path: '/pricing' },
                    { label: 'Contact', path: '/contact' }
                  ].map((link) => (
                    <li key={link.label}>
                      <Link to={p(link.path)} className="text-zinc-500 text-[13px] font-light hover:text-white transition-colors duration-500">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col items-start col-span-2 sm:col-span-1">
                <h4 className="text-[9px] text-brand-blue font-bold uppercase tracking-[0.4em] mb-10">
                  Legal
                </h4>
                <ul className="space-y-5">
                  {[
                    { label: 'Privacy Policy', path: '/privacy-policy' },
                    { label: 'Terms of Service', path: '/terms-and-conditions' },
                    { label: 'Refund Policy', path: '/refund-policy' }
                  ].map((link) => (
                    <li key={link.label}>
                      <Link to={p(link.path)} className="text-zinc-500 text-[13px] font-light hover:text-white transition-colors duration-500">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-10 md:pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex flex-col lg:flex-row items-center gap-8">
              <p className="text-[9px] font-mono text-zinc-700 uppercase tracking-[0.3em]">
                &copy; {currentYear} Jawrah Pixel. Engineered for excellence.
              </p>
              <div className="flex items-center gap-6">
                <span className="text-[8px] font-mono text-zinc-800 uppercase tracking-[0.4em]">Region</span>
                <div className="flex items-center gap-4">
                  {REGION_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => {
                        persistRegion(opt.id);
                        window.location.href = `/${opt.id}`;
                      }}
                      className={cn(
                        "text-[9px] font-mono uppercase tracking-[0.2em] transition-all duration-500 px-3 py-1.5 border border-white/5 rounded-none",
                        currentRegion === opt.id ? "text-brand-cyan border-brand-cyan/30 bg-brand-cyan/10 font-bold" : "text-zinc-700 hover:text-zinc-500 hover:border-white/10 hover:bg-white/[0.02]"
                      )}
                    >
                      {opt.id}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-8">
              <Link 
                to={p('/admin')} 
                className="text-zinc-800 hover:text-brand-blue transition-all duration-500 flex items-center gap-2 text-[9px] font-mono uppercase tracking-[0.3em]"
              >
                <Lock size={10} /> Portal
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
      
      {isAdmin && <AdminRegionPreviewSwitcher />}
    </footer>
  );
}

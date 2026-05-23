import { Link } from 'react-router-dom';
import { ArrowUpRight, Instagram, MessageCircle, Mail } from 'lucide-react';
import { Logo } from './Logo';
import { useRegion } from '@/hooks/useRegion';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { config, p } = useRegion();

  return (
    <footer className="bg-brand-navy border-t border-white/5 pt-16 md:pt-20 pb-10 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 lg:gap-8 mb-16">
          <div className="col-span-2 lg:col-span-1">
            <Link to={p('/')} className="flex items-center mb-6 group inline-flex">
              <Logo variant="full" size="md" />
            </Link>
            <p className="text-brand-gray text-[11px] md:text-sm leading-relaxed mb-8 max-w-sm">
              Digital elegance for ambitious brands. We craft premium websites, ecommerce platforms, and digital systems that demand attention.
            </p>
            <div className="flex items-center gap-4">
              <a href={`mailto:${config.contactEmail}`} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-brand-gray hover:text-brand-cyan hover:border-brand-cyan hover:bg-brand-cyan/10 transition-colors" title="Email Us">
                <Mail size={18} />
              </a>
              <a href={config.whatsappLink} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-brand-gray hover:text-brand-cyan hover:border-brand-cyan hover:bg-brand-cyan/10 transition-colors" title="WhatsApp">
                <MessageCircle size={18} />
              </a>
              <a href={config.instagramLink} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-brand-gray hover:text-brand-cyan hover:border-brand-cyan hover:bg-brand-cyan/10 transition-colors" title="Instagram">
                <Instagram size={18} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-display font-medium tracking-wide mb-6">Services</h4>
            <ul className="space-y-4">
              {['Web Design', 'Ecommerce Development', 'UI/UX Design', 'Branding', 'SEO Optimization', 'Admin Dashboards', 'Maintenance Plans'].map((item) => (
                <li key={item} className="text-brand-gray text-sm">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-display font-medium tracking-wide mb-6">Company</h4>
            <ul className="space-y-4">
              {[
                { name: 'About Us', path: '/about' },
                { name: 'Case Studies', path: '/case-studies' },
                { name: 'Process', path: '/process' },
                { name: 'Agent Network', path: '/agents' },
                { name: 'Pricing', path: '/pricing' },
                { name: 'Blog', path: '/blog' },
                { name: 'Contact', path: '/contact' }
              ].map((link) => (
                <li key={link.name}>
                  <Link to={p(link.path)} className="text-brand-gray hover:text-brand-cyan text-sm transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-display font-medium tracking-wide mb-6">Contact</h4>
            <ul className="space-y-4 text-sm text-brand-gray">
              <li>
                <span className="block text-white/50 mb-1 text-xs uppercase tracking-wider">Email</span>
                <a href={`mailto:${config.contactEmail}`} className="hover:text-brand-cyan transition-colors">{config.contactEmail}</a>
              </li>
              <li>
                <span className="block text-white/50 mb-1 text-xs uppercase tracking-wider">Phone / WhatsApp</span>
                <a href={config.whatsappLink} className="hover:text-brand-cyan transition-colors" target="_blank" rel="noreferrer">{config.whatsappNumber}</a>
              </li>
              <li>
                <span className="block text-white/50 mb-1 text-xs uppercase tracking-wider">Location</span>
                <span>{config.locations[0]}, {config.countryName}<br/>(Serving Worldwide)</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-brand-gray/60 text-sm">
            &copy; {currentYear} Jawrah Pixel. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-brand-gray/60">
            <Link to={p("/privacy")} className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to={p("/terms")} className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

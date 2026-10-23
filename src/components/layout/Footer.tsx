import { Link } from 'react-router-dom';
import { Instagram, MessageCircle, Mail, Lock, Linkedin } from 'lucide-react';
import { Logo } from './Logo';
import { useRegion } from '@/hooks/useRegion';
import { useTheme } from '@/contexts/ThemeContext';
import { Reveal } from '@/components/ui/Reveal';
import { persistRegion } from '@/lib/region';
import { cn } from '@/lib/utils';
import { REGION_OPTIONS } from '@/data/regions';
import { useAuth } from '@/contexts/AuthContext';
import { AdminRegionPreviewSwitcher } from './AdminRegionPreviewSwitcher';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { config, p, currentRegion } = useRegion();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { user, profile } = useAuth();
  const isAdmin = user && (profile?.role === 'admin' || profile?.role === 'superadmin');
  
  const serviceLinks = [
    { label: 'Web Development Sri Lanka', path: '/lk/web-development-sri-lanka' },
    { label: 'Ecommerce Development Sri Lanka', path: '/lk/ecommerce-development-sri-lanka' },
    { label: 'Web Development Pakistan', path: '/pk/web-development-pakistan' },
    { label: 'Ecommerce Development Pakistan', path: '/pk/ecommerce-development-pakistan' },
    { label: 'Web Development UK', path: '/uk/web-development-uk' },
    { label: 'SEO Services UK', path: '/uk/services/seo-services-uk' },
    { label: 'Web Development Agency', path: '/int/web-development-agency' },
    { label: 'Custom Software Development', path: '/int/custom-software-development' },
  ];

  const resolveFooterPath = (path: string) => (/^\/(?:lk|pk|int|uk)\//.test(path) ? path : p(path));

  return (
    <footer 
      className="relative pt-12 sm:pt-16 md:pt-20 pb-8 md:pb-10 overflow-hidden"
      style={{
        backgroundColor: isDark ? '#000000' : '#ffffff',
        backgroundImage: 'none',
      }}
    >
      {/* Minimal studio-style accent line */}
      {!isDark && <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 z-0 h-px" style={{ background: 'rgba(15,23,42,0.10)' }} />}

      <div className="container mx-auto px-5 sm:px-6 relative z-10 max-w-[1440px]">
        <Reveal>
          <div className="mb-10 grid grid-cols-1 gap-9 sm:gap-10 md:mb-16 md:grid-cols-2 md:gap-14 lg:grid-cols-12 lg:gap-20">
            {/* Brand Section */}
            <div className="lg:col-span-5 flex flex-col items-start">
              <Link to={p('/')} className="mb-6 md:mb-7 group inline-flex items-center transition-transform hover:scale-[1.01] duration-500">
                <div className="flex items-center">
                  <Logo asset="logo-navbar" variant="full" size="2xl" />
                </div>
              </Link>
              <p 
                className="text-[15px] md:text-base leading-[1.9] mb-8 md:mb-10 max-w-md font-normal"
                style={{
                  color: isDark ? 'rgb(161,161,170)' : 'rgb(100,116,139)'
                }}
              >
                Architecting digital monopolies for ambitious brands. We engineer world-class experiences that establish unshakeable market authority.
              </p>
              
              <div className="flex flex-col gap-6 mb-10 md:mb-12">
                <div className="flex flex-col gap-2">
                  <p 
                    className="text-[9px] font-mono uppercase tracking-[0.4em] font-bold"
                    style={{
                      color: isDark ? 'rgb(82,82,91)' : 'rgb(156,163,175)'
                    }}
                  >
                    The Standard
                  </p>
                  <p 
                    className="text-xs font-light"
                    style={{
                      color: isDark ? 'rgb(161,161,170)' : 'rgb(100,116,139)'
                    }}
                  >
                    Serving Sri Lanka, Pakistan, UK/EU & International brands.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                {[
                  { icon: <Mail size={16} />, href: `mailto:${config.contactEmail}`, label: 'Email' },
                  { icon: <MessageCircle size={16} />, href: config.whatsappLink, label: 'WhatsApp' },
                  { icon: <Instagram size={16} />, href: config.instagramLink, label: 'Instagram' },
                  { icon: <Linkedin size={16} />, href: config.linkedinFounderLink, label: 'LinkedIn' }
                ].map((social) => (
                  <a 
                    key={social.label}
                    href={social.href}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-300 group hover:-translate-y-0.5"
                    style={{
                      borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(15,23,42,0.08)',
                      background: isDark ? 'rgba(255,255,255,0.01)' : 'rgba(255,255,255,0.72)',
                      color: isDark ? 'rgb(82,82,91)' : 'rgb(156,163,175)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = isDark ? 'rgb(59,130,246)' : 'rgb(16,185,129)';
                      e.currentTarget.style.borderColor = isDark ? 'rgba(59,130,246,0.3)' : 'rgba(16,185,129,0.3)';
                      e.currentTarget.style.background = isDark ? 'rgba(59,130,246,0.05)' : 'rgba(16,185,129,0.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = isDark ? 'rgb(82,82,91)' : 'rgb(156,163,175)';
                      e.currentTarget.style.borderColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(15,23,42,0.08)';
                      e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.01)' : 'rgba(255,255,255,0.72)';
                    }}
                    title={social.label}
                    aria-label={social.label}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Links Sections */}
            <div className="grid grid-cols-2 gap-x-5 gap-y-9 sm:grid-cols-3 sm:gap-10 md:gap-12 lg:col-span-7 lg:gap-16">
              <div className="flex flex-col items-start">
                <h4 
                  className="text-[9px] font-bold uppercase tracking-[0.28em] mb-6"
                  style={{
                    color: isDark ? 'rgb(59,130,246)' : 'rgb(16,185,129)'
                  }}
                >
                  Services
                </h4>
                <ul className="space-y-3.5">
                  {serviceLinks.slice(0, 6).map((item) => (
                    <li key={item.label}>
                      <Link 
                        to={resolveFooterPath(item.path)} 
                        className="text-[13px] font-light transition-colors duration-300 hover:translate-x-0.5 inline-block"
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
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col items-start">
                <h4 
                  className="text-[9px] font-bold uppercase tracking-[0.4em] mb-10"
                  style={{
                    color: isDark ? 'rgb(59,130,246)' : 'rgb(16,185,129)'
                  }}
                >
                  Agency
                </h4>
                <ul className="space-y-3.5">
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
                      <Link 
                        to={p(link.path)} 
                        className="text-[13px] font-light transition-colors duration-500"
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
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="col-span-2 flex flex-col items-start sm:col-span-1">
                <h4 
                  className="text-[9px] font-bold uppercase tracking-[0.4em] mb-10"
                  style={{
                    color: isDark ? 'rgb(59,130,246)' : 'rgb(16,185,129)'
                  }}
                >
                  Legal
                </h4>
                <ul className="space-y-3.5">
                  {[
                    { label: 'Privacy Policy', path: '/privacy-policy' },
                    { label: 'Terms of Service', path: '/terms-and-conditions' },
                    { label: 'Refund Policy', path: '/refund-policy' }
                  ].map((link) => (
                    <li key={link.label}>
                      <Link 
                        to={p(link.path)} 
                        className="text-[13px] font-light transition-colors duration-500"
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
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div 
            className="flex flex-col items-center justify-between gap-6 border-t pt-7 sm:pt-10 md:flex-row md:gap-8 md:pt-12"
            style={{
              borderTopColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(15,23,42,0.08)'
            }}
          >
            <div className="flex w-full flex-col items-center gap-5 text-center sm:gap-6 lg:flex-row lg:items-center lg:text-left">
              <p 
                className="text-[9px] font-mono uppercase tracking-[0.2em]"
                style={{
                  color: isDark ? 'rgb(63,63,70)' : 'rgb(156,163,175)'
                }}
              >
                &copy; {currentYear} Jawrah Pixel. Engineered for excellence.
              </p>
              <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-6">
                <span 
                  className="text-[8px] font-mono uppercase tracking-[0.25em]"
                  style={{
                    color: isDark ? 'rgb(39,39,42)' : 'rgb(156,163,175)'
                  }}
                >
                  Region
                </span>
                <div className="flex items-center justify-center gap-2.5 sm:gap-4">
                  {REGION_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => {
                        persistRegion(opt.id);
                        window.location.href = `/${opt.id}`;
                      }}
                      className="text-[9px] font-mono uppercase tracking-[0.15em] transition-all duration-300 px-3 py-1.5 border rounded-full"
                      style={{
                        borderColor: currentRegion === opt.id 
                          ? (isDark ? 'rgba(6,182,212,0.3)' : 'rgba(16,185,129,0.3)') 
                          : (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(15,23,42,0.08)'),
                        background: currentRegion === opt.id 
                          ? (isDark ? 'rgba(6,182,212,0.1)' : 'rgba(16,185,129,0.1)') 
                          : 'transparent',
                        color: currentRegion === opt.id 
                          ? (isDark ? 'rgb(6,182,212)' : 'rgb(16,185,129)') 
                          : (isDark ? 'rgb(63,63,70)' : 'rgb(100,116,139)'),
                        fontWeight: currentRegion === opt.id ? 'bold' : 'normal'
                      }}
                      onMouseEnter={(e) => {
                        if (currentRegion !== opt.id) {
                          e.currentTarget.style.color = isDark ? 'rgb(161,161,170)' : 'rgb(15,23,42)';
                          e.currentTarget.style.borderColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(15,23,42,0.1)';
                          e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.02)' : 'rgba(15,23,42,0.02)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (currentRegion !== opt.id) {
                          e.currentTarget.style.color = isDark ? 'rgb(63,63,70)' : 'rgb(100,116,139)';
                          e.currentTarget.style.borderColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(15,23,42,0.08)';
                          e.currentTarget.style.background = 'transparent';
                        }
                      }}
                    >
                      {opt.shortLabel}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-5 sm:gap-8">
              <Link 
                to={p('/admin')} 
                className="transition-all duration-500 flex items-center gap-2 text-[9px] font-mono uppercase tracking-[0.3em]"
                style={{
                  color: isDark ? 'rgb(39,39,42)' : 'rgb(156,163,175)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = isDark ? 'rgb(59,130,246)' : 'rgb(16,185,129)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = isDark ? 'rgb(39,39,42)' : 'rgb(156,163,175)';
                }}
              >
                <Lock size={10} /> Portal
              </Link>
            </div>
          </div>

          {/* Oversized closing wordmark — Scrolltide Portfolio Close-inspired */}
          <Link
            to={p('/')}
            aria-label="Jawrah Pixel home"
            className="group mt-10 block w-full overflow-hidden border-t pt-5 sm:mt-14 sm:pt-7 md:mt-16"
            style={{ borderTopColor: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(15,23,42,0.10)' }}
          >
            <span
              aria-hidden="true"
              className="block whitespace-nowrap text-center font-black uppercase leading-[0.72] tracking-[-0.085em] transition-transform duration-700 ease-out group-hover:scale-[1.015]"
              style={{
                fontSize: 'clamp(3rem, 14.4vw, 13.5rem)',
                color: isDark ? 'rgba(255,255,255,0.96)' : '#090a0c',
                marginLeft: '-0.035em',
                marginRight: '-0.035em',
              }}
            >
              JAWRAH PIXEL
            </span>
            <span className="sr-only">Jawrah Pixel — digital experiences engineered for excellence.</span>
          </Link>
        </Reveal>
      </div>
      
      {isAdmin && <AdminRegionPreviewSwitcher />}
    </footer>
  );
}

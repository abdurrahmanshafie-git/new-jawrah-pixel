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
      className="relative pt-20 md:pt-32 pb-12 md:pb-16 overflow-hidden"
      style={{
        background: isDark ? 'rgb(0,0,0)' : 'rgb(250,250,248)'
      }}
    >
      {/* Premium Glass Background */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-blue/20 to-transparent" 
        />
        <div 
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] blur-[160px] rounded-full pointer-events-none opacity-40" 
          style={{
            background: isDark ? 'rgba(59,130,246,0.05)' : 'rgba(16,185,129,0.05)'
          }}
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 md:gap-16 lg:gap-24 mb-16 md:mb-24">
            {/* Brand Section */}
            <div className="lg:col-span-5 flex flex-col items-start">
              <Link to={p('/')} className="mb-8 md:mb-10 group inline-flex items-center transition-transform hover:scale-[1.01] duration-700">
                <div className="flex items-center">
                  <Logo asset="logo-navbar" variant="full" size="2xl" />
                </div>
              </Link>
              <p 
                className="text-base md:text-lg leading-relaxed mb-8 md:mb-10 max-w-md font-light"
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

              <div className="flex items-center gap-5">
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
                    className="w-11 h-11 rounded-none border flex items-center justify-center transition-all duration-700 group"
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
            <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8 sm:gap-10 md:gap-16">
              <div className="flex flex-col items-start">
                <h4 
                  className="text-[9px] font-bold uppercase tracking-[0.4em] mb-10"
                  style={{
                    color: isDark ? 'rgb(59,130,246)' : 'rgb(16,185,129)'
                  }}
                >
                  Services
                </h4>
                <ul className="space-y-5">
                  {serviceLinks.slice(0, 6).map((item) => (
                    <li key={item.label}>
                      <Link 
                        to={resolveFooterPath(item.path)} 
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
                <ul className="space-y-5">
                  {[
                    { label: 'About', path: '/about' },
                    { label: 'Case Studies', path: '/case-studies' },
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

              <div className="flex flex-col items-start col-span-2 sm:col-span-1">
                <h4 
                  className="text-[9px] font-bold uppercase tracking-[0.4em] mb-10"
                  style={{
                    color: isDark ? 'rgb(59,130,246)' : 'rgb(16,185,129)'
                  }}
                >
                  Legal
                </h4>
                <ul className="space-y-5">
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
            className="pt-10 md:pt-12 border-t flex flex-col md:flex-row justify-between items-center gap-8"
            style={{
              borderTopColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(15,23,42,0.08)'
            }}
          >
            <div className="flex flex-col lg:flex-row items-center gap-8">
              <p 
                className="text-[9px] font-mono uppercase tracking-[0.3em]"
                style={{
                  color: isDark ? 'rgb(63,63,70)' : 'rgb(156,163,175)'
                }}
              >
                &copy; {currentYear} Jawrah Pixel. Engineered for excellence.
              </p>
              <div className="flex items-center gap-6">
                <span 
                  className="text-[8px] font-mono uppercase tracking-[0.4em]"
                  style={{
                    color: isDark ? 'rgb(39,39,42)' : 'rgb(156,163,175)'
                  }}
                >
                  Region
                </span>
                <div className="flex items-center gap-4">
                  {REGION_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => {
                        persistRegion(opt.id);
                        window.location.href = `/${opt.id}`;
                      }}
                      className="text-[9px] font-mono uppercase tracking-[0.2em] transition-all duration-500 px-3 py-1.5 border rounded-none"
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
            
            <div className="flex items-center gap-8">
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
        </Reveal>
      </div>
      
      {isAdmin && <AdminRegionPreviewSwitcher />}
    </footer>
  );
}

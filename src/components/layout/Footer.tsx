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

      <style>{`
        @keyframes jp-type { 0%, 38% { transform: translateY(0) rotate(0deg); } 44%, 58% { transform: translateY(3px) rotate(-2deg); } 64%, 100% { transform: translateY(0) rotate(0deg); } }
        @keyframes jp-sleep { 0%, 56%, 100% { opacity: 0; transform: translateY(5px) scale(.8); } 62%, 82% { opacity: 1; transform: translateY(0) scale(1); } 90% { opacity: 0; transform: translateY(-4px) scale(1.08); } }
        @keyframes jp-screen { 0%, 36%, 64%, 100% { opacity: .35; } 42%, 58% { opacity: 1; } }
        @keyframes jp-breathe { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-3px); } }
        .jp-footer-scene { isolation:isolate; position:relative; overflow:hidden; border-radius:28px; min-height:250px; margin-bottom:44px; background:linear-gradient(145deg,#e9e1d3 0%,#d7cbbb 58%,#bdb5aa 100%); color:#26221f; }
        .jp-footer-character { animation:jp-breathe 4s ease-in-out infinite; transform-origin:bottom center; }
        .jp-footer-typing { animation:jp-type 7s ease-in-out infinite; transform-origin:center; }
        .jp-footer-z { animation:jp-sleep 7s ease-in-out infinite; transform-origin:center; }
        .jp-footer-screen { animation:jp-screen 7s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) { .jp-footer-character,.jp-footer-typing,.jp-footer-z,.jp-footer-screen { animation:none !important; } }
      `}</style>
      <div className="container mx-auto px-5 sm:px-6 relative z-10 max-w-[1440px]">
        <div className="jp-footer-scene grid grid-cols-1 md:grid-cols-[1fr_1fr] items-center px-6 sm:px-10 md:px-14 py-8 md:py-10">
          <div className="relative z-10 max-w-md">
            <span className="inline-flex rounded-full border border-black/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-[.18em] mb-5">A little less ordinary</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-[-.055em] leading-[1.05]">We build while the world <span className="italic font-normal">takes a breather.</span></h2>
            <p className="mt-4 max-w-sm text-sm sm:text-base leading-relaxed text-black/60">Thoughtful digital experiences, crafted with care — even when our little studio bot needs a nap.</p>
          </div>
          <div className="relative flex items-center justify-center min-h-[210px] md:min-h-[260px]" aria-label="Animated studio character alternates between typing and sleeping" role="img">
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[82%] h-5 rounded-[50%] bg-black/10 blur-xl" />
            <svg viewBox="0 0 360 260" className="relative z-10 w-full max-w-[390px] h-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="183" cy="224" rx="117" ry="13" fill="#786D60" opacity=".18"/>
              <g className="jp-footer-character">
                <path d="M94 194c-8-34 8-64 42-75 34-11 82-2 101 26 18 27 6 61-18 74H126c-16-4-27-12-32-25Z" fill="#64748B"/>
                <path d="M113 177c-15-18-35-16-46-3-12 15 2 38 26 42l35-4" fill="#526477"/>
                <path d="M132 190c-5 17-1 28 14 31h26l8-17-19-16" fill="#D7C5A5"/>
                <path d="M194 190c1 17 12 29 28 31l22-5-5-17-21-16" fill="#D7C5A5"/>
                <path d="M148 214l-7 11 31 3 10-8-8-7" fill="#B48A42"/>
                <path d="M218 213l-1 12 30-2 5-8-10-7" fill="#B48A42"/>
                <g className="jp-footer-typing">
                  <rect x="128" y="82" width="80" height="83" rx="25" fill="#D6A640"/>
                  <rect x="138" y="91" width="60" height="65" rx="18" fill="#F0C35C"/>
                  <rect x="148" y="118" width="8" height="13" rx="4" fill="#29251F"/>
                  <rect x="180" y="118" width="8" height="13" rx="4" fill="#29251F"/>
                  <path d="M156 141c7 5 15 5 22 0" stroke="#29251F" strokeWidth="3" strokeLinecap="round"/>
                  <path d="M125 106c-17-7-20-28-6-40 12-11 30-7 36 6" stroke="#40566B" strokeWidth="12" strokeLinecap="round"/>
                  <path d="M205 107c17-7 20-28 6-40-12-11-30-7-36 6" stroke="#40566B" strokeWidth="12" strokeLinecap="round"/>
                  <rect x="113" y="65" width="23" height="29" rx="10" fill="#526477"/>
                  <rect x="198" y="65" width="23" height="29" rx="10" fill="#526477"/>
                  <path d="M183 164l37 18" stroke="#64748B" strokeWidth="16" strokeLinecap="round"/>
                  <path d="M147 165l-25 19" stroke="#64748B" strokeWidth="16" strokeLinecap="round"/>
                </g>
                <g>
                  <path d="M174 176h91l-15 44h-91l15-44Z" fill="#777B7D"/>
                  <path d="M174 176h91l-15 44h-91l15-44Z" fill="#C5C7C5"/>
                  <path d="M181 181h76l-12 33h-76l12-33Z" fill="#69757D"/>
                  <path className="jp-footer-screen" d="M190 190h48M187 197h37M185 204h42" stroke="#C5D4D9" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M158 221h92l10 5h-107l5-5Z" fill="#8B8D8B"/>
                </g>
              </g>
              <g className="jp-footer-z" fill="#61564A" fontFamily="Georgia,serif" fontWeight="700">
                <text x="240" y="72" fontSize="25">Z</text><text x="265" y="49" fontSize="19">z</text><text x="284" y="30" fontSize="14">z</text>
              </g>
              <path d="M72 72c-8-7-4-19 6-20 7-1 11 5 10 11-1 7-8 12-16 9Z" fill="#A5A58A" opacity=".65"/>
              <path d="M61 91c-5-5-2-13 5-13 5 0 8 4 7 8-1 5-6 8-12 5Z" fill="#A5A58A" opacity=".45"/>
            </svg>
            <span className="absolute bottom-1 right-2 sm:right-5 text-[9px] uppercase tracking-[.18em] text-black/35">currently: coding / recharging</span>
          </div>
        </div>
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
        </Reveal>
      </div>
      
      {isAdmin && <AdminRegionPreviewSwitcher />}
    </footer>
  );
}

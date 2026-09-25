import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useRegion } from '@/hooks/useRegion';
import { Reveal } from '@/components/ui/Reveal';

export interface SelectedProject {
  id: string;
  slug: string;
  title: string;
  category: string;
  description: string;
  image: string;
  liveUrl?: string;
  year: string;
  status: 'LIVE' | 'COMPLETED' | 'ATELIER';
  domainLabel: string;
}

const SELECTED_PROJECTS: SelectedProject[] = [
  {
    id: 'zenvor',
    slug: 'zenvor',
    title: 'ZENVOR',
    category: 'E-Commerce Experience',
    description: 'A modern digital commerce experience designed and developed for a premium streetwear brand.',
    image: '/assets/case-studies/zenvor/desktop.png',
    liveUrl: 'https://zenvor.lk',
    year: '2026',
    status: 'LIVE',
    domainLabel: 'zenvor.lk',
  },
  {
    id: 'elite-education',
    slug: 'elite-education',
    title: 'Elite Education',
    category: 'Education Platform',
    description: 'A focused digital experience clarifying international study pathways and student visa onboarding.',
    image: '/assets/case-studies/elite education/desktop.png',
    liveUrl: 'https://www.eliteeducation.lk/',
    year: '2026',
    status: 'LIVE',
    domainLabel: 'eliteeducation.lk',
  },
  {
    id: 'rankala-gold',
    slug: 'rankala-gold',
    title: 'Rankala Gold',
    category: 'Custom Operations Platform',
    description: 'A connected digital operations platform engineering factory floor manufacturing, gold accounting, ready stock, and B2B sales.',
    image: '/assets/case-studies/rankala/desktop.jpeg',
    liveUrl: 'https://rankala.lk',
    year: '2026',
    status: 'LIVE',
    domainLabel: 'rankala.lk',
  },
  {
    id: 'amirah-jewellery',
    slug: 'amirah-jewellery',
    title: 'Amirah High Jewellery',
    category: 'Luxury Brand Atelier',
    description: 'A sovereign digital atelier showcasing unheated Ceylon sapphires and bespoke client appointments.',
    image: '/assets/case-studies/amirah jewellers/dektop.png',
    liveUrl: 'https://amira-preview-jawrah-pixel.netlify.app/',
    year: '2026',
    status: 'LIVE',
    domainLabel: 'amirahjewellery.com',
  },
  {
    id: 'velora-estates',
    slug: 'velora-estates',
    title: 'Velora Estates',
    category: 'Real Estate Platform',
    description: 'An architectural property acquisition portal engineered for high-net-worth real estate buyers.',
    image: '/assets/case-studies/velora/desktop.png',
    liveUrl: 'https://real-estate-jawrah-project.netlify.app/',
    year: '2026',
    status: 'LIVE',
    domainLabel: 'veloraestates.com',
  },
  {
    id: 'shabnam-jewellers',
    slug: 'shabnam-jewellers',
    title: 'Shabnam Jewellers',
    category: 'Bespoke Commerce',
    description: 'A heritage jewellery storefront shaped around appraisal clarity and mobile-first catalog discovery.',
    image: '/assets/case-studies/shabnam-jewellers/desktop.png',
    liveUrl: 'https://shabnam-tau.vercel.app/',
    year: '2026',
    status: 'LIVE',
    domainLabel: 'shabnamjewellers.com',
  },
  {
    id: 'jawrah-pixel',
    slug: 'jawrah-pixel',
    title: 'Jawrah Pixel OS',
    category: 'Internal Operations & CRM',
    description: 'A secure agency operating layer for proposals, client workspaces, and delivery governance.',
    image: '/assets/case-studies/jawrah-pixel/desktop.png',
    liveUrl: 'https://jawrah-pixel-itpe.vercel.app/',
    year: '2026',
    status: 'LIVE',
    domainLabel: 'jawrahpixel.online',
  },
  {
    id: 'the-famous',
    slug: 'the-famous',
    title: 'The Famous Clothing',
    category: 'Fashion & E-Commerce',
    description: 'A high-conversion fashion storefront showcasing seasonal collections with localized checkout flows.',
    image: '/assets/case-studies/the famous/desktop.png',
    liveUrl: 'https://the-famous-demo.netlify.app/',
    year: '2026',
    status: 'LIVE',
    domainLabel: 'thefamous.lk',
  },
  {
    id: 'aerovista-travels',
    slug: 'aerovista-travels',
    title: 'AeroVista Travels',
    category: 'Travel & Booking Engine',
    description: 'A bespoke travel booking system moving visitors from inspiration to structured itinerary reservations.',
    image: '/assets/case-studies/aero-vista/desktop.png',
    liveUrl: 'https://aero-vista-jawrah-project.vercel.app/#home',
    year: '2026',
    status: 'LIVE',
    domainLabel: 'aerovistatravels.com',
  },
];

// Duplicate for an unbroken, infinite loop
const INFINITE_LOOP_PROJECTS = [...SELECTED_PROJECTS, ...SELECTED_PROJECTS];

export function SelectedWorkSection() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { currentRegion } = useRegion();

  const caseStudyPath = (slug: string) => `/${currentRegion}/case-studies/${slug}`;
  const allWorkPath = `/${currentRegion}/case-studies`;

  return (
    <section
      id="selected-work"
      aria-label="Selected Work by Jawrah Pixel"
      className="relative border-t py-24 md:py-32 lg:py-36 theme-bg overflow-hidden transition-colors duration-300 select-none"
      style={{
        borderColor: isDark ? 'rgba(255, 255, 255, 0.07)' : 'rgba(15, 23, 42, 0.08)',
      }}
    >
      {/* Background Subtle Grid Texture */}
      <div className="absolute inset-0 premium-grid-overlay opacity-10 pointer-events-none" />

      {/* Section Header */}
      <div className="container relative z-10 mx-auto px-5 sm:px-8 max-w-7xl mb-12 md:mb-16">
        <div className="max-w-2xl">
          <Reveal>
            <div className="inline-flex items-center gap-2.5 mb-4">
              <span className="h-2 w-2 rounded-full bg-brand-cyan animate-pulse" />
              <span className="text-[10px] font-mono font-bold tracking-[0.35em] uppercase text-brand-cyan">
                Selected Work
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-medium tracking-tight theme-text-primary leading-[1.08] uppercase">
              Digital Experiences <br />
              <span className="italic font-light opacity-90">Built To Perform.</span>
            </h2>
            <p className="mt-4 text-sm sm:text-base md:text-lg theme-text-muted font-light leading-relaxed max-w-xl">
              An infinite auto-moving showcase of websites, e-commerce platforms, and custom digital systems crafted by Jawrah Pixel.
            </p>
          </Reveal>
        </div>
      </div>

      {/* CONTINUOUS INFINITE LOOP MARQUEE CONTAINER */}
      <div
        className="project-marquee-container relative w-full overflow-hidden py-4"
      >
        {/* Soft edge gradient fades */}
        <div
          className="absolute left-0 top-0 bottom-0 w-12 sm:w-24 z-20 pointer-events-none"
          style={{
            background: isDark
              ? 'linear-gradient(to right, #000000, transparent)'
              : 'linear-gradient(to right, #FFFFFF, transparent)',
          }}
        />
        <div
          className="absolute right-0 top-0 bottom-0 w-12 sm:w-24 z-20 pointer-events-none"
          style={{
            background: isDark
              ? 'linear-gradient(to left, #000000, transparent)'
              : 'linear-gradient(to left, #FFFFFF, transparent)',
          }}
        />

        {/* The Seamless Looping Track */}
        <div className="project-marquee-track flex gap-6 sm:gap-8 px-4">
          {INFINITE_LOOP_PROJECTS.map((project, idx) => (
            <article
              key={`${project.id}-loop-${idx}`}
              className="group relative w-[320px] sm:w-[460px] md:w-[540px] lg:w-[580px] flex-shrink-0 rounded-2xl md:rounded-3xl border overflow-hidden theme-card transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
              style={{
                borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.09)',
                backgroundColor: isDark ? '#090D14' : '#FAFAFC',
              }}
            >
              {/* Browser Header Bezel */}
              <div
                className="flex items-center justify-between px-4 sm:px-5 py-3 border-b select-none"
                style={{
                  borderColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(15, 23, 42, 0.05)',
                  backgroundColor: isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(15, 23, 42, 0.02)',
                }}
              >
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-white/20" />
                  <span className="w-2 h-2 rounded-full bg-white/20" />
                  <span className="w-2 h-2 rounded-full bg-white/20" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono tracking-wider text-brand-gray/70 uppercase">
                    {project.domainLabel}
                  </span>
                </div>
                <span className="inline-flex items-center gap-1 text-[9px] font-mono font-bold text-emerald-400 uppercase tracking-wider">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live
                </span>
              </div>

              {/* Screenshot Visual Preview */}
              <Link
                to={caseStudyPath(project.slug)}
                className="block relative aspect-[16/10] overflow-hidden bg-black/10"
              >
                <img
                  src={project.image}
                  alt={`${project.title} — ${project.category}`}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover object-top transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
                />
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: isDark
                      ? 'linear-gradient(to top, rgba(9,13,20,0.85), transparent 60%)'
                      : 'linear-gradient(to top, rgba(250,250,252,0.85), transparent 60%)',
                  }}
                />
              </Link>

              {/* Card Meta & Editorial Summary */}
              <div className="p-6 sm:p-7 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span className="text-[10px] font-mono font-bold tracking-[0.22em] uppercase text-brand-cyan">
                      {project.category}
                    </span>
                    <span className="font-mono text-xs text-brand-gray/60 tracking-wider">
                      {project.year}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-display font-medium uppercase tracking-tight theme-text-primary mb-2 group-hover:text-brand-cyan transition-colors duration-300">
                    {project.title}
                  </h3>

                  <p className="text-xs sm:text-sm theme-text-muted font-light leading-relaxed mb-6 line-clamp-2">
                    {project.description}
                  </p>
                </div>

                {/* Actions: View Case Study & Visit Live */}
                <div
                  className="flex items-center justify-between gap-3 pt-4 border-t"
                  style={{
                    borderColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(15, 23, 42, 0.06)',
                  }}
                >
                  <Link
                    to={caseStudyPath(project.slug)}
                    className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-brand-blue font-semibold group/btn hover:text-brand-cyan transition-colors"
                  >
                    <span>View Case Study</span>
                    <ArrowRight size={13} className="transition-transform duration-300 group-hover/btn:translate-x-1" />
                  </Link>

                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[10px] font-mono uppercase tracking-wider theme-text-secondary hover:theme-text-primary hover:border-brand-cyan/40 transition-colors"
                      style={{
                        borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.1)',
                      }}
                    >
                      <span>Visit Live</span>
                      <ArrowUpRight size={11} className="opacity-70" />
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Bottom CTA Bar */}
      <div className="container relative z-10 mx-auto px-5 sm:px-8 max-w-7xl mt-12 md:mt-16">
        <Reveal
          className="flex flex-col sm:flex-row items-center justify-between gap-6 p-8 sm:p-10 rounded-2xl md:rounded-3xl border theme-card"
          style={{
            borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.08)',
            backgroundColor: isDark ? '#090D14' : '#FAFAFC',
          }}
        >
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-brand-cyan block mb-1">
              Complete Portfolio
            </span>
            <h4 className="text-xl sm:text-2xl font-display font-medium uppercase tracking-tight theme-text-primary">
              Explore our full catalog of case studies & verified systems.
            </h4>
          </div>

          <Link
            to={allWorkPath}
            className="inline-flex items-center gap-3 px-7 py-3.5 rounded-xl border border-brand-blue/30 bg-brand-blue/10 hover:bg-brand-blue/20 text-brand-blue hover:text-brand-cyan text-xs font-mono uppercase tracking-widest font-semibold transition-all duration-300 group shrink-0"
          >
            <span>Explore All Work</span>
            <ArrowRight size={13} className="transition-transform duration-300 group-hover:translate-x-1.5" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

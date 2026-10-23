import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ArrowUpRight, ExternalLink } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
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

const statusLabels: Record<SelectedProject['status'], string> = {
  LIVE: 'Live',
  COMPLETED: 'Completed',
  ATELIER: 'Atelier',
};

export function SelectedWorkSection() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { currentRegion } = useRegion();
  const prefersReducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const activeCardRef = useRef<HTMLElement | null>(null);

  const caseStudyPath = (slug: string) => `/${currentRegion}/case-studies/${slug}`;
  const allWorkPath = `/${currentRegion}/case-studies`;
  const activeProject = SELECTED_PROJECTS[activeIndex];

  useEffect(() => {
    activeCardRef.current?.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
      block: 'nearest',
      inline: 'nearest',
    });
  }, [activeIndex, prefersReducedMotion]);

  const moveSelection = (direction: -1 | 1) => {
    setActiveIndex((current) => (current + direction + SELECTED_PROJECTS.length) % SELECTED_PROJECTS.length);
  };

  return (
    <section
      id="selected-work"
      aria-label="Selected Work by Jawrah Pixel"
      className="relative overflow-hidden border-t py-20 sm:py-24 md:py-32 lg:py-36 theme-bg transition-colors duration-300"
      style={{
        borderColor: isDark ? 'rgba(255, 255, 255, 0.07)' : 'rgba(15, 23, 42, 0.08)',
      }}
    >
      <div className="absolute inset-0 premium-grid-overlay opacity-10 pointer-events-none" />

      <div className="container relative z-10 mx-auto mb-9 max-w-7xl px-5 sm:mb-14 sm:px-8">
        <div className="flex flex-col justify-between gap-7 md:flex-row md:items-end">
          <div className="max-w-3xl">
            <Reveal>
              <div className="mb-4 inline-flex items-center gap-2.5">
                <span className="h-2 w-2 rounded-full bg-brand-cyan animate-pulse" />
                <span className="text-[10px] font-mono font-bold uppercase tracking-[0.35em] text-brand-cyan">
                  Selected Work / 2026
                </span>
              </div>
              <h2 className="text-3xl font-display font-medium uppercase leading-[1.08] tracking-tight theme-text-primary sm:text-4xl md:text-5xl lg:text-6xl">
                Digital Experiences
                <br />
                <span className="font-light italic opacity-90">Built To Perform.</span>
              </h2>
              <p className="mt-4 max-w-xl text-sm font-light leading-relaxed theme-text-muted sm:text-base md:text-lg">
                An evolving collection of websites, commerce experiences, and custom digital systems crafted by Jawrah Pixel.
              </p>
            </Reveal>
          </div>

          <div className="flex items-center justify-between gap-5 md:justify-end">
            <div className="min-w-[100px]">
              <span className="block text-[10px] font-mono uppercase tracking-[0.24em] theme-text-muted">Spotlight</span>
              <span className="mt-1 block text-sm font-medium theme-text-primary">
                <span className="font-mono text-brand-cyan">{String(activeIndex + 1).padStart(2, '0')}</span>
                <span className="mx-2 opacity-40">/</span>
                <span className="opacity-60">{String(SELECTED_PROJECTS.length).padStart(2, '0')}</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => moveSelection(-1)}
                aria-label="Previous featured project"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border transition-colors hover:border-brand-cyan/50 hover:text-brand-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan"
                style={{ borderColor: isDark ? 'rgba(255,255,255,0.14)' : 'rgba(15,23,42,0.14)' }}
              >
                <ArrowLeft size={16} />
              </button>
              <button
                type="button"
                onClick={() => moveSelection(1)}
                aria-label="Next featured project"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border transition-colors hover:border-brand-cyan/50 hover:text-brand-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan"
                style={{ borderColor: isDark ? 'rgba(255,255,255,0.14)' : 'rgba(15,23,42,0.14)' }}
              >
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className="relative w-full overflow-x-auto overflow-y-hidden px-5 pb-4 scrollbar-hide sm:px-8 lg:px-10"
        aria-label="Project spotlight carousel. Select a project to expand its details."
      >
        <div className="mx-auto flex min-h-[440px] w-max max-w-none items-stretch gap-2.5 sm:min-h-[500px] sm:gap-3 lg:min-h-[550px]">
          {SELECTED_PROJECTS.map((project, index) => {
            const isActive = index === activeIndex;

            return (
              <motion.article
                key={project.id}
                layout
                ref={isActive ? activeCardRef : undefined}
                initial={false}
                animate={{ width: isActive ? 'min(78vw, 720px)' : 'clamp(68px, 7.5vw, 104px)' }}
                transition={prefersReducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 180, damping: 26, mass: 0.9 }}
                className="group relative h-[440px] shrink-0 overflow-hidden rounded-[22px] border sm:h-[500px] sm:rounded-[28px] lg:h-[550px]"
                style={{
                  borderColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(15,23,42,0.12)',
                  backgroundColor: isDark ? '#090D14' : '#F1F3F5',
                  flexShrink: 0,
                }}
                aria-label={`${project.title}: ${project.category}`}
              >
                <img
                  src={project.image}
                  alt={`${project.title} website preview`}
                  loading={index < 2 ? 'eager' : 'lazy'}
                  decoding="async"
                  draggable={false}
                  className={`absolute inset-0 h-full w-full object-cover object-top transition-[filter,transform] duration-700 ${isActive ? 'scale-100' : 'scale-[1.04] grayscale-[35%]'} group-hover:scale-[1.02]`}
                  onError={(event) => {
                    event.currentTarget.style.opacity = '0';
                  }}
                />
                <div
                  className="absolute inset-0 pointer-events-none transition-opacity duration-500"
                  style={{
                    background: isActive
                      ? 'linear-gradient(180deg, rgba(3,7,12,0.02) 12%, rgba(3,7,12,0.10) 38%, rgba(3,7,12,0.88) 100%)'
                      : 'linear-gradient(180deg, rgba(3,7,12,0.12), rgba(3,7,12,0.62))',
                  }}
                />

                {isActive ? (
                  <>
                    <div className="absolute left-4 right-4 top-4 flex items-center justify-between gap-3 sm:left-6 sm:right-6 sm:top-6">
                      <span className="inline-flex max-w-[75%] items-center gap-2 rounded-full border border-white/20 bg-black/35 px-3 py-2 text-[9px] font-mono uppercase tracking-[0.16em] text-white backdrop-blur-xl sm:text-[10px] sm:tracking-[0.2em]">
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                        {project.domainLabel}
                      </span>
                      <span className="shrink-0 rounded-full border border-white/20 bg-black/30 px-3 py-2 text-[9px] font-mono uppercase tracking-[0.15em] text-white/90 backdrop-blur-xl sm:text-[10px]">
                        {statusLabels[project.status]}
                      </span>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-5 text-white sm:p-7 md:p-9">
                      <div className="mb-3 flex items-center gap-3 text-[9px] font-mono uppercase tracking-[0.2em] text-white/75 sm:text-[10px] sm:tracking-[0.25em]">
                        <span>{project.category}</span>
                        <span className="h-px w-6 bg-white/40" />
                        <span>{project.year}</span>
                      </div>
                      <h3 className="max-w-[15ch] text-2xl font-display font-medium uppercase leading-[1.04] tracking-tight text-white sm:text-3xl md:text-4xl lg:text-5xl">
                        {project.title}
                      </h3>
                      <p className="mt-3 max-w-xl text-xs font-light leading-relaxed text-white/80 sm:mt-4 sm:text-sm md:text-base">
                        {project.description}
                      </p>

                      <div className="mt-5 flex flex-wrap items-center gap-2.5 sm:mt-6 sm:gap-3">
                        <Link
                          to={caseStudyPath(project.slug)}
                          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-white px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.13em] text-slate-950 transition-colors hover:bg-cyan-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:px-5 sm:text-[11px]"
                        >
                          View Case Study
                          <ArrowRight size={14} />
                        </Link>
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/30 bg-black/25 px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.13em] text-white backdrop-blur-md transition-colors hover:border-white/70 hover:bg-black/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:px-5 sm:text-[11px]"
                          >
                            Visit Live
                            <ArrowUpRight size={14} />
                          </a>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    aria-label={`Spotlight ${project.title}`}
                    aria-pressed={false}
                    className="absolute inset-0 flex h-full w-full items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-cyan"
                  >
                    <span className="absolute left-1/2 top-5 -translate-x-1/2 rounded-full border border-white/25 bg-black/30 px-2 py-1 text-[9px] font-mono text-white/90 backdrop-blur-md">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span
                      className="absolute bottom-5 left-1/2 max-h-[68%] -translate-x-1/2 text-center text-[10px] font-mono font-semibold uppercase leading-tight tracking-[0.16em] text-white sm:text-[11px]"
                      style={{ writingMode: 'vertical-rl', transform: 'translateX(-50%) rotate(180deg)' }}
                    >
                      {project.title}
                    </span>
                    <span className="sr-only">Select {project.title}</span>
                  </button>
                )}
              </motion.article>
            );
          })}
        </div>
      </div>

      <div className="container relative z-10 mx-auto mt-5 flex max-w-7xl flex-col gap-4 px-5 sm:mt-7 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] font-mono uppercase tracking-[0.16em] theme-text-muted sm:text-[11px] sm:tracking-[0.2em]">
          <span className="text-brand-cyan">{activeProject.title}</span>
          <span className="opacity-40">/</span>
          <span>Drag or swipe to explore</span>
          <span className="hidden opacity-40 sm:inline">·</span>
          <span className="hidden sm:inline">All {SELECTED_PROJECTS.length} projects retained</span>
        </div>
        <Link
          to={allWorkPath}
          className="inline-flex min-h-11 w-fit items-center gap-2 border-b border-brand-cyan/40 pb-1 text-[10px] font-mono font-semibold uppercase tracking-[0.18em] text-brand-cyan transition-colors hover:border-brand-cyan hover:text-brand-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan sm:text-[11px]"
        >
          Explore All Work
          <ExternalLink size={13} />
        </Link>
      </div>
    </section>
  );
}

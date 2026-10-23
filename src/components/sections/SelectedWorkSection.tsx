import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ArrowUpRight, ExternalLink } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useRegion } from '@/hooks/useRegion';

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
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement | null>(null);

  const caseStudyPath = (slug: string) => `/${currentRegion}/case-studies/${slug}`;
  const allWorkPath = `/${currentRegion}/case-studies`;
  const activeProject = SELECTED_PROJECTS[activeIndex];

  const selectProject = (index: number) => {
    setActiveIndex(index);
    requestAnimationFrame(() => {
      const card = carouselRef.current?.querySelector<HTMLElement>(`[data-project-index="${index}"]`);
      card?.scrollIntoView({ behavior: 'auto', block: 'nearest', inline: 'center' });
    });
  };


  const moveSelection = (direction: -1 | 1) => {
    selectProject((activeIndex + direction + SELECTED_PROJECTS.length) % SELECTED_PROJECTS.length);
  };

  return (
    <section
      id="selected-work"
      aria-label="Selected Work by Jawrah Pixel"
      className="relative isolate overflow-hidden border-t theme-bg" style={{ borderColor: isDark ? 'rgba(255, 255, 255, 0.07)' : 'rgba(15, 23, 42, 0.08)' }}
    >
      <div className="relative flex flex-col justify-center overflow-hidden py-12 sm:py-16 lg:py-20">
      <div className="pointer-events-none absolute inset-0 premium-grid-overlay opacity-[0.06]" />
      <div aria-hidden="true" className="pointer-events-none absolute -top-48 left-1/2 h-[32rem] w-[52rem] -translate-x-1/2 rounded-full blur-[110px]" style={{ background: isDark ? 'radial-gradient(ellipse, rgba(73,155,255,0.12), rgba(92,70,190,0.055) 42%, transparent 72%)' : 'radial-gradient(ellipse, rgba(30,125,220,0.09), transparent 68%)' }} />
      <div aria-hidden="true" className="pointer-events-none absolute right-[-12rem] top-[38%] h-[24rem] w-[24rem] rounded-full blur-[100px]" style={{ background: isDark ? 'rgba(26,112,166,0.07)' : 'rgba(26,112,166,0.045)' }} />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px" style={{ background: isDark ? 'linear-gradient(90deg, transparent, rgba(126,190,255,0.28), transparent)' : 'linear-gradient(90deg, transparent, rgba(20,90,150,0.2), transparent)' }} />

      <div className="container relative z-10 mx-auto mb-8 max-w-7xl px-5 sm:mb-10 sm:px-8">
        <div className="flex flex-col justify-between gap-7 md:flex-row md:items-end">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2.5">
                <span className="h-2 w-2 rounded-full bg-brand-cyan " />
                <span className="text-[10px] font-mono font-bold uppercase tracking-[0.35em] text-brand-cyan">
                  Selected Work / 2026
                </span>
              </div>
              <h2 className="text-3xl font-display font-medium uppercase leading-[1.02] tracking-[-0.045em] theme-text-primary sm:text-4xl md:text-5xl lg:text-[4.25rem]">
                Digital Experiences
                <br />
                <span className="font-light italic tracking-[-0.055em] opacity-90">Built To Perform.</span>
              </h2>
              <p className="mt-5 max-w-xl text-sm font-light leading-[1.8] theme-text-muted sm:text-base md:text-lg">
                An evolving collection of websites, commerce experiences, and custom digital systems crafted by Jawrah Pixel.
              </p>
            
          </div>

          <div className="flex items-center justify-between gap-5 md:justify-end">
            <div className="min-w-[100px]">
              <span className="block text-[10px] font-mono uppercase tracking-[0.24em] theme-text-muted">The collection</span>
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
                className="inline-flex h-12 w-12 items-center justify-center rounded-full border bg-white/[0.02] transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-cyan/60 hover:bg-brand-cyan/10 hover:text-brand-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan"
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
        ref={carouselRef} className="relative z-10 w-full overflow-x-auto overflow-y-hidden scroll-smooth px-5 pb-4 sm:px-8 lg:px-10"
        role="region"
        aria-roledescription="carousel"
        aria-label="Jawrah Pixel selected projects. Choose a card to explore each project."
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === 'ArrowRight') { event.preventDefault(); moveSelection(1); }
          if (event.key === 'ArrowLeft') { event.preventDefault(); moveSelection(-1); }
        }}
      >
        <div className="mx-auto flex min-h-[340px] w-max max-w-none items-stretch gap-2 sm:min-h-[400px] sm:gap-3 lg:min-h-[460px]">
          {SELECTED_PROJECTS.map((project, index) => {
            const isActive = index === activeIndex;

            return (
              <article
                key={project.id}
                data-project-index={index}
                className={`group relative h-[340px] shrink-0 overflow-hidden rounded-2xl border sm:h-[400px] sm:rounded-[22px] lg:h-[460px] ${isActive ? 'z-[1]' : 'opacity-85'}`}
                style={{ width: isActive ? 'min(76vw, 720px)' : 'clamp(58px, 6.5vw, 88px)', transition: 'width 180ms ease-out' }}
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
                  className={`absolute inset-0 h-full w-full object-cover object-top ${isActive ? '' : 'grayscale-[20%]'}`}
                  onError={(event) => {
                    event.currentTarget.style.opacity = '0';
                  }}
                />
                <div
                  className="absolute inset-0 pointer-events-none transition-opacity duration-500"
                  style={{
                    background: isActive
                      ? 'linear-gradient(180deg, rgba(3,7,12,0.02) 8%, rgba(3,7,12,0.04) 35%, rgba(3,7,12,0.40) 63%, rgba(3,7,12,0.94) 100%)'
                      : 'linear-gradient(180deg, rgba(3,7,12,0.16), rgba(3,7,12,0.72))',
                  }}
                />

                {isActive ? (
                  <div className="absolute inset-0">
                    <div className="absolute left-4 right-4 top-4 flex items-center justify-between gap-3 sm:left-6 sm:right-6 sm:top-6">
                      <span className="inline-flex max-w-[75%] items-center gap-2 rounded-full border border-white/20 bg-black/35 px-3 py-2 text-[9px] font-mono uppercase tracking-[0.16em] text-white backdrop-blur-xl sm:text-[10px] sm:tracking-[0.2em]">
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                        {project.domainLabel}
                      </span>
                      <span className="shrink-0 rounded-full border border-white/20 bg-black/30 px-3 py-2 text-[9px] font-mono uppercase tracking-[0.15em] text-white/90 backdrop-blur-xl sm:text-[10px]">
                        {statusLabels[project.status]}
                      </span>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white sm:p-6 md:p-8">
                      <div className="mb-3 flex items-center gap-3 text-[9px] font-mono uppercase tracking-[0.2em] text-white/75 sm:text-[10px] sm:tracking-[0.25em]">
                        <span>{project.category}</span>
                        <span className="h-px w-6 bg-white/40" />
                        <span>{project.year}</span>
                      </div>
                      <h3 className="max-w-[15ch] text-2xl font-display font-medium uppercase leading-[1.02] tracking-[-0.035em] text-white sm:text-3xl md:text-4xl lg:text-5xl">
                        {project.title}
                      </h3>
                      <p className="mt-3 max-w-xl text-xs font-light leading-relaxed text-white/80 sm:mt-4 sm:text-sm md:text-base">
                        {project.description}
                      </p>

                      <div className="mt-5 flex flex-wrap items-center gap-2.5 sm:mt-6 sm:gap-3">
                        <Link
                          to={caseStudyPath(project.slug)}
                          className="group/cta inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full bg-white px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.13em] text-slate-950 shadow-[0_8px_32px_-12px_rgba(255,255,255,0.5)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-cyan-50 hover:shadow-[0_12px_38px_-12px_rgba(255,255,255,0.42)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:px-6 sm:text-[11px]"
                        >
                          View Case Study
                          <ArrowRight size={14} className="transition-transform duration-300 group-hover/cta:translate-x-0.5" />
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
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => selectProject(index)
                    aria-label={`Spotlight ${project.title}`}
                    aria-pressed={isActive}
                    className="absolute inset-0 flex h-full w-full items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-cyan"
                  >
                    <span className="absolute left-1/2 top-5 -translate-x-1/2 rounded-full border border-white/25 bg-black/35 px-2.5 py-1.5 text-[9px] font-mono text-white/90 backdrop-blur-md">
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
              </article>
            );
          })}
        </div>
      </div>

      <div className="container relative z-10 mx-auto mt-4 flex max-w-7xl flex-col gap-4 px-5 sm:mt-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] font-mono uppercase tracking-[0.16em] theme-text-muted sm:text-[11px] sm:tracking-[0.2em]">
          <span className="text-brand-cyan">{activeProject.title}</span>
          <span className="opacity-40">/</span>
          <span>Swipe or use arrow keys to explore</span>
          <span className="hidden opacity-40 sm:inline">·</span>
          <span className="hidden sm:inline">All {SELECTED_PROJECTS.length} projects retained</span>
        </div>
        <Link
          to={allWorkPath}
          className="group/all inline-flex min-h-11 w-fit items-center gap-2.5 border-b border-brand-cyan/40 pb-1 text-[10px] font-mono font-semibold uppercase tracking-[0.18em] text-brand-cyan transition-all duration-300 hover:gap-3.5 hover:border-brand-cyan hover:text-brand-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan sm:text-[11px]"
        >
          Explore All Work
          <ExternalLink size={13} />
        </Link>
      </div>
    </section>
  );
}

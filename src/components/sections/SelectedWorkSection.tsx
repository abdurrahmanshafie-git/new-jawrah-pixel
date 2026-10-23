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
      card?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
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
        ref={carouselRef} className="relative z-10 w-full snap-x snap-mandatory overflow-x-auto overflow-y-hidden scroll-smooth px-5 pb-4 sm:px-8 lg:px-10"
        role="region"
        aria-roledescription="carousel"
        aria-label="Jawrah Pixel selected projects. Choose a card to explore each project."
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === 'ArrowRight') { event.preventDefault(); moveSelection(1); }
          if (event.key === 'ArrowLeft') { event.preventDefault(); moveSelection(-1); }
        }}
      >
        <div className="mx-auto flex min-h-[280px] w-max max-w-none items-stretch gap-3 sm:min-h-[340px] sm:gap-4 lg:min-h-[400px]">
          {SELECTED_PROJECTS.map((project, index) => {
            const isActive = index === activeIndex;

            return (
              <article
                key={project.id}
                data-project-index={index}
                className={`group relative h-[280px] snap-center shrink-0 overflow-hidden rounded-2xl border sm:h-[340px] sm:rounded-[22px] lg:h-[400px] ${isActive ? 'z-[1]' : 'opacity-85'}`}
                style={{
                  width: isActive ? 'min(76vw, 720px)' : 'clamp(76px, 8vw, 112px)',
                  transition: 'width 320ms ease-in-out',
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
                <button
                  type="button"
                  onClick={() => selectProject(index)}
                  aria-label={`Select ${project.title}`}
                  aria-pressed={isActive}
                  className="absolute inset-0 z-[2] h-full w-full cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-cyan"
                >
                  <span className="sr-only">Select {project.title}</span>
                </button>
              </article>
            );
          })}
        </div>
      </div>

      <div className="container relative z-10 mx-auto mt-5 max-w-7xl px-5 sm:mt-7 sm:px-8">
        <div className="grid gap-5 border-t pt-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end sm:gap-8 sm:pt-7" style={{ borderColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(15,23,42,0.12)' }}>
          <div className="min-w-0">
            <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-[10px] font-mono uppercase tracking-[0.16em] theme-text-muted sm:text-[11px] sm:tracking-[0.2em]">
              <span className="text-brand-cyan">{activeProject.domainLabel}</span><span className="opacity-40">/</span><span>{activeProject.category}</span><span className="opacity-40">/</span><span>{activeProject.year}</span>
              <span className="rounded-full border px-2.5 py-1" style={{ borderColor: isDark ? 'rgba(255,255,255,0.18)' : 'rgba(15,23,42,0.18)' }}>{statusLabels[activeProject.status]}</span>
            </div>
            <h3 className="text-2xl font-display font-medium uppercase leading-tight tracking-[-0.035em] theme-text-primary sm:text-3xl md:text-4xl">{activeProject.title}</h3>
            <p className="mt-2 max-w-2xl text-sm leading-6 theme-text-muted sm:text-base">{activeProject.description}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3 sm:justify-end">
            <Link to={caseStudyPath(activeProject.slug)} className="inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full bg-brand-cyan px-5 py-3 text-[10px] font-bold uppercase tracking-[0.13em] text-slate-950 transition-colors hover:bg-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan sm:px-6 sm:text-[11px]">View Case Study <ArrowRight size={15} /></Link>
            {activeProject.liveUrl && <a href={activeProject.liveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full border px-5 py-3 text-[10px] font-bold uppercase tracking-[0.13em] theme-text-primary transition-colors hover:border-brand-cyan hover:text-brand-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan sm:px-6 sm:text-[11px]" style={{ borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(15,23,42,0.2)' }}>Visit Live <ArrowUpRight size={15} /></a>}
          </div>
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
      </div>
    </section>
  );
}

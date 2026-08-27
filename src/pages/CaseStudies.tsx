import { motion } from 'motion/react';
import { ArrowRight, ArrowUpRight, BarChart2, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { SEO } from '@/components/layout/SEO';
import { useRegion } from '@/hooks/useRegion';
import { useTheme } from '@/contexts/ThemeContext';
import { Reveal } from '@/components/ui/Reveal';
import { toAbsoluteUrl } from '@/lib/env';
import { cn } from '@/lib/utils';
import { ALL_CASE_STUDIES } from '@/data/caseStudies';
import type { CaseListItem } from '@/data/caseStudies';

type Filter = 'All Work' | 'Web Design' | 'Web Development' | 'E-commerce' | 'UI/UX' | 'Branding' | 'SEO' | 'Real Estate' | 'Jewellery' | 'Fashion' | 'Education' | 'Travel' | 'Digital Products';
type DisplayProject = CaseListItem & { industry?: string; thumbnail?: string };
const FILTERS: Filter[] = ['All Work', 'Web Design', 'Web Development', 'E-commerce', 'UI/UX', 'Branding', 'SEO', 'Real Estate', 'Jewellery', 'Fashion', 'Education', 'Travel', 'Digital Products'];

const matchesFilter = (project: CaseListItem, filter: Filter) => {
  if (filter === 'All Work') return true;
  const searchable = `${project.category} ${project.tags.join(' ')}`.toLowerCase();
  const filterTerms: Record<Exclude<Filter, 'All Work'>, string[]> = {
    'Web Design': ['website', 'brand experience', 'boutique', 'portal', 'system'],
    'Web Development': ['website', 'platform', 'portal', 'system', 'dashboard'],
    'E-commerce': ['commerce', 'ecommerce', 'retail', 'boutique', 'jewellery'],
    'UI/UX': ['ui', 'ux', 'experience', 'portal', 'system', 'dashboard'],
    Branding: ['brand', 'luxury', 'fashion', 'jewellery', 'heritage'],
    SEO: ['seo', 'search', 'performance'],
    'Real Estate': ['real estate', 'property'],
    Jewellery: ['jewellery', 'jewelry', 'gold', 'gemstone', 'diamond'],
    Fashion: ['fashion', 'streetwear', 'apparel', 'clothing'],
    Education: ['education'],
    Travel: ['travel', 'tourism', 'booking', 'tour'],
    'Digital Products': ['platform', 'portal', 'system', 'dashboard', 'crm', 'saas'],
  };
  return filterTerms[filter].some((term) => searchable.includes(term));
};

function ProjectVisual({ project, featured = false, isDark }: { project: DisplayProject; featured?: boolean; isDark: boolean }) {
  return (
    <div className={cn('relative overflow-hidden border theme-border', featured ? 'aspect-[16/10] lg:aspect-[16/9]' : 'aspect-[4/3]')}>
      {project.thumbnail ? (
        <motion.img src={project.thumbnail} alt={project.title} loading={featured ? 'eager' : 'lazy'} className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]" />
      ) : (
        <div className={cn('flex h-full w-full items-center justify-center bg-gradient-to-br', project.color)}><span className="font-display text-[clamp(6rem,16vw,14rem)] font-medium uppercase opacity-10">{project.char}</span></div>
      )}
      <div className={cn('absolute inset-0', isDark ? 'bg-gradient-to-t from-black/90 via-black/15 to-transparent' : 'bg-gradient-to-t from-slate-950/75 via-slate-950/5 to-transparent')} />
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 sm:p-8">
        <div className="flex flex-wrap gap-2"><span className="border border-white/20 bg-black/20 px-3 py-1 text-[9px] font-mono uppercase tracking-[0.22em] text-white backdrop-blur-sm">{project.category}</span><span className="border border-white/20 bg-black/20 px-3 py-1 text-[9px] font-mono uppercase tracking-[0.22em] text-white/80 backdrop-blur-sm">{project.industry ?? project.category}</span></div>
        <span className="grid h-10 w-10 shrink-0 place-items-center bg-brand-blue text-white transition-transform duration-500 group-hover:rotate-[-8deg] group-hover:scale-110"><ArrowUpRight size={18} /></span>
      </div>
    </div>
  );
}

export default function CaseStudies() {
  const { config, cases, p, isInternational } = useRegion();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [filter, setFilter] = useState<Filter>('All Work');
  const projects: DisplayProject[] = cases.map((project) => ({ ...project, ...ALL_CASE_STUDIES[project.slug] }));
  const featured = projects[0];
  const filteredCases = projects.filter((project) => project.slug !== featured?.slug && matchesFilter(project, filter));
  const seoTitle = isInternational ? 'Global Flagship Case Studies' : `Flagship Case Studies | ${config.countryName}`;
  const seoDescription = isInternational ? "Explore Jawrah Pixel's premium global portfolio of websites, ecommerce platforms, AI systems, and digital products." : `Explore Jawrah Pixel's portfolio of premium web applications, e-commerce boutiques, and digital systems in ${config.countryName}.`;

  return (
    <main className="relative min-h-screen overflow-hidden theme-bg font-sans">
      <SEO title={seoTitle} description={seoDescription} canonicalUrl={toAbsoluteUrl(p('/case-studies'))} keywords={['case studies', 'Jawrah Pixel portfolio', 'web design case studies', 'ecommerce case studies']} />
      <section className="relative border-b theme-border pt-32 sm:pt-40 lg:pt-48">
        <div className="pointer-events-none absolute inset-0 premium-grid-overlay opacity-20" /><div className="pointer-events-none absolute right-[8%] top-24 h-72 w-72 rounded-full bg-brand-cyan/10 blur-[110px]" />
        <div className="container relative mx-auto px-5 pb-24 sm:px-6 lg:pb-36"><Reveal><div className="mb-8 flex items-center gap-3 text-[10px] font-mono font-bold uppercase tracking-[0.45em] text-brand-blue"><span className="h-2 w-2 rounded-full bg-brand-blue" /> Our Work / Selected Systems</div><h1 className="max-w-4xl text-[clamp(3.4rem,9vw,9rem)] font-display font-medium uppercase leading-[0.88] tracking-[-0.04em] theme-text-primary">Ideas into <span className="premium-text-gradient italic">digital</span> experiences.</h1><p className="mt-10 max-w-xl text-base font-light leading-relaxed theme-text-muted sm:text-lg">Selected projects where strategy, design, and technology come together to create meaningful business impact.</p></Reveal><div className="mt-16 grid max-w-3xl grid-cols-2 gap-px border theme-border sm:grid-cols-4">{[['01', 'Featured system'], [String(projects.length).padStart(2, '0'), 'Selected projects'], ['04', 'Core disciplines'], ['ALL', 'Built for growth']].map(([value, label]) => <div key={label} className="theme-bg-tertiary p-4 sm:p-5"><strong className="block text-xl font-display theme-text-primary">{value}</strong><span className="mt-2 block text-[9px] font-mono uppercase tracking-[0.18em] theme-text-caption">{label}</span></div>)}</div></div>
      </section>
      {featured && <section className="container mx-auto px-5 py-20 sm:px-6 lg:py-32"><div className="mb-8 flex items-end justify-between gap-6"><div><span className="text-[10px] font-mono font-bold uppercase tracking-[0.4em] text-brand-blue">01 / Featured case study</span><h2 className="mt-4 text-3xl font-display uppercase tracking-tight theme-text-primary sm:text-5xl">A flagship in motion</h2></div><BarChart2 className="hidden text-brand-blue sm:block" /></div><Link to={p(`/case-studies/${featured.slug}`)} className="group block"><ProjectVisual project={featured} featured isDark={isDark} /><div className="grid gap-8 border-x border-b theme-border p-6 sm:p-10 lg:grid-cols-[1.2fr_1fr_auto] lg:items-end lg:p-12"><div><h3 className="text-3xl font-display font-medium uppercase tracking-tight theme-text-primary sm:text-5xl">{featured.title}</h3><p className="mt-4 max-w-xl leading-relaxed theme-text-muted">{featured.description}</p></div><div className="grid grid-cols-2 gap-5 text-[10px] font-mono uppercase tracking-[0.18em] theme-text-caption"><span><b className="mb-2 block text-brand-blue">Industry</b>{featured.industry ?? featured.category}</span><span><b className="mb-2 block text-brand-blue">Performance</b>{featured.perf} / 100</span></div><span className="inline-flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.25em] text-brand-blue">View case study <ArrowRight size={16} className="transition-transform group-hover:translate-x-2" /></span></div></Link></section>}
      <section className="border-t theme-border"><div className="container mx-auto px-5 py-20 sm:px-6 lg:py-28"><div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end"><div><span className="text-[10px] font-mono font-bold uppercase tracking-[0.4em] text-brand-blue">02 / The archive</span><h2 className="mt-4 text-4xl font-display uppercase tracking-tight theme-text-primary sm:text-6xl">Built to matter.</h2></div><div className="flex max-w-full gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Filter case studies">{FILTERS.map((item) => <button key={item} type="button" role="tab" aria-selected={filter === item} onClick={() => setFilter(item)} className={cn('shrink-0 border px-4 py-3 text-[10px] font-mono uppercase tracking-[0.16em] transition-colors', filter === item ? 'border-brand-blue bg-brand-blue text-white' : 'theme-border theme-text-muted hover:border-brand-blue hover:text-brand-blue')}>{item}</button>)}</div></div><div className="mt-14 grid gap-x-8 gap-y-16 md:grid-cols-2">{filteredCases.map((project, index) => <Reveal key={project.slug} className={cn('group', index % 2 === 1 && 'md:mt-20')}><Link to={p(`/case-studies/${project.slug}`)} className="block"><ProjectVisual project={project} isDark={isDark} /><div className="pt-6"><div className="flex items-center justify-between gap-4"><span className="text-[10px] font-mono uppercase tracking-[0.3em] text-brand-blue">{String(index + 1).padStart(2, '0')} / {project.category}</span><span className="text-[10px] font-mono theme-text-caption">{project.perf} PERF</span></div><h3 className="mt-4 text-2xl font-display uppercase tracking-tight theme-text-primary sm:text-3xl">{project.title}</h3><p className="mt-3 max-w-lg text-sm font-light leading-relaxed theme-text-muted">{project.description}</p><div className="mt-5 flex flex-wrap gap-2">{project.tags.slice(0, 3).map((tag) => <span key={tag} className="border theme-border px-2 py-1 text-[9px] font-mono uppercase tracking-[0.16em] theme-text-caption">{tag}</span>)}</div></div></Link></Reveal>)}</div>{!filteredCases.length && <div className="border theme-border p-12 text-center theme-text-muted">No projects in this category for the selected region.</div>}</div></section>
      <section className="container mx-auto px-5 py-20 sm:px-6 lg:py-32"><div className="relative overflow-hidden border theme-border theme-card p-8 sm:p-14 lg:p-24"><Sparkles className="absolute right-8 top-8 text-brand-blue/50" /><span className="text-[10px] font-mono font-bold uppercase tracking-[0.4em] text-brand-blue">03 / Start something meaningful</span><h2 className="mt-6 max-w-3xl text-4xl font-display uppercase leading-[0.95] tracking-tight theme-text-primary sm:text-7xl">Your next digital advantage starts here.</h2><p className="mt-8 max-w-xl leading-relaxed theme-text-muted">Bring us the ambition, the problem, or the opportunity. We will help shape the system behind it.</p><Link to={p('/contact')} className="mt-10 inline-block"><Button size="lg">Start a project <ArrowUpRight size={17} className="ml-2" /></Button></Link></div></section>
    </main>
  );
}

import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { useRegion } from '@/hooks/useRegion';
import { getCaseStudyDetails, ALL_CASE_STUDIES } from '@/data/caseStudies';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  ArrowUpRight, 
  Tv, 
  Smartphone, 
  Calendar, 
  CheckCircle, 
  Compass, 
  Zap, 
  Cpu, 
  Award,
  ChevronRight,
  ShieldCheck,
  Target,
  Layers,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { SEO } from '@/components/layout/SEO';
import { toAbsoluteUrl } from '@/lib/env';
import { buildBreadcrumbSchema, buildCaseStudySchema } from '@/lib/seo/schema';
import { Reveal, StaggerContainer, StaggerItem } from '@/components/ui/Reveal';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';
import { EliteEducationCaseStudy } from '@/components/sections/EliteEducationCaseStudy';
import { ZenvorCaseStudy } from '@/components/sections/ZenvorCaseStudy';
import { VerifiedPortfolioCaseStudy } from '@/components/sections/VerifiedPortfolioCaseStudy';

export default function CaseStudyDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeMedia, setActiveMedia] = useState<'desktop' | 'mobile'>('desktop');
  const [scrollProgress, setScrollProgress] = useState(0);
  const { currentRegion, config, p, cases } = useRegion();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const rawProject = slug ? getCaseStudyDetails(slug) : null;
  const visibleSlugs = cases.map((item) => item.slug);
  const hasRegionalPrefix = /^\/(lk|pk|int)(?=\/|$)/.test(location.pathname);
  const project = rawProject && (!hasRegionalPrefix || visibleSlugs.includes(rawProject.slug)) ? rawProject : null;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  useEffect(() => {
    let frame = 0;
    const updateProgress = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        setScrollProgress(scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0);
      });
    };
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', updateProgress);
    };
  }, []);

  if (!project) {
    return (
      <div className="pt-40 pb-24 min-h-screen theme-bg theme-text-primary text-center flex flex-col items-center justify-center">
        <SEO title="Project Not Found" description="The requested case study could not be found." />
        <h1 className="text-4xl font-display font-medium uppercase tracking-tight mb-8">Case Study Not Found</h1>
        <Link to={p('/case-studies')}>
          <Button variant="outline">Back to Case Studies</Button>
        </Link>
      </div>
    );
  }

  if (project.slug !== 'elite-education' && project.slug !== 'zenvor') {
    return <VerifiedPortfolioCaseStudy slug={project.slug} />;
  }

  const slugs = visibleSlugs;
  const currentIndex = slugs.indexOf(project.slug);
  const nextSlug = slugs[(currentIndex + 1) % slugs.length];
  const nextProject = ALL_CASE_STUDIES[nextSlug];
  const caseStudyPath = hasRegionalPrefix ? p(`/case-studies/${project.slug}`) : `/case-studies/${project.slug}`;

  const transformationSummary = [
    { label: 'Challenge', icon: <Compass size={20} />, copy: project.challenges[0] },
    { label: 'Strategy', icon: <Cpu size={20} />, copy: project.solutions[0] },
    { label: 'Impact', icon: <Award size={20} />, copy: `${project.results[0].val} ${project.results[0].metric} improvement.` },
    { label: 'Mobile', icon: <ShieldCheck size={20} />, copy: 'Optimized for high-intent mobile visitors.' },
  ];
  const caseStudyServiceLinks: Record<string, Array<{ label: string; path: string; copy: string }>> = {
    'elite-education': [
      {
        label: 'Web Development Sri Lanka',
        path: '/lk/web-development-sri-lanka',
        copy: 'Responsive, search-ready website architecture for Sri Lankan businesses and education brands.',
      },
      {
        label: 'SEO Services Sri Lanka',
        path: '/lk/services/seo-services-sri-lanka',
        copy: 'Technical SEO structure, content hierarchy, and search-intent planning for education discovery.',
      },
    ],
    zenvor: [
      {
        label: 'Ecommerce Development Sri Lanka',
        path: '/lk/ecommerce-development-sri-lanka',
        copy: 'Premium catalog, product confidence, checkout readiness, and mobile commerce architecture.',
      },
      {
        label: 'Web Development Sri Lanka',
        path: '/lk/web-development-sri-lanka',
        copy: 'Fast React pages, technical SEO structure, and conversion-focused service journeys.',
      },
    ],
    'shabnam-jewellers': [
      {
        label: 'Ecommerce Development Pakistan',
        path: '/pk/ecommerce-development-pakistan',
        copy: 'High-trust retail journeys, assisted checkout paths, and product-led mobile discovery.',
      },
      {
        label: 'Web Development Pakistan',
        path: '/pk/web-development-pakistan',
        copy: 'Premium web architecture for Pakistani brands that need stronger search and sales confidence.',
      },
    ],
    'aerovista-travels': [
      {
        label: 'Custom Software Development',
        path: '/int/custom-software-development',
        copy: 'Booking logic, workflow planning, dashboard-ready data, and scalable product interface thinking.',
      },
      {
        label: 'Web Development Agency',
        path: '/int/web-development-agency',
        copy: 'International web architecture for premium service businesses and remote-first teams.',
      },
    ],
    aerovista: [
      {
        label: 'Custom Software Development',
        path: '/int/custom-software-development',
        copy: 'Booking logic, workflow planning, dashboard-ready data, and scalable product interface thinking.',
      },
      {
        label: 'Web Development Agency',
        path: '/int/web-development-agency',
        copy: 'International web architecture for premium service businesses and remote-first teams.',
      },
    ],
    'veloura-cafe': [
      {
        label: 'Web Development Agency',
        path: '/int/web-development-agency',
        copy: 'Premium marketing pages, mobile-first storytelling, and conversion-ready brand experiences.',
      },
      {
        label: 'Custom Software Development',
        path: '/int/custom-software-development',
        copy: 'Operational systems, ordering flows, and scalable digital infrastructure for global teams.',
      },
    ],
  };
  const relatedServiceLinks = caseStudyServiceLinks[project.slug] ?? [
    {
      label: 'Web Development Agency',
      path: '/int/web-development-agency',
      copy: 'Premium web development, conversion architecture, and search-ready digital systems.',
    },
    {
      label: 'Custom Software Development',
      path: '/int/custom-software-development',
      copy: 'Secure portals, dashboards, workflows, and product interfaces for scalable operations.',
    },
  ];

  return (
    <div className="relative min-h-screen pt-32 pb-24 font-sans overflow-hidden theme-bg theme-text-primary">
      <div className="fixed left-0 right-0 top-0 z-[120] h-0.5 bg-brand-blue/10" aria-hidden="true">
        <div className="h-full origin-left bg-brand-blue" style={{ transform: `scaleX(${scrollProgress / 100})` }} />
      </div>
      <SEO 
        title={project.slug === 'elite-education' ? 'Elite Education Sri Lanka Case Study | Jawrah Pixel' : project.slug === 'zenvor' ? "ZENVOR Premium Men's Fashion E-commerce Case Study | Jawrah Pixel" : project.title} 
        description={project.metaDesc}
        ogImage={project.desktopImage}
        ogTitle={project.slug === 'elite-education' ? 'Elite Education Sri Lanka Website Case Study' : project.slug === 'zenvor' ? "ZENVOR Premium Men's Fashion E-commerce Case Study" : undefined}
        keywords={project.slug === 'elite-education' ? ['Elite Education Sri Lanka', 'Singapore education consultant website', 'education website development Sri Lanka', 'course catalog website', 'student enquiry website', 'Jawrah Pixel case study'] : project.slug === 'zenvor' ? ["ZENVOR men's fashion e-commerce", 'premium streetwear website', 'luxury essentials e-commerce', 'Sri Lanka fashion e-commerce', 'Jawrah Pixel case study'] : undefined}
        schemaData={[
          buildBreadcrumbSchema([
            { name: 'Home', url: toAbsoluteUrl(p('/')) },
            { name: 'Case Studies', url: toAbsoluteUrl(hasRegionalPrefix ? p('/case-studies') : '/case-studies') },
            { name: project.title, url: toAbsoluteUrl(caseStudyPath) }
          ]),
          buildCaseStudySchema({
            ...project,
            description: project.overview,
            url: toAbsoluteUrl(caseStudyPath)
          })
        ]}
      />

      {/* Atmospheric Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 premium-grid-overlay opacity-20 pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full">
          <div className="absolute top-[10%] right-[10%] cinematic-light animate-pulse-slow opacity-30" />
          <div className="absolute bottom-[20%] left-[10%] cinematic-light animate-glow opacity-20" style={{ background: 'radial-gradient(circle at center, rgba(6, 182, 212, 0.1), transparent 70%)' }} />
        </div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        
        {/* HEADER BAR */}
        <div className="mb-20 flex items-center justify-between">
          <Link 
            to={p('/case-studies')} 
            className="group flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.3em] theme-text-muted hover:theme-text-primary transition-colors"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-2 transition-transform" />
            Back to Case Studies
          </Link>
          <div className="text-[10px] font-mono text-brand-blue uppercase tracking-[0.4em] font-bold flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-brand-blue animate-pulse" />
            Case Deep Dive
          </div>
        </div>

        {/* PROJECT HERO */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-end mb-32 pb-20 border-b theme-border">
          <Reveal className="lg:col-span-8">
            <span className="text-[10px] font-mono text-brand-blue uppercase tracking-[0.4em] font-bold block mb-8">
              {project.category}
            </span>
            <h1 className="text-4xl md:text-7xl lg:text-8xl font-display font-medium uppercase tracking-tight leading-[0.95] mb-10">
              {project.title}
            </h1>
            <p className="text-lg md:text-xl theme-text-muted font-light leading-relaxed max-w-3xl">
              {project.overview}
            </p>
            
            {project.websiteUrl && (
              <div className="pt-12">
                <a href={project.websiteUrl} target="_blank" rel="noreferrer">
                  <Button size="lg" className="min-w-[240px]">
                    Visit Live Project <ArrowUpRight size={18} className="ml-3" />
                  </Button>
                </a>
              </div>
            )}
          </Reveal>

          <Reveal delay={0.2} className="lg:col-span-4">
            <div className="grid grid-cols-1 gap-px theme-bg-tertiary border theme-border">
              {[
                { label: 'Client', value: project.client },
                { label: 'Industry', value: project.industry },
                { label: 'Timeline', value: project.duration },
                ...(project.projectStatus ? [{ label: 'Project status', value: project.projectStatus }] : []),
                ...(project.projectYear ? [{ label: 'Project year', value: project.projectYear }] : []),
              ].map((meta) => (
                <div key={meta.label} className="theme-bg p-8 group">
                  <span className="text-[10px] font-mono theme-text-caption uppercase tracking-widest block mb-2">{meta.label}</span>
                  <span className="text-sm font-display font-medium theme-text-primary uppercase tracking-wider group-hover:text-brand-blue transition-colors">{meta.value}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        {/* PROJECT STORY */}
        <section className="mb-32 grid gap-16 border-b theme-border pb-24 lg:grid-cols-[0.7fr_1.3fr] lg:gap-24">
          <div><span className="text-[10px] font-mono font-bold uppercase tracking-[0.4em] text-brand-blue">01 / Project brief</span><h2 className="mt-5 text-4xl font-display uppercase leading-none tracking-tight theme-text-primary sm:text-6xl">The work behind the outcome.</h2></div>
          <div className="space-y-16">
            <div><span className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-brand-blue">The challenge</span><p className="mt-5 max-w-2xl text-lg font-light leading-relaxed theme-text-muted">{project.challenges[0]}</p><div className="mt-6 grid gap-3 sm:grid-cols-2">{project.challenges.slice(1).map((challenge) => <div key={challenge} className="border theme-border theme-bg-tertiary p-5 text-sm leading-relaxed theme-text-secondary">{challenge}</div>)}</div></div>
            <div><span className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-brand-blue">The strategy</span><div className="mt-6 grid gap-4">{project.processSteps.map((step) => <div key={step.phase} className="grid gap-3 border-b theme-border pb-5 sm:grid-cols-[100px_1fr] sm:gap-8"><span className="text-[10px] font-mono uppercase tracking-[0.2em] theme-text-caption">{step.phase}</span><div><h3 className="font-display uppercase theme-text-primary">{step.title}</h3><p className="mt-2 text-sm leading-relaxed theme-text-muted">{step.desc}</p></div></div>)}</div></div>
            <div><span className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-brand-blue">The solution</span><div className="mt-6 grid gap-4 sm:grid-cols-3">{project.solutions.map((solution, index) => <div key={solution} className="theme-bg-tertiary p-5"><span className="text-2xl font-display text-brand-blue">0{index + 1}</span><p className="mt-5 text-sm leading-relaxed theme-text-secondary">{solution}</p></div>)}</div></div>
          </div>
        </section>

        {project.slug === 'elite-education' && <EliteEducationCaseStudy />}
        {project.slug === 'zenvor' && <ZenvorCaseStudy />}

        {/* TRANSFORMATION SNAPSHOT */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-32">
          {transformationSummary.map((item, idx) => (
            <StaggerItem key={idx} className="group p-10 theme-card border theme-border hover:theme-bg-tertiary transition-all duration-700">
              <div className="mb-8 text-brand-blue group-hover:scale-110 transition-transform duration-500">
                {item.icon}
              </div>
              <h3 className="text-[10px] font-mono theme-text-caption uppercase tracking-widest mb-4">{item.label}</h3>
              <p className="text-sm theme-text-muted leading-relaxed font-light group-hover:theme-text-secondary transition-colors">{item.copy}</p>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* MEDIA SHOWCASE */}
        <section className="mb-32">
          <div className="flex justify-center mb-16">
            <div className="inline-flex p-2 theme-bg-tertiary border theme-border backdrop-blur-xl">
              <button
                onClick={() => setActiveMedia('desktop')}
                className={cn(
                  "px-8 py-4 text-[10px] font-bold uppercase tracking-[0.3em] transition-all duration-500 flex items-center gap-3",
                  activeMedia === 'desktop' ? "bg-brand-blue text-white" : "theme-text-muted hover:theme-text-primary"
                )}
              >
                <Tv size={14} /> Desktop
              </button>
              <button
                onClick={() => setActiveMedia('mobile')}
                className={cn(
                  "px-8 py-4 text-[10px] font-bold uppercase tracking-[0.3em] transition-all duration-500 flex items-center gap-3",
                  activeMedia === 'mobile' ? "bg-brand-blue text-white" : "theme-text-muted hover:theme-text-primary"
                )}
              >
                <Smartphone size={14} /> Mobile
              </button>
            </div>
          </div>

          <Reveal className="relative theme-bg-tertiary border theme-border overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeMedia}
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="aspect-video lg:aspect-[21/9] flex items-center justify-center overflow-hidden"
              >
                <img 
                  src={activeMedia === 'desktop' ? project.desktopImage : project.mobileImage} 
                  alt={`${project.title} preview`}
                  className={cn(
                    "w-full h-full object-cover",
                    activeMedia === 'mobile' && "max-w-[400px] object-contain"
                  )}
                />
              </motion.div>
            </AnimatePresence>
          </Reveal>
        </section>

        {/* RESULTS GRID */}
        <section className="mb-32">
          <Reveal className="text-center mb-24">
            <span className="text-[10px] font-mono text-brand-blue uppercase tracking-[0.4em] font-bold block mb-6">Metrics</span>
            <h2 className="text-4xl md:text-6xl font-display font-medium uppercase tracking-tight theme-text-primary">Commercial Impact</h2>
          </Reveal>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-px theme-bg-tertiary border theme-border">
            {project.results.map((result, i) => (
              <StaggerItem key={i} className="theme-bg p-16 text-center group">
                <div className="text-5xl md:text-7xl font-display font-medium theme-text-primary mb-6 group-hover:scale-110 transition-transform duration-700">
                  {result.val}
                </div>
                <h4 className="text-[10px] font-mono text-brand-blue uppercase tracking-[0.3em] font-bold mb-6">{result.metric}</h4>
                <p className="text-sm theme-text-muted font-light leading-relaxed max-w-[240px] mx-auto">{result.desc}</p>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </section>

        {/* RELATED SERVICES */}
        <section className="mb-32">
          <Reveal className="mb-12 max-w-3xl">
            <span className="text-[10px] font-mono text-brand-blue uppercase tracking-[0.4em] font-bold block mb-6">
              Relevant Services
            </span>
            <h2 className="text-4xl md:text-6xl font-display font-medium uppercase tracking-tight leading-[1] theme-text-primary">
              Explore the capability behind this project
            </h2>
          </Reveal>

          <StaggerContainer className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {relatedServiceLinks.map((service) => (
              <StaggerItem key={service.path} className="group border theme-border theme-card p-8 transition-all duration-700 hover:border-brand-blue/25 hover:theme-bg-tertiary">
                <Link to={service.path} className="block">
                  <span className="mb-5 block text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-brand-blue">
                    Service Page
                  </span>
                  <h3 className="mb-4 text-2xl font-display font-medium uppercase tracking-tight theme-text-primary transition-colors group-hover:text-brand-blue">
                    {service.label}
                  </h3>
                  <p className="mb-8 text-sm font-light leading-relaxed theme-text-muted">
                    {service.copy}
                  </p>
                  <span className="inline-flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.24em] theme-text-primary">
                    Learn More
                    <ChevronRight size={14} className="transition-transform group-hover:translate-x-2" />
                  </span>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </section>

        {/* NEXT PROJECT CTA */}
        <Reveal className="pt-32 border-t theme-border">
          <Link 
            to={p(`/case-studies/${nextSlug}`)}
            className="group block relative p-16 md:p-24 theme-card border theme-border overflow-hidden text-center"
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-1000">
              <img src={nextProject.desktopImage} alt="Next project" className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-[2000ms]" />
            </div>
            
            <span className="text-[10px] font-mono text-brand-blue uppercase tracking-[0.4em] font-bold block mb-8 relative z-10">Next Evolution</span>
            <h2 className="text-3xl md:text-6xl font-display font-medium uppercase tracking-tight theme-text-primary mb-10 relative z-10 group-hover:text-brand-blue transition-colors">
              {nextProject.title}
            </h2>
            <div className="inline-flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.3em] theme-text-primary relative z-10">
              Explore Project <ArrowUpRight size={14} className="group-hover:translate-x-4 transition-transform duration-500" />
            </div>
          </Link>
        </Reveal>
      </div>
    </div>
  );
}

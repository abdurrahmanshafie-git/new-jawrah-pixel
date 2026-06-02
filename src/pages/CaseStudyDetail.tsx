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

export default function CaseStudyDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeMedia, setActiveMedia] = useState<'desktop' | 'mobile'>('desktop');
  const { currentRegion, config, p, cases } = useRegion();
  
  const rawProject = slug ? getCaseStudyDetails(slug) : null;
  const visibleSlugs = cases.map((item) => item.slug);
  const hasRegionalPrefix = /^\/(lk|pk|int)(?=\/|$)/.test(location.pathname);
  const project = rawProject && (!hasRegionalPrefix || visibleSlugs.includes(rawProject.slug)) ? rawProject : null;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  if (!project) {
    return (
      <div className="pt-40 pb-24 min-h-screen bg-brand-black text-white text-center flex flex-col items-center justify-center">
        <SEO title="Project Not Found" description="The requested case study could not be found." />
        <h1 className="text-4xl font-display font-medium uppercase tracking-tight mb-8">Case Study Not Found</h1>
        <Link to={p('/case-studies')}>
          <Button variant="outline">Back to Case Studies</Button>
        </Link>
      </div>
    );
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
    <div className="bg-brand-black text-white relative min-h-screen pt-32 pb-24 font-sans overflow-hidden">
      <SEO 
        title={project.title} 
        description={project.metaDesc}
        ogImage={project.desktopImage}
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
            className="group flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500 hover:text-white transition-colors"
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-end mb-32 pb-20 border-b border-white/5">
          <Reveal className="lg:col-span-8">
            <span className="text-[10px] font-mono text-brand-blue uppercase tracking-[0.4em] font-bold block mb-8">
              {project.category}
            </span>
            <h1 className="text-4xl md:text-7xl lg:text-8xl font-display font-medium uppercase tracking-tight leading-[0.95] mb-10">
              {project.title}
            </h1>
            <p className="text-lg md:text-xl text-zinc-500 font-light leading-relaxed max-w-3xl">
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
            <div className="grid grid-cols-1 gap-px bg-white/5 border border-white/5">
              {[
                { label: 'Client', value: project.client },
                { label: 'Industry', value: project.industry },
                { label: 'Timeline', value: project.duration },
                { label: 'Investment', value: project.budget }
              ].map((meta) => (
                <div key={meta.label} className="bg-brand-black p-8 group">
                  <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest block mb-2">{meta.label}</span>
                  <span className="text-sm font-display font-medium text-white uppercase tracking-wider group-hover:text-brand-blue transition-colors">{meta.value}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        {/* TRANSFORMATION SNAPSHOT */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-32">
          {transformationSummary.map((item, idx) => (
            <StaggerItem key={idx} className="group p-10 bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all duration-700">
              <div className="mb-8 text-brand-blue group-hover:scale-110 transition-transform duration-500">
                {item.icon}
              </div>
              <h3 className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest mb-4">{item.label}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed font-light group-hover:text-zinc-200 transition-colors">{item.copy}</p>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* MEDIA SHOWCASE */}
        <section className="mb-32">
          <div className="flex justify-center mb-16">
            <div className="inline-flex p-2 bg-white/[0.02] border border-white/5 backdrop-blur-xl">
              <button
                onClick={() => setActiveMedia('desktop')}
                className={cn(
                  "px-8 py-4 text-[10px] font-bold uppercase tracking-[0.3em] transition-all duration-500 flex items-center gap-3",
                  activeMedia === 'desktop' ? "bg-white text-black" : "text-zinc-500 hover:text-white"
                )}
              >
                <Tv size={14} /> Desktop
              </button>
              <button
                onClick={() => setActiveMedia('mobile')}
                className={cn(
                  "px-8 py-4 text-[10px] font-bold uppercase tracking-[0.3em] transition-all duration-500 flex items-center gap-3",
                  activeMedia === 'mobile' ? "bg-white text-black" : "text-zinc-500 hover:text-white"
                )}
              >
                <Smartphone size={14} /> Mobile
              </button>
            </div>
          </div>

          <Reveal className="relative bg-zinc-900 border border-white/5 overflow-hidden">
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
            <h2 className="text-4xl md:text-6xl font-display font-medium uppercase tracking-tight text-white">Commercial Impact</h2>
          </Reveal>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5 border border-white/5">
            {project.results.map((result, i) => (
              <StaggerItem key={i} className="bg-brand-black p-16 text-center group">
                <div className="text-5xl md:text-7xl font-display font-medium text-white mb-6 group-hover:scale-110 transition-transform duration-700">
                  {result.val}
                </div>
                <h4 className="text-[10px] font-mono text-brand-blue uppercase tracking-[0.3em] font-bold mb-6">{result.metric}</h4>
                <p className="text-sm text-zinc-500 font-light leading-relaxed max-w-[240px] mx-auto">{result.desc}</p>
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
            <h2 className="text-4xl md:text-6xl font-display font-medium uppercase tracking-tight leading-[1] text-white">
              Explore the capability behind this project
            </h2>
          </Reveal>

          <StaggerContainer className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {relatedServiceLinks.map((service) => (
              <StaggerItem key={service.path} className="group border border-white/5 bg-white/[0.02] p-8 transition-all duration-700 hover:border-brand-blue/25 hover:bg-white/[0.04]">
                <Link to={service.path} className="block">
                  <span className="mb-5 block text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-brand-blue">
                    Service Page
                  </span>
                  <h3 className="mb-4 text-2xl font-display font-medium uppercase tracking-tight text-white transition-colors group-hover:text-brand-blue">
                    {service.label}
                  </h3>
                  <p className="mb-8 text-sm font-light leading-relaxed text-zinc-500">
                    {service.copy}
                  </p>
                  <span className="inline-flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.24em] text-white">
                    Learn More
                    <ChevronRight size={14} className="transition-transform group-hover:translate-x-2" />
                  </span>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </section>

        {/* NEXT PROJECT CTA */}
        <Reveal className="pt-32 border-t border-white/5">
          <Link 
            to={p(`/case-studies/${nextSlug}`)}
            className="group block relative p-16 md:p-24 bg-white/[0.02] border border-white/5 overflow-hidden text-center"
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-1000">
              <img src={nextProject.desktopImage} alt="Next project" className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-[2000ms]" />
            </div>
            
            <span className="text-[10px] font-mono text-brand-blue uppercase tracking-[0.4em] font-bold block mb-8 relative z-10">Next Evolution</span>
            <h2 className="text-3xl md:text-6xl font-display font-medium uppercase tracking-tight text-white mb-10 relative z-10 group-hover:text-brand-blue transition-colors">
              {nextProject.title}
            </h2>
            <div className="inline-flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.3em] text-white relative z-10">
              Explore Project <ArrowUpRight size={14} className="group-hover:translate-x-4 transition-transform duration-500" />
            </div>
          </Link>
        </Reveal>
      </div>
    </div>
  );
}

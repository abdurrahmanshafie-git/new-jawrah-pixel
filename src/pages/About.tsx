import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { useRegion } from '@/hooks/useRegion';
import { useRegionalSeo } from '@/hooks/useRegionalSeo';
import { getCanonicalUrl } from '@/lib/seo/pageSeo';
import { SEO } from '@/components/layout/SEO';
import { Reveal, StaggerContainer, StaggerItem } from '@/components/ui/Reveal';
import { 
  Globe, 
  Cpu, 
  ShieldCheck, 
  Zap, 
  Layout, 
  Sparkles, 
  ArrowRight,
  Code,
  Server,
  Plus,
  CheckCircle,
  Linkedin,
  User
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

// FAQ Component for the About page
function FAQItem({ question, answer }: { question: string, answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border border-white/5 bg-white/[0.02] mb-4 overflow-hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-6 md:p-8 flex items-center justify-between text-left hover:bg-white/[0.03] transition-colors group focus:outline-none"
      >
        <h3 className="text-sm sm:text-lg font-display font-medium text-white uppercase tracking-tight group-hover:text-brand-blue transition-colors duration-300">
          {question}
        </h3>
        <Plus className={`w-4 h-4 text-brand-blue transition-transform duration-500 ${isOpen ? 'rotate-45' : ''}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[500px]' : 'max-h-0'}`}>
        <div className="px-6 pb-6 md:px-8 md:pb-8 text-zinc-500 text-sm md:text-base leading-relaxed font-light">
          {answer}
        </div>
      </div>
    </div>
  );
}

export default function About() {
  const { config, p, isInternational, currentRegion } = useRegion();
  const seo = useRegionalSeo('about');

  const faqs = [
    {
      question: "What is Jawrah Pixel?",
      answer: "Jawrah Pixel is a premium digital agency and software development firm specializing in architecting digital monopolies. We build high-performance websites, enterprise e-commerce platforms, secure client portals, and bespoke business automation systems for ambitious brands globally."
    },
    {
      question: "Who founded Jawrah Pixel?",
      answer: "Jawrah Pixel was founded by Abdurrahman Shafie and Co-Founded by Jaweriya Hafeez. Built on a vision of combining luxury aesthetics with modern technology, Jawrah Pixel was created to help ambitious businesses establish strong digital authority through world-class websites, e-commerce platforms, automation systems, and strategic digital infrastructure."
    },
    {
      question: "Where is Jawrah Pixel located?",
      answer: "Jawrah Pixel operates as a global remote-first agency with dedicated operations in Sri Lanka and Pakistan. We serve a worldwide clientele, managing projects seamlessly across different time zones for international brands."
    },
    {
      question: "What services does Jawrah Pixel provide?",
      answer: "Our core services include Custom Website Development, Enterprise E-commerce Solutions (Shopify, Custom React), Business Automation Systems, Client Portals, Admin Dashboards, Branding & Digital Identity, UI/UX Architecture, SEO Optimization, and AI Integration."
    },
    {
      question: "Does Jawrah Pixel work with international clients?",
      answer: "Yes, Jawrah Pixel is built for global scale. We work with international businesses, SaaS startups, luxury brands, and enterprise teams across North America, Europe, the Middle East, and Asia-Pacific, offering USD-based proposals and remote-first collaboration."
    }
  ];

  const technologies = [
    { name: 'React', icon: <Code className="w-9 h-9 md:w-5 md:h-5" /> },
    { name: 'TypeScript', icon: <ShieldCheck className="w-9 h-9 md:w-5 md:h-5" /> },
    { name: 'Next.js', icon: <Zap className="w-9 h-9 md:w-5 md:h-5" /> },
    { name: 'Supabase', icon: <Server className="w-9 h-9 md:w-5 md:h-5" /> },
    { name: 'Vercel', icon: <Globe className="w-9 h-9 md:w-5 md:h-5" /> },
    { name: 'Tailwind CSS', icon: <Layout className="w-9 h-9 md:w-5 md:h-5" /> },
    { name: 'Node.js', icon: <Cpu className="w-9 h-9 md:w-5 md:h-5" /> },
    { name: 'Modern AI', icon: <Sparkles className="w-9 h-9 md:w-5 md:h-5" /> },
  ];

  const regions = [
    {
      name: 'Sri Lanka',
      label: 'SL Operations',
      desc: 'Focused on luxury retail, tourism, and corporate transformation with Sri Lanka-specific expertise.'
    },
    {
      name: 'Pakistan',
      label: 'PK Operations',
      desc: 'Engineering high-performance commerce and technical systems for the growing digital economy.'
    },
    {
      name: 'International',
      label: 'Global Network',
      desc: 'Serving ambitious brands in North America, Europe, and the Middle East with remote-first excellence.'
    }
  ];

  return (
    <div className="bg-brand-black min-h-screen overflow-hidden">
      <SEO 
        title={seo.title}
        description={seo.description}
        canonicalUrl={getCanonicalUrl(seo.path)}
        keywords={['about Jawrah Pixel', `${seo.title}`, 'premium digital agency', 'web design agency Sri Lanka Pakistan international']}
        region={currentRegion}
      />

      {/* Atmospheric Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 premium-grid-overlay opacity-20 pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full">
          <div className="absolute top-[10%] right-[10%] cinematic-light animate-pulse-slow opacity-30" />
          <div className="absolute bottom-[20%] left-[10%] cinematic-light animate-glow opacity-20" style={{ background: 'radial-gradient(circle at center, rgba(6, 182, 212, 0.1), transparent 70%)' }} />
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 md:pt-48 md:pb-32 flex items-center min-h-[80svh]">
        <div className="container mx-auto px-5 sm:px-6 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <Reveal>
              <div className="inline-flex items-center gap-3 mb-8 md:mb-10 px-6 py-2 border border-white/5 rounded-none bg-white/[0.03] text-brand-blue text-[10px] font-mono uppercase tracking-[0.4em]">
                <span className="w-2 h-2 rounded-full bg-brand-blue animate-pulse" />
                The Agency Identity
              </div>
            </Reveal>

            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl md:text-7xl lg:text-8xl font-display font-medium text-white tracking-tight leading-[1.1] mb-10 uppercase overflow-visible"
            >
              Architecting <br /> <span className="premium-text-gradient italic inline-block px-2 py-1 overflow-visible">Digital Authority</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-[15px] md:text-xl text-zinc-500 max-w-2xl mx-auto mb-10 md:mb-16 leading-relaxed font-light"
            >
              Jawrah Pixel is a world-class digital agency engineering premium digital ecosystems for brands that demand excellence. We bridge the gap between technical complexity and luxury brand perception.
            </motion.p>

            <Reveal delay={0.4}>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 justify-center">
                <Link to={p('/contact')}>
                  <Button size="lg" className="w-full sm:min-w-[240px]">
                    Initiate Project
                  </Button>
                </Link>
                <Link to={p('/services')}>
                  <Button variant="outline" size="lg" className="w-full sm:min-w-[240px]">
                    Explore Services
                  </Button>
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* The Core Mission */}
      <section className="py-20 md:py-32 relative bg-brand-black overflow-hidden border-t border-white/5">
        <div className="container mx-auto px-5 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-20 items-start">
            <Reveal>
              <span className="text-[10px] font-mono text-brand-blue uppercase tracking-[0.4em] font-bold block mb-6">Our DNA</span>
              <h2 className="text-4xl md:text-6xl font-display font-medium uppercase tracking-tight leading-[1.1] mb-8 overflow-visible">
                Beyond <br /> <span className="premium-text-gradient italic inline-block px-2 py-1 overflow-visible">Development</span>
              </h2>
              <p className="text-lg text-zinc-500 font-light leading-relaxed mb-12">
                We don't just build websites. We architect digital monopolies. Our process combines deep technical engineering with cinematic design thinking to create assets that command attention and drive revenue.
              </p>
              <div className="space-y-6">
                {[
                  'Elite Technical Architecture',
                  'Luxury Visual Identity',
                  'Strategic Conversion Systems',
                  'Performance-First Engineering'
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <CheckCircle className="w-5 h-5 text-brand-blue shrink-0" />
                    <span className="text-sm text-zinc-400 font-light uppercase tracking-widest">{item}</span>
                  </div>
                ))}
              </div>
            </Reveal>

            <div className="grid grid-cols-2 gap-4 sm:gap-6 md:gap-8">
              {technologies.map((tech, idx) => (
                <Reveal key={tech.name} delay={idx * 0.05}>
                  <div className="h-full p-6 sm:p-8 bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all duration-500 group flex flex-col">
                    <div className="mb-5 md:mb-6 text-brand-blue group-hover:scale-110 transition-transform duration-500">
                      {tech.icon}
                    </div>
                    <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-500 group-hover:text-white transition-colors">
                      {tech.name}
                    </h3>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Regional Operations */}
      <section className="py-20 md:py-32 relative bg-brand-black border-t border-white/5">
        <div className="container mx-auto px-5 sm:px-6 relative z-10">
          <Reveal className="text-center mb-16 md:mb-24">
            <span className="text-[10px] font-mono text-brand-blue uppercase tracking-[0.4em] font-bold block mb-6">Global Network</span>
            <h2 className="text-4xl md:text-6xl font-display font-medium uppercase tracking-tight text-white mb-8">Regional Presence</h2>
          </Reveal>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
            {regions.map((region, idx) => (
              <StaggerItem key={idx} className="group p-8 md:p-12 bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all duration-700 h-full">
                <span className="text-[10px] font-mono text-brand-blue uppercase tracking-[0.4em] font-bold block mb-6 md:mb-8">{region.label}</span>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-display font-medium text-white uppercase mb-4 md:mb-6 tracking-tight group-hover:text-brand-blue transition-colors">{region.name}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed font-light group-hover:text-zinc-300 transition-colors duration-500">{region.desc}</p>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-20 md:py-32 relative bg-brand-black border-t border-white/5">
        <div className="container mx-auto px-5 sm:px-6 relative z-10">
          <Reveal className="text-center mb-16 md:mb-24">
            <span className="text-[10px] font-mono text-brand-blue uppercase tracking-[0.4em] font-bold block mb-6">Leadership</span>
            <h2 className="text-4xl md:text-6xl font-display font-medium uppercase tracking-tight text-white mb-8">Meet Our Founder</h2>
          </Reveal>

          <Reveal>
            <div className="max-w-4xl mx-auto bg-white/[0.02] border border-white/5 p-8 md:p-16 lg:p-20 relative overflow-hidden">
              {/* Atmospheric background */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-brand-blue/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-cyan/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16 items-center relative z-10">
                {/* Avatar */}
                <div className="lg:col-span-4 flex flex-col items-center">
                  <div className="w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-full border border-white/10 bg-white/[0.03] overflow-hidden group hover:bg-white/[0.05] hover:border-brand-blue/30 transition-all duration-700">
                    <img 
                      src="/assets/founder-image.png" 
                      alt="Abdurrahman Shafie" 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="lg:col-span-8">
                  <h3 className="text-2xl md:text-4xl font-display font-medium text-white uppercase tracking-tight mb-4">
                    Abdurrahman Shafie
                  </h3>
                  <p className="text-[11px] font-mono text-brand-blue uppercase tracking-[0.4em] font-bold mb-6 md:mb-8">
                    Founder & Creative Director, JawrahPixel
                  </p>
                  <p className="text-base md:text-lg text-zinc-500 font-light leading-relaxed mb-8 md:mb-10">
                    Full-Stack Developer, SEO Strategist, and Digital Growth Professional focused on building high-performance websites, SEO systems, and scalable digital solutions.
                  </p>

                  <a 
                    href={config.linkedinFounderLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 px-6 py-3 border border-white/5 bg-white/[0.02] text-sm font-mono uppercase tracking-[0.2em] text-white hover:text-brand-blue hover:border-brand-blue/30 hover:bg-brand-blue/5 transition-all duration-700 group"
                    aria-label="Visit Abdurrahman Shafie on LinkedIn"
                  >
                    <Linkedin className="w-4 h-4" />
                    <span>Connect on LinkedIn</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-500" />
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 md:py-32 relative bg-brand-black border-t border-white/5">
        <div className="container mx-auto px-5 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-20">
            <Reveal className="lg:col-span-5 lg:sticky lg:top-32 h-fit">
              <span className="text-[10px] font-mono text-brand-blue uppercase tracking-[0.4em] font-bold block mb-6">Transparency</span>
              <h2 className="text-4xl md:text-6xl font-display font-medium uppercase tracking-tight text-white mb-8">Common Inquiries</h2>
              <p className="text-lg text-zinc-500 font-light leading-relaxed mb-8 md:mb-12">
                Detailed insights into our methodology, operations, and commitment to excellence.
              </p>
              <Link to={p('/contact')}>
                <Button variant="outline" size="lg" className="group">
                  Request Briefing
                  <ArrowRight className="ml-3 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </Reveal>

            <div className="lg:col-span-7">
              {faqs.map((faq, i) => (
                <Reveal key={i} delay={i * 0.05}>
                  <FAQItem question={faq.question} answer={faq.answer} />
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Global CTA */}
      <Reveal className="py-24 md:py-48 border-t border-white/5">
        <div className="container mx-auto px-5 sm:px-6 text-center">
          <div className="relative p-8 md:p-24 bg-white/[0.02] border border-white/5 overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-blue/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
            
            <span className="text-[10px] font-mono text-brand-blue uppercase tracking-[0.4em] font-bold block mb-8 relative z-10">Initialize Partnership</span>
            <h2 className="text-2xl md:text-6xl font-display font-medium tracking-tight text-white max-w-3xl mb-10 uppercase leading-[1.1] relative z-10 mx-auto overflow-visible">
              Ready to build your <span className="premium-text-gradient italic inline-block px-2 py-1 overflow-visible">digital legacy</span>?
            </h2>
            <Link to={p('/contact')} className="relative z-10">
              <Button size="lg" className="min-w-full sm:min-w-[280px]">
                Start Consultation
              </Button>
            </Link>
          </div>
        </div>
      </Reveal>
    </div>
  );
}

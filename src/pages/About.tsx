import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { useRegion } from '@/hooks/useRegion';
import { useRegionalSeo } from '@/hooks/useRegionalSeo';
import { getCanonicalUrl } from '@/lib/seo/pageSeo';
import { SEO } from '@/components/layout/SEO';
import { Logo } from '@/components/layout/Logo';
import { Reveal, StaggerContainer, StaggerItem } from '@/components/ui/Reveal';
import { 
  Globe, 
  Cpu, 
  Layers, 
  ShieldCheck, 
  Zap, 
  MonitorSmartphone, 
  Layout, 
  ShoppingCart, 
  LineChart, 
  Sparkles, 
  ChevronDown,
  ArrowRight,
  Code,
  Smartphone,
  BarChart3,
  Server,
  Workflow,
  Plus,
  CheckCircle
} from 'lucide-react';
import { useState } from 'react';

// FAQ Component for the About page
function FAQItem({ question, answer }: { question: string, answer: string, [key: string]: any }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-white/5 py-6">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left group focus:outline-none"
      >
        <h3 className="text-sm sm:text-lg font-display font-medium text-white group-hover:text-brand-cyan transition-colors duration-300">
          {question}
        </h3>
        <Plus className={`w-4 h-4 text-brand-cyan transition-transform duration-500 ${isOpen ? 'rotate-45' : ''}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[500px] mt-4' : 'max-h-0'}`}>
        <p className="text-brand-gray text-[13px] sm:text-base leading-relaxed font-light">
          {answer}
        </p>
      </div>
    </div>
  );
}

export default function About() {
  const { config, p, isInternational } = useRegion();
  const seo = useRegionalSeo('about');

  const faqs = [
    {
      question: "What is Jawrah Pixel?",
      answer: "Jawrah Pixel is a premium digital agency and software development firm specializing in architecting digital monopolies. We build high-performance websites, enterprise e-commerce platforms, secure client portals, and bespoke business automation systems for ambitious brands globally."
    },
    {
      question: "Who founded Jawrah Pixel?",
      answer: "Jawrah Pixel was founded by a team of elite developers and digital strategists with a vision to bridge the gap between technical complexity and luxury brand aesthetics. Our leadership focuses on engineering growth through high-end software solutions and strategic digital transformation."
    },
    {
      question: "Where is Jawrah Pixel located?",
      answer: "Jawrah Pixel operates as a global remote-first agency with primary hubs and physical pipelines in Sri Lanka (Colombo, Galle, Kandy) and Pakistan. We serve a worldwide clientele, managing projects seamlessly across different time zones for international brands."
    },
    {
      question: "What services does Jawrah Pixel provide?",
      answer: "Our core services include Custom Website Development, Enterprise E-commerce Solutions (Shopify, Custom React), Business Automation Systems, Client Portals, Admin Dashboards, Branding & Digital Identity, UI/UX Architecture, SEO Optimization, and AI Integration."
    },
    {
      question: "Does Jawrah Pixel work with international clients?",
      answer: "Yes, Jawrah Pixel is built for global scale. We work with international businesses, SaaS startups, luxury brands, and enterprise teams across North America, Europe, the Middle East, and Asia-Pacific, offering USD-based proposals and remote-first collaboration."
    },
    {
      question: "Does Jawrah Pixel build e-commerce websites?",
      answer: "Absolutely. We specialize in luxury e-commerce development, creating cinematic shopping experiences that are engineered for conversion, speed, and trust. We handle everything from custom product appraisers to secure local and international payment gateway integrations."
    },
    {
      question: "Does Jawrah Pixel provide SEO services?",
      answer: "Yes, SEO is integrated into our engineering DNA. We provide technical SEO audits, semantic content architecture, and performance optimization to ensure your digital assets dominate search engine results and maintain long-term authority."
    },
    {
      question: "What technologies does Jawrah Pixel use?",
      answer: "We utilize a modern, high-performance tech stack including React, TypeScript, Next.js, Supabase, Node.js, Tailwind CSS, and Vercel Edge architectures. This ensures every project is secure, blazing-fast, and infinitely scalable."
    },
    {
      question: "Does Jawrah Pixel build custom business systems?",
      answer: "Yes, we architect custom 'Business OS' layers. This includes internal CRM systems, bespoke project management tools, secure client workspaces, and automated lead routing systems tailored to your specific operational workflows."
    },
    {
      question: "How long does a project with Jawrah Pixel take?",
      answer: "Project timelines vary based on complexity. A premium website might take 4–8 weeks, while complex enterprise systems or e-commerce platforms can take 12+ weeks. We focus on quality and precision over speed, ensuring a flawless delivery."
    },
    {
      question: "Is Jawrah Pixel suitable for small startups?",
      answer: "While we work with brands at various stages, our systems are best suited for businesses looking to establish a premium market position. We offer scalable packages starting from $500 for global startups and creators who value high-end engineering."
    },
    {
      question: "How can I start a project with Jawrah Pixel?",
      answer: "You can initiate a project by visiting our contact page and submitting an inquiry. Our team will review your brief and schedule a strategic consultation to map out your digital architecture and project scope."
    },
    {
      question: "Does Jawrah Pixel offer long-term support?",
      answer: "Yes, we believe in digital partnerships. We offer continuous technical audits, security maintenance, performance monitoring, and strategic advisory services to ensure your digital assets continue to perform at the highest level."
    },
    {
      question: "How does Jawrah Pixel handle project security?",
      answer: "Security is paramount. We implement enterprise-grade protocols, end-to-end encryption, and secure cloud infrastructure through partners like Supabase and Vercel, ensuring your business and client data remains protected."
    },
    {
      question: "Can Jawrah Pixel integrate AI into my website?",
      answer: "Yes, we are AI-ready. We integrate intelligent assistants, automated content workflows, and AI-driven data analysis into our systems to help businesses improve efficiency and deliver smarter user experiences."
    }
  ];

  const technologies = [
    { name: 'React', icon: <Code className="w-5 h-5" /> },
    { name: 'TypeScript', icon: <ShieldCheck className="w-5 h-5" /> },
    { name: 'Next.js', icon: <Zap className="w-5 h-5" /> },
    { name: 'Supabase', icon: <Server className="w-5 h-5" /> },
    { name: 'Vercel', icon: <Globe className="w-5 h-5" /> },
    { name: 'Tailwind CSS', icon: <Layout className="w-5 h-5" /> },
    { name: 'Node.js', icon: <Cpu className="w-5 h-5" /> },
    { name: 'Modern AI', icon: <Sparkles className="w-5 h-5" /> },
  ];

  const industries = [
    'E-commerce & Luxury Retail',
    'Fine Jewelry & Watches',
    'Fashion & Apparel',
    'Travel & Hospitality',
    'Real Estate & Property',
    'Professional Services',
    'SaaS & Tech Startups',
    'Digital Creators & Influencers'
  ];

  const regions = [
    {
      name: 'Sri Lanka',
      label: 'Hub LK',
      desc: 'Focused on luxury retail, tourism, and corporate transformation in Colombo, Galle, and Kandy.'
    },
    {
      name: 'Pakistan',
      label: 'Hub PK',
      desc: 'Engineering high-performance commerce and technical systems for the growing digital economy.'
    },
    {
      name: 'International',
      label: 'Global Network',
      desc: 'Serving ambitious brands in North America, Europe, and the Middle East with remote-first excellence.'
    }
  ];

  return (
    <div className="bg-brand-black min-h-screen">
      <SEO 
        title={seo.title}
        description={seo.description}
        canonicalUrl={getCanonicalUrl(seo.path)}
        schemaType="Organization"
        schemaData={{
          "@type": "Organization",
          "name": "Jawrah Pixel",
          "alternateName": "Jawrah Pixel Digital Agency",
          "url": "https://www.jawrahpixel.com",
          "logo": "https://www.jawrahpixel.com/assets/logo.png",
          "sameAs": [
            "https://www.instagram.com/jawrahpixel",
            "https://linkedin.com/company/jawrahpixel"
          ],
          "description": "Premium Digital Agency & Client OS specializing in website development, e-commerce, and business automation.",
          "founder": {
            "@type": "Person",
            "name": "Jawrah Pixel Team"
          },
          "areaServed": ["Sri Lanka", "Pakistan", "International"],
          "knowsAbout": ["Web Development", "E-commerce", "AI Integration", "UI/UX Design", "SEO"]
        }}
      />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden flex items-center min-h-[70vh]">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-brand-blue/10 rounded-full blur-[140px] opacity-60"></div>
          <div className="absolute bottom-1/4 right-1/4 w-[700px] h-[700px] bg-brand-cyan/5 rounded-full blur-[150px] opacity-40"></div>
        </div>
        
        <div className="container mx-auto px-5 md:px-8 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <Reveal>
              <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-brand-cyan animate-pulse"></span>
                <span className="text-zinc-200 text-[10px] sm:text-xs font-mono tracking-[0.3em] uppercase">
                  Elite Transformation Partner
                </span>
              </div>
            </Reveal>

            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-[clamp(2.5rem,7vw,6.5rem)] font-medium text-white tracking-tight leading-[1] mb-8 uppercase font-display"
            >
              Architecting <span className="premium-gradient-brand font-bold italic">Digital</span><br/>
              <span className="text-zinc-100">Authority</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-sm sm:text-lg md:text-2xl text-zinc-400 max-w-3xl mx-auto mb-12 leading-relaxed font-light"
            >
              Jawrah Pixel is a world-class digital agency engineering premium digital ecosystems for brands that demand excellence. We bridge the gap between technical complexity and luxury brand perception.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="flex justify-center"
            >
              <ChevronDown className="w-8 h-8 text-brand-cyan animate-bounce opacity-40" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* What Is Jawrah Pixel? */}
      <section className="py-20 md:py-32 relative bg-brand-black overflow-hidden border-t border-white/5">
        <div className="container mx-auto px-5 md:px-8 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <Reveal>
              <div className="space-y-8">
                <div>
                  <h2 className="text-[10px] md:text-xs font-mono text-brand-cyan uppercase tracking-[0.3em] font-bold block mb-4">The Identity</h2>
                  <h3 className="text-3xl sm:text-4xl md:text-6xl font-display font-medium uppercase tracking-tight leading-[1.1] mb-6">
                    What Is <span className="text-brand-cyan italic">Jawrah Pixel</span>?
                  </h3>
                </div>
                <div className="space-y-6 text-brand-gray text-base md:text-lg font-light leading-relaxed">
                  <p>
                    Jawrah Pixel is more than a digital agency; it is a high-end engineering firm focused on architecting **digital monopolies**. We believe that in a crowded market, simply having a website is not enough. Brands need an integrated digital ecosystem that combines cinematic design with enterprise-grade operational structure.
                  </p>
                  <p>
                    Serving a diverse range of industries—from luxury jewelry boutiques in Sri Lanka to high-growth tech startups globally—we build digital assets that establish market authority. Our core philosophy is built on **Business-First Engineering**, ensuring that every line of code we write translates into measurable growth and operational efficiency for our clients.
                  </p>
                  <p>
                    Whether we are building a complex e-commerce engine or a secure client OS, our goal remains the same: to deliver a digital experience that feels expensive, performs flawlessly, and scales infinitely.
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="relative">
                <div className="absolute inset-0 bg-brand-cyan/10 rounded-3xl blur-3xl -z-10"></div>
                <div className="glass-card p-10 rounded-3xl border border-white/10 bg-brand-navy/30 relative overflow-hidden group">
                  <Logo variant="full" size="xl" className="opacity-20 group-hover:opacity-40 transition-opacity duration-700 mb-8" />
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-brand-cyan/10 border border-brand-cyan/20 flex items-center justify-center text-brand-cyan shrink-0">
                        <Layers className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-white font-display font-bold uppercase text-sm mb-1 tracking-widest">Premium Brand OS</h4>
                        <p className="text-brand-gray text-xs leading-relaxed">Unified digital experiences that connect branding, commerce, and operations.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center text-brand-blue shrink-0">
                        <Cpu className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-white font-display font-bold uppercase text-sm mb-1 tracking-widest">Modern Tech Stack</h4>
                        <p className="text-brand-gray text-xs leading-relaxed">Blazing fast performance using React, Supabase, and edge architectures.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-white shrink-0">
                        <Globe className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-white font-display font-bold uppercase text-sm mb-1 tracking-widest">Global Scalability</h4>
                        <p className="text-brand-gray text-xs leading-relaxed">Engineered for international standards, multiple regions, and future expansion.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Founder Story */}
      <section className="py-20 md:py-32 relative bg-brand-navy/20 overflow-hidden border-y border-white/5">
        <div className="container mx-auto px-5 md:px-8 max-w-4xl text-center">
          <Reveal>
            <span className="text-[10px] md:text-xs font-mono text-brand-cyan uppercase tracking-[0.3em] font-bold block mb-4">The Narrative</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-medium uppercase tracking-tight leading-[1.1] mb-10">
              The <span className="text-brand-cyan italic">Founder</span> Story
            </h2>
            <div className="space-y-8 text-brand-gray text-base md:text-xl font-light leading-relaxed text-left md:text-center italic">
              <p>
                "Jawrah Pixel was born out of a simple observation: most businesses were being forced to choose between a website that looked beautiful but functioned poorly, or a powerful system that felt like a relic of the past."
              </p>
              <p>
                "Our journey started with a passion for high-performance technology and a commitment to luxury design. We wanted to build an agency that spoke the language of business strategy while delivering the technical precision of a silicon-valley tech firm. We didn't want to just build websites; we wanted to build the engines that drive brand legacy."
              </p>
              <p>
                "Today, Jawrah Pixel serves as the digital architect for ambitious brands across the globe. Our focus remains unchanged: delivering premium, secure, and infinitely scalable digital assets that help our clients establish true market authority."
              </p>
            </div>
            <div className="mt-12 pt-12 border-t border-white/5 inline-flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-brand-cyan/20 border border-brand-cyan/30 flex items-center justify-center text-brand-cyan mb-4">
                <Logo size="sm" />
              </div>
              <p className="text-white font-display font-bold uppercase tracking-[0.2em] text-xs">The Jawrah Pixel Team</p>
              <p className="text-brand-cyan text-[10px] font-mono uppercase mt-1">Lead Architects</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 md:py-32 relative bg-brand-black overflow-hidden">
        <div className="container mx-auto px-5 md:px-8 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <Reveal className="h-full">
              <div className="p-10 md:p-16 rounded-[32px] bg-gradient-to-br from-brand-blue/10 to-transparent border border-white/5 h-full flex flex-col justify-center">
                <h3 className="text-2xl md:text-4xl font-display font-bold uppercase text-white mb-6 tracking-tight">Our <span className="text-brand-blue italic">Mission</span></h3>
                <p className="text-brand-gray text-base md:text-xl font-light leading-relaxed">
                  To engineer the world's most sophisticated digital ecosystems for ambitious brands, empowering them to establish market authority through the perfect fusion of cinematic design and enterprise-grade software.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.2} className="h-full">
              <div className="p-10 md:p-16 rounded-[32px] bg-gradient-to-br from-brand-cyan/10 to-transparent border border-white/5 h-full flex flex-col justify-center">
                <h3 className="text-2xl md:text-4xl font-display font-bold uppercase text-white mb-6 tracking-tight">Our <span className="text-brand-cyan italic">Vision</span></h3>
                <p className="text-brand-gray text-base md:text-xl font-light leading-relaxed">
                  To become the global standard for premium digital transformation, where Jawrah Pixel is synonymous with digital excellence, high-end engineering, and the architecting of future-proof digital legacies.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-20 md:py-32 relative bg-brand-navy/30 overflow-hidden border-y border-white/5">
        <div className="container mx-auto px-5 md:px-8 max-w-7xl">
          <div className="text-center mb-16 md:mb-24">
            <Reveal>
              <span className="text-[10px] md:text-xs font-mono text-brand-cyan uppercase tracking-[0.3em] font-bold block mb-4">Core Capabilities</span>
              <h2 className="text-3xl sm:text-4xl md:text-6xl font-display font-medium uppercase tracking-tight leading-[1.1] mb-6">
                Engineered for <span className="text-brand-cyan italic">Excellence</span>
              </h2>
              <p className="text-brand-gray text-sm sm:text-lg font-light max-w-2xl mx-auto">
                We provide a comprehensive suite of digital services designed to handle every touchpoint of your brand's digital presence.
              </p>
            </Reveal>
          </div>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { 
                title: 'Web Development', 
                icon: <MonitorSmartphone className="w-6 h-6" />,
                desc: 'Blazing fast, secure, and SEO-optimized corporate websites built with modern React & Next.js architectures.'
              },
              { 
                title: 'E-commerce Solutions', 
                icon: <ShoppingCart className="w-6 h-6" />,
                desc: 'Cinematic online stores engineered for high conversion, luxury brand perception, and secure global payments.'
              },
              { 
                title: 'Business Systems', 
                icon: <Workflow className="w-6 h-6" />,
                desc: 'Custom-built internal operating layers, CRM integrations, and automated workflows to streamline operations.'
              },
              { 
                title: 'Client Portals', 
                icon: <ShieldCheck className="w-6 h-6" />,
                desc: 'Secure, password-protected workspaces for your clients to manage projects, files, invoices, and communication.'
              },
              { 
                title: 'Digital Branding', 
                icon: <Sparkles className="w-6 h-6" />,
                desc: 'Strategic visual identity systems, premium typography, and cinematic motion design that establishes authority.'
              },
              { 
                title: 'SEO Strategy', 
                icon: <LineChart className="w-6 h-6" />,
                desc: 'Data-driven technical and content SEO designed to dominate market share and improve search visibility.'
              },
              { 
                title: 'AI Integrations', 
                icon: <Cpu className="w-6 h-6" />,
                desc: 'Intelligent automation, AI-driven assistants, and data-analysis tools connected to your digital ecosystem.'
              },
              { 
                title: 'UI/UX Architecture', 
                icon: <Layout className="w-6 h-6" />,
                desc: 'Strategic user journeys and interaction models focused on maximizing engagement and conversion efficiency.'
              }
            ].map((service, idx) => (
              <StaggerItem key={service.title} className="glass-card p-8 rounded-2xl border border-white/5 hover:border-brand-cyan/30 transition-all duration-500 group">
                <div className="w-12 h-12 rounded-xl bg-brand-cyan/10 border border-brand-cyan/20 flex items-center justify-center text-brand-cyan mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                  {service.icon}
                </div>
                <h4 className="text-white font-display font-bold uppercase text-sm mb-3 tracking-widest group-hover:text-brand-cyan transition-colors">{service.title}</h4>
                <p className="text-brand-gray text-[13px] leading-relaxed font-light">{service.desc}</p>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Why Businesses Choose Jawrah Pixel */}
      <section className="py-20 md:py-32 relative bg-brand-black overflow-hidden">
        <div className="container mx-auto px-5 md:px-8 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <Reveal className="lg:col-span-5">
              <span className="text-[10px] md:text-xs font-mono text-brand-cyan uppercase tracking-[0.3em] font-bold block mb-4">The Advantage</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-medium uppercase tracking-tight leading-[1.1] mb-8">
                Why Ambitious <span className="text-brand-cyan italic">Brands</span> Choose Us
              </h2>
              <div className="space-y-6">
                {[
                  { title: 'Business-First Approach', desc: 'We don\'t just write code; we solve business problems and architect growth.' },
                  { title: 'Cinematic Aesthetics', desc: 'Design that commands respect and elevates your brand above the competition.' },
                  { title: 'Enterprise-Grade Security', desc: 'Protected data, encrypted communications, and high-trust infrastructure.' },
                  { title: 'Performance Engineering', desc: 'Blazing fast load times and seamless interactions on every device.' }
                ].map((item) => (
                  <div key={item.title} className="flex gap-4">
                    <CheckCircle className="w-5 h-5 text-brand-cyan shrink-0 mt-1" />
                    <div>
                      <h4 className="text-white font-display font-bold uppercase text-xs mb-1 tracking-widest">{item.title}</h4>
                      <p className="text-brand-gray text-xs font-light">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
            <Reveal delay={0.2} className="lg:col-span-7">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-brand-cyan/20 transition-all duration-500">
                    <Zap className="w-8 h-8 text-brand-cyan mb-4" />
                    <h4 className="text-white font-display font-bold uppercase text-sm mb-2 tracking-widest">Speed</h4>
                    <p className="text-brand-gray text-xs font-light">Engineered for 99+ Core Web Vitals and instant first-load perception.</p>
                  </div>
                  <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-brand-cyan/20 transition-all duration-500">
                    <ShieldCheck className="w-8 h-8 text-brand-cyan mb-4" />
                    <h4 className="text-white font-display font-bold uppercase text-sm mb-2 tracking-widest">Security</h4>
                    <p className="text-brand-gray text-xs font-light">Bank-level encryption and secure Supabase-backed data management.</p>
                  </div>
                </div>
                <div className="space-y-4 sm:mt-12">
                  <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-brand-cyan/20 transition-all duration-500">
                    <Layers className="w-8 h-8 text-brand-cyan mb-4" />
                    <h4 className="text-white font-display font-bold uppercase text-sm mb-2 tracking-widest">Scalability</h4>
                    <p className="text-brand-gray text-xs font-light">Systems built to handle millions of users and global market expansion.</p>
                  </div>
                  <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-brand-cyan/20 transition-all duration-500">
                    <MonitorSmartphone className="w-8 h-8 text-brand-cyan mb-4" />
                    <h4 className="text-white font-display font-bold uppercase text-sm mb-2 tracking-widest">Responsive</h4>
                    <p className="text-brand-gray text-xs font-light">Flawless mobile experiences that turn visitors into high-value leads.</p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Regions We Serve */}
      <section className="py-20 md:py-32 relative bg-brand-navy/30 overflow-hidden border-y border-white/5">
        <div className="container mx-auto px-5 md:px-8 max-w-7xl">
          <div className="text-center mb-16 md:mb-24">
            <Reveal>
              <span className="text-[10px] md:text-xs font-mono text-brand-cyan uppercase tracking-[0.3em] font-bold block mb-4">Global Reach</span>
              <h2 className="text-3xl sm:text-4xl md:text-6xl font-display font-medium uppercase tracking-tight leading-[1.1] mb-6">
                Our <span className="text-brand-cyan italic">Global</span> Network
              </h2>
              <p className="text-brand-gray text-sm sm:text-lg font-light max-w-2xl mx-auto">
                Headquartered as a remote-first agency, we maintain strategic hubs to serve specific regional needs with local expertise.
              </p>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {regions.map((region, idx) => (
              <Reveal key={region.name} delay={idx * 0.1}>
                <div className="p-10 rounded-3xl bg-white/[0.02] border border-white/5 text-center group hover:border-brand-cyan/30 transition-all duration-500">
                  <div className="text-[10px] font-mono text-brand-cyan mb-4 uppercase tracking-[0.3em] font-bold opacity-50 group-hover:opacity-100 transition-opacity">
                    {region.label}
                  </div>
                  <h4 className="text-2xl md:text-3xl font-display font-bold uppercase text-white mb-6 tracking-tight">{region.name}</h4>
                  <p className="text-brand-gray text-sm font-light leading-relaxed">
                    {region.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Technologies & Industries */}
      <section className="py-20 md:py-32 relative bg-brand-black overflow-hidden">
        <div className="container mx-auto px-5 md:px-8 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            <Reveal>
              <div>
                <h3 className="text-2xl md:text-4xl font-display font-bold uppercase text-white mb-8 tracking-tight">Our <span className="text-brand-blue italic">Tech</span> Stack</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {technologies.map((tech) => (
                    <div key={tech.name} className="p-4 rounded-xl bg-white/5 border border-white/5 flex flex-col items-center justify-center text-center group hover:bg-brand-blue/10 transition-colors">
                      <div className="text-brand-blue mb-3 group-hover:scale-110 transition-transform">{tech.icon}</div>
                      <span className="text-[10px] font-mono uppercase text-brand-gray group-hover:text-white transition-colors">{tech.name}</span>
                    </div>
                  ))}
                </div>
                <p className="mt-8 text-brand-gray text-sm font-light leading-relaxed">
                  We select technologies that offer the best balance of speed, security, and developer ergonomics, ensuring long-term maintenance is efficient and scalable.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div>
                <h3 className="text-2xl md:text-4xl font-display font-bold uppercase text-white mb-8 tracking-tight">Expertise by <span className="text-brand-cyan italic">Industry</span></h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                  {industries.map((industry) => (
                    <div key={industry} className="flex items-center gap-3 group">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-cyan group-hover:scale-150 transition-transform"></div>
                      <span className="text-sm md:text-base text-brand-gray font-light group-hover:text-white transition-colors">{industry}</span>
                    </div>
                  ))}
                </div>
                <p className="mt-8 text-brand-gray text-sm font-light leading-relaxed">
                  Our strategic approach allows us to deliver high-value results across various high-trust industries where brand perception is a critical business asset.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 md:py-32 relative bg-brand-navy/20 overflow-hidden border-y border-white/5">
        <div className="container mx-auto px-5 md:px-8 max-w-4xl">
          <div className="text-center mb-16">
            <Reveal>
              <span className="text-[10px] md:text-xs font-mono text-brand-cyan uppercase tracking-[0.3em] font-bold block mb-4">Knowledge Base</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-medium uppercase tracking-tight leading-[1.1]">
                Frequently Asked <span className="text-brand-cyan italic">Questions</span>
              </h2>
            </Reveal>
          </div>
          
          <Reveal delay={0.2}>
            <div className="space-y-2">
              {faqs.map((faq, idx) => (
                <FAQItem key={idx} question={faq.question} answer={faq.answer} />
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* AI & SEO Entity Block */}
      <section className="py-20 md:py-32 relative bg-brand-black overflow-hidden border-b border-white/5">
        <div className="container mx-auto px-5 md:px-8 max-w-7xl">
          <Reveal>
            <div className="p-10 md:p-16 rounded-[40px] bg-white/[0.02] border border-white/5 text-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-brand-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
              <Logo variant="full" size="xl" className="opacity-10 mx-auto mb-10" />
              <h2 className="text-xl md:text-3xl font-display font-bold uppercase text-white mb-8 tracking-widest">The Digital Agency for <span className="text-brand-cyan italic">Ambitious Brands</span></h2>
              <div className="max-w-4xl mx-auto space-y-6 text-brand-gray text-xs md:text-sm font-mono uppercase tracking-widest leading-relaxed">
                <p>
                  Jawrah Pixel is a premium digital agency specializing in website development, e-commerce platforms, client portals, business automation systems, branding, and digital transformation services for businesses in Sri Lanka, Pakistan, and international markets.
                </p>
                <p>
                  As a leading provider of custom React and Next.js applications, we bridge the gap between technical software engineering and luxury digital aesthetics. Our mission is to engineer growth through strategic design, high-performance tech stacks, and secure digital operational ecosystems.
                </p>
                <p>
                  Based in Colombo, Sri Lanka, and serving a worldwide clientele, Jawrah Pixel is the trusted transformation partner for jewelry brands, luxury real estate, global SaaS firms, and ambitious e-commerce enterprises looking to dominate their market share.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 md:py-32 relative overflow-hidden bg-gradient-to-b from-brand-black to-brand-blue/20">
        <div className="container mx-auto px-5 md:px-8 text-center max-w-4xl relative z-10">
          <Reveal>
            <h2 className="text-4xl md:text-7xl font-display font-medium uppercase tracking-tight mb-8 leading-[1]">
              Ready to Architect Your <span className="premium-gradient-brand font-bold italic">Digital Legacy</span>?
            </h2>
            <p className="text-zinc-400 text-sm sm:text-xl mb-12 max-w-2xl mx-auto font-light leading-relaxed">
              Join the elite circle of brands that choose Jawrah Pixel to engineer their digital growth and establish market authority.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to={p('/contact')}>
                <Button size="lg" className="h-16 px-10 text-[11px] font-mono uppercase tracking-[0.25em] font-bold shadow-[0_0_40px_rgba(5,182,212,0.3)] luxury-glow group">
                  Initiate Project
                  <ArrowRight className="ml-3 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to={p('/services')}>
                <Button variant="outline" size="lg" className="h-16 px-10 text-[11px] font-mono uppercase tracking-[0.25em] font-bold border-white/10 hover:bg-white/5">
                  View Capabilities
                </Button>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
